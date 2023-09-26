export type Node = {
  children: Node[];
  displayName: string;
  path?: string;
  flatten?: boolean;
  id: string;
  isActive?: boolean;
};

export type Link = {
  content: string;
  url: string;
};

export type LinkGroup = {
  heading?: string;
  children: Link[];
};

export type Texts = {
  share_screen: string;
  to_top: string;
  menu: string;
  close: string;
  did_you_find: string;
  search: string;
  login: string;
  logout: string;
  varsler: string;
  varsler_tom_liste: string;
  varsler_tom_liste_ingress: string;
  varsler_vis_alle: string;
  varsler_beskjeder_tittel: string;
  varslet_EPOST: string;
  varslet_SMS: string;
  beskjed_maskert_tekst: string;
  oppgave_maskert_tekst: string;
  arkiver: string;
  varsler_oppgaver_tittel: string;
  token_warning_title: string;
  token_warning_body: string;
  session_warning_title: string;
  session_warning_body: string;
  yes: string;
  ok: string;
};

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};
