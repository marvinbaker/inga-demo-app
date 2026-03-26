"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ClinicalTrial, TrialsResponse } from "@/lib/types/trial";
import { fetchTrials } from "@/lib/api/clinicaltrials";
import { useTrialFilters } from "@/lib/hooks/useTrialFilters";
import { useDebounce } from "@/lib/hooks/useDebounce";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import TrialCard from "./TrialCard";

interface TrialsPageClientProps {
  initialData: TrialsResponse;
}

export default function TrialsPageClient({ initialData }: TrialsPageClientProps) {
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useTrialFilters();
  const [trials, setTrials] = useState<ClinicalTrial[]>(initialData.trials);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialData.nextPageToken
  );
  const [loading, setLoading] = useState(initialData.trials.length === 0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to filters
  useEffect(() => {
    if (debouncedSearch !== filters.searchTerm) {
      updateFilters({ searchTerm: debouncedSearch });
    }
  }, [debouncedSearch, filters.searchTerm, updateFilters]);

  // Fetch when filters change
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTrials(filters);
      setTrials(data.trials);
      setTotalCount(data.totalCount);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error("Failed to fetch trials:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.countries,
    filters.age,
    filters.phases,
    filters.statuses,
    filters.interventionTypes,
    filters.sponsor,
    filters.gender,
    debouncedSearch,
  ]);

  const loadMore = async () => {
    if (!nextPageToken || loading) return;
    setLoading(true);
    try {
      const data = await fetchTrials(filters, nextPageToken);
      setTrials((prev) => [...prev, ...data.trials]);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract available countries from trials for the filter dropdown
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    trials.forEach((t) => t.countries.forEach((c) => countries.add(c)));
    return [...countries].sort();
  }, [trials]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-800 mb-1">
          Clinical Trials
        </h1>
        <p className="text-sm text-gray-500">
          ER+/HER2- breast cancer trials worldwide
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-navy-600 text-white text-xs">
              {[
                filters.countries.length,
                filters.age ? 1 : 0,
                filters.phases.length,
                filters.statuses.length,
                filters.interventionTypes.length,
                filters.sponsor ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <FilterPanel
              filters={filters}
              onUpdate={updateFilters}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
              availableCountries={availableCountries}
            />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFilterDrawerOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl shadow-xl p-5 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy-800">Filters</h2>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onUpdate={updateFilters}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
                availableCountries={availableCountries}
              />
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full mt-4 rounded-lg bg-navy-600 px-4 py-3 text-sm font-medium text-white hover:bg-navy-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <SearchBar value={searchInput} onChange={setSearchInput} />

          <div className="mt-4 mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Showing <span className="font-medium text-navy-700">{trials.length}</span>
                  {totalCount > trials.length && (
                    <> of <span className="font-medium text-navy-700">{totalCount}</span></>
                  )}{" "}
                  trials
                </>
              )}
            </p>
          </div>

          {/* Trial list */}
          <div className="space-y-3">
            {loading && trials.length === 0 ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-white p-5 animate-pulse"
                >
                  <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : trials.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-3 text-sm text-gray-500">
                  No trials match your current filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-sm text-accent-500 hover:text-accent-600 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              trials.map((trial) => (
                <TrialCard
                  key={trial.nctId}
                  trial={trial}
                  isExpanded={expandedId === trial.nctId}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === trial.nctId ? null : trial.nctId
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Load more */}
          {nextPageToken && trials.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-navy-600 px-6 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Load more trials"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
