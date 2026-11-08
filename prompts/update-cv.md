# Prompt: replace the CV / resume PDF

Written for: an AI coding tool (Claude, Codex or similar) working in this repo. The owner says "follow prompts/update-cv.md" and nothing else.

## Goal
Replace the CV PDF with the new one from `inbox/cv/`, so that every "Resume" and "Download PDF" link on the site opens the new file. The resume page keeps working the same way: the PDF is embedded at 100% zoom, with a download button and a fallback link.

## Rules (apply to every step)
- Read `KT.md` first, especially sections 2, 5 and 8 (item 5, "Change the resume PDF").
- Do not run git commands. Do not commit, push or fetch.
- Do NOT copy any wording from the CV into the site. The site's text is written in the owner's own words, and the CV is only a fact source. Do not edit any site copy (hero, about, projects, journey, contact) because of the new CV. If the new CV conflicts with the site's facts (for example years of experience, job titles, dates or metrics), list the conflicts in your report and change nothing.
- Delete the old CV PDF only after the verifier has passed every check, and only when ALL of these are true:
  - the new CV is in `assets/` and every reference points to it;
  - a search for the old file name finds no reference outside `inbox/` and `KT.md`'s history notes;
  - the old file is a different file from the new one (never delete the file you just copied).
  If any of these is not true, keep the old file and report why.
- Change only the files listed below. If another file must change, stop and say why.
- Use sub-agents as described under "Process".

## Inputs
- The CV: exactly one PDF in `inbox/cv/` (ignore `README.md`).
  - If there are zero or more than one PDF, stop and report which files you found.
  - Check the file starts with `%PDF`. If not, stop and report.

## Steps
1. Choose a NEW file name in `assets/`, for example `Ebad_Momin_CV_YYYYMMDD.pdf` using today's date. A new name is needed because `vercel.json` caches `/assets/` for a week, so a same-name file would keep showing the old CV for visitors.
2. Copy the PDF into `assets/` under that name.
3. Find every reference to the old CV file in the repo, excluding `inbox/` and the old file itself. Use a search such as `Ebad_Momin_CV_FDE_AI_Tools` and check `index.html`, `resume.html`, `js/`, `css/` and `KT.md`. At the time of writing these are:
   - `resume.html` line 90: the "Download PDF" button `href` and `download` link.
   - `resume.html` line 95: the `object` `data` attribute. Keep the `#zoom=100` fragment exactly as it is.
   - `resume.html` line 98: the fallback link.
   Change the file name in each one to the new name. Do not change anything else on those lines.
4. Update `KT.md`: section 2 (the `assets/Ebad_Momin_CV...` row), section 5 (the CV facts line, if it names the file), and section 8 item 5 (if it names the file) so they name the new file.
5. If you changed any `.js` file, run `node --check <file>` from the portfolio folder.
6. Run Step 7 (add new projects and jobs) as described under "Step 7" below.
8. After the verifier passes, delete the old CV PDF if the deletion rule in "Rules" is met. Then re-run the reference search to confirm nothing points to it. Record the deleted file name in `KT.md` section 5 under the CV facts line.

## Process (sub-agents)
1. Main agent (the tool you are talking to) runs the whole job and owns the routing.
2. Builder sub-agent (model: haiku): carries out Steps 1 to 6 and reports the exact lines changed.
3. Verifier sub-agent (model: haiku), a separate agent that did not do the build: checks the list below and reports pass or fail for each item, with evidence.
4. If any check fails, send the failures back to the builder and run the verifier again. Stop after 3 rounds and report what is still failing.

## Step 7: add new projects and jobs from the new CV

This step runs after Steps 1 to 6 have passed. The main agent does it as follows.

### 7a. Detect what is new (main agent)
1. Read the new CV PDF in `assets/` (the one just copied in Step 2). Write a short list of its work entries (employer, role, dates) and its project entries (name, what it does, the facts stated in it).
2. Read the current site entries: the projects block in `index.html` (`BEGIN:projects`, the `li.ep-projects__item` cards) and the journey block (`BEGIN:journey`, the `li.ep-journey__item` entries).
3. Compare the two lists. An item is new only if the CV has it and the site does not. Match by meaning, not exact words. Do not change or delete existing entries, even if their wording differs from the CV.
4. Write the result as two lists: NEW PROJECTS and NEW JOBS. If both are empty, say so and finish this step.

### 7b. Route the work (main agent)
- Send NEW PROJECTS to a **Projects sub-agent** (haiku). It owns only the projects block.
- Send NEW JOBS to a **Jobs sub-agent** (haiku). It owns only the journey block.
- The two sub-agents run in parallel. Neither edits the other's block.

### 7c. What each sub-agent must do
Both sub-agents follow these rules:
- **Same UI.** Copy the markup of an existing entry of the same kind (a card for a project, a timeline item for a job). Use the same classes, the same tags, and the same ordering. Do not change any CSS, JS, or layout. If the new item cannot fit the existing markup, stop and report instead of changing the design.
- **Own wording.** Write the text in the same tone as the existing entries. Use the CV only for facts (names, dates, what was built, numbers that the CV states). Do NOT copy sentences or bullet text from the CV.
- **Facts only.** Every number must appear in the CV. Do not invent a metric. If the CV gives no number, do not add one.
- **Company and client names.** The site's rule says no company or client names in new text (see `KT.md` section 5). A job entry needs an employer name. Do NOT add any new employer or client name. Stop and list the item for the owner to decide.
- **No new sections, no removed entries.** Add only the new items. Keep the order: projects by the order used on the page, jobs in date order within the timeline.
- **Report back**: the exact lines added, the item it came from in the CV, and anything skipped with the reason.

### 7d. Verify (verifier sub-agent)
- [ ] Each added item matches an item in the CV's list, and nothing is added that the CV does not state.
- [ ] No sentence in the new text is copied from the CV.
- [ ] The new items use the same classes and tags as the existing ones, and no CSS or JS file changed.
- [ ] No employer or client name was added without the owner's approval.
- [ ] Existing entries are unchanged (compare with the previous version).
- [ ] The projects count is reported. The site has an open decision on the project count (`KT.md` section 9), so report the new total for the owner.
- [ ] The timeline still alternates left and right (check the existing rule in `css/journey.css`).
- [ ] `index.html` is still valid HTML (no unclosed tags in the blocks changed).

### 7e. Report (main agent)
- The NEW PROJECTS and NEW JOBS lists, with what was added and what was skipped.
- The new project total and the new job count.
- Items that need the owner's decision (names, unclear dates, layout limits).

## Verification checklist
- [ ] Exactly one new PDF exists in `assets/` with the new name.
- [ ] The old PDF is deleted only if the deletion rule was met, and `KT.md` records the deletion. If it was not deleted, the report says why.
- [ ] The new file starts with `%PDF`.
- [ ] Every reference to the old file in `resume.html`, `index.html`, `js/`, `css/` and `KT.md` now points to the new name. A search for the old name returns nothing except the old file itself and any note in `KT.md` that says it is kept.
- [ ] `resume.html` still has `#zoom=100` on the `object` `data` attribute.
- [ ] No site copy changed (compare the text of `index.html` against the previous version; only links and file names may differ).
- [ ] `KT.md` names the new file.
- [ ] No git command was run.

## Report back (short)
- The new file name and its size.
- The exact lines changed in each file, before and after.
- Each checklist item: pass or fail.
- Any facts in the new CV that differ from the site copy (list only, change nothing).
- Anything not checked. In particular, say that the PDF was not viewed in a browser unless you actually opened it.
