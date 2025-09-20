const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname || '.');

const DEFAULT_ALLOWED = ['www.adxs.org', 'adxs.org'];
const allowedHosts = new Set(
  (process.env.ALLOWED_HOSTS || DEFAULT_ALLOWED.join(','))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);

app.use((req, res, next) => {
  res.setHeader('X-Proxy-By', 'adxs-local-helper');
  next();
});

app.get('/api/fetch', async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: 'Missing url query parameter.' });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL provided.', details: error.message });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only HTTP(S) protocols are supported.' });
  }

  if (allowedHosts.size > 0 && !allowedHosts.has(parsed.hostname)) {
    return res.status(403).json({ error: 'Host not permitted by proxy.', host: parsed.hostname });
  }

  try {
    console.log(`[proxy] ${parsed.toString()}`);
    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'adxs-scraper/1.0 (+local proxy)'
      }
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader('Cache-Control', 'no-store');
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    res.send(text);
  } catch (error) {
    console.error('[proxy] error', error);
    res.status(502).json({ error: 'Proxy request failed.', details: error.message });
  }
});

const DEFAULT_SITEMAP_PATH = '/en/sitemap';

app.get('/api/sitemap', async (req, res) => {
  const baseOverride = (req.query.base || 'https://www.adxs.org').toString();
  let baseUrl;
  try {
    baseUrl = new URL(baseOverride);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid base URL provided.', details: error.message });
  }

  baseUrl.hash = '';
  const targetUrl = new URL(DEFAULT_SITEMAP_PATH, baseUrl);

  if (allowedHosts.size > 0 && !allowedHosts.has(targetUrl.hostname)) {
    return res.status(403).json({
      error: 'Host not permitted by proxy.',
      host: targetUrl.hostname
    });
  }

  try {
    console.log(`[sitemap] ${targetUrl.toString()}`);
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'adxs-scraper/1.0 (+local proxy)'
      }
    });

    const body = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Sitemap fetch failed.',
        status: response.status,
        statusText: response.statusText,
        url: targetUrl.toString()
      });
    }

    res.status(200);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      url: targetUrl.toString(),
      base: `${baseUrl.protocol}//${baseUrl.host}`,
      html: body,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[sitemap] error', error);
    res.status(502).json({ error: 'Sitemap request failed.', details: error.message });
  }
});

app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`ADXS helper server running on http://localhost:${PORT}`);
  console.log(`Allowed hosts: ${Array.from(allowedHosts).join(', ') || 'none'}`);
});
