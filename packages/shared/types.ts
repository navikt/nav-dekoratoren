import { Context, Environment, Language, Params } from './params';

export enum MenuValue {
  PRIVATPERSON = 'privatperson',
  ARBEIDSGIVER = 'arbeidsgiver',
  SAMARBEIDSPARTNER = 'samarbeidspartner',
  IKKEBESTEMT = 'IKKEBESTEMT',
}

export type Node = {
  children: Node[];
  displayName: string;
  path?: string;
  flatten?: boolean;
  id: string;
  isActive?: boolean;
  isMyPageMenu?: boolean;
};

export type Link = {
  content: string;
  url: string;
} & Pick<Node, 'path'>;

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
  logged_in: string;
  notifications: string;
  notifications_empty_list: string;
  notifications_empty_list_description: string;
  notifications_show_all: string;
  notifications_messages_title: string;
  notified_EPOST: string;
  notified_SMS: string;
  earlier_notifications: string;
  masked_message_text: string;
  masked_task_text: string;
  archive: string;
  notifications_tasks_title: string;
  token_warning_title: string;
  token_warning_body: string;
  session_warning_title: string;
  session_warning_body: string;
  yes: string;
  ok: string;
  no: string;
  search_nav_no: string;
  hensikt_med_tilbakemelding: string;
  hensikt_med_tilbakemelding_lenke: string;
  send_undersokelse_takk: string;
  rolle_privatperson: string;
  rolle_arbeidsgiver: string;
  rolle_samarbeidspartner: string;
  meny_bunnlenke_minside_stikkord: string;
  meny_bunnlenke_arbeidsgiver_stikkord: string;
  meny_bunnlenke_samarbeidspartner_stikkord: string;
  loading_notifications: string;
  notifications_error: string;
  til_forsiden: string;
  how_can_we_help: string;
  showing: string;
  of: string;
  results: string;
  see_all_hits: string;
  no_hits_for: string;
  loading_preview: string;
};

export type Driftsmelding = {
  heading: string;
  url: string;
};

export type TextKey = keyof Texts;
export type WithTexts<T = object> = T & {
  texts: Texts;
};

export type SearchHit = {
  displayName: string;
  highlight: string;
  href: string;
};

export type SearchResult = {
  hits: SearchHit[];
  total: number;
};

export type AppState = {
  texts: Texts;
  params: Params;
  env: Environment;
};

export type TaskAnalyticsUrlRule = {
  url: string;
  match: 'exact' | 'startsWith';
  exclude?: boolean;
};

export type TaskAnalyticsSurveyConfig = {
  id: string;
  selection?: number;
  duration?: {
    start?: string;
    end?: string;
  };
  urls?: TaskAnalyticsUrlRule[];
  audience?: Context[];
  language?: Language[];
};
