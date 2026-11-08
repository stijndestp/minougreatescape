import type { CSSProperties } from "react";
import { delftTexts, effects } from "@/content/delft";

const COLORS = ["#ff4d6d", "#ff8fa8", "#e8174f", "#ffb3c6", "#ff5d8f"];

/** Deterministische pseudo-willekeur (geen Math.random: dezelfde reeks bij elke keer afspelen). */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface HeartsProps {
  count: number;
  /** "couple": stijgen op bij het stel; "full": verdeeld over het hele scherm. */
  origin: "couple" | "full" | "gate";
  /** Over hoeveel ms de hartjes starten, en hoe lang één hartje stijgt. */
  spreadMs: number;
  riseMs: number;
  salt?: number;
}

/**
 * Vooraf vastgelegde hartjes: een vast aantal elementen, elk één keer afgespeeld
 * (dus nooit eindeloos nieuwe hartjes). Component weer laten verdwijnen = alles weg.
 */
export function Hearts({ count, origin, spreadMs, riseMs, salt = 1 }: HeartsProps) {
  return (
    <div className="fx-layer" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const x =
          origin === "couple" ? 62 + rnd(i, salt) * 14 : origin === "gate" ? 38 + rnd(i, salt) * 24 : 3 + rnd(i, salt) * 94;
        const startY = origin === "full" ? 100 : origin === "gate" ? 70 : 60;
        const style = {
          left: `${x}%`,
          top: `${startY}%`,
          fontSize: `${1.8 + rnd(i, salt + 1) * 3.4}cqw`,
          color: COLORS[i % COLORS.length],
          animationDelay: `${(i / count) * spreadMs}ms`,
          animationDuration: `${riseMs * (0.8 + rnd(i, salt + 2) * 0.5)}ms`,
          "--sway": `${(rnd(i, salt + 3) - 0.5) * 9}cqw`,
          "--rise": `${origin === "full" ? 64 : 44}cqw`,
        } as CSSProperties;
        return (
          <span key={i} className="fx-heart" style={style}>
            ♥
          </span>
        );
      })}
    </div>
  );
}

/** Grote fonkelende sterretjes die kort oplichten. */
export function Sparkles({ spreadMs }: { spreadMs: number }) {
  return (
    <div className="fx-layer" aria-hidden>
      {Array.from({ length: effects.sparkles }, (_, i) => (
        <span
          key={i}
          className="fx-sparkle"
          style={{
            left: `${6 + rnd(i, 9) * 88}%`,
            top: `${8 + rnd(i, 10) * 70}%`,
            fontSize: `${2 + rnd(i, 11) * 4}cqw`,
            animationDelay: `${(i / effects.sparkles) * spreadMs}ms`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

/** Vliegende Cupido-pijltjes (elk één keer van links naar rechts of omgekeerd). */
export function CupidArrows({ spreadMs }: { spreadMs: number }) {
  return (
    <div className="fx-layer" aria-hidden>
      {Array.from({ length: effects.cupids }, (_, i) => (
        <svg
          key={i}
          className={i % 2 ? "fx-arrow fx-arrow-rtl" : "fx-arrow"}
          style={{ top: `${14 + i * 14}%`, animationDelay: `${(i / effects.cupids) * spreadMs}ms` }}
          viewBox="0 0 120 30"
        >
          <path d="M6 15 H98" stroke="#7a4a2b" strokeWidth={4} strokeLinecap="round" />
          <path d="M98 5 L118 15 L98 25 Z" fill="#e8174f" stroke="#2b1b3d" strokeWidth={2} strokeLinejoin="round" />
          <path d="M6 15 L-2 6 M6 15 L-2 24 M16 15 L8 6 M16 15 L8 24" stroke="#ff8fa8" strokeWidth={3} strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

/** Roze gloed over de hele scène en de grote tekst van scène D. */
export function EscalateOverlay({ durationMs }: { durationMs: number }) {
  return (
    <>
      <div className="finale-glow" style={{ animationDuration: `${durationMs}ms` }} aria-hidden />
      <p className="forever-text" aria-live="polite">
        {delftTexts.foreverText}
      </p>
    </>
  );
}
