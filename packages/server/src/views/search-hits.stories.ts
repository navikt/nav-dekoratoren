import type { StoryObj, Meta } from '@storybook/html';
import type { SearchHitsProps } from './search-hits';
import { SearchHits } from './search-hits';

const meta: Meta<SearchHitsProps> = {
  title: 'search/search-hits',
  render: SearchHits,
};

export default meta;
type Story = StoryObj<SearchHitsProps>;

export const Default: Story = {
  args: {
    results: {
      total: 652,
      hits: [
        {
          displayName: 'Arbeid med støtte',
          href: 'https://www.nav.no/arbeid-med-stotte',
          highlight:
            'Et tilbud for deg som trenger støtte for å skaffe eller beholde en jobb. ',
        },
        {
          displayName: 'Gradert sjukmelding',
          href: 'https://www.nav.no/gradert-sjukmelding/nn',
          highlight:
            'Dersom du kan vere delvis i arbeid, skal du bli delvis sjukmeld. Føremålet er at du skal halde kontakten med arbeidsplassen og kunne jobbe når det er mogleg. Vilkåret er at det er medisinsk (...)',
        },
        {
          displayName: 'Kva er NAV?',
          href: 'https://www.nav.no/hva-er-nav/nn',
          highlight:
            'Om kva NAV er, korleis vi er organiserte, og korleis vi jobbar for å løyse samfunnsoppdraget vårt.',
        },
        {
          displayName: 'Varig tilrettelagt arbeid',
          href: 'https://www.nav.no/arbeidsgiver/varig-tilrettelagt-arbeid',
          highlight:
            'Hvis en person får uføretrygd, men har mulighet til å gjøre tilpassede oppgaver, kan det være aktuelt med varig tilrettelagt arbeid i ordinær virksomhet.',
        },
        {
          displayName: 'Opplysning, råd og rettleiing',
          href: 'https://www.nav.no/opplysning-rad-rettleiing/nn',
          highlight:
            'Rettleiing frå NAV når du har utfordringar med heimeforhold, busituasjon, omsorg for barn, arbeid eller økonomi.',
        },
      ],
    },
    query: 'arbeid',
    texts: {
      share_screen: 'Del skjerm med veileder',
      to_top: 'Til toppen',
      menu: 'Meny',
      close: 'Lukk',
      did_you_find: 'Fant du det du lette etter?',
      search: 'Søk',
      search_nav_no: 'Søk på nav.no',
      login: 'Logg inn',
      logout: 'Logg ut',
      logged_in: 'Logget inn',
      notifications: 'Varsler',
      notifications_empty_list: 'Du har ingen nye varsler',
      notifications_empty_list_description: 'Vi varsler deg når noe skjer',
      notifications_show_all: 'Tidligere varsler',
      notifications_messages_title: 'Beskjeder',
      notified_EPOST: 'Varslet på e-post',
      notified_SMS: 'Varslet på SMS',
      earlier_notifications: 'Tidligere varsler',
      masked_message_text:
        'Du har fått en melding, logg inn med høyere sikkerhetsnivå for å se meldingen.',
      masked_task_text:
        'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
      archive: 'Arkiver',
      notifications_tasks_title: 'Oppgaver',
      token_warning_title: 'Du blir snart logget ut automatisk',
      token_warning_body: 'Vil du fortsatt være innlogget?',
      session_warning_title: 'Du blir logget ut automatisk om ca $1 minutter',
      session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
      yes: 'Ja',
      no: 'Nei',
      ok: 'OK',
      hensikt_med_tilbakemelding:
        'Du får dessverre ikke svar på tilbakemeldingen din. Har du spørsmål eller trenger du hjelp?',
      hensikt_med_tilbakemelding_lenke: 'Ring, chat eller skriv til oss',
      send_undersokelse_takk: 'Takk!',
      rolle_privatperson: 'Privat',
      rolle_arbeidsgiver: 'Arbeidsgiver',
      rolle_samarbeidspartner: 'Samarbeidspartner',
      meny_bunnlenke_minside_stikkord:
        'Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester',
      meny_bunnlenke_arbeidsgiver_stikkord:
        'Dine sykmeldte, rekruttering, digitale skjemaer',
      meny_bunnlenke_samarbeidspartner_stikkord:
        'Helsepersonell, tiltaksarrangører, fylker og kommuner',
      loading_notifications: 'Laster varslinger',
      notifications_error: 'Feil ved lasting av varsler',
      til_forsiden: 'Til forsiden',
      how_can_we_help: 'Hva kan vi hjelpe deg med?',
      showing: 'Viser',
      of: 'av',
      results: 'resultater',
      see_all_hits: 'Se alle treff',
    },
  },
};
