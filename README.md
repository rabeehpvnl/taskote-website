# Taskote public website

Static, dependency-free marketing website for Taskote (Kerala home services). It introduces Taskote, shows the eight service categories, answers FAQs and **hands users off to the existing Expo app** for sign in, registration and booking. It contains no booking engine, no authentication and no Supabase access.

## Run locally
Requires Node 18+. No `npm install` needed.

```bash
npm run build     # generates dist/ (16 pages)
npm run serve     # http://localhost:4173  (every route is a folder with index.html)
npm start         # build + serve
```

## Configuration (environment variables at build time)
| Variable | Required | Purpose |
|---|---|---|
| `JOBCO_APP_ORIGIN` | **Yes, before launch** | Production origin of the Expo app, e.g. `https://<app-origin>`. Never invented in this repo. |
| `JOBCO_CONTACT_ENDPOINT` | No | URL that accepts a JSON POST from the contact form. If empty the form says plainly that it cannot send. |
| `JOBCO_SITE_URL` | No | Public site URL, used for canonical tags. |

App paths (edit `APP_PATHS` in `build.mjs` if the app changes): login `/auth/login`, customer registration `/auth/register-customer`, professional registration `/auth/register-professional`.
If `JOBCO_APP_ORIGIN` is empty every sign-in / register / book button shows an "App link not configured" notice instead of a dead link.

Example: `JOBCO_APP_ORIGIN=https://<app-origin> npm run build`

## Structure
```
build.mjs            page templates, components (header, footer, cards, CTA, FAQ), content data
src/styles.css       design tokens + components (one file)
src/site.js          mobile menu, FAQ tabs/accordions, app-link wiring, contact form
assets/img/          photographs + logo
serve.mjs            tiny static server for dist/
tools/               optional Playwright screenshot scripts used for QA
```
Routes: `/`, `/about/`, `/services/`, `/services/<ac-repair|electrical|plumbing|carpentry|appliance-repair|painting|cleaning|pest-control>/`, `/faq/`, `/contact/`, `/sign-in/`, `/get-started/`, `/join/` (professional recruitment), `404.html`.
Hosting: any static host; serve `dist/` and use `404.html` for unknown routes. Routes assume the site is served from the domain root.

## Design system
Violet `#5E29FF` (actions), deep violet `#3513B7` (hover, CTA bands), navy `#0F172A` (text, footer), lavender `#F3EEFD` (supporting sections), white. Plus Jakarta Sans headings, Inter body (Google Fonts, with system fallbacks). Tokens are CSS variables in `:root`.

## Known limitations
See `CONTENT_TO_APPROVE.md`. Notably: photos are 572 px wide frames and look soft above ~600 px, and the contact details are placeholders.
