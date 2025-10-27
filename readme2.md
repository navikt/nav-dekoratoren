# Nav Dekoratøren – Developer Guide

Dette dokumentet er en teknisk, kodebasert forklaring av hvordan Dekoratøren fungerer internt. Det
supplerer den mer brukerorienterte `README.md` og er ment for utviklere som skal endre, drifte eller
utvide løsningen.

## Innhold

1. Arkitektur og oversikt
2. Pakker og arbeidsområder (workspaces)
3. Lokal utvikling og scripts
4. Byggprosess (client, server, ikoner)
5. Runtime: SSR vs CSR
6. API-endepunkter og datakontrakter
7. Parametre og validering
8. Miljøvariabler (server + client)
9. Autentisering, samtykke og analyse
10. Content Security Policy (CSP)
11. Ikoner – generering og bruk
12. Metrics og observability
13. Testing (unit, e2e, accessibility, benchmarking)
14. Mocks og utviklingsmiljø
15. Sikkerhet og hardening
16. Utvide funksjonalitet (nye parametre, nye endepunkter)
17. Feilsøking og vanlige problemer
18. Deploy (kort oversikt)

---

## 1. Arkitektur og oversikt

Dekoratøren består av:

- Server (Bun + Hono) som leverer SSR-fragmenter, API-endepunkter og statiske ressurser.
- Client bundle (Vite) som kjører på siden og håndterer hydreringslogikk, samtykke, analyse, events.
- Shared pakke med typer, parametere og HTML-hjelpere.
- Icons pakke som bygger typed ikon-komponenter fra SVG-kilder og Aksel ikon-metadata.

Serveren kan levere både server-renderte strenger (via `/ssr`) og en CSR-løsning der HTML-plassholdere erstattes ved runtime (via `/env` og `/csr`).

## 2. Pakker og arbeidsområder

Monorepo med npm workspaces (styrt av root `package.json`):

- `packages/client`: Vite-bundle, hydreringskode, analytics, consent og eventhåndtering.
- `packages/server`: Hono-app, API-er, SSR views, bygging med Bun.
- `packages/shared`: Typer (`Params`, `Environment`, utils), schema-validering (Zod).
- `packages/icons`: Dynamisk generering av ikon-komponenter fra SVG.

Root scripts koordinerer bygg og test på tvers av pakkene.

## 3. Lokal utvikling og scripts

Viktige scripts (fra root `package.json`):

- `dev`: Starter client (Vite) og server (Bun) samtidig med `concurrently`.
- `build`: Kjører ikonbygg, client build (to moduser) og server build, deretter kopierer klient-assets til serverens `public`.
- `test`: Kjører klientens Vitest + serverens Bun tests.
- `playwright`: Kjører end-to-end tester.
- `storybook`: Starter Storybook for visuelle komponenter (ikonhistorier m.m.).
- `benchmarking`: Kjører custom benchmarking-script i `benchmarking/run`.

Client scripts:

- `build-main` / `build-csr`: Separate byggemoduser (styrer output for SSR vs CSR).
- `test` / `test:watch`: Vitest med UTC tidsone.

Server scripts:

- `dev`: Watcher `src/server.ts` med Bun.
- `build`: Bun build med custom CSS Modules plugin og etterfølgende HTML-template-minifisering.
- `serve` / `serve-local`: Kjører prebygget server (prod modus / lokal variant).

## 4. Byggprosess

### Server

`packages/server/build.ts`:

- Bun plugin for CSS Modules konverterer `.module.css` til JSON token map (brukes i SSR views).
- Minifiserer tagged template literals med `esbuild-minify-templates` for mindre output.

### Client

- Vite bygger to moduser: `main` (for SSR assets) og `csr` (for hydreringsscript og CSS til CSR fallback).
- Dynamisk import av alle view-templates og CSS via `import.meta.glob`.

### Asset kopiering

`copy-assets` script kopierer `packages/client/dist/assets/**/*` til `packages/server/public/` (slik at serveren kan serve ferdig bundlet CSS/JS).

### Ikoner

`packages/icons/build-icons.ts`:

- Leser interne SVG-er + Aksel-ikon metadata.
- Optimaliserer med `svgo` (preset-default + ekstra attributter for tilgjengelighet og fokus).
- Genererer TypeScript per ikon + en samlet `index.ts`.
- Tilføyer attributter: `focusable="false" role="img"` og kontrollert `aria-label` logikk.

## 5. Runtime: SSR vs CSR

### SSR (`/ssr`)

Returnerer JSON med:

- `headAssets`: Liste over `<link>` og `<meta>` osv. som skal injiseres i `<head>`.
- `header`, `footer`: Ferdig HTML-streng.
- `scripts`: Script-objekter for injeksjon.

Appen som bruker Dekoratøren injiserer strengene i response pipeline før HTML sendes til klient.

### CSR (`/env` + `/csr`)

1. Plassholdere i HTML: `<div id="decorator-header"></div>`, `<div id="decorator-footer"></div>`, `<div id="decorator-env" data-src="{INGRESS_URL}/env?..."></div>`.
2. `csr.ts` fetcher `data-src`, erstatter header/footer og injiserer scripts.
3. `main.ts` initierer parametre, samtykke, events og analytics dersom samtykke foreligger.

Dette gir fallback når SSR ikke kan brukes, men SSR anbefales for redusert layout-shift.

## 6. API-endepunkter (server)

Fra `server.ts`:

- `GET /api/isAlive` / `GET /api/isReady`: Health checks.
- `GET /api/version`: Versjonsinfo (proxy/egen handler).
- `GET /api/ta`: Task Analytics survey config.
- `POST /api/consentping`: Viderekobler consent-ping til ekstern API (`DEKORATOREN_API_URL`).
- `POST /api/notifications/:id/archive`: Arkiverer notif; bruker cookie og id.
- `GET /api/search`: Returnerer HTML (server-rendered) basert på spørring `q` og validated params.
- `GET /api/csp`: Returnerer aktive CSP-direktiver.
- `GET /main-menu`: Server-rendered main-menu HTML.
- `GET /auth`: Auth-handler (bruker cookie + params).
- `GET /ops-messages`: Operasjonelle meldinger.
- `GET /header` / `GET /footer`: Returnerer fragmenter enkeltvis (kan brukes til delvis oppdatering).
- `GET /ssr`: Komplett SSR payload.
- `GET /env` / `GET /csr`: CSR payload.
- Redirect-varianter for `client*.js` og `client*.css` – sikrer stabil URL for cache.
- `GET /metrics`: Prometheus metrics (via `@hono/prometheus`).

Alle parametre parse-es og valideres via `parseAndValidateParams()` og Zod schemas.

## 7. Parametre og validering

Definert i `packages/shared/params.ts` med Zod:

- Kontekst: `context` (`privatperson | arbeidsgiver | samarbeidspartner`)
- Språk: `language` (`nb | nn | en | se | pl | uk | ru`)
- Diverse booleans (`simple`, `chatbot`, `logoutWarning`, osv.) med defaults.
- Strukturerte arrays: `availableLanguages`, `breadcrumbs` (begge validerer URL mot `nav.no` domener).
- Avledede verdier: `logoutUrl` fallback til `clientEnv.LOGOUT_URL` dersom ikke satt.

`validateParams()` parse-er booleans manuelt (string "true" → `true`), JSON-deserialiserer kompleks input, og injiserer fallbackverdier. Feil i validering kaster umiddelbart (hindrer SSR eller API-respons med ugyldig config).

### Klient-parametre

`clientParamKeys` begrenser hva som sendes til klient-siden i enkelte flows (for å unngå lekkasje av server-only felter).

## 8. Miljøvariabler

### Server (`server/src/env/schema.ts`)

Valideres med `serverSchema`:

- Kritiske URL-er: `APP_URL`, `CDN_URL`, `DEKORATOREN_API_URL`, `SEARCH_API_URL`, `VARSEL_API_URL`, `ENONICXP_SERVICES`, `XP_BASE_URL`.
- Auth og feature toggles: `LOGIN_URL`, `UNLEASH_SERVER_API_TOKEN`, `UNLEASH_SERVER_API_URL`.
- Driftsdata: `VERSION_ID`, `NODE_ENV`, `IS_INTERNAL_APP`.

Feil validering stopper oppstart.

### Client environment (`clientEnvSchema`)

Eksponeres trygt til klientkode:

- `BOOST_ENV` (styrer boost.ai host i CSP og runtime).
- `LOGIN_SESSION_API_URL`, `LOGOUT_URL` (samtykke/innlogging og utlogging delegasjon).
- `MIN_SIDE_URL`, `MIN_SIDE_ARBEIDSGIVER_URL`.
- `PUZZEL_CUSTOMER_ID` (chat integrasjoner).
- `UMAMI_WEBSITE_ID` (analytics).
- Versjons- og base-URL info: `VERSION_ID`, `XP_BASE_URL`.

## 9. Autentisering, samtykke og analyse

### Consent-strøm

`WebStorageController` (klient) leser gjeldende samtykke. Events:

- `consentAllWebStorage`: Starter analytics (Skyra + Amplitude/Umami init via `initAnalytics`).
- `refuseOptionalWebStorage`: Stopper tracking (`stopAnalytics`, `stopSkyra`).

### Auth refresh

`refreshAuthData()` hentes etter init og ved samtykke-endring for å sikre korrekt login state og nivå.

### Analytics metadata

`addFaroMetaData()` på `window.load` injiserer metadata til Grafana Faro for feilsøking og overvåkning.

Hvis bruker allerede har gitt analytics-samtykke ved init, startes tjenester umiddelbart.

## 10. Content Security Policy (CSP)

Definert i `content-security-policy.ts`:

- Dynamisk sett basert på `isLocalhost()` for å tillate `localhost:*` og `ws:`.
- Viktige kilder: `*.nav.no`, `boost.ai`, `*.skyra.no`, `*.taskanalytics.com`, `widget.uxsignals.com`, `*.puzzel.com`, `*.psplugin.com`.
- Tillater `UNSAFE_INLINE` og `UNSAFE_EVAL` kun der 3.parts scripts krever det (chat/vergic). Vurder løpende reduksjon hvis mulig.

Endepunkt `/api/csp` eksponerer nåværende direktiver for enkel verifikasjon.

## 11. Ikoner

For å legge til nye interne ikoner:

1. Legg SVG i `packages/icons/src/`.
2. Kjør `bun run --cwd packages/icons build` (kalles også fra root `build`).
3. Ny TS-fil genereres i `dist/` og eksporteres automatisk i `dist/index.ts`.

Ikonfunksjon signatur: `({ ariaLabel, ...props }: IconProps) => html\`<svg .../>\``.

`aria-label` styrer `aria-hidden` attributtet (skjules dersom ikke label). Sjekk tilgjengelighet ved nye ikoner.

## 12. Metrics og observability

`@hono/prometheus` integrasjon:

- `registerMetrics` middleware på alle requests.
- `GET /metrics` eksponerer Prometheus payload.

Faro SDK brukes klient-side for page events og feil.

## 13. Testing

### Unit

- Client: Vitest (`TZ=UTC` for deterministisk tidsavhengig logikk).
- Server: Bun test (`bun test --env-file=./.env.sample`).

### E2E

- Playwright (`@playwright/test`) med støtte for `@axe-core/playwright` for tilgjengelighets-sjekk (se `tests/axe.spec.ts`).
- Husk WebKit-avhengigheter (på GitHub Actions må ekstra systempakker installeres; vurder container image med forhåndsinstallerte Playwright browsers for å unngå manuell listen av libs).

### Accessibility

- Axe integrasjon i Playwright test suite.

### Benchmarking

- Custom script `benchmarking/run` (kan utvides for performance regression testing).

## 14. Mocks og utviklingsmiljø

Når `NODE_ENV === 'development'` eller kjøring på localhost:

- `setupMocks()` aktiverer MSW (mock service worker) via `/mockServiceWorker.js`.
- Proxy-requests: `/api/oauth2/session` etc. passerer videre til original URL.

Dette gir isolert lokal testing uten eksterne tjenester.

## 15. Sikkerhet og hardening

- Streng validering av parametre (Zod) hindrer injeksjon via query-strenger.
- CSP reduserer risiko for XSS.
- `logoutUrl` fallback hindrer at apper injiserer vilkårlig logout address hvis ikke validert.
- Ikon-SVG optimalisering + eksplisitt attributter fjerner uønskede inline scripts/data.
- Unngå direkte interpolering av uvaliderte brukerdata i `run`-blokker i CI (se Sonar advarsel). Sanitér inputs eller bruk `env`/`with` i GitHub Actions i stedet for shell-evaluering.

## 16. Utvide funksjonalitet

### Nye parametre

1. Legg felt i `paramsSchema` med korrekt `.default()` eller `z.optional(...)`.
2. Oppdater `clientParamKeys` hvis feltet skal tilgjengeliggjøres for klient.
3. Håndter parsing i `validateParams()` hvis spesiallogikk (boolean-parsing / JSON-deserialisering).
4. Bruk feltet i relevant view (`HeaderTemplate`, `FooterTemplate`, etc.).

### Nye API-endepunkter

1. Lag handler i `packages/server/src/handlers`.
2. Registrer `app.get/post(...)` i `server.ts` (før `route`-aliasene hvis globalt).
3. Vurder behov for parametervalidering og auth.
4. Eksponer metrics automatisk via eksisterende middleware.

## 17. Feilsøking

| Problem                               | Tiltak                                                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Manglende Playwright WebKit libs i CI | Bruk offisielt Playwright container image, eller installer anbefalt liste med systempakker (`npx playwright install-deps`). |
| Parametervalidering feiler            | Sjekk logs: Zod feilmeldinger viser path til ugyldig felt.                                                                  |
| Ikon dukker ikke opp                  | Sjekk at SVG ligger i `src/` og byggscript er kjørt.                                                                        |
| CSP blokkerer script                  | Oppdater whitelist i `content-security-policy.ts` (unngå for generiske domener).                                            |
| Ingen analytics                       | Samtykke ikke gitt eller `UMAMI_WEBSITE_ID` mangler.                                                                        |

## 18. Deploy (kort)

Bygg-sekvens:

1. `bun install` (alle workspaces).
2. `bun run build` (inkluderer ikoner, client, server, copy-assets).
3. Start server (`bun run --cwd packages/server serve`).
4. GitHub Actions: Sikre at miljøvariabler valideres; unngå shell injection ved ikke å interpolere brukerinput i `run:` direkte.

For docker-build workflows: Husk korrekt tagging (unngå misbruk av `latest` som suffix – bruk `IMAGE_TAG` eksplisitt).

---

## Hurtigreferanse

| Kommando             | Beskrivelse                                 |
| -------------------- | ------------------------------------------- |
| `bun run dev`        | Starter både client og server i watch mode. |
| `bun run build`      | Full produksjonsbuild.                      |
| `bun run test`       | Unit tester (client + server).              |
| `bun run playwright` | E2E tester.                                 |
| `bun run storybook`  | Komponentsandbox.                           |

## Videre forbedringer (forslag)

- Separate Docker multi-stage builds for mindre image-størrelse.
- Stryke behov for `UNSAFE_INLINE` via refaktor av tredjepart integrasjon hvis mulig.
- Legge til performance budsjett i CI (automatisk Lighthouse eller Web Vitals).
- Cache ikonbuild mellom commits ved hjelp av hash av `src/*.svg`.

## Lisens og bidrag

Se `CONTRIBUTING.md` for retningslinjer. Alle endringer som påvirker offentlige API-strukturer
(SSR payload keys, parameternavn) bør dokumenteres her og i hoved-README.

---

Har du forslag til forbedringer av denne developer guiden? Opprett gjerne et PR eller ta kontakt på Slack `#dekoratøren_på_navno`.
