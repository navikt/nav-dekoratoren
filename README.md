# Table of contents

-   🔨 [installation](#installation)
-   💻 [Development](#development)
-   Ingresses
    -   [Storybook](https://navikt.github.io/decorator-next/?path=/docs/feedback-success--docs)


---

## Bruk av dekoratøren

Oppdatert doc kommer! Decorator-next skal være bakoverkompatibel med alle tjenester som beskrevet i README for [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren) og [@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler#readme).

decorator-next er nå i bruk i alle dev-miljøer. Kom gjerne med innspill på slack-kanalen #dekoratøren_på_navno dersom du opplever problemer. I produksjon benyttes fremdeles [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren).

### Ingresser

**Dev**

-   http://nav-dekoratoren.personbruker (service host)
-   https://dekoratoren.ekstern.dev.nav.no (tilgjengelig fra åpent internett)

**Beta**

Team nav.no:

-   http://nav-dekoratoren-beta.personbruker (service host)
-   https://dekoratoren-beta.intern.dev.nav.no

Team min side:

-   http://nav-dekoratoren-beta-tms.personbruker (service host)
-   https://dekoratoren-beta-tms.intern.dev.nav.no

_Merk:_ Beta-instansene av dekoratøren er ment for intern testing i team personbruker. Disse kan være ustabile i lengre perioder.

---

## Utvikling

### Installation

Set up a [Github PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the scope `packages:read` and make it available as `NODE_AUTH_TOKEN`, e.g. `export NODE_AUTH_TOKEN=your-pat-with-correct-scope`.

Then run (install instructions for bun: https://bun.sh/):

```bash
bun install
```

### Run in dev mode

Run `bun run dev` to start development server. The application is then available at http://localhost:8089.

### Updating snapshots

To update snapshots when you've made changes to the markup that is produced. Run: `bun test --update-snapshots`

### Partytown

To get partytown to work locally, you need to run `npm run partytown` and build the application once.

## Styling

Styling documentation.

_Troubleshooting_:

-   If you're having trouble with design tokens not being loaded, it may be because your element is not in the scope of the elements defined in postcss.config.js [prefixer configuration](https://github.com/navikt/decorator-next/blob/main/packages/client/postcss.config.js)

### Resources

-   [Typescript documentation for Bun](https://bun.sh/docs/typescript)
