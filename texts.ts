// To get types to stop complaining for now
const dummy = {
  share_screen: "Del skjerm med veileder",
  to_top: "Til toppen",
  menu: "Meny",
  close: "Lukk",
  did_you_find: "Fant du det du lette etter?",
};

export const texts = {
  nb: {
    share_screen: "Del skjerm med veileder",
    to_top: "Til toppen",
    menu: "Meny",
    close: "Lukk",
    did_you_find: "Fant du det du lette etter?",
  },
  en: {
    share_screen: "Share screen with your counsellor",
    to_top: "To the top",
    menu: "Menu",
    close: "Close",
    did_you_find: "Fant du det du lette etter?",
  },
  se: {
    share_screen: "Del skjerm med veileder",
    to_top: "Til toppen",
    menu: "Meny",
    close: "Lukk",
    did_you_find: "Fant du det du lette etter?",
  },
  nn: dummy,
  pl: dummy,
  uk: dummy,
  ru: dummy,
} as const;

export type Texts = (typeof texts)[keyof typeof texts];
