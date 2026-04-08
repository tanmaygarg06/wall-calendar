import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil, BookmarkIcon } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const UNSPLASH_IMAGES = {
  // Jan – lone mountaineer silhouette on a blizzard-swept alpine ridge
  0: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop',
  // Feb – electric blue northern lights reflected in an ice lake
  1: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop',
  // Mar – spring meltwater cascading down a jagged mountain face
  2: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=800&auto=format&fit=crop',
  // Apr – lavender-toned cherry-blossom avenue leading to snowy peaks
  3: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop',
  // May – golden-hour wildflower meadow, Dolomite spires behind
  4: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
  // Jun – towering sea-cliff stacks at sunset, crashing waves below
  5: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  // Jul – mirror-still mountain lake, jagged peaks doubled in reflection
  6: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop',
  // Aug – tiny hiker silhouette inside a glowing red canyon slot
  7: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop',
  // Sep – winding river through a blaze of amber-and-crimson autumn forest
  8: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
  // Oct – rope-style climber silhouette on a sheer granite wall at dusk
  9: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&auto=format&fit=crop',
  // Nov – ethereal fog rolling through ancient redwood cathedral
  10:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format&fit=crop',
  // Dec – Milky Way arching over snow-covered pine forest, no people
  11:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop',
};

// Season-based theme accent colors
const MONTH_ACCENT = {
  0: '#4A6FA5',  // Jan – cool blue
  1: '#4A6FA5',  // Feb – cool blue
  2: '#8B3A3A',  // Mar – burgundy
  3: '#8B3A3A',  // Apr – burgundy  
  4: '#8B3A3A',  // May – burgundy
  5: '#C05A2C',  // Jun – terracotta
  6: '#C05A2C',  // Jul – terracotta
  7: '#C05A2C',  // Aug – terracotta
  8: '#8B3A3A',  // Sep – burgundy
  9: '#8B3A3A',  // Oct – burgundy
  10:'#8B3A3A',  // Nov – burgundy
  11:'#4A6FA5',  // Dec – cool blue
};

const MONTH_ACCENT_LIGHT = {
  0: '#D4E3F7',  1: '#D4E3F7',  2: '#F2D4D4',
  3: '#F2D4D4',  4: '#F2D4D4',  5: '#FAE0D0',
  6: '#FAE0D0',  7: '#FAE0D0',  8: '#F2D4D4',
  9: '#F2D4D4',  10:'#F2D4D4', 11:'#D4E3F7',
};

// Indian public holidays (month is 0-indexed)
const HOLIDAYS = {
  '1-26':  'Republic Day',
  '3-25':  'Holi',
  '4-14':  'Ambedkar Jayanti',
  '4-21':  'Ram Navami',
  '5-1':   'Labour Day',
  '8-15':  'Independence Day',
  '10-2':  "Gandhi Jayanti",
  '10-20': 'Diwali (approx.)',
  '11-5':  'Guru Nanak Jayanti',
  '12-25': 'Christmas',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
function isBetween(date, start, end) {
  if (!start || !end) return false;
  const t = date.getTime();
  return t > Math.min(start.getTime(), end.getTime()) && t < Math.max(start.getTime(), end.getTime());
}
function formatDateShort(d) {
  if (!d) return '';
  return `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}`;
}
function noteKey(year, month) {
  return `wall_calendar_note_${year}_${month}`;
}

// Build a 6×7 cell grid for a given month (cells may include prev/next month days)
function buildGrid(year, month) {
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const prevYear  = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevDays  = getDaysInMonth(prevYear, prevMonth);

  const cells = [];
  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(prevYear, prevMonth, prevDays - i), isCurrentMonth: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  // Trailing days from next month
  const nextYear  = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  let nd = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(nextYear, nextMonth, nd++), isCurrentMonth: false });
  }
  return cells;
}

// ─── MiniMonth component ───────────────────────────────────────────────────

function MiniMonth({ year, month, accent }) {
  const cells = useMemo(() => buildGrid(year, month), [year, month]);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign:'center', fontSize:'11px', fontWeight:600, letterSpacing:'0.08em',
        color: accent, marginBottom:6, fontFamily:'DM Sans, sans-serif', textTransform:'uppercase' }}>
        {MONTH_NAMES[month].slice(0,3)} {year}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px' }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:'9px', color:'#888',
            fontFamily:'DM Sans, sans-serif', padding:'2px 0' }}>
            {d[0]}
          </div>
        ))}
        {cells.map((c, i) => (
          <div key={i} style={{
            textAlign:'center', fontSize:'9px',
            padding:'2px 0',
            color: c.isCurrentMonth ? '#3C3432' : '#B8AFA8',
            fontFamily:'DM Sans, sans-serif',
          }}>
            {c.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main CalendarComponent ───────────────────────────────────────────────────

export default function CalendarComponent() {
  const today       = useMemo(() => new Date(), []);
  const [curYear,  setCurYear]  = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [noteText,   setNoteText]   = useState('');
  const [toast,      setToast]      = useState(false);
  const [savedRanges, setSavedRanges] = useState({}); // key → {start,end}
  const [slideDir,   setSlideDir]   = useState(null); // 'left' | 'right' | null
  const [imgVisible, setImgVisible] = useState(true);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth <= 768);
  const [focusedCell, setFocusedCell] = useState(null);
  const gridRef = useRef(null);
  const toastTimer = useRef(null);

  const accent      = MONTH_ACCENT[curMonth];
  const accentLight = MONTH_ACCENT_LIGHT[curMonth];
  const imgUrl      = UNSPLASH_IMAGES[curMonth];

  // Responsive listener
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Restore note on month change
  useEffect(() => {
    const saved = localStorage.getItem(noteKey(curYear, curMonth));
    setNoteText(saved || '');
  }, [curYear, curMonth]);

  // Inject fonts + global styles
  useEffect(() => {
    const id = 'wc-global-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #EDE8DF; }

      .wc-root {
        background: #F5F0E8;
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
      }

      .wc-card {
        display: flex;
        width: 100%;
        max-width: 1060px;
        height: calc(100vh - 20px);
        max-height: 780px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow:
          0 4px 6px rgba(0,0,0,0.04),
          0 20px 60px rgba(0,0,0,0.12),
          0 1px 0 rgba(255,255,255,0.8) inset;
        border: 1px solid rgba(255,255,255,0.6);
        position: relative;
      }

      /* ── Left Panel ── */
      .wc-left {
        width: 40%;
        position: relative;
        display: flex;
        flex-direction: column;
        background: #2A2420;
        flex-shrink: 0;
      }
      .wc-hero-img {
        width: 100%;
        height: 70%;
        object-fit: cover;
        display: block;
        transition: opacity 0.5s ease;
      }
      .wc-month-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 28px 24px;
        background: #2A2420;
      }
      .wc-month-label {
        font-family: 'Playfair Display', serif;
        font-size: clamp(22px, 3vw, 36px);
        font-weight: 700;
        color: #F5F0E8;
        line-height: 1.1;
        text-align: center;
        letter-spacing: -0.01em;
      }
      .wc-year-label {
        font-family: 'Playfair Display', serif;
        font-size: clamp(13px, 1.6vw, 18px);
        font-weight: 400;
        font-style: italic;
        color: rgba(245,240,232,0.55);
        margin-top: 3px;
      }
      .wc-divider {
        width: 40px;
        height: 2px;
        border-radius: 2px;
        margin: 10px auto 0;
        transition: background 0.4s;
      }

      /* ── Right Panel ── */
      .wc-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #F5F0E8;
        overflow: hidden;
        position: relative;
      }

      /* ── Calendar header ── */
      .wc-cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px 8px;
        border-bottom: 1px solid rgba(60,52,50,0.1);
      }
      .wc-nav-btn {
        width: 34px; height: 34px;
        border-radius: 50%;
        border: 1.5px solid rgba(60,52,50,0.18);
        background: transparent;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: #3C3432;
        transition: background 0.2s, border-color 0.2s;
      }
      .wc-nav-btn:hover { background: rgba(60,52,50,0.08); border-color: rgba(60,52,50,0.3); }

      .wc-nav-month {
        font-family: 'DM Sans', sans-serif;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: #1A1A1A;
      }

      /* ── Grid ── */
      .wc-grid-wrap {
        flex: 1;
        padding: 4px 14px 2px;
        overflow: hidden;
        position: relative;
      }

      .wc-slide-enter-left  { animation: slideInLeft  0.3s ease forwards; }
      .wc-slide-enter-right { animation: slideInRight 0.3s ease forwards; }
      .wc-slide-exit-left   { animation: slideOutLeft  0.3s ease forwards; }
      .wc-slide-exit-right  { animation: slideOutRight 0.3s ease forwards; }

      @keyframes slideInLeft  { from { transform: translateX(60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes slideInRight { from { transform: translateX(-60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes slideOutLeft  { from { transform:translateX(0); opacity:1; } to { transform:translateX(-60px); opacity:0; } }
      @keyframes slideOutRight { from { transform:translateX(0); opacity:1; } to { transform:translateX(60px); opacity:0; } }

      .wc-day-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        margin-bottom: 4px;
      }
      .wc-day-header-cell {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.07em;
        color: #8C8079;
        padding: 4px 0;
        text-transform: uppercase;
      }
      .wc-day-header-cell.weekend { color: #B07070; }

      .wc-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
      }

      .wc-cell {
        position: relative;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
        outline: none;
        min-height: 28px;
        gap: 1px;
      }
      .wc-cell:focus-visible { box-shadow: 0 0 0 2px var(--accent, #8B3A3A); }
      .wc-cell.weekend-col { background: rgba(139,58,58,0.03); }
      .wc-cell:hover:not(.selected):not(.range-end) { background: rgba(60,52,50,0.06); }

      .wc-date-num {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #1A1A1A;
        line-height: 1;
        width: 23px; height: 23px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 50%;
        transition: background 0.15s, color 0.15s;
        z-index: 1;
      }
      .wc-cell.is-today .wc-date-num {
        background: var(--accent, #8B3A3A);
        color: #fff;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18);
      }
      .wc-cell.selected .wc-date-num,
      .wc-cell.range-end .wc-date-num {
        background: var(--accent, #8B3A3A);
        color: #fff;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .wc-cell.in-range { background: var(--accentLight, #F2D4D4); }
      .wc-cell.in-range .wc-date-num { color: var(--accent, #8B3A3A); font-weight: 600; }
      .wc-cell.dim { opacity: 0.35; cursor: default; }
      .wc-cell.dim:hover { background: transparent; }

      .wc-badge {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.04em;
        padding: 1px 5px;
        border-radius: 20px;
        line-height: 1.4;
        text-transform: uppercase;
        color: #fff;
        background: var(--accent, #8B3A3A);
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }

      .wc-holiday-dot {
        width: 4px; height: 4px;
        border-radius: 50%;
        background: #E09C3A;
        margin-top: 1px;
        flex-shrink: 0;
      }

      .wc-note-icon {
        position: absolute;
        top: 3px; right: 3px;
        font-size: 8px;
        color: var(--accent, #8B3A3A);
        z-index: 2;
      }

      /* Tooltip */
      .wc-tooltip {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%; transform: translateX(-50%);
        background: #2A2420;
        color: #F5F0E8;
        font-size: 10px;
        font-family: 'DM Sans', sans-serif;
        padding: 4px 8px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 100;
        opacity: 0;
        transition: opacity 0.15s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .wc-tooltip::after {
        content: '';
        position: absolute;
        top: 100%; left: 50%; transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: #2A2420;
      }
      .wc-cell:hover .wc-tooltip { opacity: 1; }

      /* ── Notes ── */
      .wc-notes {
        padding: 7px 14px 6px;
        border-top: 1px solid rgba(60,52,50,0.1);
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .wc-notes-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wc-notes-title {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #3C3432;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .wc-notes-range {
        font-size: 11px;
        font-weight: 500;
        color: #8C8079;
        font-style: italic;
      }
      .wc-textarea-wrap { position: relative; }
      .wc-textarea {
        width: 100%;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        line-height: 22px;
        color: #1A1A1A;
        background:
          repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 21px,
            rgba(60,52,50,0.1) 21px,
            rgba(60,52,50,0.1) 22px
          ),
          #FAF7F2;
        border: 1px solid rgba(60,52,50,0.12);
        border-radius: 6px;
        padding: 6px 10px;
        resize: none;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        height: 52px;
      }
      .wc-textarea:focus {
        border-color: var(--accent, #8B3A3A);
        box-shadow: 0 0 0 3px var(--accentLight, #F2D4D4);
      }
      .wc-notes-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #8C8079;
      }
      .wc-save-btn {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        padding: 6px 16px;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        background: var(--accent, #8B3A3A);
        color: #fff;
        transition: opacity 0.2s, transform 0.1s;
      }
      .wc-save-btn:hover { opacity: 0.88; }
      .wc-save-btn:active { transform: scale(0.97); }

      /* ── Mini months ── */
      .wc-mini-months {
        display: flex;
        gap: 10px;
        padding: 5px 14px 8px;
        border-top: 1px solid rgba(60,52,50,0.08);
      }
      .wc-mini-card {
        flex: 1;
        background: rgba(255,255,255,0.5);
        border: 1px solid rgba(60,52,50,0.1);
        border-radius: 8px;
        padding: 7px;
      }

      /* ── Toast ── */
      .wc-toast {
        position: fixed;
        bottom: 20px; right: 20px;
        background: #2A2420;
        color: #F5F0E8;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 500;
        padding: 10px 20px;
        border-radius: 24px;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: toastIn 0.3s ease;
      }
      @keyframes toastIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:translateY(0); } }

      /* ── Jump to Today ── */
      .wc-jump-today {
        position: fixed;
        bottom: 20px; left: 20px;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 9px 20px;
        border-radius: 24px;
        border: none;
        cursor: pointer;
        background: #2A2420;
        color: #F5F0E8;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        letter-spacing: 0.03em;
        transition: opacity 0.2s, transform 0.1s;
        animation: toastIn 0.3s ease;
      }
      .wc-jump-today:hover { opacity: 0.88; }
      .wc-jump-today:active { transform: scale(0.97); }

      /* ── Mobile ── */
      @media (max-width: 768px) {
        .wc-root { padding: 0; align-items: flex-start; background: #F5F0E8; }
        .wc-card { flex-direction: column; border-radius: 0; min-height: 100vh; }
        .wc-left { width: 100%; height: auto; flex-direction: row; flex-shrink: 0; }
        .wc-hero-img { width: 100%; height: auto; aspect-ratio: 16/9; }
        .wc-month-info { display: none; }
        .wc-right { overflow-y: auto; }
        .wc-cell { min-height: 44px; }
        .wc-date-num { font-size: 14px; width: 30px; height: 30px; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  // CSS variables on root for accent colors
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accentLight', accentLight);
  }, [accent, accentLight]);

  // Build grid cells
  const cells = useMemo(() => buildGrid(curYear, curMonth), [curYear, curMonth]);

  // prev/next month grids for mini preview
  const prevMiniYear  = curMonth === 0 ? curYear - 1 : curYear;
  const prevMiniMonth = curMonth === 0 ? 11 : curMonth - 1;
  const nextMiniYear  = curMonth === 11 ? curYear + 1 : curYear;
  const nextMiniMonth = curMonth === 11 ? 0 : curMonth + 1;

  // Navigation — year/month computed from closure values and set via
  // two independent calls so React Strict Mode's double-invoke of updater
  // functions cannot accidentally double-increment the year.
  const navigate = useCallback((dir) => {
    setSlideDir(dir);
    setImgVisible(false);
    setTimeout(() => {
      if (dir === 'right') {
        if (curMonth === 11) {
          setCurYear(y => y + 1);
          setCurMonth(0);
        } else {
          setCurMonth(m => m + 1);
        }
      } else {
        if (curMonth === 0) {
          setCurYear(y => y - 1);
          setCurMonth(11);
        } else {
          setCurMonth(m => m - 1);
        }
      }
      setSlideDir(null);
      setRangeStart(null);
      setRangeEnd(null);
      setTimeout(() => setImgVisible(true), 50);
    }, 300);
  }, [curMonth]);

  const isCurrentMonthToday = curYear === today.getFullYear() && curMonth === today.getMonth();

  const jumpToToday = useCallback(() => {
    const dir = curYear < today.getFullYear() || (curYear === today.getFullYear() && curMonth < today.getMonth())
      ? 'right' : 'left';
    setSlideDir(dir);
    setImgVisible(false);
    setTimeout(() => {
      setCurYear(today.getFullYear());
      setCurMonth(today.getMonth());
      setSlideDir(null);
      setRangeStart(null);
      setRangeEnd(null);
      setTimeout(() => setImgVisible(true), 50);
    }, 300);
  }, [curYear, curMonth, today]);

  // Date click
  const handleCellClick = useCallback((cell) => {
    if (!cell.isCurrentMonth) return;
    const d = cell.date;
    if (!rangeStart || rangeEnd) {
      setRangeStart(d);
      setRangeEnd(null);
    } else {
      if (d.getTime() < rangeStart.getTime()) {
        setRangeEnd(rangeStart);
        setRangeStart(d);
      } else if (isSameDay(d, rangeStart)) {
        setRangeStart(null);
      } else {
        setRangeEnd(d);
      }
    }
  }, [rangeStart, rangeEnd]);

  // Save note
  const saveNote = useCallback(() => {
    localStorage.setItem(noteKey(curYear, curMonth), noteText);
    if (rangeStart && rangeEnd) {
      const k = `${curYear}_${curMonth}`;
      setSavedRanges(prev => ({ ...prev, [k]: { start: rangeStart, end: rangeEnd } }));
    }
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = setTimeout(() => setToast(false), 2000);
  }, [curYear, curMonth, noteText, rangeStart, rangeEnd]);

  // Keyboard navigation for grid
  const handleKeyDown = useCallback((e, cellIndex) => {
    let next = cellIndex;
    if (e.key === 'ArrowRight') { e.preventDefault(); next = cellIndex + 1; }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next = cellIndex - 1; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); next = cellIndex + 7; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); next = cellIndex - 7; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCellClick(cells[cellIndex]); return; }
    else return;
    if (next >= 0 && next < cells.length) {
      setFocusedCell(next);
      gridRef.current?.querySelectorAll('[data-cell]')[next]?.focus();
    }
  }, [cells, handleCellClick]);

  // Range label
  const rangeLabel = useMemo(() => {
    if (rangeStart && rangeEnd) return `${formatDateShort(rangeStart)} – ${formatDateShort(rangeEnd)}`;
    if (rangeStart) return `From ${formatDateShort(rangeStart)}`;
    return 'This Month';
  }, [rangeStart, rangeEnd]);

  // Saved range for this month
  const savedRange = savedRanges[`${curYear}_${curMonth}`];

  const noteLen = noteText.length;

  const slideClass = slideDir === 'right' ? 'wc-slide-enter-left'
    : slideDir === 'left'  ? 'wc-slide-enter-right' : '';

  return (
    <div className="wc-root" role="main">
      <div className="wc-card">

        {/* ── LEFT PANEL ── */}
        <div className="wc-left">
          {isMobile ? (
            <img
              className="wc-hero-img"
              src={imgUrl}
              alt={`${MONTH_NAMES[curMonth]} scene`}
              style={{ opacity: imgVisible ? 1 : 0 }}
            />
          ) : (
            <>
              <img
                className="wc-hero-img"
                src={imgUrl}
                alt={`${MONTH_NAMES[curMonth]} scene`}
                style={{ opacity: imgVisible ? 1 : 0, height: '60%' }}
              />
              <div className="wc-month-info">
                <div className="wc-month-label">{MONTH_NAMES[curMonth]}</div>
                <div className="wc-year-label">{curYear}</div>
                <div className="wc-divider" style={{ background: accent }} />
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="wc-right">

          {/* Calendar nav header */}
          <div className="wc-cal-header">
            <button
              className="wc-nav-btn"
              onClick={() => navigate('left')}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <span className="wc-nav-month">
              {isMobile ? `${MONTH_NAMES[curMonth].slice(0,3)} ${curYear}` : `${MONTH_NAMES[curMonth]} ${curYear}`}
            </span>
            <button
              className="wc-nav-btn"
              onClick={() => navigate('right')}
              aria-label="Next month"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Grid area */}
          <div className="wc-grid-wrap">
            <div className={`${slideClass}`}>
              {/* Day-of-week headers */}
              <div className="wc-day-header">
                {DAY_NAMES.map((d, i) => (
                  <div key={d} className={`wc-day-header-cell${i === 0 || i === 6 ? ' weekend' : ''}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="wc-grid" ref={gridRef} role="grid" aria-label="Calendar grid">
                {cells.map((cell, i) => {
                  const isToday  = isSameDay(cell.date, today);
                  const isStart  = isSameDay(cell.date, rangeStart);
                  const isEnd    = isSameDay(cell.date, rangeEnd);
                  const inRange  = isBetween(cell.date, rangeStart, rangeEnd);
                  const col      = i % 7;
                  const isWeekend = col === 0 || col === 6;
                  const mKey     = `${cell.date.getMonth() + 1}-${cell.date.getDate()}`;
                  const holiday  = HOLIDAYS[mKey];
                  const hasSavedNote = savedRange && cell.isCurrentMonth && savedRange.start && savedRange.end
                    && !isBetween(cell.date, null, null)
                    && (isSameDay(cell.date, savedRange.start) || isSameDay(cell.date, savedRange.end)
                        || isBetween(cell.date, savedRange.start, savedRange.end));

                  let cls = 'wc-cell';
                  if (!cell.isCurrentMonth) cls += ' dim';
                  if (isWeekend && cell.isCurrentMonth) cls += ' weekend-col';
                  if (isStart) cls += ' selected';
                  if (isEnd) cls += ' range-end';
                  if (inRange && !isStart && !isEnd) cls += ' in-range';

                  return (
                    <div
                      key={i}
                      data-cell={i}
                      className={cls}
                      role="gridcell"
                      tabIndex={cell.isCurrentMonth ? 0 : -1}
                      aria-label={`${cell.date.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}${isToday ? ', today' : ''}${holiday ? `, ${holiday}` : ''}`}
                      aria-selected={isStart || isEnd}
                      onClick={() => handleCellClick(cell)}
                      onKeyDown={e => handleKeyDown(e, i)}
                      onFocus={() => setFocusedCell(i)}
                      style={{ position: 'relative' }}
                    >
                      {holiday && (
                        <div className="wc-tooltip">{holiday}</div>
                      )}
                      {hasSavedNote && (
                        <span className="wc-note-icon" title="Note saved">📎</span>
                      )}
                      <div className={`wc-date-num${isToday && !isStart && !isEnd ? ' today' : ''}`}
                        style={isToday && !isStart && !isEnd ? { background: accent, color: '#fff' } : {}}>
                        {cell.date.getDate()}
                      </div>
                      {holiday && cell.isCurrentMonth && (
                        <span className="wc-holiday-dot" />
                      )}
                      {isStart && <span className="wc-badge" style={{ background: accent }}>Start</span>}
                      {isEnd   && <span className="wc-badge" style={{ background: accent }}>End</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="wc-notes">
            <div className="wc-notes-header">
              <div className="wc-notes-title">
                <Pencil size={12} style={{ color: accent }} />
                Notes
              </div>
              <div className="wc-notes-range">{rangeLabel}</div>
            </div>
            <div className="wc-textarea-wrap">
              <textarea
                className="wc-textarea"
                value={noteText}
                onChange={e => setNoteText(e.target.value.slice(0, 500))}
                placeholder="Write your thoughts, plans, or reminders…"
                aria-label="Monthly notes"
                maxLength={500}
              />
            </div>
            <div className="wc-notes-footer">
              <span>{noteLen} / 500</span>
              <button
                className="wc-save-btn"
                style={{ background: accent }}
                onClick={saveNote}
                aria-label="Save note"
              >
                Save Note
              </button>
            </div>
          </div>

          {/* ── Mini month previews ── */}
          <div className="wc-mini-months">
            <div className="wc-mini-card">
              <MiniMonth year={prevMiniYear} month={prevMiniMonth} accent={MONTH_ACCENT[prevMiniMonth]} />
            </div>
            <div className="wc-mini-card">
              <MiniMonth year={nextMiniYear} month={nextMiniMonth} accent={MONTH_ACCENT[nextMiniMonth]} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="wc-toast" role="status" aria-live="polite">
          Saved ✓
        </div>
      )}

      {/* ── Jump to Today ── */}
      {!isCurrentMonthToday && (
        <button
          className="wc-jump-today"
          onClick={jumpToToday}
          aria-label="Jump to today's month"
        >
          ↩ Today
        </button>
      )}
    </div>
  );
}
