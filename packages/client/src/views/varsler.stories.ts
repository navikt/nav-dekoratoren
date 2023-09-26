import type { StoryObj, Meta } from '@storybook/html';
import type { VarslerPopulatedProps } from './varsler';
import { VarslerPopulated } from './varsler';

const meta: Meta<VarslerPopulatedProps> = {
  title: 'varsler',
  tags: ['autodocs'],
  render: VarslerPopulated,
};

export default meta;
type Story = StoryObj<VarslerPopulatedProps>;

export const Default: Story = {
  args: {
    varslerData: {
      beskjeder: [
        {
          eventId: 'ff3d01cb-7300-4ce5-aa5b-1c4e1427c052',
          varselId: 'ff3d01cb-7300-4ce5-aa5b-1c4e1427c052',
          tidspunkt: '2023-07-04T11:41:18.259801+02:00',
          isMasked: true,
          tekst: 'Tekst',
          link: null,
          type: 'beskjed',
          eksternVarslingSendt: false,
          eksternVarslingKanaler: [],
        },
        {
          eventId: '76afdab2-9309-444e-85a0-3ad72775109b',
          varselId: '76afdab2-9309-444e-85a0-3ad72775109b',
          tidspunkt: '2023-07-06T13:50:50.825129+02:00',
          isMasked: true,
          tekst: 'Andre',
          link: null,
          type: 'beskjed',
          eksternVarslingSendt: true,
          eksternVarslingKanaler: ['EPOST'],
        },
        {
          eventId: '1cbc93d5-372f-4685-bcab-f331b585e27b',
          varselId: '1cbc93d5-372f-4685-bcab-f331b585e27b',
          tidspunkt: '2023-08-03T14:29:19.052696+02:00',
          isMasked: false,
          tekst: 'Uten link',
          link: null,
          type: 'beskjed',
          eksternVarslingSendt: false,
          eksternVarslingKanaler: [],
        },
      ],
      oppgaver: [
        {
          eventId: '22ee1247-e8fc-4329-8a41-bee3623d151e',
          varselId: '22ee1247-e8fc-4329-8a41-bee3623d151e',
          tidspunkt: '2023-02-03T14:52:09.623+01:00',
          isMasked: true,
          tekst: null,
          link: null,
          type: 'oppgave',
          eksternVarslingSendt: false,
          eksternVarslingKanaler: [],
        },
        {
          eventId: '92cd953b-2172-4c86-9c7d-5ca1eb21dda3',
          varselId: '92cd953b-2172-4c86-9c7d-5ca1eb21dda3',
          tidspunkt: '2023-05-11T10:42:38.247492+02:00',
          isMasked: true,
          tekst: null,
          link: null,
          type: 'oppgave',
          eksternVarslingSendt: false,
          eksternVarslingKanaler: [],
        },
      ],
    },
    texts: {
      share_screen: 'Del skjerm med veileder',
      to_top: 'Til toppen',
      menu: 'Meny',
      close: 'Lukk',
      did_you_find: 'Fant du det du lette etter?',
      search: 'Søk',
      login: 'Logg inn',
      logout: 'Logg ut',
      varsler: 'Varsler',
      varsler_tom_liste: 'Du har ingen nye varsler',
      varsler_tom_liste_ingress: 'Vi varsler deg når noe skjer',
      varsler_vis_alle: 'Tidligere varsler',
      varsler_beskjeder_tittel: 'Beskjeder',
      varslet_EPOST: 'Varslet på e-post',
      varslet_SMS: 'Varslet på SMS',
      beskjed_maskert_tekst:
        'Du har fått en melding, logg inn med høyere sikkerhetsnivå for å se meldingen.',
      oppgave_maskert_tekst:
        'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
      arkiver: 'Arkiver',
      varsler_oppgaver_tittel: 'Oppgaver',
      token_warning_title: 'Du blir snart logget ut automatisk',
      token_warning_body: 'Vil du fortsatt være innlogget?',
      session_warning_title: 'Du blir logget ut automatisk om ca $1 minutter',
      session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
      yes: 'Ja',
      ok: 'OK',
    },
  },
};
