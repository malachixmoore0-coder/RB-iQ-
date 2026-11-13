# RB IQ

A game-day study app for running backs: gaps and holes, core run plays, run vision, pass protection, reading coverages, and the *why* behind defensive coverages and offensive play calls. Every quiz question comes with a diagram that highlights exactly what the question is about.

Open the app: https://malachixmoore0-coder.github.io/rb-iq-/ (also live at https://rb-iq-gameday.higgsfield.app)

## What's inside

- **Player card**: an RB IQ overall rating built from five attributes (Gap Knowledge, Run Reads, Pass Pro, Coverage ID, Situational IQ) that climbs as you pass quizzes, plus XP and levels from Walk-on to All-American.
- **Season map**: 14 weeks in three phases (Fall Camp, Film Room, Game Week), each with a Study tab and a Quiz tab.
  1. Gaps and Holes
  2. Defensive Fronts (4-3 Over/Under, 3-4 Okie and Tite, nickel, 3-3-5, Bear)
  3. Core Run Plays (inside zone, outside zone, power, counter, duo, iso, trap, toss and draw)
  4. Run Vision
  5. Reading the Front (bubbles, 4i squeezes, slants, run blitzes, plus-one boxes)
  6. Option, RPO and the Mesh
  7. Pass Pro and Routes
  8. Protection Schemes and Blitz ID (big on big, slide, sugar, fire zone, sim pressure)
  9. Reading Coverages
  10. Offensive Systems (Air Raid, spread option, pro-style, power run, wide zone, triple option)
  11. Personnel and Formations
  12. The D1 Pre-Snap Checklist
  13. Why the Defense Calls It
  14. Why the Offense Calls It
- **Visual quizzes**: 135 questions. Think-first mode hides the choices until you make your call, and answer order is shuffled every attempt. Gold always marks what the question is about (a gap, a defender, a puller, a blitzer, a safety rotation, receivers, or the scoreboard cells that matter). Situation questions show a scoreboard, a field-position strip with the line to gain, and the offensive formation.
- **Shot Clock Drill**: name 10 random coverages, 8 seconds each.
- **Coverage Library**: Cover 0, 1, 2, 2-Man, Tampa 2, 3, 4 and 6, each drawn before and after the snap with tells, strengths, weaknesses, when it gets called and what it means for the RB.
- **Final exam**: 30 random questions from every week on a 20 second clock.

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
    data.ts          weeks 1, 3, 4, 7, 9, 13, 14 content, coverage library, season assembly
    advanced.ts      fronts, reading the front, option/RPO, protection, systems, personnel, pre-snap checklist
    visuals.ts       the diagram + highlight attached to every quiz question
    broadcast.tsx    broadcast camera renderer: perspective turf, player figures, badges
    Diagram.tsx      play, coverage and formation diagrams (drawn through broadcast.tsx), scoreboard
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

The scroll-driven intro film and its posters are copied from the live site into `public/assets/world/` by the deploy workflow at build time.
