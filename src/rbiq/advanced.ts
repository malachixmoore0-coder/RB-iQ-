/**
 * Advanced weeks: defensive fronts, reading the front, option and RPO, protection
 * schemes, offensive systems, personnel and formations, and the D1 pre-snap checklist.
 * Diagrams are written inline. Line x positions: LT 140, LG 170, C 200, RG 230, RT 260, TE 295.
 */
import type { Def, Diagram, Week } from "./data";

const D = (x: number, y: number, l?: string, hl?: boolean, to?: [number, number]): Def => ({ x, y, l, hl, to });
const play = (d: Omit<Extract<Diagram, { kind: "play" }>, "kind">): Diagram => ({ kind: "play", ...d });
const form = (d: Omit<Extract<Diagram, { kind: "formation" }>, "kind">): Diagram => ({ kind: "formation", ...d });

/** Mark defenders whose label is in `hl` as highlighted. */
const mark = (defs: Def[], ...hl: string[]): Def[] => defs.map((d) => ({ ...d, hl: d.l ? hl.includes(d.l) : false }));

// ---------- fronts (play view, strength to the right) ----------
const OVER = [D(128, 184, "E"), D(190, 184, "1"), D(242, 184, "3"), D(272, 184, "E"), D(165, 156, "W"), D(215, 156, "M"), D(312, 170, "S")];
const UNDER = [D(128, 184, "E"), D(158, 184, "3"), D(212, 184, "1"), D(286, 184, "E"), D(160, 156, "W"), D(232, 156, "M"), D(318, 184, "S")];
const OKIE = [D(92, 180, "OLB"), D(130, 184, "5"), D(200, 184, "0"), D(270, 184, "5"), D(316, 180, "OLB"), D(172, 156, "ILB"), D(228, 156, "ILB")];
const TITE = [D(92, 180, "OLB"), D(150, 184, "4i"), D(200, 184, "0"), D(250, 184, "4i"), D(316, 180, "OLB"), D(172, 156, "ILB"), D(228, 156, "ILB")];
const NICKEL = [D(128, 184, "E"), D(188, 184, "T"), D(242, 184, "T"), D(272, 184, "E"), D(180, 156, "W"), D(228, 156, "M"), D(342, 172, "N")];
const STACK = [D(130, 184, "E"), D(200, 184, "N"), D(270, 184, "E"), D(130, 150, "W"), D(200, 148, "M"), D(270, 150, "S")];
const BEAR = [D(122, 184, "E"), D(158, 184, "3"), D(200, 184, "0"), D(242, 184, "3"), D(312, 184, "E"), D(165, 156, "W"), D(225, 156, "M"), D(286, 168, "S")];
const FOUR_DOWN = [D(128, 184, "E"), D(188, 184, "T"), D(242, 184, "T"), D(272, 184, "E")];

// ---------- formation-view defenders ----------
const ZR_DEF = (crash: boolean): Def[] => [
  D(128, 190, "E", true, crash ? [168, 222] : undefined),
  D(186, 190),
  D(216, 190),
  D(272, 190, "E"),
  D(165, 160, "W"),
  D(205, 158, "M"),
  D(250, 160, "S"),
  D(200, 92, "F"),
  D(25, 180, "C"),
  D(375, 180, "C"),
];
const SPREAD_DEF: Def[] = [D(150, 190), D(186, 190), D(216, 190), D(250, 190), D(180, 160, "W"), D(225, 160, "M"), D(330, 172, "N"), D(120, 88, "S"), D(280, 88, "S"), D(25, 180, "C"), D(375, 180, "C")];

// ---------- routes ----------
const MESH: NonNullable<Extract<Diagram, { kind: "formation" }>["routes"]> = [
  { pts: [[80, 210], [92, 188], [300, 178]], hl: true },
  { pts: [[320, 210], [308, 184], [100, 184]], hl: true },
  { pts: [[25, 207], [25, 120], [62, 92]] },
  { pts: [[375, 207], [375, 120], [338, 92]] },
  { pts: [[230, 252], [290, 238], [330, 236]] },
];
const VERTS: NonNullable<Extract<Diagram, { kind: "formation" }>["routes"]> = [
  { pts: [[25, 207], [25, 70]], hl: true },
  { pts: [[80, 210], [120, 150], [130, 70]], hl: true },
  { pts: [[320, 210], [280, 150], [270, 70]], hl: true },
  { pts: [[375, 207], [375, 70]], hl: true },
  { pts: [[230, 252], [260, 230], [250, 206]] },
];

export const ADVANCED_WEEKS: Week[] = [
  // ======================================================== FRONTS
  {
    id: "f1",
    tag: "",
    title: "Defensive Fronts",
    attr: "front",
    blurb: "4-3 Over and Under, 3-4 Okie and Tite, nickel, 3-3-5 and Bear. Who is on the line and why it matters to you.",
    lessons: [
      {
        title: "4-3 vs 3-4: the big picture",
        points: [
          "4-3: four down linemen and three linebackers. The line usually attacks one gap each (1-gap) and the linebackers flow to the ball.",
          "3-4: three down linemen (a nose and two ends) and four linebackers, two inside and two outside.",
          "The 3-4's outside linebackers are edge players who can rush or drop. The fourth rusher can come from almost anywhere, which is why 3-4 pressure is hard to pick up.",
          "Against spread offenses most college defenses live in nickel: a 4-2-5 or a 3-3-5 with five defensive backs.",
        ],
        diagram: play({ label: "4-3 Over", defenders: OVER, techs: false }),
      },
      {
        title: "4-3 Over and Under",
        points: [
          "Over: the 3-technique goes to the strength (the tight end side), a shade or 1-technique goes to the weak side, and the Sam linebacker sits off the ball over the tight end.",
          "Under: the 3-technique goes to the weak side, the shade goes to the strength, and the Sam walks up onto the line over the tight end like a fifth lineman.",
          "Why you care: the front tells you which guard is uncovered, where the double teams go, and which linebacker is free.",
        ],
        diagram: play({ label: "4-3 Under", defenders: UNDER }),
      },
      {
        title: "3-4 Okie and Tite",
        points: [
          "Okie (5-0-5): ends on the outside shoulders of the tackles, a nose head-up on the center. Both guards are uncovered, with the inside linebackers stacked behind them.",
          "Tite (4i-0-4i): the ends move to the inside shoulders of the tackles. It squeezes the B gaps and was built to stop inside zone and the spread run game.",
          "Against Tite the inside lanes close fast. Runs that kick out the 4i, or get outside of it, have the best shot.",
        ],
        diagram: play({ label: "3-4 Tite", defenders: TITE }),
      },
      {
        title: "Nickel, 3-3-5 and Bear",
        points: [
          "4-2-5 nickel: a fifth defensive back replaces a linebacker against three-receiver sets. The box usually holds six.",
          "3-3-5 stack: three down linemen with three linebackers stacked right behind them. Lots of movement and blitzes, and it is hard to tell who is coming.",
          "Bear (46): the center and both guards are covered (3-0-3) with eight in the box. Inside runs die. The perimeter and quick passes are the answer.",
        ],
        diagram: play({ label: "Bear (46)", defenders: BEAR }),
      },
      {
        title: "Covered, uncovered, odd and even",
        points: [
          "A covered lineman has a defender on him. An uncovered lineman (a bubble) can double team or climb straight to a linebacker.",
          "Odd front: a nose head-up on the center (0 technique). Even front: nobody on the center, just shades and gaps.",
          "Before every snap, find the bubbles. That is where the doubles form and where inside runs want to hit.",
        ],
        diagram: play({ label: "3-4 Okie: bubbles over guards", defenders: OKIE, box: false }),
      },
    ],
    quiz: [
      { id: "f1q1", prompt: "Name this front.", options: ["4-3 Over", "4-3 Under", "3-4 Okie", "Bear (46)"], answer: 0, diagram: play({ label: "Name this front", defenders: mark(OVER, "3") }), why: "Four down linemen, the 3-technique (highlighted) set to the tight end side, a shade to the weak side, and the Sam off the ball over the tight end. That is the 4-3 Over." },
      { id: "f1q2", prompt: "Name this front.", options: ["4-3 Over", "4-3 Under", "Tite", "3-3-5 Stack"], answer: 1, diagram: play({ label: "Name this front", defenders: mark(UNDER, "3", "S") }), why: "The 3-technique moved to the weak side and the Sam walked up on the line over the tight end (both highlighted). That flip is the 4-3 Under." },
      { id: "f1q3", prompt: "Name this front.", options: ["4-3 Over", "3-4 Okie", "Tite", "3-3-5 Stack"], answer: 1, diagram: play({ label: "Name this front", defenders: mark(OKIE, "5", "0") }), why: "Three down linemen at 5-0-5: ends on the outside shoulders of the tackles and a nose on the center, with outside linebackers on the edges. 3-4 Okie." },
      { id: "f1q4", prompt: "Name this front.", options: ["Okie (5-0-5)", "Tite (4i-0-4i)", "Bear", "4-3 Under"], answer: 1, diagram: play({ label: "Name this front", defenders: mark(TITE, "4i") }), why: "The ends (highlighted) are on the inside shoulders of the tackles, 4i techniques, with a nose on the center. 4i-0-4i is the Tite front, built to choke inside runs." },
      { id: "f1q5", prompt: "In this 3-4 Okie, which offensive linemen are uncovered?", options: ["Both guards", "Both tackles", "The center", "Nobody"], answer: 0, diagram: play({ label: "3-4 Okie", defenders: mark(OKIE, "ILB") }), why: "The nose covers the center and the 5-techniques cover the tackles, so both guards have nobody on them. Those bubbles let the guards double or climb to the inside linebackers (highlighted) stacked behind them." },
      { id: "f1q6", prompt: "Name this front.", options: ["Bear (46)", "4-3 Over", "Tite", "Nickel 4-2-5"], answer: 0, diagram: play({ label: "Name this front", defenders: mark(BEAR, "3", "0") }), why: "The center and both guards are covered (3-0-3, highlighted) and eight defenders are in the box. That is the Bear, a run-stopping front that leaves the perimeter and quick game open." },
      { id: "f1q7", prompt: "Count the highlighted box defenders against your 6 blockers (5 linemen plus the TE).", options: ["5", "6", "7", "8"], answer: 1, diagram: play({ label: "Nickel 4-2-5", box: true, defenders: NICKEL.map((d) => ({ ...d, hl: d.l !== "N" })) }), why: "Four down linemen and two linebackers make six. The nickel back is outside the box over the slot. Six on six means you have a hat for every hat, which is a good run look." },
      { id: "f1q8", prompt: "A defender lines up head-up on the center (highlighted). That makes this:", options: ["An odd front", "An even front", "Impossible to tell", "A goal line front only"], answer: 0, diagram: play({ label: "Odd or even?", defenders: mark(TITE, "0") }), why: "A nose on the center (0 technique) means an odd front, like the 3-4 Okie or Tite. Even fronts leave the center uncovered and play shades and gaps." },
      { id: "f1q9", prompt: "The highlighted outside linebackers are why the 3-4 is tough on passing downs. Why?", options: ["They can rush or drop, so the fourth rusher can come from anywhere", "They always play man coverage", "They never rush", "They line up deep like safeties"], answer: 0, diagram: play({ label: "3-4 OLBs", defenders: mark(OKIE, "OLB") }), why: "The outside linebackers stand up on the edges. On any snap either one can rush or drop, and an inside linebacker can rush in their place. Protection has to identify the rushers after the snap, and that puts pressure on the RB." },
      { id: "f1q10", prompt: "In this 4-3 Under the right guard is uncovered. On inside zone right, who is he most likely climbing to?", options: ["The Mike linebacker", "The free safety", "The weak side end", "The corner"], answer: 0, diagram: play({ label: "4-3 Under", defenders: mark(UNDER, "M") }), why: "An uncovered guard helps on the shade, then climbs to the nearest second level threat. In the Under, the Mike (highlighted) sits right behind that bubble." },
      { id: "f1q11", prompt: "Name this front.", options: ["3-3-5 Stack", "4-3 Over", "Bear", "3-4 Okie"], answer: 0, diagram: play({ label: "Name this front", defenders: mark(STACK, "W", "M", "S") }), why: "Three down linemen with three linebackers stacked directly behind them (highlighted). The 3-3-5 stack hides who is rushing and is popular against spread teams." },
      { id: "f1q12", prompt: "Your offense comes out in 3 wide receivers (11 personnel). Most college defenses answer with:", options: ["Nickel: a 4-2-5 or 3-3-5", "Goal line 6-2", "Base 4-3 with three linebackers", "Bear (46)"], answer: 0, diagram: form({ set: "gun3", hl: "wr", label: "11 personnel" }), why: "Three receivers means a linebacker would have to cover a slot. Defenses swap that linebacker for a fifth defensive back, which is nickel. That usually leaves six in the box." },
    ],
  },

  // ======================================================== READING THE FRONT
  {
    id: "f2",
    tag: "",
    title: "Reading the Front",
    attr: "run",
    blurb: "Bubbles, 4i squeezes, slants, run blitzes and plus-one boxes. Turn the front into your cut.",
    lessons: [
      {
        title: "Run to the bubble",
        points: [
          "An uncovered lineman (bubble) means a double team can form next to him and someone climbs to a linebacker.",
          "Inside zone is happiest hitting near a bubble, behind a double team.",
          "Your read key is usually the first covered down lineman from the center to the play side.",
        ],
        diagram: play({ label: "Inside zone vs Okie", zone: "R", aim: "B-R", defenders: mark(OKIE, "5") }),
      },
      {
        title: "Tite and the 4i",
        points: [
          "4i techniques squeeze the B gaps from the inside. The inside zone lane you are used to closes fast.",
          "Answers: duo and power to kick or double the 4i, outside zone to get around him, or A gap cuts.",
          "Be patient. Against Tite the hole often shows up late.",
        ],
        diagram: play({ label: "Tite squeezes the B gaps", gap: "B-R", defenders: mark(TITE, "4i") }),
      },
      {
        title: "Slants and stunts",
        points: [
          "Defensive lines slant at the snap to wreck zone blocking.",
          "Slant into your play: the cutback opens behind it. Slant away: the front side lane opens.",
          "Linebackers often scrape over the top of a slant (run blitz). The lane they leave is your lane.",
        ],
        diagram: play({ label: "Slant into the play", zone: "R", aim: "B-R", defenders: FOUR_DOWN.map((d): Def => ({ ...d, hl: true, to: [d.x + 22, d.y + 4] as [number, number] })) }),
      },
      {
        title: "Plus-one and minus-one boxes",
        points: [
          "Count blockers vs box defenders. More blockers than defenders (+1) means run. Fewer (-1) means throw or check.",
          "Read plays make the QB a blocker. By reading an unblocked defender, the QB takes him out of the play without touching him.",
          "That is why zone read and RPOs exist: they fix the math against loaded boxes.",
        ],
      },
    ],
    quiz: [
      { id: "f2q1", prompt: "Inside zone against Tite. The 4i ends (highlighted) squeeze the B gaps. Where does this run usually hit?", options: ["Through a wide open B gap", "In the A gap, or bouncing outside the 4i", "Straight into the 4i", "A reverse"], answer: 1, diagram: play({ label: "Inside zone vs Tite", zone: "R", aim: "B-R", defenders: mark(TITE, "4i") }), why: "The 4i takes away the B gap from the inside. The run either cuts into the A gap behind the double on the nose or bounces outside the 4i when the tackle seals him in. Pressing the B gap gets you hit in the backfield." },
      { id: "f2q2", prompt: "At the snap the whole line slants right (arrows) on your inside zone right. Best cut?", options: ["Bang it front side right", "Cut back left behind the slant", "Bounce wider right", "Stop and wait"], answer: 1, diagram: play({ label: "Inside zone right", zone: "R", aim: "B-R", defenders: FOUR_DOWN.map((d): Def => ({ ...d, hl: true, to: [d.x + 22, d.y + 4] as [number, number] })).concat(mark([D(165, 156, "W"), D(205, 156, "M"), D(245, 156, "S")])) }), why: "The defense is flowing hard to the play side, so the front side is crowded. The backside lane opens behind the slant. Press, then cut back." },
      { id: "f2q3", prompt: "Now the line slants left (arrows), away from your inside zone right. Best cut?", options: ["Hit it front side right", "Cut back left into the slant", "Bounce left", "Reverse field"], answer: 0, diagram: play({ label: "Inside zone right", zone: "R", aim: "B-R", defenders: FOUR_DOWN.map((d): Def => ({ ...d, hl: true, to: [d.x - 22, d.y + 4] as [number, number] })).concat(mark([D(165, 156, "W"), D(205, 156, "M"), D(245, 156, "S")])) }), why: "The slant is moving defenders away from your aiming point. Linemen just keep them moving, and the front side lane opens. Cutting back runs straight into the slant." },
      { id: "f2q4", prompt: "An uncovered lineman (bubble) on a zone run usually:", options: ["Helps double team a down lineman, then climbs to a linebacker", "Pulls on every play", "Blocks the safety deep", "Stays home and blocks nobody"], answer: 0, diagram: play({ label: "3-4 Okie", zone: "R", aim: "B-R", defenders: mark(OKIE, "ILB") }), why: "With nobody on him, he combos with the lineman next to him. They move the down lineman, and one of them climbs to the linebacker (highlighted). That double team is where zone yards come from." },
      { id: "f2q5", prompt: "Zone read: the QB reads the highlighted end and nobody blocks him. Why leave him unblocked?", options: ["The QB's read takes him out of the play, so the offense gains a blocker (+1)", "The linemen missed him", "He is offside", "To protect the RB"], answer: 0, diagram: form({ set: "pistol", label: "Zone read", defenders: ZR_DEF(false), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run" }, { pts: [[200, 242], [158, 232], [124, 196]], kind: "motion" }] }), why: "If he chases the RB, the QB keeps. If he stays, the RB gets it. Either way he is wrong, and the line can use that extra blocker on a linebacker. That fixes a minus-one box." },
      { id: "f2q6", prompt: "The defense shows Bear: center and both guards covered, eight in the box. Best kind of run?", options: ["Inside zone into the A gaps", "Outside zone or toss to the perimeter", "QB sneak", "Trap"], answer: 1, diagram: play({ label: "Bear (46)", box: true, defenders: BEAR.map((d) => ({ ...d, hl: true })) }), why: "Bear jams every inside gap with a covered lineman. With three interior linemen covered there are no bubbles to double from. Get the ball outside, or throw quick." },
      { id: "f2q7", prompt: "The highlighted linebacker blitzes the B gap at the snap on your inside zone. What does that usually leave?", options: ["A cutback or bounce lane where he left", "Nothing, he is unblockable", "A safety in the hole", "An illegal formation"], answer: 0, diagram: play({ label: "Run blitz", zone: "R", aim: "B-R", defenders: [...FOUR_DOWN, D(165, 156, "W"), D(205, 156, "M"), D(245, 156, "S", true, [246, 196])] }), why: "A blitzing linebacker vacates his spot. If the line picks him up, the space he left is open. See it, and cut to where he came from." },
      { id: "f2q8", prompt: "In this 4-3 Under, which guard is uncovered?", options: ["Left guard", "Right guard", "Both", "Neither"], answer: 1, diagram: play({ label: "4-3 Under", defenders: UNDER }), why: "The 3-technique is on the left guard's outside shoulder and the 1-technique shades the center to the right. Nobody is on the right guard, so he is the bubble." },
      { id: "f2q9", prompt: "Inside zone right: the highlighted 3-technique gets washed outside by the guard. Your read says:", options: ["Hit it inside of him, front side", "Bounce outside him", "Cut all the way back", "Stop"], answer: 0, diagram: play({ label: "Inside zone right", zone: "R", aim: "B-R", defenders: [D(128, 184, "E"), D(190, 184), D(242, 184, "3", true, [262, 180]), D(272, 184, "E"), D(165, 156, "W"), D(215, 156, "M")] }), why: "When your read key gets pushed out, the lane opens inside him: bang it. When he fights back across the block, you bend it back. The read key moves, and you go the other way." },
      { id: "f2q10", prompt: "Why do defenses set their 3-technique and front strength toward the tight end?", options: ["To put strength where the offense has more blockers and is more likely to run", "It is random", "Because the tight end is a weak blocker", "The rules require it"], answer: 0, diagram: play({ label: "4-3 Over", defenders: mark(OVER, "3", "S") }), why: "The tight end side has an extra blocker and is the usual run strength. Defenses match it with their 3-technique and Sam. You learn their rule on film, then use formations and motion to stress it." },
    ],
  },

  // ======================================================== OPTION / RPO
  {
    id: "o1",
    tag: "",
    title: "Option, RPO and the Mesh",
    attr: "run",
    blurb: "Zone read, triple option, RPOs and mesh mechanics. The RB's job when the QB holds the decision.",
    lessons: [
      {
        title: "Zone read",
        points: [
          "The QB reads the backside end, who is left unblocked on purpose.",
          "If the end crashes on the RB, the QB keeps. If the end stays home on the QB, the RB gets it.",
          "Your job: the same path every time, a soft pocket, and let the QB decide. When he pulls it, carry out the fake hard.",
        ],
        diagram: form({ set: "pistol", label: "Zone read", defenders: ZR_DEF(false), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run" }, { pts: [[200, 242], [158, 232], [124, 196]], kind: "motion" }] }),
      },
      {
        title: "Triple option",
        points: [
          "From the flexbone: the fullback dive, the QB keep, and the pitch.",
          "The QB reads the first defender outside the guard (dive key). If he takes the dive, the QB pulls it and attacks the edge.",
          "Then the QB reads the next defender (pitch key): pitch if he takes the QB, keep if he takes the pitch.",
          "The pitch man keeps about 4 yards outside and 1 yard behind the QB.",
        ],
        diagram: form({ set: "flexbone", label: "Triple option", defense: "none", routes: [{ pts: [[200, 248], [225, 210], [228, 180]], kind: "run" }, { pts: [[200, 232], [250, 226], [300, 210]], kind: "motion" }, { pts: [[118, 222], [200, 240], [310, 236]], kind: "motion", hl: true }] }),
      },
      {
        title: "RPOs",
        points: [
          "Run-pass option: the line run blocks, and the QB reads a second level defender, often an overhang linebacker or the nickel.",
          "If he plays the run, the QB throws behind him (bubble, glance, slant). If he plays the pass, it is a handoff.",
          "RPOs only work if you sell the run at full speed every snap.",
        ],
      },
      {
        title: "Mesh mechanics",
        points: [
          "Inside arm up, a soft pocket, eyes on your aiming point.",
          "Do not clamp the ball until the QB leaves it. Grabbing early causes fumbles and kills the read.",
          "When the QB pulls it, keep running your track to hold the linebackers.",
        ],
      },
    ],
    quiz: [
      { id: "o1q1", prompt: "Zone read. The highlighted end crashes down on the RB (arrow). Who should get the ball?", options: ["The RB", "The QB keeps it", "Pitch to a receiver", "Throw it away"], answer: 1, diagram: form({ set: "pistol", label: "Zone read", defenders: ZR_DEF(true), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run" }] }), why: "The end committed to the RB, so the edge behind him is empty. The QB pulls it and runs where the end left. The RB carries out the fake to hold the linebackers." },
      { id: "o1q2", prompt: "Now the end sits and squeezes, staying home on the QB. Who gets it?", options: ["The RB", "The QB", "Nobody, it is a pass", "The tight end"], answer: 0, diagram: form({ set: "pistol", label: "Zone read", defenders: ZR_DEF(false), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run", hl: true }] }), why: "The end chose the QB, so he is not chasing the RB. Give. With him sitting backside, your cutback lane might be smaller, so stay on your track." },
      { id: "o1q3", prompt: "On zone read, the QB pulls it. What is your job?", options: ["Stop running", "Carry out the fake hard through the line", "Turn around and block the end", "Ask for the ball"], answer: 1, diagram: form({ set: "pistol", label: "Zone read: QB keep", defenders: ZR_DEF(true), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run", hl: true }, { pts: [[200, 242], [158, 232], [124, 196]], kind: "motion" }] }), why: "Linebackers read the RB. A hard fake freezes them for a beat, which is often the difference between a 5 yard keep and a 50 yard keep." },
      { id: "o1q4", prompt: "Triple option: the highlighted slotback is the pitch man. What relationship does he keep with the QB?", options: ["About 4 yards outside and 1 yard behind", "Right next to him", "5 yards in front", "Directly behind him"], answer: 0, diagram: form({ set: "flexbone", label: "Triple option", defense: "none", routes: [{ pts: [[200, 248], [225, 210], [228, 180]], kind: "run" }, { pts: [[200, 232], [250, 226], [300, 210]], kind: "motion" }, { pts: [[118, 222], [200, 240], [310, 236]], kind: "motion", hl: true }] }), why: "Four by one. Wide enough that one defender can't take both the QB and the pitch, and behind the QB so the pitch is a legal backward lateral." },
      { id: "o1q5", prompt: "The fullback dive reads the first down lineman outside the guard (the dive key). If he squeezes the dive:", options: ["The QB pulls it and attacks the edge", "The fullback keeps it anyway", "The QB throws deep", "Everyone stops"], answer: 0, diagram: form({ set: "flexbone", label: "Dive read", defenders: [D(186, 190), D(216, 190), D(250, 190, "DK", true, [232, 214]), D(290, 186, "PK"), D(165, 160, "W"), D(225, 160, "M"), D(200, 92, "F")], routes: [{ pts: [[200, 248], [225, 210], [228, 180]], kind: "run" }] }), why: "If the dive key takes the dive, the QB pulls and moves to the next read. That forces one defender to be wrong on every snap." },
      { id: "o1q6", prompt: "RPO: inside zone with a bubble screen tag. The overhang defender (highlighted) runs in to fit the run. The QB should:", options: ["Throw the bubble", "Hand it off anyway", "Keep it himself", "Spike it"], answer: 0, diagram: form({ set: "trips", label: "RPO", defenders: [D(150, 190), D(186, 190), D(216, 190), D(250, 190), D(180, 160, "W"), D(225, 160, "M"), D(300, 172, "OH", true, [262, 190]), D(200, 88, "F"), D(25, 180, "C"), D(378, 180, "C")], routes: [{ pts: [[170, 252], [215, 232], [230, 198], [230, 170]], kind: "run" }, { pts: [[302, 212], [330, 228], [360, 226]], hl: true }] }), why: "The overhang defender can't play both the run and the bubble. He chose the run, so the bubble is open behind him." },
      { id: "o1q7", prompt: "Why must the RB run every RPO at full speed, even when he might not get the ball?", options: ["The run fake is what pulls defenders in and makes the read work", "To get tired", "To block the QB", "It doesn't matter"], answer: 0, diagram: form({ set: "trips", label: "RPO", defense: "none", routes: [{ pts: [[170, 252], [215, 232], [230, 198], [230, 170]], kind: "run", hl: true }] }), why: "Defenders read your track. A lazy track means the conflict defender stays home and the read breaks." },
      { id: "o1q8", prompt: "At the mesh point you should:", options: ["Inside arm up, soft pocket, let the QB decide", "Grab the ball as soon as it touches you", "Run behind the QB", "Look the QB in the eyes"], answer: 0, diagram: form({ set: "pistol", label: "The mesh point", hl: "backs", defense: "none", routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run", hl: true }] }), why: "A soft pocket lets the QB ride and pull without a tug of war. Eyes go to your aiming point, not the ball." },
      { id: "o1q9", prompt: "The flexbone triple option is most associated with:", options: ["Service academies like Army, Navy and Air Force", "Air Raid teams", "NFL pro-style teams", "Teams that never run"], answer: 0, diagram: form({ set: "flexbone", label: "Flexbone", defense: "none", hl: "backs" }), why: "The academies have used the flexbone triple option for decades. It levels the playing field against bigger opponents with assignment football and misdirection." },
    ],
  },

  // ======================================================== PROTECTION
  {
    id: "p1",
    tag: "",
    title: "Protection Schemes and Blitz ID",
    attr: "pro",
    blurb: "Big on big, slide and half slide, finding the Mike, sugar looks, fire zones, sim pressure and hot routes.",
    lessons: [
      {
        title: "Big on big (BOB)",
        points: [
          "Linemen block the down linemen. The RB takes the first linebacker who comes, working inside-out.",
          "If nobody comes, check and release into your route.",
        ],
        diagram: play({ label: "Big on big", qbSet: true, defenders: [...FOUR_DOWN, D(170, 156, "W", true), D(225, 156, "M", true)] }),
      },
      {
        title: "Slide and half slide",
        points: [
          "Slide: the whole line zones one direction. The RB takes the first threat on the opposite side, usually off the edge.",
          "Half slide: one side blocks man, the other side slides. The RB fits into the man side.",
          "Know which way the line is going before the snap so you know which side is yours.",
        ],
        diagram: play({ label: "Slide left", qbSet: true, zone: "L", defenders: [...FOUR_DOWN, D(170, 156, "W"), D(225, 156, "M"), D(320, 178, "B", true, [300, 222])] }),
      },
      {
        title: "Find the Mike",
        points: [
          "The QB or center declares the Mike. Everything in the protection keys off him.",
          "If the QB re-declares, everything shifts. Listen and echo it.",
        ],
      },
      {
        title: "Blitz tells",
        points: [
          "Linebackers creeping under 4 yards. Safeties walking down late. Corners pressed with no safety help.",
          "Linebackers mugged in the A gaps (a sugar look). Defenders with their weight forward, or a lineman's hand turning white from pressure on the ground.",
        ],
        diagram: play({ label: "Sugar look", qbSet: true, defenders: [...FOUR_DOWN, D(186, 174, "A", true), D(214, 174, "A", true)] }),
      },
      {
        title: "Pressure families",
        points: [
          "Fire zone: five rush, three deep, three underneath.",
          "Sim pressure: four rush, but from unexpected spots. A lineman drops into coverage and a linebacker rushes.",
          "Cover 0: six or more rush with all-out man behind. Answer with hot routes and quick throws.",
        ],
      },
    ],
    quiz: [
      { id: "p1q1", prompt: "Big on big: the line takes the four down linemen. Who is yours?", options: ["The first linebacker to come, checking inside-out", "The corner", "The deep safety", "The defensive end"], answer: 0, diagram: play({ label: "Big on big", qbSet: true, defenders: [...FOUR_DOWN, D(170, 156, "W", true), D(225, 156, "M", true)] }), why: "Linemen have the big guys, so the backers (highlighted) belong to you. Check the most dangerous, inside-out. If neither comes, release." },
      { id: "p1q2", prompt: "The line slides left (arrows). Which side are you responsible for?", options: ["The right side: the first threat outside the right tackle", "The left side", "Nothing, release immediately", "The nose"], answer: 0, diagram: play({ label: "Slide left", qbSet: true, zone: "L", defenders: [...FOUR_DOWN, D(170, 156, "W"), D(225, 156, "M"), D(320, 178, "B", true, [300, 222])] }), why: "When the line slides away, the opposite edge is man to man and short a blocker. That edge rusher (highlighted) is yours." },
      { id: "p1q3", prompt: "Both linebackers walk up into the A gaps (highlighted). This look is called:", options: ["A double A gap or sugar look: pressure is likely", "Prevent", "Cover 2", "Goal line"], answer: 0, diagram: play({ label: "Pre-snap look", qbSet: true, defenders: [...FOUR_DOWN, D(186, 174, "A", true), D(214, 174, "A", true)] }), why: "Mugging both A gaps threatens the shortest path to the QB. One or both may come, or they may bluff and drop. Protection has to account for both." },
      { id: "p1q4", prompt: "Against a sugar look, if both A gap players rush, who do you take?", options: ["The A gap rusher the line doesn't take, inside-out", "The corner", "Release immediately", "The widest rusher"], answer: 0, diagram: play({ label: "Both A gaps rush", qbSet: true, defenders: [...FOUR_DOWN, D(186, 174, "A", true, [194, 214]), D(214, 174, "A", true, [210, 214])] }), why: "The center can only take one. The RB has to step up and take the other A gap threat. That inside pressure gets home fastest." },
      { id: "p1q5", prompt: "Five rush, three deep and three underneath. Which pressure family is that?", options: ["Fire zone", "Cover 0", "Prevent", "Tampa 2"], answer: 0, diagram: { kind: "coverage", id: "c3", view: "post" }, why: "A fire zone sends five and plays three-deep, three-under zone behind it. The hot throw is usually into the area a rusher vacated." },
      { id: "p1q6", prompt: "Four rush, but the highlighted end drops into coverage and a linebacker rushes instead (arrows). That is:", options: ["Simulated (sim) pressure", "Cover 0", "A run blitz", "Max protect"], answer: 0, diagram: play({ label: "Pre-snap to post-snap", qbSet: true, defenders: [D(128, 184, "E", true, [110, 150]), D(188, 184), D(242, 184), D(272, 184), D(170, 156, "W", true, [160, 214]), D(225, 156, "M")] }), why: "Sim pressure only rushes four, but it confuses protection about who those four are. Stay disciplined to your rules and take the rusher who comes." },
      { id: "p1q7", prompt: "Cover 0 blitz: more rushers than blockers. What beats it?", options: ["Hot routes and quick throws: get the ball out", "A seven step deep drop", "Running a draw every time", "Nothing"], answer: 0, diagram: { kind: "coverage", id: "c0", view: "post" }, why: "Someone is unblocked, so the ball has to come out before he gets there. With no safety help, one missed tackle after a quick catch can be a touchdown." },
      { id: "p1q8", prompt: "Two defenders creep toward the line before the snap (arrows). As the RB you:", options: ["Alert the QB and be ready to pick up the inside one", "Ignore it", "Leave early for your route", "Move out to receiver"], answer: 0, diagram: play({ label: "Creep", qbSet: true, defenders: [...FOUR_DOWN, D(205, 156, "M", true, [208, 174]), D(270, 120, "S", true, [262, 160])] }), why: "Creeping defenders are a classic blitz tell. Communicate it, then let your rules tell you who is yours." },
      { id: "p1q9", prompt: "Nobody blitzes, but the end is beating the right tackle badly. Before releasing, you:", options: ["Chip the end on your way out, then release", "Run your route without looking", "Stay in and block nobody", "Hold the end for the whole play"], answer: 0, diagram: play({ label: "Chip and release", qbSet: true, defenders: [D(128, 184), D(188, 184), D(242, 184), D(282, 196, "E", true, [262, 230])] }), why: "A chip helps the tackle without giving up your route. Hit him with a shoulder on the way, then get into your route to give the QB an outlet." },
      { id: "p1q10", prompt: "Why does the protection start with identifying the Mike?", options: ["It tells every blocker who is theirs and which side the RB has", "Tradition", "The Mike always blitzes", "The refs require it"], answer: 0, diagram: play({ label: "Mike ID: everyone counts from him", qbSet: true, defenders: [...FOUR_DOWN, D(170, 156, "W"), D(225, 156, "M", true), D(300, 170, "S")] }), why: "The Mike ID sets the count. Linemen and the back count from him, so a wrong ID means a free rusher." },
    ],
  },

  // ======================================================== OFFENSIVE SYSTEMS
  {
    id: "s1",
    tag: "",
    title: "Offensive Systems",
    attr: "scheme",
    blurb: "Air Raid, spread option and RPO, pro-style, power run, wide zone, West Coast and the triple option.",
    lessons: [
      {
        title: "Air Raid",
        points: [
          "Roots: Hal Mumme and Mike Leach. Shotgun, 10 or 11 personnel, wide line splits, 2x2 and 3x1 sets.",
          "A small playbook repped constantly: Mesh, Y-Cross, Four Verts, Shallow, Stick.",
          "Run game: inside zone, draws and screens. The RB is a pass protector and a check-down weapon first.",
        ],
        diagram: form({ set: "4wr", label: "Air Raid: Mesh", defense: "none", routes: MESH }),
      },
      {
        title: "Spread option and RPO",
        points: [
          "Shotgun or pistol with the QB as a runner: zone read, QB power, RPOs, often at tempo.",
          "The RB needs mesh discipline, a consistent track and perimeter speed.",
        ],
        diagram: form({ set: "pistol", label: "Spread option", defense: "none", routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run" }, { pts: [[200, 242], [158, 232], [124, 196]], kind: "motion" }] }),
      },
      {
        title: "Pro-style and West Coast",
        points: [
          "Pro-style: under center and shotgun, multiple personnel (11, 12, 21), play-action and a full route tree. Built to look like an NFL offense.",
          "West Coast: short, timed passes used like an extension of the run game. Backs catch a lot of passes.",
          "The RB has to do it all: every run scheme, full protection and real routes.",
        ],
      },
      {
        title: "Power run and gap teams",
        points: [
          "Think Wisconsin, Iowa and Stanford's teams of the 2010s. 12, 13, 21 and 22 personnel, fullbacks, power, counter, duo and iso, plus play-action and boots off it.",
          "The RB is a downhill runner who reads pullers and finishes through contact.",
        ],
        diagram: form({ set: "i", label: "Power from I-form", routes: [{ pts: [[170, 216], [170, 226], [268, 226], [268, 194]], kind: "pull", hl: true }, { pts: [[200, 246], [240, 232], [252, 198], [252, 168]], kind: "pull" }, { pts: [[200, 270], [235, 246], [250, 198], [250, 172]], kind: "run" }] }),
      },
      {
        title: "Wide zone and the triple option",
        points: [
          "Wide zone (the Shanahan tree): outside zone as the base run, with bootlegs and play-action that look identical. The RB is a one-cut runner.",
          "Triple option (flexbone): dive, keep, pitch, with assignment football and misdirection.",
          "Wing-T: buck sweep, trap, motion and misdirection. Common in high school.",
        ],
      },
    ],
    quiz: [
      { id: "s1q1", prompt: "Shotgun, four wide, two receivers crossing shallow (highlighted). This is the signature play of which system?", options: ["Air Raid (Mesh)", "Triple option", "Power run", "Wing-T"], answer: 0, diagram: form({ set: "4wr", label: "Name the system", defense: "none", routes: MESH }), why: "Two shallow crossers rubbing past each other is Mesh, the Air Raid's signature concept. The RB is usually in the flat or checking the protection." },
      { id: "s1q2", prompt: "I-form, a fullback leading, the guard pulling (highlighted). Which kind of offense lives on this?", options: ["Power run / gap scheme", "Air Raid", "Run and shoot", "Empty spread"], answer: 0, diagram: form({ set: "i", label: "Name the system", routes: [{ pts: [[170, 216], [170, 226], [268, 226], [268, 194]], kind: "pull", hl: true }, { pts: [[200, 246], [240, 232], [252, 198], [252, 168]], kind: "pull" }, { pts: [[200, 270], [235, 246], [250, 198], [250, 172]], kind: "run" }] }), why: "A fullback, an I-back and a pulling guard: that is power football. Wisconsin and Iowa built whole identities on it." },
      { id: "s1q3", prompt: "Pistol, the QB reading the end, the RB on the mesh. Which system?", options: ["Spread option / zone read", "West Coast", "Air Raid pass only", "Wing-T"], answer: 0, diagram: form({ set: "pistol", label: "Name the system", defenders: ZR_DEF(false), routes: [{ pts: [[200, 262], [232, 238], [245, 198], [245, 170]], kind: "run" }, { pts: [[200, 242], [158, 232], [124, 196]], kind: "motion" }] }), why: "The QB is a run threat reading an unblocked defender. That is the core of spread option football." },
      { id: "s1q4", prompt: "Two slotbacks off the tackles and a fullback behind the QB (highlighted). Which system?", options: ["Triple option (flexbone)", "Air Raid", "Pro-style", "Run and shoot"], answer: 0, diagram: form({ set: "flexbone", label: "Name the system", defense: "none", hl: "backs" }), why: "The flexbone puts a fullback and two slotbacks around the QB to run the dive, the keep and the pitch, plus counters and play-action." },
      { id: "s1q5", prompt: "In the Air Raid, what does the RB do most?", options: ["Pass pro, check-release routes, draws and inside zone", "Lead block every play", "Run triple option pitches", "Line up at tight end"], answer: 0, diagram: form({ set: "4wr", label: "Air Raid", defense: "none", hl: "backs" }), why: "Air Raid backs protect, catch and punish light boxes with draws and zone. A back who can't pass block doesn't see the field in these offenses." },
      { id: "s1q6", prompt: "All four receivers run vertical (highlighted). Name the concept.", options: ["Four Verts", "Mesh", "Power", "Stick"], answer: 0, diagram: form({ set: "4wr", label: "Name the concept", defense: "none", routes: VERTS }), why: "Four verticals stretch the deep coverage. Against Cover 3, the seams attack the lone middle safety. The RB checks protection, then becomes the check-down." },
      { id: "s1q7", prompt: "The highlighted inside receiver runs a deep cross across the field. Name the Air Raid concept.", options: ["Y-Cross", "Mesh", "Four Verts", "Screen"], answer: 0, diagram: form({ set: "gun3", label: "Name the concept", defense: "none", routes: [{ pts: [[288, 208], [270, 176], [90, 118]], hl: true }, { pts: [[25, 207], [25, 80]] }, { pts: [[375, 207], [375, 140], [330, 140]] }, { pts: [[330, 210], [330, 150]] }, { pts: [[230, 252], [150, 236], [110, 232]] }] }), why: "Y-Cross sends the Y (inside receiver or TE) on a deep crossing route with a go and a curl to clear space. The RB swings to the other side as the outlet." },
      { id: "s1q8", prompt: "Outside zone with a bootleg off of it (QB going the other way) is the heart of which system?", options: ["Wide zone (Shanahan tree)", "Triple option", "Air Raid", "Wing-T"], answer: 0, diagram: form({ set: "11", label: "Name the system", routes: [{ pts: [[200, 262], [260, 248], [320, 206], [330, 170]], kind: "run" }, { pts: [[200, 234], [170, 250], [110, 236]], kind: "motion", hl: true }] }), why: "Outside zone stretches the defense one way, and the bootleg comes back the other way looking exactly the same. One-cut running is the RB's whole identity here." },
      { id: "s1q9", prompt: "Power run teams favor which personnel?", options: ["12, 13, 21 and 22: more tight ends and backs", "10 personnel: four receivers", "Empty only", "Five receiver sets"], answer: 0, diagram: form({ set: "2te", label: "12 personnel", hl: "te" }), why: "Extra tight ends and fullbacks add gap blockers and let the offense run at a defense with numbers." },
      { id: "s1q10", prompt: "A spread team snaps the ball every 12 seconds without huddling. What is that for?", options: ["Tempo: it keeps the defense from subbing and disguising", "To waste time", "League rules", "To confuse its own players"], answer: 0, diagram: form({ set: "gun3", label: "No huddle tempo" }), why: "Tempo freezes the defense in its personnel and simple calls. As the RB you need your assignment and your protection before the defense has its call in." },
      { id: "s1q11", prompt: "Which best describes a pro-style offense?", options: ["Multiple personnel, under center and shotgun, play-action and a full route tree", "Only the triple option", "Only four wide receiver sets", "Never uses a tight end"], answer: 0, diagram: form({ set: "i", label: "Pro-style", hl: "backs" }), why: "Pro-style offenses are multiple. The RB has to run zone and gap, protect, and run real routes. That is why they prepare backs for the NFL." },
      { id: "s1q12", prompt: "You commit to an Air Raid program. What should you sharpen most?", options: ["Pass protection, catching out of the backfield, and draw and zone reads", "Fullback lead blocking", "Option pitch timing", "Punting"], answer: 0, diagram: form({ set: "4wr", label: "Air Raid back", hl: "backs", defense: "none", routes: [{ pts: [[230, 252], [232, 226], [300, 222], [340, 210]], hl: true }] }), why: "That is what Air Raid backs do every snap. Prove you can pick up the blitz and catch the check-down, and you will play." },
    ],
  },

  // ======================================================== PERSONNEL & FORMATIONS
  {
    id: "s2",
    tag: "",
    title: "Personnel and Formations",
    attr: "scheme",
    blurb: "10, 11, 12, 21, 22 personnel. Shotgun, pistol, I-form, trips, empty. What each one tells the defense.",
    lessons: [
      {
        title: "Personnel numbers",
        points: [
          "Two digits: the first is the number of running backs, the second the number of tight ends. Receivers are 5 minus both.",
          "11 = 1 RB, 1 TE, 3 WR (the most common in college). 12 = 1 RB, 2 TE, 2 WR. 21 = 2 RB, 1 TE, 2 WR.",
          "10 = 1 RB, 4 WR. 22 = 2 RB, 2 TE, 1 WR. 13 = 1 RB, 3 TE, 1 WR. 00 = empty, five receivers.",
        ],
        diagram: form({ set: "11", label: "11 personnel", hl: "te", defense: "none" }),
      },
      {
        title: "Formations",
        points: [
          "Backfield: under center, shotgun, pistol (RB directly behind a QB about 4 yards deep), I-form (fullback in front of the RB), offset I, split backs.",
          "Receivers: 2x2, 3x1 (trips), 3x2 empty, bunch and stack, wing.",
        ],
        diagram: form({ set: "trips", label: "Trips (3x1)", hl: "wr", defense: "none" }),
      },
      {
        title: "How defenses match personnel",
        points: [
          "21, 22 and 12: base defense (4-3 or 3-4).",
          "11: nickel (5 DBs). 10: dime (6 DBs). 13 and 22 at the goal line: heavy or goal line defense.",
          "Mismatch: heavy personnel against nickel means run. Spread personnel against base means throw at linebackers.",
        ],
      },
      {
        title: "Formation tendencies",
        points: [
          "The tight end side is usually the run strength. Trips is usually the passing strength.",
          "Empty means pass, quick game or QB draw. Heavy means run or play-action.",
          "Backs who always align to the run side tip the play. Good offenses flip on purpose.",
        ],
      },
    ],
    quiz: [
      { id: "s2q1", prompt: "What personnel is this (tight ends highlighted)?", options: ["12: 1 RB, 2 TE, 2 WR", "21: 2 RB, 1 TE, 2 WR", "11: 1 RB, 1 TE, 3 WR", "02: 0 RB, 2 TE, 3 WR"], answer: 0, diagram: form({ set: "2te", label: "Count the personnel", hl: "te", defense: "none" }), why: "One back, two tight ends, two receivers. First digit backs, second digit tight ends: 12." },
      { id: "s2q2", prompt: "Count the personnel: two backs (highlighted) and one tight end.", options: ["21 personnel", "11 personnel", "12 personnel", "10 personnel"], answer: 0, diagram: form({ set: "i", label: "Count the personnel", hl: "backs", defense: "none" }), why: "Two backs (fullback and tailback), one tight end, two receivers: 21. The classic I-form look." },
      { id: "s2q3", prompt: "What personnel is this?", options: ["10 personnel", "11 personnel", "12 personnel", "20 personnel"], answer: 0, diagram: form({ set: "4wr", label: "Count the personnel", hl: "wr", defense: "none" }), why: "One back beside the QB, no tight end, four receivers: 10 personnel, a staple of Air Raid and spread teams." },
      { id: "s2q4", prompt: "The RB lines up wide (highlighted) and nobody is left in the backfield. This formation is:", options: ["Empty", "I-form", "Pistol", "Ace"], answer: 0, diagram: form({ set: "empty", label: "Name the formation", hl: "backs", defense: "none" }), why: "Five eligible receivers spread out, nobody in the backfield but the QB. Empty forces the defense to show its coverage, but leaves only five blockers." },
      { id: "s2q5", prompt: "Three receivers to one side (highlighted), one to the other. Name the formation.", options: ["Trips (3x1)", "Bunch", "Twins", "Pro set"], answer: 0, diagram: form({ set: "trips", label: "Name the formation", hl: "wr", defense: "none" }), why: "Three to one side is trips. It overloads one side of the coverage and often sets the passing strength." },
      { id: "s2q6", prompt: "Offense shows 10 personnel (four receivers). The defense most likely matches with:", options: ["Dime: six defensive backs", "Goal line", "Base 4-3", "Bear"], answer: 0, diagram: form({ set: "4wr", label: "10 personnel", hl: "wr" }), why: "Four receivers means four players need covering beyond the corners. Defenses go to dime (six DBs), which leaves a light box for draws." },
      { id: "s2q7", prompt: "Which side is this formation's strength?", options: ["The tight end side (right)", "The single receiver side (left)", "Neither", "Wherever the QB is"], answer: 0, diagram: form({ set: "11", label: "Find the strength", hl: "te", defense: "none" }), why: "The tight end adds a blocker, so that side is the run strength. Defenses usually set their front to it." },
      { id: "s2q8", prompt: "The RB lines up directly behind a QB who is about 4 yards off the ball (highlighted). Formation?", options: ["Pistol", "Shotgun", "I-form", "Wildcat"], answer: 0, diagram: form({ set: "pistol", label: "Name the formation", hl: "backs", defense: "none" }), why: "Pistol puts the RB behind the QB instead of beside him. The run can go either way without the alignment tipping it off." },
      { id: "s2q9", prompt: "Why do good offenses flip the RB from one side of the QB to the other on purpose?", options: ["So the defense can't read the run direction from the alignment", "It doesn't matter", "League rules", "The RB has a favorite side"], answer: 0, diagram: form({ set: "gun3", label: "Offset back", hl: "backs", defense: "none" }), why: "In the gun, many runs go away from the back's alignment. Defenses study it. Flipping it, and running both ways from both sides, removes the tell." },
      { id: "s2q10", prompt: "Empty (no backs) most often signals:", options: ["A pass, quick game or QB draw", "Power run", "A goal line sneak", "A punt"], answer: 0, diagram: form({ set: "empty", label: "Empty", hl: "qb" }), why: "With nobody in the backfield, the QB is the only runner. Expect quick throws, or a QB draw against a light box." },
      { id: "s2q11", prompt: "22 personnel means:", options: ["2 RB, 2 TE, 1 WR", "2 WR, 2 TE, 1 RB", "2 RB, 2 WR, 1 TE", "No backs"], answer: 0, diagram: form({ set: "22", label: "Heavy personnel", hl: "backs", defense: "none" }), why: "First digit backs, second digit tight ends: two backs, two tight ends, and one receiver. A heavy short yardage and goal line package." },
    ],
  },

  // ======================================================== PRE-SNAP CHECKLIST
  {
    id: "c1",
    tag: "",
    title: "The D1 Pre-Snap Checklist",
    attr: "sit",
    blurb: "Everything a D1 back scans before the ball is snapped, in order, and what to do with it.",
    lessons: [
      {
        title: "The checklist, in order",
        points: [
          "1. Situation: down, distance, field position, clock. What is the defense afraid of?",
          "2. Personnel and formation: what did the defense match with (base, nickel, dime)?",
          "3. Front: odd or even? Where is the 3-technique? Which linemen are uncovered?",
          "4. Box count vs blockers: plus one or minus one?",
          "5. Safeties: one high or two high? How deep? Any rotation tells?",
          "6. Linebackers: depth and alignment. Creeping or walked out over a slot?",
          "7. Blitz tells and the Mike. Who is yours if they come?",
          "8. Your job: alignment, aiming point, read key, protection, route, hot route.",
          "9. After the snap: confirm the rotation, then trust it.",
        ],
      },
      {
        title: "Alignment and depth",
        points: [
          "I-back around 7 yards, pistol about 3 yards behind the QB, shotgun beside the QB.",
          "Same alignment and depth on runs and passes. Cheating up for a pass or back for a run tips the play.",
        ],
      },
      {
        title: "Communication",
        points: [
          "Echo the Mike ID and any checks. Alert the QB to pressure you see. Know your hot signal.",
          "Coaches trust backs who talk. It is part of how you earn third down snaps.",
        ],
      },
      {
        title: "What to watch on film",
        points: [
          "Defensive line shifts right before the snap. Linebacker eyes and depth on 3rd down. DB depth and leverage by down.",
          "Write down a defense's top three tendencies by situation before every game.",
        ],
      },
    ],
    quiz: [
      { id: "c1q1", prompt: "What comes first in a good pre-snap routine?", options: ["The situation: down, distance, field position, clock", "Looking at the sideline", "Your route", "Staring at the QB"], answer: 0, situation: { down: "3rd & 7", ball: "Own 42", score: "Down 3", clock: "Q3 5:10", hl: ["down", "ball", "score", "clock"] }, why: "The situation tells you what the defense is likely playing and what your offense needs. Everything else in the scan builds on it." },
      { id: "c1q2", prompt: "Single high, seven in the box (highlighted) against your six blockers. What do you expect?", options: ["A loaded box: a check or a tougher run, and probably man coverage", "A wide open run", "Prevent defense", "Cover 2"], answer: 0, diagram: form({ set: "11", label: "Count the box", box: true, safety: "one" }), why: "Minus one in the box means someone is unblocked on a run. Single high often pairs with man coverage, so be ready for a check to a pass, or a run away from the extra man." },
      { id: "c1q3", prompt: "Both linebackers are only about 3 yards off the ball (highlighted). That usually means:", options: ["Pressure or a run blitz is coming", "They are dropping to deep zones", "They don't care", "They are confused"], answer: 0, diagram: play({ label: "Linebacker depth", qbSet: true, defenders: [...FOUR_DOWN, D(170, 172, "W", true), D(230, 172, "M", true)] }), why: "Normal linebacker depth is around 5 yards. Creeping closer shortens their path to the line. Expect a blitz and know your pickup." },
      { id: "c1q4", prompt: "A linebacker walks out over your slot receiver (highlighted). What does that do to the box?", options: ["Lightens it: fewer run defenders inside", "Adds a run defender", "Nothing", "It means Cover 0"], answer: 0, diagram: form({ set: "gun3", label: "Box count", defenders: [D(150, 190), D(186, 190), D(216, 190), D(250, 190), D(200, 160, "M"), D(325, 176, "W", true), D(120, 88, "S"), D(280, 88, "S"), D(25, 180, "C"), D(375, 180, "C")] }), why: "Every defender who leaves the box to cover a receiver is one less run fitter. A light box is a green light for the run." },
      { id: "c1q5", prompt: "Two high before the snap, then a safety drops down at the snap (arrows). After the snap, treat it as:", options: ["Single high with an extra box defender", "Still two high", "Prevent", "Nothing changed"], answer: 0, diagram: { kind: "coverage", id: "c2", view: "pre", rotate: true }, why: "The post-snap picture is the truth. The rotated safety becomes a run defender or a robber. Adjust your read: the box just got heavier." },
      { id: "c1q6", prompt: "Why should your alignment and depth look the same on runs and passes?", options: ["Changing depth tips the play to the defense", "It looks better", "Coaches don't care", "To confuse your QB"], answer: 0, diagram: form({ set: "pistol", label: "Alignment", hl: "backs", defense: "none" }), why: "Linebackers study backfield alignment on film. Tiny cheats, like creeping closer on runs, are tells they will exploit." },
      { id: "c1q7", prompt: "Your offense subs into 21 personnel (two backs, highlighted) and the defense stays in nickel. What is the edge?", options: ["Run it: a heavier offense against a lighter defense", "Throw deep only", "No edge", "Punt"], answer: 0, diagram: form({ set: "i", label: "21 vs nickel", hl: "backs", defenders: SPREAD_DEF }), why: "Two backs and a tight end add gap blockers against a defense built to cover receivers. That is a run mismatch." },
      { id: "c1q8", prompt: "The QB points and declares the Mike. What does that change for you?", options: ["It sets the protection: your blocking assignment counts from that Mike", "Nothing", "You run a different route", "You switch sides"], answer: 0, diagram: play({ label: "Mike ID", qbSet: true, defenders: [...FOUR_DOWN, D(170, 156, "W"), D(225, 156, "M", true)] }), why: "The Mike ID defines who each blocker counts. If the QB moves it, your assignment moves with it." },
      { id: "c1q9", prompt: "More rushers than blockers, and you are the hot receiver. You:", options: ["Get your eyes to the QB fast and run the hot route", "Stay in and block", "Run deep", "Wait to see"], answer: 0, diagram: { kind: "coverage", id: "c0", view: "post" }, why: "The free rusher means the ball comes out now. Turn your eyes early. A late hot route is a sack." },
      { id: "c1q10", prompt: "3rd and 9: safeties at 15 yards and corners soft at 8. Where are the yards?", options: ["Underneath: check-downs and draws have room", "Deep shots only", "Nowhere", "A sweep"], answer: 0, situation: { down: "3rd & 9", ball: "Own 35", score: "Tied 17-17", clock: "Q4 8:20", hl: ["down"] }, diagram: { kind: "coverage", id: "c4", view: "pre" }, why: "A deep, soft shell gives up underneath to keep everything in front. A draw or a check-down with yards after the catch can move the chains." },
      { id: "c1q11", prompt: "You read a Tite front (4i-0-4i) with two high safeties. Best run idea?", options: ["Get outside the 4i: outside zone or a perimeter run", "Inside zone straight into the 4i", "A QB sneak", "Trap the nose"], answer: 0, diagram: play({ label: "Tite front", defenders: mark(TITE, "4i").concat([D(150, 118, "S"), D(260, 118, "S")]) }), why: "Tite takes away the B gaps. With two high safeties the box is lighter, so stretch it outside where the 4i can't play both." },
      { id: "c1q12", prompt: "After the snap, the first thing you confirm is:", options: ["Did the safeties rotate? Is the box what I expected?", "The crowd", "The scoreboard", "The QB's helmet"], answer: 0, diagram: { kind: "coverage", id: "c2", view: "pre", rotate: true }, why: "Disguise is everywhere at the college level. Confirm the post-snap picture in the first step, then play fast." },
    ],
  },
];

/** Season order: the new weeks slot in where they build on earlier ones. */
export const SEASON_ORDER = ["w1", "f1", "w2", "w3", "f2", "o1", "w4", "p1", "w5", "s1", "s2", "c1", "w6", "w7"];
export const PHASES: { from: number; title: string }[] = [
  { from: 0, title: "Fall Camp: the fundamentals" },
  { from: 5, title: "Film Room: schemes and protections" },
  { from: 11, title: "Game Week: the full picture" },
];
