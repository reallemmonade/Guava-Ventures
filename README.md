# guava.ventures

The Guava Ventures website: a static site served by Cloudflare Workers (static assets). There is no build step; `wrangler.jsonc` tells Cloudflare to publish this folder as is, and `.assetsignore` keeps repo files like this README off the site.

- `index.html`: the homepage
- `privacy/`, `terms/`, `support/`: policy and help pages (drafts; fill in the [BRACKETS])
- `404.html`: shown for unknown addresses
- `assets/logo/`: the Guava Ventures logo. `guava-ventures-lockup-*` is the guava mark plus the guava.ventures wordmark; `guava-ventures-wordmark-*` is the wordmark alone; `guava-mark*` is the symbol (bare, on a rounded navy tile, or full-bleed square for app icons and social avatars). Use `-white` on dark backgrounds and `-ink` on light ones. Text is outlined, so the files need no fonts.
- `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png`: browser tab icons and the link-preview image
