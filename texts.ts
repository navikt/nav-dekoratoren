// To get types to stop complaining for now
const nb = {
  share_screen: "Del skjerm med veileder",
  to_top: "Til toppen",
  menu: "Meny",
  close: "Lukk",
  did_you_find: "Fant du det du lette etter?",
  search: "Søk",
};

export const texts = {
  nb,
  en: {
    share_screen: "Share screen with your counsellor",
    to_top: "To the top",
    menu: "Menu",
    close: "Close",
    did_you_find: "Fant du det du lette etter?",
    search: "Search",
  },
  se: {
    share_screen: "Del skjerm med veileder",
    to_top: "Til toppen",
    menu: "Meny",
    close: "Lukk",
    did_you_find: "Fant du det du lette etter?",
    search: "Søk",
  },
  nn: nb,
  pl: nb,
  uk: nb,
  ru: nb,
} as const;

export type Texts = (typeof texts)[keyof typeof texts];
