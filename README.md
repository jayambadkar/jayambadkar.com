# jayambadkar.com

Personal website of **Jay Ambadkar**: a fast, static, interactive single-page site.

- **Stack:** [Vite](https://vite.dev) + React 18 + TypeScript (strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`)
- **Styling:** CSS Modules + a small global token sheet (`src/styles/global.css`) with CSS custom properties for the light (default) and dark themes. No UI framework or runtime CSS-in-JS.
- **Type:** Instrument Serif (display) + Inter Variable (body), self-hosted via `@fontsource` (no Google Fonts CDN).
- **Runtime dependencies:** `react` and `react-dom` only (~60 kB gzipped JS in total).
- **Hosting:** GitHub Pages (static `dist/`), custom domain via Namecheap DNS.

## Features

- Minimal, editorial light design: warm paper background (`#f7f4ee`), warm charcoal ink, one quiet sienna accent, hairline-divided lists, and a barely-perceptible paper grain.
- Ambient hero: soft, slowly drifting blurred colour washes (sage, dusty blue, apricot, rose) in pure CSS (`components/Ambient.tsx`).
- Light is the default regardless of OS preference. An optional, equally refined warm dark theme sits behind the toggle; the choice is saved to `localStorage` (`ja-theme`) and applied before first paint (no flash).
- Header is transparent over the hero and turns translucent with a hairline once you scroll.
- **⌘K / Ctrl+K** command palette with fuzzy search. It jumps to sections, opens links and runs actions.
- **`` ` `` (backtick)** opens a hidden terminal. Try `help`, `whoami`, `projects`, `neofetch`, `goto contact`, `theme light`, `ls`, `cat about.txt`. It has history (↑/↓) and Tab completion.
- `g` then `h`/`a`/`p`/`e`/`c` jumps to a section (vim/GitHub style).
- Smooth section navigation, an active-section indicator in the nav, and scroll-reveal animations.
- Accessible: skip link, semantic landmarks, native `<dialog>` for modals (focus trap + Esc), ARIA combobox/listbox in the palette, visible focus rings. **Respects `prefers-reduced-motion`**: the colour washes stop drifting, and reveal transitions and smooth scroll are disabled.
- Responsive down to small phones. On mobile the nav collapses into the palette ("Menu").

## Scripts

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Dev server with HMR (http://localhost:5173)                        |
| `npm run build`        | Type-check (`tsc -b`) and build static site to `dist/`             |
| `npm run preview`      | Serve the built `dist/` locally                                    |
| `npm run typecheck`    | TypeScript project build (no emit)                                 |
| `npm run lint`         | ESLint (typescript-eslint `strictTypeChecked`), 0 warnings allowed |
| `npm run format`       | Prettier write                                                     |
| `npm run format:check` | Prettier check                                                     |

Requires Node ≥ 20.19 (CI uses Node 22).

## Project structure

```
.github/workflows/deploy.yml   GitHub Pages CI/CD (build → upload artifact → deploy)
public/                        Copied verbatim to dist/ (CNAME, favicon)
index.html                     HTML shell, meta tags, no-flash theme script
src/
  main.tsx, App.tsx            Entry point and app shell (hotkeys, palette actions)
  data/                        ← ALL CONTENT LIVES HERE (typed)
    types.ts                   Interfaces: Profile, Project, Experience, SocialLink, …
    profile.ts                 Tagline, "thinking about" phrases, bio, facts, honours
    projects.ts                Selected work (also feeds the hero index marquee)
    experience.ts              Work, education, volunteering
    socials.ts                 LinkedIn, GitHub, X, blog
    posts.ts                   AUTO-GENERATED from the blog feed (see below)
  components/figures/          Hairline maths SVGs (Lorenz, Lissajous, Ford, rose, Fourier)
    sections.ts                Section ids/labels (nav, palette, terminal `goto`)
  sections/                    Page sections: Hero, Work, About (with Path so far), Blog, Contact
  components/                  Header, Section, Ambient, LimitCycle, figures/*, Marquee, RotatingPhrase, CommandPalette, Terminal, …
  hooks/                       useTheme, useScrolled, useActiveSection, useHotkey, useInView, useReducedMotion
  lib/                         terminal.ts (command registry), scroll.ts, cx.ts
  styles/global.css            Design tokens (both themes), reset, utilities
```

## Editing content

All copy is typed data in `src/data/`, so the compiler catches missing or misspelt fields.

- Content comes from Jay's LinkedIn profile, GitHub READMEs, arXiv and his blog. Only verifiable facts go in; if something isn't known, leave it out.
- **Writing** is generated: `scripts/fetch-posts.mjs` reads https://jayambadkar.github.io/feed.xml and writes `src/data/posts.ts`. It runs automatically before every `npm run build` (`prebuild`); run `npm run fetch:posts` by hand to refresh. If the feed can't be reached, the committed `posts.ts` is kept, so builds never fail on the network.
- To add a project, append to `projects` in `src/data/projects.ts`. The tag filters are generated from `tags`.
- To add a social link, append to `src/data/socials.ts`. It shows up automatically in Contact, the command palette and the terminal (`socials`). `icon` must be one of the `IconName` values in `types.ts`.
- To add a terminal command, add an entry to `commands` in `src/lib/terminal.ts`.
- To add a section, add its id to `SectionId` and `sections.ts`, create `src/sections/Foo.tsx` wrapping its content in `<Section id="foo" index="06" label="Foo">` (from `components/Section.tsx`), and render it in `App.tsx`.
- Theme colours (paper, ink, accent, washes) are CSS variables at the top of `src/styles/global.css`.

## Deployment (GitHub Pages + Namecheap)

### 1. GitHub

1. Create a repo (e.g. `jayambadkar/jayambadkar.com`, or `jayambadkar/jayambadkar.github.io`) and push `main`.
2. In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which does typecheck → lint → build → `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`. You can also run it manually with `workflow_dispatch`.
4. Under **Settings → Pages → Custom domain**, enter `jayambadkar.com`. (`public/CNAME` already contains it and ends up in `dist/CNAME`.) Once DNS resolves, tick **Enforce HTTPS**.
5. Optional but recommended: verify the domain for your account (GitHub **Settings → Pages → Verified domains**) to prevent takeover.

### 2. Namecheap DNS

In Namecheap, go to **Domain List → jayambadkar.com → Manage → Advanced DNS**. Delete any parking-page records (the default `CNAME www → parkingpage.namecheap.com` and the URL-redirect `@` record), then add:

| Type         | Host  | Value                    | TTL       |
| ------------ | ----- | ------------------------ | --------- |
| A Record     | `@`   | `185.199.108.153`        | Automatic |
| A Record     | `@`   | `185.199.109.153`        | Automatic |
| A Record     | `@`   | `185.199.110.153`        | Automatic |
| A Record     | `@`   | `185.199.111.153`        | Automatic |
| CNAME Record | `www` | `jayambadkar.github.io.` | Automatic |

The domain's nameservers must be **Namecheap BasicDNS** for these records to take effect. DNS can take anything from a few minutes to a few hours to propagate. You can check it with:

```sh
dig +short jayambadkar.com
dig +short www.jayambadkar.com
```

Optional IPv6 (AAAA for `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

### Local production check

```sh
npm ci && npm run typecheck && npm run lint && npm run build && npm run preview
```
