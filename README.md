# Citation Scraper Control Room

The Citation Scraper Control Room is a browser-based workspace for composing article URLs, configuring scraping modes, extracting inline citations/footnotes, and validating the resulting references before exporting structured datasets.

## Getting started

1. Clone or download this repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, or Safari). No build step is required; all assets are static.

## Workspace overview

The interface is split into two columns:

- **Configuration panels** (left) include URL composition tools, scraping mode toggles, section selection, and batch controls.
- **Results panels** (right) display live previews, export utilities, and the validation/self-check summary.

### Source URL & query parameters

- Enter the base address of the page you want to scrape.
- Add query parameters via the **Add parameter** button. Each row lets you specify a `key=value` pair; remove a row with the `×` button.
- The composed URL preview updates automatically and can be opened in a new tab.

### Quick link presets

Use the “Sample journal article”, “Preprint landing page”, or “Policy brief” shortcuts to load example configurations. Presets populate the URL, recommended sections, and sample HTML so you can explore the toolkit immediately.

### Scraping modes

Toggle the scraping strategies you want to apply:

- **Inline & footnotes** (always enabled) parses superscript references and footnotes.
- **Simulate hover tooltips** inspects tooltip/aria attributes to capture hover-only citation text.
- **Batch runner** indicates that you will run multiple sections in sequence.
- **Save HTML snapshots** preserves section markup inside the result payload.

At least one mode must remain active. The active modes are stored with each generated document and appear as badges in the preview.

### Section selection

- Choose which subsections of the article to capture. The defaults cover common scholarly headings.
- Add custom selectors with `Title::CSS selector` (for example `Related Work::section#related-work`). The selector portion is optional; without it the scraper matches headings by text.
- Select multiple sections to generate a separate document for each.

### Source markup

Paste the article’s HTML into the **Source markup** textarea. The scraper works entirely client-side, so providing markup is required for parsing inline citations and footnotes. Presets include sample HTML to experiment with.

### Batch controls

- **Start scraping** kicks off the section-by-section runner. A progress bar and activity log show the current status.
- **Stop** requests cancellation after the current section finishes processing.
- The activity log records informational, warning, and error messages for troubleshooting.

## Previews & exports

- Use the **Documents**, **Inline citations**, and **Footnotes** tabs to inspect results. Each section preview includes captured HTML, Markdown, and plain-text versions.
- Export the dataset as JSON, Markdown, HTML, or BibTeX. Files include metadata (source URL, modes, timestamps) plus the normalized citation structures.
- **Copy Markdown to clipboard** provides a quick summary for pasting into notes or reports.

## Validation & self-check

The validation panel verifies citation integrity for each generated document:

- ✅ Sections with matching inline citations and footnotes show a green success pill.
- ⚠️ Warnings enumerate issues such as inline references without footnotes, unreferenced footnotes, or missing citation numbers.
- Section-level warnings (e.g., missing selectors) also appear in the panel.

Use this feedback to repair markup before exporting.

## Tips

- Hover simulation uses tooltip, title, and aria-label attributes—ensure your markup exposes these attributes for accurate extraction.
- You can re-run the scraper with adjusted sections or modes at any time; the most recent run replaces previous previews.
- Combine exports: for example, download JSON for programmatic use and Markdown for human review.

Enjoy the streamlined citation auditing workflow!
