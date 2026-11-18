# RegDelta Design System

**Product:** RegDelta: Detect · Verify · Comply
**Team:** CrossOrigin
**Applies to:** the web console, pitch video, slides and documents

One rule above all: **every component uses the tokens below. No new colour, size, radius or shadow is introduced anywhere without adding it here first.**

---

## 1. Typography

### 1.1 Font families

| Role | Font | Fallback | Why |
|---|---|---|---|
| UI and body (English) | **IBM Plex Sans** | `system-ui, "Segoe UI", Arial, sans-serif` | Formal, highly legible, built for enterprise and compliance software |
| Bangla text | **Noto Sans Bengali** | `"Hind Siliguri", sans-serif` | Full Bangla shaping; matches Plex's weight and height |
| IDs, code, hashes, citations | **IBM Plex Mono** | `ui-monospace, Consolas, monospace` | Section IDs (PR.AA-01), SHA-256 hashes, quote locations |

All three are open-source (SIL OFL) and free from Google Fonts.

```css
--font-sans: "IBM Plex Sans", "Noto Sans Bengali", system-ui, "Segoe UI", Arial, sans-serif;
--font-bn:   "Noto Sans Bengali", "Hind Siliguri", sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
```

Put Noto Sans Bengali second in `--font-sans`, so mixed English/Bangla text renders correctly without extra markup. Set `lang="bn"` on Bangla blocks.

### 1.2 Weights

Use only these four weights:

| Weight | Name | Use |
|---|---|---|
| 400 | Regular | Body text, table cells, inputs |
| 500 | Medium | Labels, buttons, nav items, chips |
| 600 | SemiBold | Card titles, section headings |
| 700 | Bold | Page titles, KPI numbers |

### 1.3 Type scale (web console, base 16 px)

| Token | Size / line-height | Weight | Letter-spacing | Use |
|---|---|---|---|---|
| `--text-display` | 36 / 44 px | 700 | -0.02em | Dashboard KPI numbers |
| `--text-h1` | 28 / 36 px | 700 | -0.015em | Page title (one per page) |
| `--text-h2` | 22 / 30 px | 600 | -0.01em | Section heading |
| `--text-h3` | 18 / 26 px | 600 | 0 | Card title, dialog title |
| `--text-body` | 15 / 24 px | 400 | 0 | Default text, table cells |
| `--text-body-lg` | 16 / 26 px | 400 | 0 | Quotes, policy text, Bangla summary |
| `--text-label` | 13 / 18 px | 500 | 0.01em | Form labels, button text (small), meta |
| `--text-caption` | 12 / 16 px | 400 | 0.01em | Helper text, timestamps, footnotes |
| `--text-overline` | 11 / 16 px | 500 | 0.12em, UPPERCASE | Section kickers, table headers |
| `--text-mono` | 13 / 20 px | 400 (Mono) | 0 | IDs, hashes, citations |

**Bangla:** use the same size token, but set `line-height` to **1.75×** the font size (Bangla glyphs are taller). Never set Bangla below 13 px.

### 1.4 Video and slides scale (1920×1080)

| Token | Size | Weight | Use |
|---|---|---|---|
| Hero number | 180–290 px | 700 | Single statistic |
| Title | 52 px | 700 | Scene title |
| Subtitle | 26 px | 400 | Supporting line |
| Body | 22–28 px | 400 | Card text |
| Caption | 35 px | 500 | Burned-in subtitles |
| Overline | 17 px Mono | 500, 0.22em | Scene kicker |
| Source line | 15 px Mono | 400 | Citations under a statistic |

Nothing on screen goes below 15 px at 1080p.

---

## 2. Colour

### 2.1 Brand

| Token | Hex | Use |
|---|---|---|
| `--brand-red` | `#E3141C` | Logo, primary buttons, active nav, focus ring |
| `--brand-red-hover` | `#C50F16` | Primary button hover |
| `--brand-red-text` | `#FF3A43` | Red text on dark backgrounds (meets contrast) |
| `--brand-red-soft` | `rgba(227,20,28,0.12)` | Selected rows, active nav background |
| `--crossorigin-green` | `#2FE06C` | Team branding only (credits, team slide) |

Red is an **accent**, not a background. At most one red primary action per view.

### 2.2 Neutrals (dark theme, default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0A0A0D` | Page background |
| `--surface-1` | `#121217` | Cards, sidebar |
| `--surface-2` | `#1A1A21` | Inputs, table header, nested cards |
| `--surface-3` | `#24242D` | Hover state, chip background |
| `--border` | `#2C2C36` | All 1 px borders and dividers |
| `--border-strong` | `#3D3D4A` | Input borders, focused card |
| `--text` | `#F4F4F6` | Primary text |
| `--text-muted` | `#A0A0AC` | Secondary text, labels |
| `--text-subtle` | `#6E6E7A` | Placeholders, disabled text |

### 2.3 Neutrals (light theme)

| Token | Hex |
|---|---|
| `--bg` | `#F6F6F8` |
| `--surface-1` | `#FFFFFF` |
| `--surface-2` | `#F0F0F3` |
| `--surface-3` | `#E7E7EC` |
| `--border` | `#E1E1E7` |
| `--border-strong` | `#C9C9D3` |
| `--text` | `#111116` |
| `--text-muted` | `#5C5C68` |
| `--text-subtle` | `#8C8C98` |
| `--brand-red-text` | `#C50F16` |

### 2.4 Semantic: evidence statuses (fixed meaning, never reused for anything else)

| Status | Token | Hex (dark / light) | Icon |
|---|---|---|---|
| Evidence found | `--status-found` | `#2FE06C` / `#15803D` | check-circle |
| Evidence missing | `--status-missing` | `#F6B73C` / `#B45309` | alert-circle |
| Conflict | `--status-conflict` | `#FF4D55` / `#B91C1C` | x-circle |
| Needs human review | `--status-review` | `#B9A0FF` / `#6D28D9` | help-circle |

**The product never shows the word "Compliant".**

### 2.5 Semantic: who did the work (pipeline, logs, review screen)

| Actor | Hex |
|---|---|
| AI model | `#5B9BFF` |
| Plain code | `#9A9AA6` |
| Code-only verifier | `#2FE06C` |
| Human decision | `#FF8D42` |

### 2.6 Feedback

| Token | Hex | Use |
|---|---|---|
| `--success` | `#2FE06C` | Toasts, completed jobs |
| `--warning` | `#F6B73C` | Budget near limit, DRAFT label |
| `--danger` | `#FF4D55` | Errors, destructive actions |
| `--info` | `#5B9BFF` | Neutral notices |

Status and feedback colours always come with an **icon or text label**; never rely on colour alone.

---

## 3. Spacing, radius, elevation

**Spacing:** a 4 px base. Use only these steps:

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 20px` · `--space-6: 24px` · `--space-8: 32px` · `--space-10: 40px` · `--space-12: 48px`

| Context | Value |
|---|---|
| Inside buttons, chips | 8 / 12 / 16 px (by size) |
| Card padding | 24 px (compact card: 16 px) |
| Gap between cards | 16 px |
| Gap between page sections | 32 px |
| Page margin (desktop) | 32 px |

**Radius:**

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6 px | Chips, badges, checkboxes, tags |
| `--radius-md` | 10 px | Buttons, inputs, selects, dropdowns |
| `--radius-lg` | 16 px | Cards, panels, dialogs |
| `--radius-full` | 999 px | Avatars, status dots, pills |

**Elevation:**

| Token | Value | Use |
|---|---|---|
| `--shadow-0` | none | Flat cards inside other cards |
| `--shadow-1` | `0 1px 2px rgba(0,0,0,.30), 0 4px 12px rgba(0,0,0,.20)` | Cards |
| `--shadow-2` | `0 8px 30px rgba(0,0,0,.45)` | Dropdowns, popovers |
| `--shadow-3` | `0 20px 60px rgba(0,0,0,.55)` | Dialogs |

**Borders:** always 1 px `--border`. Focused or selected: 1 px `--border-strong` plus a ring (see 4.9).

---

## 4. Components

### 4.1 Buttons

All buttons share one shape: `--radius-md`, font `--text-label` at weight 500, icon 16 px with an 8 px gap, no uppercase.

| Size | Height | Horizontal padding | Font size |
|---|---|---|---|
| Small | 32 px | 12 px | 13 px |
| **Medium (default)** | 40 px | 16 px | 14 px |
| Large | 48 px | 20 px | 16 px |

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--brand-red` | `#FFFFFF` | none | One main action per view ("Run analysis", "Approve") |
| Secondary | `--surface-2` | `--text` | 1 px `--border-strong` | Other actions ("Edit", "Export") |
| Ghost | transparent | `--text-muted` | none | Toolbar and inline actions |
| Danger | transparent | `--danger` | 1 px `--danger` | "Reject", "Delete" (always asks for confirmation) |

**States (all variants):**
- Hover: one step darker (primary → `--brand-red-hover`; others → `--surface-3`)
- Active: `transform: translateY(1px)`
- Focus: the focus ring (4.9)
- Disabled: 40% opacity, `cursor: not-allowed`, no hover
- Loading: a spinner replaces the icon, the label stays, width does not change

**Review actions** are always in this fixed order, left to right: **Approve** (primary) · **Edit** (secondary) · **Reject** (danger).

### 4.2 Cards

```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);   /* 16px */
  padding: var(--space-6);           /* 24px */
  box-shadow: var(--shadow-1);
}
```

- **Card header:** title `--text-h3` on the left, actions (ghost buttons or a menu) on the right; 16 px below the header.
- **Card footer:** 1 px top border, 16 px padding-top, buttons right-aligned.
- **KPI card:** overline label (`--text-overline`, `--text-muted`) → number (`--text-display`) → helper (`--text-caption`). Fixed height: 128 px.
- **Nested card:** `--surface-2`, `--radius-md`, 16 px padding, `--shadow-0`.
- **Clickable card:** hover `--border-strong`, cursor pointer, no movement.

### 4.3 Inputs and forms

| Property | Value |
|---|---|
| Height | 40 px (same as a medium button) |
| Padding | 0 12 px |
| Background | `--surface-2` |
| Border | 1 px `--border-strong`, `--radius-md` |
| Text | `--text-body` |
| Placeholder | `--text-subtle` |
| Label | `--text-label`, `--text-muted`, 6 px above the field |
| Helper or error | `--text-caption`, 6 px below; errors in `--danger` with an icon |
| Focus | border `--brand-red` plus the focus ring |

Selects, date pickers and the search field use the same box. Checkbox and radio: 16 px, `--radius-sm` for checkboxes, red when checked. Form layout: a 3-column grid with a 16 px gap; full-width on mobile.

### 4.4 Chips, badges, tags

All chips: height 24 px, padding 0 10 px, `--radius-sm`, font 12 px weight 500.

| Type | Style |
|---|---|
| Status chip | Text and 1 px border in the status colour, background at 12% of it, 6 px dot before the text |
| Change-type chip (Added, Removed, Changed, Reworded, Renumbered, Split, Merged) | Neutral: `--surface-3` background, `--text` text, Mono font |
| Framework tag (SOC2, ISO 27001, NIST CSF) | Neutral chip, Mono |
| **DRAFT label** | Mono 11 px, 0.16em letter-spacing, `--warning` text and border, on every AI-written text |
| **SAMPLE label** | Mono 11 px, `--brand-red-text` text and border, on all sample data and in the demo |

### 4.5 Tables

| Part | Style |
|---|---|
| Header | `--text-overline`, `--text-muted`, `--surface-2` background, 40 px row |
| Row | 48 px high, `--text-body`, 1 px `--border` bottom |
| Hover | `--surface-3` |
| Selected | `--brand-red-soft` plus a 2 px red left edge |
| Numbers | Right-aligned, `font-variant-numeric: tabular-nums` |
| IDs and hashes | `--font-mono` |
| Empty state | Centred icon (32 px) + one-line message + one secondary button |

### 4.6 Quote block (evidence)

This is RegDelta's core component; it must look identical everywhere.

```
┌─▌ "Exact quoted text…"                            ✓ Found word for word │
│   NIST CSF 2.0 · PR.AA-01 · p. 20                                     │
└───────────────────────────────────────────────────────────────────────┘
```

- Container: nested card style, with a 3 px left bar in `--text-subtle`
- Quote: `--text-body-lg`, in curly quotes, in the source's original language
- Location: `--text-mono`, `--text-muted`: *document · section ID · page*
- Verifier badge (bottom right, Mono 12 px):
  - Passed: `--status-found`, "✓ Found word for word"
  - Failed: never shown to the user; the quote is dropped

### 4.7 Navigation

- **Sidebar:** 240 px wide, `--surface-1`, the logo at the top (24 px high)
- **Nav item:** 40 px high, `--radius-md`, 12 px padding, `--text-body` at weight 500
- **Active item:** `--brand-red-soft` background, `--text` colour, a 3 px red left bar
- **User block:** at the sidebar bottom: name in weight 600, role in `--text-caption`
- **Top bar:** 64 px, page title (`--text-h1`) on the left, primary action on the right

### 4.8 Feedback components

| Component | Spec |
|---|---|
| Toast | Top-right, 360 px wide, `--surface-2`, `--radius-md`, `--shadow-2`, 4 px left bar in the feedback colour, disappears after 5 s |
| Inline alert | Full width, background at 10% of the feedback colour, icon + text, `--radius-md` |
| Dialog | Max 560 px wide, `--radius-lg`, `--shadow-3`, 24 px padding; title `--text-h3`; buttons right-aligned |
| Progress bar | 6 px high, `--radius-full`, track `--surface-3`, fill `--brand-red` |
| Spinner | 16 px (in buttons) or 24 px (in panels), 2 px stroke, `--brand-red` |

### 4.9 Focus and accessibility

- Focus ring for every interactive element: `box-shadow: 0 0 0 3px rgba(227,20,28,.45)`
- Text contrast is at least 4.5:1 (AA); `--text-muted` on `--surface-1` passes in both themes
- Minimum touch target: 40 × 40 px
- Every icon-only button has an `aria-label`
- Language toggle (EN | বাংলা) is a 2-option segmented control: height 32 px, `--radius-md`

---

## 5. Icons

- **Set:** Lucide (ISC licence), outline style only
- **Stroke:** 2 px at 24 px
- **Sizes:** 16 px (in buttons, chips, tables), 20 px (nav), 24 px (card headers), 32 px (empty states)
- **Colour:** inherits the text colour; status icons use their status colour

---

## 6. Logos

| Asset | Use | Minimum size | Clear space |
|---|---|---|---|
| RegDelta horizontal (emblem + wordmark + tagline) | Title slides, video intro and outro | 240 px wide | The height of the "R" on all sides |
| RegDelta emblem | App icon, favicon, sidebar | 24 px | 25% of its width |
| CrossOrigin logo | Team credits only, never inside the product UI | 160 px wide | Same as above |

Use the logos only on dark (`#0A0A0D`) or black backgrounds. Don't recolour, stretch, add outlines, or place them on red.

---

## 7. Layout

- **Desktop grid:** 12 columns, 24 px gutters, max content width 1440 px
- **Breakpoints:** 640 / 1024 / 1280 / 1536 px
- **Page structure:** sidebar → top bar → content (sections separated by 32 px)
- **Dashboard:** KPI cards in a row of 4 (2 on tablet, 1 on mobile), then full-width tables
- **Review screen:** two columns: regulation text on the left (5 cols), draft and quotes on the right (7 cols)

---

## 8. Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 120 ms | Hover, press |
| `--dur-base` | 200 ms | Dropdowns, toasts, tab change |
| `--dur-slow` | 320 ms | Dialogs, panels |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` | All transitions |

No bouncing and no decorative animation. Respect `prefers-reduced-motion`.

---

## 9. Tokens (copy into `tokens.css`)

```css
:root {
  /* fonts */
  --font-sans: "IBM Plex Sans", "Noto Sans Bengali", system-ui, "Segoe UI", Arial, sans-serif;
  --font-bn: "Noto Sans Bengali", "Hind Siliguri", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;

  /* type */
  --text-display: 700 36px/44px var(--font-sans);
  --text-h1: 700 28px/36px var(--font-sans);
  --text-h2: 600 22px/30px var(--font-sans);
  --text-h3: 600 18px/26px var(--font-sans);
  --text-body: 400 15px/24px var(--font-sans);
  --text-body-lg: 400 16px/26px var(--font-sans);
  --text-label: 500 13px/18px var(--font-sans);
  --text-caption: 400 12px/16px var(--font-sans);
  --text-overline: 500 11px/16px var(--font-sans);
  --text-mono: 400 13px/20px var(--font-mono);

  /* brand */
  --brand-red: #E3141C; --brand-red-hover: #C50F16; --brand-red-text: #FF3A43;
  --brand-red-soft: rgba(227, 20, 28, .12); --crossorigin-green: #2FE06C;

  /* neutrals (dark) */
  --bg: #0A0A0D; --surface-1: #121217; --surface-2: #1A1A21; --surface-3: #24242D;
  --border: #2C2C36; --border-strong: #3D3D4A;
  --text: #F4F4F6; --text-muted: #A0A0AC; --text-subtle: #6E6E7A;

  /* statuses and feedback */
  --status-found: #2FE06C; --status-missing: #F6B73C; --status-conflict: #FF4D55; --status-review: #B9A0FF;
  --success: #2FE06C; --warning: #F6B73C; --danger: #FF4D55; --info: #5B9BFF;

  /* spacing, radius, elevation */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 999px;
  --shadow-1: 0 1px 2px rgba(0,0,0,.30), 0 4px 12px rgba(0,0,0,.20);
  --shadow-2: 0 8px 30px rgba(0,0,0,.45);
  --shadow-3: 0 20px 60px rgba(0,0,0,.55);
  --focus-ring: 0 0 0 3px rgba(227, 20, 28, .45);

  /* motion */
  --dur-fast: 120ms; --dur-base: 200ms; --dur-slow: 320ms; --ease: cubic-bezier(.2, 0, 0, 1);
}

[data-theme="light"] {
  --bg: #F6F6F8; --surface-1: #FFFFFF; --surface-2: #F0F0F3; --surface-3: #E7E7EC;
  --border: #E1E1E7; --border-strong: #C9C9D3;
  --text: #111116; --text-muted: #5C5C68; --text-subtle: #8C8C98;
  --brand-red-text: #C50F16;
  --status-found: #15803D; --status-missing: #B45309; --status-conflict: #B91C1C; --status-review: #6D28D9;
}

[lang="bn"] { font-family: var(--font-bn); line-height: 1.75; }
```

---

## 10. Consistency checklist (before every merge or slide)

- [ ] Only the fonts, sizes and weights from section 1
- [ ] Only colours from section 2; status colours keep their fixed meaning
- [ ] Buttons: 32 / 40 / 48 px heights, `--radius-md`, at most one primary per view
- [ ] Cards: `--radius-lg`, 24 px padding, 1 px border, `--shadow-1`
- [ ] Inputs are 40 px, the same height as medium buttons
- [ ] Spacing in 4 px steps only
- [ ] Every AI text has a DRAFT label; all sample data has a SAMPLE label
- [ ] Every quote shows its location; nothing says "Compliant"
- [ ] Bangla text uses Noto Sans Bengali at line-height 1.75 and is checked by a Bangla speaker
