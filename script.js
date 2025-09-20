(() => {
  const state = {
    mode: 'single',
    baseUrl: 'https://www.adxs.org',
    options: {
      citations: true,
      tooltips: true,
      footnotes: true
    },
    queue: [],
    isRunning: false,
    isPaused: false,
    processed: 0,
    total: 0,
    results: [],
    logs: []
  };

  const elements = {};

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    attachEventListeners();
    updateProgress();
    updateExports();
    renderPreview();
    renderStats();
    renderValidation();
    renderLogs();
  });

  function cacheElements() {
    elements.baseUrl = document.getElementById('baseUrl');
    elements.paths = document.getElementById('paths');
    elements.modeButtons = Array.from(document.querySelectorAll('.mode-button'));
    elements.startBtn = document.getElementById('startBtn');
    elements.pauseBtn = document.getElementById('pauseBtn');
    elements.stopBtn = document.getElementById('stopBtn');
    elements.includeCitations = document.getElementById('includeCitations');
    elements.includeTooltips = document.getElementById('includeTooltips');
    elements.includeFootnotes = document.getElementById('includeFootnotes');
    elements.progressBar = document.getElementById('progressBar');
    elements.progressText = document.getElementById('progressText');
    elements.batchCounter = document.getElementById('batchCounter');
    elements.previewEmpty = document.getElementById('previewEmpty');
    elements.previewContent = document.getElementById('previewContent');
    elements.statPages = document.getElementById('statPages');
    elements.statSections = document.getElementById('statSections');
    elements.statCitations = document.getElementById('statCitations');
    elements.statTooltips = document.getElementById('statTooltips');
    elements.statFootnotes = document.getElementById('statFootnotes');
    elements.statWords = document.getElementById('statWords');
    elements.logList = document.getElementById('logList');
    elements.statusPill = document.getElementById('statusPill');
    elements.tabButtons = Array.from(document.querySelectorAll('.tab'));
    elements.tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
    elements.exportButtons = Array.from(document.querySelectorAll('.export[data-export]'));
    elements.validationStatus = document.getElementById('validationStatus');
    elements.validationPassCount = document.getElementById('validationPassCount');
    elements.validationWarnCount = document.getElementById('validationWarnCount');
    elements.validationErrorCount = document.getElementById('validationErrorCount');
    elements.validationEmpty = document.getElementById('validationEmpty');
    elements.validationList = document.getElementById('validationList');
    elements.copyClipboard = document.getElementById('copyClipboard');
  }

  function attachEventListeners() {
    elements.modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
      });
    });

    elements.includeCitations.addEventListener('change', () => {
      state.options.citations = elements.includeCitations.checked;
      log(`Inline citation capture ${state.options.citations ? 'enabled' : 'disabled'}.`);
    });

    elements.includeTooltips.addEventListener('change', () => {
      state.options.tooltips = elements.includeTooltips.checked;
      log(`Tooltip capture ${state.options.tooltips ? 'enabled' : 'disabled'}.`);
    });

    elements.includeFootnotes.addEventListener('change', () => {
      state.options.footnotes = elements.includeFootnotes.checked;
      log(`Footnote capture ${state.options.footnotes ? 'enabled' : 'disabled'}.`);
    });

    elements.startBtn.addEventListener('click', startScrape);
    elements.pauseBtn.addEventListener('click', togglePause);
    elements.stopBtn.addEventListener('click', stopScrape);

    elements.tabButtons.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    elements.exportButtons.forEach((btn) => {
      btn.addEventListener('click', () => handleExport(btn.dataset.export));
    });

    elements.copyClipboard.addEventListener('click', copySummaryToClipboard);
  }

  function setMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    elements.modeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    log(`Switched to ${modeLabel(mode)} mode.`);
  }

  function modeLabel(mode) {
    switch (mode) {
      case 'batch':
        return 'batch';
      case 'section':
        return 'section crawl';
      default:
        return 'single page';
    }
  }

  function startScrape() {
    if (state.isRunning) {
      log('A session is already running. Stop it before starting a new one.', 'warning');
      return;
    }

    state.baseUrl = (elements.baseUrl.value || 'https://www.adxs.org').trim().replace(/\/$/, '');
    const rawPaths = elements.paths.value
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (rawPaths.length === 0) {
      rawPaths.push('');
    }

    let queue;
    if (state.mode === 'single') {
      queue = [buildUrl(rawPaths[0])];
      if (rawPaths.length > 1) {
        log('Single page mode only scrapes the first path provided. Additional entries were ignored.', 'warning');
      }
    } else {
      queue = rawPaths.map((path) => buildUrl(path));
    }

    state.queue = queue;
    state.total = queue.length;
    state.processed = 0;
    state.results = [];
    state.logs = [];
    state.isRunning = true;
    state.isPaused = false;

    elements.pauseBtn.disabled = false;
    elements.pauseBtn.textContent = 'Pause';
    elements.stopBtn.disabled = false;
    elements.startBtn.disabled = true;

    updateStatus('active', 'Running');
    updateProgress();
    updateExports();
    renderLogs();
    renderPreview();
    renderStats();
    renderValidation();
    log(`Session started in ${modeLabel(state.mode)} mode targeting ${state.total} page${state.total === 1 ? '' : 's'}.`);
    processQueue();
  }

  function buildUrl(path) {
    if (!path) {
      return state.baseUrl;
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const cleanedPath = path.startsWith('/') ? path : `/${path}`;
    return `${state.baseUrl}${cleanedPath}`;
  }

  function togglePause() {
    if (!state.isRunning) return;
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
      elements.pauseBtn.textContent = 'Resume';
      updateStatus('paused', 'Paused');
      log('Scraping paused.');
    } else {
      elements.pauseBtn.textContent = 'Pause';
      updateStatus('active', 'Running');
      log('Scraping resumed.');
      processQueue();
    }
  }

  function stopScrape() {
    if (!state.isRunning) return;
    state.isRunning = false;
    state.isPaused = false;
    state.queue = [];
    elements.startBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.stopBtn.disabled = true;
    elements.pauseBtn.textContent = 'Pause';
    updateStatus('idle', 'Stopped');
    updateProgress();
    log('Session stopped by user.');
  }

  async function processQueue() {
    if (!state.isRunning || state.isPaused) {
      return;
    }

    const nextUrl = state.queue.shift();
    if (!nextUrl) {
      finishSession();
      return;
    }

    updateProgress(nextUrl);

    try {
      log(`Fetching ${nextUrl}`);
      const result = await scrapeUrl(nextUrl);
      state.results.push(result);
      state.processed += 1;
      updateProgress(nextUrl);
      renderPreview();
      renderStats();
      updateExports();
      renderValidation();
      if (result.validation?.summary) {
        const { summary } = result.validation;
        const validationSeverity = summary.status === 'error' ? 'error' : summary.status === 'warning' ? 'warning' : 'success';
        log(
          `Validation for ${result.title}: ${summary.counts?.pass ?? 0} pass, ${summary.counts?.warning ?? 0} warning${
            (summary.counts?.warning ?? 0) === 1 ? '' : 's'
          }, ${summary.counts?.error ?? 0} error${(summary.counts?.error ?? 0) === 1 ? '' : 's'}.`,
          validationSeverity
        );
      }
      log(`Captured ${result.sections.length} section${result.sections.length === 1 ? '' : 's'} from ${result.title}.`, 'success');
    } catch (error) {
      state.processed += 1;
      updateProgress(nextUrl);
      log(`Failed to fetch ${nextUrl}: ${error.message}`, 'error');
    }

    if (state.queue.length > 0) {
      await delay(250);
      processQueue();
    } else {
      finishSession();
    }
  }

  function finishSession() {
    if (!state.isRunning) return;
    state.isRunning = false;
    state.isPaused = false;
    elements.startBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.stopBtn.disabled = true;
    elements.pauseBtn.textContent = 'Pause';
    updateStatus('idle', 'Completed');
    updateProgress();
    renderLogs();
    log('Scraping session completed.');
  }

  async function scrapeUrl(url) {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const main = doc.querySelector('main') || doc.querySelector('article') || doc.body;
    const title = (doc.querySelector('h1') || doc.querySelector('title'))?.textContent?.trim() || url;

    const sections = collectSections(main, title);
    const inlineCitations = state.options.citations ? collectInlineCitations(main) : [];
    const tooltips = state.options.tooltips ? collectTooltips(main) : [];
    const footnotes = state.options.footnotes ? collectFootnotes(doc) : [];
    const validation = validatePage(inlineCitations, tooltips, footnotes, state.options);

    const wordCount = main.textContent
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean).length;

    return {
      url,
      title,
      fetchedAt: new Date().toISOString(),
      sections,
      inlineCitations,
      tooltips,
      footnotes,
      validation,
      stats: {
        sections: sections.length,
        citations: inlineCitations.length,
        tooltips: tooltips.length,
        footnotes: footnotes.length,
        words: wordCount
      },
      rawHtml: main.innerHTML
    };
  }

  function collectSections(root, fallbackTitle) {
    const sections = [];
    const structured = Array.from(root.querySelectorAll('section, article'));

    if (structured.length) {
      structured.forEach((section, index) => {
        sections.push(sectionToRecord(section, index + 1));
      });
    } else {
      const headings = Array.from(root.querySelectorAll('h2, h3, h4'));
      if (headings.length === 0) {
        sections.push({
          id: 'section-1',
          heading: fallbackTitle,
          text: root.textContent.trim(),
          html: root.innerHTML.trim()
        });
      } else {
        headings.forEach((heading, index) => {
          const content = collectFollowingSiblings(heading);
          sections.push({
            id: heading.id || `section-${index + 1}`,
            heading: heading.textContent.trim(),
            text: content.textContent.trim(),
            html: content.innerHTML.trim()
          });
        });
      }
    }

    return sections;
  }

  function sectionToRecord(section, index) {
    const heading = section.querySelector('h2, h3, h4, h5, h6');
    return {
      id: section.id || `section-${index}`,
      heading: heading ? heading.textContent.trim() : `Section ${index}`,
      text: section.textContent.trim(),
      html: section.innerHTML.trim()
    };
  }

  function collectFollowingSiblings(heading) {
    const container = document.createElement('div');
    let sibling = heading.nextElementSibling;
    while (sibling && !/^H[2-4]$/.test(sibling.tagName)) {
      container.appendChild(sibling.cloneNode(true));
      sibling = sibling.nextElementSibling;
    }
    return container;
  }

  function collectInlineCitations(root) {
    const nodes = Array.from(
      root.querySelectorAll('sup, a[rel="footnote"], a[href*="#cite"], a[href*="#footnote"], a[href*="#fn"], span.citation')
    );

    const citations = nodes
      .map((node, index) => {
        const anchor = node.tagName === 'SUP' ? node.querySelector('a') || node : node;
        const href = anchor.getAttribute('href') || '';
        const text = anchor.textContent.trim();
        if (!text) {
          return null;
        }
        const tooltipId = (anchor.getAttribute('aria-describedby') || node.getAttribute('aria-describedby') || '').trim();
        const tooltipText =
          anchor.getAttribute('data-tooltip') ||
          anchor.getAttribute('title') ||
          node.getAttribute('data-tooltip') ||
          node.getAttribute('title') ||
          '';
        return {
          id: anchor.id || node.id || `citation-${index + 1}`,
          text,
          href,
          tooltipId,
          tooltipText: tooltipText.trim(),
          context: node.closest('p, li')?.textContent?.trim().slice(0, 240) || ''
        };
      })
      .filter(Boolean);

    const unique = [];
    const seen = new Set();
    citations.forEach((item) => {
      const key = `${item.text}|${item.href}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });

    return unique;
  }

  function collectTooltips(root) {
    const nodes = Array.from(root.querySelectorAll('[data-tooltip], [title], abbr[title], span.tooltip'));
    return nodes
      .map((node, index) => {
        const tooltip = node.getAttribute('data-tooltip') || node.getAttribute('title');
        if (!tooltip) return null;
        return {
          id: node.id || `tooltip-${index + 1}`,
          text: tooltip.trim(),
          context: node.textContent.trim()
        };
      })
      .filter(Boolean);
  }

  function collectFootnotes(doc) {
    const selectors = [
      'ol.footnotes li',
      'section.footnotes li',
      'aside.footnotes li',
      'div.footnote',
      'li.footnote',
      '[id^="fn"]',
      '[id^="note"]',
      '[role="note"]'
    ];

    const nodes = selectors.flatMap((selector) => Array.from(doc.querySelectorAll(selector)));
    const unique = [];
    const seen = new Set();

    nodes.forEach((node, index) => {
      if (node.tagName && node.tagName.toLowerCase() === 'a') {
        return;
      }
      const id = node.id || node.getAttribute('data-id') || `footnote-${index + 1}`;
      if (seen.has(id)) return;
      seen.add(id);
      unique.push({
        id,
        text: node.textContent.trim(),
        html: node.innerHTML.trim()
      });
    });

    return unique;
  }

  function validatePage(inlineCitations, tooltips, footnotes, options = {}) {
    const counts = { pass: 0, warning: 0, error: 0 };
    const items = [];
    const captureCitations = options.citations !== false;
    const captureTooltips = options.tooltips !== false;
    const captureFootnotes = options.footnotes !== false;
    const limitations = [];

    if (!captureCitations) {
      limitations.push('Inline citation capture disabled; validation is limited to available references.');
    }
    if (!captureFootnotes) {
      limitations.push('Footnote capture disabled; citation-to-footnote checks skipped.');
    }
    if (!captureTooltips) {
      limitations.push('Tooltip capture disabled; citation tooltip checks skipped.');
    }

    const record = (entry) => {
      const severity = entry.severity || 'pass';
      if (counts[severity] !== undefined) {
        counts[severity] += 1;
      }
      items.push(entry);
    };

    const createKeyVariants = (value) => {
      if (!value) return [];
      const raw = value.toString().replace(/^#+/, '').trim();
      if (!raw) return [];
      const lower = raw.toLowerCase();
      const dashed = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const compact = lower.replace(/[^a-z0-9]+/g, '');
      return Array.from(new Set([lower, dashed, compact])).filter(Boolean);
    };

    const collectKeys = (values) => {
      const set = new Set();
      values.forEach((value) => {
        createKeyVariants(value).forEach((key) => set.add(key));
      });
      return Array.from(set);
    };

    const extractAnchorTarget = (href) => {
      if (!href) return '';
      try {
        const url = new URL(href, 'https://example.com');
        return url.hash ? url.hash.replace(/^#/, '') : url.href;
      } catch (error) {
        const index = href.indexOf('#');
        return index >= 0 ? href.slice(index + 1) : href;
      }
    };

    const footnoteMap = new Map();
    if (captureFootnotes) {
      footnotes.forEach((footnote) => {
        collectKeys([footnote.id]).forEach((key) => {
          if (!footnoteMap.has(key)) {
            footnoteMap.set(key, footnote);
          }
        });
      });
    }

    const tooltipMap = new Map();
    const tooltipTextMap = new Map();
    if (captureTooltips) {
      tooltips.forEach((tooltip) => {
        collectKeys([tooltip.id]).forEach((key) => {
          if (!tooltipMap.has(key)) {
            tooltipMap.set(key, tooltip);
          }
        });
        if (tooltip.text) {
          const textKey = tooltip.text.trim().toLowerCase();
          if (!tooltipTextMap.has(textKey)) {
            tooltipTextMap.set(textKey, tooltip);
          }
        }
      });
    }

    const referencedFootnotes = new Set();
    const referencedTooltipIds = new Set();
    const referencedTooltipTexts = new Set();

    inlineCitations.forEach((citation) => {
      const footnoteTarget = extractAnchorTarget(citation.href);
      const footnoteKeys = collectKeys([footnoteTarget, citation.id]);
      let footnote = null;
      let matchedFootnoteKey = '';
      if (captureFootnotes) {
        for (const key of footnoteKeys) {
          if (footnoteMap.has(key)) {
            footnote = footnoteMap.get(key);
            matchedFootnoteKey = key;
            referencedFootnotes.add(key);
            break;
          }
        }
      }

      const expectedTooltip = Boolean(citation.tooltipId || citation.tooltipText);
      const tooltipKeys = collectKeys([citation.tooltipId]);
      let tooltip = null;
      if (captureTooltips) {
        for (const key of tooltipKeys) {
          if (tooltipMap.has(key)) {
            tooltip = tooltipMap.get(key);
            collectKeys([tooltip.id]).forEach((variant) => referencedTooltipIds.add(variant));
            if (tooltip.text) {
              referencedTooltipTexts.add(tooltip.text.trim().toLowerCase());
            }
            break;
          }
        }

        if (!tooltip && citation.tooltipText) {
          const textKey = citation.tooltipText.trim().toLowerCase();
          if (tooltipTextMap.has(textKey)) {
            tooltip = tooltipTextMap.get(textKey);
            if (tooltip.id) {
              collectKeys([tooltip.id]).forEach((variant) => referencedTooltipIds.add(variant));
            }
            referencedTooltipTexts.add(textKey);
          }
        }
      }

      let severity = 'pass';
      const detailParts = [];

      if (captureFootnotes) {
        if (footnote) {
          detailParts.push(`linked to footnote ${footnote.id}`);
        } else if (footnoteKeys.length > 0) {
          severity = 'error';
          detailParts.push(`missing footnote target "${footnoteKeys[0]}"`);
        } else if (footnotes.length > 0) {
          severity = 'warning';
          detailParts.push('no footnote reference detected');
        } else {
          severity = 'warning';
          detailParts.push('no footnote reference available');
        }
      } else if (footnoteKeys.length > 0) {
        severity = 'warning';
        detailParts.push('footnote validation skipped (capture disabled)');
      }

      if (expectedTooltip && captureTooltips) {
        if (tooltip) {
          const tooltipLabel = tooltip.id ? `tooltip ${tooltip.id}` : 'tooltip content';
          detailParts.push(`${tooltipLabel} found`);
        } else {
          if (severity !== 'error') {
            severity = 'warning';
          }
          detailParts.push('tooltip reference missing');
        }
      } else if (expectedTooltip && !captureTooltips) {
        if (severity !== 'error') {
          severity = 'warning';
        }
        detailParts.push('tooltip validation skipped (capture disabled)');
      } else if (captureTooltips && tooltips.length === 0 && severity === 'pass') {
        detailParts.push('no tooltip reference available');
      }

      const messageDetails = detailParts.length ? ` — ${detailParts.join('; ')}` : '';

      record({
        severity,
        scope: 'citation',
        message: `Citation ${citation.text}${messageDetails}`,
        details: {
          citationId: citation.id,
          citationText: citation.text,
          footnoteId: footnote?.id || '',
          footnoteTarget,
          tooltipId: tooltip?.id || citation.tooltipId || '',
          tooltipText: citation.tooltipText || tooltip?.text || '',
          href: citation.href,
          context: citation.context || ''
        }
      });
    });

    if (captureFootnotes) {
      footnotes.forEach((footnote) => {
        const keys = collectKeys([footnote.id]);
        const hasReference = keys.some((key) => referencedFootnotes.has(key));
        if (!hasReference) {
          record({
            severity: inlineCitations.length === 0 ? 'error' : 'warning',
            scope: 'footnote',
            message: `Footnote ${footnote.id} is not referenced by any inline citation.`,
            details: {
              footnoteId: footnote.id,
              text: footnote.text
            }
          });
        }
      });
    }

    if (captureTooltips) {
      tooltips.forEach((tooltip) => {
        const idKeys = collectKeys([tooltip.id]);
        const textKey = tooltip.text?.trim().toLowerCase() || '';
        const hasReference =
          idKeys.some((key) => referencedTooltipIds.has(key)) ||
          (textKey && referencedTooltipTexts.has(textKey));
        if (!hasReference) {
          record({
            severity: 'warning',
            scope: 'tooltip',
            message: `Tooltip ${tooltip.id || tooltip.text.slice(0, 40)} is not associated with any citation.`,
            details: {
              tooltipId: tooltip.id,
              tooltipText: tooltip.text
            }
          });
        }
      });
    }

    limitations.forEach((message) => {
      record({
        severity: 'warning',
        scope: 'validation',
        message,
        details: {}
      });
    });

    if (items.length === 0) {
      record({
        severity: 'pass',
        scope: 'page',
        message: 'No citation validation issues detected.',
        details: {}
      });
    }

    const status = counts.error > 0 ? 'error' : counts.warning > 0 ? 'warning' : 'pass';

    return {
      items,
      summary: {
        status,
        counts,
        totals: {
          citations: inlineCitations.length,
          footnotes: footnotes.length,
          tooltips: tooltips.length
        }
      }
    };
  }

  function switchTab(tabName) {
    elements.tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    elements.tabPanels.forEach((panel) => {
      const isActive = panel.id === `${tabName}Pane`;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  }

  function updateProgress(activeUrl) {
    const total = state.total || 0;
    const processed = state.processed || 0;
    const current = activeUrl ? Math.min(processed, total) : processed;
    const progress = total === 0 ? 0 : Math.round((current / total) * 100);
    elements.progressBar.style.width = `${progress}%`;
    let activeLabel = 'Processing';
    if (activeUrl) {
      try {
        const url = new URL(activeUrl);
        activeLabel = url.pathname || url.href;
      } catch (error) {
        activeLabel = activeUrl;
      }
    }
    elements.progressText.textContent = state.isRunning
      ? activeLabel
      : processed === 0
      ? 'Awaiting configuration'
      : 'Session complete';
    elements.batchCounter.textContent = `${Math.min(processed, total)} / ${total}`;
  }

  function updateStatus(type, label) {
    elements.statusPill.textContent = label;
    let background;
    switch (type) {
      case 'active':
        background = 'rgba(56, 189, 248, 0.2)';
        break;
      case 'paused':
        background = 'rgba(250, 204, 21, 0.25)';
        break;
      case 'idle':
      default:
        background = 'rgba(148, 163, 184, 0.2)';
    }
    elements.statusPill.style.background = background;
  }

  function renderPreview() {
    const container = elements.previewContent;
    if (state.results.length === 0) {
      elements.previewEmpty.hidden = false;
      container.hidden = true;
      container.innerHTML = '';
      return;
    }

    elements.previewEmpty.hidden = true;
    container.hidden = false;

    container.innerHTML = state.results
      .map((result) => {
        let hostname = '';
        try {
          hostname = new URL(result.url).hostname;
        } catch (error) {
          hostname = 'adxs.org';
        }

        const sectionPreview = result.sections
          .slice(0, 3)
          .map(
            (section) => `
              <section>
                <h4>${escapeHtml(section.heading)}</h4>
                <p>${escapeHtml(section.text.slice(0, 220))}${section.text.length > 220 ? '…' : ''}</p>
              </section>
            `
          )
          .join('');

        return `
          <article class="preview-card">
            <header>
              <h3>${escapeHtml(result.title)}</h3>
              <div class="metadata">
                <span>${escapeHtml(hostname)}</span>
                <span>${result.stats.sections} section${result.stats.sections === 1 ? '' : 's'}</span>
                <span>${result.stats.words} words</span>
              </div>
            </header>
            ${sectionPreview}
            <footer>
              <a href="${result.url}" target="_blank" rel="noopener">Open on ADXS.org</a>
            </footer>
          </article>
        `;
      })
      .join('');
  }

  function renderStats() {
    const totals = state.results.reduce(
      (acc, result) => {
        acc.pages += 1;
        acc.sections += result.stats.sections;
        acc.citations += result.stats.citations;
        acc.tooltips += result.stats.tooltips;
        acc.footnotes += result.stats.footnotes;
        acc.words += result.stats.words;
        return acc;
      },
      { pages: 0, sections: 0, citations: 0, tooltips: 0, footnotes: 0, words: 0 }
    );

    elements.statPages.textContent = totals.pages;
    elements.statSections.textContent = totals.sections;
    elements.statCitations.textContent = totals.citations;
    elements.statTooltips.textContent = totals.tooltips;
    elements.statFootnotes.textContent = totals.footnotes;
    elements.statWords.textContent = totals.words.toLocaleString();
  }

  function renderValidation() {
    if (!elements.validationList) return;

    const counts = { pass: 0, warning: 0, error: 0 };
    let status = state.results.length === 0 ? 'idle' : 'pass';
    const aggregated = [];

    state.results.forEach((result) => {
      if (!result.validation) {
        return;
      }
      const summary = result.validation.summary || { counts: {} };
      counts.pass += summary.counts?.pass || 0;
      counts.warning += summary.counts?.warning || 0;
      counts.error += summary.counts?.error || 0;
      aggregated.push(
        ...result.validation.items.map((item) => ({
          ...item,
          pageTitle: result.title,
          pageUrl: result.url
        }))
      );
      if (summary.status === 'error') {
        status = 'error';
      } else if (summary.status === 'warning' && status !== 'error') {
        status = 'warning';
      } else if (status === 'idle' && summary.status === 'pass') {
        status = 'pass';
      }
    });

    if (elements.validationPassCount) {
      elements.validationPassCount.textContent = counts.pass;
    }
    if (elements.validationWarnCount) {
      elements.validationWarnCount.textContent = counts.warning;
    }
    if (elements.validationErrorCount) {
      elements.validationErrorCount.textContent = counts.error;
    }

    if (elements.validationStatus) {
      elements.validationStatus.classList.remove('pass', 'warning', 'error');
      let label = 'Awaiting results';
      if (status === 'error') {
        label = 'Errors detected';
        elements.validationStatus.classList.add('error');
      } else if (status === 'warning') {
        label = 'Warnings detected';
        elements.validationStatus.classList.add('warning');
      } else if (status === 'pass' && state.results.length > 0) {
        label = 'All checks passed';
        elements.validationStatus.classList.add('pass');
      }
      elements.validationStatus.textContent = label;
    }

    const severityOrder = { error: 0, warning: 1, pass: 2 };
    aggregated.sort((a, b) => {
      const orderA = severityOrder[a.severity] ?? 3;
      const orderB = severityOrder[b.severity] ?? 3;
      if (orderA !== orderB) return orderA - orderB;
      const titleCompare = (a.pageTitle || '').localeCompare(b.pageTitle || '');
      if (titleCompare !== 0) return titleCompare;
      return (a.message || '').localeCompare(b.message || '');
    });

    if (!aggregated.length) {
      if (elements.validationEmpty) {
        elements.validationEmpty.hidden = false;
      }
      elements.validationList.hidden = true;
      elements.validationList.innerHTML = '';
      return;
    }

    if (elements.validationEmpty) {
      elements.validationEmpty.hidden = true;
    }
    elements.validationList.hidden = false;

    elements.validationList.innerHTML = aggregated
      .map((item) => {
        const detailLines = [];
        if (item.details) {
          const { citationText, citationId, footnoteId, footnoteTarget, tooltipId, tooltipText, href } = item.details;
          if (citationText) {
            detailLines.push(`Citation text: ${citationText}`);
          }
          if (citationId) {
            detailLines.push(`Citation id: ${citationId}`);
          }
          if (footnoteId) {
            detailLines.push(`Footnote id: ${footnoteId}`);
          }
          if (footnoteTarget && footnoteTarget !== footnoteId) {
            detailLines.push(`Footnote target: ${footnoteTarget}`);
          }
          if (tooltipId) {
            detailLines.push(`Tooltip ref: ${tooltipId}`);
          } else if (tooltipText && item.scope === 'citation') {
            detailLines.push(`Tooltip text: ${tooltipText}`);
          }
          if (href) {
            detailLines.push(`Href: ${href}`);
          }
        }

        const detailHtml = detailLines.length
          ? `<div class="validation-details">${detailLines
              .map((line) => `<span>${escapeHtml(line)}</span>`)
              .join('')}</div>`
          : '';

        const metaParts = [];
        if (item.pageTitle) {
          metaParts.push(`<span>${escapeHtml(item.pageTitle)}</span>`);
        }
        if (item.pageUrl) {
          metaParts.push(
            `<a href="${item.pageUrl}" target="_blank" rel="noopener">${escapeHtml(item.pageUrl)}</a>`
          );
        }

        const metaHtml = metaParts.length
          ? `<div class="validation-meta">${metaParts.join('<span aria-hidden="true" class="meta-separator">•</span>')}</div>`
          : '';

        return `
          <li class="validation-item ${item.severity}">
            <div class="validation-item-header">
              <span class="validation-badge">${escapeHtml(item.severity || '').toUpperCase()}</span>
              <span class="validation-message">${escapeHtml(item.message)}</span>
            </div>
            ${metaHtml}
            ${detailHtml}
          </li>
        `;
      })
      .join('');
  }

  function renderLogs() {
    elements.logList.innerHTML = state.logs
      .slice(-120)
      .map(
        (entry) => `
          <li class="log-entry" data-type="${entry.type}">
            <span>${escapeHtml(entry.message)}</span>
            <time datetime="${entry.timestamp}">${formatTimestamp(entry.timestamp)}</time>
          </li>
        `
      )
      .join('');
  }

  function log(message, type = 'info') {
    const entry = {
      message,
      type,
      timestamp: new Date().toISOString()
    };
    state.logs.push(entry);
    renderLogs();
  }

  function updateExports() {
    const disabled = state.results.length === 0;
    elements.exportButtons.forEach((btn) => {
      btn.disabled = disabled;
    });
    elements.copyClipboard.disabled = disabled;
  }

  function handleExport(format) {
    if (state.results.length === 0) return;

    switch (format) {
      case 'json':
        downloadFile('adxs-scrape.json', JSON.stringify(state.results, null, 2), 'application/json');
        break;
      case 'markdown':
        downloadFile('adxs-scrape.md', convertResultsToMarkdown(state.results), 'text/markdown');
        break;
      case 'html':
        downloadFile('adxs-scrape.html', convertResultsToHtml(state.results), 'text/html');
        break;
      case 'bibtex':
        downloadFile('adxs-scrape.bib', convertResultsToBibTeX(state.results), 'application/x-bibtex');
        break;
      default:
        log(`Unknown export format: ${format}`, 'error');
    }
  }

  function convertResultsToMarkdown(results) {
    const lines = ['# ADXS scrape results', '', `Generated: ${new Date().toISOString()}`, ''];
    results.forEach((result) => {
      lines.push(`## ${result.title}`);
      lines.push(result.url);
      lines.push('');
      result.sections.forEach((section) => {
        lines.push(`### ${section.heading}`);
        lines.push(section.text);
        lines.push('');
      });
      if (result.inlineCitations.length) {
        lines.push('#### Inline citations');
        result.inlineCitations.forEach((citation) => {
          lines.push(`- ${citation.text}${citation.href ? ` (${citation.href})` : ''}`);
        });
        lines.push('');
      }
      if (result.footnotes.length) {
        lines.push('#### Footnotes');
        result.footnotes.forEach((footnote) => {
          lines.push(`- ${footnote.text}`);
        });
        lines.push('');
      }
      if (result.validation) {
        const summary = result.validation.summary || { status: 'pass', counts: {} };
        lines.push('#### Validation');
        lines.push(
          `- Status: ${summary.status ? summary.status.toUpperCase() : 'PASS'} (pass: ${summary.counts?.pass ?? 0}, warnings: ${
            summary.counts?.warning ?? 0
          }, errors: ${summary.counts?.error ?? 0})`
        );
        if (Array.isArray(result.validation.items) && result.validation.items.length) {
          result.validation.items.forEach((item) => {
            lines.push(`  - [${(item.severity || 'pass').toUpperCase()}] ${item.message}`);
          });
        }
        lines.push('');
      }
    });
    return lines.join('\n');
  }

  function convertResultsToHtml(results) {
    const sections = results
      .map((result) => {
        const sectionsHtml = result.sections
          .map(
            (section) => `
            <section id="${section.id}">
              <h3>${escapeHtml(section.heading)}</h3>
              <div>${section.html}</div>
            </section>
          `
          )
          .join('\n');

        const citationsHtml = result.inlineCitations.length
          ? `<section class="citations"><h4>Inline citations</h4><ul>${result.inlineCitations
              .map((citation) => `<li>${escapeHtml(citation.text)}${
                citation.href ? ` (<a href="${citation.href}">${escapeHtml(citation.href)}</a>)` : ''
              }</li>`)
              .join('')}</ul></section>`
          : '';

        const footnotesHtml = result.footnotes.length
          ? `<section class="footnotes"><h4>Footnotes</h4><ul>${result.footnotes
              .map((footnote) => `<li>${footnote.html}</li>`)
              .join('')}</ul></section>`
          : '';

        const validationSummary = result.validation?.summary || { status: 'pass', counts: {} };
        const validationItems = Array.isArray(result.validation?.items) ? result.validation.items : [];
        const validationList = validationItems
          .map(
            (item) =>
              `<li class="${item.severity}"><strong>${escapeHtml(
                (item.severity || 'pass').toUpperCase()
              )}:</strong> ${escapeHtml(item.message)}</li>`
          )
          .join('');

        const validationHtml = result.validation
          ? `<section class="validation"><h4>Validation</h4><p class="validation-status ${validationSummary.status || 'pass'}">Status: ${
              (validationSummary.status || 'pass').toUpperCase()
            } (pass: ${validationSummary.counts?.pass ?? 0}, warnings: ${validationSummary.counts?.warning ?? 0}, errors: ${
              validationSummary.counts?.error ?? 0
            })</p>${
              validationList
                ? `<ul>${validationList}</ul>`
                : '<p class="validation-note">No individual validation items recorded.</p>'
            }</section>`
          : '';

        return `
        <article class="page-result">
          <header>
            <h2>${escapeHtml(result.title)}</h2>
            <p><a href="${result.url}">${result.url}</a></p>
          </header>
          ${sectionsHtml}
          ${citationsHtml}
          ${footnotesHtml}
          ${validationHtml}
        </article>`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>ADXS scrape export</title>
<style>
body { font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; margin: 2rem auto; max-width: 960px; line-height: 1.6; }
h1, h2, h3, h4 { font-weight: 600; }
.page-result { margin-bottom: 3rem; border-bottom: 1px solid #cbd5f5; padding-bottom: 2rem; }
.page-result header h2 { margin-bottom: 0.25rem; }
.citations ul, .footnotes ul { padding-left: 1.2rem; }
.validation { margin-top: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid #e2e8f0; }
.validation h4 { margin-top: 0; }
.validation-status { font-weight: 600; margin-bottom: 0.75rem; }
.validation-status.pass { color: #15803d; }
.validation-status.warning { color: #b45309; }
.validation-status.error { color: #b91c1c; }
.validation ul { list-style: none; padding-left: 0; margin: 0; display: grid; gap: 0.35rem; }
.validation li.pass { color: #166534; }
.validation li.warning { color: #b45309; }
.validation li.error { color: #b91c1c; }
.validation-note { margin: 0; color: #475569; font-size: 0.9rem; }
</style>
</head>
<body>
<h1>ADXS scrape results</h1>
<p>Generated: ${new Date().toISOString()}</p>
${sections}
</body>
</html>`;
  }

  function convertResultsToBibTeX(results) {
    return results
      .map((result, index) => {
        const keyBase = result.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40);
        const key = keyBase || `adxs-${index + 1}`;
        return `@online{${key},
  title = {${result.title}},
  url = {${result.url}},
  note = {Captured ${result.stats.sections} sections, ${result.stats.citations} citations, ${result.stats.footnotes} footnotes},
  year = {${new Date(result.fetchedAt).getFullYear()}},
  urldate = {${result.fetchedAt.split('T')[0]}}
}`;
      })
      .join('\n\n');
  }

  async function copySummaryToClipboard() {
    if (state.results.length === 0) return;
    const summary = state.results
      .map(
        (result) => {
          const validationSummary = result.validation?.summary;
          const validationLine = validationSummary
            ? `Validation: ${(validationSummary.status || 'pass').toUpperCase()} (Pass: ${validationSummary.counts?.pass ?? 0}, Warnings: ${validationSummary.counts?.warning ?? 0}, Errors: ${validationSummary.counts?.error ?? 0})`
            : 'Validation: N/A';
          return `${result.title} — ${result.url}\nSections: ${result.stats.sections}, Citations: ${result.stats.citations}, Footnotes: ${result.stats.footnotes}\n${validationLine}`;
        }
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(summary);
      log('Summary copied to clipboard.', 'success');
    } catch (error) {
      fallbackCopy(summary);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    log('Summary copied using fallback method.', 'success');
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    log(`${filename} export generated.`, 'success');
  }

  function escapeHtml(value) {
    return (value ?? '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
