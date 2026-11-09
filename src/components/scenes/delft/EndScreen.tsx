"use client";

import type { CSSProperties } from "react";
import { delftTexts, effects } from "@/content/delft";
import { JobArt, MinouArt } from "./DelftCast";
import { HeartIcon } from "./FinaleEffects";

const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 91.7 + salt * 17.3) * 43758.5453;
  return x - Math.floor(x);
};

const CONFETTI = ["#ff4d6d", "#ffd45e", "#8fe3ff", "#ffffff", "#b8ff9a", "#c58bff"];

/** Feestelijk eindscherm: titel, Minou en Job omringd door hartjes en de knop naar het hoofdmenu. */
export default function EndScreen({ onHome }: { onHome: () => void }) {
  const e = delftTexts.end;
  return (
    <div className="finale-end" role="dialog" aria-modal="true" aria-label={e.title}>
      <div className="end-rays" aria-hidden />
      <div className="end-confetti" aria-hidden>
        {Array.from({ length: effects.endConfetti }, (_, i) => (
          <span
            key={i}
            style={
              {
                left: `${rnd(i, 7) * 100}%`,
                background: CONFETTI[i % CONFETTI.length],
                animationDelay: `${-rnd(i, 8) * 6}s`,
                animationDuration: `${4.5 + rnd(i, 9) * 3}s`,
                "--spin": `${(rnd(i, 10) - 0.5) * 1440}deg`,
                "--drift": `${(rnd(i, 11) - 0.5) * 10}cqw`,
              } as CSSProperties
            }
          />
        ))}
      </div>
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
              <HeartIcon />
            </span>
          );
        })}
      </div>
      <h1 className="end-title">{e.title}</h1>
      <p className="end-subtitle">{e.subtitle}</p>
      <svg className="end-couple" viewBox="0 0 400 270" aria-hidden>
        <defs>
          <radialGradient id="end-heart-fill" cx=".5" cy=".4" r=".65">
            <stop offset="0" stopColor="#fff7d6" />
            <stop offset=".55" stopColor="#ff8fc0" />
            <stop offset="1" stopColor="#e8174f" />
          </radialGradient>
        </defs>
        <g transform="translate(203 150)">
          <path className="end-pedestal" d="M0 110 C-150 10 -120 -120 -40 -120 C-8 -120 0 -92 0 -82 C0 -92 8 -120 40 -120 C120 -120 150 10 0 110Z" fill="url(#end-heart-fill)" stroke="#fff" strokeWidth={5} />
        </g>
        <g transform="translate(160 250) scale(1.9)">
          <g className="hug-minou">
            <MinouArt mood="love" />
          </g>
        </g>
        <g transform="translate(246 250) scale(1.9)">
          <g className="hug-job">
            <JobArt pose="hug" mood="love" />
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
