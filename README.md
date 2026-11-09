# guava.ventures

The Guava Ventures website: a static site served by Cloudflare Workers (static assets). There is no build step; `wrangler.jsonc` tells Cloudflare to publish this folder as is, and `.assetsignore` keeps repo files like this README off the site.

- `index.html`: the homepage (hero, the five products at a glance, one story per product, how we build, contact)
- `privacy/`, `terms/`, `support/`: policy and help pages (drafts; fill in the remaining [BRACKETS])
- `404.html`: shown for unknown addresses
- `assets/guava-sky.js`: the Guava theme engine from the brand kit. **Copy it unchanged**; it drives the living sky, the 7 looks, the fonts and glass.
- `assets/site.js`: starts the sky and builds the Appearance sheet (gear in the header) on every page. `assets/site.css`: page styles, coloured only through the theme variables.
- `assets/logo/`: the Guava Ventures logo in the Guava look. Use `-ink` on light skies and `-white` on dark ones; the header swaps them automatically.
- `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png`: browser tab icons and the link-preview image
- `download/Guava.zip`: the guava.zip Mac app (v0.1.0). Replace this file to ship a new version, and update the version and size shown in the homepage's guava.zip section.
- `assets/products/`: product images used on the homepage
