import type { StoryObj, Meta } from '@storybook/html';
import type { FeedbackSuccessProps } from './feedback-success';
import { FeedbackSuccess } from './feedback-success';

const meta: Meta<FeedbackSuccessProps> = {
  title: 'feedback-success',
  tags: ['autodocs'],
  render: FeedbackSuccess,
};

export default meta;
type Story = StoryObj<FeedbackSuccessProps>;

export const Default: Story = {
  args: {
    texts: {
      share_screen: 'Del skjerm med veileder',
      to_top: 'Til toppen',
      menu: 'Meny',
      close: 'Lukk',
      did_you_find: 'Fant du det du lette etter?',
      search: 'Søk',
      sok_knapp_sokefelt: 'Søk på nav.no',
      login: 'Logg inn',
      logout: 'Logg ut',
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
    },
  },
};
