---
last_updated: 2026-09-25
description: Production notes for agent-wizard — static Angular build, SPA hosting, and what is NOT deployable.
tags: [production, build, deploy, static, spa, github-pages, ci]
status: active
---

# Production

agent-wizard is a static SPA. There is no backend, no secrets, and no deployable agent runtime. Keep this page honest — do not invent infrastructure.

## Build

Local build:

```bash
ng build
```

Production build for GitHub Pages (project/subpath site):

```bash
npm run build -- --base-href=/agent-wizard/
```

- Output path: `dist/agent-wizard/browser/` — project name `agent-wizard` plus the `browser` (client bundle) subfolder emitted by the `@angular/build:application` builder.
- `--base-href=/agent-wizard/` is required for the subpath site; the default base `/` breaks asset and router URLs under `https://DaveR-ui.github.io/agent-wizard/`.

## Hosting

- Serve `dist/agent-wizard/browser/` from any static host (nginx, S3/CloudFront, Netlify, Vercel, GitHub Pages).
- Angular SPA: configure **SPA fallback routing** so unknown paths serve `index.html` (client-side routing).
- When serving under a subpath, point the host at `/agent-wizard/` to match `--base-href`.
- No server-side rendering is configured.

### GitHub Pages

| Item | Value |
|---|---|
| Live URL | `https://DaveR-ui.github.io/agent-wizard/` |
| Site type | Project (subpath) site — served under `/agent-wizard/` |
| Workflow | `.github/workflows/deploy-pages.yml` |
| Trigger | push to `master`, plus manual `workflow_dispatch` |
| Node | 22 |
| Artifact path | `dist/agent-wizard/browser` |
| Pages actions | `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages` |
| SPA fallback | workflow copies `index.html` → `404.html` |

**Subpath base href** — this is a project site, so the build must use `--base-href=/agent-wizard/` (see Build). The workflow passes the flag; a bare `ng build` emits base `/` and breaks deep links.

**SPA fallback** — GitHub Pages has no server-side rewrite, so a direct hit on a client route (e.g. `/agent-wizard/diagram-agent/:id`, PathLocationStrategy) would otherwise 404. The workflow copies the built `index.html` to `404.html`; Pages serves it for unknown paths and the Angular router resolves the route client-side.

**One-time manual step (repo owner)** — enable Pages once via **Settings → Pages → Build and deployment → Source = GitHub Actions**. The workflow cannot self-enable this with the default `GITHUB_TOKEN`.

## What is NOT deployable

| Item | Status |
|---|---|
| Agent system (installed global config, `~/.config/opencode`) | Config, not runtime — no deployable artifact |
| `refined-source/` | Data files; consumed at build time by the UI |
| Graph UI | Implemented — part of the static SPA; data ships as JSON bundles imported at build time |

## Runtime

The graph UI is wired: the data layer ships as static JSON bundles imported at build time (`refined-source/*.json` → Angular modules). No runtime API is planned.

## References

- Build: `docs/project.md` → Commands
- Local: `docs/local-dev.md`
- Deploy workflow: `.github/workflows/deploy-pages.yml`