# Product Export README: Barbell Easy Calculator

## What this product appears to be
Barbell Easy Calculator appears to be a **mobile app** project (primary archetype) built with React + Capacitor for iPhone and Android.

Evidence from the repository points to a practical barbell-loading utility with two main user paths:
- target-weight calculation
- visual mirrored plate building

## Repo files/assets used as source material
- `/Users/azuredreams/Development/BarbellCalculator/README.md`
- `/Users/azuredreams/Development/BarbellCalculator/package.json`
- `/Users/azuredreams/Development/BarbellCalculator/capacitor.config.ts`
- `/Users/azuredreams/Development/BarbellCalculator/src/sample_data/samplePresets.ts`
- `/Users/azuredreams/Development/BarbellCalculator/src/tests/plateSolver.test.ts`
- `/Users/azuredreams/Development/BarbellCalculator/src/tests/screens.test.tsx`
- `/Users/azuredreams/Development/BarbellCalculator/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`

## Chosen framing and why
Chosen framing: **technical instrument page**.

Why this framing:
- The product is a utility with deterministic behavior, explicit constraints, and practical workflows.
- The repository evidence supports clear operational claims (modes, solver behavior, inventory constraints) better than lifestyle marketing language.
- A focused "instrument" framing fits gym-floor usage: fast decisions, readable outputs, low fluff.

## Assumptions made
- Support and privacy links are placeholders for future central-site routing.
- Status is described as "MVP foundation in repository" based on README language and available project structure.
- No app-store listing is claimed because this repository does not provide explicit store URLs.

## Fields/URLs needing manual hookup later
- `product.supportUrl` in `content.json` currently points to `/support/barbell-easy-calculator/` (placeholder).
- `product.privacyUrl` in `content.json` currently points to `/privacy/barbell-easy-calculator/` (placeholder).
- Top-bar and footer links in `index.html` assume central site paths and may need route adjustments.

## Main catalog/product card preview asset
Use:
- `./assets/loadboard.svg`

Reason:
- Wide format suitable for catalog/social-style previews.
- Product-specific visual treatment created for this export package.

## Support/privacy URL status
- Support URL: placeholder, not final.
- Privacy URL: placeholder, not final.

## Screenshot availability
- In-app screenshots are **not** present in this repository.
- Export uses:
  - app icon copied from iOS asset catalog
  - a repo-safe custom visual board (`loadboard.svg`) for preview usage

## Integration notes for future central site import
- Package is self-contained under `/productExport/` with relative asset paths.
- No framework, build step, npm dependency, or external JS dependency is required.
- HTML includes required metadata tags for product extraction and social cards.
- `content.json` includes required catalog fields and notes for safe import.

## Integration summary
- suggested destination path: `/products/barbell-easy-calculator/`
- suggested support path if needed: `/support/barbell-easy-calculator/`
- suggested privacy path if needed: `/privacy/barbell-easy-calculator/`
- suggested catalog title: `Barbell Easy Calculator`
- suggested catalog blurb: `A mobile-first barbell utility that computes symmetric plate loading with exact and nearest options.`
- suggested catalog image: `./assets/loadboard.svg`
- suggested platform text: `iOS and Android`
