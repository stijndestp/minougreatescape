"use client";

import { useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted } from "@/audio/synth";
import { delftTexts } from "@/content/delft";

/** Knop om het geluid te dempen (de instelling wordt bewaard). */
export default function MuteButton() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  return (
    <button
      className="mute-btn"
      onClick={() => setMuted(!muted)}
      aria-pressed={muted}
      aria-label={muted ? delftTexts.muteOff : delftTexts.muteOn}
      title={muted ? delftTexts.muteOff : delftTexts.muteOn}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
