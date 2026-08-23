---
last_updated: 2026-08-23
description: Production notes for agent-wizard — static Angular build, SPA hosting, and what is NOT deployable.
tags: [production, build, deploy, static, spa]
status: active
---

# Production

agent-wizard is a static SPA. There is no backend, no secrets, and no deployable agent runtime. Keep this page honest — do not invent infrastructure.

## Build

```bash
ng build
```

Produces static artifacts in `dist/` (optimized production build).

## Hosting

- Serve `dist/` from any static host (nginx, S3/CloudFront, Netlify, Vercel, GitHub Pages).
- Angular SPA: configure **SPA fallback routing** so unknown paths serve `index.html` (client-side routing).
- No server-side rendering is configured.

## What is NOT deployable

| Item | Status |
|---|---|
| Agent system (`.opencode/`, `source/`) | Config, not runtime — no deployable artifact |
| `refined-source/` | Data files; consumed at build time by the UI |
| Graph UI | Implemented — part of the static SPA; data ships as JSON bundles imported at build time |

## Runtime

The graph UI is wired: the data layer ships as static JSON bundles imported at build time (`refined-source/*.json` → Angular modules). No runtime API is planned.

## References

- Build: `docs/project.md` → Commands
- Local: `docs/local-dev.md`