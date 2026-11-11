import { LESSON_VISUALS, QUIZ_VISUALS } from "./visuals";

export type CoverageId ="c0" | "c1" | "c2" | "c2m" | "t2" | "c3" | "c4" | "c6";
export type Attr = "gap" | "run" | "cov" | "pro" | "sit";

export interface Situation {
  down: string;
  ball: string;
  score: string;
  clock: string;
  extra?: string;
  /** Scoreboard cells to highlight: what the question hinges on. */
  hl?: ("down" | "ball" | "score" | "clock")[];
}

/** A defender on a line diagram. hl = highlighted, to = movement arrow, man = dashed man-coverage line to the RB. */
export interface Def {
  x: number;
  y: number;
  l?: string;
  hl?: boolean;
  to?: [number, number];
  man?: boolean;
}

export type Diagram =
  | {
      kind: "coverage";
      id: CoverageId;
      view: "pre" | "post";
      /** Slot receiver motions across, a linebacker travels with him. */
      motion?: boolean;
      /** Draw a trips (3x1) receiver set instead of 2x2. */
      trips?: boolean;
      /** Show a two-high safety rotating down at the snap. */
      rotate?: boolean;
    }
  | { kind: "gap"; gap: string; label?: string }
  | {
      kind: "formation";
      /** Offensive set: 12 personnel, goal line, 4 wide, shotgun 3 wide, 11 personnel under center. */
      set: "2te" | "goal" | "4wr" | "gun3" | "11";
      /** Which offensive players to highlight. */
      hl?: "te" | "wr" | "backs";
      /** Shade and highlight the box defenders. */
      box?: boolean;
      /** Safety picture: two high, one high, or one high safety rolling into the box. */
      safety?: "two" | "one" | "down";
      /** Defensive ends rushing hard upfield. */
      rush?: boolean;
    }
  | {
      kind: "play";
      label?: string;
      /** Highlighted gap, e.g. "B-R". */
      gap?: string;
      /** RB path ends at this gap. */
      aim?: string;
      /** Override the aiming point x coordinate (draws a target). */
      target?: number;
      /** Special RB paths. */
      path?: "zone" | "press-cut" | "dance" | "sideline";
      /** All linemen step this way (zone arrows). */
      zone?: "L" | "R";
      /** Pulling linemen: index 0..5 = LT, LG, C, RG, RT, TE, pulling to x. */
      pullers?: { from: number; to: number }[];
      /** Double teams by lineman index pairs. */
      doubles?: [number, number][];
      /** Counter step drawn on the RB path. */
      counter?: boolean;
      /** Dashed pitch line from QB to RB. */
      pitch?: boolean;
      /** Shade the box. */
      box?: boolean;
      /** RB stays in to protect (shotgun set beside QB). */
      qbSet?: boolean;
      /** Fullback lead blocker (iso). */
      lead?: boolean;
      /** Draw action: line pass sets, QB drops, delayed handoff. */
      draw?: boolean;
      /** Draw technique numbers above the line. */
      techs?: boolean;
      defenders?: Def[];
    };

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  diagram?: Diagram;
  situation?: Situation;
}

export interface Lesson {
  title: string;
  points: string[];
  diagram?: Diagram;
}

export interface Week {
  id: string;
  tag: string;
  title: string;
  attr: Attr;
  blurb: string;
  lessons: Lesson[];
  quiz: Question[];
}

export const ATTRS: { id: Attr; label: string }[] = [
  { id: "gap", label: "Gap Knowledge" },
  { id: "run", label: "Run Reads" },
  { id: "pro", label: "Pass Pro" },
  { id: "cov", label: "Coverage ID" },
  { id: "sit", label: "Situational IQ" },
];

export interface CoverageInfo {
  id: CoverageId;
  name: string;
  shell: string;
  tells: string[];
  strong: string;
  weak: string;
  calledWhen: string;
  rb: string;
}

export const COVERAGES: CoverageInfo[] = [
  {
    id: "c0",
    name: "Cover 0",
    shell: "Zero deep safeties, all-out man with a blitz",
    tells: ["No safety deeper than 8 yards", "Corners pressed with no help over the top", "Extra defenders walked up into the box or the A gaps"],
    strong: "Gets more rushers than you can block. Kills slow-developing plays.",
    weak: "One missed tackle or one beaten corner is a touchdown. Quick throws and hot routes punish it.",
    calledWhen: "Goal line, 3rd and short, 4th down, or when the defense wants to force a fast decision.",
    rb: "Every free rusher is a sack. Find the most dangerous inside blitzer and pick him up, or run your hot route right now.",
  },
  {
    id: "c1",
    name: "Cover 1",
    shell: "One deep safety in the middle (single high), man coverage underneath",
    tells: ["One safety deep in the middle of the field", "The other safety rolled down into the box", "Corners in press or tight off coverage, eyes on receivers"],
    strong: "Eight-man front against the run, tight coverage on every receiver, one free player (robber or rusher).",
    weak: "Rub and crossing routes, a mismatch on a linebacker covering the RB, and outside runs once the box is outnumbered on one side.",
    calledWhen: "Run downs, short yardage, red zone, and against offenses that love the run.",
    rb: "Expect a loaded box. A linebacker is probably manned up on you, so your option and angle routes win. On runs, there may be one more defender than blockers: press the hole and make the free hitter miss.",
  },
  {
    id: "c2",
    name: "Cover 2",
    shell: "Two deep safeties splitting the field in halves, five underneath zones",
    tells: ["Two safeties at 10 to 13 yards, outside the hashes", "Corners shallow and squatting at about 5 yards, inside leverage", "Corners funnel receivers inside"],
    strong: "Takes away short outside throws and the deep ball over the top. Corners force runs back inside.",
    weak: "The middle of the field between the safeties, the hole shot down the sideline between corner and safety, and a lighter box for the run.",
    calledWhen: "2nd or 3rd and medium to long, end of half, and against teams that throw quick outs.",
    rb: "The box is lighter (usually six). Inside runs are your friend. Corners are force players, so they will come up hard on sweeps: cut it up inside.",
  },
  {
    id: "c2m",
    name: "2-Man (2 Man Under)",
    shell: "Two deep safeties, man coverage underneath",
    tells: ["Two high safeties like Cover 2", "Corners pressed or trailing with outside leverage", "Linebackers locked on backs and tight ends"],
    strong: "Tight man coverage underneath with help over the top. Great against 3rd and medium passing.",
    weak: "QB scrambles (every defender has his back turned) and draws. Runs face only a six-man box.",
    calledWhen: "3rd and 5 to 10, and two-minute drills.",
    rb: "A draw or a QB scramble lane is usually there. On a check-release, a linebacker is chasing you, so separate with your route stem.",
  },
  {
    id: "t2",
    name: "Tampa 2",
    shell: "Cover 2 look with the middle linebacker running deep down the middle",
    tells: ["Two high safeties", "Mike linebacker aligned a bit deeper", "On the snap the Mike sprints to the deep middle"],
    strong: "Closes the middle hole that hurts normal Cover 2.",
    weak: "Seams outside the Mike, and the run game if the Mike bails too early.",
    calledWhen: "Passing downs where the defense expects in-breaking routes.",
    rb: "Draws and delayed handoffs hit hard because the Mike opens his hips and runs away from the line.",
  },
  {
    id: "c3",
    name: "Cover 3",
    shell: "Single high: three deep thirds (two corners and a safety) and four underneath",
    tells: ["One safety in the middle of the field", "Corners at 7 to 9 yards with outside leverage, bailing at the snap", "Strong safety rolling down toward the flat or curl area"],
    strong: "Eight men can fit the run, and nothing deep gets behind it. Sound against almost everything.",
    weak: "Curl, flat, and seam windows, and four verticals stressing the safety.",
    calledWhen: "The base call on early downs, 1st and 10 especially.",
    rb: "Plenty of run defenders. Your flat route vs a curl-flat defender and your option route over the middle are the open throws.",
  },
  {
    id: "c4",
    name: "Cover 4 (Quarters)",
    shell: "Four deep quarters with two high safeties reading the slot or tight end",
    tells: ["Two high safeties, often only 8 to 10 yards deep", "Corners off at 7 to 8 yards", "Safeties' eyes in the backfield: they become run fitters"],
    strong: "Stops deep shots and still lets safeties fit the run fast. Popular against spread offenses.",
    weak: "Short flats and underneath routes, and combination routes that put a safety in conflict.",
    calledWhen: "1st and 10 against spread teams, 3rd and long, and when the offense likes verticals.",
    rb: "Looks like a light box but the safeties come downhill fast. Run with patience and expect a safety to fill the alley.",
  },
  {
    id: "c6",
    name: "Cover 6 (Quarter Quarter Half)",
    shell: "Quarters to one side, Cover 2 to the other",
    tells: ["Two high safeties", "Corner to the boundary (short side) squatting like Cover 2", "Corner to the field side bailing like Quarters"],
    strong: "Lets the defense play quarters to trips or the passing strength and cloud the boundary.",
    weak: "Formation shifts and motion force a re-check. The squat corner side is open on the hole shot.",
    calledWhen: "Against trips and 3x1 formations, 2nd and long.",
    rb: "Flat routes to the quarters side are open and the boundary squat corner will crash on outside runs.",
  },
];

export const WEEKS: Week[] = [
  {
    id: "w1",
    tag: "Week 1",
    title: "Gaps and Holes",
    attr: "gap",
    blurb: "The language of the run game. Letters for gaps, numbers for holes, techniques for defenders.",
    lessons: [
      {
        title: "Gaps are letters",
        points: [
          "A gap: between the center and guard.",
          "B gap: between the guard and tackle.",
          "C gap: between the tackle and tight end (or tackle and open air).",
          "D gap: outside the tight end, the edge.",
          "There is an A, B, C and D gap on both sides of the ball.",
        ],
        diagram: { kind: "gap", gap: "B-R", label: "Right B gap" },
      },
      {
        title: "Holes are numbers",
        points: [
          "Most common system: odd numbers left, even numbers right, 0 over the center.",
          "1 and 2 are the A gaps, 3 and 4 the B gaps, 5 and 6 the C gaps, 7 and 8 the edge.",
          "Some teams flip it or number linemen instead. Confirm your coach's system on day one.",
        ],
      },
      {
        title: "Defensive techniques",
        points: [
          "0: head-up on the center. 1: shaded on the center (A gap).",
          "2i: inside shoulder of the guard. 3: outside shoulder of the guard (B gap).",
          "4i, 4, 5: inside, head-up and outside shoulder of the tackle.",
          "6, 7, 9: around the tight end, 9 being outside him.",
          "Find the 3-technique and the shade before the snap. They tell you where doubles and open gaps will be.",
        ],
      },
      {
        title: "Zone vs gap blocking",
        points: [
          "Zone: linemen step the same way and block whoever enters their area. The hole is read, not fixed. You press the aiming point and cut off the defense.",
          "Gap (power): down blocks, a puller, and a kick-out. The hole is designed. You follow the puller and hit it downhill.",
        ],
      },
    ],
    quiz: [
      { id: "w1q1", prompt: "Which gap is between the center and the guard?", options: ["A gap", "B gap", "C gap", "D gap"], answer: 0, why: "The A gap sits on either side of the center. It is the most direct path through the line and the home of inside zone, duo and trap." },
      { id: "w1q2", prompt: "Name the highlighted gap.", options: ["Right A gap", "Right B gap", "Right C gap", "Right D gap"], answer: 2, diagram: { kind: "gap", gap: "C-R" }, why: "Between the right tackle and the tight end is the C gap. Outside zone and power bounce often end up here." },
      { id: "w1q3", prompt: "A defensive tackle lines up on the outside shoulder of the guard. What technique is he?", options: ["1 technique", "2i technique", "3 technique", "5 technique"], answer: 2, why: "Outside shoulder of the guard is a 3 technique. He usually owns the B gap, and he is often the read key on inside zone." },
      { id: "w1q4", prompt: "In the most common numbering system, the 4 hole is:", options: ["Left B gap", "Right B gap", "Right A gap", "Left C gap"], answer: 1, why: "Even numbers go right, odd go left, counting out from the center: 2 is the right A gap and 4 is the right B gap." },
      { id: "w1q5", prompt: "Name the highlighted gap.", options: ["Left A gap", "Left B gap", "Left C gap", "Left D gap"], answer: 1, diagram: { kind: "gap", gap: "B-L" }, why: "Between the left guard and left tackle is the left B gap, the 3 hole in most systems." },
      { id: "w1q6", prompt: "On a zone run, where is the hole?", options: ["Always the A gap", "Wherever the play call says", "Wherever the defense creates it, read by the RB", "Always outside the tight end"], answer: 2, why: "Zone blocking moves defenders, and the RB reads which way they get moved. That is why vision and patience matter so much on zone." },
      { id: "w1q7", prompt: "On a gap scheme like power, your main job is to:", options: ["Read the safety and bounce", "Follow the puller and hit the designed hole downhill", "Wait for a cutback lane", "Run to the sideline"], answer: 1, why: "Gap schemes design the hole with down blocks and a puller. Stay tight to the puller's hip and trust it." },
      { id: "w1q8", prompt: "A 9 technique lines up:", options: ["Head-up on the center", "Inside shoulder of the tackle", "Outside shoulder of the tight end", "Over the guard"], answer: 2, why: "The 9 technique is the widest standard alignment, outside the tight end. He is usually an edge rusher or force player." },
    ],
  },
  {
    id: "w2",
    tag: "Week 2",
    title: "Core Run Plays",
    attr: "run",
    blurb: "Inside zone, outside zone, power, counter, duo, iso, trap, toss and draw. Aiming points and read keys.",
    lessons: [
      { title: "Inside zone", points: ["Aiming point: the play-side guard's outside hip.", "Read key: the first down lineman from the center to the play side.", "Options: bang it front side, bend it back behind the center, or bounce (rare).", "Most of your yards come on the bend. Press, then one cut."], diagram: { kind: "gap", gap: "A-R", label: "Inside zone aiming point" } },
      { title: "Outside zone (stretch)", points: ["Aiming point: outside hip of the play-side tackle or tight end.", "Read key: the first defender outside the tackle, the edge player.", "If the edge gets reached, bounce outside. If he widens, cut up inside the block.", "Stay on your track. Do not drift flat to the sideline."], diagram: { kind: "gap", gap: "C-R", label: "Outside zone aiming point" } },
      { title: "Power", points: ["Family: gap scheme. The front side down blocks, the backside guard pulls and kicks out the end.", "Aiming point: the play-side B gap, inside the kick-out block.", "Stay tight to the puller's hip and read his block, not the whole defense."] },
      { title: "Counter", points: ["Family: gap scheme with two pullers. The first kicks out the end, the second wraps through to the linebacker.", "Take a counter step away to freeze the linebackers, be patient for the pullers, then explode.", "Follow the wrapper through the hole."] },
      { title: "Duo", points: ["Family: gap-style run with double teams and no pullers, aimed at the linebacker.", "Aiming point: the play-side A gap, pressing at the Mike.", "Run off his leverage. If he goes in, you go out."] },
      { title: "Iso (lead)", points: ["Family: man scheme. A fullback or H-back leads up the hole and isolates a linebacker.", "Stay a yard behind the lead blocker and cut off his block.", "Finish through contact: this is a downhill, physical run."] },
      { title: "Trap", points: ["Family: gap scheme. The play-side tackle is left unblocked on purpose, then a pulling guard traps him.", "Aiming point: the A gap right behind the trap block.", "A quick hitter. Full speed from the snap, straight downhill."] },
      { title: "Toss / sweep", points: ["Family: perimeter run. The QB pitches the ball and you attack the edge.", "Catch the ball first, then gain depth and speed.", "Read the force defender: beat him outside or cut up inside him."] },
      { title: "Draw", points: ["Family: delayed run. The line pass sets, the QB shows a drop back, and the rush runs upfield.", "Sell the pass for a beat, take the late handoff, then burst through the lane the rush created.", "Best against long yardage and teams with an aggressive pass rush."] },
    ],
    quiz: [
      { id: "w2q1", prompt: "On inside zone, what is the RB's typical aiming point?", options: ["Outside hip of the tight end", "Play-side guard's outside hip", "Backside tackle", "The sideline"], answer: 1, why: "Inside zone aims at the play-side guard's outside hip (around the A/B gap) and reads the first down lineman from the center." },
      { id: "w2q2", prompt: "On outside zone, the edge defender widens with the tackle. You should:", options: ["Bounce outside anyway", "Cut up inside the tackle's block", "Stop and reverse field", "Run straight into him"], answer: 1, why: "If the edge widens, the lane opens inside him. Outside zone only bounces when the edge is reached or sealed." },
      { id: "w2q3", prompt: "Who pulls on a classic power play?", options: ["The center", "The play-side tackle", "The backside guard", "Nobody"], answer: 2, why: "Power pulls the backside guard to kick out (or lead through) at the point of attack, while the front side down blocks." },
      { id: "w2q4", prompt: "On duo, the RB reads:", options: ["The free safety", "The Mike linebacker's leverage", "The 3 technique", "The corner"], answer: 1, why: "Duo double teams the down linemen up to the linebackers. You press at the Mike and go opposite his leverage." },
      { id: "w2q5", prompt: "Which play uses two pullers?", options: ["Inside zone", "Trap", "Counter", "Iso"], answer: 2, why: "Counter (often called GT or GH counter) pulls two linemen: the first kicks out, the second wraps through to the linebacker." },
      { id: "w2q6", prompt: "The quickest hitting run in the list is usually:", options: ["Outside zone", "Trap", "Toss", "Counter"], answer: 1, why: "Trap hits fast behind a guard who traps an unblocked lineman. Full speed from the snap, straight downhill." },
      { id: "w2q7", prompt: "On a toss, what comes first?", options: ["Reading the safety", "Catching the ball", "Cutting upfield", "Stiff arm"], answer: 1, why: "Ball first. A dropped toss is a fumble behind the line. Secure it, then get depth and speed to the edge." },
      { id: "w2q8", prompt: "The aiming point for this play is highlighted. Which run is most likely?", options: ["Inside zone", "Outside zone", "Trap", "QB sneak"], answer: 1, diagram: { kind: "gap", gap: "D-R" }, why: "An aiming point on the edge, outside the tight end, is outside zone or stretch territory." },
      { id: "w2q9", prompt: "Name this play.", options: ["Iso", "Counter", "Toss", "Inside zone"], answer: 0, why: "A fullback leads up the hole to isolate the highlighted linebacker while the line blocks man on man. That is iso (lead). Stay a yard behind the lead blocker." },
      { id: "w2q10", prompt: "Name this play.", options: ["Power", "Draw", "Trap", "Outside zone"], answer: 1, why: "The line pass sets (arrows back), the QB shows a drop back and the ends rush upfield. The RB takes a delayed handoff through the lane the rush created. That is a draw." },
      { id: "w2q11", prompt: "Name this play.", options: ["Outside zone", "Power", "Inside zone", "Toss"], answer: 2, why: "Every lineman steps play side together (zone), the RB aims at the guard's outside hip and reads the highlighted down lineman. That is inside zone." },
    ],
  },
  {
    id: "w3",
    tag: "Week 3",
    title: "Run Vision",
    attr: "run",
    blurb: "Where to look, when to cut. Pre-snap reads, read keys and pressing the hole.",
    lessons: [
      { title: "Pre-snap checklist", points: ["Count the box. More defenders than blockers means a tough run, expect a check.", "Find the 3 technique and the shade.", "Check safety depth. A safety rolling down is an extra run defender.", "Know your aiming point and read key before the snap."] },
      { title: "Post-snap progression", points: ["Eyes on the read key, not the end zone.", "Press the aiming point until a defender commits.", "Cut off his leverage: he goes inside, you go outside.", "Eyes jump to the second level and set up the linebacker or safety.", "Finish with pads down and forward lean."] },
      { title: "Common mistakes after time off", points: ["Bouncing too early.", "Stopping your feet at the line.", "Staring at the hole you hoped for instead of the read key.", "Dancing in the backfield."] },
    ],
    quiz: [
      { id: "w3q1", prompt: "Before the snap, you count 7 defenders in the box and you have 6 blockers. This means:", options: ["The run is wide open", "There is a free defender, the run is tougher", "Nothing", "It is a pass"], answer: 1, why: "When defenders outnumber blockers, someone is unblocked. Expect a check to a pass or a run away from the extra man." },
      { id: "w3q2", prompt: "Where should your eyes be right after the handoff on zone?", options: ["The end zone", "The read key", "The QB", "The sideline"], answer: 1, why: "Your read key decides the cut. Eyes on him, not on open grass you hope will appear." },
      { id: "w3q3", prompt: "Why press the aiming point instead of cutting early?", options: ["It looks better", "It makes linebackers commit so blocks hold up", "It wastes clock", "Coaches like it"], answer: 1, why: "Pressing holds linebackers in their gaps so linemen can climb to them. Cut too early and the defense flows to you unblocked." },
      { id: "w3q4", prompt: "Your read key steps inside. You:", options: ["Run into him", "Cut outside his leverage", "Stop", "Reverse field"], answer: 1, why: "Cut off leverage. He commits inside, you go outside, and vice versa." },
      { id: "w3q5", prompt: "A safety rolls down to 6 yards right before the snap. That most likely adds:", options: ["A pass rusher only", "An extra run defender", "A deep zone", "Nothing"], answer: 1, why: "A safety rolling into the box means eight in the box. Expect a tighter run and possibly single high coverage behind it." },
      { id: "w3q6", prompt: "Which is a classic vision mistake?", options: ["One cut and go", "Pressing the hole", "Dancing in the backfield", "Falling forward"], answer: 2, why: "Dancing kills timing. Zone and gap plays are built for decisive running." },
    ],
  },
  {
    id: "w4",
    tag: "Week 4",
    title: "Pass Pro and Routes",
    attr: "pro",
    blurb: "If you can't protect, you don't play third down. Blitz pickup rules, check-release and routes.",
    lessons: [
      { title: "Inside-out rule", points: ["Find the Mike before the snap (QB or center often declares him).", "Eyes inside-out: A gap, then B gap, then edge.", "Step up and meet the rusher at the line, not at the QB's feet.", "Square shoulders, wide base, hands inside, punch and stay on him."] },
      { title: "Check-release", points: ["If your blitzer doesn't come, count one beat, then release to your route.", "Common releases: flat, check-down, angle."] },
      { title: "RB route tree", points: ["Flat, swing, angle (option), wheel, check-down, screen.", "Against man coverage, a linebacker is on you: win with a stem and a hard break.", "Against zone, settle in the window between defenders."] },
      { title: "Ball security", points: ["Five points of pressure: fingertips over the point, forearm, bicep, chest, elbow tight.", "Ball in the sideline arm. Two hands in traffic."] },
    ],
    quiz: [
      { id: "w4q1", prompt: "Inside-out protection means you check:", options: ["Edge first", "A gap, then B gap, then edge", "Only the Mike", "The safety first"], answer: 1, why: "The fastest path to the QB is inside. Check the A gap first, then work out." },
      { id: "w4q2", prompt: "Where do you meet a blitzing linebacker?", options: ["At the QB's feet", "Step up and meet him at the line", "Behind the QB", "Wait for him"], answer: 1, why: "Meet him early at the line of scrimmage so the pocket stays clean and the QB can step up." },
      { id: "w4q3", prompt: "On check-release, nobody blitzes. You:", options: ["Stay in and block air", "Count a beat, then release to your route", "Run a deep post", "Go to the sideline"], answer: 1, why: "Check-release means block if he comes, release if he doesn't. One beat, then get into your route." },
      { id: "w4q4", prompt: "Which arm carries the ball in the open field?", options: ["The arm closest to the defense", "The sideline arm", "Either", "Both, always"], answer: 1, why: "Carry it in the sideline arm, away from pursuit. Two hands when you are in traffic." },
      { id: "w4q5", prompt: "A linebacker is manned up on you. Best route idea?", options: ["Stand still", "Angle or option route with a stem and hard break", "Block", "Run straight at him"], answer: 1, why: "Linebackers struggle with quick change of direction. The angle and option routes are built to beat them." },
      { id: "w4q6", prompt: "Six rushers come and the offense has six blockers including you. Who is your guy?", options: ["The widest rusher", "The most dangerous inside rusher left unblocked", "The corner", "Nobody"], answer: 1, why: "Your rule picks up the inside threat first. The edge can sometimes be handled by the QB getting the ball out." },
    ],
  },
  {
    id: "w5",
    tag: "Week 5",
    title: "Reading Coverages",
    attr: "cov",
    blurb: "Middle of the field open or closed? Corner depth? Safety rotation? Name the shell in under 3 seconds.",
    lessons: [
      { title: "Step 1: open or closed middle", points: ["One high safety (middle of field closed, MOFC): think Cover 1 or Cover 3.", "Two high safeties (middle of field open, MOFO): think Cover 2, 2-Man, Tampa 2, Cover 4 or Cover 6.", "Zero deep safeties: Cover 0, all-out blitz."], diagram: { kind: "coverage", id: "c3", view: "pre" } },
      { title: "Step 2: corner depth and leverage", points: ["Pressed with inside leverage and one high: Cover 1.", "Off at 7 to 9 yards, outside leverage, bailing: Cover 3.", "Shallow and squatting with two high: Cover 2.", "Off at 7 to 8 with two high: Cover 4."] },
      { title: "Step 3: watch the rotation", points: ["Defenses disguise. Two high before the snap can rotate to one high at the snap (a safety drops down).", "The post-snap picture is the real coverage.", "Why it matters for an RB: one high usually means 8 in the box, two high usually means 6 or 7."], diagram: { kind: "coverage", id: "c2", view: "post" } },
    ],
    quiz: [
      { id: "w5q1", prompt: "Name this coverage (post-snap).", options: ["Cover 1", "Cover 2", "Cover 3", "Cover 4"], answer: 2, diagram: { kind: "coverage", id: "c3", view: "post" }, why: "Three deep thirds (two corners and a safety) and four underneath defenders. That is Cover 3." },
      { id: "w5q2", prompt: "Name this coverage (post-snap).", options: ["Cover 2", "Cover 0", "Cover 4", "Cover 1"], answer: 0, diagram: { kind: "coverage", id: "c2", view: "post" }, why: "Two safeties each own a deep half while the corners squat in the flats. Classic Cover 2." },
      { id: "w5q3", prompt: "Name this coverage (post-snap).", options: ["Cover 3", "Cover 4", "Cover 6", "Tampa 2"], answer: 1, diagram: { kind: "coverage", id: "c4", view: "post" }, why: "Four defenders split the deep field into quarters with three underneath. Cover 4, also called Quarters." },
      { id: "w5q4", prompt: "Pre-snap read: what shell is this?", options: ["Single high (Cover 1 or 3)", "Two high (Cover 2 family or 4)", "Zero (Cover 0)", "Prevent"], answer: 2, diagram: { kind: "coverage", id: "c0", view: "pre" }, why: "No deep safety and everyone walked up. Expect Cover 0 and a blitz: find your hot route or your blitz pickup now." },
      { id: "w5q5", prompt: "Pre-snap read: one safety deep, corners pressed, the other safety in the box. Most likely:", options: ["Cover 2", "Cover 1", "Cover 4", "Tampa 2"], answer: 1, diagram: { kind: "coverage", id: "c1", view: "pre" }, why: "Single high with pressed corners is the Cover 1 picture: man coverage with one deep helper and a loaded box." },
      { id: "w5q6", prompt: "Name this coverage (post-snap). Watch the Mike linebacker.", options: ["Cover 2", "Tampa 2", "Cover 3", "Cover 6"], answer: 1, diagram: { kind: "coverage", id: "t2", view: "post" }, why: "Two deep halves plus the Mike sprinting to the deep middle. That middle runner is the Tampa 2 tell." },
      { id: "w5q7", prompt: "Name this coverage (post-snap).", options: ["Cover 4", "Cover 2", "Cover 6", "Cover 1"], answer: 2, diagram: { kind: "coverage", id: "c6", view: "post" }, why: "Quarters on one side and a half on the other: quarter, quarter, half. That is Cover 6." },
      { id: "w5q8", prompt: "Two high safeties usually means the box has:", options: ["8 or more defenders", "6 or 7 defenders", "11 defenders", "No linebackers"], answer: 1, why: "With two safeties deep, fewer bodies are left for the box, which is why inside runs are good calls against two high." },
      { id: "w5q9", prompt: "Name this coverage (post-snap).", options: ["Cover 0", "Cover 1", "2-Man", "Cover 3"], answer: 1, diagram: { kind: "coverage", id: "c1", view: "post" }, why: "Man coverage on every receiver with one deep safety in the middle and a robber underneath. Cover 1." },
      { id: "w5q10", prompt: "Name this coverage (post-snap).", options: ["Cover 2", "2-Man", "Cover 4", "Cover 0"], answer: 1, diagram: { kind: "coverage", id: "c2m", view: "post" }, why: "Two deep halves on top, man coverage underneath. That is 2-Man, a 3rd and medium favorite." },
    ],
  },
  {
    id: "w6",
    tag: "Week 6",
    title: "Why the Defense Calls It",
    attr: "sit",
    blurb: "Down and distance, field position, score and clock. Predict the coverage before the offense breaks the huddle.",
    lessons: [
      { title: "Down and distance", points: ["1st and 10: balanced. Base Cover 3 or Quarters, ready for run or pass.", "2nd and long: offense likely throws. More two high, Cover 2 or Cover 6.", "3rd and short (1 to 3): run likely. Single high, Cover 1, loaded box, maybe Cover 0.", "3rd and medium (4 to 6): man or pressure. 2-Man or Cover 1 with a blitz.", "3rd and long (7+): keep it in front. Cover 2, Cover 4, or drop eight and rush three."] },
      { title: "Field position", points: ["Backed up (own 1 to 10): offense runs to get room. Defense loads the box and plays aggressive single high.", "Open field: base calls, more disguise.", "Red zone (inside the 20): the field shrinks, so man coverage and Cover 1 are easier to play. Fewer deep zones needed.", "Goal line: Cover 0 or Cover 1, as many run defenders as possible."] },
      { title: "Score and clock", points: ["Protecting a lead late: prevent or deep quarters. Give up underneath, keep the clock running and nothing over the top.", "Trailing late: pressure to force mistakes and get the ball back.", "Two-minute drill: two high zones that keep everything in front and tackle inbounds.", "Last play of the half: deep prevent, everyone back."] },
      { title: "Personnel and formation", points: ["Heavy personnel (2 tight ends, a fullback): expect run, more single high and 8 in the box.", "Spread (4 wide receivers): more two high and nickel or dime defenders.", "Trips (3 receivers to one side): Cover 6 or match quarters to the trips side.", "Motion: if a defender travels with the motion, it is likely man coverage."] },
    ],
    quiz: [
      { id: "w6q1", prompt: "Most likely coverage family?", situation: { down: "3rd & 1", ball: "Opp 38", score: "Tied 14-14", clock: "Q2 6:40", extra: "Offense in 2 TE, 1 RB" }, options: ["Cover 2, two high", "Cover 1 or Cover 0, loaded box", "Prevent", "Cover 4 with 6 in the box"], answer: 1, why: "Short yardage plus heavy personnel screams run. The defense wants bodies in the box: Cover 1 with eight down, or Cover 0 with everyone up." },
      { id: "w6q2", prompt: "Most likely coverage family?", situation: { down: "3rd & 12", ball: "Own 30", score: "Up 3", clock: "Q3 9:15", extra: "Offense in 4 WR, shotgun" }, options: ["Cover 0 blitz", "Cover 2 or Cover 4, keep it in front", "Goal line defense", "Cover 1 with 8 in the box"], answer: 1, why: "Long yardage: the defense only needs to tackle short of the sticks. Two high zone keeps the ball in front, and the check-down to the RB is often open but short." },
      { id: "w6q3", prompt: "Most likely coverage family?", situation: { down: "1st & Goal", ball: "Opp 3", score: "Down 4", clock: "Q4 2:10", extra: "Offense in heavy goal line set" }, options: ["Cover 4", "Prevent", "Cover 0 or Cover 1 with everyone in the box", "Cover 6"], answer: 2, why: "Goal line: there is no deep field to protect. Defenses play man or zero and pack the box to stop the run." },
      { id: "w6q4", prompt: "Most likely coverage family?", situation: { down: "2nd & 3", ball: "Opp 45", score: "Down 21", clock: "Q4 1:30", extra: "Offense in shotgun, no huddle" }, options: ["Deep prevent, two or three high, keep everything in front", "Cover 0 blitz", "Goal line", "Cover 1 with 8 in the box"], answer: 0, why: "Up three scores with 1:30 left, the defense only fears the big play. Play deep, give up underneath, tackle inbounds and keep the clock running." },
      { id: "w6q5", prompt: "Why do red zone defenses lean on man coverage?", options: ["Man is easier to call", "The field is compressed, so deep zones matter less and tight coverage is easier", "Refs allow more holding", "It stops the run better than anything"], answer: 1, why: "Inside the 20 the end line acts like an extra defender. Less space to cover means man coverage is tighter and safer." },
      { id: "w6q6", prompt: "Most likely coverage family?", situation: { down: "1st & 10", ball: "Own 25", score: "Tied 0-0", clock: "Q1 12:00", extra: "Offense in 11 personnel (1 RB, 1 TE, 3 WR)" }, options: ["Base Cover 3 or Quarters", "Cover 0 blitz", "Prevent", "Goal line"], answer: 0, why: "1st and 10 is a balanced down. Defenses play their base, usually Cover 3 or Quarters, so they can fit the run and still defend the pass." },
      { id: "w6q7", prompt: "Before the snap, the slot receiver motions across the formation and a linebacker runs with him. That suggests:", options: ["Zone coverage", "Man coverage", "Prevent", "A blitz from the corner"], answer: 1, why: "A defender traveling with motion is following his man. Zone defenders usually just bump their alignment." },
      { id: "w6q8", prompt: "Most likely coverage family?", situation: { down: "3rd & 5", ball: "Opp 40", score: "Down 7", clock: "Q3 4:50", extra: "Offense in shotgun, 3 WR" }, options: ["2-Man or Cover 1 with pressure", "Goal line", "Prevent", "Cover 4 with a three-man rush"], answer: 0, why: "3rd and medium is man and pressure territory. Tight man coverage under two safeties (2-Man) or Cover 1 with a blitz makes the QB throw into tight windows." },
      { id: "w6q9", prompt: "Offense lines up in trips (3 receivers) to the field side. A common answer is:", options: ["Cover 6, quarters to the trips side and Cover 2 to the boundary", "Cover 0", "Goal line", "Single high with no adjustment"], answer: 0, why: "Cover 6 lets the defense put quarters coverage on the three-receiver side and squat the corner to the short side." },
      { id: "w6q10", prompt: "Why do defenses disguise two high and then rotate to one high at the snap?", options: ["To confuse the QB and RB reads", "Because they forgot the call", "To use fewer players", "To stop the kicker"], answer: 0, why: "Disguise makes the pre-snap read wrong. That is why you confirm the coverage after the snap, and why a run checked into a light box can suddenly face eight." },
    ],
  },
  {
    id: "w7",
    tag: "Week 7",
    title: "Why the Offense Calls It",
    attr: "sit",
    blurb: "Play calling from the other side: fronts, box counts, tendencies, clock management and short yardage.",
    lessons: [
      { title: "Run it where they are not", points: ["Count the box. 6 in the box against 6 blockers: run it. 8 in the box: throw or run away from the extra man.", "Against two high safeties, inside zone and duo are strong calls.", "Against single high with eight down, quick passes, play-action and outside runs that win the edge."] },
      { title: "Down and distance", points: ["1st and 10: stay balanced. Inside zone, play-action and quick game.", "2nd and short: shot play time. The defense expects run, so play-action deep.", "2nd and long: draw and screen. The rush is coming upfield and linebackers drop deep.", "3rd and short: power, duo, QB sneak. Win at the point of attack.", "3rd and long: pass, or a draw and screen if the offense just wants field position."] },
      { title: "Clock and score", points: ["Four-minute offense (protecting a lead): runs that stay inbounds, the clock keeps moving.", "Two-minute offense: passes to the sideline, spikes, the RB catches and gets out of bounds.", "Backed up near your own goal line: safe runs and quick throws, no long-developing plays."] },
      { title: "Setting up the call", points: ["Run inside zone repeatedly and the safeties creep up. Then play-action over the top.", "A defense that keeps blitzing gets screens and hot routes.", "Teams that slant the line hard get counter and cutbacks."] },
    ],
    quiz: [
      { id: "w7q1", prompt: "Best play call?", situation: { down: "2nd & 1", ball: "Own 46", score: "Tied 10-10", clock: "Q2 8:20", extra: "Defense brought a safety into the box" }, options: ["Play-action shot deep", "Draw", "Punt", "Kneel down"], answer: 0, why: "2nd and 1 is a free play: even an incompletion leaves a manageable 3rd and 1. The defense is loaded for the run, so play-action over the top is the classic call." },
      { id: "w7q2", prompt: "Best play call?", situation: { down: "2nd & 14", ball: "Own 22", score: "Down 3", clock: "Q3 7:00", extra: "Defensive ends rushing upfield hard all game" }, options: ["QB sneak", "Draw or RB screen", "Goal line power", "Spike the ball"], answer: 1, why: "Long yardage with an aggressive upfield rush: let them run past and hit the draw or screen underneath. Easy yards and it slows down the rush." },
      { id: "w7q3", prompt: "Best play call?", situation: { down: "3rd & 1", ball: "Opp 34", score: "Up 6", clock: "Q4 5:30", extra: "Defense in a 4-3 with 7 in the box" }, options: ["Deep post", "Power or duo downhill", "Reverse", "Hail Mary"], answer: 1, why: "Short yardage is won at the point of attack. Power and duo put extra blockers there and get the RB downhill fast." },
      { id: "w7q4", prompt: "Best approach?", situation: { down: "1st & 10", ball: "Own 40", score: "Up 7", clock: "Q4 3:45", extra: "Opponent has one timeout" }, options: ["Deep shots to stop the clock", "Inbounds runs to keep the clock moving (four-minute offense)", "Spike the ball", "Throw to the sideline"], answer: 1, why: "Protecting a late lead, the clock is your teammate. Run between the tackles, stay inbounds, and make them burn their timeout." },
      { id: "w7q5", prompt: "The defense shows two high safeties and only 6 in the box against your 6 blockers. A strong call is:", options: ["Inside zone", "Hail Mary", "Kneel", "Fake punt"], answer: 0, why: "Six blockers on six defenders: hats on hats. Inside zone or duo should get positive yards against a two high shell." },
      { id: "w7q6", prompt: "Best approach?", situation: { down: "1st & 10", ball: "Own 25", score: "Down 4", clock: "Q4 1:05", extra: "No timeouts" }, options: ["Inside runs", "Passes to the sideline, RB gets out of bounds after the catch", "Punt", "Kneel"], answer: 1, why: "Two-minute offense with no timeouts: stop the clock by getting out of bounds. As the RB, catch it and get to the sideline." },
      { id: "w7q7", prompt: "You have run inside zone 6 times and the safeties are creeping down. The offense should now:", options: ["Run inside zone forever", "Call play-action off the same look", "Punt early", "Switch to a two-point play"], answer: 1, why: "Plays set each other up. Same backfield action, but now the ball goes over the top of the safeties who are biting on the run." },
      { id: "w7q8", prompt: "The defense blitzes almost every 3rd down. Good counters:", options: ["Screens and hot routes", "Seven-step drop deep shots every time", "QB kneels", "Max protect and hope"], answer: 0, why: "Blitzes leave voids behind the rushers. Screens and quick hot routes punish the extra rushers and can go for big yards." },
    ],
  },
];

// Every quiz question gets its diagram (and any re-worded prompt) from visuals.ts.
for (const w of WEEKS) {
  w.quiz = w.quiz.map((q) => {
    const v = QUIZ_VISUALS[q.id] ?? {};
    const situation = q.situation ? { ...q.situation, ...v.situation } : v.situation;
    return { ...q, ...v, situation: situation as Situation | undefined };
  });
  w.lessons = w.lessons.map((l) => {
    const d = LESSON_VISUALS[`${w.id}:${l.title}`];
    return d ? { ...l, diagram: d } : l;
  });
}

export const ALL_QUESTIONS: (Question & { weekId: string; attr: Attr })[] = WEEKS.flatMap((w) =>
  w.quiz.map((q) => ({ ...q, weekId: w.id, attr: w.attr })),
);
