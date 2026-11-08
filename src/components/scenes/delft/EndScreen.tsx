"use client";

import type { CSSProperties } from "react";
import { delftTexts, effects } from "@/content/delft";
import { JobArt, MinouArt } from "./DelftCast";

const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 91.7 + salt * 17.3) * 43758.5453;
  return x - Math.floor(x);
};

/** Feestelijk eindscherm: titel, Minou en Job omringd door hartjes en de knop naar het hoofdmenu. */
export default function EndScreen({ onHome }: { onHome: () => void }) {
  const e = delftTexts.end;
  return (
    <div className="finale-end" role="dialog" aria-modal="true" aria-label={e.title}>
      <div className="end-hearts" aria-hidden>
        {Array.from({ length: effects.endHearts }, (_, i) => {
          const angle = (i / effects.endHearts) * Math.PI * 2;
          return (
            <span
              key={i}
              className="end-heart"
              style={
                {
                  left: `${50 + Math.cos(angle) * (30 + rnd(i, 1) * 14)}%`,
                  top: `${60 + Math.sin(angle) * (22 + rnd(i, 2) * 8)}%`,
                  fontSize: `${2.4 + rnd(i, 3) * 3.2}cqw`,
                  animationDelay: `${rnd(i, 4) * 2}s`,
                  color: ["#ff4d6d", "#ff8fa8", "#e8174f", "#ffb3c6"][i % 4],
                } as CSSProperties
              }
            >
              ♥
            </span>
          );
        })}
      </div>
      <h1 className="end-title">{e.title}</h1>
      <p className="end-subtitle">{e.subtitle}</p>
      <svg className="end-couple" viewBox="0 0 400 270" aria-hidden>
        <g transform="translate(160 250) scale(1.9)">
          <g className="hug-minou">
            <MinouArt />
          </g>
        </g>
        <g transform="translate(246 250) scale(1.9)">
          <g className="hug-job">
            <JobArt pose="hug" />
          </g>
        </g>
      </svg>
      <p className="end-tagline">{e.tagline}</p>
      <button className="btn btn-primary end-home" onClick={onHome}>
        {e.backToMenu}
      </button>
    </div>
  );
}
