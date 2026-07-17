# Ron's Work — Production Build V26

A responsive service portfolio for Ronaldo Dialino Jr., focused on healthcare operations, documentation, reporting, workflow automation, and digital support.

## Publish

Upload the **contents of this folder** to the root of the `ronworks` GitHub repository. Keep `index.html` at the repository root.

The build includes:

- `.nojekyll`
- `index.html`
- `styles.min.css`
- modular JavaScript
- privacy and 404 pages
- favicon and manifest
- Open Graph image
- robots file and sitemap
- launch and integration documentation

## Validate before publishing

```bash
python3 scripts/build_css.py
python3 scripts/validate_site.py
```

Or run both through:

```bash
npm run build
```

The validator checks:

- missing local files;
- duplicate HTML IDs;
- all 42 tool logos;
- JavaScript syntax;
- trust and privacy text;
- production CSS generation.

## Project intake

The public build is safe to publish immediately with the **Compose email** fallback.

`site-config.js` contains:

```js
window.RONS_WORK_CONFIG = Object.freeze({
  contactEmail: "ronjr.dialino@gmail.com",
  intakeEndpoint: "",
  siteUrl: "https://ronjr1994.github.io/ronworks/"
});
```

Leave `intakeEndpoint` empty until a secure HTTPS form endpoint has been created and tested. Do not add credentials or API keys to a GitHub Pages repository.

## Privacy behavior

- The guided assistant runs in the visitor's browser.
- Nothing is sent automatically in the default build.
- Local draft saving is optional and off by default.
- Contact names and email addresses are not included in saved drafts.
- Visitors are instructed not to submit patient information, credentials, medical records, or confidential files.

## Source and production files

- `styles.css` — readable source CSS
- `styles.min.css` — production CSS loaded by the site
- `script.js` — portfolio interactions
- `automation.js` — guided intake and assistant
- `site-config.js` — deployment configuration

## Reusable system

- `PROJECT_PLAYBOOK.md`
- `DESIGN_SYSTEM.md`
- `COMPONENT_PATTERNS.md`
- `QA_CHECKLIST.md`
- `skills/client-ready-portfolio/SKILL.md`

## Current limitations

GitHub Pages is static hosting. Direct form delivery is intentionally disabled until a secure endpoint is supplied. The working email and copy-brief fallbacks remain available.

## Contact

- Email: `ronjr.dialino@gmail.com`
- LinkedIn: `linkedin.com/in/ronaldodialinojr`
- Upwork: Ronaldo Dialino Jr. profile


## Launch package

Use `LAUNCH_CHECKLIST.md` for the final GitHub Pages upload and device checks. The deployment ZIP keeps `index.html` at its root and contains no credentials or API keys.

## V27 navigation and contact refinement

- Fixed all internal navbar links with reliable fixed-header scroll positioning.
- Removed skipped section layout that could make long-page anchor navigation inaccurate.
- Simplified the visible contact section to one short message and three actions.
- Added responsive contact layouts for desktop, laptop, tablet, Android, and iOS.
- Kept the privacy reminder and Built with logos in a minimal bottom line.

## V29 animated mobile hero and menu close state

- Restored the desktop-style RON'S | portrait | WORK composition on mobile.
- Restored the scroll-linked word, portrait, curtain, copy, and background animation.
- Kept the hero centered and scaled for 360–700 px widths.
- Changed the open hamburger control into a high-contrast lime Close/X button.
- Expanded the positioning statement to three short animated lines:
  Clear systems. Better support. Useful digital work.

## V30 mobile hero centering

- Locked the mobile hero into a true three-column RON'S | portrait | WORK layout.
- Forced the dark hero profile into the exact center column.
- Preserved the existing scroll-linked animation.
- Removed the lime background and border from the open hamburger control.
- Kept the black Close/X state visible over the light menu.

## V31 navigation and proof clarity

- Removed the lime fill from the open menu control on desktop, laptop, and tablet.
- Kept a transparent close control with a visible dark stroke and X.
- Replaced compressed client-proof thumbnails with the original lossless PNG screenshots.
- Displayed proof screenshots in a single full-width column for better readability.
- Added a clear full-size viewing action without applying blur, scaling, or image filters.

## V32 transparent X division

- Removed the visible stroke around the expanded-menu X control.
- Kept the X icon visible while making the surrounding division fully transparent.

