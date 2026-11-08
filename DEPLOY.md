# Deploying the portfolio to Vercel

This folder is a plain static site (HTML, CSS, JavaScript). It has no build step and no npm packages.

## What gets published
Only the files in this folder that are NOT listed in `.vercelignore`:
- `index.html`, `resume.html`, `css/`, `js/`, `assets/` (CV PDF and photos), `vercel.json`.
- Internal notes (`*.md`: `DESIGN_SPEC.md`, `KT.md`, `DEPLOY.md`) are excluded.

Never publish the whole "Ebad Portfolio" root folder. It contains old experiments, screenshots, reference recordings and a Flask app, so deploy only this `portfolio` folder.

## One-time setup (recommended: its own GitHub repo)
1. Create a new GitHub repository, for example `ebad-portfolio`, containing ONLY the contents of this `portfolio` folder.
2. Before the first push, check that no secrets or large media are included.
3. Push it to GitHub yourself. (The assistant does not commit or push.)

## Deploy on Vercel
1. Go to vercel.com, sign in with GitHub, then click **Add New… → Project**.
2. Import the `ebad-portfolio` repository.
3. Settings:
   - Framework Preset: **Other**
   - Root Directory: leave as `./` (repo root contains the site)
   - Build Command: leave empty (or `none`)
   - Output Directory: leave empty (or `.`)
4. Click **Deploy**. Vercel gives a URL such as `https://ebad-portfolio.vercel.app`.

If you instead push the whole Ebad Portfolio folder, set **Root Directory** to `portfolio` in Project Settings and make sure the old root `vercel.json` (Next.js) is not used.

## Updating the site later
- Push a commit to the repo's main branch; Vercel redeploys automatically.
- Preview deployments are created for other branches.

## Custom domain (optional)
Project → Settings → Domains → add your domain, then follow the DNS records Vercel shows.

## Checks after deploying
- Home page loads; loader finishes; navbar links jump to each section.
- `/resume.html` opens and the Download button works.
- The PDF link `assets/Ebad_Momin_CV_FDE_AI_Tools.pdf` downloads.
- GitHub, LinkedIn and email links open the right place (see KT.md open decisions).
- On a phone, the layout stacks in one column.

## Known points
- Fonts (Geist, Urbanist) load from Google Fonts, so the site needs internet access.
- The contact form has no server: it opens the visitor's email app with a pre-filled message.
- The command palette and snake game open with Ctrl K (Windows) or ⌘K (Mac); the palette button is hidden on screens narrower than 1024px.
