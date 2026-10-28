# Overseer product page

This static product preview lives at `/products/overseer/`, with support and data/privacy guides alongside it. It describes the 1.22.2 development build and intentionally has no release download or purchase CTA.

## Listing source

Edit the `overseer` record in `data/showcase.json` for portfolio listing content, feature status, preview access, order, image, platform/tool metadata and help links. Home, Play, Campaign, About, Products and Support already read that shared registry. Do not add separate entries to legacy projects JSON or hardcode cards into their HTML.

Run `python3 scripts/build-catalog.py` after changes to generate `products/catalog.json` and `sitemap.xml`. Validate with `python3 scripts/build-catalog.py --check` and `node --test scripts/project-catalog.test.cjs`.

## Assets and interactive example

Artwork and icon are web-optimized exports of Overseer's existing observatory assets. The Activity image comes from the app's non-observing visual preview with fabricated workloads, not a user's live process list. No personal configuration or API credentials are included.

`demo.js` is a browser-only, illustrative rule explanation. It doesn't connect to services or inspect the visitor's machine. Busy and unknown prevent the example action; the automatic-cleanup switch, timeout slider and selected workload update the explanation. No analytics, external fonts or third-party embeds are included.

Update page copy and the guides when the app's capabilities change. Public release/download details should only be added after a release exists.
