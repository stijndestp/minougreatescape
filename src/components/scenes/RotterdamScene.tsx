"use client";

import { useEffect, useReducer, useState } from "react";
import type { DialogueLine, LineMood } from "@/content/dialogue";
import { clues, correctTrainId, texts as t, trains } from "@/content/rotterdam";
import {
  createRotterdamState,
  isRotterdamFinished,
  rotterdamReducer,
  solutionOf,
  type RotterdamAction,
  type RotterdamState,
} from "@/game/rotterdam";
import DialogueBox from "../DialogueBox";
import PietPortrait from "../PietSprite";
import type { SceneProps } from "../SceneHost";
import { ClueNotes, DestinationBoard, TrainBoard } from "./rotterdam/DepartureBoard";
import StationScene from "./rotterdam/StationScene";
import TherapyPiet from "./rotterdam/TherapyPiet";

const rules = { trains, clues };
const reduce = (s: RotterdamState, a: RotterdamAction) => rotterdamReducer(rules, s, a);

/** Tijden van de animaties (ms). */
const FOUND_MS = 1500;
const BOARD_MS = 3200;
const DEPART_MS = 3800;

const sint = (text: string): DialogueLine => ({ speaker: "sinterklaas", text });
const clueLines: DialogueLine[] = [t.cluesIntro, ...clues.map((c) => sint(c.say)), t.cluesOutro];

function AnnouncerIcon() {
  return (
    <svg width={110} height={110} viewBox="0 0 110 110" role="img" aria-label="Stationsomroep">
      <circle cx={55} cy={55} r={48} fill="#0a3d9e" stroke="#2b1b3d" strokeWidth={4} />
      <path d="M28 46 H42 L62 30 V80 L42 64 H28Z" fill="#ffd54a" stroke="#2b1b3d" strokeWidth={3} strokeLinejoin="round" />
      <path className="wave w1" d="M70 44 Q80 55 70 66" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      <path className="wave w2" d="M77 36 Q94 55 77 74" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/**
 * Rotterdam Centraal. De verhaalstroom en alle regels zitten in game/rotterdam.ts,
 * de inhoud in content/rotterdam.ts; deze component verbindt ze met de weergave.
 */
export default function RotterdamScene({ onComplete }: SceneProps) {
  const [state, dispatch] = useReducer(reduce, undefined, createRotterdamState);
  const [selected, setSelected] = useState<string | null>(null);
  const [foundReady, setFoundReady] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [announcing, setAnnouncing] = useState(false);
  const [pietMood, setPietMood] = useState<LineMood>("shocked");
  const [noteIndex, setNoteIndex] = useState<number | null>(0);
  const { phase } = state;

  // Vaste tijden voor de animatiefases.
  useEffect(() => {
    const step: Partial<Record<typeof phase, [() => void, number]>> = {
      found: [() => setFoundReady(true), FOUND_MS],
      boarding: [() => dispatch({ type: "boardDone" }), BOARD_MS],
      departing: [() => dispatch({ type: "departDone" }), DEPART_MS],
    };
    const s = step[phase];
    if (!s) return;
    const id = setTimeout(s[0], s[1]);
    return () => clearTimeout(id);
  }, [phase]);

  // Pas als alle verplichte stappen zijn doorlopen, wordt Rotterdam voltooid.
  useEffect(() => {
    if (isRotterdamFinished(state)) onComplete();
  }, [state, onComplete]);

  const solved = solutionOf(rules);
  const litTrainId = state.solved ? solved : null;
  const flash =
    phase === "wrong" && state.lastWrongTrainId ? { trainId: state.lastWrongTrainId, key: state.wrongAttempts } : null;
  const boardState = phase === "boarding" || phase === "departing" || phase === "done";

  const wrongText = (() => {
    const list = (state.lastWrongTrainId && t.wrong[state.lastWrongTrainId]) || t.genericWrong;
    return list[(state.wrongAttempts - 1) % list.length];
  })();

  const portrait = (line: DialogueLine) => {
    if (line.speaker === "omroep") return <AnnouncerIcon />;
    if (line.speaker === "piet") return <PietPortrait variant="psycholoog" mood={line.mood ?? "neutral"} size={110} />;
    return undefined;
  };

  const showNotes = phase === "clues" || phase === "puzzle" || phase === "wrong";
  const notesRevealed = phase === "clues" ? revealed : clues.length;
  const showTherapy = phase === "therapy" || phase === "advice";

  return (
    <div className="rotterdam">
      <StationScene
        litTrainId={litTrainId}
        flash={flash}
        boardTrainId={correctTrainId}
        minou={boardState ? "boarding" : "idle"}
        departing={phase === "departing" || phase === "done"}
        announcing={announcing && phase === "announcement"}
      />

      {phase === "announcement" && (
        <>
          <p className="announce-banner">{t.announcement[0].name}</p>
          <DialogueBox
            key="announcement"
            compact
            lines={t.announcement}
            portrait={portrait}
            onLine={(line) => setAnnouncing(line.speaker === "omroep")}
            onComplete={() => {
              setAnnouncing(false);
              dispatch({ type: "announcementDone" });
            }}
          />
        </>
      )}

      {showNotes && <ClueNotes revealed={notesRevealed} />}

      {phase === "clues" && (
        <DialogueBox
          key="clues"
          compact
          lines={clueLines}
          onLine={(line) => setRevealed(Math.min(clues.length, Math.max(0, clueLines.indexOf(line))))}
          onComplete={() => dispatch({ type: "cluesDone" })}
        />
      )}

      {(phase === "puzzle" || phase === "wrong") && (
        <TrainBoard
          trains={trains}
          selectedId={selected}
          active={phase === "puzzle"}
          wrongId={phase === "wrong" ? state.lastWrongTrainId : null}
          onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
          onBoard={(id) => dispatch({ type: "pickTrain", trainId: id })}
        />
      )}

      {phase === "wrong" && (
        <DialogueBox
          key={`wrong-${state.wrongAttempts}`}
          compact
          lines={[sint(wrongText)]}
          onComplete={() => dispatch({ type: "wrongDone" })}
        />
      )}

      {phase === "found" && foundReady && (
        <DialogueBox key="found" compact lines={[t.found]} onComplete={() => dispatch({ type: "foundDone" })} />
      )}

      {phase === "choice" && <DestinationBoard onPick={(id) => dispatch({ type: "pickDestination", id })} />}

      {phase === "delft" && (
        <DialogueBox key="delft" compact lines={t.delft} onComplete={() => dispatch({ type: "delftDone" })} />
      )}

      {showTherapy && <TherapyPiet mood={phase === "advice" ? "neutral" : pietMood} noteIndex={phase === "advice" ? 3 : noteIndex} />}

      {phase === "therapy" && (
        <DialogueBox
          key="therapy"
          compact
          lines={t.therapy}
          portrait={portrait}
          onLine={(line) => {
            setPietMood(line.mood ?? "neutral");
            setNoteIndex(t.therapy.indexOf(line));
          }}
          onComplete={() => dispatch({ type: "therapyDone" })}
        />
      )}

      {phase === "advice" && (
        <div className="advice-layer">
          <div className="advice-card">
            <p className="advice-slip">{t.adviceSlip}</p>
            <button className="btn btn-primary advice-btn" onClick={() => dispatch({ type: "acceptAdvice" })}>
              {t.adviceButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
