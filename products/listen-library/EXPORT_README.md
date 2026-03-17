# Listen Library export package

This export is a product-specific microsite for Listen Library, built as a static package to live under `/products/[slug]/`.

## What the product appears to be
Listen Library is a multi-platform (web + mobile) storefront and personal library system for ebooks and audiobooks. The repo includes a Next.js web app, an Expo mobile app, and a Fastify API with Prisma.

## Source material used
- README: `README.md`
- Mobile app metadata: `apps/mobile/app.json`
- Visual assets: `apps/mobile/assets/icon.png`, `apps/mobile/assets/splash.png`

## Framing choice and why
Framing: **product overview**. The repo is clearly a productized app system with UI, catalog, and library flows. A product overview fits best while staying honest about in-development status.

## Assumptions made
- No support or privacy URLs were found; placeholders are left blank.
- No product screenshots were found, so the product icon and splash were used for visuals.
- Platform claims are limited to Web + iOS/Android because the repo includes both web and Expo mobile clients.

## Fields needing manual hookup later
- `product.primaryCtaUrl`
- `product.secondaryLinks[].url`
- `product.supportUrl`
- `product.privacyUrl`

## Catalog preview asset
Use `./assets/icon.png` as the main catalog/product card image.

## Screenshot availability
No screenshots found in the repo. Icon and splash are used as visual anchors.

## Integration notes
- Suggested destination path: `/products/listen-library/`
- Suggested support path: `/support/listen-library/` (placeholder)
- Suggested privacy path: `/privacy/listen-library/` (placeholder)
- Suggested catalog title: Listen Library
- Suggested catalog blurb: A premium digital library system that blends storefront discovery with structured personal collections.
- Suggested catalog image: `./assets/icon.png`
- Suggested platform text: Web, iOS, Android

## Files in this export
- `productExport/index.html`
- `productExport/styles.css`
- `productExport/content.json`
- `productExport/assets/icon.png`
- `productExport/assets/splash.png`

