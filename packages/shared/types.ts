export type Node = {
  children: Node[];
  displayName: string;
  path?: string;
  flatten?: boolean;
  id: string;
  isActive?: boolean;
};
