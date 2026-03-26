import {
  ClinicalTrial,
  TrialFilters,
  TrialsResponse,
  OverallStatus,
  Phase,
  Intervention,
  Eligibility,
  TrialLocation,
  Outcome,
} from "@/lib/types/trial";

const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";
const BASE_CONDITION = "breast cancer ER+ HER2-";

export function buildTrialsUrl(filters: TrialFilters, pageToken?: string): string {
  const params = new URLSearchParams();

  const condQuery = filters.searchTerm
    ? `${BASE_CONDITION} ${filters.searchTerm}`
    : BASE_CONDITION;
  params.set("query.cond", condQuery);

  if (filters.countries.length > 0) {
    params.set("query.locn", filters.countries.join(" OR "));
  }

  if (filters.statuses.length > 0) {
    params.set("filter.overallStatus", filters.statuses.join(","));
  }

  if (filters.phases.length > 0) {
    params.set("filter.phase", filters.phases.join(","));
  }

  params.set("pageSize", "20");
  params.set("format", "json");

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  return `${BASE_URL}?${params.toString()}`;
}

function parseAge(ageStr: string | undefined | null): number | null {
  if (!ageStr) return null;
  const match = ageStr.match(/(\d+)/);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  if (ageStr.toLowerCase().includes("month")) {
    return Math.floor(value / 12);
  }
  return value;
}

function parseEligibilityCriteria(text: string | undefined | null): {
  inclusion: string[];
  exclusion: string[];
} {
  if (!text) return { inclusion: [], exclusion: [] };

  const inclusion: string[] = [];
  const exclusion: string[] = [];
  let currentSection: "inclusion" | "exclusion" | null = null;

  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();
    if (lower.includes("inclusion criteria") || lower.includes("inclusion:")) {
      currentSection = "inclusion";
      continue;
    }
    if (lower.includes("exclusion criteria") || lower.includes("exclusion:")) {
      currentSection = "exclusion";
      continue;
    }

    const cleaned = trimmed.replace(/^[\-\*\•\d\.]+\s*/, "").trim();
    if (!cleaned) continue;

    if (currentSection === "inclusion") {
      inclusion.push(cleaned);
    } else if (currentSection === "exclusion") {
      exclusion.push(cleaned);
    }
  }

  return { inclusion, exclusion };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function transformStudy(raw: any): ClinicalTrial {
  const protocol = raw.protocolSection || {};
  const id = protocol.identificationModule || {};
  const status = protocol.statusModule || {};
  const sponsor = protocol.sponsorCollaboratorsModule || {};
  const desc = protocol.descriptionModule || {};
  const conditions = protocol.conditionsModule || {};
  const design = protocol.designModule || {};
  const eligibility = protocol.eligibilityModule || {};
  const contacts = protocol.contactsLocationsModule || {};
  const outcomes = protocol.outcomesModule || {};
  const arms = protocol.armsInterventionsModule || {};

  const locations: TrialLocation[] = (contacts.locations || []).map(
    (loc: any) => ({
      facility: loc.facility || null,
      city: loc.city || "",
      state: loc.state || null,
      country: loc.country || "",
    })
  );

  const countries = [...new Set(locations.map((l) => l.country).filter(Boolean))];

  const interventions: Intervention[] = (arms.interventions || []).map(
    (intv: any) => ({
      type: intv.type || "OTHER",
      name: intv.name || "",
      description: intv.description || null,
    })
  );

  const primaryOutcomes: Outcome[] = (
    outcomes.primaryOutcomes || []
  ).map((o: any) => ({
    measure: o.measure || "",
    description: o.description || null,
    timeFrame: o.timeFrame || null,
  }));

  const eligibilityData: Eligibility = {
    criteria: parseEligibilityCriteria(eligibility.eligibilityCriteria),
    minimumAge: parseAge(eligibility.minimumAge),
    maximumAge: parseAge(eligibility.maximumAge),
    sex: eligibility.sex || "ALL",
    healthyVolunteers: eligibility.healthyVolunteers === "Yes",
  };

  const phases: Phase[] = (design.phases || status.phases || []).map(
    (p: string) => p as Phase
  );

  const nctId = id.nctId || "";

  return {
    nctId,
    briefTitle: id.briefTitle || "",
    officialTitle: id.officialTitle || null,
    overallStatus: (status.overallStatus || "UNKNOWN") as OverallStatus,
    phases,
    leadSponsor: sponsor.leadSponsor?.name || "Unknown",
    briefSummary: desc.briefSummary || "",
    conditions: conditions.conditions || [],
    interventions,
    eligibility: eligibilityData,
    locations,
    countries,
    enrollment: status.enrollmentInfo
      ? {
          count: status.enrollmentInfo.count || 0,
          type: status.enrollmentInfo.type || "",
        }
      : null,
    startDate: status.startDateStruct?.date || null,
    completionDate: status.completionDateStruct?.date || null,
    primaryOutcomes,
    clinicalTrialsUrl: `https://clinicaltrials.gov/study/${nctId}`,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function fetchTrials(
  filters: TrialFilters,
  pageToken?: string
): Promise<TrialsResponse> {
  const url = buildTrialsUrl(filters, pageToken);

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`ClinicalTrials.gov API error: ${res.status}`);
  }

  const data = await res.json();
  const studies = data.studies || [];
  let trials: ClinicalTrial[] = studies.map(transformStudy);

  // Client-side age filtering
  if (filters.age !== null) {
    trials = trials.filter((t) => {
      const min = t.eligibility.minimumAge;
      const max = t.eligibility.maximumAge;
      if (min !== null && filters.age! < min) return false;
      if (max !== null && filters.age! > max) return false;
      return true;
    });
  }

  // Client-side intervention type filtering
  if (filters.interventionTypes.length > 0) {
    trials = trials.filter((t) =>
      t.interventions.some((intv) =>
        filters.interventionTypes.includes(intv.type)
      )
    );
  }

  // Client-side sponsor filtering
  if (filters.sponsor) {
    const sponsorLower = filters.sponsor.toLowerCase();
    trials = trials.filter((t) =>
      t.leadSponsor.toLowerCase().includes(sponsorLower)
    );
  }

  // Client-side gender filtering
  if (filters.gender !== "ALL") {
    trials = trials.filter(
      (t) => t.eligibility.sex === "ALL" || t.eligibility.sex === filters.gender
    );
  }

  return {
    trials,
    totalCount: data.totalCount || trials.length,
    nextPageToken: data.nextPageToken || null,
  };
}

export function getStatusColor(status: OverallStatus): string {
  const colors: Record<OverallStatus, string> = {
    RECRUITING: "bg-status-recruiting text-white",
    NOT_YET_RECRUITING: "bg-status-notyet text-white",
    ACTIVE_NOT_RECRUITING: "bg-status-active text-white",
    COMPLETED: "bg-status-completed text-white",
    TERMINATED: "bg-status-suspended text-white",
    SUSPENDED: "bg-status-suspended text-white",
    WITHDRAWN: "bg-gray-400 text-white",
    ENROLLING_BY_INVITATION: "bg-status-active text-white",
    UNKNOWN: "bg-gray-400 text-white",
  };
  return colors[status] || "bg-gray-400 text-white";
}

export function formatStatus(status: OverallStatus): string {
  const labels: Record<OverallStatus, string> = {
    RECRUITING: "Recruiting",
    NOT_YET_RECRUITING: "Not Yet Recruiting",
    ACTIVE_NOT_RECRUITING: "Active, Not Recruiting",
    COMPLETED: "Completed",
    TERMINATED: "Terminated",
    SUSPENDED: "Suspended",
    WITHDRAWN: "Withdrawn",
    ENROLLING_BY_INVITATION: "Enrolling by Invitation",
    UNKNOWN: "Unknown",
  };
  return labels[status] || status;
}

export function formatPhase(phase: Phase): string {
  const labels: Record<Phase, string> = {
    EARLY_PHASE1: "Early Phase 1",
    PHASE1: "Phase 1",
    PHASE2: "Phase 2",
    PHASE3: "Phase 3",
    PHASE4: "Phase 4",
    NA: "N/A",
  };
  return labels[phase] || phase;
}
