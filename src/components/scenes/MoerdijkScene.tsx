"use client";

import { useEffect, useRef, useState } from "react";
import { bridgeParts, bridgeSlots, moerdijkTexts as t } from "@/content/moerdijk";
import { createBridgeState, isBridgeComplete, placePart } from "@/game/bridge";
import DialogueBox from "../DialogueBox";
import type { SceneProps } from "../SceneHost";
import BridgeScene from "./moerdijk/BridgeScene";

type Phase = "intro" | "play" | "wrong" | "done" | "cross" | "outro";

const rules = { parts: bridgeParts, slots: bridgeSlots };
/** Duur van de succesanimatie van de brug voordat Minou oversteekt. */
const DONE_MS = 2800;

/**
 * Spelflow van de brugpuzzel. De regels zitten in game/bridge.ts, de inhoud in
 * content/moerdijk.ts. Animaties lopen los van de spelstatus.
 */
export default function MoerdijkScene({ onComplete }: SceneProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [puzzle, setPuzzle] = useState(createBridgeState);
  const [selected, setSelected] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [remark, setRemark] = useState<{ text: string; key: number } | null>(null);
  const remarkCount = useRef(0);

  const complete = isBridgeComplete(rules, puzzle);

  useEffect(() => {
    if (!shakeId) return;
    const id = setTimeout(() => setShakeId(null), 600);
    return () => clearTimeout(id);
  }, [shakeId]);

  // Succesanimatie van de brug, daarna steekt Minou over.
  useEffect(() => {
    if (phase !== "done") return;
    const id = setTimeout(() => setPhase("cross"), DONE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  function onPart(partId: string) {
    if (phase !== "play") return;
    setSelected((cur) => (cur === partId ? null : partId));
  }

  function onSlot(slotId: string) {
    if (phase !== "play" || !selected) return;
    const result = placePart(rules, puzzle, selected, slotId);
    if (result.outcome === "invalid") return;
    if (result.outcome === "placed") {
      setPuzzle(result.state);
      setSelected(null);
      if (isBridgeComplete(rules, result.state)) setPhase("done");
    } else {
      // Fout: onderdeel schudt, Sinterklaas reageert, voortgang blijft gelijk.
      setShakeId(selected);
      setSelected(null);
      remarkCount.current += 1;
      setRemark({ text: t.wrong[(remarkCount.current - 1) % t.wrong.length], key: remarkCount.current });
      setPhase("wrong");
    }
  }

  return (
    <div className="moerdijk">
      <BridgeScene
        state={puzzle}
        selectedId={selected}
        shakeId={shakeId}
        interactive={phase === "play"}
        complete={complete}
        minou={phase === "cross" ? "crossing" : "idle"}
        minouMood={phase === "wrong" ? "worried" : complete || phase === "outro" ? "happy" : selected ? "surprised" : "neutral"}
        onPart={onPart}
        onSlot={onSlot}
        onCrossEnd={() => setPhase((p) => (p === "cross" ? "outro" : p))}
      />

      {(phase === "done" || phase === "cross") && <p className="bridge-banner">{t.bridgeDone}</p>}

      {phase === "intro" && <DialogueBox key="intro" compact lines={t.intro} onComplete={() => setPhase("play")} />}
      {phase === "wrong" && remark && (
        <DialogueBox
          key={remark.key}
          compact
          lines={[{ speaker: "sinterklaas", text: remark.text }]}
          onComplete={() => setPhase("play")}
        />
      )}
      {phase === "outro" && <DialogueBox key="outro" compact lines={t.outro} onComplete={onComplete} />}
    </div>
  );
}
