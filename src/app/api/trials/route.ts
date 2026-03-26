import { NextRequest, NextResponse } from "next/server";
import { buildTrialsUrl } from "@/lib/api/clinicaltrials";
import {
  TrialFilters,
  DEFAULT_FILTERS,
  OverallStatus,
  Phase,
} from "@/lib/types/trial";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: TrialFilters = {
    searchTerm: searchParams.get("searchTerm") || DEFAULT_FILTERS.searchTerm,
    countries: searchParams.get("countries")
      ? searchParams.get("countries")!.split(",")
      : [],
    age: searchParams.get("age") ? parseInt(searchParams.get("age")!) : null,
    phases: searchParams.get("phases")
      ? (searchParams.get("phases")!.split(",") as Phase[])
      : [],
    statuses: searchParams.get("statuses")
      ? (searchParams.get("statuses")!.split(",") as OverallStatus[])
      : [],
    interventionTypes: searchParams.get("interventionTypes")
      ? searchParams.get("interventionTypes")!.split(",")
      : [],
    sponsor: searchParams.get("sponsor") || "",
    gender: (searchParams.get("gender") as "ALL" | "FEMALE" | "MALE") || "ALL",
  };

  const pageToken = searchParams.get("pageToken") || undefined;
  const url = buildTrialsUrl(filters, pageToken);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: `ClinicalTrials.gov API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch trials: ${error}` },
      { status: 500 }
    );
  }
}
