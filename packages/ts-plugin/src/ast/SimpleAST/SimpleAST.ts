export type SimpleAST = {
  kind: string;
  name?: string;
  position: {
    start: number;
    end: number;
  };
  children?: SimpleAST[];
};
