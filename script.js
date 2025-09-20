(function () {
  const state = {
    scraped: null,
    validation: null,
    exportBundle: null,
  };

  const severityWeight = {
    error: 0,
    warning: 1,
    success: 2,
  };

  document.addEventListener('DOMContentLoaded', () => {
    const sourceInput = document.getElementById('source-input');
    const scrapeButton = document.getElementById('scrape-button');
    const exportButton = document.getElementById('export-button');
    const contentPreview = document.getElementById('content-preview');
    const summaryEl = document.getElementById('validation-summary');
    const messagesEl = document.getElementById('validation-messages');
    const exportJson = document.getElementById('export-json');
    const exportMarkdown = document.getElementById('export-markdown');

    function resetUI() {
      contentPreview.innerHTML = '';
      state.scraped = null;
      state.validation = null;
      state.exportBundle = null;
      renderValidationReport(null, summaryEl, messagesEl);
      exportJson.value = '';
      exportMarkdown.value = '';
      exportButton.disabled = true;
    }

    function handleScrape() {
      const rawHtml = (sourceInput.value || '').trim();
      if (!rawHtml) {
        resetUI();
        summaryEl.innerHTML =
          '<p class="empty">Provide HTML input to run validation.</p>';
        summaryEl.className = 'validation-summary validation-summary--empty';
        return;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      sanitiseDocument(doc);

      const scraped = scrapeDocument(doc);
      state.scraped = scraped;

      renderContentPreview(doc, contentPreview);

      const validationReport = validateScrapedContent(scraped);
      state.validation = validationReport;
      renderValidationReport(validationReport, summaryEl, messagesEl);

      const exportBundle = generateExportBundle(scraped, validationReport);
      state.exportBundle = exportBundle;
      exportJson.value = exportBundle.json;
      exportMarkdown.value = exportBundle.markdown;
      exportButton.disabled = false;
    }

    function handleExport() {
      if (!state.exportBundle) {
        return;
      }
      const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
      downloadFile(
        `scrape-validation-${timestamp}.json`,
        state.exportBundle.json,
        'application/json'
      );
      downloadFile(
        `scrape-validation-${timestamp}.md`,
        state.exportBundle.markdown,
        'text/markdown'
      );
    }

    scrapeButton.addEventListener('click', handleScrape);
    exportButton.addEventListener('click', handleExport);
    renderValidationReport(null, summaryEl, messagesEl);
  });

  function sanitiseDocument(doc) {
    doc.querySelectorAll('script, style').forEach((node) => node.remove());
  }

  function renderContentPreview(doc, container) {
    const clone = doc.body.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(clone);
  }

  function scrapeDocument(doc) {
    const citations = extractCitations(doc);
    const tooltips = extractTooltips(doc, citations);
    const footnotes = extractFootnotes(doc);

    return {
      generatedAt: new Date().toISOString(),
      citations,
      tooltips,
      footnotes,
    };
  }

  function extractCitations(doc) {
    const citationNodes = new Set();
    doc.querySelectorAll('sup').forEach((node) => citationNodes.add(node));
    doc
      .querySelectorAll('[data-footnote-ref], [data-footnote-reference]')
      .forEach((node) => citationNodes.add(node));

    const citations = [];
    let autoCounter = 0;

    citationNodes.forEach((node) => {
      if (!node || typeof node.textContent !== 'string') {
        return;
      }

      const dataset = node.dataset ? { ...node.dataset } : {};
      const rawLabel = node.textContent.replace(/\s+/g, ' ').trim();
      const anchor = node.querySelector('a[href^="#"]');
      const anchorTarget = anchor
        ? (anchor.getAttribute('href') || '').replace(/^#/, '')
        : null;
      const anchorId = anchor ? anchor.id : null;
      const ariaDescribedby = node.getAttribute('aria-describedby') || '';
      const ariaTokens = ariaDescribedby
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
      const tooltipTargetAttr =
        node.getAttribute('data-tooltip-target') ||
        node.getAttribute('data-tooltip-id') ||
        node.getAttribute('data-tooltip');
      const inlineTooltip = detectInlineTooltip(node);

      const rawNumberCandidates = [
        dataset.footnoteNumber,
        dataset.footnoteId,
        dataset.footnote,
        dataset.ref,
        dataset.reference,
        node.getAttribute('data-ref'),
        anchorTarget,
        anchorId,
        rawLabel,
      ];
      const referenceNumber = deriveReferenceNumber(rawNumberCandidates);

      const keyCandidates = [
        dataset.footnoteId,
        dataset.footnoteNumber,
        dataset.footnote,
        dataset.ref,
        dataset.reference,
        dataset.citation,
        dataset.citationId,
        node.id,
        anchorTarget,
        anchorId,
        tooltipTargetAttr,
        ...ariaTokens,
        referenceNumber,
      ];

      const keys = collectKeys(keyCandidates, `citation-${++autoCounter}`);
      const primaryKey = keys[0];

      citations.push({
        type: 'citation',
        primaryKey,
        keys,
        label: rawLabel,
        referenceNumber,
        anchorTarget,
        anchorId,
        ariaDescribedby: ariaTokens,
        inlineTooltip,
        dataset,
        snippet: textSnippet(rawLabel, 80),
      });
    });

    citations.sort((a, b) => {
      if (a.referenceNumber != null && b.referenceNumber != null) {
        return a.referenceNumber - b.referenceNumber;
      }
      return severityWeight[a.referenceNumber != null ? 'success' : 'warning'];
    });

    return citations;
  }

  function detectInlineTooltip(node) {
    const dataset = node.dataset || {};
    const candidates = [
      dataset.footnoteTooltip,
      dataset.footnoteText,
      dataset.tooltip,
      dataset.tooltipContent,
      dataset.tooltipHtml,
      node.getAttribute('title'),
      node.getAttribute('data-original-title'),
      node.getAttribute('aria-label'),
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      const trimmed = candidate.trim();
      if (!trimmed) continue;
      if (looksLikeReference(trimmed)) continue;
      return textSnippet(trimmed, 220);
    }

    if (dataset.footnote) {
      const trimmed = dataset.footnote.trim();
      if (trimmed && !looksLikeReference(trimmed)) {
        return textSnippet(trimmed, 220);
      }
    }

    return null;
  }

  function looksLikeReference(value) {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (/^https?:/i.test(trimmed)) return false;
    if (/\s/.test(trimmed)) return false;
    if (/^[0-9]{1,4}$/.test(trimmed)) return true;
    return /^[a-z0-9_-]{1,32}$/i.test(trimmed);
  }

  function extractFootnotes(doc) {
    const selectors = [
      'section.footnotes li',
      'ol.footnotes li',
      'ul.footnotes li',
      'footer li',
      'li.footnote',
      '[data-footnote-id]',
      '[data-footnote-number]',
      '[data-footnote-entry]',
      '[data-footnote="entry"]',
    ];
    const nodes = new Set();
    selectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => nodes.add(el));
    });
    doc.querySelectorAll('[id^="fn"], [id^="footnote-"]').forEach((el) =>
      nodes.add(el)
    );

    const footnotes = [];
    let autoCounter = 0;

    nodes.forEach((node) => {
      const dataset = node.dataset ? { ...node.dataset } : {};
      const rawText = textSnippet(node.textContent || '', 240);
      const id = node.getAttribute('id');
      const anchor = node.querySelector('a[href^="#"]');
      const anchorTarget = anchor
        ? (anchor.getAttribute('href') || '').replace(/^#/, '')
        : null;

      const rawNumberCandidates = [
        dataset.footnoteNumber,
        dataset.footnoteId,
        dataset.footnote,
        dataset.ref,
        dataset.reference,
        id,
        anchorTarget,
        rawText,
      ];
      const referenceNumber = deriveReferenceNumber(rawNumberCandidates);

      const keyCandidates = [
        dataset.footnoteNumber,
        dataset.footnoteId,
        dataset.footnote,
        dataset.ref,
        dataset.reference,
        id,
        anchorTarget,
        referenceNumber,
      ];
      const keys = collectKeys(keyCandidates, `footnote-${++autoCounter}`);
      if (!keys.length) return;

      footnotes.push({
        type: 'footnote',
        primaryKey: keys[0],
        keys,
        referenceNumber,
        text: rawText,
        rawHTML: node.innerHTML,
        dataset,
        id,
      });
    });

    return footnotes;
  }

  function extractTooltips(doc, citations) {
    const selectors = [
      '[data-footnote-content]',
      '[data-footnote-tooltip]',
      '[data-tooltip-content]',
      '[data-tooltip]',
      '[data-tooltip-id]',
      '[data-tooltip-target]',
      '[role="tooltip"]',
      '.footnote-tooltip',
      '.tooltip',
    ];
    const nodes = new Set();
    selectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => {
        if (el.tagName && el.tagName.toLowerCase() === 'sup') return;
        nodes.add(el);
      });
    });

    const tooltipMap = new Map();
    let autoCounter = 0;

    nodes.forEach((node) => {
      const dataset = node.dataset ? { ...node.dataset } : {};
      const rawText = textSnippet(node.textContent || '', 200);
      const id = node.getAttribute('id');

      const rawNumberCandidates = [
        dataset.footnoteTooltip,
        dataset.footnoteContent,
        dataset.footnote,
        dataset.tooltip,
        dataset.tooltipId,
        dataset.tooltipTarget,
        dataset.for,
        id,
        rawText,
      ];
      const referenceNumber = deriveReferenceNumber(rawNumberCandidates);
      const keyCandidates = [
        dataset.footnoteTooltip,
        dataset.footnoteContent,
        dataset.footnote,
        dataset.tooltipId,
        dataset.tooltipTarget,
        dataset.tooltip,
        dataset.for,
        id,
        referenceNumber,
      ];
      const keys = collectKeys(keyCandidates, `tooltip-${++autoCounter}`);
      if (!keys.length) return;
      const primaryKey = keys[0];
      if (!tooltipMap.has(primaryKey)) {
        tooltipMap.set(primaryKey, {
          type: 'tooltip',
          primaryKey,
          keys,
          referenceNumber,
          text: rawText,
          rawHTML: node.innerHTML,
          dataset,
          id,
          origin: node.tagName ? node.tagName.toLowerCase() : 'dom',
        });
      }
    });

    citations.forEach((citation) => {
      if (!citation.inlineTooltip) return;
      if (!tooltipMap.has(citation.primaryKey)) {
        tooltipMap.set(citation.primaryKey, {
          type: 'tooltip',
          primaryKey: citation.primaryKey,
          keys: citation.keys.slice(),
          referenceNumber: citation.referenceNumber,
          text: citation.inlineTooltip,
          rawHTML: citation.inlineTooltip,
          dataset: citation.dataset,
          origin: 'inline',
        });
      }
    });

    return Array.from(tooltipMap.values());
  }

  function deriveReferenceNumber(values) {
    const list = Array.isArray(values) ? values : [values];
    for (const value of list) {
      if (value == null) continue;
      const str = String(value).trim();
      if (!str) continue;
      const match = str.match(/(\d{1,4})/);
      if (match) {
        return Number.parseInt(match[1], 10);
      }
    }
    return null;
  }

  function collectKeys(values, fallback) {
    const list = Array.isArray(values) ? values : [values];
    const keys = [];
    const seen = new Set();
    for (const value of list) {
      if (value == null) continue;
      const str = String(value).trim();
      if (!str) continue;
      const key = normaliseKey(str);
      if (!key) continue;
      if (!seen.has(key)) {
        keys.push(key);
        seen.add(key);
      }
    }
    if (!keys.length && fallback) {
      const key = normaliseKey(fallback);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  function normaliseKey(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function textSnippet(text, limit) {
    if (!text) return '';
    const cleaned = String(text).replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    if (cleaned.length <= limit) return cleaned;
    return `${cleaned.slice(0, Math.max(0, limit - 1)).trim()}…`;
  }

  function validateScrapedContent(scraped) {
    const messages = [];
    const stats = {
      citationsEvaluated: scraped.citations.length,
      footnotesEvaluated: scraped.footnotes.length,
      tooltipsEvaluated: scraped.tooltips.length,
      citationsWithFootnote: 0,
      citationsMissingFootnote: 0,
      citationsWithTooltip: 0,
      citationsMissingTooltip: 0,
      mismatchedNumbers: 0,
      footnotesWithoutCitation: 0,
      tooltipsWithoutCitation: 0,
    };

    const matchedFootnotes = new Set();
    const matchedTooltips = new Set();

    scraped.citations.forEach((citation) => {
      const footnoteMatch = findBestMatch(scraped.footnotes, citation);
      const tooltipMatch = citation.inlineTooltip
        ? {
            primaryKey: citation.primaryKey,
            referenceNumber: citation.referenceNumber,
            text: citation.inlineTooltip,
            origin: 'inline',
          }
        : findBestMatch(scraped.tooltips, citation);

      const message = {
        severity: 'success',
        code: 'citation-validation',
        title: `Citation ${formatCitationLabel(citation)}`,
        message: '',
        target: {
          type: 'citation',
          key: citation.primaryKey,
          referenceNumber: citation.referenceNumber,
        },
        details: {
          keysTested: citation.keys,
          hasFootnote: Boolean(footnoteMatch),
          hasTooltip: Boolean(tooltipMatch),
          matchedFootnote: footnoteMatch
            ? {
                key: footnoteMatch.primaryKey,
                referenceNumber: footnoteMatch.referenceNumber,
              }
            : null,
          matchedTooltip: tooltipMatch
            ? {
                key: tooltipMatch.primaryKey,
                referenceNumber: tooltipMatch.referenceNumber,
                origin: tooltipMatch.origin || 'dom',
              }
            : null,
        },
      };

      const messageParts = [];

      if (footnoteMatch) {
        stats.citationsWithFootnote += 1;
        matchedFootnotes.add(footnoteMatch.primaryKey);
        if (
          citation.referenceNumber != null &&
          footnoteMatch.referenceNumber != null &&
          citation.referenceNumber !== footnoteMatch.referenceNumber
        ) {
          stats.mismatchedNumbers += 1;
          message.severity = 'warning';
          messageParts.push(
            `Linked footnote ${formatFootnoteLabel(
              footnoteMatch
            )} does not match citation number ${citation.referenceNumber}.`
          );
        } else {
          messageParts.push(
            `Matched footnote ${formatFootnoteLabel(footnoteMatch)}.`
          );
        }
      } else {
        stats.citationsMissingFootnote += 1;
        message.severity = 'error';
        messageParts.push('No matching footnote entry was found.');
      }

      if (tooltipMatch) {
        stats.citationsWithTooltip += 1;
        if (tooltipMatch.primaryKey) {
          matchedTooltips.add(tooltipMatch.primaryKey);
        }
        messageParts.push(
          tooltipMatch.origin === 'inline'
            ? 'Tooltip text supplied inline with the citation.'
            : 'Matched tooltip/hover entry in the document.'
        );
      } else {
        stats.citationsMissingTooltip += 1;
        if (message.severity !== 'error') {
          message.severity = 'warning';
        }
        messageParts.push('No tooltip or hover content was discovered.');
      }

      if (!messageParts.length) {
        messageParts.push('No validation outcomes recorded.');
      }

      message.message = messageParts.join(' ');
      messages.push(message);
    });

    scraped.footnotes.forEach((footnote) => {
      if (matchedFootnotes.has(footnote.primaryKey)) {
        return;
      }
      stats.footnotesWithoutCitation += 1;
      messages.push({
        severity: 'warning',
        code: 'orphan-footnote',
        title: `Unreferenced footnote ${formatFootnoteLabel(footnote)}`,
        message:
          'This footnote entry was captured but is not referenced by any citation in the body copy.',
        target: {
          type: 'footnote',
          key: footnote.primaryKey,
          referenceNumber: footnote.referenceNumber,
        },
        details: {
          text: footnote.text,
        },
      });
    });

    scraped.tooltips.forEach((tooltip) => {
      if (matchedTooltips.has(tooltip.primaryKey)) {
        return;
      }
      stats.tooltipsWithoutCitation += 1;
      messages.push({
        severity: 'warning',
        code: 'orphan-tooltip',
        title: `Tooltip ${formatTooltipLabel(tooltip)} is not linked`,
        message:
          'Tooltip or hover content was captured but not linked to a superscript citation.',
        target: {
          type: 'tooltip',
          key: tooltip.primaryKey,
          referenceNumber: tooltip.referenceNumber,
        },
        details: {
          text: tooltip.text,
        },
      });
    });

    messages.sort((a, b) => {
      const severityDelta = severityWeight[a.severity] - severityWeight[b.severity];
      if (severityDelta !== 0) return severityDelta;
      const aRef = a.target && a.target.referenceNumber != null
        ? a.target.referenceNumber
        : Number.MAX_SAFE_INTEGER;
      const bRef = b.target && b.target.referenceNumber != null
        ? b.target.referenceNumber
        : Number.MAX_SAFE_INTEGER;
      return aRef - bRef;
    });

    const severityCounts = messages.reduce(
      (acc, message) => {
        acc[message.severity] = (acc[message.severity] || 0) + 1;
        return acc;
      },
      { success: 0, warning: 0, error: 0 }
    );

    const summaryStatus = severityCounts.error
      ? 'error'
      : severityCounts.warning
      ? 'warning'
      : 'success';

    const summary = {
      status: summaryStatus,
      description:
        summaryStatus === 'success'
          ? 'All discovered citations were linked to both tooltip and footnote entries.'
          : summaryStatus === 'warning'
          ? 'Validation completed with warnings. Review mismatches before publishing.'
          : 'Validation uncovered blocking issues. Missing footnotes must be resolved.',
      severityCounts,
    };

    const report = {
      generatedAt: new Date().toISOString(),
      summary,
      stats,
      messages,
      totals: {
        citationsChecked: scraped.citations.length,
        footnotesChecked: scraped.footnotes.length,
        tooltipsChecked: scraped.tooltips.length,
      },
    };

    report.stats.coverageRatio = stats.citationsEvaluated
      ? Number(
          (stats.citationsWithFootnote / stats.citationsEvaluated).toFixed(2)
        )
      : 1;

    return report;
  }

  function findBestMatch(entries, citation) {
    if (!entries || !entries.length) return null;
    if (!citation) return null;

    if (citation.referenceNumber != null) {
      const numberMatch = entries.find(
        (entry) => entry.referenceNumber === citation.referenceNumber
      );
      if (numberMatch) return numberMatch;
    }

    if (citation.keys && citation.keys.length) {
      for (const key of citation.keys) {
        const entry = entries.find((candidate) =>
          candidate.keys && candidate.keys.includes(key)
        );
        if (entry) return entry;
      }
    }

    return null;
  }

  function renderValidationReport(report, summaryEl, messagesEl) {
    if (!summaryEl || !messagesEl) return;

    if (!report) {
      summaryEl.innerHTML =
        '<p class="validation-summary__empty">Run the scraper to see validation feedback.</p>';
      summaryEl.className = 'validation-summary validation-summary--empty';
      messagesEl.innerHTML = '';
      return;
    }

    const summaryClass = `validation-summary validation-summary--${report.summary.status}`;
    summaryEl.className = summaryClass;
    summaryEl.innerHTML = `
      <div class="validation-summary__status">${report.summary.status.toUpperCase()}</div>
      <p class="validation-summary__description">${escapeHtml(
        report.summary.description
      )}</p>
      <div class="validation-summary__grid">
        ${renderMetric('Citations checked', report.stats.citationsEvaluated)}
        ${renderMetric('Footnotes captured', report.stats.footnotesEvaluated)}
        ${renderMetric('Tooltips captured', report.stats.tooltipsEvaluated)}
        ${renderMetric('Citations linked', report.stats.citationsWithFootnote)}
        ${renderMetric('Tooltip coverage', `${
          report.stats.citationsEvaluated
            ? Math.round(
                (report.stats.citationsWithTooltip /
                  report.stats.citationsEvaluated) *
                  100
              )
            : 0
        }%`)}
        ${renderMetric('Number mismatches', report.stats.mismatchedNumbers)}
        ${renderMetric('Orphan footnotes', report.stats.footnotesWithoutCitation)}
        ${renderMetric('Orphan tooltips', report.stats.tooltipsWithoutCitation)}
      </div>
    `;

    if (!report.messages.length) {
      messagesEl.innerHTML =
        '<li class="message message--success"><div class="message__title">All checks passed</div><p class="message__body">No issues detected.</p></li>';
      return;
    }

    messagesEl.innerHTML = '';
    report.messages.forEach((message) => {
      messagesEl.appendChild(createMessageElement(message));
    });
  }

  function renderMetric(label, value) {
    return `
      <div class="validation-summary__metric">
        <strong>${escapeHtml(String(value))}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    `;
  }

  function createMessageElement(message) {
    const li = document.createElement('li');
    li.className = `message message--${message.severity}`;

    const title = document.createElement('div');
    title.className = 'message__title';
    title.textContent = message.title;
    li.appendChild(title);

    if (message.target && message.target.referenceNumber != null) {
      const meta = document.createElement('div');
      meta.className = 'message__meta';
      meta.textContent = `Reference #${message.target.referenceNumber}`;
      li.appendChild(meta);
    }

    const body = document.createElement('p');
    body.className = 'message__body';
    body.textContent = message.message;
    li.appendChild(body);

    if (message.details) {
      const tags = document.createElement('div');
      tags.className = 'message__tags';

      if (Array.isArray(message.details.keysTested)) {
        const keyTag = document.createElement('span');
        keyTag.className = 'message__tag';
        keyTag.textContent = `Keys: ${message.details.keysTested.join(', ') || 'n/a'}`;
        tags.appendChild(keyTag);
      }

      if (message.details.matchedFootnote) {
        const fnTag = document.createElement('span');
        fnTag.className = 'message__tag';
        fnTag.textContent = `Footnote → ${formatFootnoteLabel(
          message.details.matchedFootnote
        )}`;
        tags.appendChild(fnTag);
      }

      if (message.details.matchedTooltip) {
        const tpTag = document.createElement('span');
        tpTag.className = 'message__tag';
        tpTag.textContent = `Tooltip origin: ${message.details.matchedTooltip.origin}`;
        tags.appendChild(tpTag);
      }

      if (tags.children.length) {
        li.appendChild(tags);
      }
    }

    return li;
  }

  function formatCitationLabel(citation) {
    if (citation.referenceNumber != null) {
      return `#${citation.referenceNumber}`;
    }
    if (citation.label) {
      return citation.label;
    }
    return citation.primaryKey || 'citation';
  }

  function formatFootnoteLabel(footnote) {
    if (!footnote) return 'footnote';
    if (footnote.referenceNumber != null) {
      return `#${footnote.referenceNumber}`;
    }
    return footnote.primaryKey || 'footnote';
  }

  function formatTooltipLabel(tooltip) {
    if (!tooltip) return 'tooltip';
    if (tooltip.referenceNumber != null) {
      return `#${tooltip.referenceNumber}`;
    }
    return tooltip.primaryKey || 'tooltip';
  }

  function generateExportBundle(scraped, validation) {
    const bundle = {
      generatedAt: validation.generatedAt,
      metadata: {
        citations: scraped.citations.length,
        footnotes: scraped.footnotes.length,
        tooltips: scraped.tooltips.length,
      },
      scraped,
      validation,
    };

    const json = JSON.stringify(bundle, null, 2);
    const markdown = createMarkdownReport(bundle);

    return { bundle, json, markdown };
  }

  function createMarkdownReport(bundle) {
    const { validation, scraped } = bundle;
    const lines = [];
    lines.push('# Scrape Validation Report');
    lines.push('');
    lines.push(`Generated: ${validation.generatedAt}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(
      `- Status: **${validation.summary.status.toUpperCase()}** — ${validation.summary.description}`
    );
    lines.push(
      `- Citations evaluated: ${validation.stats.citationsEvaluated} (linked: ${validation.stats.citationsWithFootnote})`
    );
    lines.push(
      `- Tooltips captured: ${validation.stats.tooltipsEvaluated} (coverage: ${validation.stats.citationsEvaluated
        ? Math.round(
            (validation.stats.citationsWithTooltip /
              validation.stats.citationsEvaluated) *
              100
          )
        : 0}%)`
    );
    lines.push(
      `- Footnotes without citation: ${validation.stats.footnotesWithoutCitation}`
    );
    lines.push(
      `- Tooltip mismatches: ${validation.stats.tooltipsWithoutCitation}`
    );
    lines.push('');

    lines.push('## Validation Messages');
    if (!validation.messages.length) {
      lines.push('- ✅ All checks passed.');
    } else {
      validation.messages.forEach((message, index) => {
        lines.push(
          `${index + 1}. **${message.severity.toUpperCase()}** — ${message.title}\n   - ${message.message}`
        );
      });
    }

    lines.push('');
    lines.push('## Citations Captured');
    if (!scraped.citations.length) {
      lines.push('- None');
    } else {
      scraped.citations.forEach((citation) => {
        lines.push(
          `- ${formatCitationLabel(citation)} | Keys: ${citation.keys.join(', ') || 'n/a'}`
        );
      });
    }

    lines.push('');
    lines.push('## Footnotes Captured');
    if (!scraped.footnotes.length) {
      lines.push('- None');
    } else {
      scraped.footnotes.forEach((footnote) => {
        lines.push(
          `- ${formatFootnoteLabel(footnote)} | Snippet: ${footnote.text}`
        );
      });
    }

    lines.push('');
    lines.push('## Tooltips Captured');
    if (!scraped.tooltips.length) {
      lines.push('- None');
    } else {
      scraped.tooltips.forEach((tooltip) => {
        lines.push(
          `- ${formatTooltipLabel(tooltip)} | Origin: ${tooltip.origin || 'dom'} | Snippet: ${tooltip.text}`
        );
      });
    }

    return lines.join('\n');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
})();
