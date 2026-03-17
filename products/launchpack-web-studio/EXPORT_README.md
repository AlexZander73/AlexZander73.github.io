# LaunchPack Web Studio Export Notes

## What this product appears to be

This repo reads as an async website-launch system rather than a single brochure site. The strongest evidence is the combination of:

- a public agency site that sells fixed website packages
- an internal intake dashboard that stores submissions and tracks status
- a template-driven client-site generator with delivery-pack output

The safest repo category is `internal utility with public-safe surface`.

## Framing choice

Chosen framing: `field manual`

Reasoning:

- The repo is operational and process-heavy.
- The most distinct public-safe story is the dispatch cycle from offer to handover.
- A field-manual structure fits the repo better than a startup launch page or a generic portfolio clone.

## Source material used

- `README.md`
- `apps/agency-site/app/page.tsx`
- `packages/config/src/index.ts`
- `apps/intake-dashboard/app/intake/page.tsx`
- `apps/intake-dashboard/app/dashboard/submissions/[id]/page.tsx`
- `apps/intake-dashboard/lib/site-generator.ts`
- `docs/deploy.md`
- `docs/client-handover-email.md`

## Assumptions made

- `supportUrl` and `privacyUrl` are placeholders for later central-site hookup.
- No public live URL for the product was evidenced in the repo, so the primary CTA is an internal anchor rather than an external product link.
- No committed screenshots were treated as public-safe, so the export uses repo-derived SVG diagrams instead of pretending to show live UI captures.

## Manual hookup still needed later

- Replace `/support/launchpack-web-studio/` if the final support path differs.
- Replace `/privacy/launchpack-web-studio/` if the final privacy path differs.
- Change the back-to-site link in `index.html` if the central site uses a different root path.
- Swap the CTA target if a public repo URL or live product URL should be exposed later.

## Main catalog / card preview asset

Use `./assets/catalog-cover.svg` as the main catalog image.

## Support and privacy URLs

- Support URL: placeholder
- Privacy URL: placeholder

## Screenshot availability

Real screenshots were not available in the safe source material used for this export.

The visual section instead uses:

- `./assets/dispatch-board.svg`
- `./assets/template-shelf.svg`

These are diagrams built from repo structure, not fabricated screenshots.

## Integration notes

- Suggested destination path: `/products/launchpack-web-studio/`
- Suggested support path: `/support/launchpack-web-studio/`
- Suggested privacy path: `/privacy/launchpack-web-studio/`
- Suggested catalog title: `LaunchPack Web Studio`
- Suggested catalog blurb: `An async launch desk for productized website work, with intake, templates, and handover in one repo.`
- Suggested catalog image: `./assets/catalog-cover.svg`
- Suggested platform text: `Web`

## Validation summary

- `productExport/index.html` created
- `productExport/styles.css` created
- `productExport/content.json` created
- `productExport/EXPORT_README.md` created
- local assets are relative and self-contained
- metadata tags are present in `index.html`
- support/privacy paths are placeholders, not final
- no unsupported claims were added
- the visual direction is product-specific rather than a generic portfolio template
