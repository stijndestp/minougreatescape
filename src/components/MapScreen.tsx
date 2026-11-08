"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { locations } from "@/content/locations";
import { texts } from "@/content/texts";
import {
  canTravelTo,
  getNextId,
  getPendingCelebrations,
  leidenCrossState,
  getStatus,
  type LocationStatus,
} from "@/game/progress";
import { playSfx } from "@/audio/synth";
import { saveArriveAt, saveCelebrated, useSave } from "@/game/save";
import { cityPoint, routeBetween } from "@/map/mapData";
import { DEFAULT_CAMERA } from "@/map/projection";
import { runTravel, runZoom, TRAVEL, wait, type MapRig } from "@/map/rig";
import GameStage from "./GameStage";
import OverviewMap, { type OverviewHandle } from "./OverviewMap";
import WorldMap, { type WorldMapHandle } from "./WorldMap";

const FADE_MS = 500;

export default function MapScreen() {
  const save = useSave();
  const router = useRouter();
  const worldRef = useRef<WorldMapHandle>(null);
  const overviewRef = useRef<OverviewHandle>(null);
  /** Synchrone slot: voorkomt dubbele klikken/meerdere reizen tegelijk. */
  const busyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  const pending = save ? getPendingCelebrations(save) : { doneId: null, unlockId: null };

  // Geen opslag → terug naar het menu (nieuw spel maakt een opslag aan).
  useEffect(() => {
    if (save === null) router.replace("/");
  }, [save, router]);

  // Viering-animaties tonen en daarna als "gezien" opslaan.
  const celebrationKey = `${pending.doneId}|${pending.unlockId}`;
  useEffect(() => {
    if (!pending.doneId && !pending.unlockId) return;
    const keys = [
      ...(pending.doneId ? [`done:${pending.doneId}`] : []),
      ...(pending.unlockId ? [`unlock:${pending.unlockId}`] : []),
    ];
    const t = setTimeout(() => saveCelebrated(...keys), 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebrationKey]);

  // Leiden wordt doorgestreept zodra Rotterdam voltooid is. De tekenanimatie speelt één keer
  // (daarna staat "cross:leiden" in de bestaande celebrated-lijst); verversen toont het kruis direct.
  const cross = save ? leidenCrossState(save) : "hidden";
  const animateCross = cross === "animate";
  useEffect(() => {
    if (!animateCross) return;
    const sound = setTimeout(() => playSfx("stamp"), 450);
    const done = setTimeout(() => saveCelebrated("cross:leiden"), 2600);
    return () => {
      clearTimeout(sound);
      clearTimeout(done);
    };
  }, [animateCross]);

  // Meldingen/schudden vanzelf laten verdwijnen.
  useEffect(() => {
    if (!shakeId) return;
    const t = setTimeout(() => setShakeId(null), 550);
    return () => clearTimeout(t);
  }, [shakeId]);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2600);
    return () => clearTimeout(t);
  }, [message]);

  // Lopende animatie netjes stoppen bij verlaten van de pagina.
  useEffect(() => () => abortRef.current?.abort(), []);

  const onSelectCity = useCallback(
    async (id: string) => {
      if (!save || busyRef.current) return;
      const status = getStatus(save, id);
      if (status === "locked") {
        setShakeId(id);
        setMessage(texts.map.lockedMessage);
        return;
      }
      if (status === "completed") {
        setMessage(texts.map.alreadyDoneMessage);
        return;
      }

      busyRef.current = true;
      setActiveId(id);
      const ac = new AbortController();
      abortRef.current = ac;
      saveCelebrated(`unlock:${id}`, ...(save.completed.length ? [`done:${save.completed[save.completed.length - 1]}`] : []));

      const rig: MapRig = {
        setCamera: (c) => {
          worldRef.current?.setCamera(c);
          overviewRef.current?.setCamera(c);
        },
        setMinou: (p, pose) => {
          worldRef.current?.setMinou(p, pose);
          overviewRef.current?.setMinou(p);
        },
      };

      try {
        let ok: boolean;
        if (canTravelTo(save, id)) {
          ok = await runTravel(rig, routeBetween(save.minouAt, id), DEFAULT_CAMERA, ac.signal);
          if (ok) saveArriveAt(id); // pas bij aankomst verplaatst de opgeslagen positie
        } else {
          // Minou staat er al (bijv. Tilburg bij een nieuw spel): inzoomen op de stad.
          ok = await runZoom(rig, DEFAULT_CAMERA, cityPoint(id), TRAVEL.zoomWidth * 0.8, 900, ac.signal);
          if (ok) ok = await wait(250, ac.signal);
        }
        if (!ok) return;
        setFading(true);
        if (!(await wait(FADE_MS, ac.signal))) return;
        router.push(`/spel/${id}`);
      } finally {
        // Bij navigeren verdwijnt dit scherm; bij mislukken/annuleren geven we de kaart vrij.
        if (ac.signal.aborted) {
          busyRef.current = false;
        }
      }
    },
    [save, router],
  );

  if (!save) return <GameStage>{null}</GameStage>;

  const nextId = getNextId(save);
  const statuses: Record<string, LocationStatus> = {};
  const numbers: Record<string, number> = {};
  locations.forEach((loc, i) => {
    numbers[loc.id] = i + 1;
    statuses[loc.id] = getStatus(save, loc.id, activeId);
  });
  const nextName = locations.find((l) => l.id === nextId)?.name;
  const minouPoint = cityPoint(save.minouAt);

  return (
    <GameStage>
      <div className="map-screen">
        <WorldMap
          ref={worldRef}
          statuses={statuses}
          numbers={numbers}
          effects={{ doneId: pending.doneId, unlockId: pending.unlockId, shakeId }}
          minouAt={minouPoint}
          busy={activeId !== null}
          leidenCross={cross}
          onSelectCity={onSelectCity}
        />

        <header className="map-header">
          <Link href="/" className="btn btn-small btn-secondary" aria-disabled={activeId !== null}>
            {texts.map.backToMenu}
          </Link>
          <h1>{texts.map.title}</h1>
          {nextName && (
            <p className="map-next">
              {texts.map.nextUp}: <strong>{nextName}</strong>
            </p>
          )}
        </header>

        <OverviewMap ref={overviewRef} minouAt={minouPoint} />

        <div className="map-toast" role="status" aria-live="polite">
          {message && <span key={message + shakeId}>{message}</span>}
        </div>

        <div className={fading ? "fade-overlay on" : "fade-overlay"} aria-hidden />
      </div>
    </GameStage>
  );
}
