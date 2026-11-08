# KT: Ebad Momin portfolio

Knowledge-transfer notes for the owner and for any AI tool that helps change this site later. Read this file first, then the files named in section 10.

Facts in this file were checked against the files in this folder on 2026-11-07. Items that could not be checked are listed in section 9.

## 1. What this site is

This is a single-page portfolio for Ebad Momin, Forward Deployed Engineer (FDE) and GenAI Developer. It is plain HTML, CSS and JavaScript. There is no build step, no npm and no framework. Fonts load from Google Fonts, so the page needs internet for the fonts.

To open it, run a static server in this folder, then open the printed address:

```
cd "C:\Users\fuzai\Desktop\Ebad Portfolio\portfolio"
python -m http.server 8000
```

Then open http://localhost:8000 in a browser. Opening index.html directly from disk (file://) is expected to work, but this was not tested in this pass.

## 2. Folder map

Paths are relative to the portfolio folder.

| Path | Purpose |
|---|---|
| `index.html` | The whole single page. Holds the head, loader, navbar, all section markup, footer, the palette and snake dialogs, and the script list. |
| `resume.html` | Resume page. Opened by the "View Resume" button and the Resume contact row. It embeds the CV PDF. |
| `DESIGN_SPEC.md` | Original design spec: tokens, layout per section, ownership map, flags. Do not edit it for routine changes. |
| `KT.md` | This file. |
| `prompts/` | Ready-made instructions for AI tools: `update-photo.md` (replace the hero photo) and `update-cv.md` (replace the CV). Not deployed. See section 11. |
| `inbox/photo/` | Drop the new hero photo here (one file). Not deployed. See section 11. |
| `inbox/cv/` | Drop the new CV PDF here (one file). Not deployed. See section 11. |
| `assets/` | Static files served as-is. |
| `assets/Ebad_Momin_CV_FDE_AI_Tools.pdf` | The CV currently on the site. Linked from `resume.html`. The file name changes when the CV is updated (section 11). |
| `assets/img/` | Images. |
| `assets/img/headshot-cutout.png` | Hero portrait. This is the file `index.html` uses. |
| `assets/img/ebad-hero-cutout.png` | Earlier hero cutout. Kept as a fallback; `index.html` does not use it. |
| `assets/img/headshot-original.png` | Original headshot, not used by the page. |
| `assets/img/headshot-stylish.png` | Alternate headshot, not used by the page. |
| `css/` | Stylesheets, one per section plus shared files. |
| `css/tokens.css` | Design tokens as CSS variables on `:root`. The source of truth for colour, type, spacing, radius, shadow, motion, z-index and layout values. |
| `css/base.css` | Shared primitives (`ep-container`, `ep-section`, `ep-section-head`, `ep-btn`, `ep-tag`, `ep-card`, `ep-icon-btn`, `ep-reveal`), body and dot grid, navbar, loader, progress bar, footer. |
| `css/hero.css` | Hero section. |
| `css/photo-dissolve.css` | Styles for the scroll-linked portrait dissolve canvases. |
| `css/about.css` | About section. |
| `css/skills.css` | Skills marquee rows. |
| `css/projects.css` | Projects grid and cards. |
| `css/journey.css` | Journey timeline. |
| `css/contact.css` | Contact section and form. |
| `css/snake.css` | Cyber Snake dialog. |
| `css/palette.css` | Command palette dialog. |
| `js/` | Scripts. Each section script exposes one `window.Portfolio.init<Name>` function. |
| `js/main.js` | Runs on load: starts the effects, calls each section init, runs the loader, and sets up anchor links. Holds the `MODULES` list. |
| `js/effects.js` | Shared effects: particles, parallax, scroll reveal, navbar active state, progress bar, mobile menu, Ctrl/Cmd+K and navbar trigger. |
| `js/hero.js` | Hero: letter split, rotating tagline, name scramble on hover. |
| `js/photo-dissolve.js` | Scroll-linked dissolve of the hero portrait into particles and dust. Starts itself on load. |
| `js/about.js` | About: stat count-up. |
| `js/skills.js` | Skills marquee rows. |
| `js/projects.js` | Projects: pointer spotlight on cards. |
| `js/journey.js` | Journey timeline. |
| `js/contact.js` | Contact form validation and mailto. |
| `js/snake.js` | Cyber Snake game. |
| `js/palette.js` | Command palette: list, filter, keyboard. |

## 3. Page sections in order

Each section is wrapped in marker comments in `index.html`. The marker name is the text after `BEGIN:` and `END:`.

| Order | Marker | Element and id | What it contains |
|---|---|---|---|
| 0 | (none, core) | `header.ep-navbar` | Pill navbar with logo "EM", six links (Intro, About, Skills, Work, Journey, Contact), a sliding indicator, a ⌘K or Ctrl K button, and a mobile Menu button. |
| 0 | (none, core) | `div.ep-loader` | Loader with the "EBAD MOMIN" wordmark, a liquid fill, and a 0 to 100% count. |
| 1 | `hero` | `section#intro` | Eyebrow "HI, I'M", name "Ebad Momin", tagline (grey line plus rotating phrase), paragraph, "View Work" and "View Resume" buttons, portrait. |
| 2 | `about` | `section#about` | Section head "01 About Me", four stats (4+ years, 50,000+ PDFs, 94%+ retrieval precision, 35% token cost reduction), heading, two paragraphs, availability line, Education card, Certifications card. |
| 3 | `skills` | `section#skills` | Section head "02 Skills", five marquee rows of skill chips. |
| 4 | `projects` | `section#work` | Section head "03 Projects", project cards (index labels, title, description, metric line, tags). |
| 5 | `journey` | `section#journey` | Section head "04 Journey", seven timeline entries, alternating left and right. |
| 6 | `contact` | `section#contact` | Section head "05 Contact", heading, four link rows (Email, GitHub, LinkedIn, Resume), terminal-style form. |
| - | (none, core) | `footer.ep-footer` | Copyright, four icon links (GitHub, LinkedIn, Email, Tableau Public), "Built with HTML, CSS & JavaScript" line. |
| - | `palette` | (empty pair) | Empty marker pair. Kept for ownership. |
| - | `snake` | `dialog#ep-snake` | Cyber Snake dialog: header, score, board with start and game-over overlays, on-screen D-pad. |
| - | `palette-dialog` | `dialog#ep-palette` | Command palette. It sits inside the `snake` marker block, not inside the empty `palette` pair. |

Note: the `palette` pair at about line 595 is empty. The real palette markup is between `BEGIN:palette-dialog` and `END:palette-dialog` at about lines 646 to 672, which is inside the `snake` block.

## 4. Who owns what

Ownership comes from `DESIGN_SPEC.md` section B.3. Each owner edits only the files and marker blocks in their row.

| Owner | Files | index.html area |
|---|---|---|
| Core | `css/tokens.css`, `css/base.css`, `js/effects.js`, `js/main.js`, `assets/` | Everything outside the marker blocks: head, loader, navbar, footer, script list, the markers themselves. |
| Hero | `css/hero.css`, `js/hero.js` | `BEGIN:hero` to `END:hero` |
| About | `css/about.css`, `js/about.js` | `BEGIN:about` to `END:about` |
| Skills and projects | `css/skills.css`, `js/skills.js`, `css/projects.css`, `js/projects.js` | `BEGIN:skills` to `END:skills`, `BEGIN:projects` to `END:projects` |
| Journey and contact | `css/journey.css`, `js/journey.js`, `css/contact.css`, `js/contact.js` | `BEGIN:journey` to `END:journey`, `BEGIN:contact` to `END:contact` |
| Snake and palette | `css/snake.css`, `js/snake.js`, `css/palette.css`, `js/palette.js` | `BEGIN:snake` to `END:snake`, plus the `palette` pair |
| Photo effect | `css/photo-dissolve.css`, `js/photo-dissolve.js` | None. Not in the spec ownership table. See section 9. |

The rule: each owner edits only its own files and marker blocks. A file that is not in your row needs the core owner to reassign it first. Core owns the marker comments, so do not rename or delete them. Cross-module contact happens only through the globals `window.Portfolio.*` and the event `ep:loaded`.

## 5. Content

### Where text lives

| Text | Location |
|---|---|
| Page title, description | `index.html` head |
| Hero eyebrow, name, tagline, paragraph, buttons | `index.html` hero block. The rotating words are in the `ep-hero__word` spans. The rotation list is the spans themselves. |
| Stats | `index.html` about block, `.ep-stat` elements. The number is in `data-count`. |
| About heading and paragraphs | `index.html` about block |
| Education and certifications | `index.html` about block, `.ep-about__card` sections |
| Skill chips | `index.html` skills block, one `li.ep-skills__chip` per skill, grouped in five `ul.ep-skills__track` lists |
| Project cards | `index.html` projects block, one `li.ep-projects__item` per card |
| Journey entries | `index.html` journey block, one `li.ep-journey__item` per entry |
| Contact links and form labels | `index.html` contact block |
| Footer | `index.html` footer, after the `main` element |
| Palette commands | `index.html`, `li.ep-palette__item` entries. Each has `data-href` or `data-action` and a `data-label`. |
| Snake start and game-over text | `index.html` snake block |

### Facts used

- The CV is the only source for facts: `assets/Ebad_Momin_CV_FDE_AI_Tools.pdf`. An extra copy exists in the parent folder's `extras` folder.
- Project cards use facts from the CV and the project notes in the spec. Each card's numbers (for example 3.2s to 850ms, 71% to 92%, +16%, +30%) must trace to the CV or to Ebad's notes.

### Rules

- No company or client names in new text. This rule conflicts with the current content, which names employers (Kotak, Axis, ICICI Securities, AutolyxAi) and two clients (HEM.NX and Hukum Kijiye in the Analytics card). The owner must decide before the next edit. See section 9.
- No credentials of any kind in the HTML, CSS or JS.
- No invented metrics. Every number must trace to the CV or to Ebad's own notes.
- Only Ebad facts. No text from the reference site.

### Decisions still open

| Item | Current state | Where |
|---|---|---|
| GitHub handle `ebadmomin35` | Used in footer, contact row and palette command "GitHub Profile". The work orders record a 404 on `github.com/ebadmomin`. The page now uses `ebadmomin35` instead. Ebad has not confirmed this handle, and the 404 check was not re-run. | `index.html` contact, footer, palette |
| LinkedIn URL | `https://www.linkedin.com/in/ebadmomin35/`. The owner gave this URL directly, replacing the earlier `ebadmomin` URL taken from the CV. | `index.html` contact, footer, palette |
| Phone number | Removed. No phone text in the page. | n/a |
| Availability badge "Open to freelance projects & contract work" | Kept. A `[CONFIRM]` comment sits above it in the about block. | `index.html` about block |
| Snake start subtitle "Navigate the neon snake & collect energy orbs!" | Copied from the reference. Needs Ebad's own wording or a sign-off. | `index.html` snake block |
| Footer "Built with HTML, CSS & JavaScript" line | Kept. | `index.html` footer |
| Hero photo | `headshot-cutout.png` is used. Other files exist in `assets/img/`. | `index.html` line with `ep-hero__photo` |
| Years of experience | The page says 4+ years. The earlier spec said 3+. Check against the CV. | `index.html` hero copy and about stat |

## 6. Design system

### Colours

All colours are tokens in `css/tokens.css`. The main ones:

- Backgrounds: `--ep-bg` (#090909), `--ep-bg-deep` (#050505), `--ep-surface` (#0a0a0a), `--ep-surface-raised`, `--ep-surface-glass`.
- Borders: `--ep-border`, `--ep-border-strong`.
- Text: `--ep-text` (white), `--ep-text-2`, `--ep-text-muted`, `--ep-text-3`, `--ep-text-dim`.
- Brand: `--ep-primary` (#8b5cf6 violet), `--ep-primary-strong`, `--ep-primary-soft`, `--ep-accent` (#06b6d4 cyan), `--ep-accent-soft`.
- Status: `--ep-success`, `--ep-warning`, `--ep-danger`.
- Gradients: `--ep-grad-brand`, `--ep-grad-primary`, `--ep-grad-snake`.
- Glow: `--ep-glow`, `--ep-glow-soft`, `--ep-glow-strong`.

### Fonts

- `--ep-font-display`: Urbanist (headings, name, numerals).
- `--ep-font-sans`: Geist (body).
- `--ep-font-mono`: Geist Mono (labels, chips, code lines).
- Weights: `--ep-fw-regular` to `--ep-fw-black`.
- Sizes: `--ep-fs-xs` to `--ep-fs-3xl`, plus `--ep-fs-name`, `--ep-fs-tagline`, `--ep-fs-h2`, `--ep-fs-counter`, `--ep-fs-numeral` (clamp values).

### Spacing, radius and shadow

- Spacing: `--ep-space-1` to `--ep-space-24` (4px base), plus `--ep-section-y`, `--ep-container` (1280px), `--ep-gutter`.
- Radius: `--ep-radius-sm` (6px), `--ep-radius-md` (12px), `--ep-radius-lg` (16px), `--ep-radius-xl` (20px), `--ep-radius-pill`.
- Shadows: `--ep-shadow-card`, `--ep-shadow-nav`, `--ep-shadow-glow-primary`, `--ep-shadow-glow-accent`, `--ep-shadow-glow-chip`.

### Breakpoints

Media queries use literal values, because CSS variables cannot be used in `@media`.

- Mobile: `max-width: 767px`
- Tablet: `768px` to `1023px`
- Desktop: `min-width: 1024px`

The navbar menu switches at 1023 px. The palette is hidden under 1024 px.

### Motion

- Durations and easings: `--ep-ease-out`, `--ep-ease-in-out`, `--ep-ease-spring`, `--ep-dur-fast` (150ms), `--ep-dur-base` (300ms), `--ep-dur-slow` (750ms), `--ep-dur-reveal` (900ms), `--ep-dur-loader` (1800ms, from the spec; the loader code uses 6000 ms, see section 7).
- Reduced motion: 15 files contain a `prefers-reduced-motion` rule or check, including `css/base.css`, `css/hero.css`, `css/palette.css`, `css/snake.css`, `js/main.js`, `js/effects.js`, `js/hero.js` and `js/photo-dissolve.js`. With reduced motion on, the loader count is short, reveals are visible at once, the tagline stops rotating, the name does not scramble, and loops stop.

### Z-index

`--ep-z-particles` (0), `--ep-z-content` (1), `--ep-z-nav` (50), `--ep-z-progress` (60), `--ep-z-cursor` (70, unused now), `--ep-z-modal` (80), `--ep-z-loader` (90).

## 7. Effects

- **Loader**: `js/main.js` counts 0 to 100 over 6000 ms (`COUNT_MS`). The fill is a liquid shape with two wave layers (`wavePath`) clipped to the wordmark. The count sits at the bottom right. After the count, the loader fades and the page shows. Reduced motion uses 300 ms.
- **Quarter-circle sweep at the top right**: planned in the work orders but not in the markup or CSS. Not built.
- **Navbar sliding indicator**: `.ep-navbar__indicator` moves to the active link. `js/effects.js` sets the active link with an IntersectionObserver on `[data-nav-section]`.
- **Scroll reveal**: `.ep-reveal` elements fade and rise when they enter view, using `ep-reveal-in` (`css/base.css`). The delay comes from `--ep-delay`. Set by `js/effects.js`.
- **Cursor**: no custom cursor. The cursor glow and dot were removed from the markup and CSS. The normal cursor shows.
- **Hero rotating phrases**: `js/hero.js` cycles the phrases in the `ep-hero__word` spans every 3000 ms (`ROTATE_MS`), with a 400 ms vertical roll (`ROLL_MS`). Phrases: "LLM applications", "multi-agent systems", "MCP servers", "RAG pipelines", "GraphRAG pipelines", "LangGraph agents", "FastAPI services", "LLM evaluation".
- **Name scramble**: `js/hero.js` `initNameScramble` scrambles the letters of the name for about 1000 ms (`SCRAMBLE_MS`) on pointer enter, then settles. The name is split into `ep-hero__char` boxes for the entrance.
- **Photo dissolve**: `js/photo-dissolve.js` (starts itself). As the page scrolls, the bottom of the hero portrait breaks into particles on two canvases (`ep-photo-dissolve--particles` and `--dust`). The portrait fades out by about 90% of the way. Its mask is set on the photo element.
- **Project pointer effect**: `js/projects.js` moves a spotlight (`.ep-projects__spotlight`) to the pointer inside each card.
- **Command palette**: Ctrl+K (Windows, Linux) or ⌘K (Apple) opens it. The navbar button does the same. The label is set from `navigator.platform` in `js/effects.js`. Up and down arrows move the highlight, Enter runs the item, Escape closes it. Typing filters the list. "Play Cyber Snake Game" opens the snake dialog.
- **Snake controls and scoring**: arrow keys or the on-screen D-pad steer. Escape closes. Each food adds `POINTS = 10` (`js/snake.js`). Each food makes the snake speed up by 3 ms per tick (`TICK_STEP`). The best score is kept in `localStorage`. The start screen has a START GAME button.

## 8. How to make common changes

Keep each change inside the owner's files. Test after each change with the static server from section 1.

1. **Change a project card**
   - Open `index.html`, find `BEGIN:projects`.
   - Each card is one `li.ep-projects__item`. Edit `h3.ep-projects__title`, `p.ep-projects__desc`, the metric line `p.ep-projects__code`, and the `li.ep-tag` items in `ul.ep-projects__tags`.
   - Owner: skills and projects. Layout is in `css/projects.css`.
   - Check each number against the CV.

2. **Change a stat**
   - Open `index.html`, find `BEGIN:about`, and find the `.ep-stat` block.
   - Change the number in `span.ep-stat__num`. Change `data-count` to the same number, with no commas. Change the suffix in `span.ep-stat__suffix` and the label in `span.ep-stat__label`.
   - Owner: about. The count-up code is in `js/about.js`.

3. **Change a skill**
   - Open `index.html`, find `BEGIN:skills`.
   - Each chip is one `li.ep-skills__chip` inside one of the five `ul.ep-skills__track` lists. Add, remove or edit the chip there.
   - Owner: skills and projects. Row speed and direction are in `css/skills.css`.

4. **Change the hero photo**
   - Easiest: follow section 11 (drop the photo in `inbox/photo/`, then ask the AI tool to follow `prompts/update-photo.md`).
   - Manual: put the new PNG in `assets/img/` with a new file name, then in `index.html` change `src`, `width` and `height` on `img.ep-hero__photo`. Test the dissolve by scrolling down the hero.
   - Owner: hero for the markup, photo effect for the dissolve. The old photo file is kept until the owner removes it.

5. **Change the resume PDF**
   - Easiest: follow section 11 (drop the PDF in `inbox/cv/`, then ask the AI tool to follow `prompts/update-cv.md`).
   - Manual: copy the new PDF into `assets/` with a new file name, then update the three PDF links in `resume.html` (lines with the Download button, the `object` `data` attribute and the fallback link). Keep `#zoom=100`.
   - The "View Resume" button and the Resume contact row both open `resume.html`.

6. **Change a contact link**
   - Change the link in the contact block (`a.ep-contact__link`, and the visible text in `span.ep-contact__value`).
   - Change the footer icon link in `footer.ep-footer`.
   - Change the matching palette item (`data-href`) in `index.html`, inside the `palette-dialog` block. Keep all three in sync.
   - Owner: journey and contact for the contact block, core for the footer, snake and palette for the palette.

7. **Add a section**
   - Core owner only, because it touches the marker list and script order.
   - Add a `BEGIN:name` and `END:name` pair and a `section` element with `data-nav-section` and a matching `id` in `index.html`.
   - Add a navbar link in `ep-navbar__list` with the same `data-nav`.
   - Add a `css/name.css` link in `<head>` and a `js/name.js` script before `effects.js`. The script must set `window.Portfolio.initName`.
   - Add `'initName'` to the `MODULES` array in `js/main.js`.
   - Add a palette item if you want it in the palette.

8. **Change the shortcut label**
   - The button text in `index.html` (`#ep-snake-trigger`) is the default. `js/effects.js` (`initShortcut`) sets the text from the platform: `⌘K` on Apple, `Ctrl K` elsewhere. Change both strings if the label changes.
   - Owner: core for `effects.js` and `index.html`.

9. **Change colours**
   - Change the value in `css/tokens.css` only. Every other file reads the tokens.
   - Check for hard-coded colours before saying the change is complete: search the CSS for `#8b5cf6` and `rgba(139` and move any found values to tokens in the owner's file or in core.

## 9. Known limitations and things not verified

- **Mobile below 504 px**: the owner reported this limit. No rule in the CSS or JS uses 504 px, so the cause was not found. Test at 390 px before any release.
- **Real-time animations**: not watched in a browser in this pass. Timings above come from code, not from a recording.
- **Touch**: hover effects use `(hover: hover)` checks in some files. Touch behaviour was not tested.
- **Fonts**: Google Fonts need internet. Offline, the fallback fonts show.
- **Command palette under 1024 px**: hidden. Touch users on tablets and phones cannot open it.
- **Quarter-circle sweep in the loader**: planned, not built.
- **Project count**: the work orders say three project cards. The markup has five (`01` AutolyxAi, `02` Client RAG, `03` Analytics, `04` Owner, `05` Owner). The layout gives only card 03 the wide span. Confirm the intended count before editing.
- **Client and company names**: the Analytics card names HEM.NX and Hukum Kijiye. Employers are named in the about text and journey. The "no company or client names" rule conflicts with this. Decide before the next edit.
- **View Resume**: the work orders asked for the PDF to open in the same tab. The button opens `resume.html` in a new tab (`target="_blank"`).
- **Photo effect owner**: `css/photo-dissolve.css` and `js/photo-dissolve.js` are not in the spec ownership map. Assign an owner.
- **Old hero file**: the spec named `ebad-hero-cutout.png`. The page uses `headshot-cutout.png`.
- **CV facts**: numbers and dates were checked in an earlier audit. They were not re-checked in this pass.
- **Residue and link checks**: no CV name residue or phone text was found by grep. The GitHub handle and all external links were not tested for 404s in this pass.
- **Update prompts not yet run on a real file**: `prompts/update-photo.md` and `prompts/update-cv.md` were written but have not been used on a real new photo or CV. The first run is the real test.
- **Photo background cut-out**: if a new photo has no transparent background, the photo prompt uses a background-removal tool (for example `rembg`). If none is installed, the tool stops and reports instead of guessing.
- **CV deletion rule**: the CV prompt deletes the old PDF only after every check passes and nothing points to it. The photo prompt never deletes the old photo.

## 10. How to brief an AI tool

Give the tool this file and the files it needs. Use one sentence per change.

Template:

> In portfolio/KT.md, section 8, change [WHAT] in file [FILE], keep [WHAT MUST NOT CHANGE], and stay inside the [OWNER] marker block.

Examples:

> In portfolio/KT.md, section 8, change the Skills marquee chip "Dify" to "Dify Workflows" in file portfolio/index.html, keep the other chips, and stay inside the BEGIN:skills and END:skills markers.

> In portfolio/KT.md, section 8, change the first stat from 4 to 3 in file portfolio/index.html, keep data-count in sync, and do not touch other sections.

> In portfolio/KT.md, section 8, change the primary violet colour to #7c3aed in file portfolio/css/tokens.css, keep every other token, and do not add hard-coded colours.

Read first, in this order:

1. `portfolio/KT.md`
2. `portfolio/index.html` (the marker block being changed)
3. The owner's CSS and JS file for that block
4. `portfolio/css/tokens.css` if colours, spacing or type change

Rules to repeat in every brief: no build step, no npm, no git commands, no company or client names, no credentials, no invented metrics. Ask the tool to report the lines it changed.

### Briefs for the photo and CV updates

For a routine photo or CV update, the brief is one line. Send it to Claude Code, Codex or a similar tool, with the portfolio folder open:

> Follow prompts/update-photo.md. The new photo is in inbox/photo. Report the changed lines and the checklist result.

> Follow prompts/update-cv.md. The new CV is in inbox/cv. Report the changed lines and the checklist result.

The tool then reads `KT.md` and the prompt file, and runs the builder and verifier sub-agents described in the prompt. If you ask for a change that is not in the prompt, write the brief in the template above instead.

## 11. Updating the photo or the CV (owner's routine)

You do not need to edit any file yourself. Follow these steps.

### Step 1: put the new file in the inbox
- **New photo**: put exactly one image in `inbox/photo/`. A PNG with a transparent background is best. If there is no transparent background, the tool cuts the background out.
- **New CV**: put exactly one PDF in `inbox/cv/`.
- Keep only the new file in each folder. The `README.md` in each folder is ignored. These folders are not deployed.

### Step 2: ask the AI tool
Open the portfolio folder in Claude Code, Codex or a similar tool and send one line:
- Photo: `Follow prompts/update-photo.md`
- CV: `Follow prompts/update-cv.md`

### Step 3: what the tool does
- **Photo**: copies the photo into `assets/img/` under a new name, updates the hero image in `index.html`, checks the scroll effect still works, and records the new file in `KT.md`. The old photo is kept.
- **CV**: copies the PDF into `assets/` under a new name, updates the three links in `resume.html`, records the new file in `KT.md`, and deletes the old PDF only if every check passed and nothing still points to it.
- **CV, new projects and jobs (Step 7 of the prompt)**: a main agent compares the new CV with the site's project cards and journey entries, then sends new projects to a Projects sub-agent and new jobs to a Jobs sub-agent. They reuse the existing card and timeline markup, write the text in the owner's own words, and add no employer or client name without the owner's approval. Existing entries are not changed.
- A builder agent does the work and a separate verifier agent checks it. If a check fails, the work goes back to the builder, up to 3 rounds.

### Step 4: check it locally
1. Start the local server as in section 1 and open http://localhost:8000.
2. For a photo change: scroll the hero and check the portrait dissolves as before.
3. For a CV change: open http://localhost:8000/resume.html and check the PDF shows at 100% and the Download button works.

### Step 5: put it live
Uploads only the site files. Do not upload `KT.md`, `prompts/`, `inbox/`, or the `.md` notes.
1. Open the repo `ebadmomin35/portfolio` on GitHub.
2. For a photo change: upload the new file to `assets/img/`, then upload the changed `index.html`.
3. For a CV change: upload the new PDF to `assets/`, upload the changed `resume.html`, then delete the old PDF on GitHub (uploading does not remove files). Only do the delete if the tool reported that it deleted the old PDF locally, or that it kept it on purpose.
4. Commit to `main`. Vercel redeploys in about a minute. Check the Deployments tab shows **Ready**.

### Rules that apply every time
- New file names every time, because Vercel caches `/assets/` for a week.
- No text from the CV is copied onto the site. The CV is only a source for facts.
- The old photo is kept. The old CV is deleted only when the tool's deletion rule is met.
