# Implementation Plan

Elke fase wordt apart gebouwd, gecontroleerd (`npx tsc --noEmit`, `npm run lint`, `npm run build`) en pas daarna afgesloten.

## Projectstructuur

```
src/
  app/            Next.js-routes (/, /kaart, later /toegang)
  components/     Herbruikbare UI-componenten
  content/        PERSOONLIJKE CONTENT: teksten, locaties, quizvragen, dialogen
  game/           SPELLOGICA: opslag, voortgang, regels (geen persoonlijke tekst)
public/
  placeholders/   Tijdelijke illustraties (vervangbaar via content/locations.ts)
```

Regel: content bevat alleen data, game bevat alleen logica. Teksten/afbeeldingen vervang je in `src/content` en `public`.

## Fase 1 — Fundament ✅
Next.js + TypeScript, projectstructuur, briefing en plan, startscherm, startmenu (Nieuw spel / Verder spelen), tijdelijke kaart met route en alle locaties, localStorage-opslag (basis).

## Fase 1b — Geografisch correcte kaart ✅
Echte data: PDOK/CBS-provincies, OpenStreetMap-rivieren en -waterlichamen (Hollands Diep), Natural Earth-buurlanden. Bronnen in `data/source/`, omzetting via `npm run build:map` naar `src/map/geo/*.geo.json`. Kaartgegevens (`src/map/cities.ts`, `projection.ts`, `mapData.ts`) staan los van de weergave (`WorldMap.tsx`, `OverviewMap.tsx`); de weergave neemt een `camera` (viewBox) zodat fase 3 de camera kan animeren. Overzichtskaart van Nederland met speelgebied; Leiden zichtbaar als optionele zijtak.

## Fase 2 — Interactieve kaart, animaties en Tilburg ✅
Centrale spelstatus (`src/game/progress.ts`: locked/available/active/completed, opslag v2, validatie), vergrendelde lineaire route met toegangsguard op `/spel/[locationId]`, herbruikbare reis- en camera-animatie (`src/map/motion.ts`, `rig.ts`), Minou-sprite met loopanimatie, dialoogsysteem (niet overslaanbaar), Tilburg "Pak je koffers!", tijdelijke aankomstscène Oosterhout. Tests: `npm test`. Let op: `cacheComponents` staat bewust uit in `next.config.ts`.

## Fase 3 — Oosterhout: schoonfamiliequiz ✅
Geïllustreerde eetkamer met vijf tijdelijke familieleden, vijf vragen met herkansing, gangen die op tafel verschijnen. Logica: `src/game/dinner.ts`; content: `src/content/oosterhout.ts` (familieleden, vragen, reacties, tafelopstelling); weergave: `src/components/scenes/oosterhout/`. Locaties zonder minigame (nu Moerdijk) krijgen een tijdelijke aankomstscène (`ArrivalPlaceholder`).

## Fase 5 — Minigame 3 & 4
Moerdijk: Bouw de brug (klik-onderdeel, klik-positie). Dordrecht: Grenscontrole (dialoog met Piet, studentenpas).

## Fase 6 — Rotterdam
Treinpuzzel, stationsomroep over Eline, keuze Leiden/Delft, relatiepsycholoog-Piet.

## Fase 7 — Delft finale
Sinterklaas-rijm, codeslot (2912), romantische eindanimatie.

## Fase 8 — Geluid en muziek
Achtergrondmuziek, geluidseffecten, mute-knop.

## Fase 9 — Illustraties en polish
Definitieve cartoon-illustraties, animaties, afstemmen op tv (16:9), toegankelijkheid.

## Fase 10 — Toegangspagina
Wachtwoordbeveiligde pagina met server-side controle (Next.js route handler/middleware). Wachtwoord alleen via omgevingsvariabele, nooit in de broncode.

## Fase 11 — Offline back-up
Statische export / offline speelbare versie (zonder toegangspagina).

## Fase 12 — Publicatie
Vercel-deployment, GoDaddy-domein koppelen, eindtest op een televisie.
