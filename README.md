# Nav Dekoratøren

## Innholdsfortegnelse

- [Om dekoratøren ℹ️](#about-the-decorator)
- [How to use the Decorator in your application 🎓](#how-to-use-the-decorator-in-your-application)
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

The Decorator is served through both service hosts and regular ingresses. If you're using
`@navikt/nav-dekoratoren-moduler`, this is all handled automatically, depending on your `env`
parameter.

Dekoratoren betjenes både gjennom service hosts og vanlige ingresser. Hvis du bruker
`@navikt/nav-dekoratoren-moduler`, håndteres alt dette automatisk, avhengig av `env`-parameteren
din.

| Environment | Service host                                 | Ingress                                        |
| ----------- | -------------------------------------------- | ---------------------------------------------- |
| `prod`      | http://nav-dekoratoren.personbruker          | https://www.nav.no/dekoratoren                 |
| `dev`       | http://nav-dekoratoren.personbruker          | https://dekoratoren.ekstern.dev.nav.no         |
| `beta`      | http://nav-dekoratoren-beta.personbruker     | https://dekoratoren-beta.intern.dev.nav.no     |
| `beta-tms`  | http://nav-dekoratoren-beta-tms.personbruker | https://dekoratoren-beta-tms.intern.dev.nav.no |

**Husk:** Beta instansene av Dekoratøren er ment for intern testing av Team Nav.no eller Team Min
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

### 3.1 Config parameters overview

| Configuration        | Type                                                                    | Default      | Explanation                                                                |
| -------------------- | ----------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------- |
| context              | privatperson / arbeidsgiver / samarbeidspartner                         | privatperson | Set the menu and the context selector in the header                        |
| simple               | boolean                                                                 | false        | Shows a simplified header and footer                                       |
| simpleHeader         | boolean                                                                 | false        | Shows a simplified header                                                  |
| simpleFooter         | boolean                                                                 | false        | Shows a simplified footer                                                  |
| redirectToApp        | boolean                                                                 | false        | Directs the user back to current URL after login                           |
| redirectToUrl        | string                                                                  | undefined    | Directs the user to the url after login                                    |
| redirectToUrlLogout  | string                                                                  | undefined    | Directs the user to the url after logout                                   |
| language             | nb / nn / en / se / pl / uk / ru                                        | nb           | Sets the current language                                                  |
| availableLanguages   | [{ locale: nb / nn / en / se / pl, url: string, handleInApp?: string }] | [ ]          | Sets the available languages that are selectable via the language selector |
| breadcrumbs          | [{ title: string, url: string, handleInApp?: string }]                  | [ ]          | Sets the bread crumbs                                                      |
| utilsBackground      | white / gray / transparent                                              | transparent  | Sets the background color for the breadcrumbs and language selector        |
| feedback             | boolean                                                                 | false        | Show or hide the feedback component                                        |
| chatbot              | boolean                                                                 | true         | Activate or deactivate the chatbot (Frida)                                 |
| chatbotVisible       | boolean                                                                 | false        | Show or hide the chatbot (Frida )                                          |
| shareScreen          | boolean                                                                 | true         | Activate or deactivate the screen sharing feature in the footer            |
| logoutUrl            | string                                                                  | undefined    | Sets the URL for logging out                                               |
| logoutWarning        | boolean                                                                 | true         | Activate or deactivate the Logout Warning                                  |
| redirectOnUserChange | boolean                                                                 | false        | Redirects to nav.no if different user is logged in                         |
| pageType             | string                                                                  | undefined    | For lgging av sidetype for sidevsning i Analytics                          |

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
\*/nn/**
, **/en/**, eller **/se/\*\*. Dette vil overstyre eventuelle språkparametere som er satt. Vennligst
merk at det
faktiske brukergrensesnittet til Dekoratøren kun kan vise sitt eget tekstinnhold og meny på `nb`,
`en`, og
`se` (delvis støtte). For mer informasjon,
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
alltid
være synlig. Når det er satt til `false`, vil chatboten bare være synlig hvis brukeren har en aktiv
chatøkt.
Vennligst merk at `chatbotVisible` ikke vil ha noen effekt hvis `chatbot`-argumentet ovenfor er satt
til false.

#### logoutUrl

If set, the Decorator will delegate all logout handling to the specified URL. This means that \*
\*everything related to logout must be handled by the app!\*\* This includes, but is not limited to,
cookie clearing and session invalidation. Use with care!

Hvis denne er satt vil Dekoratøren delegere all utloggingshåndtering til den angitte URL-en. Dette betyr at
**alt relatert til utlogging må håndteres av applikasjonen!** Dette inkluderer, men er ikke
begrenset til, fjerning av cookies og ugyldiggjøring av økter. Bruk med forsiktighet!

Not to be confused with the `redirectToUrlLogout` attribute, which sets the final redirect URL \*
\*after\*\* the user has been successfully logged out.

#### logoutWarning

A modal will display after 55 minutes of login time, allowing the user to extend the session by
another 60 minutes or to log out immediately. This serves both as a convenience for the user and to
meet WCAG accessibility requirements.

If you choose to disable this feature, you will need to implement a similar logout warning yourself.

#### redirectOnUserChange

If set to true, the page will redirect to nav.no if there is a change of current user in header and
authenticated user on server. May occur if user has multiple windows open, and a new user logs in in
one of them, and then navigates to a window the old user had open.

</details>

### 3.3 Examples

Below are examples on different uses of the configuration flags:

Example 1 - Set context:<br>

```bash
https://www.nav.no/dekoratoren/?context=arbeidsgiver
```

Example 2 - Language selector:<br>

```bash
https://www.nav.no/dekoratoren/?availableLanguages=[{"locale":"nb","url":"https://www.nav.no/person/kontakt-oss"},{"locale":"en","url":"https://www.nav.no/person/kontakt-oss/en/"}]
```

Example 3 - Bread crumbs:<br>

```bash
https://www.nav.no/dekoratoren/?breadcrumbs=[{"url":"https://www.nav.no/person/dittnav","title":"Ditt%20NAV"},{"url":"https://www.nav.no/person/kontakt-oss","title":"Kontakt%20oss"}]
```

---

## 4 Other built-in features 🎛️

The Decorator provides a range of functionalities so that you don't have to build them yourself.

### 4.1 Content Security Policy 👮

You can find the current CSP directives
at [https://www.nav.no/dekoratoren/api/csp](https://www.nav.no/dekoratoren/api/csp). You may also
inspect the actual code
at [content-security-policy.ts](https://github.com/navikt/decorator-next/blob/main/packages/server/src/content-security-policy.ts)
for a better understanding of how CSP works.

The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package
also offers methods for generating a CSP header that is compatible with the Decorator. If you're
building your own custom implementation, you must ensure that your CSP headers match those of the
Decorator.

### 4.2 Language support and dropdown menu 🌎

The user interface (header, menu, footer, etc.) supports three languages:

- Norsk bokmål
- English
- Sami (partial)

You can provide `availableLanguages` to populate the language selector (`språkvelger`), depending on
how many languages your application supports (see the section for parameters). However, the actual
UI in the header and footer will only be displayed in one of the three languages mentioned above.

### 4.3 Search 🔎

Search is provided out of the box, with no configuration needed on your part. The search will either
point to production or development environments, depending on how the Decorator is set up.

### 4.4 Login 🔐

The Decorator provides a login (and logout) button that redirects the user to ID-porten (either
production or development) where the user can log in.

The Decorator uses internal API endpoints to display the user's name, login level, and remaining
session time.

Please note that there is no login API exposed from the Decorator to your application, which means
that no user credentials are exposed to your application in any meaningful or usable way. If you
need to check authentication or credentials for the user, you will need to set this up yourself by
connecting directly to the services at login.nav.no. For more information,
see [Authentication and Authorization at NAIS](https://docs.nais.io/auth/).

### 4.5 Logout warning 🔐

A logout warning is a modal that appears for the user 5 minutes before the login token expires. The
user can then choose to extend the session by another 60 minutes or click "Log out" to be logged out
immediately.

The users entire session har a max life of 6 hours, after which the user has to log out and log in
again.

The logoout warning is activated by default. You can disable this feature by setting
`logoutWarning=false` as a parameter. However, Accessibility Guidelines and WCAG require that you
build your own mechanism to allow users to postpone logout.

### 4.6 Rules for tokens: 🔐

You can find out more about tokens in the [NAIS documentation](https://docs.nais.io/auth/). Below is
a summary, explaining how the logout warning behaves:

- Tokens are valid for 60 minutes if not refreshed.
- Session is valid for 6 hours and cannot be refreshed, ie the user has to log out and then back in.
- 5 minutes before token is set to expire, the user is presented with options to either continue
  being logged in or log out immediately.
- These renewals extend the session by an additional 60 minutes.
- After another 55 minutes, the user will be presented with the logout warning again.
- After a total of 6 hours (session expiration) of being logged in, the user is required to log in
  again.
- Currently, the user is presented with the logout warning regardless of activity.

### 4.7 Analytics 📊

Nav uses Umami for analytics and tracking user events. Prefered method is using
nav-dekoratoren-moduler, see below.

As of June 2025, data is being logged to Umami. Amplitude is planned to be discontinued for Nav by
November 2025.

#### 4.7.1 Analytics using nav-dekoratoren-moduler

The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package
provides helper functions for easy Analytics logging. Please refer to the README for documentation
and getting started guides.
https://github.com/navikt/nav-dekoratoren-moduler#getanalyticsinstance

#### 4.7.2 Analytics and consent 👍👎

If the user has not given consent to tracking and analytics, Amplitude and Umami will not initiate.
Instead a mock function will be returned. The mock function will take any logging and discard it
before it's sent from the user, therefore the team doesn't have to handle any lack of consent
especially unless they have spesific needs.

### 4.8 Surveys using Task Analytics and Skyra 📋

Task Analytics and Skyra are used to conduct surveys on nav.no. Dekoratøren will load the required
scripts for both services, but only if the user has given consent to surveys. Task Analytics surveys
are set up in a separate repository. Please
see [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config) or contact Team
Nav.no for more information.

For Skyra, all surveys are controlled in your dashboard. You can
find [more information about Skyra here](https://www.skyra.no/no). Your surveys should display
automatically when properly configured in your Skyra dashboard.

### 4.9 Skip-link to main content 🔗

A skip-link is rendered in the header if an element with the id `maincontent` exists in the
document. Clicking the skip-link will set focus to the maincontent element. The element must be
focusable, which can be accomplished by setting the attribute `tabindex="-1"`.

Example:

```html
<main id="maincontent" tabindex="-1"><!-- app html goes here! --></main>
```

### 4.10 Consent banner 👌

Users will be presented with a consent banner asking for consent for tracking and analytics. This
affects all types of storage (cookies, localStorage, sessionStorage) on the users device. If the
user does not consent, only required ("strictly neccessary") storage is allowed. This means that
Umami, Skyra etc will not start.

The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package
provides helper functions for checking for current user consent. It also provides helper functions
for setting and reading cookies, which ensures that only allowed cookies can be set.
