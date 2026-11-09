"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { packingItems, tilburgTexts as t } from "@/content/tilburg";
import { createPackingState, isPackingComplete, pickItem } from "@/game/packing";
import DialogueBox from "../DialogueBox";
import type { SceneProps } from "../SceneHost";
import RoomBackground from "./tilburg/RoomBackground";
import { MinouPortrait, type HeroArms, type HeroMood } from "../MinouHero";
import type { DialogueLine } from "@/content/dialogue";
import RoomMinou, { RoomLight } from "./tilburg/RoomMinou";
import RoomObjects, { type FlyVector } from "./tilburg/RoomObjects";
import TravelBag from "./tilburg/TravelBag";

type Phase = "intro" | "playing" | "closing" | "outro";

/** Spellogica ongewijzigd (game/packing.ts); dit bestand regelt alleen de beleving. */
export default function TilburgScene({ onComplete }: SceneProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [packing, setPacking] = useState(createPackingState);
  const [vectors, setVectors] = useState<Record<string, FlyVector>>({});
  const [reaction, setReaction] = useState<{ text: string; key: number } | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [cheerKey, setCheerKey] = useState(0);
  const attempts = useRef<Record<string, number>>({});
  const reactionCount = useRef(0);
  const bagRef = useRef<HTMLDivElement>(null);
  const objectsRef = useRef<SVGSVGElement>(null);

  const complete = isPackingComplete(packingItems, packing);

  // Na het laatste juiste voorwerp: even laten vliegen, dan de tas sluiten.
  useEffect(() => {
    if (!complete || phase !== "playing") return;
    const id = setTimeout(() => setPhase("closing"), 900);
    return () => clearTimeout(id);
  }, [complete, phase]);

  useEffect(() => {
    if (phase !== "closing") return;
    const id = setTimeout(() => setPhase("outro"), 2200);
    return () => clearTimeout(id);
  }, [phase]);

  // Kort juichmoment van Minou na een goed voorwerp (alleen weergave).
  useEffect(() => {
    if (!cheerKey) return;
    const id = setTimeout(() => setCheerKey(0), 1100);
    return () => clearTimeout(id);
  }, [cheerKey]);

  useEffect(() => {
    if (!shakeId) return;
    const id = setTimeout(() => setShakeId(null), 600);
    return () => clearTimeout(id);
  }, [shakeId]);

  function onPick(target: Element, id: string) {
    if (phase !== "playing" || reaction) return;
    const result = pickItem(packingItems, packing, id);
    if (result.outcome === "collected") {
      // Vliegrichting in kamereenheden (1600 breed) berekend uit schermposities.
      const item = target.getBoundingClientRect();
      const bag = bagRef.current?.getBoundingClientRect();
      const room = objectsRef.current?.getBoundingClientRect();
      if (bag && room) {
        const k = 1600 / room.width;
        setVectors((v) => ({
          ...v,
          [id]: {
            dx: (bag.left + bag.width / 2 - (item.left + item.width / 2)) * k,
            dy: (bag.top + bag.height * 0.5 - (item.top + item.height / 2)) * k,
          },
        }));
      }
      setPacking(result.state);
      setCheerKey((k) => k + 1);
    } else if (result.outcome === "wrong") {
      const item = packingItems.find((i) => i.id === id);
      const pool = item?.reactions?.length ? item.reactions : t.genericWrong;
      const n = (attempts.current[id] = (attempts.current[id] ?? 0) + 1);
      setShakeId(id);
      reactionCount.current += 1;
      setReaction({ text: pool[(n - 1) % pool.length], key: reactionCount.current });
    }
  }

  /** Minou in de dialogen: exact hetzelfde ontwerp als in de scène. */
  const minouPortrait = (line: DialogueLine) => (line.speaker === "minou" ? <MinouPortrait mood="happy" size={130} /> : undefined);

  // Alleen weergave: Minou reageert op de keuzes van de speler.
  const happyEnd = phase === "closing" || phase === "outro";
  const minouMood: HeroMood = reaction ? "worried" : cheerKey || happyEnd || phase === "intro" ? "happy" : "neutral";
  const minouArms: HeroArms = phase === "closing" || cheerKey ? "cheer" : phase === "outro" ? "wave" : "down";
  const emote = reaction ? "!" : cheerKey ? "♥" : phase === "playing" && packing.collected.length === 0 ? "?" : null;

  return (
    <div className="tilburg">
      <RoomBackground />
      <RoomMinou mood={minouMood} arms={minouArms} emote={emote} />
      <RoomObjects
        svgRef={objectsRef}
        items={packingItems}
        collected={packing.collected}
        vectors={vectors}
        shakeId={shakeId}
        locked={phase !== "playing" || !!reaction}
        onPick={onPick}
      />
      <RoomLight />

      <TravelBag collected={packing.collected} closed={phase === "closing" || phase === "outro"} bagRef={bagRef} />

      {phase === "playing" && <p className="room-prompt">{t.prompt}</p>}
      {(phase === "closing" || phase === "outro") && (
        <div className="confetti" aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {i % 3 === 0 ? "★" : i % 3 === 1 ? "♥" : "✦"}
            </span>
          ))}
        </div>
      )}

      {phase === "intro" && <DialogueBox key="intro" lines={t.intro} portrait={minouPortrait} onComplete={() => setPhase("playing")} />}
      {phase === "playing" && reaction && (
        <DialogueBox
          key={reaction.key}
          lines={[{ speaker: "sinterklaas", text: reaction.text }]}
          onComplete={() => setReaction(null)}
        />
      )}
      {phase === "outro" && <DialogueBox key="outro" lines={t.outro} portrait={minouPortrait} onComplete={onComplete} />}
    </div>
  );
}
