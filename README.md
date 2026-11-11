# RB IQ

A game-day study app for running backs: gaps and holes, core run plays, run vision, pass protection, reading coverages, and the *why* behind defensive coverages and offensive play calls. Every quiz question comes with a diagram that highlights exactly what the question is about.

Live version: https://rb-iq-gameday.higgsfield.app

## What's inside

- **Player card**: an RB IQ overall rating built from five attributes (Gap Knowledge, Run Reads, Pass Pro, Coverage ID, Situational IQ) that climbs as you pass quizzes, plus XP and levels from Walk-on to All-American.
- **Season map**: 7 weeks, each with a Study tab and a Quiz tab.
  1. Gaps and Holes
  2. Core Run Plays
  3. Run Vision
  4. Pass Pro and Routes
  5. Reading Coverages
  6. Why the Defense Calls It (down and distance, field position, score, clock, personnel)
  7. Why the Offense Calls It
- **Visual quizzes**: 56 questions. Gold always marks what the question is about (a gap, a defender, a puller, a blitzer, a safety rotation, receivers, or the scoreboard cells that matter). Situation questions show a scoreboard, a field-position strip with the line to gain, and the offensive formation.
- **Shot Clock Drill**: name 10 random coverages, 8 seconds each.
- **Coverage Library**: Cover 0, 1, 2, 2-Man, Tampa 2, 3, 4 and 6, each drawn before and after the snap with tells, strengths, weaknesses, when it gets called and what it means for the RB.
- **Final exam**: 20 random questions from every week on a 20 second clock.

Progress is saved in the browser (localStorage) on each device.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

The `dist/` folder is a static site: drop it on GitHub Pages, Netlify, Vercel or any static host.

## Project layout

```
src/
  App.tsx            page shell: nav, intro, study app, footer
  Hero.tsx           scroll-scrubbed intro film (scroll moves the video)
  base.css           page + intro styles
  rbiq/
    data.ts          ALL content: weeks, lessons, quiz questions, coverage library
    visuals.ts       the diagram + highlight attached to every quiz question
    Diagram.tsx      SVG drawing engine: line plays, coverages, formations, scoreboard
    RbIqApp.tsx      player card, season map, quiz engine, drill, exam, library
    rbiq.css         app styles (broadcast navy, signal red, stadium gold)
```

## Adding or editing content

- **New question**: add it to the week's `quiz` array in `src/rbiq/data.ts` (`answer` is the index of the correct option), then give it a picture in `src/rbiq/visuals.ts` under the same `id`.
- **Diagram types** (see the `Diagram` type in `data.ts`):
  - `play`: offensive line with `gap` highlights, an RB `aim` path, `pullers`, `doubles`, `zone` steps, `defenders` (with `hl` highlight, `to` movement arrows, `man` coverage lines), `box` shading and `techs` labels.
  - `coverage`: any of the 8 coverages, `pre` or `post` snap, with optional `motion`, `trips` or `rotate`.
  - `formation`: an offensive set (`2te`, `goal`, `4wr`, `gun3`, `11`) with highlighted personnel, box count, safety rotation or edge rush.
- **Situation highlights**: add `hl: ["down", "clock"]` (etc.) to a question's `situation` to outline those scoreboard cells.

## Intro film

The scroll-driven intro film and its poster are loaded from the live site. To host them yourself, put `scene-01.mp4`, `scene-01-mobile.mp4` and `scene-01-poster.png` in a folder and build with `VITE_FILM_BASE=<that folder's URL>`.
