/**
 * Visual overlay: gives every quiz question (and several lessons) a diagram that
 * highlights exactly what the question asks about. Keyed by question id, or by
 * "weekId:Lesson title" for lessons. Merged into WEEKS in data.ts.
 */
import type { Def, Diagram, Question, Situation } from "./data";

type Visual = Omit<Partial<Question>, "situation"> & { situation?: Partial<Situation> };

// Defensive alignments (x) relative to the line: LT 140, LG 170, C 200, RG 230, RT 260, TE 295.
const DL = (hl?: number): Def[] =>
  [
    { x: 158, y: 184, l: "E" },
    { x: 188, y: 184, l: "T" },
    { x: 242, y: 184, l: "T" },
    { x: 272, y: 184, l: "E" },
  ].map((d, i) => ({ ...d, hl: i === hl }));
const LB = (hl?: "W" | "M" | "S"): Def[] =>
  (["W", "M", "S"] as const).map((l, i) => ({ x: [165, 205, 245][i], y: 156, l, hl: l === hl }));

const play = (d: Omit<Extract<Diagram, { kind: "play" }>, "kind">): Diagram => ({ kind: "play", ...d });

const form = (d: Omit<Extract<Diagram, { kind: "formation" }>, "kind">): Diagram => ({ kind: "formation", ...d });

export const QUIZ_VISUALS: Record<string, Visual> = {
  // Week 1
  w1q1: { prompt: "Name the highlighted gap.", diagram: play({ gap: "A-R" }) },
  w1q3: {
    prompt: "What technique is the highlighted defender?",
    diagram: play({ defenders: [{ x: 158, y: 184 }, { x: 188, y: 184 }, { x: 242, y: 184, l: "?", hl: true }, { x: 272, y: 184 }] }),
  },
  w1q4: { prompt: "In the most common numbering system, what hole number is highlighted?", options: ["3 hole", "4 hole", "2 hole", "6 hole"], answer: 1, diagram: play({ gap: "B-R" }) },
  w1q6: {
    prompt: "Every lineman steps the same direction (arrows). On this kind of run, where is the hole?",
    diagram: play({ zone: "R", defenders: DL().concat(LB()), path: "zone" }),
  },
  w1q7: {
    prompt: "The highlighted guard pulls on this gap scheme. What is your main job?",
    diagram: play({ pullers: [{ from: 1, to: 268 }], aim: "B-R", defenders: DL().concat(LB()) }),
  },
  w1q8: {
    prompt: "The highlighted defender lines up outside the tight end. What technique is he?",
    options: ["3 technique", "5 technique", "9 technique", "0 technique"],
    answer: 2,
    diagram: play({ defenders: [{ x: 188, y: 184 }, { x: 242, y: 184 }, { x: 315, y: 184, l: "?", hl: true }] }),
  },
  // Week 2
  w2q1: {
    prompt: "This is inside zone. What is the highlighted aiming point?",
    diagram: play({ aim: "B-R", target: 238, defenders: DL().concat(LB()) }),
  },
  w2q2: {
    prompt: "Outside zone. The highlighted edge defender widens with the tackle (arrow). You should:",
    diagram: play({ zone: "R", aim: "C-R", defenders: [...DL().slice(0, 3), { x: 272, y: 184, l: "E", hl: true, to: [322, 176] }, ...LB()] }),
  },
  w2q3: {
    prompt: "Which lineman is pulling on this power play (highlighted)?",
    diagram: play({ pullers: [{ from: 1, to: 268 }], aim: "B-R", defenders: DL().concat(LB()) }),
  },
  w2q4: {
    prompt: "Duo: double teams up front, no pullers. Who is the highlighted defender you read?",
    options: ["The free safety", "The Mike linebacker", "The 3 technique", "The corner"],
    diagram: play({ doubles: [[1, 2], [3, 4]], aim: "A-R", defenders: DL().concat(LB("M")) }),
  },
  w2q5: {
    prompt: "Two linemen pull on this play (highlighted). Which play is it?",
    diagram: play({ pullers: [{ from: 1, to: 268 }, { from: 0, to: 250 }], aim: "B-R", counter: true, defenders: DL().concat(LB()) }),
  },
  w2q6: {
    prompt: "The guard traps the highlighted, unblocked lineman and the RB hits it fast. Which play is it?",
    options: ["Outside zone", "Trap", "Toss", "Counter"],
    diagram: play({ pullers: [{ from: 1, to: 238 }], aim: "A-R", defenders: [{ x: 158, y: 184 }, { x: 188, y: 184 }, { x: 242, y: 184, hl: true }, { x: 272, y: 184 }, ...LB()] }),
  },
  w2q7: {
    prompt: "The QB pitches you the ball (dashed line) to the edge. What comes first?",
    diagram: play({ aim: "D-R", pitch: true, defenders: DL().concat(LB()) }),
  },
  // Week 3
  w3q1: {
    prompt: "Count the highlighted defenders in the box against your 6 blockers. This means:",
    diagram: play({ box: true, defenders: [...DL(), ...LB(), { x: 120, y: 160, l: "S" }].map((d) => ({ ...d, hl: true })) }),
  },
  w3q2: {
    prompt: "Inside zone. Right after the handoff, where should your eyes be? (The highlighted defender is your read key.)",
    options: ["The end zone", "The highlighted read key", "The QB", "The sideline"],
    diagram: play({ zone: "R", aim: "B-R", defenders: DL(2).concat(LB()) }),
  },
  w3q3: {
    prompt: "You press the aiming point (solid) before cutting back (dashed). Why press instead of cutting early?",
    diagram: play({ zone: "R", aim: "B-R", path: "press-cut", defenders: DL().concat(LB()) }),
  },
  w3q4: {
    prompt: "Your highlighted read key steps inside (arrow). You:",
    diagram: play({ zone: "R", aim: "B-R", defenders: [...DL().slice(0, 2), { x: 242, y: 184, l: "T", hl: true, to: [222, 194] }, { x: 272, y: 184 }, ...LB()] }),
  },
  w3q5: {
    prompt: "The highlighted safety rolls down right before the snap (arrow). That most likely adds:",
    diagram: play({ defenders: [...DL(), ...LB(), { x: 205, y: 70, l: "S", hl: true, to: [282, 150] }] }),
  },
  w3q6: {
    prompt: "Look at this RB path. Which classic vision mistake is it?",
    options: ["One cut and go", "Pressing the hole", "Dancing in the backfield", "Falling forward"],
    diagram: play({ path: "dance", defenders: DL().concat(LB()) }),
  },
  // Week 4
  w4q1: {
    prompt: "Three rushers are highlighted: A gap, B gap and edge. Inside-out protection means you check:",
    diagram: play({ qbSet: true, defenders: [...DL(), { x: 205, y: 156, l: "1", hl: true, to: [214, 192] }, { x: 245, y: 156, l: "2", hl: true, to: [246, 192] }, { x: 330, y: 176, l: "3", hl: true, to: [310, 214] }] }),
  },
  w4q2: {
    prompt: "The highlighted linebacker blitzes the A gap (arrow). Where do you meet him?",
    diagram: play({ qbSet: true, defenders: [...DL(), { x: 165, y: 156, l: "W" }, { x: 205, y: 156, l: "M", hl: true, to: [214, 194] }, { x: 245, y: 156, l: "S" }] }),
  },
  w4q3: {
    prompt: "Check-release: the highlighted linebackers drop into coverage instead of blitzing. You:",
    diagram: play({ qbSet: true, defenders: [...DL(), ...LB().map((d) => ({ ...d, hl: true, to: [d.x, 112] as [number, number] }))] }),
  },
  w4q4: {
    prompt: "You are running toward the right sideline with pursuit coming from inside (highlighted). Which arm carries the ball?",
    options: ["Left arm (toward the defense)", "Right arm (the sideline arm)", "Either", "Both, always"],
    diagram: play({ path: "sideline", defenders: [{ x: 250, y: 120, hl: true, to: [320, 120] }, { x: 205, y: 150, hl: true, to: [300, 150] }] }),
  },
  w4q5: {
    prompt: "The highlighted linebacker is manned up on you (dashed line). Best route idea?",
    diagram: play({ qbSet: true, defenders: [...DL(), { x: 165, y: 156, l: "W" }, { x: 205, y: 156, l: "M", hl: true, man: true }, { x: 245, y: 156, l: "S" }] }),
  },
  w4q6: {
    prompt: "Six rush (arrows) and you have six blockers including you. Who is your guy?",
    options: ["The widest rusher (highlighted 2)", "The most dangerous inside rusher left unblocked (highlighted 1)", "The corner", "Nobody"],
    diagram: play({ qbSet: true, defenders: [...DL(), { x: 205, y: 156, l: "1", hl: true, to: [214, 194] }, { x: 330, y: 176, l: "2", hl: true, to: [312, 214] }] }),
  },
  // Week 5
  w5q8: { prompt: "Two high safeties like this usually means the box has:", diagram: { kind: "coverage", id: "c2", view: "pre" } },
  // Week 6: situation cards highlight the scoreboard cells that matter, plus the offense the defense sees.
  w6q1: { situation: { hl: ["down"] }, diagram: form({ set: "2te", hl: "te" }) },
  w6q2: { situation: { hl: ["down"] }, diagram: form({ set: "4wr", hl: "wr" }) },
  w6q3: { situation: { hl: ["down", "ball"] }, diagram: form({ set: "goal", hl: "backs" }) },
  w6q4: { situation: { hl: ["score", "clock"] }, diagram: form({ set: "gun3" }) },
  w6q6: { situation: { hl: ["down"] }, diagram: form({ set: "11", hl: "wr" }) },
  w6q8: { situation: { hl: ["down"] }, diagram: form({ set: "gun3", hl: "wr" }) },
  w6q5: {
    prompt: "Inside the 20, defenses lean on man coverage like this Cover 1. Why?",
    diagram: { kind: "coverage", id: "c1", view: "post" },
    situation: { down: "1st & 10", ball: "Opp 15", score: "Tied 7-7", clock: "Q2 3:10" },
  },
  w6q7: {
    prompt: "The slot motions across the formation (dashed arrow) and the highlighted linebacker runs with him. That suggests:",
    diagram: { kind: "coverage", id: "c1", view: "pre", motion: true },
  },
  w6q9: {
    prompt: "Offense in trips to the field (3 receivers right). The defense plays this picture. What is it?",
    options: ["Cover 6, quarters to the trips side and Cover 2 to the boundary", "Cover 0", "Goal line", "Single high with no adjustment"],
    diagram: { kind: "coverage", id: "c6", view: "post", trips: true },
  },
  w6q10: {
    prompt: "Two high before the snap, then a safety rotates down (arrow) at the snap. Why disguise like this?",
    diagram: { kind: "coverage", id: "c2", view: "pre", rotate: true },
  },
  // Week 7
  w7q1: { situation: { hl: ["down"] }, diagram: form({ set: "11", safety: "down" }) },
  w7q2: { situation: { hl: ["down"] }, diagram: form({ set: "11", rush: true }) },
  w7q3: { situation: { hl: ["down"] }, diagram: form({ set: "2te", box: true }) },
  w7q4: { situation: { hl: ["score", "clock"] }, diagram: form({ set: "11", hl: "backs" }) },
  w7q6: { situation: { hl: ["score", "clock"] }, diagram: form({ set: "gun3", hl: "backs" }) },
  w7q5: { prompt: "The defense shows this: two high safeties and 6 in the box against your 6 blockers. A strong call is:", diagram: { kind: "coverage", id: "c2", view: "pre" } },
  w7q7: {
    prompt: "After 6 straight inside zones, the highlighted safeties creep down (arrows). The offense should now:",
    diagram: play({ defenders: [...DL(), ...LB(), { x: 120, y: 80, l: "S", hl: true, to: [130, 128] }, { x: 285, y: 80, l: "S", hl: true, to: [275, 128] }] }),
  },
  w7q8: { prompt: "The defense brings this almost every 3rd down. Good counters:", diagram: { kind: "coverage", id: "c0", view: "post" } },
};

export const LESSON_VISUALS: Record<string, Diagram> = {
  "w1:Defensive techniques": play({ techs: true }),
  "w1:Zone vs gap blocking": play({ zone: "R", path: "zone", defenders: DL().concat(LB()) }),
  "w2:Power and counter": play({ pullers: [{ from: 1, to: 268 }], aim: "B-R", defenders: DL().concat(LB()) }),
  "w2:Duo, iso, trap": play({ doubles: [[1, 2], [3, 4]], aim: "A-R", defenders: DL().concat(LB("M")) }),
  "w2:Toss, sweep, draw": play({ aim: "D-R", pitch: true, defenders: DL().concat(LB()) }),
  "w3:Pre-snap checklist": play({ box: true, defenders: [...DL(2), ...LB(), { x: 120, y: 160, l: "S" }] }),
  "w3:Post-snap progression": play({ zone: "R", aim: "B-R", path: "press-cut", defenders: DL(2).concat(LB()) }),
  "w4:Inside-out rule": play({ qbSet: true, defenders: [...DL(), { x: 205, y: 156, l: "1", hl: true, to: [214, 192] }, { x: 245, y: 156, l: "2", hl: true, to: [246, 192] }, { x: 330, y: 176, l: "3", hl: true, to: [310, 214] }] }),
  "w6:Personnel and formation": { kind: "coverage", id: "c1", view: "pre", motion: true },
  "w7:Run it where they are not": play({ box: true, defenders: [...DL(), ...LB(), { x: 120, y: 80, l: "S" }, { x: 285, y: 80, l: "S" }] }),
};
