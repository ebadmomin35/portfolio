# Prompt: replace the hero photo

Written for: an AI coding tool (Claude, Codex or similar) working in this repo. The owner says "follow prompts/update-photo.md" and nothing else.

## Goal
Replace the hero portrait with the new photo from `inbox/photo/`, in the same way the current one works on the page: same size and placement, same black-and-white treatment, and the same scroll dissolve effect as you scroll down.

## Rules (apply to every step)
- Read `KT.md` first, especially sections 2, 4, 5 and 8 (item 4, "Change the hero photo").
- Do not run git commands. Do not commit, push or fetch.
- Do not copy any wording from the CV into the site.
- Do not delete the old photo file. The owner removes it later.
- Change only the files listed below. If another file must change, stop and say why.
- Use sub-agents as described under "Process".

## Inputs
- The photo: exactly one image file in `inbox/photo/` (ignore `README.md`).
  - If there are zero or more than one image, stop and report which files you found.
  - If the PNG has no transparent background, cut the background out so it matches `assets/img/headshot-cutout.png`: a transparent PNG with the person only. Use a background-removal method available in this environment (for example the `rembg` Python package, if installed). If none is available, stop and report instead of guessing.
  - Save the cut-out as a new PNG in `inbox/photo/` (for example `<name>-cutout.png`), keep the original file, and use the cut-out for the rest of the steps.

## Steps
1. Read the photo's pixel width and height. A PNG header gives these directly (bytes 16 to 23, big-endian).
2. Copy the photo into `assets/img/` with a NEW file name, for example `headshot-cutout-YYYYMMDD.png` using today's date. A new name is needed because `vercel.json` caches `/assets/` for a week, so a same-name file would keep showing the old image for visitors.
3. In `index.html`, find the `img.ep-hero__photo` element (around line 85). Change only:
   - `src` to the new path
   - `width` and `height` to the photo's real pixel size
   - `alt` only if the owner asked for new alt text; otherwise keep "Portrait of Ebad Momin"
   Keep the class, `decoding` attribute and everything else as it is.
4. Keep the black-and-white look. It comes from the `filter: grayscale(1) ...` rule in `css/hero.css` (around line 199). Do not change that rule unless the new photo needs it, and say so if you do.
5. Check the dissolve effect still works with the new photo. Open `js/photo-dissolve.js` and search for any hard-coded size, file name or `headshot`. If you find one, update it to match. Do not change the effect's timings or colours.
6. Update the photo file name in `KT.md`: the "Hero photo" row in section 5 and the file list in section 2. Add a note that the old file is kept until the owner removes it.
7. If you changed any `.js` file, run `node --check <file>` from the portfolio folder.

## Process (sub-agents)
1. Builder sub-agent (model: haiku): carries out Steps 1 to 7 and reports the exact lines changed.
2. Verifier sub-agent (model: haiku), a separate agent that did not do the build: checks the list below and reports pass or fail for each item, with evidence.
3. If any check fails, send the failures back to the builder and run the verifier again. Stop after 3 rounds and report what is still failing.

## Verification checklist
- [ ] Exactly one new file exists in `assets/img/` with a new name; the old file still exists.
- [ ] The new image is a transparent PNG with the person only. Open it with the Read tool and check the edges: no leftover background, no cut-off hair or shoulders.
- [ ] `index.html` `img.ep-hero__photo` has the new `src`, and `width`/`height` match the real pixel size of that file.
- [ ] Nothing else in `index.html` changed except that element (compare against the previous version of the line).
- [ ] No hard-coded old file name or size remains in `js/`, `css/` or `index.html` (search for `headshot` and the old width/height).
- [ ] `node --check` passes for any changed `.js` file.
- [ ] `KT.md` names the new file.
- [ ] No git command was run.

## Report back (short)
- The new file name and its pixel size.
- The exact lines changed in each file, before and after.
- Each checklist item: pass or fail.
- Anything not checked. In particular, say that the visual result was not seen in a browser unless you actually ran one.
