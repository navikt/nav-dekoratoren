# SSR-funksjoner i @navikt/nav-dekoratoren-moduler

Importeres fra `@navikt/nav-dekoratoren-moduler/ssr`.

## fetchDecoratorHtml

Returnerer dekoratøren som HTML-fragmenter. Brukes for manuell injeksjon.

```ts
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

const {
    DECORATOR_HEAD_ASSETS, // CSS, favicons → <head>
    DECORATOR_HEADER, // Header HTML → rett før app-innhold
    DECORATOR_FOOTER, // Footer HTML → rett etter app-innhold
    DECORATOR_SCRIPTS, // <script>-elementer → hvor som helst
} = await fetchDecoratorHtml({
    env: "dev",
    params: { context: "privatperson" },
});
```

## fetchDecoratorReact

Returnerer React-komponenter for SSR-rammeverk (Next.js, Remix m.m.).
Krever `react >=17.x` og `html-react-parser >=5.x`.

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script"; // valgfritt: kun for App Router

const Decorator = await fetchDecoratorReact({
    env: "prod",
    params: { context: "privatperson", language: "nb" },
});

// Komponenter: <Decorator.HeadAssets />, <Decorator.Header />,
//              <Decorator.Footer />, <Decorator.Scripts loader={Script} />
```

## injectDecoratorServerSide

Parser en HTML-fil med JSDOM og returnerer HTML-string med dekoratøren injisert.
Krever `jsdom >=16.x`.

```ts
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";

const html = await injectDecoratorServerSide({
    env: "prod",
    filePath: "index.html",
    params: { context: "privatperson", simple: true },
});

res.send(html);
```

## injectDecoratorServerSideDocument

Setter inn dekoratøren i et eksisterende `Document`-objekt (muteres).

```ts
import { injectDecoratorServerSideDocument } from "@navikt/nav-dekoratoren-moduler/ssr";

const document = await injectDecoratorServerSideDocument({
    env: "prod",
    document: myDocument,
    params: { context: "privatperson" },
});

res.send(document.documentElement.outerHTML);
```

## addDecoratorUpdateListener / removeDecoratorUpdateListener

Registrer callback ved ny dekoratørversjon. Brukes for cache-invalidering.

```ts
import {
    addDecoratorUpdateListener,
    removeDecoratorUpdateListener,
} from "@navikt/nav-dekoratoren-moduler/ssr";

const onUpdate = (versionId: string) => {
    console.log(`Ny versjon: ${versionId}`);
    myCache.clear();
};

addDecoratorUpdateListener({ env: "prod" }, onUpdate);

// Fjern igjen:
removeDecoratorUpdateListener({ env: "prod" }, onUpdate);
```

## getDecoratorVersionId

Henter nåværende versjons-ID for dekoratøren.

```ts
import { getDecoratorVersionId } from "@navikt/nav-dekoratoren-moduler/ssr";

const versionId = await getDecoratorVersionId({ env: "prod" });
```

## buildCspHeader

Bygger CSP-header som kombinerer appens egne direktiver med dekoratørens påkrevde direktiver.

```ts
import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";

const csp = await buildCspHeader(
    {
        "default-src": ["min-cdn.nav.no"],
        "style-src": ["css.nav.no"],
    },
    { env: "prod" },
);

res.setHeader("Content-Security-Policy", csp);
```

## Miljøer og service discovery

```ts
// Service discovery (default, fungerer på dev-gcp/prod-gcp)
fetchDecoratorHtml({ env: "prod" });

// Alltid eksterne ingresser
fetchDecoratorHtml({ env: "prod", serviceDiscovery: false });

// Lokal utvikling
fetchDecoratorHtml({ env: "localhost", localUrl: "http://localhost:8089" });
```
