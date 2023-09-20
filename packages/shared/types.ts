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
