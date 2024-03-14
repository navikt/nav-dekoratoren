# Hvordan bidra til dekoratøren eller starte den lokalt på maskinen


## Starte Dekoratøren lokalt

Slik starter du opp Dekoratøren lokalt på maskinen din

### 1. Klon dekoratøren lokalt:

  ```bash
  git clone https://github.com/navikt/decorator-next.git
  ```

### 2. Sett opp NODE_AUTH_TOKEN med din egen PAT
Enkelte av avhengighetene ligger i et privat container-register. For å kunne installere disse, må du sette opp en Personal Access Token (PAT).

1. Gå til [Github-innstillinger for tokens](https://github.com/settings/tokens) og opprett en ny PAT dersom du ikke allerede har en fra før. Husk scope `packages:read` og autoriser ```navikt``` (Configure SSO -> "Authorize navikt").

2. Gjør PAT tilgjengelig som `NODE_AUTH_TOKEN`-variabel: `export NODE_AUTH_TOKEN=din-path-med-korrekt-scope`.

### 3. Dekoratøren bruker [Bun](https://bun.sh) som Javascript runtime istedet for NodeJS. Du kan installere Bun globalt på maskinen din slik:

  ```bash
  npm install -g bun
  ```
(Du kan også installere Bun med Brew, curl etc: https://bun.sh/docs/installation).


### 4. Naviger til roten av repoet

  ```bash
  cd decorator-next
  ```

### 5. Installer avhengigheter og bygg dekoratøren

  ```bash
  bun install | bun run build
  ```

### 6. Start dekoratøren lokalt

  ```bash
  bun run dev
  ```

### 7. Du skal nå kunne åpne dekoratøren på http://localhost:8089/.

## Om arkitektur og teknisk løsning
(TBC: informasjon om arktekturen kommer snart!)

## Generelt om utvikling


### Partytown

Partytown er et bibliotek ment for å optimalisere innlasting av dekoratøren. Det har mest nytte i dev og prod, men dersom du ønsker å kjøre Partytown lokalt: `bun run partytown`. Deretter bygger du applikasjonen med `bun run build`.

### Styling

//Todo: Er denne relevant fortsatt?

_Troubleshooting_:

-   If you're having trouble with design tokens not being loaded, it may be because your element is not in the scope of the elements defined in postcss.config.js [prefixer configuration](https://github.com/navikt/decorator-next/blob/main/packages/client/postcss.config.js)

### Storybook
Du finner oversikt og dokumentasjon for hver enkelt komponent i
[Storybook](https://navikt.github.io/decorator-next/?path=/docs/feedback-success--docs).

### Ressurser

-   [Typescript-dokumentasjon for Bun](https://bun.sh/docs/typescript)

## Testing
Dekoratøren bruker Snapshot-tester. Disse kan feile dersom du gjør endringer i markup. For å oppdatere snapshots etter at du har gjort endringer, kjør

```bash
bun test --update-snapshots
```

## Retningslinjer for bidrag:

Vi vil gjerne ha bidrag og PR! Før du setter i gang:

- sjekk at det ikke finnes en lignende åpen PR fra før.
- link evt eksisterende issue til PR'en din slik at det er lett å holde oversikt.
- skriv tydelige commit-meldinger (dvs ikke "fix stuff again").
- be om hjelp hvis du er usikker eller trenger hjelp til å teste!
- dev-ingressen brukes av mange applikasjoner. Derfor bør branches som deployes hit være mest mulig stabile, selv når de fortsatt er i test.
