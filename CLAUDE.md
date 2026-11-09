# Minou's Great Escape — projectcontext voor Claude Code

Humoristische, romantische 2D-browsergame: Minou reist op Sinterklaasavond van Tilburg naar Job in Delft.
Bron van waarheid voor het spelontwerp: `GAME_BRIEF.md`. Lees ook `AGENTS.md` (Next.js 16 wijkt af van wat je kent).

## Ontwerpafspraken
- Moderne, kleurrijke 2D-cartoonvideogame (SVG + CSS-animaties, geen game-engine, geen externe assets/CDN's: moet offline speelbaar blijven).
- Vast 16:9-speelvlak (`.stage`, maten in `cqw`), bedoeld voor een laptop aangesloten op een tv. Scènes tekenen in een vaste viewBox van 1600 × 900.
- Wereldkaart: geografisch correcte Nederlandse landkaart (`src/map`, data via `npm run build:map`).
- Lineaire, vergrendelde voortgang: Tilburg → Oosterhout → Moerdijk → Dordrecht → Rotterdam → Delft.
- Vier minigames (Tilburg, Oosterhout, Moerdijk, Rotterdam), Dordrecht is een korte tussenstop, Delft is de finale (codeslot + hereniging).
- Oosterhout: zes gangen en zes vragen.
- Geen hints, geen tijdslimieten en dialogen kunnen niet worden overgeslagen.
- De bestaande gameplay is goedgekeurd: spelregels, oplossingen, volgorde, centrale spelstatus, localStorage-structuur, verplichte dialogen en het wachtwoordmechanisme niet ongevraagd veranderen.
- Persoonlijke content (teksten, vragen, posities, timing, geluiden) staat in `src/content/`; spelregels in `src/game/` (met vitest-tests). Illustraties zitten in losse componenten zodat ze eenvoudig te vervangen zijn.
- Nooit wachtwoorden of geheimen in de broncode.

## Minou: één personage, overal gelijk
- Het referentieontwerp is `src/components/MinouHero.tsx` (vastgesteld in Rotterdam, goedgekeurd). Gebruik dit in élke scène; teken Minou nooit opnieuw.
- Varieer alleen via props: `mood`, `arms`, `seated`, `line` (lijndikte bij grote schaal: ≈ 1.3 / schaal). Dialoogportret: `MinouPortrait`; wolkje: `MinouEmote`.
- `MinouSprite` (kaart, Moerdijk, Dordrecht; met optionele kaart-pin) en `MinouPlaceholder` (startmenu, standaard dialoogportret) zijn dunne wrappers rond MinouHero. Zo is Minou in de hele game één ontwerp.
- Pas het ontwerp niet aan om een scène passend te maken; scènes sluiten aan op Minou. Rood haar en grote gouden ringoorbellen altijd zichtbaar.
- Kwaliteitsstandaard voor illustraties en animatie: de Rotterdam-scène.

## Structuur
- `src/components/scenes/<Locatie>Scene.tsx` verbindt reducer (`src/game`) met weergave; tekeningen per locatie in `src/components/scenes/<locatie>/`.
- Stijlen en keyframes: `src/app/globals.css` (per fase een blok). Respecteer `prefers-reduced-motion`.
- Animaties: bij voorkeur CSS-transforms/opacity op SVG-groepen; geen zware filters op bewegende elementen.

## Werkwijze
- Werk nooit op `main` (stabiele versie). Feature-branches, bijv. `visual-polish-opus`.
- Geen commit/push/merge tenzij gevraagd; de eigenaar beheert dat via GitHub Desktop.
- Controleer na wijzigingen: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`.
- Dev-server: `.claude/launch.json` (poort 3123). Werk in kleine fasen en stop na de gevraagde fase.
