"use client";

import { useEffect, useReducer, useRef } from "react";
import { playSfx, startMusic, stopMusic } from "@/audio/synth";
import { codeHash, delftTexts as t, effects, kissTimes, sounds, sparkleTimes, timeline } from "@/content/delft";
import {
  createFinaleState,
  finaleReducer,
  TIMELINE_PHASES,
  type FinaleAction,
  type FinalePhase,
  type FinaleState,
} from "@/game/finale";
import DialogueBox from "../DialogueBox";
import MuteButton from "../MuteButton";
import type { SceneProps } from "../SceneHost";
import CodeLock from "./delft/CodeLock";
import DelftStage from "./delft/DelftStage";
import EndScreen from "./delft/EndScreen";
import { CupidArrows, EscalateOverlay, Hearts, Sparkles } from "./delft/FinaleEffects";

const rules = { codeHash };
const reduce = (s: FinaleState, a: FinaleAction) => finaleReducer(rules, s, a);

const MUSIC_PHASES: FinalePhase[] = ["gate", "run", "hug", "escalate", "outro"];

/**
 * De finale in Delft. Spelregels: game/finale.ts. Inhoud: content/delft.ts.
 * De hereniging volgt een vaste tijdlijn van fases (gate → run → hug → escalate),
 * elk met één timer; er is geen manier om die of de dialogen over te slaan.
 */
export default function DelftScene({ onComplete, onHome }: SceneProps) {
  const [state, dispatch] = useReducer(reduce, undefined, createFinaleState);
  const { phase } = state;
  const completedRef = useRef(false);

  // Vaste tijdlijn: één timer per fase, plus kus- en fonkelgeluidjes op vaste momenten.
  useEffect(() => {
    if (!(TIMELINE_PHASES as readonly string[]).includes(phase)) return;
    const ids: ReturnType<typeof setTimeout>[] = [];
    ids.push(setTimeout(() => dispatch({ type: "advance" }), timeline[phase as keyof typeof timeline]));
    if (phase === "hug") kissTimes.hug.forEach((ms) => ids.push(setTimeout(() => playSfx(sounds.kiss), ms)));
    if (phase === "escalate") {
      kissTimes.escalate.forEach((ms) => ids.push(setTimeout(() => playSfx(sounds.kiss), ms)));
      sparkleTimes.forEach((ms) => ids.push(setTimeout(() => playSfx(sounds.sparkle), ms)));
    }
    return () => ids.forEach(clearTimeout);
  }, [phase]);

  // Geluiden bij het ontgrendelen, een foute code en het einde.
  useEffect(() => {
    if (phase === "gate") playSfx(sounds.unlock);
    if (phase === "wrong") playSfx(sounds.wrong);
    if (phase === "end") playSfx(sounds.finale);
  }, [phase]);

  // Romantische muziek tijdens de hereniging.
  const musicOn = sounds.music && MUSIC_PHASES.includes(phase);
  useEffect(() => {
    if (!musicOn) return;
    startMusic();
    return () => stopMusic();
  }, [musicOn]);

  // De finale is pas voltooid (en opgeslagen) als het eindscherm bereikt is.
  useEffect(() => {
    if (!state.completed || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [state.completed, onComplete]);

  // Toetsenbord: cijfers, Backspace en Enter (alleen bij het codeslot).
  useEffect(() => {
    if (phase !== "lock") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        dispatch({ type: "digit", digit: e.key });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        dispatch({ type: "backspace" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!e.repeat) dispatch({ type: "submit" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const wrongLine = t.wrong[(state.wrongAttempts - 1 + t.wrong.length) % t.wrong.length];
  const lockVisible = phase === "lock" || phase === "wrong";

  return (
    <div className="delft">
      <DelftStage phase={phase} wrongKey={state.wrongAttempts} />

      {/* Scène A: poort opent, hartjes, Sinterklaas reageert */}
      {phase === "gate" && (
        <>
          <Hearts key="gate" count={effects.gateHearts} origin="gate" spreadMs={timeline.gate * 0.8} riseMs={2600} salt={1} />
          <p className="sint-bubble">{t.unlockedBubble}</p>
        </>
      )}
      {/* Scène C: hartjes vanuit het stel */}
      {phase === "hug" && <Hearts key="hug" count={effects.hugHearts} origin="couple" spreadMs={timeline.hug * 0.8} riseMs={3200} salt={2} />}
      {/* Scène D: het wordt steeds erger */}
      {phase === "escalate" && (
        <>
          <EscalateOverlay durationMs={timeline.escalate} />
          <Hearts key="esc" count={effects.escalateHearts} origin="full" spreadMs={timeline.escalate * 0.85} riseMs={4200} salt={3} />
          <Hearts key="esc-c" count={14} origin="couple" spreadMs={timeline.escalate * 0.85} riseMs={2600} salt={4} />
          <Sparkles spreadMs={timeline.escalate * 0.9} />
          <CupidArrows spreadMs={timeline.escalate * 0.8} />
        </>
      )}

      {lockVisible && (
        <CodeLock
          code={state.code}
          disabled={phase === "wrong"}
          shakeKey={state.wrongAttempts}
          onDigit={(digit) => dispatch({ type: "digit", digit })}
          onBackspace={() => dispatch({ type: "backspace" })}
          onSubmit={() => dispatch({ type: "submit" })}
        />
      )}

      {phase === "intro" && <DialogueBox key="intro" compact lines={t.intro} onComplete={() => dispatch({ type: "introDone" })} />}
      {phase === "wrong" && (
        <DialogueBox
          key={`wrong-${state.wrongAttempts}`}
          compact
          lines={[{ speaker: "sinterklaas", text: wrongLine }]}
          onComplete={() => dispatch({ type: "wrongDone" })}
        />
      )}
      {phase === "outro" && <DialogueBox key="outro" compact lines={t.outro} onComplete={() => dispatch({ type: "outroDone" })} />}

      {phase === "end" && <EndScreen onHome={() => onHome?.()} />}

      <MuteButton />
    </div>
  );
}
