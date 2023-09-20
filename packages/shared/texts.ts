// To get types to stop complaining for now
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
  token_warning_title: 'Du blir snart logget ut automatisk',
  token_warning_body: 'Vil du fortsatt være innlogget?',
  session_warning_title: (input: string) =>
    `Du blir logget ut automatisk om ca ${input} ${
      Number.parseInt(input, 10) === 1 ? 'minutt' : 'minutter'
    }`,
  session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
  yes: 'Ja',
  ok: 'OK',
};

export const texts = {
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
    token_warning_title: 'You will soon be logged out automatically',
    token_warning_body: 'Would you like to stay logged in?',
    session_warning_title: (input: string) =>
      `You will be logged out automatically in about ${input} ${
        Number.parseInt(input, 10) === 1 ? 'minute' : 'minutes'
      }`,
    session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
    yes: 'Yes',
    ok: 'OK',
  },
  se: {
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
    varsler_tom_liste_ingress: 'Du har ingen nye varsler',
    varsler_vis_alle: 'Tidligere varsler',
    token_warning_title: 'Du blir snart logget ut automatisk',
    token_warning_body: 'Vil du fortsatt være innlogget?',
    session_warning_title: (input: string) =>
      `Du blir logget ut automatisk om ca ${input} ${
        Number.parseInt(input, 10) === 1 ? 'minutt' : 'minutter'
      }`,
    session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
    yes: 'Ja',
    ok: 'OK',
  },
  nn: nb,
  pl: nb,
  uk: nb,
  ru: nb,
} as const;

export type Texts = (typeof texts)[keyof typeof texts];
