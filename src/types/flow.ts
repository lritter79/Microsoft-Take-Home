export type FlowEdge = {
  id: string;
  source: string;
  target: string;
};

export type FlowNode = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { label: string; [key: string]: any };
};
