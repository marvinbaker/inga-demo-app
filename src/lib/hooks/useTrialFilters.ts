"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  TrialFilters,
  DEFAULT_FILTERS,
  Phase,
  OverallStatus,
} from "@/lib/types/trial";

export function useTrialFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: TrialFilters = useMemo(() => {
    return {
      searchTerm: searchParams.get("q") || DEFAULT_FILTERS.searchTerm,
      countries: searchParams.get("countries")
        ? searchParams.get("countries")!.split(",")
        : [],
      age: searchParams.get("age")
        ? parseInt(searchParams.get("age")!)
        : null,
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
      gender:
        (searchParams.get("gender") as "ALL" | "FEMALE" | "MALE") || "ALL",
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<TrialFilters>) => {
      const newFilters = { ...filters, ...updates };
      const params = new URLSearchParams();

      if (newFilters.searchTerm) params.set("q", newFilters.searchTerm);
      if (newFilters.countries.length > 0)
        params.set("countries", newFilters.countries.join(","));
      if (newFilters.age !== null) params.set("age", String(newFilters.age));
      if (newFilters.phases.length > 0)
        params.set("phases", newFilters.phases.join(","));
      if (newFilters.statuses.length > 0)
        params.set("statuses", newFilters.statuses.join(","));
      if (newFilters.interventionTypes.length > 0)
        params.set("interventionTypes", newFilters.interventionTypes.join(","));
      if (newFilters.sponsor) params.set("sponsor", newFilters.sponsor);
      if (newFilters.gender !== "ALL") params.set("gender", newFilters.gender);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [filters, router, pathname]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== "" ||
      filters.countries.length > 0 ||
      filters.age !== null ||
      filters.phases.length > 0 ||
      filters.statuses.length > 0 ||
      filters.interventionTypes.length > 0 ||
      filters.sponsor !== "" ||
      filters.gender !== "ALL"
    );
  }, [filters]);

  return { filters, updateFilters, clearFilters, hasActiveFilters };
}
