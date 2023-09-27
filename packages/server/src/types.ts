type SearchHit = {
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
