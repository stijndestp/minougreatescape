"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { locations } from "@/content/locations";
import { canEnter } from "@/game/progress";
import { saveCompleteLocation, useSave } from "@/game/save";
import GameStage from "./GameStage";
import ArrivalPlaceholder from "./scenes/ArrivalPlaceholder";
import DelftScene from "./scenes/DelftScene";
import DordrechtScene from "./scenes/DordrechtScene";
import MoerdijkScene from "./scenes/MoerdijkScene";
import OosterhoutScene from "./scenes/OosterhoutScene";
import RotterdamScene from "./scenes/RotterdamScene";
import TilburgScene from "./scenes/TilburgScene";

export interface SceneProps {
  /** Scène is gehaald: opslaan, ontgrendelen en terug naar de kaart. */
  onComplete: () => void;
  /** Terug naar de kaart zonder te voltooien. */
  onExit: () => void;
  /** Alleen de finale: terug naar het hoofdmenu (na het eindscherm). */
  onHome?: () => void;
}

const SCENES: Record<string, ComponentType<SceneProps>> = {
  tilburg: TilburgScene,
  oosterhout: OosterhoutScene,
  moerdijk: MoerdijkScene,
  dordrecht: DordrechtScene,
  rotterdam: RotterdamScene,
  delft: DelftScene,
};

/** Scènes die na het voltooien zelf een eindscherm tonen: opslaan, maar niet automatisch naar de kaart. */
const STAYS_AFTER_COMPLETE = new Set(["delft"]);

const FADE_MS = 500;

/**
 * Bewaakt de toegang tot een spelscène: alleen als de locatie aan de beurt is
 * én Minou er daadwerkelijk is aangekomen. Anders (bijv. via de URL) terug.
 */
export default function SceneHost({ locationId }: { locationId: string }) {
  const save = useSave();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  // Eenmaal toegelaten blijft de scène staan, ook als het voltooien de toegang weer sluit.
  const [everAllowed, setEverAllowed] = useState(false);

  const known = locations.some((l) => l.id === locationId);
  const allowed = !!save && known && canEnter(save, locationId);
  if (allowed && !everAllowed) setEverAllowed(true);
  const shown = allowed || everAllowed;

  useEffect(() => {
    if (save === undefined || leaving || shown) return;
    router.replace(save === null ? "/" : "/kaart");
  }, [save, shown, leaving, router]);

  const leave = useCallback(
    (target = "/kaart") => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      setLeaving(true);
      setTimeout(() => router.push(target), FADE_MS);
    },
    [router],
  );

  const onComplete = useCallback(() => {
    if (leavingRef.current) return;
    saveCompleteLocation(locationId); // automatische opslag na het level
    if (STAYS_AFTER_COMPLETE.has(locationId)) return; // de scène toont zelf een eindscherm
    leave();
  }, [locationId, leave]);

  const goHome = useCallback(() => leave("/"), [leave]);

  // Locaties zonder eigen minigame krijgen een tijdelijke aankomstscène.
  const Scene = SCENES[locationId];
  if (!shown && !leaving) return <GameStage>{null}</GameStage>;

  return (
    <GameStage>
      <div className="scene scene-enter">
        {Scene ? (
          <Scene onComplete={onComplete} onExit={() => leave()} onHome={goHome} />
        ) : (
          <ArrivalPlaceholder locationId={locationId} onComplete={onComplete} onExit={() => leave()} />
        )}
        <div className={leaving ? "fade-overlay on" : "fade-overlay"} aria-hidden />
      </div>
    </GameStage>
  );
}
