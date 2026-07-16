# Launch Checklist — Ron's Work V26

## Before uploading

- Run `python3 scripts/build_css.py`.
- Run `python3 scripts/validate_site.py`.
- Confirm `site-config.js` keeps `intakeEndpoint: ""` unless a secure endpoint has been tested.
- Open `index.html`, `privacy.html`, and `404.html` locally.
- Confirm the resume PDF opens.
- Confirm Digna's and Kyrie's public project links open.
- Confirm email, LinkedIn, and Upwork links are correct.

## Publish to GitHub Pages

1. Extract the ZIP.
2. Upload the contents—not the outer folder—to the root of the `ronworks` repository.
3. Keep `.nojekyll` and `index.html` at the repository root.
4. Commit the changes.
5. In GitHub Pages settings, publish from the repository branch and root folder used by the site.
6. After deployment, hard-refresh the page and test the live URL.

## Live-device checks

- 1440 px desktop
- 1280 px laptop
- 1024 px compact laptop
- 768 px tablet
- 430 px large phone
- 390 px iPhone / Android
- 360 px small phone
- Landscape phone

## Conversion checks

- Header Start Project opens the guided brief.
- Contact Let’s Work opens the guided brief.
- Safety warning is visible.
- Safety confirmation is required.
- Copy brief works.
- Compose email opens the visitor's email application.
- Local saving is off by default.
- Restore and clear draft controls work.
- Ask Ron routes visitors into the correct service brief.

## Trust checks

- Public builds are labeled.
- Concept studies are labeled.
- No unsupported performance metrics appear.
- “Built with” is used instead of “Powered by.”
- Feedback and source screenshots match supplied materials.
