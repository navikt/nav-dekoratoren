---
name: nav-dekoratoren
description: Integrer, konfigurer og bidra til Nav Dekoratøren – felles header og footer for nav.no-applikasjoner. Bruk når et team skal ta i bruk Dekoratøren, oppdatere konfigurasjon, legge til breadcrumbs/språkvelger/analytics, håndtere samtykke (ekomloven), eller bidra med ny funksjonalitet i dekoratøren selv.
license: MIT
metadata:
    domain: nav
    tags:
        - nav
        - dekoratoren
        - header
        - footer
        - integration
        - ssr
        - analytics
        - consent
---

# Nav Dekoratøren – integrasjon og bidrag

Dekoratøren er felles header og footer for alle eksternt rettede nav.no-applikasjoner. Den tilbyr
SSR/CSR-integrasjon, innlogging via ID-porten, analytics (Umami), samtykke/cookie-håndtering iht.
ekomloven, og mer.

**Slack:** `#dekoratøren_på_navno`
**Repo:** https://github.com/navikt/nav-dekoratoren
**Moduler-pakke:** https://github.com/navikt/nav-dekoratoren-moduler
**Storybook:** https://navikt.github.io/nav-dekoratoren

---

## Steg 1: Kartlegg hva teamet trenger

Spør brukeren:

1. **Formål** – skal de integrere Dekoratøren for første gang, endre eksisterende konfigurasjon,
   eller bidra med ny funksjonalitet i selve dekoratøren?
2. **Rammeverk** – Next.js (App Router / Page Router), Remix, Vite SPA, eller ren Node/Express?
3. **Miljø** – `prod`, `dev`, eller lokal testing?
4. **Behov** – breadcrumbs, språkvelger, analytics, chatbot, samtykke/cookies, CSP?

Bruk svarene til å skreddersy løsningen i steg 2–5.

---

## Steg 2: Installasjon og oppsett

### 2.1 Installer moduler-pakken

```bash
npm install --save @navikt/nav-dekoratoren-moduler
```

Pakken publiseres kun på **GitHub Packages**. Legg til i `.npmrc`:

```text
@navikt:registry=https://npm.pkg.github.com
```

Logg inn med en PAT med `read:packages`-scope og navikt SSO-autorisasjon:

```bash
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

### 2.2 GitHub Actions

```yaml
- uses: actions/setup-node@v4
  with:
      registry-url: "https://npm.pkg.github.com"

- run: npm ci
  env:
      NODE_AUTH_TOKEN: ${{ secrets.READER_TOKEN }}
```

### 2.3 Access policy i nais.yaml

Ved service discovery (anbefalt – brukes automatisk på dev-gcp/prod-gcp):

```yaml
accessPolicy:
    outbound:
        rules:
            - application: nav-dekoratoren
              namespace: personbruker
```

Ved eksterne ingresser (hvis `serviceDiscovery: false`):

```yaml
accessPolicy:
    outbound:
        external:
            - host: www.nav.no # prod
            - host: dekoratoren.ekstern.dev.nav.no # dev
```

---

## Steg 3: SSR-integrasjon (anbefalt)

Server-side rendering gir best ytelse og unngår layout shift.
Se [SSR-FUNCTIONS.md](./references/SSR-FUNCTIONS.md) for fullstendige API-detaljer.

### 3.1 Next.js App Router

```tsx
// app/layout.tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const Decorator = await fetchDecoratorReact({
        env: "prod",
        params: { context: "privatperson", language: "nb" },
    });

    return (
        <html lang="no">
            <head>
                <Decorator.HeadAssets />
            </head>
            <body>
                <Decorator.Header />
                {children}
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}
```

### 3.2 Next.js Page Router

```tsx
// pages/_document.tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const Decorator = await fetchDecoratorReact({ env: "prod" });
        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;
        return (
            <Html lang="no">
                <Head>
                    <Decorator.HeadAssets />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
```

### 3.3 Express/Node (HTML-fragmenter)

```ts
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

const {
    DECORATOR_HEAD_ASSETS,
    DECORATOR_HEADER,
    DECORATOR_FOOTER,
    DECORATOR_SCRIPTS,
} = await fetchDecoratorHtml({
    env: "dev",
    params: { context: "privatperson" },
});
```

### 3.4 Cache-invalidering

```ts
import { addDecoratorUpdateListener } from "@navikt/nav-dekoratoren-moduler/ssr";

addDecoratorUpdateListener({ env: "prod" }, (versionId) => {
    console.log(`Ny dekoratørversjon: ${versionId} – tømmer cache`);
    myHtmlCache.clear();
});
```

---

## Steg 4: Konfigurasjon

Se [PARAMS.md](./references/PARAMS.md) for alle parametre med type og standardverdi.

De viktigste:

| Parameter            | Type                                                  | Default        |
| -------------------- | ----------------------------------------------------- | -------------- |
| `context`            | `privatperson` / `arbeidsgiver` / `samarbeidspartner` | `privatperson` |
| `language`           | `nb` / `nn` / `en` / `se` / `pl` / `uk` / `ru`        | `nb`           |
| `breadcrumbs`        | `{ title, url, handleInApp? }[]`                      | `[]`           |
| `availableLanguages` | `{ locale, url, handleInApp? }[]`                     | `[]`           |
| `simple`             | `boolean`                                             | `false`        |
| `chatbot`            | `boolean`                                             | `true`         |
| `redirectToApp`      | `boolean`                                             | `false`        |
| `logoutWarning`      | `boolean`                                             | `true`         |
| `feedback`           | `boolean`                                             | `false`        |

---

## Steg 5: Klient-side funksjonalitet

Se [CLIENT-FUNCTIONS.md](./references/CLIENT-FUNCTIONS.md) for fullstendige eksempler.

### 5.1 Breadcrumbs

```ts
import {
    setBreadcrumbs,
    onBreadcrumbClick,
} from "@navikt/nav-dekoratoren-moduler";

setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" },
    {
        title: "Kontakt oss",
        url: "https://www.nav.no/person/kontakt-oss",
        handleInApp: true,
    },
]);

onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url); // for SPA-routing
});
```

### 5.2 Språkvelger

```ts
import {
    setAvailableLanguages,
    onLanguageSelect,
} from "@navikt/nav-dekoratoren-moduler";

setAvailableLanguages([
    { locale: "nb", url: "https://www.nav.no/min-side/nb" },
    { locale: "en", url: "https://www.nav.no/min-side/en", handleInApp: true },
]);

onLanguageSelect((language) => {
    router.push(language.url);
});
```

### 5.3 Analytics (Umami)

```ts
import { getAnalyticsInstance, Events } from "@navikt/nav-dekoratoren-moduler";

const logger = getAnalyticsInstance("min-app-origin");

// Taksonomi-event (strengt typet fra @navikt/analytics-types)
logger(Events.SKJEMA_STARTET, { skjemaId: "1234", skjemanavn: "aap" });

// Custom event
logger.custom("feedback åpnet", { komponent: "feedback-widget", steg: 2 });
```

> ⚠️ `getAmplitudeInstance()` er fjernet i v4+. Bruk `getAnalyticsInstance()`.

### 5.4 Chatbot

```ts
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";

openChatbot(); // åpner Frida og setter chatbotVisible=true
```

---

## Steg 6: Samtykke og cookies (ekomloven)

Se [CONSENT.md](./references/CONSENT.md) for detaljer.

```ts
import {
    awaitDecoratorData,
    isStorageKeyAllowed,
    setNavCookie,
    getNavCookie,
    navLocalStorage,
} from "@navikt/nav-dekoratoren-moduler";

// Vent til dekoratøren har lastet samtykke
await awaitDecoratorData();

// Sjekk om en nøkkel er tillatt
if (isStorageKeyAllowed("min-nøkkel")) {
    setNavCookie("min-nøkkel", "verdi");
}

// Bruk navLocalStorage (respekterer samtykke automatisk)
navLocalStorage.setItem("min-nøkkel", "verdi");
```

---

## Steg 7: CSP-header

```ts
import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";

const csp = await buildCspHeader(
    { "default-src": ["min-cdn.nav.no"], "style-src": ["css.nav.no"] },
    { env: "prod" },
);

res.setHeader("Content-Security-Policy", csp);
```

---

## Steg 8: Bidra til dekoratøren selv

Gjelder bare hvis teamet ønsker å legge inn ny funksjonalitet i selve dekoratøren (ikke bare bruke
den).

### 8.1 Kjør dekoratøren lokalt

```bash
git clone https://github.com/navikt/nav-dekoratoren.git
cd nav-dekoratoren
export NODE_AUTH_TOKEN=<din-github-pat>  # packages:read + navikt SSO
pnpm install && pnpm run build
pnpm run dev   # → http://localhost:8089
```

### 8.2 Monorepo-struktur

```
packages/
  client/    # Web Components + Vite (src/views/, src/events.ts)
  server/    # Hono-server, SSR, API-ruter (src/handlers/, src/views/)
  shared/    # Delte typer, html-template, logger
  icons/     # Ikonbygning
```

### 8.3 Viktige konvensjoner

- **HTML-templates**: bruk `html` tagged template literal fra `decorator-shared/html` (XSS-safe,
  i18n)
- **Web Components**: alle klientkomponenter er native `HTMLElement`-subklasser, registrert med
  `customElements.define()`
- **CSS**: CSS Modules med TypeScript-typing (`*.module.css`)
- **Events**: bruk `window.dispatchEvent()` med types fra `packages/client/src/events.ts`
- **Logging**: bruk `logger` fra `decorator-shared/logger`

### 8.4 Testing og deploy

```bash
pnpm run test       # alle Vitest-tester
pnpm run lint       # ESLint + tsc --noEmit
pnpm run playwright # E2E-tester
```

Deploy via GitHub Actions:

- **`Deploy to dev`** – stabile endringer
- **`Deploy to Team nav.no beta`** – eksperimentelle endringer

PR-er merges kun via squash til `main` → automatisk produksjonsdeploy.

### 8.5 Task Analytics

Vil teamet kjøre spørreundersøkelser basert på URL-mønstre? Konfigureres
i [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config). Ta kontakt på
`#dekoratøren_på_navno`.

---

## Vanlige feil og løsninger

| Problem                                  | Årsak                     | Løsning                                                    |
| ---------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| `403` ved npm install                    | Mangler PAT eller SSO     | Generer PAT med `read:packages`, aktiver navikt SSO        |
| Dekoratøren vises ikke                   | Mangler access policy     | Legg til `nav-dekoratoren` i `accessPolicy.outbound.rules` |
| Layout shift                             | CSR brukes                | Bytt til SSR via `fetchDecoratorReact`                     |
| Cookie ikke satt                         | Samtykke ikke innhentet   | Bruk `awaitDecoratorData()` + `setNavCookie`               |
| `getAmplitudeInstance is not a function` | Gammel versjon av moduler | Oppgrader til v4+ og bytt til `getAnalyticsInstance`       |
| `availableLanguages`-URL feil            | URL utenfor nav.no        | Kun `nav.no` og underdomener er tillatt                    |

---

## Miljøer og ingresser

| Miljø      | Service host                                   | Ingress                                          |
| ---------- | ---------------------------------------------- | ------------------------------------------------ |
| `prod`     | `http://nav-dekoratoren.personbruker`          | `https://www.nav.no/dekoratoren`                 |
| `dev`      | `http://nav-dekoratoren.personbruker`          | `https://dekoratoren.ekstern.dev.nav.no`         |
| `beta`     | `http://nav-dekoratoren-beta.personbruker`     | `https://dekoratoren-beta.intern.dev.nav.no`     |
| `beta-tms` | `http://nav-dekoratoren-beta-tms.personbruker` | `https://dekoratoren-beta-tms.intern.dev.nav.no` |

> ⚠️ Beta-instanser er kun for intern testing av Team Nav.no / Team Min Side og kan være ustabile.
