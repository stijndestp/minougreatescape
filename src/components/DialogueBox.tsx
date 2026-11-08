"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { dialogueTexts, speakerNames, type DialogueLine } from "@/content/dialogue";
import MinouPlaceholder from "./MinouPlaceholder";
import SinterklaasSprite from "./SinterklaasSprite";

const CHAR_MS = 22;

interface Props {
  lines: readonly DialogueLine[];
  /** Wordt precies één keer aangeroepen nadat de laatste regel bevestigd is. */
  onComplete: () => void;
  /** Compact: kleiner paneel onderin, de scène erboven blijft zichtbaar. */
  compact?: boolean;
  /** Eigen portret per regel (bijv. een familielid); anders het standaardportret. */
  portrait?: (line: DialogueLine) => ReactNode;
  /** Wordt aangeroepen wanneer de getoonde regel verandert (voor spreekanimaties). */
  onLine?: (line: DialogueLine) => void;
}

/**
 * Handmatig door te klikken dialoog. Geen "overslaan"-knop: "Verder" toont eerst
 * de rest van de huidige regel en gaat daarna naar de volgende regel.
 */
export default function DialogueBox({ lines, onComplete, compact = false, portrait, onLine }: Props) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onLineRef = useRef(onLine);
  useEffect(() => {
    onLineRef.current = onLine;
  });

  const line = lines[index];
  const full = shown >= line.text.length;

  // Subtiele typeanimatie.
  useEffect(() => {
    if (full) return;
    const id = setInterval(() => setShown((s) => s + 1), CHAR_MS);
    return () => clearInterval(id);
  }, [index, full]);

  // Focus op "Verder", zodat Enter/spatie altijd werkt; meld de nieuwe spreker.
  useEffect(() => {
    buttonRef.current?.focus();
    onLineRef.current?.(lines[index]);
  }, [index, lines]);

  function advance() {
    if (!full) {
      setShown(line.text.length);
      return;
    }
    if (index < lines.length - 1) {
      setIndex(index + 1);
      setShown(0);
    } else if (!doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  }

  const name = line.name ?? speakerNames[line.speaker];
  const customPortrait = portrait?.(line);

  return (
    <div
      className={compact ? "dialogue-layer dialogue-layer-compact" : "dialogue-layer"}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} zegt`}
    >
      <div className={`dialogue dialogue-${line.speaker}${compact ? " dialogue-compact" : ""}`}>
        <div className="dialogue-portrait" aria-hidden>
          {customPortrait ??
            (line.speaker === "sinterklaas" ? (
              <SinterklaasSprite size={compact ? 110 : 150} />
            ) : (
              <MinouPlaceholder size={compact ? 100 : 130} />
            ))}
        </div>
        <div className="dialogue-body">
          <p className="dialogue-name">{name}</p>
          <p className="dialogue-text" aria-live="polite">
            {line.text.slice(0, shown)}
            <span className="dialogue-ghost">{line.text.slice(shown)}</span>
          </p>
          <button ref={buttonRef} className="btn btn-primary dialogue-next" onClick={advance}>
            {dialogueTexts.next} ▶
          </button>
        </div>
      </div>
    </div>
  );
}
