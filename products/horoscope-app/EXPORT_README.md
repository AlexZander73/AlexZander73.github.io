# Horoscope App export

## What this product appears to be

This repo appears to be a ritual-focused horoscope web app with native packaging through Capacitor.
The safest primary archetype is `web app`, because the product surface lives in [`web/index.html`](/Users/azuredreams/Development/HoroscopeApp/web/index.html) and [`web/app.js`](/Users/azuredreams/Development/HoroscopeApp/web/app.js), while `ios/` and `android/` act as shells around that web implementation.

## Framing choice

I chose `product overview`.

Why:
- The repo is consumer-facing enough to deserve a product page, but there is no evidence of app-store publication yet.
- A launch page would overstate readiness.
- A docs-forward page would undersell the visual and ritual nature of the product.
- The product has a clear user-facing loop, so a restrained overview is the safest truthful frame.

## Source material used

Public-safe repo sources used for copy and classification:
- [`README.md`](/Users/azuredreams/Development/HoroscopeApp/README.md)
- [`BUILD_STATUS.md`](/Users/azuredreams/Development/HoroscopeApp/BUILD_STATUS.md)
- [`web/index.html`](/Users/azuredreams/Development/HoroscopeApp/web/index.html)
- [`web/app.js`](/Users/azuredreams/Development/HoroscopeApp/web/app.js)
- [`web/manifest.json`](/Users/azuredreams/Development/HoroscopeApp/web/manifest.json)
- [`capacitor.config.ts`](/Users/azuredreams/Development/HoroscopeApp/capacitor.config.ts)
- [`web/icon-512.png`](/Users/azuredreams/Development/HoroscopeApp/web/icon-512.png)
- [`ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json`](/Users/azuredreams/Development/HoroscopeApp/ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json)

## Assumptions made

- The product is not described as app-store live because the repo does not evidence store publication.
- Support currently points to GitHub issues because no dedicated support page exists in the repo.
- Privacy is left unresolved because there is no privacy page or policy file in the repo.
- The visual section uses illustrated assets rather than screenshots because no public screenshots were available in the repo.

## Manual hookup still needed later

- `supportUrl` can stay on GitHub issues or be replaced with a dedicated support page later.
- `privacyUrl` is currently blank and should be set during central-site integration.
- The top-bar "Back to site" link currently points to `/` and assumes the future central site homepage.
- If a real deployment or app-store page exists later, the primary CTA can be changed from GitHub to that destination.

## Main catalog / product card preview

Use:
- [`productExport/assets/catalog-poster.svg`](/Users/azuredreams/Development/HoroscopeApp/productExport/assets/catalog-poster.svg)

Reason:
- It is self-contained.
- It reflects the existing moon-and-stars iconography from the repo.
- It reads well as a card image and as an OG image.

## Support and privacy URLs

- Support URL: currently set to GitHub issues, which is a real public surface.
- Privacy URL: placeholder / unresolved.

These are not both final.

## Screenshots

Real screenshots were not available in the repo.

The export uses:
- [`productExport/assets/ritual-board.svg`](/Users/azuredreams/Development/HoroscopeApp/productExport/assets/ritual-board.svg)
- [`productExport/assets/catalog-poster.svg`](/Users/azuredreams/Development/HoroscopeApp/productExport/assets/catalog-poster.svg)

These are illustrated product artifacts derived from the repo's current UI and iconography, not fabricated store screenshots.

## Integration notes for central import

- Suggested destination path: `/products/horoscope-app/`
- Suggested support path if needed: `/support/horoscope-app/`
- Suggested privacy path if needed: `/privacy/horoscope-app/`
- Suggested catalog title: `Horoscope App`
- Suggested catalog blurb: `A calm horoscope reader built for short daily check-ins, themed moods, and native-ready packaging.`
- Suggested catalog image: `./assets/catalog-poster.svg`
- Suggested platform text: `Web, iOS shell, Android shell`

## Validation summary

- `productExport/index.html` created
- `productExport/styles.css` created
- `productExport/content.json` created
- `productExport/EXPORT_README.md` created
- local asset references are self-contained within `productExport/`
- required metadata tags are present in `index.html`
- no app-store, customer, pricing, or traction claims were invented
- the page is product-specific and not a generic portfolio or SaaS template
