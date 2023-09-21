import { Language } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';

const nb = {
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
};

export const texts: Record<Language, Texts> = {
  nb,
  en: {
    share_screen: 'Share screen with your counsellor',
    to_top: 'To the top',
    menu: 'Menu',
    close: 'Close',
    did_you_find: 'Fant du det du lette etter?',
    search: 'Search',
    login: 'Log in',
    logout: 'Log out',
    varsler: 'Notifications',
    varsler_tom_liste: 'You have no new notifications',
    varsler_tom_liste_ingress: 'Du har ingen nye varsler',
    varsler_vis_alle: 'Previous notifications',
    varsler_beskjeder_tittel: 'Beskjeder',
    varslet_EPOST: 'Notified by e-mail',
    varslet_SMS: 'Notified by SMS',
    beskjed_maskert_tekst:
      'You have a message, please log in with a higher security level to read the message.',
    oppgave_maskert_tekst:
      'You have a task, please log in with a higher security level to see the task.',
    arkiver: 'Archive',
    varsler_oppgaver_tittel: 'Tasks',
    token_warning_title: 'You will soon be logged out automatically',
    token_warning_body: 'Would you like to stay logged in?',
    session_warning_title:
      'You will be logged out automatically in about $1 minutes',
    session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
    yes: 'Yes',
    ok: 'OK',
  },
  se: nb,
  nn: nb,
  pl: nb,
  uk: nb,
  ru: nb,
};
