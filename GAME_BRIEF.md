# Minou's Great Escape — Game Brief

Dit document legt de oorspronkelijke briefing vast. Het is de bron van waarheid voor het spelontwerp.

## Spelconcept

Minou is een roodharige vrouw met grote ringoorbellen. Op Sinterklaasavond wil ze vanuit Tilburg naar haar geliefde Job in Delft reizen.

Sinterklaas heeft alle wegen veranderd in een escape room. Onderweg moet Minou vier minigames voltooien.

Het spel is humoristisch, persoonlijk en romantisch, met Sinterklaas als warme, plagerige spelleider. Speelduur: ongeveer 15 minuten.

## De spelwereld

Een kleurrijke, moderne 2D-cartoonlandkaart van Zuid-Nederland. De camera volgt Minou terwijl ze automatisch naar haar volgende bestemming reist.

De speler klikt op de eerstvolgende locatie. Alleen vrijgespeelde locaties zijn aanklikbaar. Bij aankomst opent een afzonderlijke geïllustreerde spelscène. Na voltooiing keert Minou terug naar de kaart.

Route: **Tilburg → Oosterhout → Moerdijk → Dordrecht → Rotterdam → Delft**

## De minigames

1. **Tilburg — Pak je koffers!** Kies 7 juiste spullen uit een verzameling grappige voorwerpen.
2. **Oosterhout — Overleef de schoonfamilie!** Familie-etentje met 5 meerkeuzevragen. Bij een fout antwoord reageert een familielid en probeert de speler dezelfde vraag opnieuw.
3. **Moerdijk — Bouw de Moerdijkbrug!** Plaats 5 brugdelen in de juiste openingen. Kies uit 8 vormen. Bediening: klik op een onderdeel en daarna op de juiste positie.
4. **Dordrecht — Grenscontrole.** Korte grappige dialoog met een Piet. Minou gebruikt haar eerder verzamelde studentenpas.
5. **Rotterdam — De verkeerde trein.** Logische puzzel met drie treinen, perrons en aanwijzingen.
   - Verplichte stationsomroep: Eline, de zus van Job, wilde eerder naar Utrecht, stapte in de verkeerde trein en eindigde in Breda.
   - Na de puzzel kiest Minou tussen Leiden en Delft. Bij Leiden verschijnt relatiepsycholoog-Piet. Beide keuzes leiden uiteindelijk naar Delft.
6. **Delft — De finale.** Sinterklaas vertelt dat hij een fysiek rijm voor haar heeft geschreven. Direct verschijnt een viercijferig codeslot. Correcte code: **2912**. Bij correcte invoer volgt een overdreven romantische animatie met Minou en Job: veel kusjes, hartjes en knuffels.

## Algemene spelregels

- Browsergame, ontworpen voor 16:9 op een televisie.
- Besturing primair met de muis.
- Moderne, kleurrijke 2D-cartoonstijl.
- Dialogen worden handmatig doorgeklikt.
- Dialogen mogen NIET worden overgeslagen.
- Geen hints en geen tijdslimieten.
- Muziek en geluidseffecten.
- Automatische opslag na ieder level via localStorage.
- Startmenu met Nieuw spel en Verder spelen.
- Later: wachtwoordbeveiligde toegangspagina.
- De online wachtwoordcontrole werkt server-side.
- Zet nooit toegangswachtwoorden in de broncode.
- Uiteindelijk publiceren via Vercel met een GoDaddy-domein.
- Daarnaast een offline speelbare back-up.
- Alle teksten, quizvragen en afbeeldingen zijn eenvoudig te vervangen.

## Technische aanpak

- Next.js met TypeScript.
- Eenvoudige, onderhoudbare componenten.
- SVG en CSS-animaties waar mogelijk.
- Geen zware game-engine.
- Geen database voor de spelvoortgang.
- Duidelijke scheiding tussen spellogica (`src/game`) en persoonlijke content (`src/content`).
- In eerste instantie tijdelijke illustraties en teksten.

## Werkwijze

We bouwen in kleine, gecontroleerde fasen. Per fase wordt uitsluitend gebouwd wat is gevraagd; controles (TypeScript, lint, build) worden uitgevoerd voordat een fase wordt afgesloten. Geen deployment en geen automatische start van de volgende fase.
