# 📅 Interactive Wall Calendar

> A production-grade, fully interactive wall calendar built as a **single React component** — premium Moleskine-meets-luxury-desk-calendar aesthetic with editorial typography, seasonal photography, and smooth micro-interactions.

---

## 🌐 Live Demo

**[▶ View Live Demo](https://wall-calendar-azure.vercel.app/)**

---

## ✨ Features

### Core Calendar
- **Monthly grid view** — standard 7-column (Sun–Sat) layout
- **Month navigation** — smooth left/right slide animation (300ms) with previous/next chevrons
- **Today highlight** — filled accent-color circle on today's date
- **Greyed-out overflow days** — previous/next month dates shown at 0.35 opacity
- **Weekend column tint** — subtle background differentiation for Sat/Sun columns

### Date Range Selection
- **Click once** → sets Start date (filled accent circle + "Start" pill badge)
- **Click again on a later date** → sets End date; all days in between get a soft blush highlight
- **Third click** → resets and starts a new selection
- Hover states on all non-selected dates

### Notes Section
- Lined notebook-paper textarea (pure CSS `repeating-linear-gradient`)
- Shows selected date range label or "This Month" if no range is selected
- **Character counter** — 0 / 500
- **Save Note** — persists to `localStorage` keyed by month + year
- **"Saved ✓" toast** — auto-dismisses after 2 seconds (bottom-right corner)
- Notes are restored automatically when navigating back to a previously saved month
- 📎 sticky-note icon appears on calendar cells when a note + date range is saved

### Extra Features

| Feature | Details |
|---|---|
| 🖼 Hero image panel | Seasonal Unsplash landscape photo per month, crossfades (500ms) on navigation |
| 🎨 Season-based accent | Burgundy (spring/fall) · Terracotta (summer) · Cool blue (winter) |
| 🇮🇳 Indian holiday markers | Gold dot below date number + tooltip on hover for 10 major holidays |
| 🗓 Mini month previews | Previous & next month grids shown below the notes section |
| ⬆ Jump to Today | Floating pill button (bottom-left) appears when you've navigated away from the current month |
| ⌨ Keyboard navigation | Arrow keys move focus across cells; Enter/Space selects a date |
| ♿ Accessibility | `aria-label` on all interactive elements; grid uses `role="grid"` / `role="gridcell"` |
| 📱 Responsive | Desktop: side-by-side panels · Mobile (≤768px): stacked with 16:9 hero banner |

---

## 🗂 Project Structure

```
project-root/
│
├── src/
│   ├── CalendarComponent.jsx   ← entire calendar (self-contained, single file)
│   ├── App.jsx                 ← minimal wrapper — just renders CalendarComponent
│   └── index.css               ← global CSS reset only; all styles live in CalendarComponent
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

> All component logic, styles (injected via a `<style>` tag), and state live inside `CalendarComponent.jsx`. No external CSS files, no Redux, no Context API.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (functional components + hooks only) |
| Bundler | Vite 8 |
| Icons | `lucide-react` |
| Fonts | Google Fonts — Playfair Display · DM Sans (via `@import`) |
| Images | Unsplash (static URL mapping, one dramatic landscape per month) |
| Styling | Vanilla CSS injected via `useEffect` + `<style>` tag |
| Persistence | Browser `localStorage` |
| State | `useState` · `useEffect` · `useRef` · `useMemo` · `useCallback` |

---

## 🚀 How to Run Locally — Step by Step

Follow every step in order. Each step must complete successfully before moving to the next.

---

### Step 1 — Check if Node.js is installed

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
node -v
```

✅ You should see something like `v18.x.x` or `v20.x.x` or higher.

```bash
npm -v
```

✅ You should see something like `9.x.x` or higher.

> **If you get "command not found" or an error:**  
> Download and install Node.js from [https://nodejs.org](https://nodejs.org) — choose the **LTS** version.  
> After installing, close and reopen your terminal, then repeat Step 1.

---

### Step 2 — Download / Clone the project

**Option A — If you have Git installed:**

```bash
git clone <your-repo-url>
```

Replace `<your-repo-url>` with the actual GitHub/GitLab URL of this project.

**Option B — If you downloaded the ZIP:**

1. Extract the ZIP file to a folder of your choice (e.g. `C:\Projects\wall-calendar`)
2. Open your terminal

---

### Step 3 — Navigate into the project folder

In your terminal, type `cd` followed by the path to the project folder:

```bash
cd path/to/project-folder
```

**Examples:**

```bash
# Windows
cd C:\Projects\wall-calendar

# Mac / Linux
cd ~/Projects/wall-calendar
```

✅ Your terminal prompt should now show the project folder name.

> **Tip:** You can drag and drop the folder into the terminal window to auto-fill the path.

---

### Step 4 — Install dependencies

Run the following command exactly as written:

```bash
npm install
```

This will download all required packages (`react`, `react-dom`, `lucide-react`, `vite`, etc.) into a `node_modules` folder.

⏳ This may take 30–60 seconds depending on your internet speed.

✅ When done, you should see a message like:

```
added 154 packages, and audited 155 packages in 7s
found 0 vulnerabilities
```

> **If you get an error here:** Make sure you are inside the project folder (Step 3) and that `package.json` exists. Run `ls` (Mac/Linux) or `dir` (Windows) to confirm.

---

### Step 5 — Start the development server

```bash
npm run dev
```

✅ You should see output like this:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 6 — Open in your browser

Open any modern browser (Chrome, Firefox, Edge, Safari) and go to:

```
http://localhost:5173
```

🎉 The calendar should load immediately.

> The page automatically **hot-reloads** whenever you save any file — no need to refresh manually.

---

### Step 7 — To stop the server

Go back to your terminal and press:

```
Ctrl + C
```

Then type `Y` and press `Enter` if prompted.

---

## 📦 Building for Production

When you're ready to deploy:

### Step 1 — Build the project

```bash
npm run build
```

✅ This creates an optimised `dist/` folder with static files ready for deployment.

### Step 2 — Preview the production build locally

```bash
npm run preview
```

Open `http://localhost:4173` in your browser to see the production version.

### Step 3 — Deploy

Upload the contents of the `dist/` folder to any static hosting provider:

| Provider | Free Tier | Deploy Docs |
|---|---|---|
| [Vercel](https://vercel.com) | ✅ Yes | [vercel.com/docs](https://vercel.com/docs) |
| [Netlify](https://netlify.com) | ✅ Yes | [docs.netlify.com](https://docs.netlify.com) |
| [GitHub Pages](https://pages.github.com) | ✅ Yes | [pages.github.com](https://pages.github.com) |

> After deploying, paste your live URL into the **Live Demo** section at the top of this README.

---

## 🗓 Indian Holidays Included

| Date | Holiday |
|---|---|
| Jan 26 | Republic Day |
| Mar 25 | Holi |
| Apr 14 | Ambedkar Jayanti |
| Apr 21 | Ram Navami |
| May 1 | Labour Day |
| Aug 15 | Independence Day |
| Oct 2 | Gandhi Jayanti |
| Oct 20 | Diwali (approximate) |
| Nov 5 | Guru Nanak Jayanti |
| Dec 25 | Christmas |

---

## 🖼 Monthly Images

| Month | Scene |
|---|---|
| January | Blizzard-swept alpine ridge |
| February | Northern lights reflected in an ice lake |
| March | Spring meltwater cascading down a mountain |
| April | Cherry blossom avenue leading to snowy peaks |
| May | Golden-hour wildflower meadow, Dolomite spires |
| June | Towering sea-cliff stacks at sunset |
| July | Mirror-still mountain lake reflection |
| August | Tiny hiker silhouette inside a glowing red canyon |
| September | Winding river through amber-and-crimson autumn forest |
| October | Climber silhouette on a sheer granite wall at dusk |
| November | Ethereal fog through ancient redwood cathedral |
| December | Milky Way arching over snow-covered pine forest |

---

## ⌨ Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` `→` `↑` `↓` | Move focus between calendar cells |
| `Enter` / `Space` | Select the focused date (sets Start or End of range) |

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `node: command not found` | Install Node.js from [nodejs.org](https://nodejs.org) |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then re-run `npm install` |
| Port 5173 already in use | Run `npm run dev -- --port 3000` to use a different port |
| Page is blank / white | Open browser DevTools (F12), check the Console tab for errors |
| Images not loading | Check your internet connection — images are loaded from Unsplash CDN |
| Notes not saving | Make sure your browser allows `localStorage` (not in Incognito mode with storage blocked) |

---

## 📄 License

MIT — free to use, modify, and distribute.
