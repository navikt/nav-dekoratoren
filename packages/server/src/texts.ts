import { Language } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';

const nb = {
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
  loading_notifications: 'Laster varslinger',
  notifications_error: 'Feil ved lasting av varsler',
};

export type LangBaseKeys = keyof typeof nb;

export const texts: Record<Language, Texts> = {
  nb,
  en: {
    share_screen: 'Share screen with your counsellor',
    to_top: 'To the top',
    menu: 'Menu',
    close: 'Close',
    did_you_find: 'Fant du det du lette etter?',
    search: 'Search',
    sok_knapp_sokefelt: 'Search nav.no',
    login: 'Log in',
    logout: 'Log out',
    notifications: 'Notifications',
    notifications_empty_list: 'You have no new notifications',
    notifications_empty_list_description: 'Du har ingen nye varsler',
    notifications_show_all: 'Previous notifications',
    notifications_messages_title: 'Beskjeder',
    notified_EPOST: 'Notified by e-mail',
    notified_SMS: 'Notified by SMS',
    earlier_notifications: 'Earlier notifications',
    masked_message_text:
      'You have a message, please log in with a higher security level to read the message.',
    masked_task_text:
      'You have a task, please log in with a higher security level to see the task.',
    archive: 'Archive',
    notifications_tasks_title: 'Tasks',
    token_warning_title: 'You will soon be logged out automatically',
    token_warning_body: 'Would you like to stay logged in?',
    session_warning_title:
      'You will be logged out automatically in about $1 minutes',
    session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    hensikt_med_tilbakemelding:
      'Unfortunately you will not get a reply to your feedback. Do you have questions or need help?',
    hensikt_med_tilbakemelding_lenke: 'Call, chat or write to us',
    send_undersokelse_takk: 'Thanks!',
    loading_notifications: 'Loading notifications',
    notifications_error: 'Error loading notifications',
  },
  se: nb,
  nn: nb,
  pl: nb,
  uk: nb,
  ru: nb,
};
