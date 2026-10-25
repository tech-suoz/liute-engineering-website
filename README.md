# LIUTE Engineering Solutions website

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no scripts to run.
GSAP + ScrollTrigger (3.12.5, cdnjs) load on the homepage only; everything degrades gracefully without them.

## Structure
- `index.html` homepage; `pages/*.html` all inner pages (every menu item is a real page)
- `css/` style (tokens/colours), navigation, components, animations, responsive, home (homepage only)
- `js/` main, navigation, animations, scroll-effects, interactions, hero, home, project-gallery, forms, config
- `assets/images/projects|team` real LIUTE photographs; `hero|industrial` illustrative images (labelled on the site)
- `robots.txt`, `sitemap.xml`

## Run locally
Open `index.html`, or run `python3 -m http.server` in this folder (optional) and visit http://localhost:8000.

## Colours
Edit the tokens at the top of `css/style.css` (`--accent`, `--accent-2`, `--blue`, `--navy`, `--ink`, `--paper` for the cream).

## Contact form
`pages/project-enquiry.html` and `pages/contact.html` contain the form; validation is in `js/forms.js`.
It sends nothing until you set `formEndpoint` in `js/config.js` (a POST endpoint that accepts form data). Until then it tells visitors it was not sent.

## Editing content
Content is plain HTML. Phone numbers, email and the footer repeat on each page, so use your editor's "find and replace in all files" for contact changes. The menu is repeated in each page's header.

## Replace images / add hero video
Replace files in `assets/images/...` keeping filenames. Hero video: add `<video>` support by setting `heroVideo` in `js/config.js` (the homepage hero currently uses the changing image slides).

## Before launch
- Replace `https://www.example.com` in canonical/Open Graph tags and `sitemap.xml` with the real domain (find and replace).
- Supply Privacy Policy and Terms text (placeholders).
- Swap low-resolution profile photos for originals when available.

## Premium homepage images
See `IMAGE-GUIDE.md`: drop licensed JPGs into `assets/images/premium/` with the listed filenames; the homepage uses them automatically and falls back to the current images otherwise.
