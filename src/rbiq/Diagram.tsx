import type { ReactNode } from "react";

import { BroadcastField, PEllipse, PLine, PPath, PPoly, PRect, PText } from "./broadcast";
import type { Person } from "./broadcast";
import type { CoverageId, Def, Diagram as DiagramSpec, Situation } from "./data";

type P = { x: number; y: number; l: string };
type Zone = { cx: number; cy: number; rx: number; ry: number; deep: boolean };
type Man = { from: [number, number]; to: [number, number]; blitz?: boolean };

const WR_2X2: P[] = [
  { x: 30, y: 207, l: "X" },
  { x: 95, y: 210, l: "H" },
  { x: 305, y: 210, l: "Y" },
  { x: 370, y: 207, l: "Z" },
];
const WR_TRIPS: P[] = [
  { x: 30, y: 207, l: "X" },
  { x: 250, y: 212, l: "H" },
  { x: 305, y: 210, l: "Y" },
  { x: 370, y: 207, l: "Z" },
];
const OL = [160, 180, 200, 220, 240];
const QB = { x: 200, y: 232 };
const RB = { x: 200, y: 258 };
const DL: P[] = [160, 187, 213, 240].map((x) => ({ x, y: 190, l: "" }));

interface CovShape {
  pre: P[];
  post: P[];
  zones: Zone[];
  man: Man[];
}

const C: Record<CoverageId, CovShape> = {
  c0: {
    pre: [
      { x: 30, y: 188, l: "C" }, { x: 370, y: 188, l: "C" }, { x: 305, y: 186, l: "N" },
      { x: 150, y: 172, l: "S" }, { x: 250, y: 172, l: "S" }, { x: 175, y: 166, l: "W" }, { x: 225, y: 166, l: "M" },
    ],
    post: [
      { x: 30, y: 180, l: "C" }, { x: 370, y: 180, l: "C" }, { x: 305, y: 182, l: "N" },
      { x: 110, y: 180, l: "S" }, { x: 250, y: 190, l: "S" }, { x: 180, y: 192, l: "W" }, { x: 210, y: 215, l: "M" },
    ],
    zones: [],
    man: [
      { from: [30, 180], to: [30, 150] }, { from: [370, 180], to: [370, 150] }, { from: [305, 182], to: [305, 155] },
      { from: [110, 180], to: [95, 155] }, { from: [210, 215], to: [235, 250] },
      { from: [250, 190], to: [212, 228], blitz: true }, { from: [180, 192], to: [195, 226], blitz: true },
    ],
  },
  c1: {
    pre: [
      { x: 30, y: 188, l: "C" }, { x: 370, y: 188, l: "C" }, { x: 305, y: 186, l: "N" },
      { x: 100, y: 176, l: "S" }, { x: 200, y: 70, l: "F" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 30, y: 178, l: "C" }, { x: 370, y: 178, l: "C" }, { x: 305, y: 178, l: "N" },
      { x: 100, y: 172, l: "S" }, { x: 200, y: 62, l: "F" }, { x: 200, y: 140, l: "W" }, { x: 232, y: 176, l: "M" },
    ],
    zones: [
      { cx: 200, cy: 62, rx: 120, ry: 38, deep: true },
      { cx: 200, cy: 140, rx: 38, ry: 18, deep: false },
    ],
    man: [
      { from: [30, 178], to: [30, 140] }, { from: [370, 178], to: [370, 140] }, { from: [305, 178], to: [305, 145] },
      { from: [100, 172], to: [95, 140] }, { from: [232, 176], to: [240, 245] },
    ],
  },
  c2: {
    pre: [
      { x: 30, y: 176, l: "C" }, { x: 370, y: 176, l: "C" }, { x: 305, y: 168, l: "N" },
      { x: 110, y: 88, l: "S" }, { x: 290, y: 88, l: "S" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 45, y: 160, l: "C" }, { x: 355, y: 160, l: "C" }, { x: 290, y: 150, l: "N" },
      { x: 105, y: 70, l: "S" }, { x: 295, y: 70, l: "S" }, { x: 135, y: 150, l: "W" }, { x: 210, y: 148, l: "M" },
    ],
    zones: [
      { cx: 100, cy: 70, rx: 96, ry: 40, deep: true }, { cx: 300, cy: 70, rx: 96, ry: 40, deep: true },
      { cx: 45, cy: 160, rx: 38, ry: 20, deep: false }, { cx: 355, cy: 160, rx: 38, ry: 20, deep: false },
      { cx: 135, cy: 150, rx: 36, ry: 18, deep: false }, { cx: 210, cy: 148, rx: 34, ry: 18, deep: false },
      { cx: 285, cy: 150, rx: 34, ry: 18, deep: false },
    ],
    man: [],
  },
  c2m: {
    pre: [
      { x: 30, y: 188, l: "C" }, { x: 370, y: 188, l: "C" }, { x: 305, y: 186, l: "N" },
      { x: 110, y: 88, l: "S" }, { x: 290, y: 88, l: "S" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 30, y: 176, l: "C" }, { x: 370, y: 176, l: "C" }, { x: 305, y: 176, l: "N" },
      { x: 105, y: 70, l: "S" }, { x: 295, y: 70, l: "S" }, { x: 110, y: 172, l: "W" }, { x: 232, y: 176, l: "M" },
    ],
    zones: [
      { cx: 100, cy: 70, rx: 96, ry: 40, deep: true }, { cx: 300, cy: 70, rx: 96, ry: 40, deep: true },
    ],
    man: [
      { from: [30, 176], to: [30, 140] }, { from: [370, 176], to: [370, 140] }, { from: [305, 176], to: [305, 145] },
      { from: [110, 172], to: [95, 145] }, { from: [232, 176], to: [240, 245] },
    ],
  },
  t2: {
    pre: [
      { x: 30, y: 176, l: "C" }, { x: 370, y: 176, l: "C" }, { x: 305, y: 168, l: "N" },
      { x: 110, y: 88, l: "S" }, { x: 290, y: 88, l: "S" }, { x: 160, y: 166, l: "W" }, { x: 205, y: 156, l: "M" },
    ],
    post: [
      { x: 45, y: 160, l: "C" }, { x: 355, y: 160, l: "C" }, { x: 290, y: 150, l: "N" },
      { x: 95, y: 70, l: "S" }, { x: 305, y: 70, l: "S" }, { x: 130, y: 150, l: "W" }, { x: 200, y: 104, l: "M" },
    ],
    zones: [
      { cx: 85, cy: 66, rx: 82, ry: 38, deep: true }, { cx: 315, cy: 66, rx: 82, ry: 38, deep: true },
      { cx: 200, cy: 104, rx: 44, ry: 26, deep: true },
      { cx: 45, cy: 160, rx: 38, ry: 20, deep: false }, { cx: 355, cy: 160, rx: 38, ry: 20, deep: false },
      { cx: 130, cy: 150, rx: 36, ry: 18, deep: false }, { cx: 285, cy: 150, rx: 36, ry: 18, deep: false },
    ],
    man: [{ from: [205, 156], to: [200, 112] }],
  },
  c3: {
    pre: [
      { x: 30, y: 136, l: "C" }, { x: 370, y: 136, l: "C" }, { x: 305, y: 168, l: "N" },
      { x: 112, y: 124, l: "S" }, { x: 200, y: 72, l: "F" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 55, y: 70, l: "C" }, { x: 345, y: 70, l: "C" }, { x: 305, y: 150, l: "N" },
      { x: 90, y: 150, l: "S" }, { x: 200, y: 60, l: "F" }, { x: 160, y: 156, l: "W" }, { x: 240, y: 156, l: "M" },
    ],
    zones: [
      { cx: 62, cy: 68, rx: 62, ry: 40, deep: true }, { cx: 200, cy: 60, rx: 70, ry: 40, deep: true },
      { cx: 338, cy: 68, rx: 62, ry: 40, deep: true },
      { cx: 75, cy: 150, rx: 46, ry: 20, deep: false }, { cx: 160, cy: 156, rx: 38, ry: 18, deep: false },
      { cx: 240, cy: 156, rx: 38, ry: 18, deep: false }, { cx: 325, cy: 150, rx: 46, ry: 20, deep: false },
    ],
    man: [],
  },
  c4: {
    pre: [
      { x: 30, y: 130, l: "C" }, { x: 370, y: 130, l: "C" }, { x: 305, y: 168, l: "N" },
      { x: 125, y: 98, l: "S" }, { x: 275, y: 98, l: "S" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 45, y: 66, l: "C" }, { x: 355, y: 66, l: "C" }, { x: 300, y: 152, l: "N" },
      { x: 150, y: 72, l: "S" }, { x: 250, y: 72, l: "S" }, { x: 125, y: 154, l: "W" }, { x: 205, y: 150, l: "M" },
    ],
    zones: [
      { cx: 50, cy: 66, rx: 48, ry: 38, deep: true }, { cx: 150, cy: 70, rx: 48, ry: 38, deep: true },
      { cx: 250, cy: 70, rx: 48, ry: 38, deep: true }, { cx: 350, cy: 66, rx: 48, ry: 38, deep: true },
      { cx: 105, cy: 154, rx: 62, ry: 20, deep: false }, { cx: 205, cy: 150, rx: 40, ry: 18, deep: false },
      { cx: 305, cy: 152, rx: 58, ry: 20, deep: false },
    ],
    man: [],
  },
  c6: {
    pre: [
      { x: 30, y: 176, l: "C" }, { x: 370, y: 130, l: "C" }, { x: 305, y: 168, l: "N" },
      { x: 110, y: 90, l: "S" }, { x: 275, y: 98, l: "S" }, { x: 170, y: 166, l: "W" }, { x: 230, y: 166, l: "M" },
    ],
    post: [
      { x: 45, y: 160, l: "C" }, { x: 352, y: 66, l: "C" }, { x: 318, y: 152, l: "N" },
      { x: 100, y: 70, l: "S" }, { x: 258, y: 72, l: "S" }, { x: 150, y: 154, l: "W" }, { x: 230, y: 152, l: "M" },
    ],
    zones: [
      { cx: 100, cy: 70, rx: 98, ry: 40, deep: true }, { cx: 255, cy: 70, rx: 47, ry: 38, deep: true },
      { cx: 350, cy: 66, rx: 47, ry: 38, deep: true },
      { cx: 45, cy: 160, rx: 38, ry: 20, deep: false }, { cx: 150, cy: 154, rx: 42, ry: 18, deep: false },
      { cx: 232, cy: 152, rx: 36, ry: 18, deep: false }, { cx: 320, cy: 152, rx: 44, ry: 20, deep: false },
    ],
    man: [],
  },
};

const toPerson = (p: { x: number; y: number; l?: string; hl?: boolean }, side: "off" | "def"): Person => ({ x: p.x, y: p.y, l: p.l, hl: p.hl, side });

export function CoverageField({
  id,
  view,
  motion,
  trips,
  rotate,
}: {
  id: CoverageId;
  view: "pre" | "post";
  motion?: boolean;
  trips?: boolean;
  rotate?: boolean;
}) {
  const s = C[id];
  const pts = (view === "pre" ? s.pre : s.post).map((p) => ({
    ...p,
    hl: motion && p.l === "W" ? true : rotate && p.l === "S" ? true : false,
  }));
  const wr = trips ? WR_TRIPS : WR_2X2;
  const people: Person[] = [
    ...wr.map((w) => toPerson({ ...w, l: "WR" }, "off")),
    ...OL.map((x) => ({ x, y: 207, side: "off" as const })),
    toPerson({ ...QB, l: "QB" }, "off"),
    toPerson({ ...RB, l: "RB" }, "off"),
    ...DL.map((d) => toPerson(d, "def")),
    ...pts.map((p) => toPerson(p, "def")),
  ];
  return (
    <BroadcastField
      region={{ x0: 6, x1: 394, y0: 50, y1: 268 }} scale={1.35}
      people={people}
      label={view === "pre" ? "Pre-snap defensive alignment" : "Post-snap coverage picture"}
    >
      {view === "post"
        ? s.zones.map((z, i) => (
            <PEllipse key={i} className={z.deep ? "rbiq-zone rbiq-zone--deep" : "rbiq-zone rbiq-zone--under"} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} />
          ))
        : null}
      {view === "post"
        ? s.man.map((m, i) => (
            <PLine
              key={i}
              className={m.blitz ? "rbiq-man rbiq-man--blitz" : "rbiq-man"}
              x1={m.from[0]}
              y1={m.from[1]}
              x2={m.to[0]}
              y2={m.to[1]}
              markerEnd={m.blitz ? "url(#rbiq-arrow-red)" : "url(#rbiq-arrow)"}
            />
          ))
        : null}
      {motion ? (
        <>
          <PPath className="rbiq-motion" d="M95 220 Q 180 236 262 220" markerEnd="url(#rbiq-arrow)" />
          <PLine className="rbiq-move rbiq-move--hl" x1={170} y1={166} x2={250} y2={174} markerEnd="url(#rbiq-arrow-gold)" />
        </>
      ) : null}
      {rotate ? (
        <>
          <PLine className="rbiq-move rbiq-move--hl" x1={290} y1={88} x2={300} y2={150} markerEnd="url(#rbiq-arrow-gold)" />
          <PLine className="rbiq-move rbiq-move--hl" x1={110} y1={88} x2={196} y2={70} markerEnd="url(#rbiq-arrow-gold)" />
        </>
      ) : null}
    </BroadcastField>
  );
}

/* ---------- line-of-scrimmage play diagrams ---------- */

const LX = [140, 170, 200, 230, 260, 295];
const LPOS = ["LT", "LG", "C", "RG", "RT", "TE"];
export const GAP_X: Record<string, number> = {
  "D-L": 92, "C-L": 125, "B-L": 155, "A-L": 185, "A-R": 215, "B-R": 245, "C-R": 278, "D-R": 322,
};
const TECHS: [string, number, number][] = [
  ["0", 200, 176], ["1", 213, 166], ["2i", 222, 176], ["2", 230, 166], ["3", 242, 176], ["4i", 251, 166],
  ["4", 260, 176], ["5", 270, 166], ["7", 286, 176], ["6", 295, 166], ["9", 312, 176],
];

type PlaySpec = Extract<DiagramSpec, { kind: "play" }>;

export function PlayField({ d, letters }: { d: PlaySpec; letters: boolean }) {
  const qb = d.qbSet ? { x: 200, y: 258 } : { x: 200, y: d.lead ? 234 : 240 };
  const rb = d.qbSet ? { x: 234, y: 262 } : { x: 200, y: d.lead ? 280 : 274 };
  const pullIdx = new Set((d.pullers ?? []).map((p) => p.from));
  const aimX = d.target ?? (d.aim ? GAP_X[d.aim] : undefined);

  let rbPath: ReactNode = null;
  if (d.path === "zone") {
    rbPath = (
      <>
        <PPath className="rbiq-path" d={`M200 266 Q 214 236 ${GAP_X["B-R"]} 196 L ${GAP_X["B-R"]} 176`} markerEnd="url(#rbiq-arrow-red)" />
        <PPath className="rbiq-path rbiq-path--alt" d={`M200 266 Q 214 230 218 214 Q 205 196 ${GAP_X["A-L"]} 176`} markerEnd="url(#rbiq-arrow-red)" />
        <PPath className="rbiq-path rbiq-path--alt" d={`M200 266 Q 250 240 ${GAP_X["C-R"]} 196 L ${GAP_X["C-R"] + 6} 176`} markerEnd="url(#rbiq-arrow-red)" />
      </>
    );
  } else if (d.path === "press-cut") {
    rbPath = (
      <>
        <PPath className="rbiq-path" d={`M200 266 Q 220 236 ${GAP_X["B-R"] - 4} 210`} />
        <PPath className="rbiq-path rbiq-path--alt" d={`M${GAP_X["B-R"] - 4} 210 Q 220 196 ${GAP_X["A-L"]} 172`} markerEnd="url(#rbiq-arrow-red)" />
      </>
    );
  } else if (d.path === "dance") {
    rbPath = <PPath className="rbiq-path" d="M200 266 L215 256 L188 248 L222 240 L186 232 L214 226 L196 220" markerEnd="url(#rbiq-arrow-red)" />;
  } else if (d.path === "sideline") {
    rbPath = <PPath className="rbiq-path" d="M200 266 Q 300 230 340 150 L 360 110" markerEnd="url(#rbiq-arrow-red)" />;
  } else if (aimX !== undefined) {
    const start = d.pitch ? `M${rb.x + 7} ${rb.y - 2} L 244 266` : `M${rb.x} ${rb.y - 8}`;
    const counter = d.counter ? ` L 186 262 L 190 258` : "";
    const ctrlX = d.pitch ? aimX - 10 : (rb.x + aimX) / 2 + 6;
    rbPath = (
      <>
        <PPath className="rbiq-path" d={`${start}${counter} Q ${ctrlX} 250 ${aimX} 198 L ${aimX} 174`} markerEnd="url(#rbiq-arrow-red)" />
        {d.target !== undefined ? <PEllipse className="rbiq-target" cx={d.target} cy={200} rx={9} ry={6} /> : null}
      </>
    );
  }

  // Frame the action: the line, the backfield and every drawn defender.
  const xs = [104, 296, aimX ?? 200, ...(d.defenders ?? []).flatMap((p) => [p.x, p.to?.[0] ?? p.x])];
  const ys = [140, ...(d.defenders ?? []).flatMap((p) => [p.y, p.to?.[1] ?? p.y])];
  if (d.path === "sideline") xs.push(365), ys.push(105);
  if (letters || d.techs) ys.push(132);
  const minX = Math.max(0, Math.min(...xs) - 30);
  const maxX = Math.min(400, Math.max(...xs) + 30);
  const minY = Math.min(...ys) - 12;
  const nearY = Math.max(qb.y, rb.y, d.lead ? 257 : 0, ...(d.defenders ?? []).flatMap((p) => [p.y, p.to?.[1] ?? p.y])) + 14;

  const people: Person[] = [
    ...LX.map((x, i) => ({ x, y: 208, side: "off" as const, l: LPOS[i], hl: pullIdx.has(i), muted: i === 5 })),
    { x: qb.x, y: qb.y, side: "off", l: "QB" },
    { x: rb.x, y: rb.y, side: "off", l: "RB" },
    ...(d.lead ? [{ x: 200, y: 257, side: "off" as const, l: "FB" }] : []),
    ...(d.defenders ?? []).map((p) => toPerson(p, "def")),
  ];

  return (
    <BroadcastField region={{ x0: minX, x1: maxX, y0: minY, y1: Math.min(296, nearY) }} scale={1.18} people={people} los={196} label={d.label ?? "Line of scrimmage diagram"} chip={d.label}>
      {d.box ? <PRect className="rbiq-box" x={118} y={138} width={214} height={60} /> : null}
      {d.gap ? <PRect className="rbiq-gap" x={GAP_X[d.gap] - 13} y={150} width={26} height={62} /> : null}
      {letters
        ? Object.entries(GAP_X).map(([k, x]) => (
            <PText key={k} className="rbiq-gap__letter" x={x} y={186} size={20}>
              {k[0]}
            </PText>
          ))
        : null}
      {d.techs
        ? TECHS.map(([t, x, y]) => (
            <g key={t}>
              <PLine className="rbiq-tech__tick" x1={x} x2={x} y1={y + 3} y2={196} />
              <PText className="rbiq-tech" x={x} y={y} size={10}>
                {t}
              </PText>
            </g>
          ))
        : null}
      {(d.doubles ?? []).map(([a, b]) => (
        <PPath key={`${a}-${b}`} className="rbiq-double" d={`M${LX[a]} 198 L ${(LX[a] + LX[b]) / 2} 186 L ${LX[b]} 198`} />
      ))}
      {d.zone
        ? LX.slice(0, 5).map((x) => (
            <PLine key={x} className="rbiq-step" x1={x} y1={198} x2={x + (d.zone === "R" ? 12 : -12)} y2={186} markerEnd="url(#rbiq-arrow)" />
          ))
        : null}
      {(d.pullers ?? []).map((p, i) => (
        <PPath
          key={i}
          className="rbiq-pull"
          d={`M${LX[p.from]} 218 L ${LX[p.from]} ${226 + i * 6} L ${p.to} ${226 + i * 6} L ${p.to} 194`}
          markerEnd="url(#rbiq-arrow-gold)"
        />
      ))}
      {d.draw
        ? LX.slice(0, 5).map((x) => (
            <PLine key={`set${x}`} className="rbiq-step" x1={x} y1={216} x2={x} y2={228} markerEnd="url(#rbiq-arrow)" />
          ))
        : null}
      {d.draw ? <PLine className="rbiq-move" x1={200} y1={246} x2={200} y2={262} markerEnd="url(#rbiq-arrow)" /> : null}
      {d.draw ? (
        <>
          <PLine className="rbiq-move rbiq-move--hl" x1={158} y1={186} x2={132} y2={230} markerEnd="url(#rbiq-arrow-gold)" />
          <PLine className="rbiq-move rbiq-move--hl" x1={272} y1={186} x2={300} y2={230} markerEnd="url(#rbiq-arrow-gold)" />
        </>
      ) : null}
      {d.lead ? <PPath className="rbiq-pull" d={`M200 249 Q ${aimX ?? 245} 236 ${aimX ?? 245} 200 L 245 168`} markerEnd="url(#rbiq-arrow-gold)" /> : null}
      {d.pitch ? <PLine className="rbiq-pitch" x1={qb.x + 6} y1={qb.y + 4} x2={242} y2={264} /> : null}
      {rbPath}
      {(d.defenders ?? []).map((p: Def, i) => (
        <g key={i}>
          {p.to ? (
            <PLine className={p.hl ? "rbiq-move rbiq-move--hl" : "rbiq-move"} x1={p.x} y1={p.y} x2={p.to[0]} y2={p.to[1]} markerEnd={p.hl ? "url(#rbiq-arrow-gold)" : "url(#rbiq-arrow)"} />
          ) : null}
          {p.man ? <PLine className="rbiq-man" x1={p.x} y1={p.y} x2={rb.x} y2={rb.y - 8} /> : null}
        </g>
      ))}
    </BroadcastField>
  );
}

/* ---------- formation pictures for situation questions ---------- */

type FormSpec = Extract<DiagramSpec, { kind: "formation" }>;
type O = { x: number; y: number; r: "wr" | "te" | "back" | "qb" };
// Offensive sets. Line: LT 140, LG 170, C 200, RG 230, RT 260 (y 208). Strength is to the right.

const SETS: Record<FormSpec["set"], O[]> = {
  "2te": [
    { x: 30, y: 207, r: "wr" }, { x: 370, y: 207, r: "wr" }, { x: 112, y: 208, r: "te" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 234, r: "qb" }, { x: 200, y: 268, r: "back" },
  ],
  goal: [
    { x: 112, y: 208, r: "te" }, { x: 288, y: 208, r: "te" }, { x: 312, y: 224, r: "te" },
    { x: 200, y: 234, r: "qb" }, { x: 200, y: 254, r: "back" }, { x: 200, y: 276, r: "back" },
  ],
  "4wr": [
    { x: 25, y: 207, r: "wr" }, { x: 80, y: 210, r: "wr" }, { x: 320, y: 210, r: "wr" }, { x: 375, y: 207, r: "wr" },
    { x: 200, y: 252, r: "qb" }, { x: 230, y: 252, r: "back" },
  ],
  gun3: [
    { x: 25, y: 207, r: "wr" }, { x: 330, y: 210, r: "wr" }, { x: 375, y: 207, r: "wr" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 252, r: "qb" }, { x: 230, y: 252, r: "back" },
  ],
  "11": [
    { x: 25, y: 207, r: "wr" }, { x: 330, y: 210, r: "wr" }, { x: 375, y: 207, r: "wr" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 234, r: "qb" }, { x: 200, y: 268, r: "back" },
  ],
  i: [
    { x: 30, y: 207, r: "wr" }, { x: 370, y: 207, r: "wr" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 232, r: "qb" }, { x: 200, y: 252, r: "back" }, { x: 200, y: 276, r: "back" },
  ],
  pistol: [
    { x: 25, y: 207, r: "wr" }, { x: 330, y: 210, r: "wr" }, { x: 375, y: 207, r: "wr" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 242, r: "qb" }, { x: 200, y: 270, r: "back" },
  ],
  flexbone: [
    { x: 40, y: 207, r: "wr" }, { x: 360, y: 207, r: "wr" }, { x: 118, y: 222, r: "back" }, { x: 282, y: 222, r: "back" },
    { x: 200, y: 232, r: "qb" }, { x: 200, y: 256, r: "back" },
  ],
  empty: [
    { x: 25, y: 207, r: "wr" }, { x: 72, y: 210, r: "wr" }, { x: 312, y: 210, r: "back" }, { x: 345, y: 212, r: "wr" }, { x: 378, y: 207, r: "wr" },
    { x: 200, y: 252, r: "qb" },
  ],
  "22": [
    { x: 30, y: 207, r: "wr" }, { x: 112, y: 208, r: "te" }, { x: 288, y: 208, r: "te" },
    { x: 200, y: 232, r: "qb" }, { x: 200, y: 252, r: "back" }, { x: 200, y: 276, r: "back" },
  ],
  trips: [
    { x: 25, y: 207, r: "wr" }, { x: 302, y: 212, r: "wr" }, { x: 340, y: 210, r: "wr" }, { x: 378, y: 207, r: "wr" },
    { x: 200, y: 252, r: "qb" }, { x: 170, y: 252, r: "back" },
  ],
};

export function FormationField({ d }: { d: FormSpec }) {
  const offense = SETS[d.set];
  const spread = d.set === "4wr" || d.set === "gun3" || d.set === "empty" || d.set === "trips";
  const heavy = d.set === "goal" || d.set === "2te" || d.set === "i" || d.set === "flexbone" || d.set === "22";
  const front: Def[] = [
    { x: d.rush ? 128 : 152, y: 190, l: "E", hl: d.rush, to: d.rush ? [104, 236] : undefined },
    { x: 186, y: 190 },
    { x: 216, y: 190 },
    { x: d.rush ? 272 : 248, y: 190, l: "E", hl: d.rush, to: d.rush ? [300, 236] : undefined },
  ];
  const lbs: Def[] = spread
    ? [{ x: 175, y: 160, l: "W" }, { x: 225, y: 160, l: "M" }, { x: 330, y: 172, l: "N" }]
    : heavy
      ? [{ x: 150, y: 160, l: "W" }, { x: 200, y: 158, l: "M" }, { x: 250, y: 160, l: "S" }, { x: 290, y: 168, l: "S" }]
      : [{ x: 165, y: 160, l: "W" }, { x: 205, y: 158, l: "M" }, { x: 245, y: 160, l: "S" }];
  const box = (p: Def): Def => ({ ...p, hl: p.hl || (d.box && p.x > 110 && p.x < 300) });
  const safeties: Def[] =
    d.safety === "one"
      ? [{ x: 200, y: 82, l: "F" }]
      : d.safety === "down"
        ? [{ x: 200, y: 82, l: "F" }, { x: 290, y: 92, l: "S", hl: true, to: [272, 150] }]
        : heavy
          ? [{ x: 200, y: 92, l: "F" }]
          : [{ x: 120, y: 88, l: "S" }, { x: 280, y: 88, l: "S" }];
  const corners: Def[] = [{ x: offense[0].x, y: 180, l: "C" }, { x: Math.max(...offense.filter((o) => o.r === "wr" || o.r === "te").map((o) => o.x)), y: 180, l: "C" }];
  const defs =
    d.defense === "none"
      ? []
      : d.defenders
        ? d.defenders
        : [...front, ...lbs].map(box).concat(safeties, d.set === "goal" ? [] : corners);
  const hlRole = d.hl === "te" ? "te" : d.hl === "wr" ? "wr" : d.hl === "backs" ? "back" : d.hl === "qb" ? "qb" : null;
  const ROUTE_CLASS = { route: "rbiq-route", pull: "rbiq-pull", run: "rbiq-path", pitch: "rbiq-pitch", motion: "rbiq-motion" } as const;

  const backs = offense.filter((o) => o.r === "back");
  const people: Person[] = [
    ...LX.slice(0, 5).map((x) => ({ x, y: 208, side: "off" as const })),
    ...offense.map((o) => {
      const label =
        o.r === "te" ? "TE" : o.r === "qb" ? "QB" : o.r === "wr" ? "WR"
        : d.set === "flexbone" && o.y < 230 ? "SB"
        : backs.length > 1 && o.y < 262 ? "FB" : "RB";
      return { x: o.x, y: o.y, side: "off" as const, l: label, hl: hlRole === o.r };
    }),
    ...defs.map((p) => toPerson(p, "def")),
  ];

  return (
    <BroadcastField region={{ x0: 6, x1: 394, y0: 66, y1: Math.max(...offense.map((o) => o.y)) + 12 }} scale={1.3} people={people} los={198} label="Offensive formation and defensive front" chip={d.label}>
      {d.box ? <PRect className="rbiq-box" x={112} y={138} width={196} height={60} /> : null}
      {(d.routes ?? []).map((r, i) => {
        const k = r.kind ?? "route";
        const cls = `${ROUTE_CLASS[k]}${r.hl ? " rbiq-route--hl" : ""}`;
        const marker = k === "pitch" ? undefined : r.hl || k === "pull" ? "url(#rbiq-arrow-gold)" : k === "run" ? "url(#rbiq-arrow-red)" : "url(#rbiq-arrow)";
        return <PPoly key={`rt${i}`} className={cls} pts={r.pts} markerEnd={marker} />;
      })}
      {defs.map((p, i) =>
        p.to ? <PLine key={i} className={p.hl ? "rbiq-move rbiq-move--hl" : "rbiq-move"} x1={p.x} y1={p.y} x2={p.to[0]} y2={p.to[1]} markerEnd={p.hl ? "url(#rbiq-arrow-gold)" : "url(#rbiq-arrow)"} /> : null,
      )}
    </BroadcastField>
  );
}

export function GapField({ gap, letters }: { gap: string; letters: boolean }) {
  return <PlayField d={{ kind: "play", gap, aim: gap }} letters={letters} />;
}

export function DiagramView({ d, letters = false }: { d: DiagramSpec; letters?: boolean }) {
  if (d.kind === "coverage") return <CoverageField id={d.id} view={d.view} motion={d.motion} trips={d.trips} rotate={d.rotate} />;
  if (d.kind === "gap") return <GapField gap={d.gap} letters={letters} />;
  if (d.kind === "formation") return <FormationField d={d} />;
  return <PlayField d={d} letters={letters} />;
}

/* ---------- situation scoreboard + field position strip ---------- */

function yardFromOwnGoal(ball: string): number | null {
  const m = /^(Own|Opp)\s+(\d+)/i.exec(ball.trim());
  if (!m) return null;
  const n = Number(m[2]);
  return m[1].toLowerCase() === "own" ? n : 100 - n;
}

function toGo(down: string): number | "goal" | null {
  const m = /&\s*(Goal|\d+)/i.exec(down);
  if (!m) return null;
  return m[1].toLowerCase() === "goal" ? "goal" : Number(m[1]);
}

export function FieldStrip({ s }: { s: Situation }) {
  const pos = yardFromOwnGoal(s.ball);
  if (pos === null) return null;
  const x = (yd: number) => 30 + (yd / 100) * 340;
  const dist = toGo(s.down);
  const lineTo = dist === "goal" ? 100 : typeof dist === "number" ? Math.min(100, pos + dist) : null;
  const marks = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <svg className="rbiq-strip" viewBox="0 0 400 54" role="img" aria-label={`Ball on ${s.ball}, driving right`}>
      <rect className="rbiq-strip__turf" x="30" y="8" width="340" height="38" />
      <rect className="rbiq-strip__ez" x="0" y="8" width="30" height="38" />
      <rect className="rbiq-strip__ez rbiq-strip__ez--opp" x="370" y="8" width="30" height="38" />
      {marks.map((m) => (
        <g key={m}>
          <line className="rbiq-strip__yard" x1={x(m)} x2={x(m)} y1="8" y2="46" />
          <text className="rbiq-strip__num" x={x(m)} y="42" textAnchor="middle">
            {m <= 50 ? m : 100 - m}
          </text>
        </g>
      ))}
      {lineTo !== null && lineTo > pos ? <rect className="rbiq-strip__gain" x={x(pos)} y="8" width={x(lineTo) - x(pos)} height="38" /> : null}
      {lineTo !== null ? <line className="rbiq-strip__fd" x1={x(lineTo)} x2={x(lineTo)} y1="4" y2="50" /> : null}
      <line className="rbiq-strip__los" x1={x(pos)} x2={x(pos)} y1="4" y2="50" />
      <ellipse className="rbiq-strip__ball" cx={x(pos)} cy="20" rx="7" ry="4.5" />
      <text className="rbiq-strip__label" x="15" y="31" textAnchor="middle">
        OWN
      </text>
      <text className="rbiq-strip__label" x="385" y="31" textAnchor="middle">
        OPP
      </text>
    </svg>
  );
}

export function SituationBoard({ s }: { s: Situation }) {
  const hl = (k: "down" | "ball" | "score" | "clock") => (s.hl?.includes(k) ? "true" : undefined);
  return (
    <div className="rbiq-board" role="group" aria-label="Game situation">
      <div className="rbiq-board__row">
        <div className="rbiq-board__cell rbiq-board__cell--down" data-hl={hl("down")}>
          <span>Down</span>
          <strong>{s.down}</strong>
        </div>
        <div className="rbiq-board__cell" data-hl={hl("ball")}>
          <span>Ball on</span>
          <strong>{s.ball}</strong>
        </div>
        <div className="rbiq-board__cell" data-hl={hl("score")}>
          <span>Score</span>
          <strong>{s.score}</strong>
        </div>
        <div className="rbiq-board__cell" data-hl={hl("clock")}>
          <span>Clock</span>
          <strong>{s.clock}</strong>
        </div>
      </div>
      <FieldStrip s={s} />
      {s.extra ? <p className="rbiq-board__extra">{s.extra}</p> : null}
    </div>
  );
}
