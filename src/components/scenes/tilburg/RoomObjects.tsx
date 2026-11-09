"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent, Ref } from "react";
import type { RoomItem } from "@/content/tilburg";
import { itemArt } from "./itemArt";

export interface FlyVector {
  dx: number;
  dy: number;
}

interface Props {
  svgRef?: Ref<SVGSVGElement>;
  items: readonly RoomItem[];
  collected: readonly string[];
  vectors: Record<string, FlyVector>;
  shakeId: string | null;
  /** Wanneer true reageren de voorwerpen niet (intro, dialoog, afsluiting). */
  locked: boolean;
  onPick: (target: Element, id: string) => void;
}

/** Klikbare voorwerpen, op hun vaste plek in de kamer (zelfde 1600 × 900 als de achtergrond). */
export default function RoomObjects({ svgRef, items, collected, vectors, shakeId, locked, onPick }: Props) {
  const ordered = [...items].sort((a, b) => a.layer - b.layer);
  return (
    <svg ref={svgRef} className="room-objects" viewBox="0 0 1600 900" preserveAspectRatio="none" role="group" aria-label="Voorwerpen in de slaapkamer">
      {ordered.map((item) => {
        const art = itemArt[item.art];
        const done = collected.includes(item.id);
        const scale = item.scale ?? 1;
        const v = vectors[item.id];
        const cls = ["obj", `obj-${item.motion ?? "pop"}`, done ? "is-collected" : "", locked ? "is-locked" : "", shakeId === item.id ? "is-wrong" : ""].join(" ");
        const style = done && v ? ({ "--dx": `${v.dx / scale}px`, "--dy": `${v.dy / scale}px` } as CSSProperties) : undefined;
        return (
          <g key={item.id} transform={`translate(${item.x} ${item.y}) scale(${scale})`}>
            {/* contactschaduw (blijft liggen en vervaagt als het voorwerp in de tas vliegt) */}
            <ellipse className={done ? "obj-shadow is-gone" : "obj-shadow"} cx={0} cy={-1} rx={art.w * 0.42} ry={5} fill="rgba(60,20,40,.28)" />
            {done && (
              <g className="obj-sparkle" aria-hidden>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <g key={a} transform={`rotate(${a} 0 ${-art.h / 2})`}>
                    <path className="obj-sparkle-ray" d={`M0 ${-art.h / 2 - 20} l3 8 l-3 8 l-3 -8z`} fill={a % 90 ? "#ff8fb3" : "#ffd45e"} />
                  </g>
                ))}
                <circle className="obj-sparkle-ring" cx={0} cy={-art.h / 2} r={art.w * 0.45} fill="none" stroke="#ffd45e" strokeWidth={4} />
              </g>
            )}
            <g
              className={cls}
              style={style}
              data-category={item.category}
              role="button"
              tabIndex={done || locked ? -1 : 0}
              aria-label={item.label}
              aria-disabled={done || locked}
              onClick={(e: MouseEvent<SVGGElement>) => onPick(e.currentTarget, item.id)}
              onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(e.currentTarget, item.id);
                }
              }}
            >
              <rect className="obj-hit" x={-art.w / 2} y={-art.h} width={art.w} height={art.h} fill="transparent" />
              <g className="obj-art">{art.render()}</g>
              <text className="obj-label" y={-art.h - 12} textAnchor="middle">
                {item.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
