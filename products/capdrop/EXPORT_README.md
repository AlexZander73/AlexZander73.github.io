# Capdrop product export

## What this is
Capdrop appears to be a native iOS water tracking app with widgets, quick logging, reminders, optional HealthKit writes, local history, bottle-cap rewards, and selectable app icons.

## Source material used
- `ios/App/App/AppDelegate.swift`
- `ios/App/HydrateWidgets/HydrateWidgets.swift`
- `ios/App/App/Info.plist`
- `ios/App/App/Assets.xcassets`
- Generated Capdrop icon artwork saved into `productExport/assets/`

## Framing
Chosen framing: minimal app page. The repo is primarily a mobile app launch surface now, and the strongest public story is visual, low-friction hydration tracking rather than technical internals.

## Assumptions
- Final App Store URL is not available yet, so the CTA points to the public repository.
- Support uses GitHub Issues until a dedicated support email exists.
- Privacy wording is based on the current native implementation: local storage, widgets via app group, optional HealthKit, local notifications, and manual JSON export.

## Manual hookup needed
- Replace the CTA with the final App Store URL after App Store Connect approval.
- Confirm the final support URL or support email.
- Confirm App Store privacy nutrition labels match the implementation at submission time.

## Integration summary
- Suggested destination path: `/products/capdrop/`
- Suggested support path: `/products/capdrop/support/`
- Suggested privacy path: `/products/capdrop/privacy/`
- Suggested terms path: `/products/capdrop/terms/`
- Suggested catalog title: `Capdrop`
- Suggested catalog blurb: `A visual iOS water tracker with bottle progress, cap rewards, widgets, reminders, and streak maps.`
- Suggested catalog image: `./assets/capdrop-primary.png`
- Suggested platform text: `iPhone, iPad, iOS widgets`

## Screenshot availability
Simulator screenshots were captured during launch review and optimized into `productExport/assets/screen-home.jpg`, `screen-stats.jpg`, `screen-reminders.jpg`, `screen-premium.jpg`, and `screen-settings.jpg`. Replace with final App Store device screenshots after device QA if needed.

## Files in this package
- `index.html`
- `styles.css`
- `content.json`
- `assets/`
- `privacy/index.html`
- `support/index.html`
- `terms/index.html`
