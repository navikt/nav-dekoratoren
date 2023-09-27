import { LangBaseKeys } from 'decorator-server/src/texts';

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

export type Texts = Record<LangBaseKeys, string>;

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};
