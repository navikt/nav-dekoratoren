# Notes

## Kjente tekniske problemer

### Sirkulær avhengighet mellom `decorator-icons` og `decorator-shared`

`decorator-shared` avhenger av `decorator-icons` (brukt i `packages/shared/views/breadcrumbs.ts`),
og `decorator-icons` avhenger av `decorator-shared` (brukt i alle genererte ikon-komponenter via `decorator-shared/html`).

pnpm advarer om dette ved `pnpm install`. Det fungerer i praksis, men er ikke ideelt.

Mulig løsning: flytt `breadcrumbs.ts` til `decorator-server`, eller trekk ut `html`-hjelperen til en egen mikropakke som ikke avhenger av noen av de andre pakkene.

### CSS-modul-loader for Node.js (workaround)

`packages/server/css-module-hooks.mjs` og `css-module-register.ts` er en midlertidig løsning for at Node.js skal håndtere `.css`-importer uten å krasje. Bun håndterte dette nativt.

Loaderen bruker `postcss-modules` med samme konfigurasjon som `css-modules-plugin.ts` (esbuild-bygget) og Vite-klienten, slik at klassenavnene er identiske på tvers av alle tre kontekster. Dette er nødvendig for at SSR-generert HTML skal stemme overens med klientbundelen.

Per 2026 støtter verken Node.js eller tsx CSS-modulimporter nativt. Et alternativ er å fjerne loaderen helt og heller kjøre den kompilerte esbuild-outputen (`serve`-scriptet) i stedet for å kjøre TypeScript-kildekoden direkte med tsx — men da kreves et byggesteg før oppstart (inkludert i Playwright-tester).

## Forslag til fiksing av markup og styling

### Generelt

- Font-smoothing?
- Mobile first mediaqueries
- Nested vs. grouping mediaqueries
- Aksel-tokens, decorator tokens og hardkodede verdier
- Bytte ut ID-selectors med klasser
- Unngå element- og pseudo-selectors (p :last-child)
- Logical, short- & long-hand properties.
- Gjøre alle ikoner og logo til komponenter og samkjøre oppsett
- Linting av duplikatregler
- Rydde opp i referanser fra shared til client
- Validere HTML
- Vurdere PostCSS-plugin for nesting av media queries

### Åpen meny

- Bytte ut nested list med div på gruppenivå?
