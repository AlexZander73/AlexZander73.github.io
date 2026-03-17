# Word Search Atlas export

## What the product appears to be

This repo appears to be a mobile-first puzzle game with a public web build. The strongest evidence is the shipped
browser entry point, PWA manifest, service worker, public support/privacy pages, App Store metadata, and the included
Capacitor iOS project.

Primary archetype chosen: `mobile app`

This repo also clearly has a web surface, but the public-facing framing is still closer to a mobile app because the
repo includes iPhone/iPad-specific store copy and native packaging.

## Chosen page framing

Chosen framing: `field manual`

Reason:

- The product is built around routes, destinations, a globe map, and travel-flavored vocabulary.
- A field-manual tone fits the repo better than a generic launch page or portfolio card layout.
- It lets the export stay calm, tactile, and product-specific without inventing market or launch claims.

## Source files and assets used

Safe product facts and copy were derived from:

- `index.html`
- `manifest.json`
- `support.html`
- `privacy.html`
- `store/app-store-metadata.json`
- `icon.svg`
- `icon-512.png`
- `earth.jpg`
- `ATTRIBUTION.md`

## Assumptions made

- The safest primary CTA is the current GitHub Pages build, because the repo does not prove a current App Store
  listing.
- iPhone and iPad are treated as supported platforms because the repo contains native iOS packaging and store-facing
  copy that names both.
- No gameplay screenshots were available in-repo, so the export uses shipped iconography and repo-derived artwork
  instead of fabricated captures or device mockups.

## What still needs manual hookup later

- Replace the top-left `../../` back link if the central site uses a different root path.
- Decide whether support/privacy should keep using the existing GitHub Pages URLs or move to central-site routes.
- If actual gameplay screenshots are captured later, swap them into the visual section and update `content.json`.

## Main catalog / preview asset

Suggested main catalog asset:

- `./assets/atlas-preview.svg`

This was created for the export because the repo had a strong icon and globe texture, but no wide preview image or
checked-in screenshots. It is the best fit for a central product card and OG image in the current package.

## Support and privacy URL status

Current export URLs are not placeholders. They use the live URLs already present in `store/app-store-metadata.json`:

- Support: `https://alexzander73.github.io/WordSearch/support.html`
- Privacy: `https://alexzander73.github.io/WordSearch/privacy.html`

For a future central site, these may still be swapped to internal relative routes if the support/privacy pages are
mirrored there.

## Screenshot availability

Actual gameplay screenshots were not available in the repository.

- A capture plan exists in `store/screenshot-plan.md`
- Finished screenshot files do not exist in the repo

The export therefore uses:

- `./assets/atlas-preview.svg`
- `./assets/icon-512.png`
- `./assets/earth.jpg`

## Integration notes for later import

- Suggested destination path: `/products/word-search-atlas/`
- Suggested support path if mirrored: `/support/word-search-atlas/`
- Suggested privacy path if mirrored: `/privacy/word-search-atlas/`
- Suggested catalog title: `Word Search Atlas`
- Suggested catalog blurb: `A travel-themed word search built around globe routes, local progress, and quiet offline play.`
- Suggested catalog image: `./assets/atlas-preview.svg`
- Suggested platform text: `Web, iPhone, iPad`

`content.json` is structured for later extraction into a central catalog, but the page itself does not depend on JS and
remains readable if scripts fail or are not used.

## Validation summary

- `productExport/index.html` created
- `productExport/styles.css` created
- `productExport/content.json` created
- `productExport/EXPORT_README.md` created
- `productExport/assets/` populated with repo-safe assets
- Metadata tags included in `index.html`
- No generic lorem ipsum or unsupported launch claims
- No screenshots fabricated
- Visual direction is specific to the atlas / travel puzzle identity of this repo
