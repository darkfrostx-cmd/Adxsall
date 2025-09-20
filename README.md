# Adxsall Citation Scraper

This project demonstrates a lightweight scraping review tool that pairs a HTML
preview with automated validation. Paste article markup into the UI, run the
scraper, and the app will:

- Extract superscript citation markers, tooltip/hover content, and footnotes.
- Run bidirectional validation between the citations, tooltips, and endnotes.
- Surface successes, warnings, and errors in the **Validation** preview pane.
- Produce JSON and Markdown exports that embed the validation report so
  downstream tooling can double-check the self-audit results.

## Usage

1. Open `index.html` in a modern browser.
2. Paste the article HTML into the input textarea.
3. Click **Scrape & Validate** to populate the content preview, validation
   summary, and export panes.
4. Use **Export Report** to download the JSON and Markdown payloads.

## Validation Checks

The validation routine inspects the scraped data and verifies that:

- Every superscript citation links to a captured tooltip/hover entry (inline or
  in a tooltip container).
- Each citation references a matching footnote entry and the numbering stays in
  sync.
- Footnote and tooltip collections do not contain orphan entries.
- Summary statistics highlight coverage and mismatches so teams can triage
  issues quickly.

## Development

Install Node.js (v18+) if you want to run the syntax check script locally.

```bash
npm test
```

The command simply parses `script.js` with Node to ensure the file has no syntax
errors.
