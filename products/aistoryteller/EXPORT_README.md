# AIStoryTeller export package

## What the product appears to be
AIStoryTeller appears to be a local-first experimental web app for storytelling. The repo documents a Python server that opens a browser UI and supports a story workflow that can branch into world state, presets, optional memory, optional TTS, and optional image generation.

Primary inferred category: `web app`

This was chosen over `game/prototype` because the repo's documented run path is a browser interface served locally, even though the subject matter is clearly game-adjacent.

## Source material used
- `/Users/azuredreams/AIStoryTeller/README.md`
- `/Users/azuredreams/AIStoryTeller/INTEGRATION_BRIEF.md`
- `/Users/azuredreams/AIStoryTeller/docs/image_prompting_guide.md`
- `/Users/azuredreams/AIStoryTeller/docs/image_prompting_guide_aamxl.md`
- `/Users/azuredreams/AIStoryTeller/docs/image_prompting_guide_animagine.md`
- `/Users/azuredreams/AIStoryTeller/docs/image_prompting_guide_dreamshaper.md`
- `/Users/azuredreams/AIStoryTeller/docs/image_prompting_guide_pony.md`
- Visible git history on 2026-03-17
- Public-safe repo structure under `/Users/azuredreams/AIStoryTeller/scripts`, `/Users/azuredreams/AIStoryTeller/tests`, `/Users/azuredreams/AIStoryTeller/config`, and `/Users/azuredreams/AIStoryTeller/presets`

## Framing choice
Chosen framing: `experimental prototype page`

Why:
- The repo clearly shows substantial real work and iteration.
- The repo does not clearly support a polished release claim, download claim, or live-service claim.
- The product has a strong internal world and tool identity, so a calm product-world page is more honest than a generic launch page.

## Visual direction
The export uses an atlas-and-workbench visual language:
- dark observatory background
- warm ember and moss accents
- serif-led typography for a storybook tone
- original SVG diagrams instead of fake screenshots

This direction is meant to feel specific to AIStoryTeller's mix of story, map, world, and voice systems.

## Assumptions made
- Status is listed as `Active prototype` because visible repo history continues through 2026-02-28 but no release packaging or store listing is present.
- `Browser` is listed as a platform because the README documents a local browser URL.
- `macOS` is listed because setup notes explicitly mention macOS and Apple Silicon.
- No public-safe screenshot pack was available, so the export uses original SVG artwork rather than literal UI captures.

## Fields and URLs needing manual hookup later
- `supportUrl` is currently blank in `content.json`
- `privacyUrl` is currently blank in `content.json`
- Primary CTA is an internal anchor, not an external product or repo URL
- Back-to-site link in `index.html` is a placeholder root link: `/`

## Main catalog/product card preview
Suggested preview asset:
- `/Users/azuredreams/AIStoryTeller/productExport/assets/aistoryteller-preview.svg`

This is the intended main catalog image and the current `catalog.image` value in `content.json`.

## Support and privacy status
- Support URL: placeholder, not final
- Privacy URL: placeholder, not final

These should be replaced during central-site integration if product-specific routes exist.

## Screenshot availability
Literal product screenshots were not available in a clean public-safe set inside this repo. The export therefore uses product diagrams instead. This is intentional and should not be presented later as screenshot evidence.

## Integration notes for future central-site import
- suggested destination path: `/products/aistoryteller/`
- suggested support path if needed: `/support/aistoryteller/`
- suggested privacy path if needed: `/privacy/aistoryteller/`
- suggested catalog title: `AIStoryTeller`
- suggested catalog blurb: `A local browser-based story workbench that keeps scenes, world state, voice, and visual prompting in one prototype surface.`
- suggested catalog image: `./assets/aistoryteller-preview.svg`
- suggested platform text: `Browser UI for a local Python runtime; macOS is explicitly documented.`

## Export file list
- `/Users/azuredreams/AIStoryTeller/productExport/index.html`
- `/Users/azuredreams/AIStoryTeller/productExport/styles.css`
- `/Users/azuredreams/AIStoryTeller/productExport/content.json`
- `/Users/azuredreams/AIStoryTeller/productExport/assets/aistoryteller-preview.svg`
- `/Users/azuredreams/AIStoryTeller/productExport/assets/aistoryteller-session-sheet.svg`
- `/Users/azuredreams/AIStoryTeller/productExport/EXPORT_README.md`

## Validation notes
- The package is self-contained.
- The page is readable without JavaScript.
- Metadata tags were added directly to `index.html`.
- All asset links are local and relative within `productExport/`.
