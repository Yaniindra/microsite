# Handoff: Microsite Registrasi Data Pelanggan

## Overview
A public lead-capture microsite for a sales team to collect prospective-customer data (name, email, phone, optional company/interest/note), plus a simple password-protected admin panel to view and export that data as CSV. No specific product/event topic — copy is intentionally generic ("interested in our product/services").

## About the Design Files
The files in this bundle are **design references built in HTML** — a working prototype showing the intended look, content, states, and interactions. They are not production code to copy verbatim. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, plain server-rendered pages, etc.) using its established patterns, form/validation libraries, auth, and data storage — or, if no environment exists yet, choose the most appropriate stack (e.g. a simple form + serverless function + database, or a small full-stack app) and implement the designs there. The current prototype has **no real backend**: form submissions and the admin login are simulated client-side (submitted leads are held in memory and lost on reload); the CSV export button generates a CSV client-side from the in-memory list.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final per the attached design system ("Broadsheet"). Layout and interaction states (hover/focus/validation/empty states) should be recreated pixel-for-pixel using the codebase's own component library, restyled with the tokens below if it doesn't already implement this system.

## Screens / Views
All four views live in one file (`Microsite Registrasi.dc.html`) and are switched by local component state (`view`: `landing` | `thanks` | `adminLogin` | `adminDashboard`). In production these should be separate routes, e.g. `/`, `/thanks` (or inline swap), `/admin/login`, `/admin`.

### 1. Registration page (`/`)
- **Purpose**: Public entry point; prospective customer submits contact details.
- **Layout**: Single column, max-width 720px, left-aligned (no center-alignment), generous vertical whitespace, no card/box chrome around the page — the design system's rule is "hierarchy from type scale and whitespace, not boxes."
  - Nav row: brand wordmark only, no nav links.
  - "Masthead" block directly under nav: a 4px solid rule (full ink), then a row (flex, space-between) with an 11px uppercase kicker "FORMULIR MINAT PRODUK" left / date "26 Juli 2026" right, then a 1px solid rule below it. This thick/thin rule pair is the one place the system allows a drawn rule ("front-page furniture").
  - H1 (max-width 520px): "Tertarik dengan Produk Kami? Mari Terhubung."
  - Subhead paragraph (muted, max-width 480px, 16px).
  - Two outline tags: "Respon dalam 1x24 jam", "Data aman & rahasia".
  - Form, max-width 480px, vertical stack, 20px gap between fields:
    1. Nama Lengkap* — text input
    2. Email Aktif* — email input
    3. No. HP / WhatsApp* — tel input
    4. Nama Perusahaan (opsional) — text input
    5. "Anda tertarik dengan apa?" — select: Informasi umum / Demo produk / Penawaran harga / Lainnya
    6. Catatan Tambahan (opsional) — textarea (min-height 90px)
    7. Consent checkbox (native, accent-colored): "Saya setuju data ini digunakan oleh tim untuk menghubungi saya terkait produk/layanan yang diminati."
    8. Submit button, full width, primary fill: "Kirim Data"
  - Footer line (12px, muted): "© 2026 {companyName}. Data Anda diproses sesuai Kebijakan Privasi kami." with an inline text link.
- **Validation**: On submit, name/email/phone/consent are required (consent only if `requireConsent` is on). Missing fields show a small message (12px, magenta/`--color-accent-2-700`) directly under that field: "Nama wajib diisi" / "Email wajib diisi" / "No. HP wajib diisi" / "Persetujuan wajib dicentang". Validation runs on submit only, not per-keystroke.

### 2. Thank-you state (`/thanks`)
- **Purpose**: Confirms receipt after a valid submission.
- **Layout**: Same 720px column, vertically centered content (min-height 70vh), left-aligned.
  - 56×56px circle, filled `--color-accent-100`, containing a centered 28px checkmark icon (stroke `--color-accent-700`).
  - H2: "Terima kasih, {submitted name}!"
  - Paragraph (muted, max 440px, 16px): "Data Anda sudah kami terima. Tim kami akan segera menghubungi Anda melalui email atau WhatsApp yang telah didaftarkan."
  - Secondary button: "Isi Formulir Lain" → returns to the empty registration form.

### 3. Admin login (`/admin/login`)
- **Purpose**: Gate for the admin panel.
- **Layout**: Full-viewport centered card (this is the one screen that uses the boxed `.card` component, since it's a discrete, self-contained action panel).
  - Card: max-width 380px, padding 32px, elevation `--shadow-md`.
  - Kicker "ADMIN PANEL" (11px uppercase, accent-700).
  - H3: "Masuk ke Dashboard".
  - Username field (text), Password field (type=password).
  - Inline error (magenta, 13px) if either is empty on submit: "Username dan password wajib diisi".
  - Primary full-width button: "Masuk".
  - Ghost text button below: "← Kembali ke microsite" (returns to `/`).
- **Auth note**: The prototype accepts ANY non-empty username/password (no real check). Production needs real authentication (hashed password check, session/JWT, rate limiting on attempts).

### 4. Admin dashboard (`/admin`)
- **Purpose**: View and export collected registrants; search only, no edit/delete.
- **Layout**: Full width.
  - Nav bar: brand text "Admin Panel · {companyName}" left, "Keluar" (logout, secondary button) right.
  - Content column, max-width 1040px, centered.
  - H2 "Data Registrant" + muted subhead "Kelola dan unduh data calon customer yang masuk dari microsite."
  - Stats/actions row (flex, wraps on narrow widths, space-between, align to bottom):
    - Left: kicker "TOTAL REGISTRANT" (11px uppercase muted) above a big serif number in `--color-accent-700`, 48px, weight 600 — the live count of registrants.
    - Right: a search input (260px, left-padded 34px for an inset magnifying-glass icon, placeholder "Cari nama, email, perusahaan...") + a primary button "Unduh CSV" with a download icon.
  - Data table (`.table` component): columns Nama / Email / No. HP / Perusahaan / Minat (rendered as an accent tag) / Tanggal. Row hover tint. Horizontal scroll wrapper on narrow viewports.
  - Empty-search state: if the search has text and zero rows match, show centered muted text "Tidak ada data yang cocok dengan pencarian." in place of the table body.
  - Seed/demo data: 6 sample rows (Indonesian names, emails, phone numbers, companies, interest tag, date) — replace with real data source.

## Interactions & Behavior
- **Preview switcher** (top-right floating pill, labeled "Pratinjau"): a **prototype-only** aid to jump between the public flow and the admin flow without going through the full navigation each time. **Do not implement this in production** — it exists only so reviewers can inspect all states in one file.
- Submitting the registration form prepends the new entry to the registrants list (so the demo admin table grows) and clears the form.
- "Kirim Data" always attempts submit; validation errors appear inline rather than disabling the button.
- Admin login always succeeds if both fields are non-negative-empty in the prototype; real auth must replace this.
- "Unduh CSV" builds a CSV client-side from the registrants list and triggers a browser download (`data-registrant.csv`) — in production this should instead call a backend export endpoint (streaming/paginated for large datasets), keeping the same one-click affordance.
- Search filters the table live, case-insensitive, matching name, email, or company substrings.
- No animations/transitions beyond native browser defaults (focus rings, hover tints); this system deliberately avoids motion flourish.
- **Responsive**: layout uses flexible max-widths and `flex-wrap` rather than fixed breakpoints; verify usability at common mobile widths (360–430px) — table needs horizontal scroll, the stats/search row stacks.

## State Management
- `view`: `'landing' | 'thanks' | 'adminLogin' | 'adminDashboard'`
- `loggedIn`: boolean (admin session, prototype only — replace with real session state)
- `form`: `{ name, email, phone, company, interest, note, consent }`
- `submitAttempted`: boolean — gates whether validation messages show
- `lastSubmittedName`: string — used in the thank-you headline
- `search`: string — admin table filter
- `loginUser`, `loginPass`, `loginAttempted`: admin login form state
- `registrants`: array of `{ id, name, email, phone, company, interest, date }` — replace with a real data fetch (e.g. paginated list from the registrations table) in production
- **Data requirement**: production needs a `registrations` table/collection (id, name, email, phone, company, interest, note, consent, created_at) and two endpoints at minimum: `POST /registrations` (public submit) and `GET /registrations` + `GET /registrations/export.csv` (admin-only, authenticated).

## Design Tokens
Full token sheet is in `design-tokens.css` (`:root` variables). Summary:

**Color**
- Background: `--color-bg` `#f3f2f2`; Surface (cards/inputs): `--color-surface` `#eae9e9`; Text: `--color-text` `#201e1d`
- Accent (primary/interactive, cyan): `--color-accent` `#0088b0`, with a 100–900 tonal ramp (`--color-accent-100…900`)
- Accent 2 (rare second spot color, magenta — used here only for validation/error text): `--color-accent-2` `#d6006c`, ramp `--color-accent-2-100…900`
- Neutral ramp: `--color-neutral-100…900` (for muted icons/text)
- Divider (used sparingly): `--color-divider`

**Typography**
- Heading & body font: `--font-heading` / `--font-body` = "Source Serif 4" (serif throughout, no sans-serif chrome), heading weight 600
- Scale: h1 42px / h2 32px / h3 25px / h4 20px / h5 16px / h6 13px (uppercase, tracked)
- Body: 15px / line-height 1.55

**Spacing** (1.25× density scale): `--space-1` 5px, `--space-2` 10px, `--space-3` 15px, `--space-4` 20px, `--space-6` 30px, `--space-8` 40px

**Radius**: `--radius-sm` 1px, `--radius-md` 2px, `--radius-lg` 4px (very subtle rounding throughout — this is not a "rounded card" system)

**Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg` — ink-tinted, tuned to the light paper ground

**Components used**: `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-block`, `.field` + `.input`, `.tag` / `.tag-accent` / `.tag-outline`, `.card` + `.elev-md`, `.nav` + `.nav-brand`, `.table`. See `design-tokens.css` for the full class definitions.

**Direction note**: Left-aligned, asymmetric layouts; no boxes/dividers used for page structure (only the one masthead rule pair and the one login card); native form controls throughout, no custom-drawn inputs.

## Assets
No photographs or custom icons required. The only graphics are 3 minimal inline SVGs (checkmark, search/magnifying-glass, download arrow) drawn directly in the markup — recreate as simple icon-component equivalents (e.g. an icon library already in the target codebase, or trivial inline SVGs) rather than importing anything external. No external image assets or fonts beyond the one serif family are used.

## Files
- `Microsite Registrasi.dc.html` — the full interactive prototype (all 4 states, in-memory demo data, working CSV export)
- `design-tokens.css` — the complete design-system token sheet and component classes referenced above
