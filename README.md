# Nav Dekoratøren

> ## ⚠️ Viktig beskjed om logging til Amplitude og Umami 📊
>
> Fra og med 1. november vil logging til Amplitude være avviklet i prod. Vi fjerner deler av koden i
> dekoratøren, men beholder funksjonene som eksporteres
> i [nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler). Det samme gjelder
> `window.dekoratorenAmplitude` som vil være en dummy-funksjon som kun returnerer et resolved promise
> uten å faktisk logge til Amplitude.
>
> Dette gjør vi for å unngå breaking changes hos team som ikke har gått over til den mer agnostiske
> `logAnalyticsEvent` og `getAnalyticsInstance`. Team som ikke har gått over til disse vil oppleve
> at det logges info om at Amplitude er avviklet.
>
> For team som ikke har gått over til Umami:
> [nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler) (fra versjon 3.2.3,
> april) eksporterer `getAnalyticsInstance` og `logAnalyticsEvent`. Disse oppfører seg på samme måte
> som
> de gamle Amplitude-funksjonene slik at det bare er å bytte ut navnene i koden til teamene.
> For team som av diverse årsaker kaller `window.dekoratorenAmplitude`, kan dere bruke
> `window.dekoratorenAnalytics`.
>
> Etter 20. desember fjerner vi resterende dummy-funksjoner relatert til Amplitude, så etter den
> datoen vil funksjoner og typedefinisjoner begynne å feile for team som ikke har gått over til
> _Analytics_-funksjonene. Ta kontakt med #team-navno eller #dekoratøren_på_navno på Slack hvis dere
> trenger hjelp eller har innspill!

## Innholdsfortegnelse

- [1. Om dekoratøren ℹ️](#about-the-decorator)
- [2. Hvordan bruke Dekoratøren i din applikasjon 🎓](#hvordan-bruke-dekoratoren-i-din-applikasjon)
- [Configuring the Decorator to your needs](#configuring-the-decorator-to-your-needs)
- [Other built-in features](#other-built-in-features)

## 1. Om dekoratøren ℹ️

Dette er en frontend applikasjon som gir en enhetlig header/footer for applikasjoner som kjører på
nav.no. Alle frontend-applikasjoner som retter seg mot det offentlige bør bruke Dekoratøren for å
skape en
helhetlig brukeropplevelse på nav.no.

Dekoratøren tilbyr også felles funksjonalitet som innlogging, analyse, varsel ved utlogging,
søkefunksjonalitet osv, som forklart i denne dokumentasjonen.

### 1.1 Forslag, tilbakemeldinger eller deltakelse 🙋

Hvis du har noen spørsmål eller forslag til forbedringer angående Dekoratøren eller denne
dokumentasjonen, vennligst ta kontakt med oss på Slack-kanalen `#dekoratøren_på_navno`. Hvis du
ønsker å bidra eller bare vil kjøre Dekoratøren lokalt, vennligst se CONTRIBUTING.md.

### 1.2 Kanal for kunngjøringer 📣

Viktige kunngjøringer postes i `#dekoratøren_på_navno`, så vi oppfordrer team som bruker Dekoratøren
til å bli med i denne kanalen.

---

## 2 Hvordan bruke Dekoratøren i din applikasjon 🎓

Du kan bruke Dekoratøren gjennom både SSR (server-side rendering) og CSR (client-side rendering). Vi
anbefaler å implementere Dekoratøren via SSR fordi det resulterer i færre
[layout shifts](https://web.dev/articles/cls) når applikasjonen din laster, og dermed gir en bedre
brukeropplevelse.

### 2.1 @navikt/nav-dekoratoren-moduler 📦

Vi anbefaler å bruke NPM-pakken
[@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler), som tilbyr
flere nyttige funksjoner for implementering av Dekoratøren og relaterte funksjoner. Her vil du også
finne hjelpefunksjoner for korrekt håndtering av cookies i henhold til brukers samtykke.

### 2.2 Tilpasset implementasjon med server-side rendering ⚙️

Dekoratøren består av fire HTML-strenger som må injiseres i HTML-en til applikasjonen din. Disse
betjenes fra `/ssr`-endepunktet til Dekoratøren:

```json
{
    "headAssets": "CSS, favicons etc. Burde injiseres i <head> elementet",
    "header": "Header innhold, burde injiseres rett før app-innholdet ditt",
    "footer": "Footer innhold, burde injiseres rett etter app-innholdet ditt",
    "scripts": "<script> elementer, kan injiseres hvor som helst"
}
```

Eksempel:

```javascript
fetch("https://www.nav.no/dekoratoren/ssr?context=privatperson&language=en")
    .then((res) => res.json())
    .then((decoratorElements) => {
        const { headAssets, header, footer, scripts } = decoratorElements;
        /*
            injiser disse fire elementene i HTML-responsen til applikasjonen din
        */
    });
```

### 2.3 [Ikke anbefalt] Tilpasset implementasjon med client-side rendering (CSR) 👾

> ⚠️ CSR vil føre til layout shifts samt flere asset-forespørsler, noe som kan forsinke First
> Contentful
> Paint (FCP) i applikasjonen din.

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

### 2.4 Ingresser 🎯

Dekoratoren betjenes både gjennom service hosts og vanlige ingresser. Hvis du bruker
`@navikt/nav-dekoratoren-moduler`, håndteres alt dette automatisk, avhengig av `env`-parameteren
din.

| Environment | Service host                                 | Ingress                                        |
| ----------- | -------------------------------------------- | ---------------------------------------------- |
| `prod`      | http://nav-dekoratoren.personbruker          | https://www.nav.no/dekoratoren                 |
| `dev`       | http://nav-dekoratoren.personbruker          | https://dekoratoren.ekstern.dev.nav.no         |
| `beta`      | http://nav-dekoratoren-beta.personbruker     | https://dekoratoren-beta.intern.dev.nav.no     |
| `beta-tms`  | http://nav-dekoratoren-beta-tms.personbruker | https://dekoratoren-beta-tms.intern.dev.nav.no |

**Husk:** Betainstansene av Dekoratøren er ment for intern testing av Team Nav.no eller Team Min
Side. Disse instansene kan være ustabile over lengre perioder.

---

## 3 Konfigurere Dekoratøren etter dine behov 🎛️

Hvis du bruker `@navikt/nav-dekoratoren-moduler`, kan du sende et konfigurasjonsobjekt når du
initialiserer Dekoratøren. Hvis du implementerer din egen løsning og henter Dekoratøren direkte, kan
du konfigurere den ved å sende [query parametre](https://en.wikipedia.org/wiki/Query_string) som
en del av fetch-URL-forespørselen.

Alle parametere kan settes klient-side, med mindre det eksplisitt er nevnt at de kun er for
server-side rendering. For mer informasjon,
se [client-side](https://github.com/navikt/nav-dekoratoren-moduler#readme).

### 3.1 Oversikt over config parametere

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

### 3.2 Detaljer 🍱

<details>
 <summary><strong>Klikk for å utvide detaljene</strong></summary>

#### redirectToApp

Gjelder både for automatisk innlogging og når innloggingsknappen klikkes. Standardinnstillingen er
`false`, som vil omdirigere brukeren til "Mitt Nav"-applikasjonen etter innlogging.

#### redirectToUrl

Omdirigerer nettleseren til den spesifiserte URL-en etter innlogging. Dette vil overstyre
`redirectToApp`-konfigurasjonen som ble satt. Dette gjelder både for automatisk innlogging og når
innloggingsknappen klikkes.

#### redirectToUrlLogout

Gjelder både for automatisk utlogging (etter å ha sett utloggingsvarselet) og når utloggingsknappen
klikkes.

#### language

Språket settes automatisk på klient-side hvis den nåværende URL-en inneholder **/no/**, **/nb/**, \*
\*/nn/** , **/en/**, eller **/se/\*\*. Dette vil overstyre eventuelle språkparametere som er satt.
Vennligst merk at det faktiske brukergrensesnittet til Dekoratøren kun kan vise sitt eget
tekstinnhold og meny på `nb`, `en`, og `se` (delvis støtte). For mer informasjon,
se [Språkstøtte og nedtrekksmeny](#42-language-support-and-dropdown-menu-)

#### availableLanguages

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

#### breadcrumbs

Kan settes klient-side
med [setBreadcrumbs](https://github.com/navikt/nav-dekoratoren-moduler#readme)
og [onBreadcrumbClick](https://github.com/navikt/nav-dekoratoren-moduler#readme)

Merk at `url` er begrenset til domenet `nav.no` og eventuelle underdomener. Enhver annen URL vil
resultere i at Dekoratøren returnerer en 500 serverfeil ved forespørsel.

#### chatbot

Hvis dette er satt til false, vil ikke chatboten bli initialisert. Dette betyr at den aldri vil
være tilgjengelig for siden eller applikasjonen, selv om brukeren har en aktiv chatøkt.

#### chatbotVisible

Viser eller skjuler Chatbot Frida. Hvis dette er satt til `true`, vil det flytende chatbot-ikonet
alltid være synlig. Når det er satt til `false`, vil chatboten bare være synlig hvis brukeren har en
aktiv chatøkt. Vennligst merk at `chatbotVisible` ikke vil ha noen effekt hvis `chatbot`-argumentet
ovenfor er satt til false.

#### logoutUrl

Hvis denne er satt vil Dekoratøren delegere all utloggingshåndtering til den angitte URL-en. Dette
betyr at **alt relatert til utlogging må håndteres av applikasjonen!** Dette inkluderer, men er ikke
begrenset til, fjerning av cookies og ugyldiggjøring av økter. Bruk med forsiktighet!

Skal ikke forveksles med attributtet `redirectToUrlLogout`, som angir den endelige
omdirigeringsadressen **etter** at brukeren er logget ut.

#### logoutWarning

En modal vil vises etter 55 minutter med innloggingstid, som gir brukeren muligheten til å forlenge
økten med ytterligere 60 minutter eller logge ut umiddelbart. Dette tjener både som en
bekvemmelighet for brukeren og for å oppfylle WCAG-tilgjengelighetskrav.

Hvis du velger å deaktivere denne funksjonen, må du selv implementere en lignende
utloggingsadvarsel.

#### redirectOnUserChange

Hvis denne er satt til `true`, vil siden omdirigere til nav.no hvis det er en endring av gjeldende
bruker i headeren og den autentiserte brukeren på serveren. Dette kan skje hvis brukeren har flere
vinduer
åpne og en ny bruker logger inn i ett av dem, og deretter navigerer til et vindu den gamle brukeren
hadde åpent.

</details>

### 3.3 Eksempler

Under er eksempler på forskjellige bruksområder for konfigurasjonsflaggene:

Eksempel 1 - Sett kontekst:<br>

```bash
https://www.nav.no/dekoratoren/?context=arbeidsgiver
```

Eksempel 2 - Språkvelger:<br>

```bash
https://www.nav.no/dekoratoren/?availableLanguages=[{"locale":"nb","url":"https://www.nav.no/person/kontakt-oss"},{"locale":"en","url":"https://www.nav.no/person/kontakt-oss/en/"}]
```

Eksempel 3 - Brødsmuler:<br>

```bash
https://www.nav.no/dekoratoren/?breadcrumbs=[{"url":"https://www.nav.no/person/dittnav","title":"Ditt%20NAV"},{"url":"https://www.nav.no/person/kontakt-oss","title":"Kontakt%20oss"}]
```

---

## 4 Andre innebygde funksjoner 🎛️

Dekoratøren tilbyr en rekke funksjonaliteter slik at du slipper å bygge dem selv. Under er en
oversikt over disse funksjonene og hvordan de fungerer.

### 4.1 Content Security Policy 👮

Du kan finne det nåværende CSP-direktivet
på [https://www.nav.no/dekoratoren/api/csp](https://www.nav.no/dekoratoren/api/csp). Du kan også
inspisere den faktiske koden
på [content-security-policy.ts](https://github.com/navikt/decorator-next/blob/main/packages/server/src/content-security-policy.ts)
for en bedre forståelse av hvordan CSP fungerer.

[`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) pakken tilbyr
også metoder for å generere en CSP-header som er kompatibel med Dekoratøren. Hvis du bygger din egen
tilpassede implementasjon, må du sørge for at dine CSP-headere samsvarer med de til Dekoratøren.

### 4.2 Språkstøtte og nedtrekksmeny 🌎

Brukergrensesnittet (header, meny, footer, osv.) støtter tre språk:

- Norsk bokmål
- English
- Sami (delvis)

Du kan tilby `availableLanguages` for å fylle ut språkvelgeren, avhengig av hvor mange språk
applikasjonen din støtter (se [seksjon for parametere](#31-oversikt-over-config-parametere)).
Imidlertid vil det faktiske brukergrensesnittet i headeren og footeren kun vises på ett av de tre
nevnte språkene.

### 4.3 Søk 🔎

Søk tilbys ut av boksen, uten behov for konfigurasjon fra din side. Søkefunksjonen vil enten peke
til produksjons- eller utviklingsmiljøer, avhengig av hvordan Dekoratøren er satt opp.

### 4.4 Innlogging 🔐

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

### 4.5 Utloggingsvarsel 🔐

En utloggingsvarsel vises for brukeren 5 minutter før innloggingstokenet utløper. Brukeren kan da
velge å forlenge økten med ytterligere 60 minutter eller klikke "Logg ut" for å logge ut
umiddelbart.

Brukernes totale sesjon har en maksimal levetid på 6 timer, hvoretter brukeren må logge ut og logge
inn igjen.

Utloggingsvarselet er aktivert som standard. Du kan deaktivere denne funksjonen ved å sette
`logoutWarning=false`som en parameter. Imidlertid krever retningslinjer for tilgjengelighet og WCAG
at du bygger din egen
mekanisme for å la brukere utsette utlogging.

### 4.6 Regler for tokens 🔐

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

### 4.7 Analytics 📊

Nav uses Umami for analytics and tracking user events. Prefered method is using
nav-dekoratoren-moduler, see below.

Nav bruker Umami for analyse og sporing av brukerehendelser. Foretrukket metode er å bruke
[nav-dekoratoren-moduler](#471-analytics-using-nav-dekoratoren-moduler), se nedenfor.

Fra juni 2025 logges data til Umami. Amplitude er planlagt å bli avviklet for Nav innen november

2025. Se mer informasjon i toppen av denne readme-filen.

#### 4.7.1 Analytics nå du bruker nav-dekoratoren-moduler 📦

[`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) pakken tilbyr
hjelpefunksjoner for enkel Analytics-logging. Vennligst se README for dokumentasjon og guider for å
komme i gang. https://github.com/navikt/nav-dekoratoren-moduler#getanalyticsinstance

#### 4.7.2 Analytics og samtykke 👍👎

Hvis brukeren ikke har gitt samtykke til sporing og analyse, vil Amplitude og Umami ikke
initialisere. I stedet vil en mock-funksjon bli returnert. Mock-funksjonen vil ta imot all
logging og forkaste den før den sendes fra brukeren, derfor trenger ikke teamet å håndtere mangel på
samtykke spesielt med mindre de har spesifikke behov.

### 4.8 Undersøkelser ved bruk av Task Analytics og Skyra 📋

Task Analytics og Skyra brukes for å gjennomføre undersøkelser på nav.no. Dekoratøren vil laste de
nødvendige skriptene for begge tjenestene, men kun hvis brukeren har gitt samtykke til
undersøkelser. Task Analytics-undersøkelser settes opp i et eget repository. Vennligst
se [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config) eller kontakt Team
Nav.no for mer informasjon.

For Skyra styres alle undersøkelser i dashbordet ditt. Du kan finne
[mer informasjon om Skyra her](https://www.skyra.no/no). Undersøkelsene dine skal vises
automatisk når de er riktig konfigurert i Skyra-dashbordet ditt.

### 4.9 Skip-lenke til hovedinnhold 🔗

En skip-lenke rendres i headeren hvis et element med id `maincontent` eksisterer i dokumentet. Ved å
klikke på skip-lenken vil fokus settes til maincontent-elementet. Elementet må være fokuserbart,
noe som kan oppnås ved å sette attributtet `tabindex="-1"`.

Eksempel:

```html
<main id="maincontent" tabindex="-1"><!-- app html går her! --></main>
```

### 4.10 Samtykkebanner 👌

Brukere vil bli presentert for et samtykkebanner som ber om samtykke til sporing og analyse. Dette
påvirker alle typer lagring (cookies, localStorage, sessionStorage) på brukerens enhet. Hvis
brukeren ikke samtykker, er kun nødvendig ("strengt nødvendig") lagring tillatt. Dette betyr at
Umami, Skyra osv ikke vil starte.

[`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) pakken tilbyr
hjelpefunksjoner for enkel håndtering av samtykke. Den tilbyr også hjelpefunksjoner for å sette og
lese cookies, som sikrer at kun tillatte cookies kan settes.
