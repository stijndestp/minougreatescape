/**
 * Zelfgemaakt geluid met de Web Audio API (geen bestanden, dus geen rechtenkwesties).
 * Alles is veilig: zonder AudioContext, bij een fout of bij gedempt geluid gebeurt er niets.
 * Eén globale demp-instelling (bewaard in localStorage).
 */
const MUTE_KEY = "minou-great-escape:muted";

type Sfx = "magic" | "kiss" | "sparkle" | "fanfare" | "wrong" | "stamp";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let mutedLoaded = false;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicGain: GainNode | null = null;
const listeners = new Set<() => void>();

function loadMuted() {
  if (mutedLoaded) return;
  mutedLoaded = true;
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
}

export function isMuted(): boolean {
  loadMuted();
  return muted;
}

export function subscribeMuted(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setMuted(value: boolean): void {
  loadMuted();
  muted = value;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* geen opslag */
  }
  if (master) master.gain.value = value ? 0 : 0.5;
  listeners.forEach((l) => l());
}

function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = isMuted() ? 0 : 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, dest: AudioNode, freq: number, start: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g);
  g.connect(dest);
  o.start(start);
  o.stop(start + dur + 0.05);
}

const SFX: Record<Sfx, (c: AudioContext, d: AudioNode, t: number) => void> = {
  // opgaande, glinsterende toonladder
  magic: (c, d, t) => [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(c, d, f, t + i * 0.09, 0.45, "sine", 0.25)),
  kiss: (c, d, t) => tone(c, d, 900, t, 0.09, "sine", 0.3, 1800),
  sparkle: (c, d, t) => [2093, 2637].forEach((f, i) => tone(c, d, f, t + i * 0.06, 0.18, "triangle", 0.12)),
  fanfare: (c, d, t) => [[523, 0], [523, 0.16], [523, 0.32], [659, 0.5], [784, 0.7], [1047, 0.95]].forEach(([f, o]) => tone(c, d, f, t + o, 0.35, "square", 0.12)),
  // stempel: lage dreun met korte klik, twee keer (de twee strepen)
  stamp: (c, d, t) => [0, 0.4].forEach((o) => { tone(c, d, 160, t + o, 0.18, "sine", 0.35, 60); tone(c, d, 900, t + o, 0.04, "square", 0.1); }),
  wrong: (c, d, t) => tone(c, d, 330, t, 0.3, "sawtooth", 0.12, 180),
};

export function playSfx(name: string | null | undefined): void {
  if (!name || isMuted() || !(name in SFX)) return;
  const c = audio();
  if (!c || !master) return;
  try {
    SFX[name as Sfx](c, master, c.currentTime + 0.01);
  } catch {
    /* geluid is nooit essentieel */
  }
}

// --- romantische muziek: een eenvoudige walsloop (4 akkoorden, arpeggio + melodie) ---
const CHORDS = [
  [261.6, 329.6, 392.0], // C
  [220.0, 261.6, 329.6], // Am
  [174.6, 220.0, 261.6], // F
  [196.0, 246.9, 293.7], // G
];
const MELODY = [659.3, 587.3, 523.3, 587.3, 659.3, 784.0, 659.3, 523.3, 440.0, 523.3, 587.3, 523.3];
const BAR = 1.8;

function scheduleBars(c: AudioContext, dest: AudioNode, from: number, bars: number, barOffset: number) {
  for (let b = 0; b < bars; b++) {
    const t0 = from + b * BAR;
    const chord = CHORDS[(barOffset + b) % 4];
    chord.forEach((f, i) => tone(c, dest, f / 2, t0 + (i * BAR) / 3, BAR / 3 + 0.15, "triangle", 0.1));
    for (let n = 0; n < 3; n++) {
      const note = MELODY[((barOffset + b) * 3 + n) % MELODY.length];
      tone(c, dest, note, t0 + (n * BAR) / 3, BAR / 3 + 0.1, "sine", 0.09);
    }
  }
}

export function startMusic(): void {
  if (musicTimer) return;
  const c = audio();
  if (!c || !master) return;
  try {
    musicGain = c.createGain();
    musicGain.gain.value = 1;
    musicGain.connect(master);
    let bar = 0;
    let next = c.currentTime + 0.05;
    const fill = () => {
      if (!ctx || !musicGain) return;
      while (next < ctx.currentTime + 3.6) {
        scheduleBars(ctx, musicGain, next, 1, bar);
        next += BAR;
        bar += 1;
      }
    };
    fill();
    musicTimer = setInterval(fill, 1000);
  } catch {
    /* muziek is nooit essentieel */
  }
}

export function stopMusic(): void {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  const g = musicGain;
  musicGain = null;
  if (g && ctx) {
    try {
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => g.disconnect(), 700);
    } catch {
      /* ok */
    }
  }
}
