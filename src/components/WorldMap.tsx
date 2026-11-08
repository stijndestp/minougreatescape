"use client";

import { memo, useImperativeHandle, useRef, type Ref } from "react";
import type { LocationStatus } from "@/game/progress";
import {
  bridgePoint,
  mapCities,
  mapWaterLabels,
  neighbourPaths,
  optionalLinks,
  provincePaths,
  riverPaths,
  routePoints,
  waterBodyPaths,
} from "@/map/mapData";
import { cameraToViewBox, DEFAULT_CAMERA, type Camera, type Point } from "@/map/projection";
import type { MinouPose } from "@/map/rig";
import MinouSprite from "./MinouSprite";

export interface WorldMapHandle {
  setCamera(camera: Camera): void;
  setMinou(point: Point, pose?: MinouPose): void;
}

export interface CityEffects {
  /** Locatie die net voltooid is (succesanimatie). */
  doneId: string | null;
  /** Locatie die net vrijgespeeld is (oplichten). */
  unlockId: string | null;
  /** Locatie waarop net geklikt is terwijl vergrendeld (schudden). */
  shakeId: string | null;
}

interface Props {
  ref?: Ref<WorldMapHandle>;
  statuses: Record<string, LocationStatus>;
  numbers: Record<string, number>;
  effects: CityEffects;
  /** Beginpositie van Minou; tijdens animaties stuurt de rig het personage. */
  minouAt: Point;
  busy: boolean;
  /** Rood kruis over Leiden: niet getoond, vast getoond, of met korte tekenanimatie. */
  leidenCross: "hidden" | "static" | "animate";
  onSelectCity: (id: string) => void;
}

const PROVINCE_COLORS: Record<string, string> = {
  "Zuid-Holland": "#ffd45e",
  "Noord-Brabant": "#9fe07f",
  Zeeland: "#7fe0c8",
  Utrecht: "#ff9fc0",
  Gelderland: "#c7a6f5",
  "Noord-Holland": "#ffb07a",
  Limburg: "#f5c08f",
  Flevoland: "#d5ee8c",
};

const MAJOR_RIVERS = new Set([
  "Waal", "Lek", "Maas", "Nieuwe Maas", "Oude Maas", "Nieuwe Merwede",
  "Beneden-Merwede", "Boven-Merwede", "Noord", "Nieuwe Waterweg", "Amer",
  "Bergsche Maas", "Haringvliet",
]);

const WATER = "#5cc4ee";
const WATER_DARK = "#2f9fd0";

const labelOffset = {
  right: { x: 40, y: 10, anchor: "start" },
  left: { x: -40, y: 10, anchor: "end" },
  above: { x: 0, y: -42, anchor: "middle" },
  below: { x: 0, y: 66, anchor: "middle" },
} as const;

const routeD = routePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

/** Statische kaartlagen (geografie, rivieren, route). Wordt nooit opnieuw gerenderd. */
const MapLayers = memo(function MapLayers() {
  return (
    <>
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd6f5" />
          <stop offset="1" stopColor="#4db8e6" />
        </linearGradient>
      </defs>
      <rect x={-2000} y={-2000} width={6000} height={5000} fill="url(#sea)" />

      {neighbourPaths.map((p) => (
        <path key={p.name} d={p.d} fill="#efe4c6" stroke="#efe4c6" strokeWidth={8} strokeLinejoin="round" />
      ))}
      {provincePaths.map((p) => (
        <path key={`shore-${p.name}`} d={p.d} fill="#a9e6fa" stroke="#a9e6fa" strokeWidth={26} strokeLinejoin="round" />
      ))}
      {provincePaths.map((p) => (
        <path
          key={p.name}
          d={p.d}
          fill={PROVINCE_COLORS[p.name] ?? "#d8e8a0"}
          stroke="#fff"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}
      {waterBodyPaths.map((w) => (
        <path key={w.name} d={w.d} fill={WATER} fillRule="evenodd" stroke={WATER_DARK} strokeWidth={5} strokeLinejoin="round" />
      ))}
      {riverPaths.map((r, i) => (
        <path
          key={`${r.name}-${i}-o`}
          d={r.d}
          fill="none"
          stroke={WATER_DARK}
          strokeWidth={MAJOR_RIVERS.has(r.name) ? 13 : 8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {riverPaths.map((r, i) => (
        <path
          key={`${r.name}-${i}-i`}
          d={r.d}
          fill="none"
          stroke={WATER}
          strokeWidth={MAJOR_RIVERS.has(r.name) ? 8 : 4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {mapWaterLabels.map((l) => (
        <text
          key={l.text}
          className={l.kind === "sea" ? "water-label sea-label" : "water-label"}
          x={l.point.x}
          y={l.point.y}
          textAnchor="middle"
        >
          {l.text}
        </text>
      ))}
      {optionalLinks.map(([a, b], i) => (
        <path
          key={i}
          d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
          stroke="#fff"
          strokeWidth={6}
          strokeDasharray="2 14"
          strokeLinecap="round"
          opacity={0.9}
        />
      ))}
      <path d={routeD} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.65} />
      <path d={routeD} fill="none" stroke="#ff3d68" strokeWidth={7} strokeDasharray="3 16" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${bridgePoint.x} ${bridgePoint.y})`} aria-label="Moerdijkbrug">
        <rect x={-24} y={-7} width={48} height={14} rx={4} fill="#ff8a3d" stroke="#fff" strokeWidth={3} />
        <path d="M-18 -7 Q0 -26 18 -7" fill="none" stroke="#fff" strokeWidth={4} />
      </g>
    </>
  );
});

function Padlock() {
  return (
    <g aria-hidden>
      <path d="M-6 -3 V-8 a6 6 0 0 1 12 0 V-3" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
      <rect x={-9} y={-3} width={18} height={14} rx={3} fill="#fff" />
    </g>
  );
}

/** Geïllustreerde kaart van het speelgebied (SVG, lokale GeoJSON-data). */
export default function WorldMap({ ref, statuses, numbers, effects, minouAt, busy, leidenCross, onSelectCity }: Props) {
  const leiden = mapCities.find((c) => c.id === "leiden");
  const svgRef = useRef<SVGSVGElement>(null);
  const minouRef = useRef<SVGGElement>(null);

  useImperativeHandle(ref, () => ({
    setCamera(camera) {
      svgRef.current?.setAttribute("viewBox", cameraToViewBox(camera));
    },
    setMinou(point, pose) {
      const g = minouRef.current;
      if (!g) return;
      g.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      if (pose) {
        g.dataset.walking = String(!!pose.walking);
        g.dataset.facing = pose.facingLeft ? "left" : "right";
      }
    },
  }));

  return (
    <svg
      ref={svgRef}
      className={busy ? "map-svg is-busy" : "map-svg"}
      viewBox={cameraToViewBox(DEFAULT_CAMERA)}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Kaart van West-Brabant en Zuid-Holland"
    >
      <MapLayers />

      {mapCities.map((c) => {
        const off = labelOffset[c.labelSide];
        const optional = c.role === "optional";
        const status: LocationStatus = statuses[c.id] ?? "locked";
        const cls = [
          "loc",
          optional ? "loc-optional" : `loc-${status}`,
          effects.shakeId === c.id ? "shake" : "",
          effects.doneId === c.id ? "just-done" : "",
          effects.unlockId === c.id ? "just-unlocked" : "",
        ].join(" ");
        return (
          <g key={c.id} transform={`translate(${c.point.x} ${c.point.y})`}>
            <g
              className={cls}
              onClick={() => !optional && onSelectCity(c.id)}
              onKeyDown={(e) => {
                if (!optional && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelectCity(c.id);
                }
              }}
              tabIndex={optional ? -1 : 0}
              role={optional ? undefined : "button"}
              aria-disabled={optional ? undefined : status === "locked" || status === "completed"}
              aria-label={optional ? c.name : `${c.name} (${status})`}
            >
              {!optional && <circle r={44} fill="transparent" />}
              {status === "available" && <circle className="pulse" r={30} />}
              {status === "active" && <circle className="ring-active" r={34} />}
              {effects.unlockId === c.id && <circle className="unlock-flash" r={30} />}
              <circle r={optional ? 14 : 24} className="loc-dot" />
              {!optional && status === "locked" && <Padlock />}
              {!optional && status !== "locked" && (
                <text className="loc-num" textAnchor="middle" y={9}>
                  {status === "completed" ? "✓" : numbers[c.id]}
                </text>
              )}
              {effects.doneId === c.id && <circle className="done-burst" r={26} />}
              <text
                className={optional ? "loc-name loc-name-small" : "loc-name"}
                x={off.x}
                y={off.y}
                textAnchor={off.anchor}
              >
                {c.name}
              </text>
            </g>
          </g>
        );
      })}

      {/* Status-icoon bij Leiden: rode marker met wit kruis (afgevallen), zoals de groene vinkjes. Geen klikken. */}
      {leiden && leidenCross !== "hidden" && (
        <g transform={`translate(${leiden.point.x} ${leiden.point.y})`} style={{ pointerEvents: "none" }} aria-hidden>
          <g className={leidenCross === "animate" ? "leiden-mark leiden-mark-anim" : "leiden-mark"}>
            <circle r={24} className="loc-dot" fill="#e5383b" />
            <path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" />
          </g>
        </g>
      )}

      {/* Minou — positie en pose worden tijdens animaties door de rig gezet */}
      <g
        ref={minouRef}
        className="minou-marker"
        data-walking="false"
        data-facing="right"
        transform={`translate(${minouAt.x} ${minouAt.y})`}
        style={{ pointerEvents: "none" }}
      >
        <MinouSprite />
      </g>
    </svg>
  );
}
