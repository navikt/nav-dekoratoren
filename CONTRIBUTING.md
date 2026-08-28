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

### Nettleserstøtte

Dekoratøren lastes inn på tvers av hele nav.no, så vi kan ikke anta at brukerne har en oppdatert
nettleser. Nedre grense for nettleserstøtte er definert **ett sted**, i `browserslist`-nøkkelen i
`package.json` i rotmappen:

```json
"browserslist": [
    "safari >= 15.4",
    "ios_saf >= 15.4",
    "chrome >= 100",
    "edge >= 100",
    "firefox >= 100",
    "not dead"
]
```

Alt annet utledes fra denne verdien. Endrer du den, må du kjøre `pnpm run generate:compat` (se
under) og committe resultatet.

#### Hvordan grensen håndheves

Ingen enkelt mekanisme fanger opp alt, så vi bruker fire lag:

| Lag                                   | Fanger opp                                                 | Feiler i         |
| ------------------------------------- | ---------------------------------------------------------- | ---------------- |
| Vite `build.target`                   | **Syntaks** – esbuild kompilerer ned, eller stopper bygget | `pnpm run build` |
| TypeScript `lib: ["ES2022"]`          | **ES-innebygde** – `Object.groupBy`, `Array#toSorted` osv. | `tsc --noEmit`   |
| `eslint-plugin-compat`                | **Web-API-er** – instansmetoder, properties, konstruktører | `pnpm run lint`  |
| `no-restricted-properties` (generert) | **Statiske Web-API-er** – `AbortSignal.timeout` osv.       | `pnpm run lint`  |

Hvorfor de to siste er separate lag: datasettet til `eslint-plugin-compat`
(`ast-metadata-inferer`) inneholder ikke statiske medlemmer i det hele tatt. MDN navngir dem med
suffikset `_static` (`AbortSignal.timeout_static`), og disse hoppes over. Uten det fjerde laget
ville `AbortSignal.timeout()` – som krever Safari 16 – gått rett gjennom bygget og feilet i
produksjon hos brukere på Safari 15.4.

Lista i `eslint-compat-restrictions.generated.mjs` genereres direkte fra
`@mdn/browser-compat-data`:

```bash
pnpm run generate:compat
```

Fila er committet med vilje. Det holder lintingen rask, og gjør at endringer i nettlesergrensen blir
synlige som en diff av hvilke API-er som ble tillatt eller forbudt.

#### Når du trenger et nyere API

Ikke hev grensen for å få lint til å bli grønn. Velg én av disse:

1. **Skriv det om.** Som regel finnes det et ekvivalent eldre API. `AbortSignal.timeout(ms)` kan for
   eksempel erstattes med `AbortController` + `setTimeout` – se `packages/client/src/helpers/auth.ts`.
2. **Polyfill det**, og registrer unntaket slik at det blir synlig i review:
    - for `compat/compat`: legg API-et inn i `settings.polyfills` i `eslint.config.mjs`
    - for `no-restricted-properties`: bruk en `eslint-disable-next-line`-kommentar på stedet, med en
      forklaring på hvor polyfillen kommer fra

#### Kjente hull

- **Instansmetoder** som er nyere enn grensen, men som mangler i datasettet til
  `eslint-plugin-compat` (f.eks. `element.checkVisibility()`), fanges ikke opp. `lib.dom.d.ts` i
  TypeScript har ingen versjonering, så typesjekken ser dem heller ikke.
- **`as any`-casting** omgår alle lagene.
- **CSS** har foreløpig ingen egen håndhevelse. Merk at `build.cssTarget` arver `build.target`, så
  esbuild kompilerer nå ned CSS-nesting og lignende til nettlesergrensen. Det er ingen erstatning
  for stylelint eller lightningcss, men det dekker de vanligste fallgruvene.
- Det innlinjede skriptet i `packages/server/src/views/scripts.ts` sendes til nettleseren som ren
  tekst og transpileres ikke. Skriver du kode der, må du selv passe på at den holder seg innenfor
  nettlesergrensen.

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
