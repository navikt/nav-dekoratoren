# Hvordan bidra til dekoratøren eller starte den lokalt på maskinen


## Starte Dekoratøren lokalt

Slik starter du opp Dekoratøren lokalt på maskinen din

### 1. Klon ned dekoratøren:

  ```bash
  git clone https://github.com/navikt/decorator-next.git
  ```

### 2. Sett opp NODE_AUTH_TOKEN med din egen PAT
Enkelte av pakkene ligger i et privat container-register. For å kunne installere disse, må du sette opp en Personal Access Token (PAT).

1. Gå til [Github PAT-siden](https://github.com/settings/tokens) og opprett en ny PAT dersom du ikke allerede har en fra før. Husk scope `packages:read` og autoriser NAV IKT (Configure SSO -> "Authorize navikt").

2. Gjør denne tilgjengelig som `NODE_AUTH_TOKEN`-variabel: `export NODE_AUTH_TOKEN=din-path-med-korrekt-scope`.

### 3. Dekoratøren bruker [Bun](https://bun.sh) som Javascript runtime istedet for NodeJS. Du kan installere bun globalt på maskinen din slik:

  ```bash
  npm install -g bun
  ```
(Du kan også installere Bun med Brew, curl etc: https://bun.sh/docs/installation.)


### 4. Naviger til roten av prosjektet

  ```bash
  cd decorator-next
  ```

### 5. Installer avhengigheter og bygg prosjektet.

  ```bash
  bun install | bun run build
  ```

### 6. Start prosjektet

  ```bash
  bun run dev
  ```

### 7. Du skal nå kunne åpne dekoratøren på http://localhost:8089/.

## Om arkitektur og teknisk løsning


## Generelt om utvikling


### Partytown

To get partytown to work locally, you need to run `npm run partytown` and build the application once.

### Styling

Styling documentation.

_Troubleshooting_:

-   If you're having trouble with design tokens not being loaded, it may be because your element is not in the scope of the elements defined in postcss.config.js [prefixer configuration](https://github.com/navikt/decorator-next/blob/main/packages/client/postcss.config.js)

### Storybook
[Storybook](https://navikt.github.io/decorator-next/?path=/docs/feedback-success--docs)

### Ressurser

-   [Typescript documentation for Bun](https://bun.sh/docs/typescript)

## Testing
Prosjektet har Snapshot-tester. Disse kan feile dersom du gjør endringer i markup. For å oppdatere snapshots etter at du har gjort endringer, kjør

```bash
bun test --update-snapshots
```

## Guidelines for bidrag:

Vi vil gjerne ha bidrag og PR! Før du setter i gang:

- sjekk at det ikke finnes en liknende åpen PR fra før.
- link eksisterende issues lenkes til PR'en din.
- skriv commit-meldinger på engelsk (så slipper vi blanding).
- skriv tydelige commit-meldinger (dvs ikke "fix stuff again").
- dersom du har fått mange commits som du synes ble for utydelige, går det an å [squashe](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#_squashing).
- be om hjelp hvis du er usikker eller trenger hjelp til å teste!
