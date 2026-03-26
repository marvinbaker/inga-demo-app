export type OverallStatus =
  | "RECRUITING"
  | "NOT_YET_RECRUITING"
  | "ACTIVE_NOT_RECRUITING"
  | "COMPLETED"
  | "TERMINATED"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "ENROLLING_BY_INVITATION"
  | "UNKNOWN";

export type Phase =
  | "EARLY_PHASE1"
  | "PHASE1"
  | "PHASE2"
  | "PHASE3"
  | "PHASE4"
  | "NA";

export interface Intervention {
  type: string;
  name: string;
  description: string | null;
}

export interface Eligibility {
  criteria: { inclusion: string[]; exclusion: string[] };
  minimumAge: number | null;
  maximumAge: number | null;
  sex: "ALL" | "FEMALE" | "MALE";
  healthyVolunteers: boolean;
}

export interface TrialLocation {
  facility: string | null;
  city: string;
  state: string | null;
  country: string;
}

export interface Outcome {
  measure: string;
  description: string | null;
  timeFrame: string | null;
}

export interface ClinicalTrial {
  nctId: string;
  briefTitle: string;
  officialTitle: string | null;
  overallStatus: OverallStatus;
  phases: Phase[];
  leadSponsor: string;
  briefSummary: string;
  conditions: string[];
  interventions: Intervention[];
  eligibility: Eligibility;
  locations: TrialLocation[];
  countries: string[];
  enrollment: { count: number; type: string } | null;
  startDate: string | null;
  completionDate: string | null;
  primaryOutcomes: Outcome[];
  clinicalTrialsUrl: string;
}

export interface TrialFilters {
  searchTerm: string;
  countries: string[];
  age: number | null;
  phases: Phase[];
  statuses: OverallStatus[];
  interventionTypes: string[];
  sponsor: string;
  gender: "ALL" | "FEMALE" | "MALE";
}

export interface TrialsResponse {
  trials: ClinicalTrial[];
  totalCount: number;
  nextPageToken: string | null;
}

export const DEFAULT_FILTERS: TrialFilters = {
  searchTerm: "",
  countries: [],
  age: null,
  phases: [],
  statuses: [],
  interventionTypes: [],
  sponsor: "",
  gender: "ALL",
};
