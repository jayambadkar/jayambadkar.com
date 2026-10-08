# jayambadkar.com

Personal website of **Jay Ambadkar**: a fast, static, interactive single-page site.

- **Stack:** [Vite](https://vite.dev) + React 18 + TypeScript (strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`)
- **Styling:** CSS Modules + a small global token sheet (`src/styles/global.css`) with CSS custom properties for the dark and light themes. No UI framework or runtime CSS-in-JS.
- **Runtime dependencies:** `react` and `react-dom` only (~60 kB gzipped JS in total).
- **Hosting:** GitHub Pages (static `dist/`), custom domain via Namecheap DNS.

## Features

- Generative canvas hero: particles flow through a trig vector field `θ(x,y,t) = π·(sin(kx+t) + cos(ky−1.3t))`, link to their neighbours and get pushed away by the cursor. It pauses when off-screen or when the tab is hidden.
- Dark/light theme toggle. The choice is saved to `localStorage` (`ja-theme`), and an inline script applies it before first paint so there's no flash of the wrong theme.
- **⌘K / Ctrl+K** command palette with fuzzy search. It jumps to sections, opens links and runs actions.
- **`` ` `` (backtick)** opens a hidden terminal. Try `help`, `whoami`, `projects`, `neofetch`, `goto contact`, `theme light`, `ls`, `cat about.txt`. It has history (↑/↓) and Tab completion.
- `g` then `h`/`a`/`p`/`e`/`c` jumps to a section (vim/GitHub style).
- Smooth section navigation, an active-section indicator in the nav, and scroll-reveal animations.
- Accessible: skip link, semantic landmarks, native `<dialog>` for modals (focus trap + Esc), ARIA combobox/listbox in the palette, visible focus rings. **Respects `prefers-reduced-motion`**: the canvas draws one static frame, the typewriter turns static, and transitions and smooth scroll are disabled.
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
    profile.ts                 Name, bio, education, hero highlights
    projects.ts                Project cards
    experience.ts              Timeline entries
    socials.ts                 GitHub, X, …
    sections.ts                Section ids/labels (nav, palette, terminal `goto`)
  sections/                    Page sections: Hero, About, Projects, Experience, Contact
  components/                  Header, ThemeToggle, CommandPalette, Terminal, ParticleField, …
  hooks/                       useTheme, useReducedMotion, useActiveSection, useHotkey
  lib/                         terminal.ts (command registry), scroll.ts, cx.ts
  styles/global.css            Design tokens (both themes), reset, utilities
```

## Editing content

All copy is typed data in `src/data/`, so the compiler catches missing or misspelt fields.

- Anything still unconfirmed is marked **`TODO(content)`**. Run `grep -rn "TODO" src/data` to list it.
- Entries with `placeholder: true` show a visible orange **PLACEHOLDER** badge on the page and in the terminal. Remove the flag once an entry is real.
- To add a project, append to `projects` in `src/data/projects.ts`. The tag filter chips are generated from `tags`.
- To add a social link, append to `src/data/socials.ts`. It shows up automatically in Contact, the command palette and the terminal (`socials`). `icon` must be one of the `IconName` values in `types.ts`.
- To add a terminal command, add an entry to `commands` in `src/lib/terminal.ts`.
- To add a section, add its id to `SectionId` and `sections.ts`, create `src/sections/Foo.tsx` with `<section id="foo">`, and render it in `App.tsx`.

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
