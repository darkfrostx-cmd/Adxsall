# ADXS Knowledge Scraper – Quick Start Guide

This guide walks through the minimum steps to get the scraper running on Windows, macOS, Linux, or an Android phone. It assumes no prior developer experience and favours copy‑and‑paste commands.

---

## 1. What you need

| Platform | Requirements |
| --- | --- |
| Desktop / Laptop | • Internet connection<br>• [Node.js 18 or newer](https://nodejs.org/en/download)<br>• Git (optional but recommended) |
| Android phone | • Free space for the app data<br>• [Termux](https://f-droid.org/en/packages/com.termux/) from F-Droid or GitHub releases (avoid the outdated Play Store build)<br>• Stable Wi‑Fi or mobile data |

> **Why Node.js?** It lets the helper server proxy requests to ADXS.org so the browser can fetch data safely.

---

## 2. One-time setup

### Option A – Desktop or laptop

1. **Install Node.js**
   - Windows: download the installer, run it, and keep the default options.
   - macOS: download the `.pkg` installer or install via [Homebrew](https://brew.sh/) with `brew install node`.
   - Linux: use your package manager (`sudo apt install nodejs npm` on Ubuntu) or the NodeSource installer.
2. **Download the project**
   - Using Git: `git clone <repository-url>`
   - Manual download: click **Code → Download ZIP**, extract the archive, and open a terminal in the extracted folder.
3. **Install dependencies**
   ```bash
   npm install
   ```

### Option B – Android phone with Termux

1. Install Termux and open it. Allow storage permissions when prompted.
2. Update the package index and install Node.js and Git:
   ```bash
   pkg upgrade
   pkg install nodejs git
   ```
3. Clone the project (or copy it to Termux storage):
   ```bash
   git clone <repository-url>
   cd Adxsall
   npm install
   ```

> **Tip:** Termux stores files under `/data/data/com.termux/files/home`. Use `termux-open` to launch a browser from Termux if needed.

---

## 3. Start the helper server

Run the same command on every platform:

```bash
npm run dev
```

- The server listens on <http://localhost:3000>.
- It also binds to `0.0.0.0`, so other devices on the same network can connect using your machine’s IP address (for example `http://192.168.1.24:3000`).
- Leave this terminal window open; press `Ctrl+C` (or long-press Volume Down + C in Termux) to stop it when finished.

---

## 4. Use the web app

1. Open a modern browser (Chrome, Firefox, Edge, Brave, etc.).
2. Visit the address the terminal printed—usually <http://localhost:3000> on the device running the server.
3. If you are on another device (e.g. your Android phone while the server runs on your laptop), type the laptop’s IP address and port 3000 into the phone’s browser.
4. Configure your scrape and click **Start**.

The interface automatically adapts to small screens. Swipe across the tab bar if it overflows on narrow displays.

---

## 5. Troubleshooting for beginners

| Symptom | What to try |
| --- | --- |
| Browser shows a “Start the helper server” warning | The server is not running or you opened `index.html` directly. Return to the terminal and run `npm run dev` again. |
| Phone cannot reach the server on a laptop | Make sure both devices share the same Wi‑Fi network. Use `ipconfig` (Windows) or `ifconfig`/`ip a` (macOS/Linux) to find the laptop IP, then browse to `http://<that-ip>:3000`. |
| `npm install` fails in Termux | Update Termux first with `pkg upgrade`. Ensure you have at least 200 MB free space. |
| “Host not permitted by proxy” error | Only ADXS.org is allowed by default. To permit another domain, set `ALLOWED_HOSTS=my.domain.com` before `npm run dev`. |

---

## 6. Keeping your data

Everything stays on the device running the browser until you export it. Use the **Results → Export** buttons to download JSON, Markdown, HTML, or BibTeX bundles. Remember to copy the exported files out of Termux storage if you are using an Android phone.

Happy scraping!
