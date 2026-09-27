# Digital Independence Day: slides

Talk by Friedger at the Open Commons Day, Commons Hub Brussels, Sunday 4 October 2026.

- `slides.md`: the deck, in CryptPad presentation Markdown (slides are separated by `---`)
- `upload-to-cryptpad.mjs`: writes `slides.md` into the CryptPad presentation at
  <https://cryptpad.fr/presentation/#/3/presentation/edit/353589968926067f9255e7bbcfb9fd1d/>

## Upload

```sh
cd slides/digital-independence-day
npm install --no-save playwright
npx playwright install chromium
node upload-to-cryptpad.mjs            # headless
node upload-to-cryptpad.mjs --headed   # watch it happen
node upload-to-cryptpad.mjs --dry-run  # just print the deck
```

### Safe links (`#/3/…`)

The default URL is a CryptPad *safe link*: it holds only the pad's ID, not its key, so it
opens only for a logged-in account that has the pad in its CryptDrive. Either:

- log in once; the browser profile is kept in `.cryptpad-profile/` (git-ignored):
  ```sh
  node upload-to-cryptpad.mjs --login   # log in, then close the window
  node upload-to-cryptpad.mjs
  ```
- or pass the full edit link (`#/2/presentation/edit/<key>/`) from Share → Link:
  ```sh
  node upload-to-cryptpad.mjs --url 'https://cryptpad.fr/presentation/#/2/presentation/edit/…/'
  ```

### How it works

CryptPad pads are end-to-end encrypted and the key sits in the URL fragment, so there is
no upload API. The script opens the pad in Chromium, waits until the editor is writable,
replaces the content with `slides.md`, then waits for CryptPad to sync.
**It overwrites whatever is already in the pad**, but earlier versions remain in the pad's history.
Use `--url` to target a different pad.
