export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
}

export interface ActionParameter {
  name: string;
  type: "string" | "number" | "address";
  value: string;
}

export interface Action {
  id: string;
  name: string;
  type: "predefined" | "custom";
  network: Network;
  parameters: ActionParameter[];
  status: "pending" | "running" | "completed" | "failed";
}
