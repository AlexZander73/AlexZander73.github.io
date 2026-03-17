# Hydrate export package

## What the product appears to be

This repo reads as a `mobile app` with a strong phone-first posture. The README names it as a water tracking app, the UI code centers on a single filling bottle and quick intake actions, and the repo now includes a Capacitor iOS wrapper in addition to the PWA build.

## Source material used

Public-safe source files and assets used for this export:

- `README.md`
- `package.json`
- `capacitor.config.ts`
- `public/icon.svg`
- `src/pages/Home.tsx`
- `src/pages/Shop.tsx`
- `src/pages/Stats.tsx`
- `src/pages/Settings.tsx`
- `src/components/IntakeButtons.tsx`
- `src/state/storage.ts`

No screenshots, support pages, privacy pages, changelogs, or release notes were found in the repo.

## Chosen framing and why

Chosen framing: `product overview`

Reasoning:

- The product is consumer-facing and visually specific enough to support a product page.
- The repo does not provide app-store metadata, published support/privacy pages, or release material, so an app-store or launch-page framing would require claims the repo cannot support.
- A product overview lets the export stay specific about the bottle mechanic, local tracking model, streaks, quick-add actions, units, and cosmetic unlock loop without inventing external status.

## Assumptions made

- The safest status label is `In development`.
- `Web PWA` is safe because the README explicitly describes installable offline-capable PWA behavior.
- `iOS developer build` is safe because the repo contains a Capacitor iOS project, but there is no evidence of App Store distribution.
- Support and privacy URLs are placeholders and left empty because no public versions were found in the repo.
- Export visuals are custom diagrams because screenshots were not available.

## URLs and fields that still need manual hookup

- `supportUrl` in `content.json` is blank and needs a real public support destination if one exists.
- `privacyUrl` in `content.json` is blank and needs a real public privacy destination if one exists.
- The top-bar back link in `index.html` uses `../../` as a placeholder for central site import.
- If the central site requires raster social metadata, replace or supplement `./assets/hydrate-catalog.svg` with a PNG export.

## Main catalog/product card preview

Suggested main preview asset:

- `./assets/hydrate-catalog.svg`

Reason:

- It is the strongest self-contained visual in this export and summarizes the bottle view, stats, level ring, and color unlock loop.

## Support/privacy URL status

- Support URL: placeholder, not final
- Privacy URL: placeholder, not final

## Screenshot availability

Screenshots were not available in the repo.

This export uses:

- `./assets/hydrate-catalog.svg`
- `./assets/hydrate-flow.svg`

These are custom diagrams derived from the existing icon and the observable feature set in the repo.

## Integration notes for future central-site import

- Suggested destination path: `/products/hydrate/`
- Suggested support path if needed: `/support/hydrate/`
- Suggested privacy path if needed: `/privacy/hydrate/`
- Suggested catalog title: `Hydrate`
- Suggested catalog blurb: `A bottle-first hydration tracker with local history, streaks, and collectible color palettes.`
- Suggested catalog image: `./assets/hydrate-catalog.svg`
- Suggested platform text: `Web PWA, iOS developer build`

Additional notes:

- The export is self-contained and does not rely on project build tooling.
- `content.json` mirrors the product facts used in `index.html`.
- The HTML is readable without JavaScript; no external dependencies are used.
- If real screenshots become available later, they should replace the custom diagrams first.

## Repo archetype reasoning summary

- README evidence establishes a phone-first water tracker.
- UI source files establish the bottle mechanic, stats, units, goal control, streaks, and cosmetic shop.
- Capacitor/iOS files establish a native wrapper path.

## Validation checklist

- `productExport/index.html` exists
- `productExport/styles.css` exists
- `productExport/content.json` exists
- `productExport/EXPORT_README.md` exists
- Local asset references point to files inside `productExport/assets/`
- Required metadata tags are present in `index.html`
- No obvious placeholder marketing copy remains
- No unsupported release or distribution claims were added
- The page is product-specific rather than a generic portfolio template
