import { LangBaseKeys } from 'decorator-server/src/texts';

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
};

export type LinkGroup = {
  heading?: string;
  children: Link[];
};

export type Texts = Record<LangBaseKeys, string>;

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};

export type WithTexts<T = object> = T & {
  texts: Texts;
};

export type SearchHit = {
  audience: string[];
  createdTime: string;
  modifiedTime: string;
  displayName: string;
  highlight: string;
  href: string;
  language: string;
  hideModifiedDate: boolean;
  hidePublishDate: boolean;
};

export type SearchResult = {
  hits: SearchHit[];
  total: number;
};
