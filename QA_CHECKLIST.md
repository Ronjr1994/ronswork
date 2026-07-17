# Publication QA Checklist

## Content and trust

- [ ] Public builds open correctly.
- [ ] Concept work is labeled.
- [ ] Testimonials and screenshots match supplied sources.
- [ ] Contact email, LinkedIn, Upwork, and resume links are correct.
- [ ] No unsupported performance or client claims appear.
- [ ] “Built with” language is accurate.

## Privacy and conversion

- [ ] Sensitive-data warning is visible before contact details.
- [ ] Safety confirmation is required.
- [ ] Local saving is opt-in.
- [ ] Restore and clear controls work.
- [ ] Compose email and copy brief work.
- [ ] `site-config.js` endpoint is blank unless a real secure endpoint has been tested.

## Responsive layout

- [ ] 1440 px desktop
- [ ] 1280 px laptop
- [ ] 1024 px compact laptop
- [ ] 768 px tablet
- [ ] 430 px large phone
- [ ] 390 px iPhone/Android
- [ ] 360 px small phone
- [ ] Landscape mobile

## Accessibility

- [ ] Keyboard navigation
- [ ] Visible focus states
- [ ] Escape closes dialogs
- [ ] Dialog focus stays contained
- [ ] Reduced motion produces a stable layout
- [ ] Images have appropriate alt text
- [ ] Buttons have accessible labels

## Technical

- [ ] `python3 scripts/validate_site.py`
- [ ] JavaScript syntax passes
- [ ] No missing local assets
- [ ] No duplicate IDs
- [ ] `styles.min.css` exists
- [ ] `index.html` is at ZIP root
- [ ] `privacy.html`, `robots.txt`, `sitemap.xml`, and favicon are included
- [ ] GitHub Pages deployment loads without path errors
