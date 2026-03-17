# Daily Journal export package

## What the product appears to be

This repo reads as a local-first guided journaling app. The primary archetype is a `web app`: the README leads with a static-site build, GitHub Pages deployment, offline PWA behavior, and browser storage. iOS and Android are present as Capacitor wrappers around that web build rather than as separate native-first products.

## Page framing and why

Chosen framing: `field manual`

Reasoning:
- The product centers on a repeatable personal practice rather than a marketplace, team workflow, or developer integration story.
- The repo language stays calm and procedural: today, prompts, mood, gratitude, calendar, search, backup.
- A notebook or ledger treatment fits the product better than a generic launch page or portfolio-style product overview.

## Source material used

Public-safe source files and assets used for this export:
- `README.md`
- `package.json`
- `capacitor.config.ts`
- `src/data/models.ts`
- `src/prompts/prompts.json`
- `src/pages/Today.tsx`
- `public/icons/app-icon.svg`
- `public/apple-touch-icon.svg`

No secrets, private config, hidden roadmap notes, or credentials were used.

## Assumptions made

- Status is marked `Pre-release` because the repo version is `0.1.0` and no public launch or store listing is evidenced.
- `supportUrl` and `privacyUrl` are blank placeholders because the repo contains a privacy statement in `README.md`, but no standalone public support or privacy pages.
- No screenshots were found in the repo, so the visual section uses:
  - an existing public app icon asset
  - a new product anatomy illustration derived from the visible feature set

## Manual hookup still needed

- `product.supportUrl` in `content.json`
- `product.privacyUrl` in `content.json`
- Top-bar backlink in `index.html` if the central site uses a path other than `/`

These support and privacy URLs are placeholders, not final.

## Main catalog preview asset

Use `./assets/daily-journal-preview.svg` as the main product card preview.

Why:
- It is landscape-oriented for catalog and social use.
- It reflects the repo's actual product structure: prompts, editor, calendar, mood, and backup.
- No real screenshots were available to use instead.

## Screenshot availability

Real screenshots were not available in the repo.

The export includes:
- `./assets/daily-journal-preview.svg` as a product anatomy illustration
- `./assets/journal-icon.svg` as the existing product mark

## Integration notes for later central-site import

- suggested destination path: `/products/daily-journal/`
- suggested support path if needed: `/support/daily-journal/`
- suggested privacy path if needed: `/privacy/daily-journal/`
- suggested catalog title: `Daily Journal`
- suggested catalog blurb: `A local-first guided journal with prompts, moods, calendar recall, and JSON backup.`
- suggested catalog image: `./assets/daily-journal-preview.svg`
- suggested platform text: `Web / PWA / iOS wrapper / Android wrapper`

## Export contents

- `productExport/index.html`
- `productExport/styles.css`
- `productExport/content.json`
- `productExport/assets/daily-journal-preview.svg`
- `productExport/assets/journal-icon.svg`

## Validation notes

- Required files were created.
- Local asset references are relative and self-contained within `productExport/`.
- Metadata tags required by the handoff spec were added to `index.html`.
- No unsupported store-availability, traction, pricing, or team claims were added.
- The page uses a product-specific notebook and ledger visual direction rather than a generic SaaS layout.
