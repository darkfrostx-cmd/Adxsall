# ADXS Knowledge Scraper Workspace

An interactive browser application for harvesting structured content from the ADXS.org knowledge base. The UI combines a sitemap-driven section selector, citation and tooltip validation, custom document assembly, and responsive styling so it stays usable on large desktop monitors and smaller Android screens.

> **Why a helper server?** ADXS.org does not send permissive CORS headers, so browsers block direct cross-origin `fetch` calls. The included Node helper server proxies requests locally, giving the front-end safe access to the remote HTML.

## Prerequisites

- [Node.js 18+](https://nodejs.org/) (includes `npm` and the global `fetch` API used by the proxy)
- A modern Chromium- or Firefox-based browser. Chrome/Firefox for Android work well when you follow the mobile guide below.

## Guided setup (desktop & laptop)

1. **Download the project** – clone the repository or unzip it into a folder on your machine.
2. **Install dependencies**
   ```bash
   npm install
   ```
   This pulls in Express (for the proxy/static server) and its minimal dependency tree.
3. **Start the helper server**
   ```bash
   npm run dev
   ```
   Leave this terminal window running. The server listens on [http://localhost:3000](http://localhost:3000), serves the UI, and exposes `/api/fetch` for proxied ADXS requests.
4. **Open the UI** – visit `http://localhost:3000` in your browser. The blue proxy warning in the configuration panel disappears once the app detects it is being served over HTTP/HTTPS.

## Using the sitemap selector

The **Site structure** panel (left column) loads the live ADXS sitemap so you can curate a batch before scraping:

- Click **Refresh sitemap** after changing the base URL or language. The panel automatically expands the categories pulled from `/en/sitemap` (or `/de/sitemap` if you switch languages).
- Tick the checkboxes next to sections and subsections to add them to the scraping queue. Chips under the summary show the most recent selections.
- Use the toolbar buttons to select everything, clear the current selection, or expand/collapse the category groups. Group-level buttons let you capture or clear one topic cluster at a time.
- The selections feed directly into the next run. You can still paste manual paths in the “Paths to scrape” textarea—both sources are merged and de-duplicated when you click **Start**.

## Running a scrape

1. **Base URL** – defaults to `https://www.adxs.org`. Point it at a mirrored host if required.
2. **Scraping mode** – choose between *Single page*, *Section crawl*, or *Batch list*. Single mode only processes the first queued path; the other modes walk every entry.
3. **Paths to scrape** – optionally add one relative or absolute URL per line. Leave the field empty to rely entirely on the sitemap selection.
4. **Capture options** – toggle inline citations, tooltip text (including `data-tippy-content` popovers), and footnotes/endnotes. Leaving them enabled maximises validation coverage.
5. **Controls** – click **Start** to begin. **Pause** temporarily suspends the queue; click again to resume. **Stop** cancels the remaining URLs.
6. **Monitor progress** – the tabs in the Results panel show previews, aggregate statistics, validation findings, assembled documents, and the fetch log. Export buttons become active once at least one page succeeds.

## Building custom documents

Use the **Documents** tab after a run finishes:

1. Expand a page, tick the sections you want, and repeat across as many pages as required.
2. Provide a descriptive name and click **Create document from selected sections**. The app stores the document (including metadata, word counts, and originating pages) in memory.
3. Repeat to build multiple focused packets. Remove a document at any time with the **Remove** button.
4. Export individual documents as Markdown, HTML, or JSON directly from each card.

Selections persist until you clear them or start a new scraping session. The **Clear selection** button in the tab resets the section checkboxes without deleting existing documents.

## Exporting results

The buttons in the **Results** header generate full-batch exports:

- **JSON** – structured data for downstream scripting.
- **Markdown / HTML** – human-readable summaries with sections, citations, footnotes, and validation notes.
- **BibTeX** – quick reference entries for bibliographic tools.
- **Copy summary** – copies a compact per-page overview (counts plus validation status) to the clipboard.

Exports reflect the current batch in memory. Start a new scrape to reset the dataset.

## Android quick start

You can run the helper server and UI directly on an Android device with [Termux](https://termux.dev/en/):

1. Install Termux from F-Droid or the Termux GitHub releases (the Play Store build is outdated).
2. Open Termux and install Node.js:
   ```bash
   pkg install nodejs-lts git
   ```
3. Clone or copy this repository into Termux, then install dependencies:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   npm install
   ```
4. Start the helper server:
   ```bash
   npm run dev
   ```
   Keep Termux in the foreground or run `termux-wake-lock` beforehand to stop Android from suspending the process.
5. Open Chrome or Firefox on the same device and browse to [http://127.0.0.1:3000](http://127.0.0.1:3000). The layout collapses into a single column, buttons gain larger touch targets, and the sitemap panel remains scrollable with swipe gestures.
6. When you are finished, switch back to Termux and press `Ctrl+C` to stop the server.

## Troubleshooting

- **“Start the helper server…” warning** – you opened `index.html` directly. Run `npm run dev` and reload via `http://localhost:3000` (or `http://127.0.0.1:3000` on Android).
- **Sitemap fails to load** – the helper server is required. Ensure it is running, refresh the sitemap, and confirm the terminal logs proxy requests.
- **Fetch errors or 403s** – verify the helper server output, confirm the target URLs are valid, and respect ADXS.org’s rate limits.
- **Missing tooltips in validation** – keep the “Tooltip text” option enabled; the validator expects `data-tippy-content` captures to link inline citations with their popover text.
- **Large batches** – the scraper inserts a short 250 ms delay between requests to avoid overwhelming ADXS.org. Adjust your path list and sitemap selection to control throughput.
