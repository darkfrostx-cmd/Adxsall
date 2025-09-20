# ADXS Knowledge Scraper Workspace

This repository provides a browser-based interface for collecting structured content from the ADXS.org knowledge base. The tool works entirely in the browser — no server or backend code is required.

## Getting started

1. **Open the interface**
   - Double-click `index.html` or open it in your preferred browser via `File → Open`. Modern Chromium-based browsers work best. If your browser blocks `fetch` requests for local files, launch a lightweight static server (for example `python -m http.server`) from the project directory and visit `http://localhost:8000/index.html`.

2. **Configure the scrape**
   - The **Base URL** defaults to `https://www.adxs.org`. Update it if you want to target a staging or mirrored host.
   - Choose a **scraping mode**:
     - **Single page**: captures only the first path in the list (or the base URL when the list is empty).
     - **Section crawl**: iterates through every path you provide, optimised for anchor-heavy article sections.
     - **Batch list**: scrapes each path in sequence and reports progress for multi-page collections.
   - Supply one relative path per line in the **Paths to scrape** area. Leave the field empty to scrape the base URL.
   - Toggle capture options for inline citations, tooltip text, and footnotes/endnotes.

3. **Run and monitor**
   - Use **Start** to begin the session. **Pause** temporarily suspends requests; tap **Resume** to continue, or **Stop** to cancel the remainder of the batch.
   - The progress meter and log tab display active URLs, request outcomes, and any network issues.
   - The preview tab surfaces key sections from each page, while the statistics tab aggregates counts for sections, citations, tooltips, footnotes, and total words.

4. **Work with the results**
   - Export buttons generate downloads in JSON, Markdown, HTML, and BibTeX formats. Each export reflects the current batch results only.
   - Use **Copy summary** to place a compact overview of the batch on your clipboard for quick sharing.
   - All scraped data stays in memory until you refresh the page or start a new session.

## Notes

- Scraping honours the same-origin policy enforced by your browser. If ADXS.org blocks cross-origin requests, run the interface from a local server or consult the network console for troubleshooting tips.
- Large batches are throttled slightly between requests to keep the site responsive. Adjust the supplied paths to tune throughput.
- The UI is responsive and adapts to smaller screens, making it suitable for tablet-based reviews.
