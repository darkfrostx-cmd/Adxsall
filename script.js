const DEFAULT_SECTIONS = [
  { label: 'Abstract', selector: 'section#abstract' },
  { label: 'Introduction', selector: 'section#introduction' },
  { label: 'Methods', selector: 'section#methods' },
  { label: 'Results', selector: 'section#results' },
  { label: 'Discussion', selector: 'section#discussion' },
  { label: 'Conclusion', selector: 'section#conclusion' },
  { label: 'References', selector: 'section[role="doc-endnotes"]' }
];

const QUICK_LINKS = new Map([
  [
    'sample-article',
    {
      label: 'Sample journal article',
      base: 'https://journal.example.org/articles/2024/demo-insights',
      params: { view: 'full', lang: 'en' },
      sections: [
        { label: 'Abstract', selector: 'section#abstract' },
        { label: 'Introduction', selector: 'section#introduction' },
        { label: 'Methods', selector: 'section#methods' },
        { label: 'Results', selector: 'section#results' },
        { label: 'Discussion', selector: 'section#discussion' },
        { label: 'References', selector: 'section#references' }
      ],
      html: `
        <article>
          <header>
            <h1>Emerging Insights in Community Health</h1>
          </header>
          <section id="abstract">
            <h2>Abstract</h2>
            <p>
              Community-driven health programs have demonstrated measurable improvements
              in wellness indicators across urban centers
              <sup id="cite-abs-1"><a href="#fn1" role="doc-noteref">1</a></sup>.
            </p>
          </section>
          <section id="introduction">
            <h2>Introduction</h2>
            <p>
              Recent longitudinal studies highlight the importance of neighborhood-based
              support structures in preventative medicine
              <sup id="cite-intro-1"><a href="#fn2" role="doc-noteref">2</a></sup>.
            </p>
            <p>
              This paper synthesizes lessons from multi-region pilots while outlining
              future areas for experimentation
              <sup id="cite-intro-2"><a href="#fn3" role="doc-noteref" data-tooltip="Pilot program evaluation">3</a></sup>.
            </p>
          </section>
          <section id="methods">
            <h2>Methods</h2>
            <p>
              We combined ethnographic interviews with sensor data analysis across
              three municipalities
              <sup id="cite-methods-1"><a href="#fn4" role="doc-noteref">4</a></sup>.
            </p>
          </section>
          <section id="results">
            <h2>Results</h2>
            <p>
              Participation increased by 34% following the introduction of peer-led
              outreach sessions
              <sup id="cite-results-1"><a href="#fn5" role="doc-noteref">5</a></sup>.
            </p>
          </section>
          <section id="discussion">
            <h2>Discussion</h2>
            <p>
              The qualitative narratives suggest that co-designed interventions produce
              durable trust within communities
              <sup id="cite-discussion-1"><a href="#fn3" role="doc-noteref">3</a></sup>.
            </p>
          </section>
          <section id="references" role="doc-endnotes">
            <h2>References</h2>
            <ol class="footnotes">
              <li id="fn1" role="doc-footnote">
                1. Gomez, R. <em>Urban Wellness Programs</em>. Journal of Health, 2021.
              </li>
              <li id="fn2" role="doc-footnote">
                2. Chen, A. &amp; Malik, F. "Neighborhood Care". Preventative Care Review, 2020.
              </li>
              <li id="fn3" role="doc-footnote">
                3. Grant, K. Pilot program evaluation memorandum.
              </li>
              <li id="fn4" role="doc-footnote">
                4. Hernandez, P. Sensor-enabled ethnography. Field Methods, 2022.
              </li>
              <li id="fn5" role="doc-footnote">
                5. Ortega, J. Community-led outreach results. Public Health Letters, 2023.
              </li>
            </ol>
          </section>
        </article>
      `
    }
  ],
  [
    'preprint',
    {
      label: 'Preprint landing page',
      base: 'https://preprints.example.net/manuscript/ai-literature-review',
      params: { download: 'pdf', format: 'html' },
      sections: [
        { label: 'Summary', selector: 'section#summary' },
        { label: 'Background', selector: 'section#background' },
        { label: 'Findings', selector: 'section#findings' },
        { label: 'References', selector: 'section#endnotes' }
      ],
      html: `
        <article>
          <section id="summary">
            <h2>Summary</h2>
            <p>
              We provide an overview of emerging evaluation datasets for large language models
              <sup><a role="doc-noteref" href="#note1">1</a></sup> while examining model behavior in
              zero-shot conditions.
            </p>
          </section>
          <section id="background">
            <h2>Background</h2>
            <p>
              Contemporary approaches rely on synthetic benchmarks that do not always correlate
              with human preference studies <sup data-citation-id="c-bg-2" data-footnote-id="note2">2</sup>.
            </p>
          </section>
          <section id="findings">
            <h2>Findings</h2>
            <ul>
              <li>
                Pairwise human evaluation remains the most reliable indicator of deployment readiness
                <sup><a href="#note3" role="doc-noteref">3</a></sup>.
              </li>
              <li>
                Annotation costs can be reduced with expert-in-the-loop tooling
                <sup title="Workshop best practices" href="#note4">4</sup>.
              </li>
            </ul>
          </section>
          <section id="endnotes" role="doc-endnotes">
            <h2>Endnotes</h2>
            <div class="footnote-wrapper">
              <p id="note1" role="doc-footnote">1. Venkatesh, R. et al. Benchmarking LLMs. 2023.</p>
              <p id="note2" role="doc-footnote">2. Solis, P. Synthetic vs. human alignment. 2022.</p>
              <p id="note3" role="doc-footnote">3. Huang, M. et al. Human feedback loops. 2021.</p>
              <p id="note4" role="doc-footnote">4. Martinez, L. Expert annotation workshops. 2020.</p>
            </div>
          </section>
        </article>
      `
    }
  ],
  [
    'policy',
    {
      label: 'Policy brief',
      base: 'https://policy.example.gov/briefs/transportation-reform',
      params: { view: 'print' },
      sections: [
        { label: 'Executive Summary', selector: 'section#executive-summary' },
        { label: 'Key Recommendations', selector: 'section#recommendations' },
        { label: 'Appendix', selector: 'section#appendix' }
      ],
      html: `
        <article>
          <section id="executive-summary">
            <h2>Executive Summary</h2>
            <p>
              Transit ridership increased in cities that adopted congestion pricing models
              <sup data-citation-id="es-1"><a href="#ref-a">1</a></sup> while emissions decreased in
              low-income corridors <sup data-citation-id="es-2" data-footnote-id="ref-b">2</sup>.
            </p>
          </section>
          <section id="recommendations">
            <h2>Key Recommendations</h2>
            <ol>
              <li>
                Establish adaptive tolling schedules to balance throughput
                <sup aria-label="Funding analysis" href="#ref-c">3</sup>.
              </li>
              <li>
                Reinvest toll revenue into equitable mobility programs (see Appendix)
                <sup><a href="#ref-d">4</a></sup>.
              </li>
            </ol>
          </section>
          <section id="appendix">
            <h2>Appendix</h2>
            <p>
              Supplemental research materials are available upon request.
            </p>
          </section>
          <aside class="footnotes">
            <h2>References</h2>
            <ul>
              <li id="ref-a">1. City Mobility Lab. Congestion Pricing Evaluation. 2022.</li>
              <li id="ref-b">2. Rivera, T. Emissions after pricing. Climate Works, 2021.</li>
              <li id="ref-c">3. Lopez, J. Funding transportation transitions. Policy Forum, 2020.</li>
              <li id="ref-d">4. National Transit Council. Mobility Equity Fund. 2023.</li>
              <li id="ref-e">5. Advisory Committee on Urban Traffic. Interim Memo.</li>
            </ul>
          </aside>
        </article>
      `
    }
  ]
]);

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    results: [],
    isScraping: false,
    stopRequested: false,
    selectedModes: new Set(['inline-footnotes']),
    composedUrl: '',
    activeTab: 'document'
  };

  const baseUrlInput = document.querySelector('#base-url');
  const queryParamsContainer = document.querySelector('#query-params');
  const addParamButton = document.querySelector('#add-param');
  const composedUrlLink = document.querySelector('#composed-url');
  const quickLinkButtons = document.querySelectorAll('[data-quick-link]');
  const modeButtons = document.querySelectorAll('.mode-toggle .toggle-button');
  const sectionList = document.querySelector('#section-list');
  const customSectionInput = document.querySelector('#custom-section');
  const addSectionButton = document.querySelector('#add-section');
  const rawHtmlInput = document.querySelector('#raw-html');
  const startButton = document.querySelector('#start-scrape');
  const stopButton = document.querySelector('#stop-scrape');
  const progressBar = document.querySelector('#batch-progress');
  const progressLabel = document.querySelector('#progress-label');
  const activityLog = document.querySelector('#activity-log');
  const previewTabs = document.querySelectorAll('.preview-tab');
  const previewPanes = document.querySelectorAll('.preview-pane');
  const documentPreview = document.querySelector('#document-preview');
  const citationsPreview = document.querySelector('#citations-preview');
  const footnotesPreview = document.querySelector('#footnotes-preview');
  const exportButtons = document.querySelectorAll('[data-export]');
  const copyButton = document.querySelector('#copy-clipboard');
  const validationSummary = document.querySelector('#validation-summary');
  const validationList = document.querySelector('#validation-results');

  init();

  function init() {
    renderSections(DEFAULT_SECTIONS);
    resetParams();
    updateComposedUrl();
    setActivePreviewTab('document');
    renderEmptyPreviews();
    updateValidation();
    updateExportAvailability();
    progressLabel.textContent = 'Idle';
    attachEventListeners();
    logMessage('Ready. Load a preset or paste markup to begin.');
    applyQuickLink('sample-article');
  }

  function attachEventListeners() {
    baseUrlInput.addEventListener('input', updateComposedUrl);
    addParamButton.addEventListener('click', () => addQueryParamRow());

    quickLinkButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.quickLink;
        applyQuickLink(key);
      });
    });

    modeButtons.forEach((button) => {
      button.addEventListener('click', () => toggleMode(button));
    });

    addSectionButton.addEventListener('click', handleCustomSectionSubmit);
    customSectionInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleCustomSectionSubmit();
      }
    });

    startButton.addEventListener('click', startScraping);
    stopButton.addEventListener('click', stopScraping);

    previewTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        setActivePreviewTab(tab.dataset.previewTab);
      });
    });

    exportButtons.forEach((button) => {
      button.addEventListener('click', () => handleExport(button.dataset.export));
    });

    copyButton.addEventListener('click', copyMarkdownToClipboard);
  }

  function renderSections(sections) {
    sectionList.innerHTML = '';
    sections.forEach((section) => {
      createSectionOption(section.label, section.selector, true);
    });
  }

  function createSectionOption(label, selector = '', checked = false) {
    if (!label) {
      return;
    }
    const normalizedLabel = label.trim();
    const existing = Array.from(sectionList.querySelectorAll('input[name="sections"]')).find(
      (input) => input.dataset.label === normalizedLabel.toLowerCase() && (input.dataset.selector || '') === (selector || '')
    );
    if (existing) {
      existing.checked = checked;
      return existing;
    }

    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'sections';
    input.value = normalizedLabel;
    input.dataset.label = normalizedLabel.toLowerCase();
    if (selector) {
      input.dataset.selector = selector;
    }
    input.checked = checked;

    const textContainer = document.createElement('div');
    textContainer.className = 'option-text';
    const title = document.createElement('span');
    title.textContent = normalizedLabel;
    textContainer.appendChild(title);
    if (selector) {
      const detail = document.createElement('small');
      detail.textContent = selector;
      textContainer.appendChild(detail);
    }

    wrapper.append(input, textContainer);
    sectionList.appendChild(wrapper);
    return input;
  }

  function handleCustomSectionSubmit() {
    const rawValue = (customSectionInput.value || '').trim();
    if (!rawValue) {
      return;
    }
    const { label, selector } = parseSectionInput(rawValue);
    const added = createSectionOption(label, selector, true);
    if (added) {
      logMessage(`Added section “${label}”${selector ? ` with selector ${selector}` : ''}.`, 'success');
    }
    customSectionInput.value = '';
    customSectionInput.focus();
  }

  function parseSectionInput(value) {
    const [labelPart, selectorPart] = value.split('::');
    const label = (labelPart || value).trim();
    const selector = selectorPart ? selectorPart.trim() : '';
    return { label, selector };
  }

  function resetParams(params = {}) {
    queryParamsContainer.innerHTML = '';
    const entries = Object.entries(params);
    if (!entries.length) {
      addQueryParamRow();
      return;
    }
    entries.forEach(([key, value]) => addQueryParamRow(key, value));
  }

  function addQueryParamRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'param-row';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'parameter';
    keyInput.className = 'param-key';
    keyInput.value = key;

    const delimiter = document.createElement('span');
    delimiter.className = 'delimiter';
    delimiter.textContent = '=';

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'value';
    valueInput.className = 'param-value';
    valueInput.value = value;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'button button--ghost param-remove';
    removeButton.setAttribute('aria-label', 'Remove parameter');
    removeButton.textContent = '×';

    removeButton.addEventListener('click', () => {
      row.remove();
      updateComposedUrl();
    });

    keyInput.addEventListener('input', updateComposedUrl);
    valueInput.addEventListener('input', updateComposedUrl);

    row.append(keyInput, delimiter, valueInput, removeButton);
    queryParamsContainer.appendChild(row);
  }

  function collectQueryParams() {
    const entries = [];
    queryParamsContainer.querySelectorAll('.param-row').forEach((row) => {
      const key = row.querySelector('.param-key').value.trim();
      const value = row.querySelector('.param-value').value.trim();
      if (key) {
        entries.push([key, value]);
      }
    });
    return entries;
  }

  function composeUrl(base, params) {
    if (!base) {
      return '';
    }
    const search = new URLSearchParams();
    params.forEach(([key, value]) => {
      search.append(key, value);
    });
    const queryString = search.toString();
    if (!queryString) {
      return base;
    }
    const joiner = base.includes('?') ? '&' : '?';
    return `${base}${joiner}${queryString}`;
  }

  function updateComposedUrl() {
    const base = (baseUrlInput.value || '').trim();
    const params = collectQueryParams();
    const composed = composeUrl(base, params);
    composedUrlLink.textContent = composed || '—';
    composedUrlLink.href = composed || '#';
    state.composedUrl = composed;
  }

  function toggleMode(button) {
    const mode = button.dataset.mode;
    const isActive = button.classList.contains('toggle-button--active');
    if (isActive && state.selectedModes.size === 1) {
      logMessage('At least one scraping mode must remain active.', 'warning');
      return;
    }
    const willActivate = !isActive;
    button.classList.toggle('toggle-button--active', willActivate);
    button.setAttribute('aria-pressed', String(willActivate));
    if (willActivate) {
      state.selectedModes.add(mode);
    } else {
      state.selectedModes.delete(mode);
    }
    updatePreviews();
  }

  function applyQuickLink(key) {
    const preset = QUICK_LINKS.get(key);
    if (!preset) {
      logMessage(`Preset "${key}" is not available.`, 'error');
      return;
    }
    baseUrlInput.value = preset.base || '';
    resetParams(preset.params || {});
    renderSections(preset.sections || DEFAULT_SECTIONS);
    if (preset.html) {
      rawHtmlInput.value = preset.html.trim();
    }
    updateComposedUrl();
    logMessage(`Loaded preset: ${preset.label}.`, 'success');
  }

  function getSelectedSections() {
    return Array.from(sectionList.querySelectorAll('input[name="sections"]:checked')).map((input, index) => ({
      label: input.value,
      selector: input.dataset.selector || '',
      index
    }));
  }

  function setActivePreviewTab(tabName) {
    state.activeTab = tabName;
    previewTabs.forEach((tab) => {
      const isActive = tab.dataset.previewTab === tabName;
      tab.classList.toggle('preview-tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    previewPanes.forEach((pane) => {
      const isActive = pane.dataset.pane === tabName;
      pane.classList.toggle('preview-pane--active', isActive);
      pane.hidden = !isActive;
    });
  }

  function renderEmptyPreviews() {
    const placeholder = '<div class="empty-state">Run a scrape to view generated documents.</div>';
    documentPreview.innerHTML = placeholder;
    citationsPreview.innerHTML = placeholder;
    footnotesPreview.innerHTML = placeholder;
  }

  function startScraping() {
    if (state.isScraping) {
      return;
    }
    const sections = getSelectedSections();
    if (!sections.length) {
      logMessage('Select at least one section before starting.', 'error');
      return;
    }

    const sourceHtml = (rawHtmlInput.value || '').trim();
    if (!sourceHtml) {
      logMessage('Source markup is empty. Parsing will likely return warnings.', 'warning');
    }

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(sourceHtml || '<article></article>', 'text/html');
    if (parsedDocument.querySelector('parsererror')) {
      logMessage('Unable to parse the provided HTML snippet.', 'error');
      return;
    }

    state.results = [];
    state.stopRequested = false;
    state.isScraping = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    progressBar.max = Math.max(sections.length, 1);
    progressBar.value = 0;
    progressLabel.textContent = `Queued ${sections.length} section${sections.length === 1 ? '' : 's'}.`;
    renderEmptyPreviews();
    updateValidation();
    updateExportAvailability();
    logMessage('Starting scrape run…');

    runScrape(parsedDocument, sections).catch((error) => {
      console.error(error);
      logMessage(`Unexpected error: ${error.message}`, 'error');
    });
  }

  async function runScrape(doc, sections) {
    for (let index = 0; index < sections.length; index += 1) {
      if (state.stopRequested) {
        logMessage('Stop requested. Finishing current section before exiting.', 'warning');
        break;
      }
      const section = sections[index];
      progressLabel.textContent = `Processing ${section.label} (${index + 1}/${sections.length})`;
      logMessage(`Processing ${section.label}…`);
      try {
        const result = await processSection(doc, section, index, sections.length);
        state.results.push(result);
        logMessage(`Completed ${section.label}.`, 'success');
      } catch (error) {
        console.error(error);
        logMessage(`Failed to process ${section.label}: ${error.message}`, 'error');
      }
      progressBar.value = index + 1;
      updatePreviews();
      updateValidation();
      updateExportAvailability();
      await simulateProcessingDelay(180);
    }

    state.isScraping = false;
    startButton.disabled = false;
    stopButton.disabled = true;

    if (state.stopRequested) {
      logMessage('Scrape run stopped by user.', 'warning');
      progressLabel.textContent = 'Stopped by user.';
    } else {
      logMessage('Scrape run complete.', 'success');
      progressLabel.textContent = `Completed ${state.results.length}/${sections.length} section${sections.length === 1 ? '' : 's'}.`;
    }

    state.stopRequested = false;
  }

  function stopScraping() {
    if (!state.isScraping) {
      return;
    }
    state.stopRequested = true;
    stopButton.disabled = true;
    logMessage('Stop requested. Awaiting current section to finish…', 'warning');
    progressLabel.textContent = 'Stop requested…';
  }

  async function processSection(doc, section, index) {
    await simulateProcessingDelay(220 + Math.random() * 160);
    const extraction = extractSection(doc, section);
    const citations = extractCitations(extraction.fragment, doc);
    return {
      sectionLabel: section.label,
      selector: section.selector,
      index,
      url: state.composedUrl,
      html: extraction.html,
      markdown: extraction.markdown,
      text: extraction.text,
      modes: Array.from(state.selectedModes),
      warnings: extraction.warnings,
      citations
    };
  }

  function extractSection(doc, section) {
    const warnings = [];
    let fragment = document.createElement('div');

    if (section.selector) {
      const node = doc.querySelector(section.selector);
      if (node) {
        fragment.appendChild(node.cloneNode(true));
      } else {
        warnings.push(`Selector "${section.selector}" not found.`);
      }
    }

    if (!section.selector || fragment.childNodes.length === 0) {
      const heading = locateHeading(doc, section.label) || fallbackSectionNode(doc, section.label);
      if (heading) {
        fragment = buildFragmentFromHeading(heading);
      } else if (!section.selector) {
        warnings.push(`Heading for "${section.label}" not found.`);
      }
    }

    const html = fragment.innerHTML.trim();
    const text = fragment.textContent.replace(/\s+/g, ' ').trim();
    const markdown = html ? fragmentToMarkdown(fragment) : '';
    if (!html) {
      warnings.push('No content captured for this section.');
    }
    return { fragment, html, text, markdown, warnings };
  }

  function locateHeading(doc, label) {
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const normalizedTarget = normalizeText(label);
    let fallback = null;
    for (const heading of headings) {
      const normalizedHeading = normalizeText(heading.textContent);
      if (normalizedHeading === normalizedTarget) {
        return heading;
      }
      if (!fallback && normalizedHeading.includes(normalizedTarget)) {
        fallback = heading;
      }
    }
    return fallback;
  }

  function fallbackSectionNode(doc, label) {
    const slug = slugify(label);
    return doc.getElementById(slug) || doc.querySelector(`[data-section="${slug}"]`);
  }

  function buildFragmentFromHeading(heading) {
    const container = document.createElement('div');
    const level = parseInt(heading.tagName.replace('H', ''), 10);
    container.appendChild(heading.cloneNode(true));
    let sibling = heading.nextElementSibling;
    while (sibling) {
      if (/^H[1-6]$/.test(sibling.tagName)) {
        const siblingLevel = parseInt(sibling.tagName.replace('H', ''), 10);
        if (siblingLevel <= level) {
          break;
        }
      }
      container.appendChild(sibling.cloneNode(true));
      sibling = sibling.nextElementSibling;
    }
    return container;
  }

  function fragmentToMarkdown(fragment) {
    const lines = [];
    fragment.childNodes.forEach((node) => convertNodeToMarkdown(node, lines, 0));
    return lines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function convertNodeToMarkdown(node, lines, depth) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (text) {
        lines.push(text);
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const tag = node.tagName.toUpperCase();
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    switch (tag) {
      case 'H1':
        lines.push(`# ${text}`);
        break;
      case 'H2':
        lines.push(`## ${text}`);
        break;
      case 'H3':
        lines.push(`### ${text}`);
        break;
      case 'H4':
        lines.push(`#### ${text}`);
        break;
      case 'P':
        lines.push(text);
        break;
      case 'BLOCKQUOTE': {
        const quoteLines = text.split(/\n+/).map((part) => `> ${part.trim()}`).join('\n');
        lines.push(quoteLines);
        break;
      }
      case 'UL': {
        Array.from(node.children).forEach((child) => {
          if (child.tagName && child.tagName.toUpperCase() === 'LI') {
            const childLines = [];
            child.childNodes.forEach((grandChild) => convertNodeToMarkdown(grandChild, childLines, depth + 1));
            const content = childLines.join(' ').trim();
            lines.push(`${'  '.repeat(depth)}- ${content}`);
          }
        });
        break;
      }
      case 'OL': {
        Array.from(node.children).forEach((child, index) => {
          if (child.tagName && child.tagName.toUpperCase() === 'LI') {
            const childLines = [];
            child.childNodes.forEach((grandChild) => convertNodeToMarkdown(grandChild, childLines, depth + 1));
            const content = childLines.join(' ').trim();
            lines.push(`${'  '.repeat(depth)}${index + 1}. ${content}`);
          }
        });
        break;
      }
      case 'TABLE':
        lines.push(text);
        break;
      default:
        Array.from(node.childNodes).forEach((child) => convertNodeToMarkdown(child, lines, depth));
    }
  }

  function extractCitations(fragment, doc) {
    const inline = [];
    const inlineSelectors = ['sup', 'a[role="doc-noteref"]', 'a[href^="#fn"]', 'span[data-citation-id]', 'span.citation'];
    const inlineNodes = fragment
      ? Array.from(new Set(Array.from(fragment.querySelectorAll(inlineSelectors.join(',')))))
      : [];
    const inlineFootnoteIds = new Set();

    inlineNodes.forEach((node) => {
      const citation = parseInlineCitation(node, doc);
      if (!citation) {
        return;
      }
      inline.push(citation);
      if (citation.footnoteId) {
        inlineFootnoteIds.add(citation.footnoteId);
      }
    });

    const footnotes = collectFootnotes(doc);
    const missingFootnotes = inline.filter((item) => item.footnoteId && !footnotes.find((fn) => fn.id === item.footnoteId));
    const unreferencedFootnotes = footnotes.filter((item) => item.id && !inlineFootnoteIds.has(item.id));
    const inlineWithoutNumbers = inline.filter((item) => !item.number);
    const footnotesWithoutNumbers = footnotes.filter((item) => !item.number);

    return {
      inline,
      footnotes,
      missingFootnotes,
      unreferencedFootnotes,
      inlineWithoutNumbers,
      footnotesWithoutNumbers
    };
  }

  function parseInlineCitation(node, doc) {
    const citation = {
      id: node.id || node.getAttribute('data-citation-id') || node.getAttribute('name') || '',
      number: null,
      footnoteId: null,
      text: node.textContent.replace(/\s+/g, ' ').trim(),
      html: node.outerHTML.trim(),
      tooltip: ''
    };

    let href = '';
    if (node.tagName && node.tagName.toUpperCase() === 'A') {
      href = node.getAttribute('href') || '';
    } else {
      const anchor = node.querySelector('a[href]');
      if (anchor) {
        href = anchor.getAttribute('href') || '';
        if (!citation.id) {
          citation.id = anchor.id || anchor.getAttribute('name') || '';
        }
      }
    }

    if (!href) {
      const fallbackHref = node.getAttribute('href');
      if (fallbackHref) {
        href = fallbackHref;
      }
    }

    if (href && href.startsWith('#')) {
      citation.footnoteId = href.slice(1);
    } else if (node.dataset && node.dataset.footnoteId) {
      citation.footnoteId = node.dataset.footnoteId;
    }

    const numberMatch = citation.text.match(/\d+/);
    citation.number = numberMatch ? numberMatch[0] : null;

    citation.tooltip =
      node.getAttribute('data-tooltip') ||
      node.getAttribute('title') ||
      node.getAttribute('aria-label') ||
      '';

    if (!citation.tooltip && citation.footnoteId) {
      const footnote = doc.getElementById(citation.footnoteId);
      if (footnote) {
        citation.tooltip = footnote.textContent.replace(/\s+/g, ' ').trim();
      }
    }

    return citation;
  }

  function collectFootnotes(doc) {
    const selectors = [
      '[role="doc-footnote"]',
      'section[role="doc-endnotes"] li',
      'ol.footnotes li',
      'div.footnote',
      'li[id^="fn"]',
      'p[id^="fn"]',
      'li[id^="ref"]',
      'li[id^="note"]'
    ];
    const seen = new Set();
    const results = [];

    selectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((node) => {
        let id = node.id || node.getAttribute('data-footnote-id') || '';
        let generated = false;
        if (!id) {
          generated = true;
          id = `footnote-${results.length + 1}`;
          while (seen.has(id)) {
            id = `footnote-${results.length + 1}-${Math.floor(Math.random() * 1000)}`;
          }
        }
        if (seen.has(id)) {
          return;
        }
        seen.add(id);
        const text = node.textContent.replace(/\s+/g, ' ').trim();
        const numberMatch = text.match(/^(\[)?(\d+)[\]\.:\s]/);
        const number = numberMatch ? numberMatch[2] : null;
        results.push({
          id,
          number,
          text,
          html: node.innerHTML.trim(),
          generated
        });
      });
    });

    results.sort((a, b) => {
      if (a.number && b.number) {
        return Number(a.number) - Number(b.number);
      }
      return a.id.localeCompare(b.id);
    });

    return results;
  }

  function updatePreviews() {
    if (!state.results.length) {
      renderEmptyPreviews();
      return;
    }

    renderDocumentPreview();
    renderCitationsPreview();
    renderFootnotesPreview();
  }

  function renderDocumentPreview() {
    documentPreview.innerHTML = '';
    state.results.forEach((result) => {
      const block = document.createElement('article');
      block.className = 'result-block';

      const header = document.createElement('div');
      header.className = 'result-block__header';
      const title = document.createElement('h3');
      title.textContent = result.sectionLabel;
      header.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'result-block__meta';
      meta.appendChild(createPill(`${result.citations.inline.length} inline`));
      meta.appendChild(createPill(`${result.citations.footnotes.length} footnotes`));
      result.modes.forEach((mode) => {
        const modePill = createPill(mode.replace(/-/g, ' '));
        modePill.classList.add('pill--mode');
        meta.appendChild(modePill);
      });
      header.appendChild(meta);
      block.appendChild(header);

      if (result.selector) {
        const selectorNote = document.createElement('div');
        selectorNote.className = 'muted';
        selectorNote.textContent = `Selector: ${result.selector}`;
        block.appendChild(selectorNote);
      }

      if (result.warnings.length) {
        const warningsList = document.createElement('ul');
        warningsList.className = 'result-block__warnings';
        result.warnings.forEach((warning) => {
          const item = document.createElement('li');
          item.textContent = warning;
          warningsList.appendChild(item);
        });
        block.appendChild(warningsList);
      }

      const htmlContainer = document.createElement('div');
      htmlContainer.className = 'result-block__html';
      if (result.html) {
        htmlContainer.innerHTML = result.html;
      } else {
        htmlContainer.innerHTML = '<p class="muted">No markup captured for this section.</p>';
      }
      block.appendChild(htmlContainer);

      const markdownDetails = document.createElement('details');
      markdownDetails.innerHTML = `<summary>Show Markdown</summary><pre>${escapeHtml(result.markdown || '_No Markdown available_')}</pre>`;
      block.appendChild(markdownDetails);

      const textDetails = document.createElement('details');
      textDetails.innerHTML = `<summary>Show plain text</summary><pre>${escapeHtml(result.text || '')}</pre>`;
      block.appendChild(textDetails);

      documentPreview.appendChild(block);
    });
  }

  function renderCitationsPreview() {
    citationsPreview.innerHTML = '';
    state.results.forEach((result) => {
      const block = document.createElement('article');
      block.className = 'result-block';
      const header = document.createElement('div');
      header.className = 'result-block__header';
      const title = document.createElement('h3');
      title.textContent = result.sectionLabel;
      header.appendChild(title);
      block.appendChild(header);

      if (!result.citations.inline.length) {
        const empty = document.createElement('p');
        empty.className = 'muted';
        empty.textContent = 'No inline citations detected.';
        block.appendChild(empty);
      } else {
        const table = document.createElement('table');
        table.className = 'preview-table';
        table.innerHTML = '<thead><tr><th>#</th><th>Inline reference</th><th>Footnote</th></tr></thead>';
        const tbody = document.createElement('tbody');
        result.citations.inline.forEach((citation) => {
          const row = document.createElement('tr');
          const numberCell = document.createElement('td');
          numberCell.textContent = citation.number || '—';
          const textCell = document.createElement('td');
          textCell.textContent = citation.text || citation.html;
          const footnoteCell = document.createElement('td');
          footnoteCell.textContent = citation.footnoteId ? `#${citation.footnoteId}` : 'Unlinked';
          if (citation.tooltip) {
            const detail = document.createElement('small');
            detail.textContent = citation.tooltip;
            footnoteCell.appendChild(detail);
          }
          row.append(numberCell, textCell, footnoteCell);
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        block.appendChild(table);
      }

      citationsPreview.appendChild(block);
    });
  }

  function renderFootnotesPreview() {
    footnotesPreview.innerHTML = '';
    state.results.forEach((result) => {
      const block = document.createElement('article');
      block.className = 'result-block';
      const header = document.createElement('div');
      header.className = 'result-block__header';
      const title = document.createElement('h3');
      title.textContent = result.sectionLabel;
      header.appendChild(title);
      block.appendChild(header);

      if (!result.citations.footnotes.length) {
        const empty = document.createElement('p');
        empty.className = 'muted';
        empty.textContent = 'No footnotes captured for this section.';
        block.appendChild(empty);
      } else {
        const list = document.createElement('ol');
        result.citations.footnotes.forEach((footnote) => {
          const item = document.createElement('li');
          item.innerHTML = `<strong>${escapeHtml(footnote.number || footnote.id)}</strong> ${escapeHtml(footnote.text)}`;
          if (footnote.generated) {
            const generated = document.createElement('small');
            generated.className = 'muted';
            generated.textContent = ' (generated identifier)';
            item.appendChild(generated);
          }
          list.appendChild(item);
        });
        block.appendChild(list);
      }

      footnotesPreview.appendChild(block);
    });
  }

  function updateValidation() {
    validationList.innerHTML = '';
    if (!state.results.length) {
      validationSummary.textContent = 'No documents generated yet.';
      return;
    }

    let totalIssues = 0;

    state.results.forEach((result) => {
      const entry = document.createElement('li');
      entry.className = 'validation-entry';
      const title = document.createElement('h4');
      title.textContent = result.sectionLabel;
      entry.appendChild(title);

      const issues = [];
      const { missingFootnotes, unreferencedFootnotes, inlineWithoutNumbers, footnotesWithoutNumbers } = result.citations;

      if (missingFootnotes.length) {
        totalIssues += missingFootnotes.length;
        issues.push(`${missingFootnotes.length} inline reference${missingFootnotes.length === 1 ? '' : 's'} missing footnotes (${missingFootnotes
          .map((item) => item.number || item.footnoteId || '?')
          .join(', ')})`);
      }
      if (unreferencedFootnotes.length) {
        totalIssues += unreferencedFootnotes.length;
        issues.push(`${unreferencedFootnotes.length} footnote${unreferencedFootnotes.length === 1 ? '' : 's'} without inline references (${unreferencedFootnotes
          .map((item) => item.number || item.id)
          .join(', ')})`);
      }
      if (inlineWithoutNumbers.length) {
        totalIssues += inlineWithoutNumbers.length;
        issues.push(`${inlineWithoutNumbers.length} inline citation${inlineWithoutNumbers.length === 1 ? '' : 's'} missing numbers.`);
      }
      if (footnotesWithoutNumbers.length) {
        totalIssues += footnotesWithoutNumbers.length;
        issues.push(`${footnotesWithoutNumbers.length} footnote${footnotesWithoutNumbers.length === 1 ? '' : 's'} missing numbers.`);
      }
      if (result.warnings.length) {
        issues.push(...result.warnings);
      }

      if (!issues.length) {
        entry.classList.add('validation-entry--ok');
        entry.appendChild(document.createTextNode('All inline references map to footnotes.'));
      } else {
        entry.classList.add('validation-entry--warning');
        const list = document.createElement('ul');
        issues.forEach((issue) => {
          const item = document.createElement('li');
          item.textContent = issue;
          list.appendChild(item);
        });
        entry.appendChild(list);
      }

      validationList.appendChild(entry);
    });

    if (totalIssues === 0) {
      validationSummary.textContent = '✅ All inline citations are paired with matching footnotes.';
    } else {
      validationSummary.textContent = `⚠️ Detected ${totalIssues} validation issue${totalIssues === 1 ? '' : 's'} across ${state.results.length} section${state.results.length === 1 ? '' : 's'}.`;
    }
  }

  function updateExportAvailability() {
    const hasResults = state.results.length > 0;
    exportButtons.forEach((button) => {
      button.disabled = !hasResults;
    });
    copyButton.disabled = !hasResults;
  }

  function handleExport(type) {
    if (!state.results.length) {
      logMessage('Generate at least one document before exporting.', 'warning');
      return;
    }
    const payload = getExportPayload();
    let content = '';
    let mime = 'text/plain';
    let filename = `scraper-export-${Date.now()}`;

    switch (type) {
      case 'json':
        content = JSON.stringify(payload, null, 2);
        mime = 'application/json';
        filename += '.json';
        break;
      case 'markdown':
        content = buildMarkdownDocument(payload);
        mime = 'text/markdown';
        filename += '.md';
        break;
      case 'html':
        content = buildHtmlDocument(payload);
        mime = 'text/html';
        filename += '.html';
        break;
      case 'bibtex':
        content = buildBibtexDocument(payload);
        mime = 'application/x-bibtex';
        filename += '.bib';
        break;
      default:
        logMessage(`Unknown export type: ${type}`, 'error');
        return;
    }

    downloadFile(filename, content, mime);
    logMessage(`Exported ${type.toUpperCase()} file.`, 'success');
  }

  async function copyMarkdownToClipboard() {
    if (!state.results.length) {
      logMessage('Nothing to copy yet. Run a scrape first.', 'warning');
      return;
    }
    const payload = getExportPayload();
    const markdown = buildMarkdownDocument(payload);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(markdown);
        logMessage('Markdown copied to clipboard.', 'success');
        return;
      } catch (error) {
        console.warn('Clipboard API failed, falling back to execCommand.', error);
      }
    }

    const tempArea = document.createElement('textarea');
    tempArea.value = markdown;
    tempArea.setAttribute('readonly', 'readonly');
    tempArea.style.position = 'absolute';
    tempArea.style.left = '-9999px';
    document.body.appendChild(tempArea);
    tempArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(tempArea);
    if (copied) {
      logMessage('Markdown copied to clipboard.', 'success');
    } else {
      logMessage('Clipboard copy is not supported in this browser.', 'error');
    }
  }

  function getExportPayload() {
    return {
      generatedAt: new Date().toISOString(),
      sourceUrl: state.composedUrl,
      modes: Array.from(state.selectedModes),
      results: state.results
    };
  }

  function buildMarkdownDocument(payload) {
    const lines = ['# Citation Scraper Export'];
    if (payload.sourceUrl) {
      lines.push('', `Source: ${payload.sourceUrl}`);
    }
    if (payload.modes.length) {
      lines.push('', `Modes: ${payload.modes.join(', ')}`);
    }
    payload.results.forEach((result) => {
      lines.push('', `## ${result.sectionLabel}`);
      lines.push('', result.markdown || '_No content captured._');
      if (result.citations.inline.length) {
        lines.push('', '**Inline citations**');
        result.citations.inline.forEach((citation) => {
          const target = citation.footnoteId ? `#${citation.footnoteId}` : 'unlinked';
          const detail = citation.tooltip ? ` — ${citation.tooltip}` : '';
          lines.push(`- ${citation.number || '—'} → ${target}${detail}`);
        });
      }
      if (result.citations.footnotes.length) {
        lines.push('', '**Footnotes**');
        result.citations.footnotes.forEach((footnote) => {
          lines.push(`- ${footnote.number || footnote.id}: ${footnote.text}`);
        });
      }
    });
    return lines.join('\n').trim();
  }

  function buildHtmlDocument(payload) {
    const sections = payload.results
      .map((result) => {
        const citationsHtml = renderCitationHtml(result.citations);
        const sectionHtml = result.html || '<p><em>No content captured.</em></p>';
        return `<section data-section="${escapeHtmlAttr(slugify(result.sectionLabel))}">
  <h2>${escapeHtml(result.sectionLabel)}</h2>
  ${sectionHtml}
  ${citationsHtml}
</section>`;
      })
      .join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Citation Scraper Export</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; background: #f8fafc; padding: 2rem; }
      h1 { margin-top: 0; }
      section { margin-bottom: 2rem; background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
      ul { padding-left: 1.25rem; }
      em { color: #6b7280; }
      .citations { margin-top: 1rem; }
    </style>
  </head>
  <body>
    <h1>Citation Scraper Export</h1>
    <p><strong>Source:</strong> ${payload.sourceUrl ? `<a href="${escapeHtmlAttr(payload.sourceUrl)}">${escapeHtml(payload.sourceUrl)}</a>` : 'Not specified'}</p>
    <p><strong>Modes:</strong> ${payload.modes.join(', ') || 'None'}</p>
    ${sections}
  </body>
</html>`;
  }

  function renderCitationHtml(citations) {
    let html = '<div class="citations">';
    if (citations.inline.length) {
      html += '<h3>Inline citations</h3><ul>';
      citations.inline.forEach((citation) => {
        const target = citation.footnoteId ? `#${citation.footnoteId}` : 'unlinked';
        const detail = citation.tooltip ? ` — ${escapeHtml(citation.tooltip)}` : '';
        html += `<li>${escapeHtml(citation.number || '—')} → ${escapeHtml(target)}${detail}</li>`;
      });
      html += '</ul>';
    }
    if (citations.footnotes.length) {
      html += '<h3>Footnotes</h3><ul>';
      citations.footnotes.forEach((footnote) => {
        html += `<li><strong>${escapeHtml(footnote.number || footnote.id)}</strong> ${escapeHtml(footnote.text)}</li>`;
      });
      html += '</ul>';
    }
    html += '</div>';
    return html;
  }

  function buildBibtexDocument(payload) {
    const entries = [];
    payload.results.forEach((result, sectionIndex) => {
      result.citations.footnotes.forEach((footnote, index) => {
        const key = `${slugify(result.sectionLabel)}_${sectionIndex + 1}_${index + 1}`.replace(/-/g, '_');
        entries.push(`@misc{${key},
  title = {${escapeBibtex(result.sectionLabel)}},
  note = {${escapeBibtex(footnote.text)}},
  howpublished = {${escapeBibtex(payload.sourceUrl || 'Unknown source')}},
  year = {${new Date().getFullYear()}},
  annote = {Generated by Citation Scraper}
}`);
      });
    });
    return entries.join('\n\n') || '% No footnotes extracted.';
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function logMessage(message, type = 'info') {
    if (!activityLog) {
      return;
    }
    const entry = document.createElement('li');
    entry.className = 'activity-log__entry';
    if (type === 'success') {
      entry.classList.add('activity-log__entry--success');
    } else if (type === 'error') {
      entry.classList.add('activity-log__entry--error');
    } else if (type === 'warning') {
      entry.classList.add('activity-log__entry--warning');
    }
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    activityLog.prepend(entry);
    while (activityLog.children.length > 60) {
      activityLog.removeChild(activityLog.lastChild);
    }
  }

  function createPill(text) {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = text;
    return pill;
  }

  function simulateProcessingDelay(base) {
    return new Promise((resolve) => {
      setTimeout(resolve, base + Math.random() * 200);
    });
  }

  function slugify(value) {
    return (value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  function normalizeText(value) {
    return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return (value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeHtmlAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function escapeBibtex(value) {
    return (value || '')
      .replace(/\\/g, '\\\\')
      .replace(/[{}]/g, (match) => `\\${match}`)
      .replace(/\s+/g, ' ')
      .trim();
  }
});
