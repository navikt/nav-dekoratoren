# Decorator
This is a frontend service that provices a common header and footer to apps on nav.no. All frontend applications that target the public (both logged in and open pages) should use Decorator to create a cohesive user experience on nav.no.

The Decorator also offers common functionality such as analytics, logout warning, search functionality, login, etc as explained in this documentation.

If you have any questions or believe that info is missing in the documentation, please contact us on the Slack channel `#dekoratøren_på_navno`! If you wish to contribute or just want to spin up the Decorator locally, see CONTRIBUTING.md for documentation on how the Decorator works under the hood.

## How to use the Decorator in your application
You can use the Decorator both via SSR (server-side rendering) and CSR (client-side rendering). We recommend implementing the Decorator via SSR because it provides fewer [layout shifts](https://web.dev/articles/cls) when your application loads - thus providing a better user experience.

### @navikt/nav-dekoratoren-moduler
We recommend using the NPM package @navikt/nav-dekoratoren-moduler which exposes several useful methods for easy implementation of both the decorator and other features.

### Ingresses
The Decorator is served via both service host and regular ingresses.  If youre using `@navikt/nav-dekoratoren-moduler`, this is all done automagically, depending on your `env` parameter.

| Environment | Service host | Ingress |
| --- | ---- | --- |
| `prod`  | http://nav-dekoratoren.personbruker | https://www.nav.no/dekoratoren |
| `dev`  | http://nav-dekoratoren.personbruker | https://dekoratoren.ekstern.dev.nav.no |
| `beta`  | http://nav-dekoratoren-beta.personbruker | https://dekoratoren-beta.intern.dev.nav.no |
| `beta-tms`  | http://nav-dekoratoren-beta-tms.personbruker | https://dekoratoren-beta-tms.intern.dev.nav.no |

_Note:_ The beta instances of the Decorator are intended for internal testing in Team Personbruker. These may be unstable for longer periods.

### Custom implementation
The Decorator consists of 4 elements that you need to extract from the document and inject into your application:

| Element     | id                |
| ----------- | ----------------- |
| Header HTML | `header-withmenu` |
| Footer HTML | `footer-withmenu` |
| Scropts     | `scripts`         |
| CSS         | `styles`          |

Example of what a custom implementation might look like where you fetch the document and inject the elemnents serverside into your application:
```
fetch("{INGRESS_URL}/?{PARAMETERS}")
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');

      const styles = document.getElementById("styles")?.innerHTML;
      const scripts = document.getElementById("scripts")?.innerHTML;
      const header = document.getElementById("header-withmenu")?.innerHTML;
      const footer = document.getElementById("footer-withmenu")?.innerHTML;

      /*
      ...now, inject these four elements into your application,
      either manually or via an template engine.
      */
  });
```

### Custom implementation via client-side rendring (CSR). Not recommended:
CSR will cause layut shifts as well as multiple asset requests that might delay first contenful paint (FCP) in your application.

```
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



## Built-in functionality
The Decorator provides a range of functionality so that you don't have to build these yourself.

### Language support and dropdown menu
The user interface (header, menu, footer etc) supports three languages (or rather "målform"):
- norsk bokmål
- english
- sami (partial)

You can provide `availableLanguages` in order to populate the language selector (språkvelger) depending on how many languages your application is available in (see section for parameters), but the actual UI in the header and footer will only be shown in one of the 3 languages mentioned above.

### Search
Search is provided out of the box, with no config needed on your part. Search will either point to prod or dev, depending on the environment that Decorator i set up with.

### Login
The Decorator provides a login (and logout) button that redirects the user to ID-porten (either prod or dev) where the user can log in.

The Decorator uses internal API endpoints in order to be able to display the users name, login level and remaining time.

Please note that there is no login API exposed from the Decorator and into your application, which means that no user credentials are exposed to your application on any meaningful or usable way. If you need to check authentication or credentials for the user, you will need to set this up yourself directly to the services at login.nav.no. Please see information on [Authentication and Authorization at NAIS](https://docs.nais.io/auth/).

### Logout warning
The Decorator handles logout warning for you. When the user is close to being logged out (5 minutes beforehand), a modal shows. The user can then choose to extend by another 55 minutes, or click "log out" in order to be logged out immediately.

Logout warning is activated by default. You can choose to disable this feature by sending `logoutWarning: false` as a parameter. Accessibility Guidelines and WCAG requires that you build your own mechanism for allowing users to postpone logout.

Logout rules and limits:
- Tokens are valid for 60 minutes before having to be refreshed.
- After 55 minutes (5 minutes before token invalidation), the user is presented with options for either continuing to be logged in or to immediately log out.
- These renewals are extended by 60 more minutes - a total of 5 times.
- When the user has been logged in for a total of 6 hours, the user is forced to log in again.
- For now, the user is presented with the logout warning regardless of activity. We are looking into auto-renewal based on user activity (ie. mouse movement, keyboard strokes, page changes etc). Security and user privacy has to be taken into account before we continue forward.

### Analytics with Amplitude
NAV uses Amplitude for analytics and tracking user events. In order to properly safeguard privacy, all analytics have to go through [amplitude-proxy](https://github.com/navikt/amplitude-proxy) which will clean out trackable person information before actually sending the data to Amplitude. The Decorator does all this for you.

#### Amplitude when using nav-dekoratoren-moduler
[@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler) provides helper functions for easy Amplitude logging. Please see the readme for docs and getting started guides.

#### Amplitude for custom implementations
The Amplitude client is exposed on `window.dekoratorenAmplitude`. Please see [logEventFromApp](https://github.com/navikt/decorator-next/blob/332e92fca6e6aa7f0de36a62a87232533d6c9d45/packages/client/src/analytics/amplitude.ts#L101) for code. <br>

### Surveys with Task Analytics
Surveys are set up in a separate repo. Please see [nav-dekoratoren-config](https://github.com/navikt/nav-dekoratoren-config) or contact Team Personbruker for more information.