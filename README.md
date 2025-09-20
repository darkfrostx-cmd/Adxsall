# ADXS Knowledge Scraper Workspace

An interactive browser application for harvesting structured content from the ADXS.org knowledge base. The tool captures page sections, inline citations, tooltip popovers, and footnotes, validates the relationships between them, and lets you assemble custom exportable documents.

> **Why a helper server?** ADXS.org does not send permissive CORS headers, so browsers block direct cross-origin `fetch` calls. The included Node helper server proxies requests locally, giving the front-end safe access to the remote HTML.

If you are just getting started, follow the [Quick Start Guide](GUIDE.md) for beginner-friendly setup instructions on Windows, macOS, Linux, and Android (Termux).

## Prerequisites

- [Node.js 18+](https://nodejs.org/) (includes `npm` and the global `fetch` API used by the proxy)
- A modern Chromium- or Firefox-based browser

## 1. Install dependencies

```bash
npm install
```

This step pulls in Express (for the proxy/static server) and its small dependency tree.

## 2. Run the local helper server

```bash
npm run dev
```

The server listens on [http://localhost:3000](http://localhost:3000), serves the UI assets, and exposes `/api/fetch` for proxied ADXS requests. It binds to all local interfaces, so you can also reach it from other devices on your network by replacing `localhost` with your machine's IP address. Leave this terminal window running while you use the app.

> **Mobile tip:** Termux on Android can run the helper server directly on your phone. The interface is fully responsive and supports narrow screens.

## 3. Open the UI

Visit `http://localhost:3000` in your browser. The warning banner disappears once the page detects it is being served over HTTP/HTTPS.

## 4. Configure a scrape

1. **Base URL** – defaults to `https://www.adxs.org`. Point it at a mirrored host if required.
2. **Scraping mode**
   - *Single page* – fetches only the first path (or the base URL when no paths are supplied).
   - *Section crawl* – walks every path you enter, ideal for a curated set of section URLs.
   - *Batch list* – processes each path in order with progress tracking for longer lists.
3. **Capture options** – keep inline citations, tooltip text (including ADXS `data-tippy-content` popovers), and footnotes enabled to maximise the validation coverage.
4. **Sitemap selection** – the configuration panel now loads the `/en` navigation tree via the helper server. Use the collapsible checkboxes to stage the pages you want to scrape; the **Reload sitemap** button re-fetches it if you change the base URL. If the fetch fails, the status message explains why and the existing tree stays in place so you can retry.
5. **Paths to scrape** – enter one relative path per line (for example `/en/page/560/6-guidelines-for-diagnostics`). Manual paths are only used when no sitemap selections are checked; otherwise they are ignored.

## 5. Run and monitor

- Click **Start** to begin. **Pause** temporarily suspends the queue; click again to resume. **Stop** cancels the remaining URLs.
- The **Preview** tab shows the first few sections from each page; **Statistics** aggregates totals for sections, citations, tooltips, footnotes, and words; **Validation** reports missing/mismatched references; **Logs** records each fetch and validation summary.

## 6. Build custom documents

Use the **Documents** tab to assemble tailored exports:

1. Expand a page, tick the sections you want, and repeat across as many pages as required.
2. Provide a descriptive name and click **Create document from selected sections**. The app stores the document (including metadata, word counts, and originating pages) in memory.
3. Repeat to build multiple focused packets. Remove a document at any time with the **Remove** button.
4. Export individual documents as Markdown, HTML, or JSON directly from each card.

Selections persist until you clear them or start a new scraping session. The **Clear selection** button resets the section checkboxes without deleting existing documents.

## 7. Export batch results

The buttons in the **Results** header generate full-batch exports:

- **JSON** – structured data for downstream scripting.
- **Markdown / HTML** – human-readable summaries with sections, citations, footnotes, and validation notes.
- **BibTeX** – quick reference entries for bibliographic tools.
- **Copy summary** – copies a compact per-page overview (counts plus validation status) to the clipboard.

Exports reflect the current batch in memory. Start a new scrape to reset the dataset.

## 8. Capture a workspace context snapshot

Generate a Markdown dump of the project (including recent Git metadata and the contents of each source file) with:

```bash
npm run dump:context
```

The script writes to `context-dump.md` in the project root and records the generation timestamp, directories it visited, the la
test `git status --short`, and the last 20 commits from `git log --oneline`.

To keep the export focused on hand-edited assets, the crawler deliberately skips the `.git`, `node_modules`, `dist`, `build`,
`.next`, `out`, `.cache`, `coverage`, `tmp`, and `logs` directories, along with the generated `context-dump.md` file itself.

## Troubleshooting

- **“Start the helper server…” warning** – you opened `index.html` directly. Run `npm run dev` and reload via `http://localhost:3000`.
- **Fetch errors or 403s** – confirm the helper server is running, your terminal shows proxy hits, and the target URL is correct.
- **Sitemap load failures** – the status banner in the configuration panel shows the error message when the tree cannot be fetched. Check the helper server logs for `[sitemap]` errors, confirm the base URL is allowed, then use **Reload sitemap** once the issue is resolved.
- **Missing tooltips in validation** – leave the “Tooltip text” option enabled; the validator expects `data-tippy-content` captures to link inline citations with their popover text.
- **Large batches** – the scraper inserts a short 250 ms delay between requests to avoid overwhelming ADXS.org. Adjust your path list to control throughput.
