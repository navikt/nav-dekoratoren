# Nav Dekoratøren & nav-dekoratoren-moduler

Dette dokumentet beskriver:

1. **Nav Dekoratøren** – frontend-applikasjonen som leverer header og footer på nav.no. Den kjører
   på nav.no og eksponerer HTML, API-er, CSP, samtykkebanner, osv.
2. **@navikt/nav-dekoratoren-moduler** – NPM-pakken som gjør det enkelt å integrere Dekoratøren i
   andre apper. Den brukes i _din_ app for å hente, konfigurere og snakke med
   Dekoratøren (SSR/CSR, analytics, cookies, språk, breadcrumbs, m.m.).

---

## 📚 Innholdsfortegnelse

1. [Oversikt over økosystemet](#1-oversikt-over-økosystemet-ℹ️)
    - [1.1 Hva er Nav Dekoratøren?](#11-hva-er-nav-dekoratøren)
    - [1.2 Hva er @navikt/nav-dekoratoren-moduler?](#12-hva-er-naviktnav-dekoratoren-moduler)
    - [1.3 Kontakt og kanaler](#13-kontakt-og-kanaler)
2. [Hvordan bruke Dekoratøren i din app](#2-hvordan-bruke-dekoratøren-i-din-app-🎓)
    - [2.1 Anbefalt: bruk @navikt/nav-dekoratoren-moduler (SSR)](#21-anbefalt-bruk-naviktnav-dekoratoren-moduler-ssr)
    - [2.2 Tilpasset implementasjon med SSR](#22-tilpasset-implementasjon-med-ssr)
    - [2.3 Ikke anbefalt: Direkte Client-Side rendering (CSR-integrasjon)](#23-ikke-anbefalt-direkte-client-side-rendering-csr-integrasjon)
    - [2.4 Ingresser og miljøer](#24-ingresser-og-miljøer)
3. [Konfigurasjon av Dekoratøren](#3-konfigurasjon-av-dekoratøren-🎛️)
    - [3.1 Detaljer](#31-detaljer-🍱)
    - [3.2 Eksempler på bruk](#32-eksempler-på-bruk)
4. [@navikt/nav-dekoratoren-moduler – installasjon og oppsett](#4-naviktnav-dekoratoren-moduler--installasjon-og-oppsett-📦)
    - [4.1 Installasjon fra GitHub Packages](#41-installasjon-fra-github-packages)
    - [4.2 Oppsett lokalt (.npmrc)](#42-oppsett-lokalt-npmrc)
    - [4.3 Oppsett på GitHub Actions](#43-oppsett-på-github-actions)
5. [Hente Dekoratøren via moduler-pakken](#5-hente-dekoratøren-via-moduler-pakken-🏗️)
    - [5.1 Typer og miljøer](#51-typer-og-miljøer)
    - [5.2 Service Discovery](#52-service-discovery)
    - [5.3 Access Policy](#53-access-policy)
        - [5.3.1 Ved Service Discovery (default)](#531-ved-service-discovery-default)
        - [5.3.2 Ved eksterne ingresser](#532-ved-eksterne-ingresser)
6. [Server-Side Rendering (anbefalt)](#6-server-side-rendering-anbefalt-🧱)
    - [6.1 SSR-funksjoner i moduler-pakken](#61-ssr-funksjoner-i-moduler-pakken)
    - [6.2 Detaljer](#62-detaljer)
7. [Client-Side Rendering (CSR)](#7-client-side-rendering-csr-💻)
8. [Andre hjelpefunksjoner i moduler-pakken](#8-andre-hjelpefunksjoner-i-moduler-pakken-🧰)
    - [8.1 Detaljer](#81-detaljer)
9. [Samtykke, cookies og ekomloven](#9-samtykke-cookies-og-ekomloven-🍪)
    - [9.1 Detaljer](#91-detaljer)
10. [Innebygde funksjoner i Dekoratøren](#10-innebygde-funksjoner-i-dekoratøren-🎛️)
    - [10.1 Detaljer](#101-detaljer)

---

## 1. Oversikt over økosystemet ℹ️

### 1.1 Hva er Nav Dekoratøren?

**Nav Dekoratøren** er en frontend-applikasjon som gir en enhetlig **header** og **footer** for
applikasjoner som kjører på nav.no. Alle eksternt rettede frontend-applikasjoner på nav.no
bør bruke Dekoratøren for å skape en helhetlig brukeropplevelse på nav.no.

Dekoratøren tilbyr også felles funksjonalitet som innlogging, analyse, varsel ved utlogging,
søkefunksjonalitet osv, som forklart i denne dokumentasjonen.

- Kjøres som egen app (nais) og eksponerer:
    - HTML-fragmenter for SSR og CSR
    - API-er for CSP, analytics, samtykke, m.m.
- Gir felles funksjonalitet:
    - Innlogging via ID-porten
    - Brukerinformasjon (navn, innloggingsnivå, gjenværende økttid)
    - Søk
    - Språkvelger
    - Utloggingsvarsel
    - Analytics (Umami)
    - Samtykkebanner iht. ekomloven

### 1.2 Hva er @navikt/nav-dekoratoren-moduler?

`@navikt/nav-dekoratoren-moduler` er en **NPM-pakke** som hjelper deg å integrere Dekoratøren i din
app:

- Henter dekoratørens HTML/React-komponenter (SSR / CSR)
- Håndterer miljøer, service discovery og access policy
- Gir hjelpefunksjoner for:
    - CSP-header som inkluderer Dekoratøren
    - Analytics (Umami) via `getAnalyticsInstance`
    - Brødsmulesti (breadcrumbs)
    - Språk og språkvelger
    - Parametre som `context`, `simple`, `chatbot`, osv.
    - Samtykke/cookies i tråd med ekomloven

**Dekoratøren** = appen som kjører på nav.no
**nav-dekoratoren-moduler** = verktøykassa du bruker i din app for å snakke med Dekoratøren

### 1.3 Kontakt og kanaler

Hvis du har noen spørsmål eller forslag til forbedringer angående Dekoratøren eller denne
dokumentasjonen, vennligst ta kontakt med oss på Slack-kanalen `#dekoratøren_på_navno`. Viktige
kunngjøringer postes også i denne kanalen, så vi oppfordrer team som bruker Dekoratøren til å bli
med i denne kanalen. Hvis du ønsker å bidra eller bare vil kjøre Dekoratøren lokalt, vennligst se
CONTRIBUTING.md.

---

## 2. Hvordan bruke Dekoratøren i din app 🎓

Du kan bruke Dekoratøren på to hovedmåter:

- **Anbefalt:** via `@navikt/nav-dekoratoren-moduler` (SSR eller SSR+React)
- **Alternativt:** ved å kalle Dekoratørens endepunkt direkte (SSR/CSR)

Vi anbefaler å bruke NPM-pakken
[@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler), som tilbyr
flere nyttige funksjoner for implementering av Dekoratøren og relaterte funksjoner. Her vil du også
finne hjelpefunksjoner for korrekt håndtering av cookies i henhold til brukers samtykke.

### 2.1 Anbefalt: bruk @navikt/nav-dekoratoren-moduler (SSR)

Moduler-pakken håndterer:

- Hvor Dekoratøren ligger (`prod`/`dev`/`beta`/`betaTms`)
- Service discovery i nais
- Fallback hvis kall feiler
- React-integrasjon for Next.js (`Page Router` / `App Router`)
- Analytics, cookies, språk, brødsmuler, osv.

Typisk flyt:

1. Appen din gjør kall til `fetchDecoratorHtml` eller `fetchDecoratorReact` på serveren
2. HTML/React-komponentene fra Dekoratøren injiseres inn i din app-layout
3. På klienten kan du bruke moduler-pakken til å:
    - oppdatere breadcrumbs og språk
    - logge analytics-events
    - håndtere cookies via samtykke

### 2.2 Tilpasset implementasjon med SSR

Hvis du **ikke** bruker moduler-pakken, kan du kalle Dekoratørens `/ssr`-endepunkt direkte:

```json
{
    "headAssets": "CSS, favicons etc. Burde injiseres i <head> elementet",
    "header": "Header innhold, burde injiseres rett før app-innholdet ditt",
    "footer": "Footer innhold, burde injiseres rett etter app-innholdet ditt",
    "scripts": "<script>-elementer, kan injiseres hvor som helst"
}
```

Eksempel:

```js
fetch("https://www.nav.no/dekoratoren/ssr?context=privatperson&language=en")
    .then((res) => res.json())
    .then((decoratorElements) => {
        const { headAssets, header, footer, scripts } = decoratorElements;
        // injiser disse fire elementene i HTML-responsen til appen din
    });
```

### 2.3 Ikke anbefalt: Direkte Client-Side rendering (CSR-integrasjon)

CSR vil føre til layout shifts samt flere asset-forespørsler, noe som kan forsinke First Contentful
Paint (FCP) i applikasjonen din. Bør unngås hvis du kan bruke SSR.

Direkte CSR ser typisk slik ut:

```html
<html>
    <head>
        <link href="{INGRESS_URL}/css/client.css" rel="stylesheet" />
    </head>
    <body>
        <div id="decorator-header"></div>
        { YOUR_APP }
        <div id="decorator-footer"></div>
        <div id="decorator-env" data-src="{INGRESS_URL}/env?{PARAMETERS}"></div>
        <script async="true" src="{INGRESS_URL}/client.js"></script>
    </body>
</html>
```

Hvis du _må_ bruke CSR, anbefaler vi å gjøre det via `injectDecoratorClientSide` fra moduler-pakken.

### 2.4 Ingresser og miljøer

Dekoratoren betjenes både gjennom service hosts og vanlige ingresser. Hvis du bruker
`@navikt/nav-dekoratoren-moduler`, håndteres alt dette automatisk, avhengig av `env`-parameteren
din.

| Environment          | Service host                                 | Ingress                                        |
| -------------------- | -------------------------------------------- | ---------------------------------------------- |
| `prod`               | http://nav-dekoratoren.personbruker          | https://www.nav.no/dekoratoren                 |
| `dev`                | http://nav-dekoratoren.personbruker          | https://dekoratoren.ekstern.dev.nav.no         |
| `beta`(testing)      | http://nav-dekoratoren-beta.personbruker     | https://dekoratoren-beta.intern.dev.nav.no     |
| `beta-tms` (testing) | http://nav-dekoratoren-beta-tms.personbruker | https://dekoratoren-beta-tms.intern.dev.nav.no |

**Husk:** Betainstansene av Dekoratøren er ment for intern testing av Team Nav.no eller Team Min
Side. Disse instansene kan være ustabile over lengre perioder.

---

## 3. Konfigurasjon av Dekoratøren 🎛️

Hvis du bruker `@navikt/nav-dekoratoren-moduler`, kan du sende et konfigurasjonsobjekt når du
initialiserer Dekoratøren. Hvis du implementerer din egen løsning og henter Dekoratøren direkte, kan
du konfigurere den ved å sende [query parametre](https://en.wikipedia.org/wiki/Query_string) som
en del av fetch-URL-forespørselen.

Alle parametere kan settes klient-side, med mindre det eksplisitt er nevnt at de kun er for
server-side rendering. For mer informasjon,
se [Client-Side Rendering (CSR)](#7-client-side-rendering-csr-💻)

| Konfigurasjon        | Type                                                                    | Default      | Forklaring                                                           |
| -------------------- | ----------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| context              | privatperson / arbeidsgiver / samarbeidspartner                         | privatperson | Angir meny- og kontekstvelgeren i headeren                           |
| simple               | boolean                                                                 | false        | Viser en enkel versjon av header og footer                           |
| simpleHeader         | boolean                                                                 | false        | Viser en enkel versjon av header                                     |
| simpleFooter         | boolean                                                                 | false        | Viser en enkel versjon av footer                                     |
| redirectToApp        | boolean                                                                 | false        | Sender brukeren tilbake til gjeldende URL etter innlogging           |
| redirectToUrl        | string                                                                  | undefined    | Sender brukeren tilbake til angitt URL etter innlogging              |
| redirectToUrlLogout  | string                                                                  | undefined    | Sender brukeren tilbake til angitt URL etter utlogging               |
| language             | nb / nn / en / se / pl / uk / ru                                        | nb           | Angir språk                                                          |
| availableLanguages   | [{ locale: nb / nn / en / se / pl, url: string, handleInApp?: string }] | [ ]          | Angir tilgjengelige språk i språkvelgeren                            |
| breadcrumbs          | [{ title: string, url: string, handleInApp?: string }]                  | [ ]          | Setter brødsmulesti (navigasjonssti)                                 |
| utilsBackground      | white / gray / transparent                                              | transparent  | Setter bakgrunnsfargen for brødsmulesti og språkvelger               |
| feedback             | boolean                                                                 | false        | Viser eller skjuler tilbakemeldingskomponenten                       |
| chatbot              | boolean                                                                 | true         | Aktiverer eller deaktiverer chatboten (Frida)                        |
| chatbotVisible       | boolean                                                                 | false        | Viser eller skjuler chatboten (Frida)                                |
| shareScreen          | boolean                                                                 | true         | Aktiverer eller deaktiverer funksjonen for deling av skjerm i footer |
| logoutUrl            | string                                                                  | undefined    | Angir URL for utlogging                                              |
| logoutWarning        | boolean                                                                 | true         | Aktiverer eller deaktiverer advarsel for utlogging                   |
| redirectOnUserChange | boolean                                                                 | false        | Sender brukeren til nav.no dersom en annen bruker logger inn         |
| pageType             | string                                                                  | undefined    | For logging av sidetype for sidevisning i Analytics                  |
| analyticsQueryParams | string[]                                                                | [ ]          | Hviteliste av query-parametere som skal inkluderes i Analytics       |

### 3.1 Detaljer 🍱

<details>
 <summary><strong>Klikk for å utvide detaljene</strong></summary>

**redirectToApp**

Gjelder både for automatisk innlogging og når innloggingsknappen klikkes. Standardinnstillingen er
`false`, som vil omdirigere brukeren til "Mitt Nav"-applikasjonen etter innlogging.

**redirectToUrl**

Omdirigerer nettleseren til den spesifiserte URL-en etter innlogging. Dette vil overstyre
`redirectToApp`-konfigurasjonen som ble satt. Dette gjelder både for automatisk innlogging og når
innloggingsknappen klikkes.

**redirectToUrlLogout**

Gjelder både for automatisk utlogging (etter å ha sett utloggingsvarselet) og når utloggingsknappen
klikkes.

**language**

Språket settes automatisk på klient-side hvis den nåværende URL-en inneholder **/no/**, **/nb/**, \*
\*/nn/** , **/en/**, eller **/se/\*\*. Dette vil overstyre eventuelle språkparametere som er satt.
Vennligst merk at det faktiske brukergrensesnittet til Dekoratøren kun kan vise sitt eget
tekstinnhold og meny på `nb`, `en`, og `se` (delvis støtte). For mer informasjon,
se [Språkstøtte og nedtrekksmeny](#42-language-support-and-dropdown-menu-)

**availableLanguages**

Hvis applikasjonen din støtter flere språk, kan du fylle ut den innebygde språkvelgeren i
Dekoratøren
slik at brukerne selv kan bytte språk. Denne listen kan også oppdateres klient-side, for eksempel
hvis
visse routes i applikasjonen din støtter spesifikke språk mens andre ikke gjør det.

Bruk [`setAvailableLanguages`](https://github.com/navikt/nav-dekoratoren-moduler#readme) og [
`onLanguageSelect`](https://github.com/navikt/nav-dekoratoren-moduler#readme).

Hvis du setter `handleInApp` til `true`, må du selv håndtere handlinger som endringer i route.

Merk at `url` er begrenset til domenet `nav.no` og eventuelle underdomener. Enhver annen URL vil
resultere i at Dekoratøren returnerer en 500 serverfeil ved forespørsel.

**breadcrumbs**

Kan settes klient-side
med [setBreadcrumbs](https://github.com/navikt/nav-dekoratoren-moduler#readme)
og [onBreadcrumbClick](https://github.com/navikt/nav-dekoratoren-moduler#readme)

Merk at `url` er begrenset til domenet `nav.no` og eventuelle underdomener. Enhver annen URL vil
resultere i at Dekoratøren returnerer en 500 serverfeil ved forespørsel.

**chatbot**

Hvis dette er satt til false, vil ikke chatboten bli initialisert. Dette betyr at den aldri vil
være tilgjengelig for siden eller applikasjonen, selv om brukeren har en aktiv chatøkt.

**chatbotVisible**

Viser eller skjuler Chatbot Frida. Hvis dette er satt til `true`, vil det flytende chatbot-ikonet
alltid være synlig. Når det er satt til `false`, vil chatboten bare være synlig hvis brukeren har en
aktiv chatøkt. Vennligst merk at `chatbotVisible` ikke vil ha noen effekt hvis `chatbot`-argumentet
ovenfor er satt til false.

**logoutUrl**

Hvis denne er satt vil Dekoratøren delegere all utloggingshåndtering til den angitte URL-en. Dette
betyr at **alt relatert til utlogging må håndteres av applikasjonen!** Dette inkluderer, men er ikke
begrenset til, fjerning av cookies og ugyldiggjøring av økter. Bruk med forsiktighet!

Skal ikke forveksles med attributtet `redirectToUrlLogout`, som angir den endelige
omdirigeringsadressen **etter** at brukeren er logget ut.

**logoutWarning**

En modal vil vises etter 55 minutter med innloggingstid, som gir brukeren muligheten til å forlenge
økten med ytterligere 60 minutter eller logge ut umiddelbart. Dette tjener både som en
bekvemmelighet for brukeren og for å oppfylle WCAG-tilgjengelighetskrav.

Hvis du velger å deaktivere denne funksjonen, må du selv implementere en lignende
utloggingsadvarsel.

**redirectOnUserChange**

Hvis denne er satt til `true`, vil siden omdirigere til nav.no hvis det er en endring av gjeldende
bruker i headeren og den autentiserte brukeren på serveren. Dette kan skje hvis brukeren har flere
vinduer
åpne og en ny bruker logger inn i ett av dem, og deretter navigerer til et vindu den gamle brukeren
hadde åpent.

**analyticsQueryParams**

Av personvernhensyn fjernes alle query-parametere fra URL-er før de sendes til analytics. Med
`analyticsQueryParams` kan du hviteliste spesifikke parameternavn som skal inkluderes.

**Viktig:** Du er selv ansvarlig for at hvitelistede parametere ikke inneholder sensitive eller
personidentifiserbare opplysninger. Inkluder kun query-parametere som er trygge å eksponere i
analytics-data.

**analyticsRedactFilter**
Når data sendes til Umami fjernes automatisk enkelte elementer i stier og i data-objektet. UUID er ett eksempel på
data som automatisk fjernes fordi det kan knyttes til enkeltpersoner. Team som ikke ønsker at slik fjernes kan gjøre en såkalt "opt out".

Eksempel: analyticsRedactFilter: ['uuid', 'orgnr']

**Viktig** Det er teamet sitt ansvar å gjøre en risikovurdering i tillegg til eventuelle nødvendige tiltak dersom de ønsker å opte ut av for eksempel uuid-redact.

</details>

### 3.2 Eksempler på bruk

Under er eksempler på forskjellige bruksområder for konfigurasjonsflaggene:

Eksempel 1 - Sett kontekst:<br>

```
https://www.nav.no/dekoratoren/?context=arbeidsgiver
```

Eksempel 2 - Språkvelger:<br>

```
https://www.nav.no/dekoratoren/?availableLanguages=[{"locale":"nb","url":"https://www.nav.no/person/kontakt-oss"},{"locale":"en","url":"https://www.nav.no/person/kontakt-oss/en/"}]
```

Eksempel 3 - Brødsmuler:<br>

```
https://www.nav.no/dekoratoren/?breadcrumbs=[{"url":"https://www.nav.no/person/dittnav","title":"Ditt%20NAV"},{"url":"https://www.nav.no/person/kontakt-oss","title":"Kontakt%20oss"}]
```

---

## 4. @navikt/nav-dekoratoren-moduler – installasjon og oppsett 📦

`@navikt/nav-dekoratoren-moduler` gir utviklere et enkelt grensesnitt for å integrere NAVs
dekoratør (header og footer) i egne applikasjoner – både ved **server-side rendering (SSR)** og \*
\*client-side rendering (CSR)\*\*.

Pakken håndterer miljøkonfigurasjon, service discovery, analyse, språk, brødsmulesti, samtykke (
ekomloven), og mer.

### 4.1 Installasjon fra GitHub Packages

```bash
npm install --save @navikt/nav-dekoratoren-moduler
```

> 💡 Oppdaterte versjoner publiseres kun i **GitHub Packages Registry**.
> For å installere nye versjoner må `@navikt`-scopede pakker hentes fra
> `https://npm.pkg.github.com`.

### 4.2 Oppsett lokalt (.npmrc)

Legg dette i `.npmrc`-filen (opprett om den ikke finnes):

```text
@navikt:registry=https://npm.pkg.github.com
```

Opprett et **Personal Access Token (PAT)** med `read:packages`-scope og SSO auth, og bruk dette som
passord ved login.

```bash
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

### 4.3 Oppsett på GitHub Actions

Sett registry-url med f.eks `actions/setup-node` og bruk `NODE_AUTH_TOKEN` fra
`secrets.READER_TOKEN`.

```yaml
- name: Setup node.js
  uses: actions/setup-node@v4
  with:
      registry-url: "https://npm.pkg.github.com"

- name: Install dependencies
  run: npm ci
  env:
      NODE_AUTH_TOKEN: ${{ secrets.READER_TOKEN }}
```

---

## 5. Hente Dekoratøren via moduler-pakken 🏗️

### 5.1 Typer og miljøer

Dekoratøren kan hentes fra ulike miljøer: `prod`, `dev`, `beta`, `betaTms`, eller `localhost`.
For lokale miljøer må du angi `localUrl`.

```tsx
type DecoratorNaisEnv =
    | "prod" // For produksjons-instans av dekoratøren
    | "dev" // For stabil dev-instans
    | "beta" // Beta dev-instanser er ment for internt test-bruk
    | "betaTms"; // Disse kan være ustabile i lengre perioder

type DecoratorEnvProps =
    // Dersom env er satt til localhost, må du selv sette url for dekoratøren.
    | { env: "localhost"; localUrl: string }
    // For nais-miljøer settes url automatisk
    | { env: DecoratorNaisEnv; serviceDiscovery?: boolean };

type DecoratorFetchProps = {
    // Query-parametre til dekoratøren, se dekoratørens readme for dokumentasjon
    params?: DecoratorParams;
} & DecoratorEnvProps;
```

### 5.2 Service Discovery

Server-side fetch bruker [service discovery](https://docs.nais.io/clusters/service-discovery) som
standard. Vær obs på at dette kun fungerer ved kjøring på nais-clusterne `dev-gcp` eller `prod-gcp`.
Dersom appen ikke kjører i ett av disse clusterne, vil vi falle tilbake til å kalle eksterne
ingresser.

Du kan også sette parameteret `serviceDiscovery: false` for å alltid benytte eksterne ingresser.

```ts
fetchDecoratorHtml({
    env: "prod",
    serviceDiscovery: false, // hvis du alltid vil bruke eksterne ingresser
});
```

### 5.3 Access Policy

Se [Nais dokumentasjon](https://docs.nais.io/nais-application/access-policy) for oppsett av access
policy.

#### 5.3.1 Ved Service Discovery (default)

Ved bruk av service discovery må følgende regel inkluderes i access policy:

```yaml
accessPolicy:
    outbound:
        rules:
            - application: nav-dekoratoren
              namespace: personbruker
```

#### 5.3.2 Ved eksterne ingresser

Dersom service discovery ikke benyttes, vil dekoratørens eksterne ingresser kalles. Dette gjelder
ved bruk av versjon 1.9 eller tidligere, eller dersom `serviceDiscovery: false` er satt.

Følgende access policy kreves:

```yaml
accessPolicy:
    outbound:
        external:
            - host: www.nav.no # prod
            - host: dekoratoren.ekstern.dev.nav.no # dev
```

---

## 6. Server-Side Rendering (anbefalt) 🧱

Server-side rendering (SSR) av dekoratøren anbefales for optimal brukeropplevelse.
Dersom kallet feiler (etter tre forsøk), falles det tilbake til statiske placeholder-elementer som
rendres client-side.

### 6.1 SSR-funksjoner i moduler-pakken

| Funksjon                            | Type                | Forklaring                                                                |
| ----------------------------------- | ------------------- | ------------------------------------------------------------------------- |
| `injectDecoratorServerSide`         | server-side         | Parser HTML-fil og setter inn dekoratør-HTML via JSDOM                    |
| `injectDecoratorServerSideDocument` | server-side         | Setter inn dekoratøren i et eksisterende `Document`-objekt                |
| `fetchDecoratorHtml`                | server-side         | Henter dekoratøren som HTML-fragmenter                                    |
| `fetchDecoratorReact`               | server-side (React) | Henter dekoratøren som React-komponenter for SSR-rammeverk (Next.js m.m.) |

### 6.2 Detaljer

<details>
<summary><strong>Klikk for å utvide detaljene</strong></summary>

**injectDecoratorServerSide**

Parser en HTML-fil med JSDOM og returnerer en HTML-string som inkluderer dekoratøren. Krever at
`jsdom >=16.x` er installert.

```ts
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSide({
    env: "prod",
    filePath: "index.html",
    params: { context: "privatperson", simple: true },
}).then((htmlWithDecorator: string) => {
    res.send(htmlWithDecorator);
});
```

**injectDecoratorServerSideDocument**

Setter inn dekoratøren i et Document DOM-objekt. Objektet i document-parameteret muteres.

```ts
import { injectDecoratorServerSideDocument } from "@navikt/nav-dekoratoren-moduler/ssr";

injectDecoratorServerSideDocument({
    env: "prod",
    document: myDocument,
    params: { context: "privatperson", simple: true },
}).then((document: Document) => {
    const html = document.documentElement.outerHTML;
    res.send(html);
});
```

**fetchDecoratorHtml**

Henter dekoratøren som HTML-fragmenter.

```ts
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

const fragments = await fetchDecoratorHtml({
    env: "dev",
    params: { context: "privatperson" },
});

const {
    DECORATOR_HEAD_ASSETS,
    DECORATOR_HEADER,
    DECORATOR_FOOTER,
    DECORATOR_SCRIPTS,
} = fragments;
```

**fetchDecoratorReact**

Henter dekoratøren som React-komponenter. Kan benyttes med React rammeverk som støtter server-side
rendering. Krever at `react >=17.x` og `html-react-parser >=5.x` er installert.

Ved behov kan det settes en egendefinert komponent for `<script>`-elementer i `<Decorator.Scripts>`.
Denne vil erstatte standard `<script>`-tags i parseren. Ved bruk av next.js app-router kan
`next/script` benyttes her, se
eksempel [Eksempel 2- Med next.js app router](#eksempel-2--nextjs-app-router).

##### Eksempel 1 – Next.js Page Router

Brukes i `pages/_document.tsx`:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        const Decorator = await fetchDecoratorReact({
            env: "prod",
            params: { language: "nb", context: "arbeidsgiver" },
        });

        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;

        return (
            <Html lang={"no"}>
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

##### Eksempel 2 – Next.js App Router

Brukes i `app/layout.tsx` med `next/script` loader:

```tsx
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";

const RootLayout = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const Decorator = await fetchDecoratorReact({
        env: "prod",
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
};

export default RootLayout;
```

</details>

---

## 7. Client-Side Rendering (CSR) 💻

> ⚠️ CSR anbefales ikke. Bruk SSR hvis det er teknisk mulig.

CSR kan brukes i spesielle tilfeller, men vil gi layout-shift og dårligere brukeropplevelse.

```ts
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";

injectDecoratorClientSide({
    env: "prod",
    params: {
        simple: true,
        chatbot: true,
    },
});
```

Kun aktuelt dersom SSR ikke lar seg gjøre i din arkitektur.

## 8. Andre hjelpefunksjoner i moduler-pakken 🧰

| Funksjon                        | Type          | Forklaring                                             |
| ------------------------------- | ------------- | ------------------------------------------------------ |
| `addDecoratorUpdateListener`    | server-side   | Callback ved ny dekoratørversjon (cache-invalidering)  |
| `removeDecoratorUpdateListener` | server-side   | Fjerner registrert callback                            |
| `getDecoratorVersionId`         | server-side   | Henter nåværende versjons-ID for dekoratøren           |
| `buildCspHeader`                | server-side   | Bygger CSP som inkluderer dekoratørens direktiver      |
| `getAnalyticsInstance`          | client/server | Logger events til Umami                                |
| `setBreadcrumbs`                | client-side   | Setter brødsmulesti i Dekoratøren                      |
| `onBreadcrumbClick`             | client-side   | Håndterer klikk på breadcrumbs ved client-side routing |
| `setAvailableLanguages`         | client-side   | Setter språk-alternativer i språkvelgeren              |
| `onLanguageSelect`              | client-side   | Håndterer språkvalg ved client-side routing            |
| `setParams` / `getParams`       | client-side   | Dynamisk oppdatering/lesing av Dekoratør-parametre     |
| `openChatbot`                   | client-side   | Åpner Chatbot Frida og setter `chatbotVisible=true`    |

---

### 8.1 Detaljer

<details>
<summary><strong>Klikk for å utvide detaljene</strong></summary>

**addDecoratorUpdateListener / removeDecoratorUpdateListener**

Legger til/fjerner en callback-funksjon som kalles når en ny versjon av dekoratøren er deployet til
valgt miljø. Tiltenkt brukt for cache-invalidering i apper som cacher dekoratørens HTML.

```ts
import { addDecoratorUpdateListener } from "@navikt/nav-dekoratoren-moduler/ssr";

const flushHtmlCache = (versionId: string) => {
    console.log(`New decorator version: ${versionId} - clearing render cache!`);
    myHtmlCache.clear();
};

addDecoratorUpdateListener({ env: "prod" }, flushHtmlCache);
```

**getDecoratorVersionId**

Henter nåværende versjons-id for dekoratøren i valgt miljø.

```ts
import { getDecoratorVersionId } from "@navikt/nav-dekoratoren-moduler/ssr";

const currentVersionId = await getDecoratorVersionId({ env: "prod" });
```

**buildCspHeader**

Bygger en CSP (Content Security Policy) header som inkluderer dekoratørens påkrevde direktiver,
kombinert
med applikasjonens egne direktiver.

Funksjonen gjør et fetch-kall til dekoratøren for å hente gjeldende direktiver.

```ts
import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";

// Direktiver appen din benytter
const myAppDirectives = {
    "default-src": ["foo.bar.com"],
    "style-src": ["my.css.cdn.com"],
};

const csp = await buildCspHeader(myAppDirectives, { env: "prod" });

app.get("*", (req, res) => {
    res.setHeader("Content-Security-Policy", csp);

    res.send("Hello!");
});
```

**getAnalyticsInstance**

Metoden støtter det til en hver tid gjeldende analyseverktøyet i Nav. Den bygger en logger-instans som sender
events til våre analyseverktøy via dekoratørens klient. Besøk (sidevisning) vil håndteres automatisk,
andre events kan sendes inn via opprettet logger-instans. Den tar i mot et parameter `origin`
slik at man kan filtrere events som kommer fra egen app. Det er sterkt anbefalt å følge Navs
taksonomi for analyseverktøy: https://github.com/navikt/analytics-taxonomy

```ts
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAnalyticsInstance("minAppOrigin");

logger("skjema åpnet", {
    skjemaId: 1234,
    skjemanavn: "aap",
});
```

**setBreadcrumbs**

Parameteret `breadcrumbs` (brødsmulestien) kan endres / settes på klient-siden ved behov.

Obs! Klikk på breadcrumbs logges til analyseverktøy (Umami). Ettersom title i noen apper
kan inneholde personopplysninger, som f.eks. navn på bruker, så logges dette i utgangspunktet kun
som `[redacted]` til Umami.

Om ønskelig kan feltet `analyticsTitle` også settes, dersom du ønsker å logge en title. Husk å
fjerne eventuelle personopplysninger fra denne!

```tsx
// Type
export type DecoratorBreadcrumb = {
    url: string;
    title: string;
    analyticsTitle?: string;
    handleInApp?: boolean;
};

// Bruk
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";

setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Kontakt oss",
        url: "https://www.nav.no/person/kontakt-oss/nb/",
        handleInApp: true, // Håndteres av onBreadcrumbClick
    },
]);

// Bruk med analyticsTitle
setBreadcrumbs([
    { title: "Ditt Nav", url: "https://www.nav.no/person/dittnav" }, // Sender brukeren til definert url
    {
        title: "Opplysninger for Ola Nordmann",
        analyticsTitle: "Opplysninger for <Navn>",
        url: "https://www.nav.no/min-innloggede-tjeneste",
    },
]);
```

**onBreadcrumbClick**

Kalles med `breadcrumb`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for
client-side routing.

```tsx
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url);
});
```

**setAvailableLanguages**

Parameteret `languages` (liste av tilgjengelige språk i språkvelgeren) kan endres / settes
client-side ved behov.
Aktivt språk kan hentes ut fra cookien `decorator-language`.

```tsx
// Type
export type DecoratorLocale = "nb" | "nn" | "en" | "se" | "pl" | "uk" | "ru";
export type DecoratorLanguageOption =
    | {
          url?: string;
          locale: DecoratorLocale;
          handleInApp: true;
      }
    | {
          url: string;
          locale: DecoratorLocale;
          handleInApp?: false;
      };

// Bruk
import { setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";

setAvailableLanguages([
    { locale: "nb", url: "https://www.nav.no/person/kontakt-oss/nb/" }, // Sender brukeren til definert url
    {
        locale: "en",
        url: "https://www.nav.no/person/kontakt-oss/en/",
        handleInApp: true,
    }, // Håndteres av onLanguageSelect
]);
```

**onLanguageSelect**

Kalles med `language`-parametre dersom `handleInApp` var satt til `true`. Kan benyttes for
client-side routing.

```tsx
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import router from "my-routing-library";

onLanguageSelect((language) => {
    router.push(language.url);
});
```

**setParams**

Samtlige parametre kan settes client-side via `setParams` dersom `setAvailableLanguages` og
`setBreadcrumbs` ikke er tilstrekkelig.

```tsx
// Type
export type DecoratorParams = Partial<{
    context: "privatperson" | "arbeidsgiver" | "samarbeidspartner";
    simple: boolean;
    simpleHeader: boolean;
    simpleFooter: boolean;
    redirectToApp: boolean;
    redirectToUrl: string;
    language: DecoratorLocale;
    availableLanguages: DecoratorLanguageOption[];
    breadcrumbs: DecoratorBreadcrumb[];
    utilsBackground: "white" | "gray" | "transparent";
    feedback: boolean;
    chatbot: boolean;
    chatbotVisible: boolean;
    shareScreen: boolean;
    logoutUrl: string;
    logoutWarning: boolean;
    redirectOnUserChange: boolean;
    pageType: string;
    analyticsQueryParams: string[];
}>;

// Bruk
import { setParams } from "@navikt/nav-dekoratoren-moduler";

setParams({
    simple: true,
    chatbot: true,
});
```

**getParams**

Leser gjeldende parametre fra dekoratøren.

```tsx
import { getParams } from "@navikt/nav-dekoratoren-moduler";

getParams();
```

**openChatbot**

Åpner Chatbot Frida og setter `chatbotVisible=true`.

```tsx
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";

openChatbot();
```

</details>

---

## 9. Samtykke, cookies og ekomloven 🍪

Etter at en strengere **Lov om elektronisk kommunikasjon** (ekomloven) ble gjort gjeldende fra 1.
januar
2025, har Nav måttet innhente samtykke før verktøy for analyse, statistikk etc kunne bli tatt i
bruk.

For nav-dekoratoren-moduler har vi laget en rekke hjelpefunksjoner som et ment å bidra til at
teamene etterlever den nye ekomloven.

Disse funksjonene er et forslag til hva vi tror teamene vil kunne trenge, så vi håper at team som
ønsker seg andre funksjoner melder ifra på #dekoratøren_på_navno på Slack slik at vi kan utvide
nav-dekoratoren-moduler og fortsatt gjøre den nyttig for teamene.

Dekoratøren viser samtykkebanner og håndterer lagring på tvers, mens **nav-dekoratoren-moduler** gir
praktiske helpers for appene:

| Funksjon                                | Forklaring                                                              |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `awaitDecoratorData()`                  | Vent til Dekoratøren har lastet samtykke-data før du jobber med cookies |
| `isStorageKeyAllowed(key)`              | Sjekk om en nøkkel er lov å bruke                                       |
| `getAllowedStorage()`                   | Få liste over tillatt lagring (cookies, localStorage, sessionStorage)   |
| `setNavCookie` / `getNavCookie`         | sette/lese cookies etter tillatt-liste + samtykke                       |
| `navSessionStorage` / `navLocalStorage` | wrappers rundt storage som respekterer samtykke                         |

### 9.1 Detaljer

<details>
 <summary><strong>Klikk for å utvide detaljene</strong></summary>

**awaitDecoratorData**

Dersom du trenger å lese/skrive cookies som en del av oppstarten i applikasjonen, kan det hende at
du må vente til dekoratøren har lastet inn dataene.

```ts
const initMyApp = async () => {
    await awaitDecoratorData();
    doMyAppStuff();
};
```

**isStorageKeyAllowed(key: string)**

Sjekker om en nøkkel er tillatt å sette:

1. er den i tillatt-listen
2. hvis nøkkelen er markert som frivillig (og dermed krever samtykke): har bruker samtykket til
   denne type lagring

Funksjonene for å lese og skrive (cookies, localstorage etc) sjekker dette selv automatisk, så denne
funksjonen er laget for å gi team en mulighet til å sjekke skrivbarhet uten å faktisk skrive.

Kan brukes for både cookies, localStorage og sessionStorage.

```ts
import { isStorageKeyAllowed } from '@navikt/nav-dekoratoren-moduler'

// Returnerer false fordi 'jabberwocky' ikke er i tillatt-listen.
const isJabberwocky = isStorageKeyAllowed('jabberwocky')
:

// Selv om 'usertest' er i tillatt-listen har ikke bruker gitt sitt samtykke i dette tenkte eksempelet, så funksjonen returnerer false.
const isUsertestAllowed = isStorageKeyAllowed('usertest-229843829')

```

**getAllowedStorage()**

Denne returnerer en liste over alle ting som er lov å sette, enten cookies, localStorage etc. Vi
tilbyr denne til team som vil lage sine egne løsninger eller som trenger funksjonalitet som ikke
finnes i nav-dekoratoren-moduler. I hovedsak tenker vi at isStorageKeyAllowed ovenfor vil fungere
best i de fleste tilfeller.

Retunerer tillatt lagring for både cookies, localStorage og sessionStorage.

**setNavCookie / getNavCookie**

Denne kan brukes for å sette cookies og være sikker på at det er tillatt å sette de. Funksjonen
sjekker på om (1) cookien er i tillatt-listen og (2) brukeren har gitt nødvendige samtykker hvis
cookien er frivillig.

Dersom det for eksempel er en cookie som er team har definert som nødvendig kan den settes uansett
så lenge den ligger i listen over tillatte cookies.

Dersom cookien er regnet som frivillig vil den ikke kunne settes dersom bruker ikke har gitt
samtykke til at Nav kan lagre alle frivillige cookies.

```ts
import { setNavCookie, getNavCookie } from "@navikt/nav-dekoratoren-moduler";

// Tillatt fordi tillatt-listen har registrert 'usertest-*' som tillatt cookie.
setNavCookie("usertest-382738");

// Returnerer null fordi 'foobar' ikke er i tillatt-listen.
const foo = getNavCookie("foobar");
```

**navSessionStorage/navLocalStorage**

Utvider sessionStorage og localStorage og eksponerer de samme funksjonene. Forskjellen er at
nav\*Storage først sjekker om en nøkkel er tillatt å sette basert på tillattlisten og status på
eksisterende samtykke.

## </details>

## 10. Innebygde funksjoner i Dekoratøren 🎛️

Denne delen gjelder selve **Dekoratøren-appen**, uavhengig av om du bruker moduler-pakken eller
ikke.

| Funksjon / Tema              | Type                      | Formål / Forklaring                                                |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------ |
| Content Security Policy      | server-side               | Bygger og eksponerer CSP-headere for sikker lasting av dekoratøren |
| Språkstøtte og nedtrekksmeny | client-side               | Viser språkvelger i headeren og håndterer språkvalg                |
| Søk                          | client-side               | Tilbyr søk uten behov for ekstra konfigurasjon                     |
| Innlogging                   | client-side / server-side | Håndterer innlogging via ID-porten og viser brukerinformasjon      |
| Utloggingsvarsel             | client-side               | Viser varsel 5 min før sesjonen utløper, lar bruker forlenge økten |
| Token-regler                 | server-side               | Forklarer gyldighet og fornyelse av tokens (NAIS auth)             |
| Analytics (Umami)            | client-side               | Logger brukerhendelser til Umami                                   |
| Task Analytics & Skyra       | client-side               | Laster undersøkelsesskript for godkjente brukere                   |
| Skip-lenke til hovedinnhold  | client-side               | Forbedrer universell utforming, hopper direkte til maincontent     |
| Samtykkebanner               | client-side               | Håndterer brukerens samtykke for cookies og analyse                |

---

### 10.1 Detaljer

<details>
<summary><strong>Klikk for å utvide alle beskrivelser</strong></summary>

**Content Security Policy 👮**

Du kan finne det nåværende CSP-direktivet
på [https://www.nav.no/dekoratoren/api/csp](https://www.nav.no/dekoratoren/api/csp). Du kan også
inspisere den faktiske koden
på [content-security-policy.ts](https://github.com/navikt/decorator-next/blob/main/packages/server/src/content-security-policy.ts)
for en bedre forståelse av hvordan CSP fungerer.

[`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) pakken tilbyr
også metoder for å generere en CSP-header som er kompatibel med Dekoratøren. Hvis du bygger din egen
tilpassede implementasjon, må du sørge for at dine CSP-headere samsvarer med de til Dekoratøren.

**Språkstøtte og nedtrekksmeny 🌎**

Brukergrensesnittet (header, meny, footer, osv.) støtter tre språk:

- Norsk bokmål
- English
- Sami (delvis)

Du kan tilby `availableLanguages` for å fylle ut språkvelgeren, avhengig av hvor mange språk
applikasjonen din støtter (se [seksjon for parametere](#31-oversikt-over-config-parametere)).
Imidlertid vil det faktiske brukergrensesnittet i headeren og footeren kun vises på ett av de tre
nevnte språkene.

**Søk 🔎**

Søk tilbys ut av boksen, uten behov for konfigurasjon fra din side. Søkefunksjonen vil enten peke
til produksjons- eller utviklingsmiljøer, avhengig av hvordan Dekoratøren er satt opp.

**Innlogging 🔐**

Dekoratøren tilbyr en innloggingsknapp (og utloggingsknapp) som omdirigerer brukeren til ID-porten
(enten produksjon eller utvikling) hvor brukeren kan logge inn.

Dekoratøren bruker interne API-endepunkter for å vise brukerens navn, innloggingsnivå og gjenværende
økttid.

Vennligst merk at det ikke finnes noe innloggings-API eksponert fra Dekoratøren til applikasjonen
din, noe som betyr at ingen brukerlegitimasjon blir eksponert for applikasjonen din på noen
meningsfull eller brukbar måte. Hvis du trenger å sjekke autentisering eller legitimasjon for
brukeren, må du sette dette opp selv ved å koble direkte til tjenestene på login.nav.no. For mer
informasjon, se
[Authentication and Authorization at NAIS](https://docs.nais.io/auth/).

**Utloggingsvarsel 🔐**

En utloggingsvarsel vises for brukeren 5 minutter før innloggingstokenet utløper. Brukeren kan da
velge å forlenge økten med ytterligere 60 minutter eller klikke "Logg ut" for å logge ut
umiddelbart.

Brukernes totale sesjon har en maksimal levetid på 6 timer, hvoretter brukeren må logge ut og logge
inn igjen.

Utloggingsvarselet er aktivert som standard. Du kan deaktivere denne funksjonen ved å sette
`logoutWarning=false`som en parameter. Imidlertid krever retningslinjer for tilgjengelighet og WCAG
at du bygger din egen
mekanisme for å la brukere utsette utlogging.

**Regler for tokens 🔐**

Du kan lese mer om tokens i
[NAIS-dokumentasjonen](https://docs.nais.io/auth/). Nedenfor er et sammendrag som forklarer hvordan
utloggingsvarselet oppfører seg:

- Tokens er gyldig i 60 minutter hvis det ikke fornyes.
- Økten er gyldig i 6 timer og kan ikke fornyes, dvs. brukeren må logge ut og deretter inn igjen.
- 5 minutter før tokenet utløper, blir brukeren presentert med alternativer for enten å fortsette å
  være
  logget inn eller logge ut umiddelbart.
- Disse fornyelsene forlenger økten med ytterligere 60 minutter.
- Etter ytterligere 55 minutter vil brukeren bli presentert med utloggingsvarslingen igjen.
- Etter totalt 6 timer (session expiration) med å være logget inn, må brukeren logge inn på nytt.
- For øyeblikket blir brukeren presentert med utloggingsvarslingen uavhengig av aktivitet.

**Analytics 📊**

Nav bruker Umami for analyse og sporing av brukerehendelser. Foretrukket metode er å bruke
`nav-dekoratoren-moduler`, se **getAnalyticsInstance** over.

**Analytics og samtykke 👍👎**

Hvis brukeren ikke har gitt samtykke til sporing og analyse, vil ikke Umami
initialisere. I stedet vil en mock-funksjon bli returnert. Mock-funksjonen vil ta imot all
logging og forkaste den før den sendes fra brukeren, derfor trenger ikke teamet å håndtere mangel på
samtykke spesielt med mindre de har spesifikke behov.

**Undersøkelser ved bruk av Task Analytics og Skyra 📋**

Task Analytics og Skyra brukes for å gjennomføre undersøkelser på nav.no. Dekoratøren vil laste de
nødvendige skriptene for begge tjenestene, men kun hvis brukeren har gitt samtykke til
undersøkelser. Task Analytics-undersøkelser settes opp i et eget repository. Vennligst
se [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config) eller kontakt Team
Nav.no for mer informasjon.

For Skyra styres alle undersøkelser i dashbordet ditt. Du kan finne
[mer informasjon om Skyra her](https://www.skyra.no/no). Undersøkelsene dine skal vises
automatisk når de er riktig konfigurert i Skyra-dashbordet ditt.

**Skip-lenke til hovedinnhold 🔗**

En skip-lenke rendres i headeren hvis et element med id `maincontent` eksisterer i dokumentet. Ved å
klikke på skip-lenken vil fokus settes til maincontent-elementet. Elementet må være fokuserbart,
noe som kan oppnås ved å sette attributtet `tabindex="-1"`.

Eksempel:

```html
<main id="maincontent" tabindex="-1"><!-- app html går her! --></main>
```

**Samtykkebanner 👌**

Brukere vil bli presentert for et samtykkebanner som ber om samtykke til sporing og analyse. Dette
påvirker alle typer lagring (cookies, localStorage, sessionStorage) på brukerens enhet. Hvis
brukeren ikke samtykker, er kun nødvendig ("strengt nødvendig") lagring tillatt. Dette betyr at
Umami, Skyra osv ikke vil starte.

[`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) pakken tilbyr
hjelpefunksjoner for enkel håndtering av samtykke. Den tilbyr også hjelpefunksjoner for å sette og
lese cookies, som sikrer at kun tillatte cookies kan settes.

</details>
