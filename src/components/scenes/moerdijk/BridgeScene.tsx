"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import {
  bridgeParts,
  bridgeShapes,
  bridgeSlots,
  crossing,
  moerdijkTexts,
  trayLayout,
} from "@/content/moerdijk";
import type { BridgeState } from "@/game/bridge";
import MinouSprite from "@/components/MinouSprite";
import type { HeroMood } from "@/components/MinouHero";
import RiverScenery from "./RiverScenery";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };

const shapeD = (id: string) => bridgeShapes.find((s) => s.id === id)!.d;

export type MinouPose = "idle" | "crossing";

interface Props {
  state: BridgeState;
  selectedId: string | null;
  /** Onderdeel dat net verkeerd geplaatst is (schudt kort). */
  shakeId: string | null;
  /** Interactie mogelijk? (false tijdens dialogen en na voltooiing). */
  interactive: boolean;
  complete: boolean;
  minou: MinouPose;
  /** Gezichtsuitdrukking van Minou (alleen weergave). */
  minouMood?: HeroMood;
  onPart: (partId: string) => void;
  onSlot: (slotId: string) => void;
  onCrossEnd: () => void;
}

const SPARKS = [0, 1, 2, 3, 4, 5, 6, 7];
/** Lijndikte zodat Minou hier even dik getekend is als in Rotterdam (1.3 / schaal). */
const MINOU_LINE = 1.3 / crossing.scale;

/**
 * De hele brugscène in één vaste SVG (viewBox 1600 × 900). Onderdelen en
 * openingen gebruiken dezelfde vormdefinities; klikken werkt op stabiele ID's
 * en is onafhankelijk van schermgrootte.
 */
export default function BridgeScene({ state, selectedId, shakeId, interactive, complete, minou, minouMood = "neutral", onPart, onSlot, onCrossEnd }: Props) {
  const placedParts = new Set(Object.values(state.placed));
  const keyActivate = (fn: () => void) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <svg
      className={complete ? "bridge-svg bridge-done" : "bridge-svg"}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="De kapotte Moerdijkbrug over het Hollands Diep"
    >
      <defs>
        <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a5c" />
          <stop offset="1" stopColor="#e0642a" />
        </linearGradient>
        {/* klinknagels op de stalen onderdelen (patroon volgt de vorm vanzelf) */}
        <pattern id="rivets" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1.6" fill="#8a3a14" opacity={0.55} />
          <circle cx="7.4" cy="7.4" r="0.7" fill="#ffd2b0" opacity={0.8} />
        </pattern>
        <radialGradient id="mo-vignette" cx=".5" cy=".45" r=".75">
          <stop offset=".65" stopColor="#1f3a5a" stopOpacity="0" />
          <stop offset="1" stopColor="#1f3a5a" stopOpacity=".32" />
        </radialGradient>
        <linearGradient id="bench-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d99a58" />
          <stop offset="1" stopColor="#b97a3f" />
        </linearGradient>
      </defs>

      <RiverScenery />

      {/* voorgrond: Brabantse oever met werkbank voor de onderdelen */}
      <path d="M0 636 Q300 600 580 640 Q800 676 830 760 L810 900 H0Z" fill="#7acb63" {...O} />
      <path d="M0 656 Q300 626 560 662 Q760 694 800 770" fill="none" stroke="#a6e58c" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      {[[20, 650], [300, 626], [600, 652]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l6 -18 l4 16 l6 -22 l4 22 l6 -14 l2 16`} fill="#4fa83f" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      ))}
      <ellipse cx={430} cy={904} rx={400} ry={20} fill="#2b1b3d" opacity={0.25} />
      <rect x={56} y={668} width={748} height={232} rx={14} fill="url(#bench-top)" {...O} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${60} ${700 + i * 60} H800`} stroke="#a96d33" strokeWidth={4} opacity={0.7} />)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 230} ${672} q30 20 0 40 q-30 24 10 60`} fill="none" stroke="#a96d33" strokeWidth={2} opacity={0.35} />)}
      <rect x={60} y={672} width={740} height={6} rx={3} fill="#f0b878" opacity={0.7} />
      {[[60, 668], [790, 668]].map(([x, y]) => <rect key={x} x={x - 8} y={y - 6} width={20} height={240} fill="#a96d33" {...O} />)}
      {[[870, 800], [900, 840]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={7} fill="#fff" opacity={0.9} />)}

      {/* openingen in de brug */}
      {bridgeSlots.map((slot, i) => {
        const filled = slot.id in state.placed;
        if (filled) return null;
        const armed = interactive && selectedId !== null;
        return (
          <g
            key={slot.id}
            transform={`translate(${slot.x} ${slot.y}) scale(${slot.scale})`}
            className={armed ? "slot slot-armed" : "slot"}
            role="button"
            tabIndex={armed ? 0 : -1}
            aria-label={moerdijkTexts.slotLabel(i + 1)}
            aria-disabled={!armed}
            onClick={() => interactive && onSlot(slot.id)}
            onKeyDown={keyActivate(() => interactive && onSlot(slot.id))}
          >
            <path d={shapeD(slot.shapeId)} fill="rgba(20, 36, 70, .45)" stroke="#fff" strokeWidth={3} strokeDasharray="9 7" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* geplaatste onderdelen (klikken vast in de brug) */}
      {bridgeSlots.map((slot) => {
        const partId = state.placed[slot.id];
        if (!partId) return null;
        const part = bridgeParts.find((p) => p.id === partId)!;
        const idx = bridgeParts.indexOf(part);
        const cell = trayLayout.cells[idx];
        const style = {
          "--dx": `${(cell.x - slot.x) / slot.scale}px`,
          "--dy": `${(cell.y - slot.y) / slot.scale}px`,
          "--r": String(trayLayout.scale / slot.scale),
        } as CSSProperties;
        return (
          <g key={slot.id} transform={`translate(${slot.x} ${slot.y}) scale(${slot.scale})`}>
            <g className="placed-part" style={style}>
              <path d={shapeD(part.shapeId)} fill="url(#steel)" {...O} />
              <path d={shapeD(part.shapeId)} fill="none" stroke="#fff" strokeWidth={2} opacity={0.35} vectorEffect="non-scaling-stroke" transform="scale(.86)" />
              <path d={shapeD(part.shapeId)} fill="url(#rivets)" />
            </g>
            {/* "klik!": eenmalige vonkenkrans zodra het onderdeel vastzit */}
            <g className="snap-sparkle" aria-hidden>
              <circle r={44} fill="none" stroke="#fff6a8" strokeWidth={5} vectorEffect="non-scaling-stroke" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <path key={a} transform={`rotate(${a}) translate(0 -58)`} d="M0 -8 L2.4 -2.4 L8 0 L2.4 2.4 L0 8 L-2.4 2.4 L-8 0 L-2.4 -2.4Z" fill={a % 120 ? "#ffd45e" : "#fff"} stroke={INK} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
        );
      })}

      {/* feestverlichting en glans bij een voltooide brug */}
      <g className="bridge-lights" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} cx={140 + i * 56} cy={394} r={7} fill={["#ffd45e", "#ff5d8f", "#5cc4ee", "#7be87a"][i % 4]} style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
        <rect className="bridge-shine" x={110} y={418} width={90} height={40} fill="#fff" opacity={0.0} />
      </g>

      {/* onderdelen op de oever */}
      {bridgeParts.map((part, i) => {
        if (placedParts.has(part.id)) return null;
        const cell = trayLayout.cells[i];
        const selected = selectedId === part.id;
        return (
          <g key={part.id} transform={`translate(${cell.x} ${cell.y}) scale(${trayLayout.scale})`}>
            <g
              className={["bpart", selected ? "is-selected" : "", shakeId === part.id ? "shake" : "", interactive ? "" : "is-locked"].join(" ")}
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-label={moerdijkTexts.partLabel(i + 1)}
              aria-pressed={selected}
              onClick={() => interactive && onPart(part.id)}
              onKeyDown={keyActivate(() => interactive && onPart(part.id))}
            >
              <rect x={-64} y={-64} width={128} height={128} fill="transparent" />
              <path d={shapeD(part.shapeId)} fill="url(#steel)" {...O} />
              <path d={shapeD(part.shapeId)} fill="none" stroke="#fff" strokeWidth={2} opacity={0.35} vectorEffect="non-scaling-stroke" transform="scale(.86)" />
              <path d={shapeD(part.shapeId)} fill="url(#rivets)" />
            </g>
          </g>
        );
      })}

      {/* Minou: staat links op de oever en steekt na de reparatie over */}
      <g transform={`translate(${crossing.startX} ${crossing.y}) scale(${crossing.scale})`}>
        <g
          className={minou === "crossing" ? "minou-marker minou-cross" : "minou-marker"}
          data-walking={minou === "crossing" ? "true" : "false"}
          data-facing="right"
          style={{ "--cross": `${(crossing.endX - crossing.startX) / crossing.scale}px` } as CSSProperties}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && minou === "crossing") onCrossEnd();
          }}
        >
          <MinouSprite mood={minouMood} arms={complete && minou !== "crossing" ? "cheer" : "down"} line={MINOU_LINE} />
        </g>
      </g>

      {/* zacht vignet voor diepte (niet klikbaar) */}
      <rect width={1600} height={900} fill="url(#mo-vignette)" pointerEvents="none" aria-hidden />

      {/* succes-vonken bij de voltooide brug */}
      {complete && (
        <g className="bridge-sparks" transform="translate(800 330)" aria-hidden>
          {SPARKS.map((i) => (
            <text key={i} className="burst-star" style={{ "--a": `${i * 45}deg` } as CSSProperties} textAnchor="middle">
              {i % 2 ? "★" : "✦"}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
