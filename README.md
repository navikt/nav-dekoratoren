# Nav Decorator

## Table of Contents

- [Nav Decorator](#nav-decorator)
  - [Table of Contents](#table-of-contents)
  - [About the Decorator](#about-the-decorator)
    - [Suggestions, feedback or participation](#suggestions-feedback-or-participation)
    - [Channel for announcements](#channel-for-announcements)
  - [How to use the Decorator in your application](#how-to-use-the-decorator-in-your-application)
    - [@navikt/nav-dekoratoren-moduler](#naviktnav-dekoratoren-moduler)
    - [Custom implementation with server-side rendering](#custom-implementation-with-server-side-rendering)
    - [\[Not recommended\] Custom implementation with client-side rendering (CSR)](#not-recommended-custom-implementation-with-client-side-rendering-csr)
    - [Ingresses](#ingresses)
  - [Configuring the Decorator to your needs](#configuring-the-decorator-to-your-needs)
    - [Overview](#overview)
    - [Details](#details)
      - [➡ redirectToApp](#-redirecttoapp)
      - [redirectToUrl](#redirecttourl)
      - [redirectToUrlLogout](#redirecttourllogout)
      - [🌎 language](#-language)
      - [🇳🇴🇬🇧 availableLanguages](#-availablelanguages)
      - [🍞 breadcrumbs](#-breadcrumbs)
      - [🤖 chatbot](#-chatbot)
      - [🤖 chatbotVisible](#-chatbotvisible)
      - [👻 logoutUrl](#-logouturl)
      - [🎭 maskHotjar](#-maskhotjar)
      - [🔓⚠️ logoutWarning](#️-logoutwarning)
      - [redirectOnUserChange](#redirectonuserchange)
    - [Examples](#examples)
  - [Other built-in features](#other-built-in-features)
    - [Content Security Policy](#content-security-policy)
    - [Language support and dropdown menu](#language-support-and-dropdown-menu)
    - [Search](#search)
    - [Login](#login)
    - [Logout warning](#logout-warning)
    - [Logout Rules and Limits:](#logout-rules-and-limits)
    - [Analytics with Amplitude](#analytics-with-amplitude)
      - [Migration to Umami](#migration-to-umami)
      - [Amplitude and consent](#amplitude-and-consent)
      - [Amplitude when using nav-dekoratoren-moduler](#amplitude-when-using-nav-dekoratoren-moduler)
      - [Surveys with Task Analytics](#surveys-with-task-analytics)
    - [Skip-link to main content](#skip-link-to-main-content)
    - [Consent banner](#consent-banner)


## About the Decorator
This is a frontend application that provides a unified header/footer for applications running on nav.no. All frontend applications that target the public should use the Decorator to create a cohesive user experience on nav.no.

The Decorator also offers common functionality such as login, analytics, logout warning, search functionality, etc as explained in this documentation.

### Suggestions, feedback or participation
If you have any questions or suggestions for improvements regarding the Decorator or this documentation, please contact us on the Slack channel `#dekoratøren_på_navno`. If you wish to contribute or simply want to run the Decorator locally, refer to CONTRIBUTING.md for detailed documentation on how the Decorator works under the hood.

### Channel for announcements
Important announcements are posted on `#dekoratøren_på_navno`, so we encourage teams that use the Decorator to join this channel.

## How to use the Decorator in your application
You can use the Decorator through both SSR (server-side rendering) and CSR (client-side rendering). We recommend implementing the Decorator via SSR because it results in fewer [layout shifts](https://web.dev/articles/cls) when your application loads, thereby providing a better user experience.

### @navikt/nav-dekoratoren-moduler
We recommend using the NPM package [@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler), which offers several useful functions for implementating the Decorator and related features.

### Custom implementation with server-side rendering
The Decorator consists of four HTML strings which must be injected into the HTML of your application. These are served from the `/ssr` endpoint of the Decorator:

```json
{
    "headAssets": "CSS, favicons, etc. Should be injected into the <head> element",
    "header": "Header content, should be injected just before your app content",
    "footer": "Footer content, should be injected just after your app content",
    "scripts": "<script> elements, can be injected anywhere"
}
```

Example:
```javascript
fetch("https://www.nav.no/dekoratoren/ssr?context=privatperson&language=en")
    .then(res => res.json())
    .then(decoratorElements => {
        const { headAssets, header, footer, scripts } = decoratorElements;
        /*
            inject these four elements into your applications HTML response
        */
  });
```

### [Not recommended] Custom implementation with client-side rendering (CSR)
CSR can cause layout shifts as well as multiple asset requests, which might delay the First Contentful Paint (FCP) in your application.

```html
<html>
  <head>
      <link href="{INGRESS_URL}/css/client.css" rel="stylesheet" />
  </head>
  <body>
    <div id="decorator-header"></div>
    {
      YOUR_APP
    }
    <div id="decorator-footer"></div>
    <div id="decorator-env" data-src="{INGRESS_URL}/env?{PARAMETERS}"></div>
    <script async="true" src="{INGRESS_URL}/client.js"></script>
  </body>
</html>
```

### Ingresses
The Decorator is served through both service hosts and regular ingresses. If you're using `@navikt/nav-dekoratoren-moduler`, this is all handled automatically, depending on your `env` parameter.

| Environment | Service host | Ingress |
| ----------- | ------------ | ------- |
| `prod`  | http://nav-dekoratoren.personbruker | https://www.nav.no/dekoratoren |
| `dev`  | http://nav-dekoratoren.personbruker | https://dekoratoren.ekstern.dev.nav.no |
| `beta`  | http://nav-dekoratoren-beta.personbruker | https://dekoratoren-beta.intern.dev.nav.no |
| `beta-tms`  | http://nav-dekoratoren-beta-tms.personbruker | https://dekoratoren-beta-tms.intern.dev.nav.no |

**Note:** The beta instances of the Decorator are intended for internal testing by Team Personbruker. These instances may be unstable for extended periods.

## Configuring the Decorator to your needs

You can configure the Decorator to suit your needs. If you're using `@navikt/nav-dekoratoren-moduler`, you can pass a configuration object when initializing the Decorator. If you're implementing your own solution and fetching the Decorator directly, you can configure it by passing [query parameters](https://en.wikipedia.org/wiki/Query_string) as part of the fetch url request.

All parameters can be set client-side unless explicitly mentioned as a server-render feature only. For more details, see [client-side](https://github.com/navikt/nav-dekoratoren-moduler#readme).

### Overview
| Configuration       | Type                                                   | Default          | Explanation                                                                     |
| ------------------- | ------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------ |
| context             | privatperson / arbeidsgiver / samarbeidspartner        | privatperson     | Set the menu and the context selector in the header                            |
| simple              | boolean                                                | false            | Shows a simplified header and footer                                           |
| simpleHeader        | boolean                                                | false            | Shows a simplified header                                                      |
| simpleFooter        | boolean                                                | false            | Shows a simplified footer                                                      |
| redirectToApp       | boolean                                                | false            | Directs the user back to current URL after login                               |
| redirectToUrl       | string                                                 | undefined        | Directs the user to the url after login                                        |
| redirectToUrlLogout | string                                                 | undefined        | Directs the user to the url after logout                                       |
| language            | nb / nn / en / se / pl / uk / ru                       | nb               | Sets the current language                                                      |
| availableLanguages  | [{ locale: nb / nn / en / se / pl, url: string, handleInApp?: string }]   | [ ]              | Sets the available languages that are selectable via the language selector     |
| breadcrumbs         | [{ title: string, url: string, handleInApp?: string }] | [ ]              | Sets the bread crumbs                                                          |
| utilsBackground     | white / gray / transparent                             | transparent      | Sets the background color for the breadcrumbs and language selector            |
| feedback            | boolean                                                | false            | Show or hide the feedback component                                            |
| chatbot             | boolean                                                | true             | Activate or deactivate the chatbot (Frida)                                     |
| chatbotVisible      | boolean                                                | false            | Show or hide the chatbot (Frida     )                                          |
| shareScreen         | boolean                                                | true             | Activate or deactivate the screen sharing feature in the footer                |
| logoutUrl           | string                                                 | undefined        | Sets the URL for logging out                                                   |
| maskHotjar          | boolean                                                | true             | Mask the entire HTML DOM for HotJar                                            |
| logoutWarning       | boolean                                                | true             | Activate or deactivate the Logout Warning                                      |
| redirectOnUserChange| boolean                                                | false            | Redirects to nav.no if different user is logged in                             |
| pageType            | string                                                 | undefined        | For lgging av sidetype for sidevsning i Analytics                              |

### Details
<details>
 <summary><strong>Click to expand details</strong></summary>


#### ➡ redirectToApp
This applies to both automatic login and when the login button is clicked. The default setting is `false`, which will redirect the user to the "Mitt Nav" application after login.

#### redirectToUrl
This will redirect the browser to the specified URL after login. This will override the `redirectToApp` configuration that was set. This applies to both automatic login and when the login button is clicked.

#### redirectToUrlLogout
Applies both to both automatic logout (after seeing the logout warning) and when clicking the logout button.

#### 🌎 language
The language is automatically set client-side if the current URL contains **/no/**, **/nb/**, **/nn/**, **/en/**, or **/se/**. This will override any language parameter that is set. Please note that the actual UI of the Decorator can only display its own textual content and menu in `nb`, `en`, and `se` (partial support). For more information, see "Language support and dropdown menu."

#### 🇳🇴🇬🇧 availableLanguages
If your application supports multiple locales, you can populate the built-in language selector in the Decorator, allowing users to switch languages. This list can also be updated client-side, for example, if certain routes in your application support specific languages while others do not.

Use [`setAvailableLanguages`](https://github.com/navikt/nav-dekoratoren-moduler#readme) and [`onLanguageSelect`](https://github.com/navikt/nav-dekoratoren-moduler#readme).

If you set `handleInApp` to `true`, you must handle actions like route changes yourself.

Note that `url` is limited to the domain `nav.no` and any sub domain. Any other URL will result in the Decorator returning a 500 server error on request.

#### 🍞 breadcrumbs
Can be set client-side with [setBreadcrumbs](https://github.com/navikt/nav-dekoratoren-moduler#readme) and [onBreadcrumbClick](https://github.com/navikt/nav-dekoratoren-moduler#readme)

Note that `url` is limited to the domain `nav.no` and any sub domain. Any other url will result in the Decorator returning 500 server error on request.

#### 🤖 chatbot
If this is set to false, the chatbot will not be initialized. This means that it will never be available to the page or application, even if the user has an active chat session.

#### 🤖 chatbotVisible
Shows or hides Chatbot Frida. If this is set to `true`, the floating chatbot icon will always be visible. When set to `false`, the chatbot will only be visible if the user has an active chat session. Please note that `chatbotVisible` will have no effect if the `chatbot` argument above is set to false.

#### 👻 logoutUrl
If set, the Decorator will delegate all logout handling to the specified URL. This means that **everything related to logout must be handled by the app!** This includes, but is not limited to, cookie clearing and session invalidation. Use with care!

Not to be confused with the `redirectToUrlLogout` attribute, which sets the final redirect URL **after** the user has been successfully logged out.

#### 🎭 maskHotjar
Sets the `data-hj-suppress` attribute on the HTML element, which prevents Hotjar from capturing any actual content on the page. The default is `true`. If this is set to `false`, you must ensure that elements containing personal information or other sensitive data are masked similarly. This is crucial for complying with privacy regulations. See the [Hotjar documentation](https://help.hotjar.com/hc/en-us/articles/115012439167-How-to-Suppress-Text-Images-and-User-Input-from-Collected-Data) for more details.

The Decorator’s own elements that contain personal information are masked regardless of this parameter. This cannot be changed client-side.

#### 🔓⚠️ logoutWarning
A modal will display after 55 minutes of login time, allowing the user to extend the session by another 60 minutes or to log out immediately. This serves both as a convenience for the user and to meet WCAG accessibility requirements.

If you choose to disable this feature, you will need to implement a similar logout warning yourself.

#### redirectOnUserChange
If set to true, the page will redirect to nav.no if there is a change of current user in header and authenticated user on server. May occur if user has multiple windows open, and a new user logs in in one of them, and then navigates to a window the old user had open.
</details>

### Examples
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

## Other built-in features
The Decorator provides a range of functionalities so that you don't have to build them yourself.

### Content Security Policy

You can find the current CSP directives at [https://www.nav.no/dekoratoren/api/csp](https://www.nav.no/dekoratoren/api/csp). You may also inspect the actual code at [content-security-policy.ts](https://github.com/navikt/decorator-next/blob/main/packages/server/src/content-security-policy.ts) for a better understanding of how CSP works.

The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package also offers methods for generating a CSP header that is compatible with the Decorator. If you're building your own custom implementation, you must ensure that your CSP headers match those of the Decorator.

### Language support and dropdown menu
The user interface (header, menu, footer, etc.) supports three languages:
- Norsk bokmål
- English
- Sami (partial)

You can provide `availableLanguages` to populate the language selector (`språkvelger`), depending on how many languages your application supports (see the section for parameters). However, the actual UI in the header and footer will only be displayed in one of the three languages mentioned above.

### Search
Search is provided out of the box, with no configuration needed on your part. The search will either point to production or development environments, depending on how the Decorator is set up.

### Login
The Decorator provides a login (and logout) button that redirects the user to ID-porten (either production or development) where the user can log in.

The Decorator uses internal API endpoints to display the user's name, login level, and remaining session time.

Please note that there is no login API exposed from the Decorator to your application, which means that no user credentials are exposed to your application in any meaningful or usable way. If you need to check authentication or credentials for the user, you will need to set this up yourself by connecting directly to the services at login.nav.no. For more information, see [Authentication and Authorization at NAIS](https://docs.nais.io/auth/).

### Logout warning
A logout warning is a modal that appears for the user 5 minutes before the login token expires. The user can then choose to extend the session by another 60 minutes or click "Log out" to be logged out immediately.

The users entire session har a max life of 6 hours, after which the user has to log out and log in again.

The logoout warning is activated by default. You can disable this feature by setting `logoutWarning=false` as a parameter. However, Accessibility Guidelines and WCAG require that you build your own mechanism to allow users to postpone logout.

### Logout Rules and Limits:
- Tokens are valid for 60 minutes before needing to be refreshed.
- After 55 minutes (5 minutes before token expiration), the user is presented with options to either continue being logged in or log out immediately.
- These renewals extend the session by an additional 60 minutes, up to a total of 5 times.
- After a total of 6 hours of being logged in, the user is required to log in again.
- Currently, the user is presented with the logout warning regardless of activity. We are exploring auto-renewal based on user activity (e.g., mouse movement, keyboard strokes, page changes, etc.). Security and user privacy considerations must be taken into account before proceeding further.

### Analytics with Amplitude
Nav uses Amplitude for analytics and tracking user events. To properly safeguard privacy, all analytics data must go through [amplitude-proxy](https://github.com/navikt/amplitude-proxy), which cleans out trackable personal information before sending the data to Amplitude. The Decorator handles this process for you.

#### Migration to Umami
There are work in progress for migrating to Umami. Amplitude will be discontinued for Nav by December 31st 2025.

#### Amplitude and consent
If the user has not given consent to tracking and analytics, Amplitude will not initiate. Instead a mock function will be returned. Using this function as a logger will therefore not result in a log error (ie. in Sentry) but instead silently discard the log event.

#### Amplitude when using nav-dekoratoren-moduler
The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package provides helper functions for easy Amplitude logging. Please refer to the README for documentation and getting started guides.

#### Surveys with Task Analytics
Surveys are set up in a separate repository. Please see [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config) or contact Team Personbruker for more information. Note that Task Analytics will not start if user has not given consent.

### Skip-link to main content
A skip-link is rendered in the header if an element with the id `maincontent` exists in the document. Clicking the skip-link will set focus to the maincontent element. The element must be focusable, which can be accomplished by setting the attribute `tabindex="-1"`.

Example:
```html
<main id="maincontent" tabindex="-1"><!-- app html goes here! --></main>
```

### Consent banner
Users will be presented with a consent banner asking for consent for tracking and analytics. This affects all types of storage (cookies, localStorage, sessionStorage) on the users device. If the user does not consent, only required ("strictly neccessary") storage is allowed. This means that Amplitude, Hotjar, Task Analytics etc will not start.

The [`@navikt/nav-dekoratoren-moduler`](https://github.com/navikt/nav-dekoratoren-moduler) package provides helper functions for checking for current user consent. It also provides helper functions for setting and reading cookies, which ensures that only allowed cookies can be set.
