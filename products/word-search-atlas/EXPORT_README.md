# Product website maintenance

The live site is https://zachmackay.com/products/word-search-atlas/ and is published from the main branch of AlexZander73/AlexZander73.github.io. Keep this legacy route stable even if the display name changes.

Support: https://zachmackay.com/support/word-search-atlas/
Privacy: https://zachmackay.com/privacy/word-search-atlas/

September 2026 refresh uses real browser captures from the repaired game, not simulated purchases. Update screenshots after user-visible gameplay changes. The generated icon master and reproducible size packaging live in the WordSearch app repository. Font licenses are in assets/fonts.

Before App Store launch, replace the coming-soon text with the verified App Store link; do not invent an app ID, price, rating or download count. Keep page-specific HTML metadata and content.json current. Portfolio listings and support links are controlled only by data/showcase.json; run python3 scripts/build-catalog.py after editing it. Products, Home, Play, Campaign, About and Support use that shared registry.
