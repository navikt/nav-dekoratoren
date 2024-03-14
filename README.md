# Dekoratøren / decorator-next
Applikasjon for header og footer på nav.no.

decorator-next er en full omskrivning av [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren), med mål om bedre performance og betydelig mindre client-side javascript.

Denne versjonen av dekoratøren er nå i bruk i alle dev-miljøer. Gi oss gjerne beskjed på slack i `#dekoratøren_på_navno` dersom du opplever problemer eller har andre innspill.

I produksjon benyttes fremdeles den gamle [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren).

## Bruk av dekoratøren

Oppdatert doc kommer! Decorator-next skal være bakoverkompatibel med alle tjenester som beskrevet i README for [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren) og [@navikt/nav-dekoratoren-moduler](https://github.com/navikt/nav-dekoratoren-moduler#readme).

### Ingresser

**Dev (stable)**

-   http://nav-dekoratoren.personbruker (service host)
-   https://dekoratoren.ekstern.dev.nav.no (tilgjengelig fra åpent internett)

**Dev (beta)**

Team nav.no:

-   http://nav-dekoratoren-beta.personbruker (service host)
-   https://dekoratoren-beta.intern.dev.nav.no

Team min side:

-   http://nav-dekoratoren-beta-tms.personbruker (service host)
-   https://dekoratoren-beta-tms.intern.dev.nav.no

_Merk:_ Beta-instansene av dekoratøren er ment for intern testing i team personbruker. Disse kan være ustabile i lengre perioder.

**Dev (sandbox)**

- https://decorator-next.ekstern.dev.nav.no

Denne er kun for testing av dekoratøren isolert, og skal ikke konsumeres av andre apper.
