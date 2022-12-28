export type DAO = {
  id: string;
  metadata: string;
  name: string;
  token: string;
  proposals: Proposal[];
};


export type Plugin = {
  id: string;
  minDuration: string;
  totalSupportThresholdPct: string;
  relativeSupportThresholdPct: string;
}

export enum VoteOption {
  Yes,
  No,
  Abstain,
  None
}

export type Proposal = {
  id: string;
  creator: string;
  metadata: string;
  resources: string[];
  summary: string;
  title: string;
  census: string;
  executed: boolean;
  createdAt: string;
  startDate: string;
  endDate: string;
  voteCount: string;
  yes: string;
  no: string;
  abstain: string;
  open: string;
  dao: DAO;
  vote: VoteOption;
}
