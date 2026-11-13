import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { PHASES } from "./advanced";
import { ALL_QUESTIONS, ATTRS, COVERAGES, WEEKS } from "./data";
import type { Attr, CoverageId, Question, Week } from "./data";
import { CoverageField, DiagramView, SituationBoard } from "./Diagram";
import "./rbiq.css";

interface Progress {
  best: Record<string, number>;
  xp: number;
  examBest: number;
  drillBest: number;
}

const KEY = "rbiq-progress-v1";
const EMPTY: Progress = { best: {}, xp: 0, examBest: 0, drillBest: 0 };

function useProgress() {
  const [p, setP] = useState<Progress>(EMPTY);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setP({ ...EMPTY, ...(JSON.parse(raw) as Progress) });
    } catch {
      /* storage unavailable: progress stays in memory */
    }
  }, []);
  const save = useCallback((next: Progress) => {
    setP(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);
  return [p, save] as const;
}

const LEVELS = ["Walk-on", "Scout Team", "Rotation", "Starter", "All-Conference", "All-American"];

function attrScores(p: Progress): Record<Attr, number> {
  const out = {} as Record<Attr, number>;
  for (const a of ATTRS) {
    const weeks = WEEKS.filter((w) => w.attr === a.id);
    const avg = weeks.length ? weeks.reduce((s, w) => s + (p.best[w.id] ?? 0), 0) / weeks.length : 0;
    out[a.id] = a.id === "cov" ? Math.max(avg, p.drillBest) : avg;
  }
  return out;
}
const toRating = (s: number) => Math.round(40 + 59 * s);

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDrill(n: number): Question[] {
  const ids = COVERAGES.map((c) => c.id);
  return Array.from({ length: n }, (_, i) => {
    const target = ids[Math.floor(Math.random() * ids.length)];
    const wrong = shuffle(ids.filter((x) => x !== target)).slice(0, 3);
    const opts = shuffle([target, ...wrong]);
    const info = COVERAGES.find((c) => c.id === target)!;
    return {
      id: `drill-${i}`,
      prompt: "Shot clock: name the coverage.",
      options: opts.map((o) => COVERAGES.find((c) => c.id === o)!.name),
      answer: opts.indexOf(target),
      diagram: { kind: "coverage" as const, id: target as CoverageId, view: "post" as const },
      why: `${info.name}: ${info.shell}. ${info.rb}`,
    };
  });
}

type View =
  | { k: "home" }
  | { k: "week"; id: string; tab: "study" | "quiz" }
  | { k: "exam"; qs: Question[] }
  | { k: "drill"; qs: Question[] }
  | { k: "library" };

export function RbIqApp() {
  const [p, save] = useProgress();
  const [view, setView] = useState<View>({ k: "home" });
  const topRef = useRef<HTMLDivElement>(null);

  const go = (v: View) => {
    setView(v);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: "start" }));
  };

  const scores = attrScores(p);
  const ratings = ATTRS.map((a) => ({ ...a, r: toRating(scores[a.id]) }));
  const ovr = Math.round(ratings.reduce((s, a) => s + a.r, 0) / ratings.length);
  const level = LEVELS[Math.min(LEVELS.length - 1, Math.floor(p.xp / 300))];

  const finish = (key: "week" | "exam" | "drill", id: string, pct: number, xpGain: number) => {
    const next: Progress = { ...p, best: { ...p.best }, xp: p.xp + xpGain };
    if (key === "week") next.best[id] = Math.max(p.best[id] ?? 0, pct);
    if (key === "exam") next.examBest = Math.max(p.examBest, pct);
    if (key === "drill") next.drillBest = Math.max(p.drillBest, pct);
    save(next);
  };

  return (
    <div className="rbiq" id="season" ref={topRef}>
      <PlayerCard ovr={ovr} ratings={ratings} xp={p.xp} level={level} />
      {view.k === "home" ? (
        <Season p={p} go={go} />
      ) : view.k === "week" ? (
        <WeekView
          week={WEEKS.find((w) => w.id === view.id)!}
          tab={view.tab}
          best={p.best[view.id] ?? 0}
          setTab={(tab) => go({ k: "week", id: view.id, tab })}
          back={() => go({ k: "home" })}
          onDone={(pct, xp) => finish("week", view.id, pct, xp)}
        />
      ) : view.k === "exam" ? (
        <Frame title="Championship: Final Exam" back={() => go({ k: "home" })}>
          <Quiz questions={view.qs} seconds={20} onDone={(pct, xp) => finish("exam", "exam", pct, xp)} onExit={() => go({ k: "home" })} />
        </Frame>
      ) : view.k === "drill" ? (
        <Frame title="Shot Clock Coverage Drill" back={() => go({ k: "home" })}>
          <Quiz questions={view.qs} seconds={8} onDone={(pct, xp) => finish("drill", "drill", pct, xp)} onExit={() => go({ k: "home" })} />
        </Frame>
      ) : (
        <Frame title="Coverage Library" back={() => go({ k: "home" })}>
          <Library />
        </Frame>
      )}
    </div>
  );
}

function PlayerCard({ ovr, ratings, xp, level }: { ovr: number; ratings: { id: Attr; label: string; r: number }[]; xp: number; level: string }) {
  return (
    <section className="rbiq-card" aria-label="Your RB IQ rating">
      <div className="rbiq-card__ovr">
        <span className="rbiq-card__num">{ovr}</span>
        <span className="rbiq-card__ovr-label">RB IQ OVR</span>
      </div>
      <div className="rbiq-card__body">
        <p className="rbiq-card__level">
          {level} <span>{xp} XP</span>
        </p>
        <ul className="rbiq-card__attrs">
          {ratings.map((a) => (
            <li key={a.id}>
              <span className="rbiq-card__attr-name">{a.label}</span>
              <span className="rbiq-meter" aria-hidden="true">
                <span style={{ width: `${a.r}%` }} />
              </span>
              <span className="rbiq-card__attr-val">{a.r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Season({ p, go }: { p: Progress; go: (v: View) => void }) {
  return (
    <section className="rbiq-season" aria-label="Season schedule">
      <h2 className="rbiq-h2">Your season</h2>
      <p className="rbiq-season__sub">
        {WEEKS.length} weeks, {ALL_QUESTIONS.length} questions. Every answer comes with the why.
      </p>
      <ol className="rbiq-sched">
        {WEEKS.map((w, idx) => {
          const best = p.best[w.id] ?? 0;
          const stars = best >= 0.9 ? 3 : best >= 0.75 ? 2 : best > 0 ? 1 : 0;
          const phase = PHASES.find((ph) => ph.from === idx);
          return (
            <li key={w.id}>
              {phase ? <p className="rbiq-phase">{phase.title}</p> : null}
              <button className="rbiq-sched__row" type="button" onClick={() => go({ k: "week", id: w.id, tab: "study" })}>
                <span className="rbiq-sched__tag">{w.tag}</span>
                <span className="rbiq-sched__title">{w.title}</span>
                <span className="rbiq-sched__blurb">{w.blurb}</span>
                <span className="rbiq-sched__stars" aria-label={`${stars} of 3 stars`}>
                  {[0, 1, 2].map((i) => (
                    <i key={i} data-on={i < stars ? "true" : undefined} />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="rbiq-extras">
        <button className="rbiq-drill-btn" type="button" onClick={() => go({ k: "drill", qs: makeDrill(10) })}>
          <strong>Shot Clock Drill</strong>
          <span>10 coverages, 8 seconds each{p.drillBest ? `. Best ${Math.round(p.drillBest * 100)}%` : ""}</span>
        </button>
        <button className="rbiq-lib-btn" type="button" onClick={() => go({ k: "library" })}>
          <strong>Coverage Library</strong>
          <span>Every shell, its tells and what it means for you</span>
        </button>
      </div>
      <button className="rbiq-ticket" type="button" onClick={() => go({ k: "exam", qs: shuffle(ALL_QUESTIONS).slice(0, 30) })}>
        <span className="rbiq-ticket__stub">Championship</span>
        <span className="rbiq-ticket__main">
          <strong>Final exam</strong>
          <span>30 questions from every week, 20 second clock{p.examBest ? `. Best ${Math.round(p.examBest * 100)}%` : ""}</span>
        </span>
      </button>
    </section>
  );
}

function Frame({ title, back, children }: { title: string; back: () => void; children: ReactNode }) {
  return (
    <section className="rbiq-frame">
      <div className="rbiq-frame__top">
        <button className="rbiq-back" type="button" onClick={back}>
          Schedule
        </button>
        <h2 className="rbiq-h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function WeekView({ week, tab, best, setTab, back, onDone }: { week: Week; tab: "study" | "quiz"; best: number; setTab: (t: "study" | "quiz") => void; back: () => void; onDone: (pct: number, xp: number) => void }) {
  return (
    <Frame title={`${week.tag}: ${week.title}`} back={back}>
      <div className="rbiq-tabs" role="tablist">
        <button role="tab" type="button" aria-selected={tab === "study"} className="rbiq-tab" onClick={() => setTab("study")}>
          Study
        </button>
        <button role="tab" type="button" aria-selected={tab === "quiz"} className="rbiq-tab" onClick={() => setTab("quiz")}>
          Quiz{best ? ` (best ${Math.round(best * 100)}%)` : ""}
        </button>
      </div>
      {tab === "study" ? (
        <div className="rbiq-lessons">
          {week.lessons.map((l) => (
            <article className="rbiq-lesson" key={l.title}>
              <h3>{l.title}</h3>
              {l.diagram ? (
                <div className="rbiq-lesson__fig">
                  <DiagramView d={l.diagram} letters={l.diagram.kind === "gap"} />
                  {l.diagram.kind === "gap" && l.diagram.label ? <p className="rbiq-cap">{l.diagram.label}</p> : null}
                </div>
              ) : null}
              <ul>
                {l.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          ))}
          <button className="rbiq-scoreboard-btn" type="button" onClick={() => setTab("quiz")}>
            Take the quiz
          </button>
        </div>
      ) : (
        <Quiz key={week.id} questions={week.quiz} onDone={onDone} onExit={back} />
      )}
    </Frame>
  );
}

function Quiz({ questions, seconds, onDone, onExit }: { questions: Question[]; seconds?: number; onDone: (pct: number, xp: number) => void; onExit: () => void }) {
  // Shuffle the answer order every attempt so position never gives the answer away.
  const qs = useMemo(
    () =>
      questions.map((q) => {
        const perm = shuffle(q.options.map((_, i) => i));
        return { ...q, options: perm.map((i) => q.options[i]), answer: perm.indexOf(q.answer) };
      }),
    [questions],
  );
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [left, setLeft] = useState(seconds ?? 0);
  const [done, setDone] = useState(false);
  const [think, setThink] = useState(() => {
    try {
      return window.localStorage.getItem("rbiq-think") !== "off";
    } catch {
      return true;
    }
  });
  const [shown, setShown] = useState(false);
  const q = qs[i];
  const hideChoices = !seconds && think && !shown;
  const toggleThink = () => {
    const next = !think;
    setThink(next);
    try {
      window.localStorage.setItem("rbiq-think", next ? "on" : "off");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!seconds || pick !== null || done) return;
    setLeft(seconds);
    const start = Date.now();
    const t = window.setInterval(() => {
      const remain = seconds - (Date.now() - start) / 1000;
      if (remain <= 0) {
        window.clearInterval(t);
        setLeft(0);
        setPick(-1);
        setStreak(0);
      } else setLeft(remain);
    }, 100);
    return () => window.clearInterval(t);
  }, [i, seconds, pick, done]);

  const choose = (idx: number) => {
    if (pick !== null) return;
    setPick(idx);
    if (idx === q.answer) {
      const s = streak + 1;
      setStreak(s);
      setRight((r) => r + 1);
      setXp((x) => x + 10 + (s >= 3 ? 5 : 0));
    } else setStreak(0);
  };

  const next = () => {
    if (i + 1 >= qs.length) {
      setDone(true);
      onDone(right / qs.length, xp);
    } else {
      setI(i + 1);
      setPick(null);
      setShown(false);
    }
  };

  if (done) {
    const pct = Math.round((right / qs.length) * 100);
    return (
      <div className="rbiq-result" role="status">
        <p className="rbiq-result__score">
          {right}/{qs.length}
        </p>
        <p className="rbiq-result__pct">{pct}%</p>
        <p className="rbiq-result__xp">+{xp} XP</p>
        <p className="rbiq-result__note">
          {pct >= 90 ? "Film-room starter. You own this." : pct >= 75 ? "Solid rep. Run it back for three stars." : "Back to the study tab, then run it again."}
        </p>
        <button className="rbiq-next" type="button" onClick={onExit}>
          Back to schedule
        </button>
      </div>
    );
  }

  const answered = pick !== null;
  return (
    <div className="rbiq-quiz">
      <div className="rbiq-quiz__meta">
        <span>
          Play {i + 1} of {qs.length}
        </span>
        <span>Streak {streak}</span>
        <span>+{xp} XP</span>
      </div>
      {!seconds ? (
        <button type="button" className="rbiq-think-toggle" aria-pressed={think} onClick={toggleThink}>
          Think first: {think ? "On" : "Off"}
        </button>
      ) : null}
      {seconds ? (
        <div className="rbiq-clock" aria-label={`${Math.ceil(left)} seconds left`}>
          <span style={{ transform: `scaleX(${answered ? 0 : left / seconds})` }} />
          <b>{answered ? "" : Math.ceil(left)}</b>
        </div>
      ) : null}
      {q.situation ? <SituationBoard s={q.situation} /> : null}
      {q.diagram ? (
        <div className="rbiq-quiz__fig">
          <DiagramView d={q.diagram} />
          <p className="rbiq-legend">
            <span className="rbiq-legend__hl">Gold</span> = what the question is about. <span className="rbiq-legend__red">Red</span> = defenders and the RB path.
          </p>
        </div>
      ) : null}
      <p className="rbiq-quiz__prompt">{q.prompt}</p>
      {hideChoices ? (
        <div className="rbiq-think">
          <p>Make your call before you see the choices. Say it out loud: what do you see, and what is the answer?</p>
          <button type="button" className="rbiq-think__btn" onClick={() => setShown(true)}>
            I've got my answer
          </button>
        </div>
      ) : (
      <div className="rbiq-answers">
        {q.options.map((o, idx) => {
          const state = !answered ? undefined : idx === q.answer ? "right" : idx === pick ? "wrong" : "dim";
          return (
            <button key={o} type="button" className="rbiq-answer" data-state={state} disabled={answered} onClick={() => choose(idx)}>
              <span className="rbiq-answer__key">{"ABCD"[idx]}</span>
              {o}
            </button>
          );
        })}
      </div>
      )}
      {answered ? (
        <div className="rbiq-replay" role="status">
          <p className="rbiq-replay__tag">{pick === q.answer ? "Correct call" : pick === -1 ? "Clock ran out" : "Replay"}</p>
          <p>{q.why}</p>
          <button className="rbiq-next" type="button" onClick={next}>
            {i + 1 >= qs.length ? "See results" : "Next play"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Library() {
  return (
    <div className="rbiq-lib">
      {COVERAGES.map((c) => (
        <article className="rbiq-lib__item" key={c.id}>
          <h3>{c.name}</h3>
          <p className="rbiq-lib__shell">{c.shell}</p>
          <div className="rbiq-lib__figs">
            <figure>
              <CoverageField id={c.id} view="pre" />
              <figcaption>Before the snap</figcaption>
            </figure>
            <figure>
              <CoverageField id={c.id} view="post" />
              <figcaption>After the snap</figcaption>
            </figure>
          </div>
          <dl>
            <dt>Tells</dt>
            <dd>
              <ul>
                {c.tells.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
            <dt>Strength</dt>
            <dd>{c.strong}</dd>
            <dt>Weakness</dt>
            <dd>{c.weak}</dd>
            <dt>When it gets called</dt>
            <dd>{c.calledWhen}</dd>
            <dt>What it means for the RB</dt>
            <dd>{c.rb}</dd>
          </dl>
        </article>
      ))}
    </div>
  );
}
