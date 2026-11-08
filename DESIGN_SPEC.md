# Ebad Momin Portfolio: Design Spec

Clone target: https://jachin-portfolio.vercel.app/ (visual system), re-skinned with Ebad Momin's content.
Stack: plain HTML + CSS + vanilla JS. No build step, no npm. Google Fonts via `<link>`.
Output root: `C:\Users\fuzai\Desktop\Ebad Portfolio\portfolio\` (index.html, css\, js\, assets\).

## 0. Sources and confidence

| Item | Source | Confidence |
|---|---|---|
| Fonts (Geist, Geist Mono, Urbanist), colours `#090909`, `#8b5cf6`, `#06b6d4`, `#0a0a0a`, `#050505`, radii, `--text-*` scale, transitions `.3s`, `.25s ease-out`, `.75s ease-in-out`, keyframes `pulse`, `shine` | Reference CSS chunks fetched with curl (`tmp\ref-src\*.css`) | Exact |
| Layout, spacing, positions, animation feel, copy structure | 12 frames in `tmp\portfolio-review\` | Estimated from 1918px-wide browser captures |
| Ebad's content | `extras\Ebad_Momin_CV_FDE_AI_Tools.pdf` and the facts brief | Exact (see flags) |

Frame-to-section map (every frame is reproduced by at least one section):

| Frame | Time | What it shows | Reproduced by |
|---|---|---|---|
| frame-00.jpg | 0.0s | Hero: "HI, I'M", name, two-line tagline, B/W portrait with purple glow, dot grid | Sec. C.2 Hero, Sec. D dot grid, Sec. D glow |
| frame-01.jpg | 17.7s | Hero lower half: paragraph, two buttons, floating pill navbar with INTRO active and ⌘K, particles | Sec. C.2, Sec. C.1 navbar, Sec. D particles |
| frame-02.jpg | 35.3s | About Me: numeral + title + mono label, 4-cell counter strip, heading, education card | Sec. C.3 About |
| frame-03.jpg | 53.0s | Skills: marquee chip rows, "Framer Motion" chip highlighted purple on hover | Sec. C.4 Skills |
| frame-04.jpg | 70.6s | Projects bento: index labels, titles, install line, tags, icon links, cursor spotlight on VoiceCalc | Sec. C.5 Projects |
| frame-05.jpg | 88.3s | Journey: centre line with dot, alternating cards, year badges | Sec. C.6 Journey |
| frame-06.jpg | 105.9s | Contact: heading (second line purple), link cards, terminal window with coloured dots, nav pill sliding to CONTACT | Sec. C.7 Contact, Sec. C.1 nav indicator |
| frame-07.jpg | 123.6s | Cyber Snake modal, score 0, cyan food, purple snake | Sec. C.8 Snake |
| frame-08.jpg | 141.3s | Snake score 60, snake turning | Sec. C.8 Snake |
| frame-09.jpg | 158.9s | Snake score 140, long snake, gradient head | Sec. C.8 Snake |
| frame-10.jpg | 176.6s | Hero name with glitch/scribble on "Samuel", photo dissolving into violet pixels at bottom | Sec. C.2 Hero (name effect, dissolve) |
| frame-11.jpg | 194.2s | Projects section again (scrolled to #projects) | Sec. C.5 Projects |
| contact-sheet.jpg | all | Overview of the above | All sections |

---

## A. Design tokens

File: `css\tokens.css` (owned by core). All tokens live on `:root`. No other file defines a token.

```css
:root {
  /* ---------- Colour ---------- */
  --ep-bg: #090909;                       /* page background (reference --background) */
  --ep-bg-deep: #050505;                  /* modal board, navbar glass base */
  --ep-surface: #0a0a0a;                  /* cards, chips, inputs */
  --ep-surface-raised: #0d0d0d;           /* hovered cards */
  --ep-surface-glass: rgba(5, 5, 5, 0.72);
  --ep-border: rgba(255, 255, 255, 0.08);
  --ep-border-strong: rgba(255, 255, 255, 0.14);
  --ep-text: #ffffff;
  --ep-text-2: #d4d4d8;                   /* chip text, body emphasis */
  --ep-text-muted: #a1a1aa;               /* body copy, inactive nav */
  --ep-text-3: #71717a;                   /* mono labels */
  --ep-text-dim: #3f3f46;                 /* dim headline second line */
  --ep-primary: #8b5cf6;                  /* brand violet */
  --ep-primary-strong: #7f22fe;           /* primary button start */
  --ep-primary-soft: #a685ff;             /* hover text, indices */
  --ep-accent: #06b6d4;                   /* brand cyan (gradient end, food) */
  --ep-accent-soft: #7af2ff;
  --ep-warning: #edb200;                  /* terminal dot */
  --ep-success: #00c758;                  /* terminal dot, "sent" status */
  --ep-danger: #ff667f;                   /* validation errors */
  --ep-glow: hsl(263deg 90% 60%);         /* reference --glow-color */
  --ep-glow-soft: hsl(263deg 90% 60% / 0.16);
  --ep-glow-strong: hsl(263deg 90% 60% / 0.40);
  --ep-dot-grid: rgba(255, 255, 255, 0.06);
  --ep-grad-brand: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%);
  --ep-grad-primary: linear-gradient(135deg, #7f22fe 0%, #8b5cf6 100%);
  --ep-grad-snake: linear-gradient(135deg, #7f22fe 0%, #8b5cf6 60%, #06b6d4 100%);

  /* ---------- Fonts ---------- */
  --ep-font-display: "Urbanist", "Urbanist Fallback", "Geist", system-ui, sans-serif;
  --ep-font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
  --ep-font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, Consolas, monospace;
  --ep-fw-regular: 400;
  --ep-fw-medium: 500;
  --ep-fw-semibold: 600;
  --ep-fw-bold: 700;
  --ep-fw-extrabold: 800;
  --ep-fw-black: 900;

  /* ---------- Type scale ---------- */
  --ep-fs-xs: 0.75rem;                    /* 12px, mono micro labels */
  --ep-fs-sm: 0.875rem;                   /* 14px, nav, chips */
  --ep-fs-base: 1rem;                     /* 16px */
  --ep-fs-md: 1.0625rem;                  /* 17px, body paragraphs */
  --ep-fs-lg: 1.125rem;                   /* 18px, hero paragraph */
  --ep-fs-xl: 1.25rem;                    /* 20px */
  --ep-fs-2xl: 1.5rem;                    /* 24px, small card titles */
  --ep-fs-3xl: 2rem;                      /* 32px, large card titles */
  --ep-fs-name: clamp(3.5rem, 8.5vw, 8.5rem);      /* hero name */
  --ep-fs-tagline: clamp(2rem, 4.4vw, 4.5rem);     /* hero two-line tagline */
  --ep-fs-h2: clamp(2.5rem, 4.6vw, 4rem);          /* section titles */
  --ep-fs-counter: clamp(3rem, 5vw, 4.5rem);       /* stat counters */
  --ep-fs-numeral: clamp(8rem, 16vw, 18rem);       /* faint section numbers */
  --ep-lh-tight: 1;
  --ep-lh-snug: 1.2;
  --ep-lh-body: 1.6;
  --ep-tracking-mono: 0.18em;
  --ep-tracking-nav: 0.08em;
  --ep-tracking-display: -0.02em;

  /* ---------- Spacing (4px base) ---------- */
  --ep-space-1: 0.25rem;
  --ep-space-2: 0.5rem;
  --ep-space-3: 0.75rem;
  --ep-space-4: 1rem;
  --ep-space-5: 1.25rem;
  --ep-space-6: 1.5rem;
  --ep-space-8: 2rem;
  --ep-space-10: 2.5rem;
  --ep-space-12: 3rem;
  --ep-space-16: 4rem;
  --ep-space-20: 5rem;
  --ep-space-24: 6rem;
  --ep-section-y: clamp(5rem, 9vw, 8rem);        /* vertical padding per section */
  --ep-container: 1280px;
  --ep-gutter: clamp(1.25rem, 4vw, 2.5rem);

  /* ---------- Radii ---------- */
  --ep-radius-sm: 6px;
  --ep-radius-md: 12px;                   /* buttons, inputs, link cards */
  --ep-radius-lg: 16px;                   /* cards, modal */
  --ep-radius-xl: 20px;
  --ep-radius-pill: 9999px;               /* navbar, chips, tags */

  /* ---------- Shadows ---------- */
  --ep-shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 24px 48px -24px rgba(0, 0, 0, 0.8);
  --ep-shadow-nav: 0 10px 40px -10px rgba(0, 0, 0, 0.9);
  --ep-shadow-glow-primary: 0 10px 30px -10px rgba(139, 92, 246, 0.55);
  --ep-shadow-glow-accent: 0 0 12px rgba(6, 182, 212, 0.8);
  --ep-shadow-glow-chip: 0 0 18px -4px rgba(139, 92, 246, 0.6);

  /* ---------- Motion ---------- */
  --ep-ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* default enter */
  --ep-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* from reference .75s ease-in-out */
  --ep-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);/* badges, dots */
  --ep-dur-fast: 150ms;
  --ep-dur-base: 300ms;                   /* matches reference .3s transitions */
  --ep-dur-slow: 750ms;                   /* matches reference .75s */
  --ep-dur-reveal: 900ms;
  --ep-dur-loader: 1800ms;

  /* ---------- Z-index ---------- */
  --ep-z-particles: 0;
  --ep-z-content: 1;
  --ep-z-nav: 50;
  --ep-z-progress: 60;
  --ep-z-cursor: 70;
  --ep-z-modal: 80;
  --ep-z-loader: 90;

  /* ---------- Layout ---------- */
  --ep-nav-width: min(930px, calc(100vw - 2rem));
  --ep-nav-height: 56px;
  --ep-snake-board: min(600px, 86vw);
}
```

Google Fonts link (in index.html `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..900&family=Geist+Mono:wght@400..700&family=Urbanist:wght@700..900&display=swap">
```

Breakpoints (used by all builders, written as literal values in media queries because CSS custom properties cannot be used in `@media`):
- Mobile: `max-width: 767px`
- Tablet: `768px` to `1023px`
- Desktop: `min-width: 1024px` (layouts specified at 1440px)

---

## B. Page structure and ownership

### B.1 Class naming

- One prefix for everything: `ep-`.
- BEM: `ep-block`, `ep-block__element`, `ep-block--modifier`.
- Shared primitives are defined only in `css\base.css` (core) and may be used by any builder: `ep-container`, `ep-section`, `ep-section-head`, `ep-section-number`, `ep-label`, `ep-btn`, `ep-btn--primary`, `ep-btn--ghost`, `ep-tag`, `ep-card`, `ep-icon-btn`, `ep-gradient-text`, `ep-reveal`, `ep-sr-only`.
- JS state classes (toggled by JS, styled in the owner's CSS): `is-visible`, `is-active`, `is-open`, `is-loaded`, `is-hover`, `is-error`, `is-sending`.
- Builders never restyle another builder's block or a shared primitive. If a builder needs a variant of a shared primitive, it adds a new BEM modifier in its own file, e.g. `.ep-hero__btn--glow`.

### B.2 index.html skeleton

Core owns the whole file. Each builder's section sits between its marker comments; the builder edits only lines inside its own markers. Core owns `<head>`, loader, navbar, footer, `<script>` order, and the markers themselves.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ebad Momin | Forward Deployed Engineer &amp; GenAI Developer</title>
  <meta name="description" content="Ebad Momin, Forward Deployed Engineer (FDE), GenAI Developer and AI Solutions Architect in Thane, Mumbai.">
  <meta name="theme-color" content="#090909">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..900&family=Geist+Mono:wght@400..700&family=Urbanist:wght@700..900&display=swap">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/hero.css">
  <link rel="stylesheet" href="css/about.css">
  <link rel="stylesheet" href="css/skills.css">
  <link rel="stylesheet" href="css/projects.css">
  <link rel="stylesheet" href="css/journey.css">
  <link rel="stylesheet" href="css/contact.css">
  <link rel="stylesheet" href="css/snake.css">
</head>
<body class="ep-body" data-loading="true">
  <a class="ep-sr-only" href="#ep-main">Skip to content</a>

  <!-- core: loader -->
  <div class="ep-loader" id="ep-loader" aria-live="polite">
    <span class="ep-loader__logo">EM</span>
    <span class="ep-loader__text">loading...</span>
    <span class="ep-loader__count" id="ep-loader-count">0%</span>
  </div>

  <!-- core: background layers -->
  <canvas class="ep-particles" id="ep-particles" aria-hidden="true"></canvas>
  <div class="ep-cursor-glow" aria-hidden="true"></div>
  <div class="ep-cursor-dot" aria-hidden="true"></div>
  <div class="ep-progress" aria-hidden="true"><span class="ep-progress__bar" id="ep-progress-bar"></span></div>

  <!-- core: navbar -->
  <header class="ep-navbar" id="ep-navbar">
    <nav class="ep-navbar__pill" aria-label="Primary">
      <a class="ep-navbar__logo" href="#intro" aria-label="Ebad Momin, back to top">EM</a>
      <ul class="ep-navbar__list" id="ep-nav-list">
        <li><a class="ep-navbar__link" href="#intro" data-nav="intro">Intro</a></li>
        <li><a class="ep-navbar__link" href="#about" data-nav="about">About</a></li>
        <li><a class="ep-navbar__link" href="#skills" data-nav="skills">Skills</a></li>
        <li><a class="ep-navbar__link" href="#work" data-nav="work">Work</a></li>
        <li><a class="ep-navbar__link" href="#journey" data-nav="journey">Journey</a></li>
        <li><a class="ep-navbar__link" href="#contact" data-nav="contact">Contact</a></li>
      </ul>
      <span class="ep-navbar__indicator" aria-hidden="true"></span>
      <button class="ep-navbar__kbd" id="ep-snake-trigger" type="button" aria-label="Open Cyber Snake game">⌘K</button>
      <button class="ep-navbar__menu" id="ep-menu-toggle" type="button" aria-expanded="false" aria-controls="ep-nav-list">Menu</button>
    </nav>
  </header>

  <main id="ep-main">
    <!-- BEGIN:hero -->
    <section class="ep-hero" id="intro" data-nav-section="intro">
      <!-- hero builder markup -->
    </section>
    <!-- END:hero -->

    <!-- BEGIN:about -->
    <section class="ep-about ep-section" id="about" data-nav-section="about">
      <!-- about builder markup -->
    </section>
    <!-- END:about -->

    <!-- BEGIN:skills -->
    <section class="ep-skills ep-section" id="skills" data-nav-section="skills">
      <!-- skills builder markup -->
    </section>
    <!-- END:skills -->

    <!-- BEGIN:projects -->
    <section class="ep-projects ep-section" id="work" data-nav-section="work">
      <!-- projects builder markup -->
    </section>
    <!-- END:projects -->

    <!-- BEGIN:journey -->
    <section class="ep-journey ep-section" id="journey" data-nav-section="journey">
      <!-- journey builder markup -->
    </section>
    <!-- END:journey -->

    <!-- BEGIN:contact -->
    <section class="ep-contact ep-section" id="contact" data-nav-section="contact">
      <!-- contact builder markup -->
    </section>
    <!-- END:contact -->
  </main>

  <!-- core: footer -->
  <footer class="ep-footer">
    <div class="ep-container ep-footer__inner">
      <p class="ep-footer__copy">© 2026 Ebad Momin. All rights reserved.</p>
      <ul class="ep-footer__links">
        <li><a class="ep-icon-btn" href="https://github.com/ebadmomin" target="_blank" rel="noopener" aria-label="GitHub">…</a></li>
        <li><a class="ep-icon-btn" href="https://www.linkedin.com/in/ebadmomin" target="_blank" rel="noopener" aria-label="LinkedIn">…</a></li>
        <li><a class="ep-icon-btn" href="mailto:ebadarmanmomin@gmail.com" aria-label="Email">…</a></li>
      </ul>
      <p class="ep-footer__built">Built with HTML, CSS &amp; JavaScript <span aria-hidden="true">♥</span></p>
    </div>
  </footer>

  <!-- BEGIN:snake -->
  <dialog class="ep-snake" id="ep-snake" aria-labelledby="ep-snake-title">
    <!-- snake builder markup -->
  </dialog>
  <!-- END:snake -->

  <!-- Scripts: modules first (each defines window.Portfolio.init<Name>), effects, then main.js which calls them -->
  <script src="js/hero.js" defer></script>
  <script src="js/about.js" defer></script>
  <script src="js/skills.js" defer></script>
  <script src="js/projects.js" defer></script>
  <script src="js/journey.js" defer></script>
  <script src="js/contact.js" defer></script>
  <script src="js/snake.js" defer></script>
  <script src="js/effects.js" defer></script>
  <script src="js/main.js" defer></script>
</body>
</html>
```

Icon SVGs (`…` above) are inline `<svg>` with `aria-hidden="true"`, 18px, stroke `currentColor`, stroke-width 1.75. Core supplies the footer icons; the contact builder reuses the same icon shapes for link cards.

### B.3 Ownership map (5 builders plus the snake builder, no overlapping files)

| Builder | Files they own | index.html lines they may edit |
|---|---|---|
| (1) core | `index.html` (everything outside the BEGIN/END markers), `css\tokens.css`, `css\base.css`, `js\effects.js`, `js\main.js`, `assets\` (copies of the CV PDF and portrait, see Sec. F) | Whole file except marker contents |
| (2) hero | `css\hero.css`, `js\hero.js` | Between `<!-- BEGIN:hero -->` and `<!-- END:hero -->` |
| (3) about | `css\about.css`, `js\about.js` | Between `BEGIN:about` / `END:about` |
| (4) skills and projects | `css\skills.css`, `js\skills.js`, `css\projects.css`, `js\projects.js` | Between `BEGIN:skills`/`END:skills` and `BEGIN:projects`/`END:projects` |
| (5) journey and contact | `css\journey.css`, `js\journey.js`, `css\contact.css`, `js\contact.js` | Between `BEGIN:journey`/`END:journey` and `BEGIN:contact`/`END:contact` |
| (6) snake | `css\snake.css`, `js\snake.js` | Between `BEGIN:snake`/`END:snake` |

Rules:
- A builder may read any file but writes only the files listed in its row.
- Any file not listed (e.g. a shared helper) requires the lead to reassign ownership first.
- Cross-module communication only through the documented globals and events below.

### B.4 JS module contract

Every module (`hero.js`, `about.js`, `skills.js`, `projects.js`, `journey.js`, `contact.js`, `snake.js`) uses this shape:

```js
(function () {
  'use strict';
  window.Portfolio = window.Portfolio || {};
  window.Portfolio.initHero = function initHero() {
    // query elements inside the section, bind listeners, start rAF loops only when visible
  };
})();
```

- Names: `initHero`, `initAbout`, `initSkills`, `initProjects`, `initJourney`, `initContact`, `initSnake`.
- `js\effects.js` (core) exposes `window.Portfolio.initEffects` (cursor, particles, dot grid, parallax, reveal observer, nav active state, progress bar).
- `js\main.js` (core) runs on `DOMContentLoaded`: calls `initEffects()`, then each `init<Name>()` that exists (guarded with `typeof`), then runs the loader, then dispatches `ep:loaded` on `document`.
- Snake exposes `window.Portfolio.openSnake()` and `window.Portfolio.closeSnake()`. Core's ⌘K handler and navbar button call `openSnake()`.
- Entrance animations start only after `ep:loaded` (dispatched when the loader finishes, or immediately if `prefers-reduced-motion`).
- Every module must work with JavaScript disabled for text content: the markup must be readable without JS (reveal classes default to visible when `<html>` lacks the `js` class; core adds `js` to `<html>` as the first line of its inline head script, which is added by core).

Core inline script (in `<head>`, owned by core):
```html
<script>document.documentElement.classList.add('js');</script>
```

---

## C. Sections

Each section lists: layout at 1440px, layout at tablet and mobile, final copy, animations and hovers with duration, easing and trigger, and acceptance criteria. Copy is final unless marked `[CONFIRM]` or `[PLACEHOLDER]`; see Sec. G for flags.

### C.0 Shared primitives (core, `css\base.css`)

- `.ep-container`: `max-width: var(--ep-container); margin-inline: auto; padding-inline: var(--ep-gutter);`
- `.ep-section`: `padding-block: var(--ep-section-y); position: relative;` (`scroll-margin-top: 96px` so anchors clear the navbar).
- `.ep-section-head`: stacked block, `position: relative; padding-left: 24px;`. Contains:
  - `.ep-section-head__num` (faint numeral, `aria-hidden`, `data-parallax`): Urbanist 900, `font-size: var(--ep-fs-numeral)`, colour `rgba(255,255,255,0.06)`, absolute, top `-0.35em`, left `-0.1em`, z-index behind title, `user-select: none`.
  - `.ep-section-head__title`: Urbanist 900, uppercase, `font-size: var(--ep-fs-h2)`, `letter-spacing: var(--ep-tracking-display)`, white.
  - `.ep-section-head__label`: `.ep-label` (Geist Mono, 0.8125rem, uppercase, `letter-spacing: var(--ep-tracking-mono)`, colour `--ep-text-3`, text in square brackets).
  - A 2px vertical rule at the left edge of the head block, `linear-gradient(180deg, #8b5cf6, transparent)`, height equal to the head block.
- `.ep-btn`: inline-flex, gap 10px, height 52px, padding `0 28px`, radius `--ep-radius-md`, Geist 600 `--ep-fs-base`, `transition: transform 300ms var(--ep-ease-out), box-shadow 300ms var(--ep-ease-out), border-color 300ms var(--ep-ease-out), background 300ms var(--ep-ease-out)`.
  - `--primary`: background `--ep-grad-primary`, white text, `box-shadow: var(--ep-shadow-glow-primary)`. Hover: `translateY(-2px)`, arrow icon moves `translate(2px,-2px)`, duration 300ms.
  - `--ghost`: background `--ep-surface`, border `1px solid var(--ep-border-strong)`, white text. Hover: border `rgba(139,92,246,0.5)`, background `--ep-surface-raised`, `translateY(-2px)`.
  - Focus: `outline: 2px solid var(--ep-primary-soft); outline-offset: 3px`.
- `.ep-tag`: inline-flex, height 26px, padding `0 10px`, radius `--ep-radius-pill`, border `1px solid var(--ep-border)`, background `#0a0a0a`, Geist Mono 12px, colour `--ep-text-3`.
- `.ep-card`: background `--ep-surface`, border `1px solid var(--ep-border)`, radius `--ep-radius-lg`, box-shadow `--ep-shadow-card`, `transition: border-color 300ms var(--ep-ease-out), transform 400ms var(--ep-ease-out)`.
- `.ep-icon-btn`: 40px square, radius `--ep-radius-md`, border 1px `--ep-border`, background `--ep-surface`, icon 18px. Hover: border `rgba(139,92,246,0.5)`, colour `--ep-primary-soft`, 300ms.
- `.ep-reveal`: `opacity: 0; transform: translateY(24px); transition: opacity 900ms var(--ep-ease-out), transform 900ms var(--ep-ease-out); transition-delay: var(--ep-delay, 0ms);` and `.ep-reveal.is-visible { opacity: 1; transform: none; }`. Under `prefers-reduced-motion: reduce` the transition is removed and elements are visible.
- `.ep-gradient-text`: `background: var(--ep-grad-brand); -webkit-background-clip: text; background-clip: text; color: transparent;`.
- `.ep-sr-only`: standard visually-hidden utility.

### C.1 Navbar, loader, progress, footer (core)

**Navbar** (`.ep-navbar`, fixed, top 20px, centred, z `--ep-z-nav`)
- `.ep-navbar__pill`: width `var(--ep-nav-width)`, height `--ep-nav-height`, radius pill, background `var(--ep-surface-glass)`, `backdrop-filter: blur(16px)`, border `1px solid var(--ep-border)`, box-shadow `--ep-shadow-nav`, padding `0 10px 0 8px`, flex, align centre, space-between.
- Logo `.ep-navbar__logo`: 40px circle, border `1px solid var(--ep-border-strong)`, Urbanist 900 `--ep-fs-sm`, `.ep-gradient-text`. Copy: `EM` (placeholder mark, see flag).
- Links `.ep-navbar__link`: Geist 500, 14px, uppercase, `letter-spacing: var(--ep-tracking-nav)`, colour `--ep-text-muted`, padding `10px 18px`, transition colour 300ms.
  - Copy in order: Intro, About, Skills, Work, Journey, Contact (CSS uppercases them).
  - Hover: colour white, 300ms.
- `.ep-navbar__indicator`: absolutely positioned pill behind the active link, background `rgba(255,255,255,0.08)`, border `1px solid rgba(255,255,255,0.12)`, radius pill. JS sets `left`, `width` and `top` to match the active link. Transition `left 400ms var(--ep-ease-out), width 400ms var(--ep-ease-out)`. This makes the pill slide between items (visible in frame-06: pill mid-slide between JOURNEY and CONTACT).
- Active link: colour white, `font-weight: 600`. Set by JS (`aria-current="true"` plus `is-active` on the link).
- ⌘K button `.ep-navbar__kbd`: height 34px, padding `0 12px`, radius 8px, background `rgba(255,255,255,0.04)`, border `1px solid var(--ep-border)`, Geist Mono 13px, colour `--ep-text-muted`. Copy: `⌘K` on Apple platforms; `Ctrl K` elsewhere (set by JS from `navigator.platform`). Hover: border `rgba(139,92,246,0.5)`, colour white, 300ms.
- Mobile (< 1024px): `.ep-navbar__list` and the kbd hide; `.ep-navbar__menu` (text button "Menu", Geist Mono 13px uppercase, same height as the pill) shows at the right. Clicking opens `.ep-navbar__list` as a full-screen overlay (`position: fixed; inset: 0; background: rgba(5,5,5,0.96)`), links stacked and centred at Urbanist 900 `clamp(2rem, 8vw, 3rem)`, staggered fade-in 50ms per link. The menu button text changes to "Close" (`aria-expanded` true). Escape closes. Clicking a link closes and scrolls.
- Nav active state (JS, `effects.js`): IntersectionObserver over `[data-nav-section]` with `rootMargin: "-45% 0px -50% 0px"`. The intersecting section's id sets the active link. Scrolling to top (hero visible) sets INTRO.
- Hide-on-scroll: none. Navbar always visible.

**Loader** (`.ep-loader`, fixed inset 0, background `--ep-bg`, z `--ep-z-loader`, flex column centred, gap 16px)
- Logo `.ep-loader__logo`: `EM`, Urbanist 900, 56px, gradient text.
- `.ep-loader__text`: `loading...`, Geist Mono 13px, lowercase, `--ep-text-3`.
- `.ep-loader__count`: `0%` to `100%`, Geist Mono 13px, white, `tabular-nums`.
- Behaviour: counter tweens 0 → 100 over `--ep-dur-loader` (1800ms) with `--ep-ease-in-out`, updating once per frame and rounding to integer. At 100%: wait 200ms, then the loader fades (opacity 1 → 0 over 600ms `--ep-ease-in-out`) and is removed from layout with `display: none` after the fade. `document.body.dataset.loading` set to `false`, `ep:loaded` dispatched at the start of the fade.
- Reduced motion: count jumps to 100% over 300ms, fade 300ms.

**Scroll progress** (`.ep-progress`, fixed top 0, full width, height 2px, z `--ep-z-progress`)
- `.ep-progress__bar`: background `--ep-grad-brand`, `transform-origin: left`, `transform: scaleX(p)` where p = scrollY / (scrollHeight - innerHeight), updated in rAF on scroll. No transition (follows scroll directly).

**Footer** (`.ep-footer`)
- Background `--ep-bg-deep`, border-top `1px solid var(--ep-border)`, padding `32px 0`.
- `.ep-footer__inner`: flex, space-between, align centre, wrap with gap 16px on mobile.
- `.ep-footer__copy`: Geist 14px, `--ep-text-3`. Copy: `© 2026 Ebad Momin. All rights reserved.`
- `.ep-footer__links`: flex, gap 10px; three `.ep-icon-btn` links: GitHub (https://github.com/ebadmomin), LinkedIn (https://www.linkedin.com/in/ebadmomin `[PLACEHOLDER]`), Email (mailto:ebadarmanmomin@gmail.com). No Instagram (not in Ebad's facts).
- `.ep-footer__built`: Geist Mono 13px, `--ep-text-3`. Copy: `Built with HTML, CSS & JavaScript ♥`. The ♥ is `--ep-danger`, with a 1.2s heartbeat (scale 1 → 1.2 → 1) infinite; off under reduced motion.
- Mobile: stacked and centred.

### C.2 Hero (builder 2)

Section `#intro`. Full viewport height (`min-height: 100svh`), content vertically centred, padding-top 120px to clear the navbar.

**Layout**
- Desktop (1440px): two columns in `.ep-container`. Left text column max-width 620px, vertically centred. Right visual column: portrait `.ep-hero__photo` height `min(86vh, 820px)`, width auto (aspect ratio 1103:1426), positioned so the bottom of the photo sits at the bottom of the section, horizontal centre of the right column. The photo's right edge sits about 1.5 * gutter from the viewport edge, matching the reference.
- Tablet (768 to 1023px): single column. Text first, then photo `width: min(70vw, 420px)`, centred, sitting under the buttons. Name and tagline sizes use the clamps in tokens.
- Mobile (< 768px): single column, text left aligned. Name `clamp(3.5rem, 8.5vw, 8.5rem)` resolves to about 56px at 375px; tagline `clamp(2rem, 4.4vw, 4.5rem)` resolves to about 32px. Photo below the buttons, `width: 86vw`, with the bottom dissolve (see below) scaled to the photo.

**Copy (final)**
- Eyebrow `.ep-hero__eyebrow` (mono, violet `--ep-primary`, 14px, `letter-spacing: 0.3em`): `HI, I'M`
- Name `.ep-hero__name` (Urbanist 900, white, `--ep-fs-name`, line-height 1, tracking `-0.02em`): `<span>Ebad</span> <span class="ep-hero__name-accent" data-text="Momin">Momin</span>`. Single line on desktop.
- Tagline `.ep-hero__tagline` (Urbanist 800, `--ep-fs-tagline`, line-height 1.1, margin-top 48px):
  - Line 1 `.ep-hero__tagline-line--muted` (colour `#52525b`, the grey of the reference "shipping web apps &"): `deploying production GenAI &`
  - Line 2 `.ep-hero__tagline-line--gradient` (gradient text `--ep-grad-brand`, violet at left, cyan at right): `agentic systems.`
  - Note: copy is a proposal built from CV facts (GenAI Developer, multi-agent systems, MCP). See Flag G-9.
- Paragraph `.ep-hero__copy` (Geist 400, `--ep-fs-lg`, line-height 1.6, colour `--ep-text-muted`, max-width 34em, margin-top 40px): `Forward Deployed Engineer and GenAI Developer with 3+ years of experience embedding with enterprise teams to architect and ship production LLM applications, multi-agent systems, MCP servers and RAG pipelines. Based in Thane, Mumbai.`
- Role line `.ep-hero__meta` (mono 13px uppercase, `--ep-text-3`, tracking 0.18em, margin-top 20px): `Forward Deployed Engineer (FDE) | GenAI Developer | AI Solutions Architect`
- Buttons `.ep-hero__actions` (flex, gap 16px, margin-top 40px, wrap):
  - `<a class="ep-btn ep-btn--primary" href="#work">View Work <svg arrow-up-right/></a>`
  - `<a class="ep-btn ep-btn--ghost" href="assets/Ebad_Momin_CV_FDE_AI_Tools.pdf" download>View Resume <svg document/></a>` (the text says "View Resume"; the link downloads the PDF in a new tab if the browser prefers, `target="_blank" rel="noopener"`)

**Name effect (`.ep-hero__name-accent`, "Momin")**
- Base: text white.
- Trigger: `pointerenter` or `focus` on the name, or once when the name first enters the viewport on touch devices.
- Effect (duration 700ms, `steps(6)` for slices, `--ep-ease-out` for the rest): a duplicated layer via `::before` and `::after` (content `attr(data-text)`) with `clip-path: inset()` slices animating randomly, offset by ±4px horizontally, coloured `--ep-primary` (before) and `--ep-accent` (after). Plus a scribble: an inline SVG stroke path overlaid on the word, drawn with `stroke-dashoffset` 1 → 0 over 500ms, violet stroke 3px, `stroke-linecap: round`, zigzag path with 3 peaks. After 700ms the layers fade out over 300ms.
- Reduced motion: effect disabled; hover has no visual change.

**Entrance (after `ep:loaded`)**
- Eyebrow: opacity 0 → 1, translateY 12px → 0, 600ms, delay 0ms, `--ep-ease-out`.
- Name: each character in a `<span class="ep-hero__char">` (JS splits the text; `aria-label` on the parent keeps accessibility). Each char: translateY `110%` → 0 inside a `overflow: hidden` mask, 900ms `--ep-ease-out`, stagger 40ms per char.
- Tagline line 1: opacity 0 → 1, translateY 24px → 0, 800ms, delay 300ms. Line 2: same, delay 420ms. Gradient line starts after line 1.
- Paragraph: opacity and translateY, 800ms, delay 600ms.
- Meta line: opacity, 600ms, delay 700ms.
- Buttons: opacity and translateY 16px → 0, 600ms each, delay 800ms (first), 900ms (second).
- Photo: opacity 0 → 1 and scale 1.04 → 1, 1400ms, `--ep-ease-out`, delay 400ms. Glow behind the photo fades in over 1400ms with delay 600ms.

**Portrait treatment**
- Source: `assets\img\ebad-hero-cutout.png` (RGBA cutout, see Flag G-3). Element `<img class="ep-hero__photo" alt="Portrait of Ebad Momin" width="1103" height="1426" decoding="async">`.
- Filter: `filter: grayscale(1) contrast(1.05) brightness(0.98);` so the photo reads black-and-white like the reference.
- Glow `.ep-hero__glow`: absolutely positioned behind the photo, `width: 120%; height: 90%; background: radial-gradient(closest-side, rgba(139,92,246,0.45), rgba(139,92,246,0.12) 55%, transparent 75%); filter: blur(40px); mix-blend-mode: screen;` Breathing animation: opacity 0.7 ↔ 1.0, 6s, `ease-in-out`, infinite; off under reduced motion.
- Bottom dissolve: `.ep-hero__dissolve` canvas (absolute, bottom 0, full photo width, height 30% of photo). `hero.js` draws a grid of square cells, 12px on desktop, 9px on mobile. Each cell is either empty or a violet fill (`rgba(139,92,246, a)`) with random alpha 0.2 to 0.9, and changes every 180ms with a 30% chance. On entrance the cells fade in from the bottom over 1200ms. The canvas has `mask-image: linear-gradient(to top, #000 30%, transparent)` so the top edge blends into the photo. The canvas is `aria-hidden`.
- Pause the dissolve loop when the hero is out of view (IntersectionObserver) and under reduced motion (draw once, static).

**Hover and focus**
- Primary button: see C.0. Ghost button: see C.0.
- Photo: no hover effect (keeps the portrait calm).

**Acceptance criteria (hero)**
1. At 1440x900 the eyebrow, name, tagline, paragraph and both buttons are visible above the fold, with the photo on the right and its bottom edge at the viewport bottom.
2. The name reads "Ebad Momin" with "Momin" as the accent word, and the scribble and RGB-split effect runs on hover of "Momin" and finishes within 0.8s.
3. The tagline line 1 is grey and line 2 is a violet-to-cyan gradient.
4. The portrait is greyscale with a violet glow behind it and the bottom fades into violet pixel blocks.
5. "View Work" is solid gradient with glow; "View Resume" is a dark ghost button with a document icon.
6. With reduced motion on, all entrance animations are skipped and the text is visible immediately.
7. No console errors; the page works with JS disabled, showing the text and photo without animation.

### C.3 About (builder 3)

Section `#about`. Padding-block `--ep-section-y`.

**Layout**
- Head: `.ep-section-head` with num `01`, title `About Me`, label `[ who i am & what i do ]`. Positioned left, at container left edge.
- Stats strip `.ep-about__stats`: full container width, a 4-column grid with 1px dividers (`border: 1px solid var(--ep-border)`, cells separated by 1px `--ep-border` lines), radius `--ep-radius-lg`, margin-top 64px.
- Main grid `.ep-about__grid` at margin-top 72px: desktop two columns `minmax(0, 1.25fr) minmax(0, 1fr)`, gap 64px. Left: heading and paragraphs. Right: the card stack (education and certifications).
- Tablet: stats 2x2; grid becomes single column, cards below text.
- Mobile: stats 2x2 (smaller padding), single column.

**Stats (`.ep-stat`)**
- Each cell: padding 40px 24px, centred, min-height 180px.
- `.ep-stat__value`: Urbanist 900, `--ep-fs-counter`, white. Suffix in a `.ep-stat__suffix` span at 0.6em, violet.
- `.ep-stat__label`: `.ep-label` (mono 12px uppercase, tracking 0.18em, `--ep-text-3`), margin-top 12px.
- Copy (4 counters, all from CV facts):
  1. value 3, suffix `+`, label `Years of experience`
  2. value 50000, suffix `+`, label `PDFs in production RAG engine` (formatted as "50,000+" with `toLocaleString('en-US')`)
  3. value 94, suffix `%+`, label `Retrieval precision`
  4. value 35, suffix `%`, label `Token cost reduction`
- Counter behaviour: triggered once when the cell is 60% visible. Counts 0 → value over 1600ms, `ease-out` cubic (`1 - (1-t)^3`), each frame rounding to integer, formatted with commas. Stagger 120ms between cells.
- Hover: the cell gets background `rgba(139,92,246,0.06)` and `.ep-stat__value` colour `--ep-primary-soft`, transition 300ms. Highlight visible in frame-02 on the third cell.
- Reduced motion: final values shown immediately.

**Heading and copy (final)**
- Heading `.ep-about__heading`: Geist 700, `clamp(1.75rem, 3.2vw, 2.75rem)`, line-height 1.15, white.
  - Line 1: `Building robust solutions`
  - Line 2 `.ep-about__heading-dim` (colour `--ep-text-dim` `#3f3f46` with a subtle gradient fill to `#52525b`, as in the reference): `with precision and purpose.`
- Paragraph 1 `.ep-about__text` (Geist 400, `--ep-fs-md`, `--ep-text-muted`, line-height 1.7, margin-top 24px): `I'm a Forward Deployed Engineer and GenAI Developer at AutolyxAi, where I embed with enterprise client teams and C-suite stakeholders to run technical discovery, architect custom AI systems and ship rapid POCs to production.`
- Paragraph 2 (same style, margin-top 16px): `I build multi-agent workflows and MCP tool servers with LangGraph, LangChain and FastAPI, and production RAG and GraphRAG pipelines with hybrid search and re-ranking. Before engineering I spent several years in sales operations, MIS and analytics at Kotak Securities, Axis Securities and ICICI Securities.`
- Badge `.ep-about__badge` (inline-flex, pill, border `1px solid rgba(34,197,94,0.3)`? keep to tokens: border `rgba(0,199,88,0.35)`, background `rgba(0,199,88,0.08)`, text `--ep-success`, dot 8px `--ep-success` with pulse, Geist Mono 13px): `Open to freelance projects & contract work` `[CONFIRM]` (see Flag G-6). Dot pulse uses reference keyframe `pulse` (opacity 1 → 0.4 → 1, 2s, infinite).

**Cards (right column, `.ep-card` stack, gap 20px)**
- Card A, Education:
  - Label `.ep-label`: `EDUCATION`
  - Title (Geist 700, 22px): `M.M.S. in Marketing`
  - Sub (Geist 400, 15px, `--ep-text-muted`): `Mumbai University`
  - Year (mono 14px, violet): `2016`
  - Divider (1px `--ep-border`, margin 20px 0)
  - Title: `B.Sc. with Chemistry`; sub: `Mumbai University`; year `2013`
- Card B, Certifications (replaces the reference "Currently learning" card, see Flag G-7):
  - Label: `CERTIFICATIONS`
  - List (`ul`, Geist 15px, `--ep-text-2`, each item with a 6px violet square bullet, gap 12px):
    - `Full Stack Data Science` (iNeuron.ai)
    - `Prompt Engineering` (Great Learning)
    - `Generative AI, Agentic Workflows & MCP Architecture`
    - `Advanced Excel` (Udemy)
- Card hover: `transform: translateY(-4px)` and border `rgba(139,92,246,0.35)`, 400ms `--ep-ease-out`. Reveal on scroll: `.ep-reveal` with `--ep-delay` 0ms and 120ms.

**Reveal**
- Head, paragraphs, badge, stats and cards use `.ep-reveal` with stagger via `--ep-delay` (0, 100, 200, 300ms).

**Acceptance criteria (about)**
1. Section head shows "01", "About Me" and "[ who i am & what i do ]" with the faint numeral behind the title.
2. Four counters in one bordered strip; each counts up once to 3+, 50,000+, 94%+, 35%.
3. Heading has the two-tone treatment (second line dimmed); two paragraphs as above; the green "open to work" badge is present with the `[CONFIRM]` note in the PR.
4. Right column has Education (2 entries) and Certifications (4 items). No "Currently learning" card.
5. At 768px the stats become a 2x2 grid and the cards drop below the text.
6. No text or numbers outside the facts list appear.

### C.4 Skills (builder 4)

Section `#skills`.

**Layout**
- Head: num `02`, title `Skills`, label `[ technical proficiency ]`.
- Marquee block `.ep-skills__rows`, margin-top 64px, rows stacked with gap 16px. Full-bleed (extends past the container to the viewport edges) so chips run off screen.
- Rows: 6 rows, one per CV skill group (reference has 5; see Flag G-8). Row direction alternates: rows 1, 3, 5 move left; rows 2, 4, 6 move right.
- Desktop row height 44px (chip height). Tablet same. Mobile chips 40px.

**Skill rows (final chip text, taken from CV skill groups)**
1. AI coding agents: `Claude Code`, `OpenAI Codex`, `Cursor`, `Windsurf`, `GitHub Copilot`, `Cline`, `Aider`, `v0.dev`, `Bolt.new`, `Replit Agent`, `n8n`, `Dify`
2. LLMs & agentic orchestration: `LangGraph`, `LangChain`, `LlamaIndex`, `CrewAI`, `AutoGen`, `Model Context Protocol`, `OpenAI Agents SDK`, `DSPy`, `PydanticAI`, `GPT-4o`, `Llama 3`, `DeepSeek-R1`, `Gemini 1.5 Pro`, `vLLM`, `Ollama`, `LoRA / QLoRA`
3. Advanced RAG & document intelligence: `GraphRAG (Neo4j)`, `Hybrid Search`, `Cross-Encoder Re-ranking`, `Semantic Chunking`, `Pinecone`, `Qdrant`, `Milvus`, `ChromaDB`, `PGVector`, `Docling`, `LlamaParse`, `Unstructured.io`
4. Full-stack AI & enterprise integration: `Python`, `TypeScript`, `FastAPI`, `Next.js`, `React`, `Streamlit`, `Gradio`, `REST & GraphQL`, `WebSockets`, `Server-Sent Events`, `Celery`, `Redis`, `Kafka`, `Salesforce`, `SAP`, `ServiceNow`
5. Cloud, MLOps, evals & security: `Docker`, `Kubernetes`, `AWS Bedrock`, `AWS ECS`, `AWS Lambda`, `Azure OpenAI`, `GCP Vertex AI`, `GitHub Actions`, `LangSmith`, `Langfuse`, `Ragas`, `DeepEval`, `Guardrails AI`, `NeMo Guardrails`, `Presidio`, `OAuth2 / JWT`, `RBAC`
6. Forward deployed & data analytics: `Rapid POC-to-production`, `Custom VPC deployment`, `PostgreSQL`, `MSSQL`, `Snowflake`, `BigQuery`, `dbt`, `Pandas`, `NumPy`, `scikit-learn`, `Power BI`, `Tableau`, `Advanced Excel`

Row labels are not displayed (reference has none). Each row element carries `aria-label="<group name>"` on the `ul`, and the duplicated copy is `aria-hidden="true"`.

**Marquee behaviour**
- Each row is a `ul.ep-skills__track` with two copies of the chip list (the second `aria-hidden`), `display: flex; width: max-content; gap: 12px`. Animate `transform: translate3d(0,0,0)` to `translate3d(-50%,0,0)` for left-moving rows, and `translate3d(-50%,0,0)` to `translate3d(0,0,0)` for right-moving rows.
- Durations per row: 1: 46s, 2: 58s, 3: 52s, 4: 64s, 5: 49s, 6: 56s. Easing `linear`, infinite.
- Edge mask on `.ep-skills__rows`: `mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%)`.
- Pause the row (`animation-play-state: paused`) on `:hover` of the row, so the hovered chip stays still.
- Off-screen rows pause (IntersectionObserver toggles `is-paused` on the row, which sets `animation-play-state: paused`).
- Reduced motion: no animation; each row becomes `flex-wrap: wrap` centred, chips static, and the duplicate copy is hidden.

**Chip (`.ep-skills__chip`)**
- Height 44px, padding `0 20px`, radius pill, background `--ep-surface`, border `1px solid var(--ep-border)`, Geist Mono 15px, colour `--ep-text-2`, white-space nowrap, `transition: color 300ms var(--ep-ease-out), border-color 300ms var(--ep-ease-out), box-shadow 300ms var(--ep-ease-out), background 300ms var(--ep-ease-out)`.
- Hover (`:hover` and `.is-hover` for touch): border `rgba(139,92,246,0.6)`, colour `--ep-primary-soft`, background `rgba(139,92,246,0.08)`, box-shadow `--ep-shadow-glow-chip`. Matches frame-03 ("Framer Motion" purple).
- Focus-visible: same as hover plus 2px outline.

**Acceptance criteria (skills)**
1. Six rows of chips, alternating direction, all moving continuously and seamless (no visible jump at loop).
2. Hovering a chip highlights it violet and freezes its row; the chip's glow matches frame-03.
3. Chips use only CV terms (no invented skills). The row labels are not shown.
4. Edges fade via mask on both sides.
5. Reduced motion: static wrapped rows, no animation.

### C.5 Projects (builder 4)

Section `#work`.

**Layout**
- Head: num `03`, title `Projects`, label `[ selected works ]`.
- Bento `.ep-projects__grid`, margin-top 64px. Desktop: 3 columns, gap 20px, rows `auto auto`.
  - Card 01: spans columns 1 to 2 in row 1.
  - Card 02: column 3, spans rows 1 to 2.
  - Card 03: spans columns 1 to 2 in row 2.
  - Card heights: row 1 about 420px, row 2 about 300px at 1440px.
- Tablet (768 to 1023px): 2 columns. Card 01 spans 2. Card 02 spans 1. Card 03 spans 1. Layout: 01 full width, 02 and 03 side by side. Card 02 no longer tall.
- Mobile: 1 column, all cards full width, auto height.

The reference bento has 5 cards; the CV has 3 projects, so the grid holds 3 (see Flag G-10).

**Card anatomy (`.ep-projects__card`, extends `.ep-card`)**
- Padding 32px.
- Top row `.ep-projects__head`: index label left (`.ep-projects__index`, mono 13px, uppercase, tracking 0.18em, `--ep-text-3`, with the codename in `--ep-primary-soft`), icon links right. Icon links are omitted for all three (no repo or live URLs in facts, see Flag G-5). The markup must support `.ep-icon-btn` links, rendered only when `data-href` exists.
- Title `.ep-projects__title`: Geist 700, `--ep-fs-3xl` on the large card (01) and `--ep-fs-2xl` on the others, line-height 1.15, white.
- Description `.ep-projects__desc`: Geist 400, `--ep-fs-md`, `--ep-text-muted`, line-height 1.6, margin-top 16px, max-width 52ch.
- Metric line `.ep-projects__code` (install-line analogue, mono): background `#050505`, border `1px solid var(--ep-border)`, radius 10px, padding `12px 16px`, Geist Mono 14px, colour `--ep-text-2`, a violet `>_` prompt glyph before the text. Margin-top 24px.
- Footer `.ep-projects__foot` (margin-top auto, border-top `1px solid var(--ep-border)`, padding-top 20px): tags `.ep-tag` in a flex-wrap row, gap 8px.

**Cards (final copy)**

Card 01 (large):
- Index: `01 / AUTOLYXAI`
- Title: `Enterprise Multi-Agent & MCP Workflow Platform`
- Description: `Autonomous multi-agent system built on Claude 3.5 Sonnet, OpenAI Codex and LangGraph, with custom MCP servers that automate ticket resolution, CRM updates and ERP invoice workflows. Adds real-time SSE token streaming, human-in-the-loop approval gates and Redis semantic caching.`
- Metric line: `$ latency 3.2s -> 850ms   api_cost -30%`
- Tags: `LangGraph`, `FastAPI`, `MCP`, `Redis`, `Claude`, `SSE`

Card 02 (tall):
- Index: `02 / CLIENT RAG`
- Title: `Multimodal Enterprise RAG & GraphRAG Engine`
- Description: `Hybrid RAG engine over 50,000+ complex PDFs, scanned tables and SQL databases, with Cohere re-ranking, Microsoft Presidio PII redaction, NeMo Guardrails and automated Ragas and Langfuse evaluation gates in CI/CD.`
- Metric line: `$ recall 71% -> 92%`
- Tags: `Qdrant`, `Docling`, `LlamaParse`, `LlamaIndex`, `Ragas`, `Langfuse`, `Presidio`

Card 03:
- Index: `03 / ANALYTICS`
- Title: `Sales & Profitability Intelligence Pipeline`
- Description: `Python and SQL ETL pipelines feeding real-time Power BI dashboards for HEM.NX and Hukum Kijiye. Pinpointed low-margin SKUs and ran targeted cohort campaigns.`
- Metric line: `$ gross_revenue +16%   daily_orders +30%`
- Tags: `Python`, `SQL`, `Power BI`, `ETL`

Metric line uses `->` as ASCII; the builder may use the arrow glyph "→" instead. Keep the literal numbers exactly as above.

**Cursor-following spotlight**
- Each card has a `.ep-projects__spotlight` absolutely positioned inset 0, `pointer-events: none`, background `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,0.18), transparent 60%)`, opacity 0, transition opacity 400ms `--ep-ease-out`.
- JS sets `--mx` and `--my` (px relative to card) on `pointermove`; updates are throttled with rAF.
- On `pointerenter` the spotlight opacity goes to 1; on `pointerleave` to 0.
- Border glow: `.ep-projects__card::before` with a 1px gradient border (`linear-gradient` from violet to cyan) masked to show only the border, opacity 0 to 0.6 on hover, 400ms.
- Touch devices: spotlight disabled (`@media (hover: none)`).

**Hover**
- Card: `transform: translateY(-4px)`, border `rgba(139,92,246,0.35)`, shadow `--ep-shadow-card` plus `0 0 40px -12px rgba(139,92,246,0.35)`, 400ms `--ep-ease-out`.
- Tags: no hover effect.

**Reveal**
- Each card `.ep-reveal` with `--ep-delay` 0, 120, 240ms in DOM order.

**Acceptance criteria (projects)**
1. Three cards in the bento layout at 1440px: card 01 wide top-left, card 02 tall on the right, card 03 bottom-left.
2. Every card has index label, title, description, metric line and tags exactly as above; no GitHub or live links.
3. Spotlight follows the cursor inside each card (visible in frame-04 on VoiceCalc).
4. Hover lifts the card 4px and tints its border violet.
5. No text or numbers outside the facts list appear.
6. Reduced motion: lift and spotlight disabled, cards visible immediately.

### C.6 Journey (builder 5)

Section `#journey`.

**Layout**
- Head: num `04`, title `Journey`, label `[ my story so far ]`. Left aligned at the container edge, same as other sections.
- Timeline `.ep-journey__timeline`, margin-top 80px, position relative.
  - Centre line `.ep-journey__line`: desktop at `left: 50%`, width 2px, full timeline height, background `linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%)` at top fading to `var(--ep-border)` at the bottom. Scroll-linked: `transform: scaleY(p)` with `transform-origin: top`, where p is the fraction of the timeline scrolled past the viewport centre (rAF, passive scroll listener).
  - Each item `.ep-journey__item`: desktop two columns of width 44% with a 12% centre gutter. Odd items on the left, even items on the right. Mobile: all items on the right of a left-side line at `left: 16px`.
  - Dot `.ep-journey__dot`: 14px circle, border `2px solid var(--ep-primary)`, background `--ep-bg`, centred on the line. Inner dot 6px violet.
- Tablet (768 to 1023px): same as mobile but with the line at `left: 24px`.

**Items (final, oldest at top, chronological)**

Each item has a year badge `.ep-journey__badge`, a title `.ep-journey__title`, a sub `.ep-journey__org`, and a description `.ep-journey__desc`.

1. Badge `2013`. Title `B.Sc. with Chemistry`. Org `Mumbai University`. Desc: `Bachelor of Science with Chemistry, Mumbai University.`
2. Badge `2016`. Title `M.M.S. in Marketing`. Org `Mumbai University`. Desc: `Postgraduate study in marketing, Mumbai University.`
3. Badge `2016 – 2018`. Title `Management Trainee`. Org `Joinmay Mumbai Electronics Pvt Ltd`. Desc: `Managed a sales team and tracked performance through sales analysis and Excel-based MIS reports. Ran product technical training sessions.`
4. Badge `2018 – 2022`. Title `Assistant Manager`. Org `Kotak Securities Pvt Ltd`. Desc: `Managed sales operations and branch performance through automated MIS reporting. Trained 25+ branch employees on consultative sales techniques.`
5. Badge `2022 – 2023`. Title `Cluster Manager`. Org `Axis Securities Pvt Ltd`. Desc: `Built Excel and Power BI dashboards for sales KPIs and operational funnels. Contributed to 120% of the sales target across assigned clusters.`
6. Badge `2023`. Title `Manager, Retail & Channel Operations`. Org `ICICI Securities Ltd`. Desc: `Delivered executive dashboards and KPI tracking pipelines in SQL, Python and Advanced Excel, cutting manual reporting turnaround by 30%.`
7. Badge `2024 – Present`. Title `Forward Deployed Engineer (FDE) & GenAI Developer`. Org `AutolyxAi`. Desc: `Embedded with enterprise engineering teams to architect multi-agent workflows, MCP tool servers and RAG pipelines. Cut POC turnaround by 50% and API costs by 30%.`

Note: the item for item 1 and 2 are education; they keep the same card style. Item 7 is the current role, so its dot pulses (see below).

**Card (`.ep-journey__card`, extends `.ep-card`)**
- Padding 28px, max-width 420px.
- Badge: mono 12px, violet, tracking 0.15em, uppercase, margin-bottom 12px.
- Title: Geist 700, 22px, white.
- Org: Geist 500, 15px, `--ep-text-2`, margin-top 4px.
- Desc: Geist 400, 15px, `--ep-text-muted`, line-height 1.6, margin-top 12px.
- Hover: border `rgba(139,92,246,0.35)` and translateY(-4px), 400ms `--ep-ease-out`.

**Animations**
- Item reveal: on enter (IntersectionObserver, threshold 0.2, once): card slides in from its side (desktop: from `translateX(±40px)` toward the line; mobile: from `translateX(24px)`), opacity 0 → 1, 900ms `--ep-ease-out`.
- Dot: `scale(0)` → `scale(1)` with `--ep-ease-spring` over 500ms, starting at the same time as the card, delay 100ms.
- Badge: opacity and translateY 8px → 0, 600ms, delay 200ms.
- Current role (item 7): dot has a pulsing ring (`::after`, 2px violet ring, scale 1 → 2.2 and opacity 0.6 → 0, 2s, `ease-out`, infinite; off under reduced motion).
- Centre line glow: a 120px violet radial glow (`.ep-journey__glow`) that moves with the scroll position of the line's end, opacity 0.5. Optional; drop if performance is poor.

**Acceptance criteria (journey)**
1. Vertical line with dots, cards alternating left and right at 1440px, year badges in violet.
2. Seven entries in chronological order, text as above, and the current role at the bottom.
3. The line draws down as the user scrolls (scroll-linked), and each item reveals once.
4. At mobile the line sits on the left and all cards are on the right.
5. Reduced motion: line fully drawn, cards visible, dot pulse off.

### C.7 Contact (builder 5)

Section `#contact`.

**Layout**
- Head: num `05`, title `Contact`, label `[ get in touch ]`.
- Two columns at margin-top 64px: desktop `minmax(0, 1fr) minmax(0, 1.1fr)`, gap 64px. Left: heading, paragraph, four link cards. Right: terminal form window.
- Tablet and mobile: single column, left content first, then the terminal.

**Left column copy (final)**
- Heading `.ep-contact__heading` (Geist 700, `clamp(2rem, 3.6vw, 3rem)`, line-height 1.15):
  - Line 1: `Let's build something`
  - Line 2 `.ep-contact__accent` (violet `--ep-primary`, no gradient, as in frame-06): `extraordinary.`
- Paragraph `.ep-contact__copy` (Geist 400, `--ep-fs-md`, `--ep-text-muted`, margin-top 20px): `Have a project in mind, an AI workflow to automate, or a client deployment to scope? My inbox is always open.`
- Link cards `.ep-contact__links` (vertical list, gap 12px, margin-top 40px). Each `a.ep-contact__link` (height 72px, padding 0 20px, radius `--ep-radius-md`, border `1px dashed var(--ep-border)`, background `--ep-surface`, flex, gap 16px, full width):
  - Icon box `.ep-contact__icon`: 40px square, border `1px solid var(--ep-border)`, radius 10px, icon 18px.
  - Label `.ep-label` (mono 11px uppercase, `--ep-text-3`): `EMAIL`, `GITHUB`, `LINKEDIN`, `RESUME`
  - Value (Geist 500, 15px, white):
    - Email: `ebadarmanmomin@gmail.com` → `mailto:ebadarmanmomin@gmail.com`
    - GitHub: `github.com/ebadmomin` → `https://github.com/ebadmomin` (target _blank)
    - LinkedIn: `linkedin.com/in/ebadmomin` → `https://www.linkedin.com/in/ebadmomin` `[PLACEHOLDER]` (Flag G-1)
    - Resume: `Ebad_Momin_CV_FDE_AI_Tools.pdf` → `assets/Ebad_Momin_CV_FDE_AI_Tools.pdf` (download)
  - Hover: border `rgba(139,92,246,0.45)`, background `rgba(139,92,246,0.05)`, icon colour `--ep-primary-soft`, arrow glyph (↗ at the right edge) slides `translate(4px,-4px)`, 300ms `--ep-ease-out`.
- Phone line (small, below the links, mono 13px, `--ep-text-3`): `+91-7066123435` as a `tel:+917066123435` link. Added because the CV lists it; the reference has no phone (Flag G-12).

**Terminal form (`.ep-contact__terminal`)**
- Window: background `--ep-bg-deep`, border `1px solid var(--ep-border-strong)`, radius `--ep-radius-lg`, shadow `--ep-shadow-card` plus `0 0 60px -20px rgba(139,92,246,0.3)`, overflow hidden.
- Title bar `.ep-contact__bar` (height 48px, border-bottom `1px solid var(--ep-border)`, flex, align centre, padding 0 16px):
  - Three dots `.ep-contact__dot` (12px circles, gap 8px) in this order: violet `--ep-primary`, yellow `--ep-warning`, green `--ep-success`. Matches frame-06.
  - Centred title (absolute centred): `GET IN TOUCH` mono 12px, uppercase, `--ep-text-3`.
- Body `form.ep-contact__form` (padding 32px, grid gap 28px):
  - Field group `.ep-contact__field`: label `.ep-label` above the input.
    - `YOUR NAME`: input `type="text"`, placeholder `Enter your name`, `required`, `autocomplete="name"`, `maxlength="80"`.
    - `YOUR EMAIL`: input `type="email"`, placeholder `your@email.com`, `required`, `autocomplete="email"`.
    - `SUBJECT`: input `type="text"`, placeholder `e.g. AI Workflow Automation`, `maxlength="120"`.
    - `MESSAGE`: `textarea`, rows 4, placeholder `Tell me about your project timeline, requirements, or the problem you want to solve.`, `required`, `minlength="10"`, `maxlength="2000"`, resize vertical.
  - Input style: no box. Background transparent, bottom border `1px solid var(--ep-border-strong)`, padding `10px 0`, Geist Mono 15px, colour white, caret `--ep-primary-soft`. Placeholder colour `--ep-text-dim`.
  - Focus: bottom border becomes a violet-to-cyan gradient line that grows from left to right over 300ms (`background-size` 0% → 100%, `--ep-ease-out`); the label turns `--ep-primary-soft`.
  - Invalid (`.is-error` on the field): bottom border `--ep-danger`, label `--ep-danger`.
  - Submit row (flex, space-between, align centre, margin-top 8px):
    - Status line `.ep-contact__status` (Geist Mono 13px, `--ep-text-3`, prefix `> `): default text `Ready to send.` Typed out, 30ms per character, on first load when the terminal enters view. States (typed on change, same speed):
      - `Please enter your name.`, `Please enter a valid email.`, `Message needs at least 10 characters.` (colour `--ep-danger`)
      - `Opening your mail app...` (colour `--ep-success`), then back to `Ready to send.` after 3s.
    - Button `.ep-btn.ep-btn--primary` (type submit): text `Send Message`, arrow icon. Hover and focus per C.0. Disabled state while sending (`.is-sending`): opacity 0.6, cursor wait.
- Submit behaviour (no backend, see Flag G-13): on valid submit, build a `mailto:` URL: `mailto:ebadarmanmomin@gmail.com?subject=<subject or "Portfolio enquiry from <name>">&body=<name> (<email>)%0D%0A%0D%0A<message>`, set `window.location.href` to it. Status shows `Opening your mail app...`. Form resets only after the user returns (not implemented; leave values).
- Terminal entrance: window fades in and translates up 24px over 900ms on reveal, then status typing starts.

**Acceptance criteria (contact)**
1. Heading "Let's build something" with "extraordinary." on the second line in violet.
2. Four link cards with the exact values above; LinkedIn value marked `[PLACEHOLDER]` in the PR.
3. Terminal window has three coloured dots (violet, yellow, green), title "GET IN TOUCH", four labelled fields and a "Send Message" button, matching frame-06.
4. Status line types "Ready to send." and shows validation messages in the correct states.
5. Invalid submit does not navigate; valid submit opens the prefilled mailto link.
6. At 390px the form stacks under the links with no horizontal scroll.

### C.8 Cyber Snake (builder 6)

Section: `<dialog id="ep-snake">`, opened from ⌘K or Ctrl K (Sec. D) and the navbar button. Not listed in navigation.

**Layout**
- Dialog: `width: min(760px, 92vw)`, background `--ep-bg-deep`, border `1px solid var(--ep-border-strong)`, radius `--ep-radius-lg`, padding 0, shadow `0 40px 120px -30px rgba(0,0,0,0.9), 0 0 80px -20px rgba(139,92,246,0.35)`. `::backdrop`: `background: rgba(5,5,5,0.7); backdrop-filter: blur(8px);`.
- Header `.ep-snake__header` (height 56px, border-bottom, flex, space-between, padding `0 20px`):
  - Left: violet dot (8px, `--ep-primary`) then title `CYBER SNAKE` (Geist Mono 700, 15px, uppercase, tracking 0.12em, white). `id="ep-snake-title"`.
  - Right: trophy icon (cyan `--ep-accent`, 16px) and best score `<span class="ep-snake__best">0</span>` (mono, cyan), then close button `.ep-icon-btn` with X icon, `aria-label="Close game"`.
- Stats row `.ep-snake__meta` (flex, space-between, padding `16px 20px 12px`):
  - Left: `SCORE:` label (mono 13px, `--ep-text-3`) and value `.ep-snake__score` (mono 15px, violet, tabular).
  - Right: hint `USE ARROWS / D-PAD` (mono 12px, `--ep-text-3`, uppercase). On touch devices the hint reads `TAP D-PAD`.
- Board wrapper `.ep-snake__board` (square, `width: var(--ep-snake-board)`, margin 0 auto 20px, background `#050505`, border `1px solid var(--ep-border)`, radius 12px, overflow hidden, position relative). The inner canvas (`<canvas class="ep-snake__canvas">`) draws the game. Background dot grid drawn on the canvas (`rgba(255,255,255,0.05)` dots every cell).
- Overlay `.ep-snake__overlay` (absolute inset 0, centred column, background `rgba(5,5,5,0.7)`): shows on start and game over.
  - Start: title `PRESS ENTER TO START` (mono 14px, uppercase, white) and sub `Arrows or WASD to move. Space to pause.`
  - Game over: `GAME OVER` (Urbanist 900, 40px, white), `Score 60` line, button `.ep-btn.ep-btn--primary` text `Play again`.
- D-pad `.ep-snake__dpad` (visible under 768px only, 4 buttons in a cross, each 52px, `.ep-icon-btn` sizing, arrows as SVG). Buttons `aria-label` Up/Down/Left/Right. Visible at all widths when `(hover: none)`.
- Footer line `.ep-snake__footer` (mono 12px, `--ep-text-3`, centred): `Eat the cyan food. Avoid walls and your tail. Esc closes.`

**Game rules (final)**
- Grid: 20 x 20 cells. Start: snake of length 3 at column 6, row 10, moving right.
- Snake colours: body segments radius 4px, fill `--ep-primary` `#8b5cf6` with alpha 0.9. Head: `--ep-grad-snake` gradient (violet to cyan) per frame-09.
- Food: cyan `--ep-accent` `#06b6d4` circle, 70% of cell diameter, `shadowBlur` 12 in the same colour (matches the cyan food in frames 07 to 09).
- Score: 20 points per food eaten. Best score stored as `localStorage` key `ep-snake-best`.
- Speed: starts at 120ms per tick; each food reduces the tick by 3ms, minimum 60ms.
- Wall or self collision: game over. No wrap-around.
- Direction change: buffered per tick; ignore a reversal into the body.
- Controls: arrow keys and WASD move; Space pauses and resumes; Enter starts or restarts; Escape closes the dialog. D-pad buttons send the same directions.
- Pause automatically when the dialog closes, or the tab is hidden.
- Page scroll is prevented for arrow and Space keys while the dialog is open.

**Animations**
- Open: dialog `opacity 0 → 1` and `scale(0.96) → scale(1)`, 300ms `--ep-ease-out`. Use the `[open]` attribute with `@starting-style` where supported, else a class toggled after `showModal()`.
- Close: reverse, 200ms.
- Snake movement: step-based, no interpolation (matches the reference's grid feel).
- Food pulse: radius oscillates ±8% every 900ms, `ease-in-out`.
- Score change: value scale 1 → 1.2 → 1 over 250ms.
- Game over: board overlay fades in over 300ms; snake cells flash `--ep-danger` for 200ms before the overlay.

**Focus and accessibility**
- `showModal()` gives native focus trap. On open, focus moves to the close button (`aria-label="Close game"`). On close, focus returns to the element that opened it (`document.activeElement` saved before open).
- The canvas has `role="img"` and `aria-label` updated with score at each food pickup (throttled).
- The score is also in the text `SCORE:` element, which is `aria-live="polite"` at the moment the score changes (throttled to 1s).

**Reduced motion**
- Open and close are instant. Food pulse off. Snake step speed unchanged (it's gameplay, not decoration).

**Acceptance criteria (snake)**
1. Opening with Ctrl+K or Cmd+K (and from the navbar button) shows the modal with the header, score row, board and D-pad on touch.
2. Board is square, dark, with a faint dot grid; snake is violet with a violet-to-cyan head; food is a glowing cyan dot (matches frames 07 to 09).
3. Score goes up by 20 per food; the best score in the header persists after reload.
4. Wall and self collisions show the GAME OVER overlay with score and "Play again".
5. Escape and the X button close the modal and stop the game; focus returns to the trigger.
6. No page scroll while playing with arrow keys.

---

## D. Global effects (core, `js\effects.js` and `css\base.css`)

| Effect | Spec | Trigger | Duration and easing | Reduced motion |
|---|---|---|---|---|
| Loader | `0` → `100%` count with `EM` logo, then fade out (Sec. C.1) | Page load | 1800ms `ease-in-out`, fade 600ms | Count to 100% in 300ms, fade 300ms |
| Dot grid | `body::before`, `position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(var(--ep-dot-grid) 1px, transparent 1px); background-size: 24px 24px;` | Always on | Static | Same (static) |
| Cursor glow | `.ep-cursor-glow`: 420px circle, `radial-gradient(closest-side, hsl(263 90% 60% / 0.14), transparent)`, `position: fixed`, `pointer-events: none`, `z-index: var(--ep-z-cursor)`, `mix-blend-mode: screen` | `pointermove` on desktop (`(hover: hover) and (pointer: fine)`) | Lerp factor 0.12 per frame toward the pointer, rAF | Hidden |
| Cursor follower | `.ep-cursor-dot`: 8px dot, `background: var(--ep-primary-soft)`, `box-shadow: 0 0 12px var(--ep-primary)`, `position: fixed`, `transform: translate(x,y)`. Grows to 36px ring with `border: 1px solid var(--ep-primary-soft)` when hovering `a, button, [data-cursor]` | `pointermove` | Lerp factor 0.35 per frame; grow transition 300ms `--ep-ease-out` | Hidden |
| Particles | `canvas.ep-particles` fixed full-viewport, `z-index: var(--ep-z-particles)`. 70 particles on desktop, 36 on mobile. Each: radius 0.6 to 1.8px, colour white with alpha 0.15 to 0.55, drift velocity 0.05 to 0.25px per frame in a random direction, wraps at edges. Subtle twinkle: alpha oscillates ±0.1 over 3 to 6s. No connecting lines. | Always on | rAF loop, paused when `document.hidden` | Disabled (canvas hidden, no loop) |
| Section-number parallax | Each `[data-parallax]` (`.ep-section-head__num`) gets `transform: translate3d(0, var(--py, 0px), 0)`, where `--py = (rect.top + rect.height/2 - innerHeight/2) * -0.08` | `scroll`, rAF-throttled | No transition (scroll-linked) | Disabled (`--py: 0`) |
| Scroll reveal | `.ep-reveal` observed by one IntersectionObserver (`threshold: 0.15`, `rootMargin: "0px 0px -8% 0px"`). Adds `is-visible` once | Enter viewport | 900ms `--ep-ease-out` (in C.0) | Visible immediately |
| Nav active state | Sec. C.1. Indicator slides to the active link | Section enters the `-45%`/`-50%` band | 400ms `--ep-ease-out` | Indicator jumps (no slide) |
| Progress bar | Sec. C.1, `scaleX` | `scroll` | Scroll-linked | Same (no motion) |
| ⌘K / Ctrl+K | `keydown` listener on `document`. If `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'`, call `preventDefault()` and `window.Portfolio.openSnake()`. Escape handled by the dialog | Keyboard | Opens the dialog (Sec. C.8) | Same (instant open) |
| Ctrl K label | Navbar kbd label set from `navigator.platform` (`/Mac|iPhone|iPad/` gives `⌘K`, else `Ctrl K`) | Load | Static | Same |

Notes:
- Chrome on Windows uses Ctrl+K for its search bar. `preventDefault()` on the keydown is usually enough; if not, the navbar button is the reliable trigger.
- Particle and glow colours use the brand violet, never pure colours.

### D.1 Reduced motion (global)

`css\base.css` must include:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .ep-reveal { opacity: 1; transform: none; }
  .ep-marquee-track, .ep-journey__dot::after { animation: none !important; }
}
```

Each builder also disables its own JS loops when `matchMedia('(prefers-reduced-motion: reduce)').matches` is true (particles, dissolve, marquee, counters, typing, parallax, cursor). Core exposes `window.Portfolio.reducedMotion` (boolean) set in `effects.js` before the modules run.

---

## E. Review checklist

Run the checks below before a builder's PR is approved. Each check maps to the spec.

Structure and ownership
- [ ] Each builder changed only the files listed in B.3.
- [ ] Each builder changed only lines between its own BEGIN/END markers in `index.html`.
- [ ] `index.html` has exactly the marker pairs for hero, about, skills, projects, journey, contact and snake, each once.
- [ ] Script order in `index.html`: six section modules, `effects.js`, `main.js`.
- [ ] Every module defines `window.Portfolio.init<Name>` and nothing else on `window` except `openSnake`/`closeSnake` (snake) and `reducedMotion` (core).
- [ ] No npm, no build, no framework, no external JS libraries. Only Google Fonts CSS.

Tokens and classes
- [ ] No hard-coded colour in any builder file except inside `tokens.css`. Check with: `grep -nE "#[0-9a-fA-F]{3,8}|rgba?\(|hsl\(" css/*.css` and confirm hits are only in tokens.css (or in the spec-listed values such as `rgba(139,92,246,…)` and `rgba(255,255,255,…)` which must instead use tokens where a token exists).
- [ ] All class names start with `ep-`.
- [ ] Shared primitives are not redefined in section files.

Content (facts only)
- [ ] Grep the portfolio folder and confirm no residue of the reference: `grep -rniE "jachin|samuel|karunya|cgpa|8\.93|foodybuddy|voicecalc|nexus|ace —|b\.tech|jachinsamuel" portfolio/` returns nothing.
- [ ] Every number on the page appears in the facts list: 3+ years, 50,000+ PDFs, 94%+, 35%, 3.2s, 850ms, 30%, 71%, 92%, 16%, 30%, 50%, 120%, 25+, 2013, 2016, 2018, 2022, 2023, 2024, Jan 2024, May 2023, Dec 2023, May 2022, May 2023, Aug 2018, April 2022, July 2016, July 2018, +91-7066123435.
- [ ] Email, GitHub and phone match the facts exactly.
- [ ] No "Currently learning" card. No Instagram icon. No GitHub or live links on project cards.

Visual (screenshot comparison against frames)
- [ ] 1440x900 hero matches frame-00/01 layout (text left, photo right, buttons below paragraph).
- [ ] Navbar pill is centred, floating, active pill slides. Matches frame-01 and frame-06.
- [ ] About stats strip matches frame-02 (four cells, one hover tint).
- [ ] Skills rows match frame-03 (pill chips, edge fade).
- [ ] Projects bento matches frame-04 (card anatomy, index label, metric line, tags, spotlight).
- [ ] Journey matches frame-05 (centre line, alternating cards, year badges).
- [ ] Contact matches frame-06 (heading, link cards, terminal dots).
- [ ] Snake matches frames 07 to 09 (dark board, violet snake with cyan head, cyan food, score in header).
- [ ] Name glitch and dissolve match frame-10.

Motion
- [ ] Loader count 0 → 100 over about 1.8s.
- [ ] Hero entrance runs once after loader, in the order in C.2.
- [ ] Marquees are seamless (screenshot two frames 1 second apart; no gap at the loop).
- [ ] Hover effects match C.0 durations (300ms) and C.5 card lift (400ms).
- [ ] Reduced motion (DevTools → Rendering → emulate) removes loops and reveals.

Function
- [ ] Ctrl+K and Cmd+K open the snake; Escape closes; focus returns.
- [ ] Contact validation states and mailto link work.
- [ ] Mobile menu opens and closes at 390px.
- [ ] No console errors on load or during play.
- [ ] Opening `index.html` directly from disk (`file://`) works (no fetch, no module imports).

Responsive
- [ ] 1440px, 1024px, 768px, 390px: no horizontal scroll (except the marquee rows, which are clipped by their container).
- [ ] Tablet and mobile layouts match Sec. C for each section.

Headless screenshot command (no Node needed):
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=6000 --screenshot="<absolute path>\shot-1440.png" "file:///C:/Users/fuzai/Desktop/Ebad%20Portfolio/portfolio/index.html"
```
Note: Google Fonts needs internet; without it, fallbacks render.

---

## F. Assets

Core copies (binary copy, no execution):
- `extras\Ebad_Momin_CV_FDE_AI_Tools.pdf` → `portfolio\assets\Ebad_Momin_CV_FDE_AI_Tools.pdf`
- `public\images\ebad-hero-cutout.png` → `portfolio\assets\img\ebad-hero-cutout.png` (portrait, see G-3)

No other images. Icons are inline SVG. No favicon needed (optional: inline SVG data-URI with "EM").

---

## G. Flags and open questions

G-1. **LinkedIn URL.** The CV's LinkedIn link is a feed URL, not a profile. Spec uses the placeholder `https://www.linkedin.com/in/ebadmomin`. Ask Ebad for the real URL and use it in the footer and the contact card.

G-2. **Tableau Public URL.** The CV has a "Tableau Public" link label with no URL. Not used on the page. Add a link only when a URL is provided. Currently it does not appear in the footer or contact cards.

G-3. **Portrait file.** Three candidates:
- `public\images\ebad-hero-cutout.png`: RGBA, 1103x1426, about 1.9MB. Recommended, since the cutout's alpha lets the violet glow and bottom dissolve sit behind the figure as in the reference.
- `public\images\ebad-original.png` and `extras\file_000000002e6871faa9a735204fa945a3.png`: RGB, same dimensions, same byte size (1830751). Probably identical. Not hashed.
- All are about 1.8 to 1.9MB and 1103px wide. Recommend the lead approve a re-export at about 800px wide before launch. This spec does not resize images (no image tool available).

G-4. **Name in the browser title.** Uses "Ebad Momin" everywhere.

G-5. **Project links.** Facts forbid invented repos and live URLs. Project cards show no icon links. The markup supports them if URLs are supplied later.

G-6. **"Open to freelance projects & contract work" badge.** Not in Ebad's facts. It is a clear availability claim. Kept as a `[CONFIRM]` item; the lead or Ebad must confirm or delete it before launch.

G-7. **"Currently learning" card replaced** by "Certifications" (facts from CV). The issuer for "Generative AI, Agentic Workflows & MCP Architecture" is not stated in the CV (the line break is ambiguous), so no issuer is shown for it.

G-8. **Skills rows: 6, not 5.** The CV has six skill groups; the reference has five rows. Spec keeps six so no group is dropped. If the lead prefers five, merge row 5 and row 6.

G-9. **Hero tagline copy** ("deploying production GenAI & / agentic systems.") and the hero paragraph are proposals written from CV facts. The lead should approve the wording.

G-10. **Project count.** The reference bento has five cards; the CV lists three projects. The bento is built for three (Sec. C.5). Add cards only if Ebad supplies more projects.

G-11. **Stat counters.** Chosen from the facts: 3+ years, 50,000+ PDFs, 94%+ retrieval precision, 35% token cost reduction. The reference's "CGPA" and "Live apps" counters have no equivalent in the facts and are dropped.

G-12. **Phone number.** Added as a small line in contact (CV lists it, reference has no phone). Remove if Ebad prefers email only.

G-13. **Contact form has no backend.** Submit opens a prefilled `mailto:` link. If real delivery is needed (no client-side mail), a form endpoint must be chosen and approved; none is specified here.

G-14. **Section anchor.** Reference uses `#projects`; this spec uses `#work` to match the nav label "Work". Both labels can be kept if the lead wants the reference anchor.

G-15. **Logo mark.** `EM` is a placeholder monogram. The reference shows a stylised `JS` mark; Ebad's mark is not in the facts.

G-16. **Snake scoring and speed.** Reference frames show scores 0, 60, 140 but not the rule. Spec picks 20 points per food and a speed ramp. Not verified against the reference's source.

G-17. **Verification limits.** No browser automation was run against the reference, and no Node or ffmpeg is available. Colours, fonts, radii and transitions come from the reference CSS (exact). Positions, sizes and timings were estimated from the 12 frames (approximate, at a 1918px-wide capture). The clamp values are estimates chosen to match the frames at 1440px.

G-18. **Copy licence.** Layout, effects and the snake concept are copied from the reference's visual system, as the brief requires. No reference text or content is reused.

G-19. **Google Fonts** need internet at view time. Fallback stacks are defined; the reviewer should check the layout offline as well.

---

## H. Frame coverage check (summary)

- frame-00 (0.0s): Sec. C.2 Hero, Sec. D dot grid and glow.
- frame-01 (17.7s): Sec. C.2 Hero (paragraph, buttons), Sec. C.1 navbar, Sec. D particles.
- frame-02 (35.3s): Sec. C.3 About (heading, stats, cards).
- frame-03 (53.0s): Sec. C.4 Skills (rows, hover chip).
- frame-04 (70.6s): Sec. C.5 Projects (bento, spotlight, metric line, tags).
- frame-05 (88.3s): Sec. C.6 Journey (line, dots, badges, alternating cards).
- frame-06 (105.9s): Sec. C.7 Contact (heading, link cards, terminal), Sec. C.1 nav slide.
- frame-07 (123.6s): Sec. C.8 Snake (modal, score 0, food).
- frame-08 (141.3s): Sec. C.8 Snake (score 60, movement).
- frame-09 (158.9s): Sec. C.8 Snake (score 140, head gradient).
- frame-10 (176.6s): Sec. C.2 Hero (name glitch/scribble, portrait dissolve).
- frame-11 (194.2s): Sec. C.5 Projects (as frame-04, scrolled to #projects).
