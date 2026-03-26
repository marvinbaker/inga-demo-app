"use client";

import { TrialFilters, Phase, OverallStatus } from "@/lib/types/trial";

const PHASES: { value: Phase; label: string }[] = [
  { value: "EARLY_PHASE1", label: "Early Phase 1" },
  { value: "PHASE1", label: "Phase 1" },
  { value: "PHASE2", label: "Phase 2" },
  { value: "PHASE3", label: "Phase 3" },
  { value: "PHASE4", label: "Phase 4" },
];

const STATUSES: { value: OverallStatus; label: string }[] = [
  { value: "RECRUITING", label: "Recruiting" },
  { value: "NOT_YET_RECRUITING", label: "Not Yet Recruiting" },
  { value: "ACTIVE_NOT_RECRUITING", label: "Active, Not Recruiting" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ENROLLING_BY_INVITATION", label: "Enrolling by Invitation" },
];

const INTERVENTION_TYPES = [
  "DRUG",
  "BIOLOGICAL",
  "RADIATION",
  "PROCEDURE",
  "DEVICE",
  "BEHAVIORAL",
  "OTHER",
];

interface FilterPanelProps {
  filters: TrialFilters;
  onUpdate: (updates: Partial<TrialFilters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  availableCountries: string[];
}

export default function FilterPanel({
  filters,
  onUpdate,
  onClear,
  hasActiveFilters,
  availableCountries,
}: FilterPanelProps) {
  const toggleArrayFilter = <T extends string>(
    key: keyof TrialFilters,
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdate({ [key]: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-800">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-accent-500 hover:text-accent-600 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          Location
        </label>
        <select
          value={filters.countries[0] || ""}
          onChange={(e) =>
            onUpdate({
              countries: e.target.value ? [e.target.value] : [],
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
        >
          <option value="">All countries</option>
          {availableCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          Your Age
        </label>
        <input
          type="number"
          min={0}
          max={120}
          placeholder="Enter your age"
          value={filters.age ?? ""}
          onChange={(e) =>
            onUpdate({
              age: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
        />
      </div>

      {/* Trial Phase */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-2">
          Trial Phase
        </label>
        <div className="space-y-1.5">
          {PHASES.map((phase) => (
            <label
              key={phase.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.phases.includes(phase.value)}
                onChange={() => toggleArrayFilter("phases", phase.value)}
                className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <span className="text-sm text-gray-700">{phase.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recruitment Status */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-2">
          Recruitment Status
        </label>
        <div className="space-y-1.5">
          {STATUSES.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.statuses.includes(status.value)}
                onChange={() => toggleArrayFilter("statuses", status.value)}
                className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <span className="text-sm text-gray-700">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Intervention Type */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-2">
          Intervention Type
        </label>
        <div className="space-y-1.5">
          {INTERVENTION_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.interventionTypes.includes(type)}
                onChange={() => toggleArrayFilter("interventionTypes", type)}
                className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {type.toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sponsor */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          Sponsor
        </label>
        <input
          type="text"
          placeholder="Search sponsor..."
          value={filters.sponsor}
          onChange={(e) => onUpdate({ sponsor: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
        />
      </div>
    </div>
  );
}
