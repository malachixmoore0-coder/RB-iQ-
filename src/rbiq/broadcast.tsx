/**
 * Broadcast camera renderer. Diagrams are authored in flat "field" coordinates
 * (x 0..400 across the field, y grows toward the offense's backfield; the line of
 * scrimmage sits near y 200). This module projects them into a behind-the-offense
 * perspective view: turf, yard lines and zones lie on the ground plane, and players
 * stand up as figures that shrink with depth.
 */
import { createContext, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";

export const VW = 400;
export const VH = 300;
const DF = 1.65; // far edge is ~2x farther than the near edge
const NEAR_Y = 292; // screen y of the near edge of the region
const FAR_Y = 74; // screen y of the far edge of the region
const K = (NEAR_Y - FAR_Y) / (1 - 1 / DF);
const HZ = NEAR_Y - K;

export interface Region {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Proj {
  (x: number, y: number): { x: number; y: number; s: number };
}

export function makeProj(r: Region): Proj {
  const cx = (r.x0 + r.x1) / 2;
  const sx = (VW * 0.97) / (r.x1 - r.x0);
  return (x, y) => {
    const t = (y - r.y0) / (r.y1 - r.y0);
    const d = Math.max(0.35, 1 + (1 - t) * (DF - 1));
    return { x: VW / 2 + ((x - cx) * sx) / d, y: HZ + K / d, s: sx / d };
  };
}

const Ctx = createContext<Proj>((x, y) => ({ x, y, s: 1 }));
const useP = () => useContext(Ctx);

const pt = (p: { x: number; y: number }) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;

/* ---------- ground-plane primitives ---------- */

type Common = { className?: string; markerEnd?: string; style?: CSSProperties };

export function PLine({ x1, y1, x2, y2, ...rest }: Common & { x1: number; y1: number; x2: number; y2: number }) {
  const P = useP();
  const a = P(x1, y1);
  const b = P(x2, y2);
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...rest} />;
}

export function PPath({ d, ...rest }: Common & { d: string }) {
  const P = useP();
  const out = d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (_, a: string, b: string) => {
    const p = P(Number(a), Number(b));
    return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });
  return <path d={out} fill="none" {...rest} />;
}

export function PPoly({ pts, closed, ...rest }: Common & { pts: [number, number][]; closed?: boolean }) {
  const P = useP();
  const s = pts.map(([x, y]) => pt(P(x, y))).join(" ");
  return closed ? <polygon points={s} {...rest} /> : <polyline points={s} fill="none" {...rest} />;
}

export function PEllipse({ cx, cy, rx, ry, ...rest }: Common & { cx: number; cy: number; rx: number; ry: number }) {
  const n = 28;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
  return <PPoly pts={pts} closed {...rest} />;
}

export function PRect({ x, y, width, height, ...rest }: Common & { x: number; y: number; width: number; height: number }) {
  return (
    <PPoly
      pts={[
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ]}
      closed
      {...rest}
    />
  );
}

export function PText({ x, y, size = 12, children, className }: { x: number; y: number; size?: number; children: ReactNode; className?: string }) {
  const P = useP();
  const p = P(x, y);
  return (
    <text x={p.x} y={p.y} className={className} textAnchor="middle" style={{ fontSize: size * p.s }}>
      {children}
    </text>
  );
}

/* ---------- players ---------- */

export interface Person {
  x: number;
  y: number;
  side: "off" | "def";
  l?: string;
  hl?: boolean;
  muted?: boolean;
}

function Figure({ p, P, scale }: { p: Person; P: Proj; scale: number }) {
  const g = P(p.x, p.y);
  const u = g.s * scale;
  const off = p.side === "off";
  const label = p.l ?? "";
  const cls = `rbiq-fig rbiq-fig--${p.side}${p.hl ? " rbiq-fig--hl" : ""}${p.muted ? " rbiq-fig--muted" : ""}`;
  const txt = label.length > 2 ? 4.4 : 5.6;
  return (
    <g className={cls} transform={`translate(${g.x.toFixed(1)} ${g.y.toFixed(1)}) scale(${u.toFixed(3)} ${(u * 0.8).toFixed(3)})`}>
      {p.hl ? <ellipse className="rbiq-fig__glow" cx="0" cy="0" rx="15" ry="5" /> : null}
      <ellipse className="rbiq-fig__shadow" cx="1.5" cy="0.5" rx="9" ry="2.6" />
      {/* legs + cleats */}
      <rect className="rbiq-fig__pants" x="-6" y="-12" width="4.6" height="11" rx="1.6" />
      <rect className="rbiq-fig__pants" x="1.4" y="-12" width="4.6" height="11" rx="1.6" />
      <rect className="rbiq-fig__cleat" x="-6.4" y="-1.8" width="5.4" height="2" rx="0.8" />
      <rect className="rbiq-fig__cleat" x="1" y="-1.8" width="5.4" height="2" rx="0.8" />
      {/* arms */}
      <rect className="rbiq-fig__arm" x="-11" y="-23" width="3.6" height="11" rx="1.6" />
      <rect className="rbiq-fig__arm" x="7.4" y="-23" width="3.6" height="11" rx="1.6" />
      {/* torso + pads */}
      <rect className="rbiq-fig__jersey" x="-8" y="-24" width="16" height="14" rx="3" />
      <ellipse className="rbiq-fig__jersey" cx="0" cy="-23" rx="9.6" ry="3.4" />
      {label && off ? (
        <text className="rbiq-fig__num" x="0" y="-14.4" textAnchor="middle" style={{ fontSize: txt }}>
          {label}
        </text>
      ) : null}
      {/* helmet */}
      <circle className="rbiq-fig__helmet" cx="0" cy="-30" r="5.4" />
      {off ? (
        <rect className="rbiq-fig__stripe" x="-0.8" y="-35.3" width="1.6" height="10.6" />
      ) : (
        <>
          <path className="rbiq-fig__mask" d="M-3.6 -29.2 H3.6 M-3.2 -27 H3.2 M0 -29.2 V-25.4" />
        </>
      )}
      {/* defender badge */}
      {!off && label ? (
        <g className="rbiq-fig__badge">
          <circle cx="0" cy="-45" r="7" />
          <text x="0" y={label.length > 2 ? -43.4 : -42.8} textAnchor="middle" style={{ fontSize: label.length > 2 ? 5 : 6.6 }}>
            {label}
          </text>
        </g>
      ) : null}
      {off && p.hl && label ? (
        <g className="rbiq-fig__badge rbiq-fig__badge--off">
          <circle cx="0" cy="-45" r="7" />
          <text x="0" y={label.length > 2 ? -43.4 : -42.8} textAnchor="middle" style={{ fontSize: label.length > 2 ? 5 : 6.6 }}>
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

/* ---------- the field ---------- */

export function BroadcastField({
  region,
  people,
  children,
  label,
  chip,
  los = 200,
  scale = 1,
}: {
  region: Region;
  people: Person[];
  children?: ReactNode;
  label: string;
  chip?: string;
  los?: number;
  scale?: number;
}) {
  const P = makeProj(region);
  const span = region.y1 - region.y0;
  const yTop = region.y0 - span * 0.42;
  const yBot = region.y1 + 40;
  const xL = region.x0 - 420;
  const xR = region.x1 + 420;
  // mowing stripes every 5 yards (50 units) anchored on the line of scrimmage
  const stripes: number[] = [];
  for (let y = los - 50 * 12; y < yBot; y += 50) if (y + 50 > yTop) stripes.push(y);
  const ticks: number[] = [];
  for (let y = los - 300; y < yBot; y += 10) if (y > yTop && y % 50 !== los % 50) ticks.push(y);
  const turfTop = P(0, yTop).y;
  const sorted = [...people].sort((a, b) => a.y - b.y);

  return (
    <svg className="rbiq-field rbiq-field--bc" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={label}>
      <defs>
        <linearGradient id="bc-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#050b1c" />
          <stop offset="1" stopColor="#14203d" />
        </linearGradient>
        <linearGradient id="bc-turf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1d4a2a" />
          <stop offset="1" stopColor="#2f6e3a" />
        </linearGradient>
        <radialGradient id="bc-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffd56b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd56b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-vignette" cx="0.5" cy="0.6" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <pattern id="bc-crowd" width="6" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#2a3b63" />
          <circle cx="4.5" cy="3.6" r="1" fill="#3a2a4a" />
        </pattern>
        <marker id="rbiq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" className="rbiq-arrowhead" />
        </marker>
        <marker id="rbiq-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" className="rbiq-arrowhead rbiq-arrowhead--red" />
        </marker>
        <marker id="rbiq-arrow-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" className="rbiq-arrowhead rbiq-arrowhead--gold" />
        </marker>
      </defs>
      {/* stadium */}
      <rect x="0" y="0" width={VW} height={VH} fill="url(#bc-sky)" />
      <rect x="0" y={Math.max(0, turfTop - 26)} width={VW} height="28" fill="url(#bc-crowd)" opacity="0.9" />
      <circle cx="40" cy={Math.max(8, turfTop - 34)} r="26" fill="url(#bc-light)" />
      <circle cx="360" cy={Math.max(8, turfTop - 34)} r="26" fill="url(#bc-light)" />
      <Ctx.Provider value={P}>
        {/* turf + mowing stripes */}
        <PRect x={xL} y={yTop} width={xR - xL} height={yBot - yTop} style={{ fill: "url(#bc-turf)" }} />
        {stripes.map((y, i) =>
          i % 2 ? <PRect key={y} x={xL} y={Math.max(y, yTop)} width={xR - xL} height={50} className="rbiq-bc__stripe" /> : null,
        )}
        {stripes.map((y) => (y > yTop ? <PLine key={`yl${y}`} x1={xL} x2={xR} y1={y} y2={y} className="rbiq-bc__yard" /> : null))}
        {ticks.map((y) => (
          <g key={`t${y}`}>
            <PLine x1={147} x2={153} y1={y} y2={y} className="rbiq-bc__hash" />
            <PLine x1={247} x2={253} y1={y} y2={y} className="rbiq-bc__hash" />
          </g>
        ))}
        <PLine x1={xL} x2={xR} y1={los} y2={los} className="rbiq-bc__los" />
        {children}
        {sorted.map((p, i) => (
          <Figure key={i} p={p} P={P} scale={scale} />
        ))}
      </Ctx.Provider>
      <rect x="0" y="0" width={VW} height={VH} fill="url(#bc-vignette)" pointerEvents="none" />
      {chip ? (
        <g className="rbiq-chip">
          <rect x={8} y={8} width={chip.length * 6.6 + 18} height={20} rx="3" />
          <text x={17} y={22}>
            {chip.toUpperCase()}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
