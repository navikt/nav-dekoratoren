# Bidra til Dekoratøren

Nav.no-teamet har det daglige ansvaret for Dekoratøren, men vi tar gjerne imot innspill, forslag og
PR-er fra andre! Denne dokumentasjonen beskriver hvordan du kan starte Dekoratøren lokalt, opprette
en sak i GitHub-repositoriet eller sende inn en pull request.

## Starte Dekoratøren lokalt

### 1. Klon Dekoratøren

```bash
git clone https://github.com/navikt/nav-dekoratoren.git
```

### 2. Sett opp NODE_AUTH_TOKEN med din egen PAT (Personal Access Token)

Noen av avhengighetene ligger i et privat containerregister. For å installere disse må du sette opp
en GitHub Personal Access Token (PAT).

1. Gå til [GitHubs token-innstillinger](https://github.com/settings/tokens) og opprett en ny PAT
   hvis du ikke allerede har en. Husk å inkludere scopet `packages:read` og autorisere `navikt` (
   Configure SSO → "Authorize navikt").

2. Gjør PAT-en tilgjengelig som `NODE_AUTH_TOKEN`:

I Terminal: `export NODE_AUTH_TOKEN=your-path-with-correct-scope`

Windows Powershell: `$env:NODE_AUTH_TOKEN="your-path-with-correct-scope"`

> Tips: Trinn 2 setter miljøvariabelen NODE_AUTH_TOKEN kun for den aktuelle Terminal- eller
> PowerShell-sesjonen. Hvis du ønsker å gjøre PAT-en permanent tilgjengelig, anbefaler vi å bruke
> for eksempel
> [1Password for å laste hemmeligheter inn i miljøet](https://developer.1password.com/docs/cli/secrets-environment-variables/),
> eller en tilsvarende løsning. Av sikkerhetsgrunner bør du ikke skrive PAT-en direkte inn i
> .bash_profile.

### 3. Dekoratøren bruker [pnpm](https://pnpm.io) som pakkebehandler og Node.js som runtime

Hvis du allerede har pnpm installert, kan du hoppe over dette steget.

Du kan installere pnpm globalt slik:

```bash
corepack enable pnpm
```

(Du kan også installere pnpm med Brew, curl osv.: https://pnpm.io/installation)

### 4. Gå til rotmappen og installer avhengigheter

```bash
cd nav-dekoratoren
pnpm install && pnpm run build
```

### 5. Start Dekoratøren lokalt

```bash
pnpm run dev
```

Du skal nå kunne åpne Dekoratøren på http://localhost:8089/.

---

## Bidrag

### Retningslinjer

Noen vennlige påminnelser før du begynner:

- Sjekk om det allerede finnes en lignende åpen PR.
- Knytt eventuelle eksisterende saker til PR-en for enklere sporing.
- Skriv tydelige commit-meldinger og PR-beskrivelser (unngå for eksempel «fix stuff again»). Merk at
  PR-er kun kan squashes ved merge til main.
- Spør om hjelp dersom du er usikker eller trenger bistand med testing.
- Dev-ingressen brukes av mange applikasjoner i NAV og forventes å være stabil. Hvis du er usikker
  på endringene dine, finnes det en beta-ingress hvor det er mer aksept for at ting kan gå i
  stykker. Se GitHub Action-en `Deploy to Team Nav.no beta`.

### Linting og testing

Husky kjører linting når du committer endringene dine. Du kan også kjøre
`lint-staged --config package.json` på filer som er staged.

Testing kjøres med `pnpm run test` og kjører testene for pakkene `/client` og `/server`.

### Deploy til dev

Hvis du ønsker å teste branchen din, kan du deploye den via workflow-triggeren i GitHub Actions
under fanen Actions:

- `Deploy to dev` – bruk denne hvis du er trygg på at branchen og endringene er stabile.
- `Deploy to Team nav.no beta` – bruk denne hvis du ønsker å teste endringer som potensielt kan
  skape
  problemer.

### Deploy til produksjon

Når PR-en din er godkjent, kan du merge den til main, og en produksjonsdeploy blir automatisk
trigget.

---

## Arkitektur og teknisk løsning

Denne delen forklarer hvordan Dekoratøren er bygget opp:

- Overordnet arkitektur
- Web Components og styling
- Server-side kontra client-side rendering
- Diverse tjenester for spørreundersøkelser og analyse

### Overordnet arkitektur

Dekoratøren er skrevet uten bruk av spesifikke rammeverk. Alt er basert på native web-API-er og
nettleserfunksjonalitet uten ekstra abstraheringer. Målet er å holde Dekoratøren så lettvekts som
mulig.

Kildekoden er delt inn i følgende pakker:

- **client** – klientsidekode og komponenter.
- **server** – alle elementer og all kode som kan kjøres på serveren som del av server-side
  rendering,
  inkludert `server.ts` som håndterer API-ruting.
- **icons** – alle ikoner, både egne ikoner for Dekoratøren og ikoner fra `@navikt/aksel-icons`.
- **shared** – funksjoner og typer som deles mellom pakkene.
- **next-pages-router-example** – en liten Next.js-applikasjon som lar deg forhåndsvise Dekoratøren
  på
  `localhost:8089` når du kjører `pnpm run dev`.

Disse pakkene fungerer som separate workspaces og bygges også separat gjennom kjeding av
byggekommandoer. Se `build`-scriptet i `package.json`.

Årsaken til denne pakkestrategien er at hver pakke har egne behov for hvordan den bygges. For
eksempel kjører `icons` et eget byggeskript (`build-icons.ts`) som kompilerer både egne ikoner og
`@navikt/aksel-icons` til `dist`-mappen.

### Web Components og styling

De fleste komponentene er bygget som Web Components. Dette bidrar til å kapsle inn struktur og
styling slik at stilregler og skript ikke lekker til andre deler av
Dekoratøren. [Du kan lese mer om Web Components her.](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

### Server-side vs client-side rendering

Dekoratøren forsøker å gjøre mest mulig rendering på serveren før innholdet sendes til
applikasjonen.

### Oppgaveanalyse (Task Analytics)

Task Analytics gjør det mulig for team å kjøre spørreundersøkelser basert på URL-mønstre. Oppgavene
konfigureres i et [eget konfigurasjonsrepo](https://github.com/navikt/nav-dekoratoren-config) og
injiseres inn i Dekoratøren.

Ta kontakt med Nav.no-teamet dersom du ønsker å lære mer om Task Analytics eller har en undersøkelse
du ønsker å sette opp.

### Storybook

Du finner en oversikt og dokumentasjon for hver komponent
i [Storybook](https://navikt.github.io/nav-dekoratoren).

Du kan også kjøre Storybook lokalt, for eksempel hvis du jobber med en spesifikk komponent:

```bash
pnpm run storybook
```

Deretter kan du åpne Storybook i nettleseren på [http://localhost:6006](http://localhost:6006).

#### Opprette nye komponenter eller endre eksisterende

Stories for hver komponent har prefixen `.story.tsx`.

Husk å oppdatere eventuelle prop-endringer eller legge til nye stories dersom du oppretter en ny
komponent i Dekoratøren eller gjør endringer i en eksisterende komponent.
