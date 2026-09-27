# Digital Independence Day: slides

Talk by Friedger at the Open Commons Day, Commons Hub Brussels, Sunday 4 October 2026.

- `slides.md`: the deck in Markdown (slides are separated by `---`)
- `build-pptx.mjs`: converts `slides.md` into `slides.pptx`
- `upload-to-cryptpad.mjs`: uploads the deck to the CryptPad presentation at
  <https://cryptpad.fr/presentation/#/3/presentation/edit/353589968926067f9255e7bbcfb9fd1d/>

## Upload

```sh
cd slides/digital-independence-day
npm install
npx playwright install chromium
npm run login    # once: log in to cryptpad.fr in the window that opens, then close it
npm run upload   # builds slides.pptx and imports it (add --headed to watch)
npm run build    # only build slides.pptx
```

**Close the pad in all other tabs and devices first.** Importing replaces the whole
presentation, so CryptPad refuses with "Uploading is not allowed while other users are
present" while anyone else, including your own browser, has the pad open. Earlier versions
remain in the pad's history.

## Details

- `/presentation/` pads on CryptPad are OnlyOffice (PowerPoint-style) documents, so the
  script converts the Markdown to `.pptx` and uses CryptPad's File → Import.
  For a Markdown slides pad (`/slide/…`), it writes `slides.md` into the editor instead.
- CryptPad is end-to-end encrypted and has no upload API, so the script drives the web
  app with Playwright.
- The default URL is a *safe link* (`#/3/…`): it contains only the pad's ID, and the key
  comes from the CryptDrive of a logged-in account. `npm run login` stores that login in
  `.cryptpad-profile/` (git-ignored). Alternatively pass the full edit link (`#/2/…`, from
  Share → Link): `node upload-to-cryptpad.mjs --url '<link>'`.
