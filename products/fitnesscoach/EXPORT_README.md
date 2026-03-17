# FitnessCoach Product Export Notes

## What the product appears to be
FitnessCoach appears to be a cross-platform training and recovery product, primarily framed as a mobile app surface with iPhone-first delivery and Android expansion readiness.

## Repo archetype decision
- Primary archetype selected: `mobile app`
- Why:
  - `README.md` explicitly describes a cross-platform workout and recovery app scaffold.
  - `docs/architecture.md` states iPhone-first UX with iPad support and Android-ready architecture.
  - `apps/client` contains user-facing app flows (onboarding, home dashboard, check-in, planner, library, progress, active session, recap).

## Chosen page framing and why
- Chosen framing: `technical instrument page`
- Reasoning:
  - The strongest differentiated value in this repo is deterministic recommendation logic with safety-first adaptation.
  - Documentation and file structure emphasize explicit rules, contracts, and safety workflow integrity.
  - This framing communicates practical trust and system clarity without forcing generic marketing language.

## Source material used (public-safe)
- `/README.md`
- `/docs/architecture.md`
- `/docs/rule-engine.md`
- `/docs/api-contract.md`
- `/docs/database-schema.md`
- `/docs/android-expansion-plan.md`
- `/docs/sprint-roadmap.md`
- Git history summary for commits:
  - `e46f0c2` (2026-03-12)
  - `d03467a` (2026-03-12)
  - `58910d6` (2026-03-17)
- Asset:
  - `/apps/client/resources/app-icon-1024.png`

## Assumptions made
- No dedicated public privacy page URL was found; `privacyUrl` is set as a central-site placeholder: `/privacy/fitnesscoach/`.
- No dedicated support page URL was found; support is currently routed to repository issues.
- Public audience phrasing is estimated from documented scope; no user analytics were inferred.
- No screenshot gallery was found in the repo; the export uses the app icon as the primary visual asset.

## Fields and URLs needing manual hookup
- `product.privacyUrl` in `content.json` should be replaced with final central privacy page URL.
- Back link in `index.html` top bar (`href="/"`) is a placeholder and should match central site routing.
- If a dedicated support page exists later, replace `supportUrl` with that URL.

## Main catalog/product card preview asset
- Use: `./assets/fitnesscoach-preview.png`
- Origin: copied from `/apps/client/resources/app-icon-1024.png`

## Support/privacy URL status
- Support URL: provisional (`https://github.com/AlexZander73/FitnessCoach/issues`)
- Privacy URL: placeholder (`/privacy/fitnesscoach/`)

## Screenshot availability
- True UI screenshots were not found in this repository.
- Export uses the existing app icon as a reliable public-safe visual.

## Integration notes for future central-site import
- This export is self-contained and has no framework, npm, or external JS dependencies.
- Page remains readable without JavaScript.
- Metadata tags are included for catalog and social previews.

## Integration summary
- suggested destination path: `/products/fitnesscoach/`
- suggested support path if needed: `/support/fitnesscoach/`
- suggested privacy path if needed: `/privacy/fitnesscoach/`
- suggested catalog title: `FitnessCoach`
- suggested catalog blurb: `A safety-first training planner that adapts workouts with deterministic rules instead of generated advice.`
- suggested catalog image: `./assets/fitnesscoach-preview.png`
- suggested platform text: `iPhone-first via Capacitor, iPad adaptive layouts, Android-ready shared codebase`
