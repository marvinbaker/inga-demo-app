"use client";

import { ClinicalTrial } from "@/lib/types/trial";
import { getStatusColor, formatStatus, formatPhase } from "@/lib/api/clinicaltrials";

interface TrialCardProps {
  trial: ClinicalTrial;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TrialCard({ trial, isExpanded, onToggle }: TrialCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm transition-all duration-200 ${
        isExpanded
          ? "border-accent-500/30 shadow-md"
          : "border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* Collapsed summary */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-xl"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-mono mb-1">{trial.nctId}</p>
            <h3 className="text-base font-semibold text-navy-800 leading-snug mb-3">
              {trial.briefTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                  trial.overallStatus
                )}`}
              >
                {formatStatus(trial.overallStatus)}
              </span>
              {trial.phases.map((phase) => (
                <span
                  key={phase}
                  className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700"
                >
                  {formatPhase(phase)}
                </span>
              ))}
              <span className="text-xs text-gray-500">
                {trial.leadSponsor}
              </span>
              {trial.countries.length > 0 && (
                <span className="text-xs text-gray-500">
                  {trial.countries.slice(0, 3).join(", ")}
                  {trial.countries.length > 3 &&
                    ` +${trial.countries.length - 3} more`}
                </span>
              )}
            </div>
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">
          {/* Summary */}
          {trial.briefSummary && (
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {trial.briefSummary}
              </p>
            </div>
          )}

          {/* Eligibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                Eligibility
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Age:</span>{" "}
                  {trial.eligibility.minimumAge !== null
                    ? `${trial.eligibility.minimumAge}`
                    : "No min"}{" "}
                  -{" "}
                  {trial.eligibility.maximumAge !== null
                    ? `${trial.eligibility.maximumAge} years`
                    : "No max"}
                </p>
                <p>
                  <span className="font-medium">Sex:</span>{" "}
                  {trial.eligibility.sex === "ALL"
                    ? "All"
                    : trial.eligibility.sex}
                </p>
                {trial.enrollment && (
                  <p>
                    <span className="font-medium">Enrollment:</span>{" "}
                    {trial.enrollment.count} ({trial.enrollment.type})
                  </p>
                )}
              </div>
            </div>

            {/* Interventions */}
            {trial.interventions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                  Interventions
                </h4>
                <div className="space-y-1">
                  {trial.interventions.map((intv, i) => (
                    <div key={i} className="text-sm text-gray-600">
                      <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 mr-1.5 capitalize">
                        {intv.type.toLowerCase()}
                      </span>
                      {intv.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inclusion/Exclusion Criteria */}
          {(trial.eligibility.criteria.inclusion.length > 0 ||
            trial.eligibility.criteria.exclusion.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                Key Criteria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trial.eligibility.criteria.inclusion.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">
                      Inclusion
                    </p>
                    <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
                      {trial.eligibility.criteria.inclusion
                        .slice(0, 5)
                        .map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      {trial.eligibility.criteria.inclusion.length > 5 && (
                        <li className="text-gray-400">
                          +{trial.eligibility.criteria.inclusion.length - 5}{" "}
                          more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {trial.eligibility.criteria.exclusion.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">
                      Exclusion
                    </p>
                    <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
                      {trial.eligibility.criteria.exclusion
                        .slice(0, 5)
                        .map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      {trial.eligibility.criteria.exclusion.length > 5 && (
                        <li className="text-gray-400">
                          +{trial.eligibility.criteria.exclusion.length - 5}{" "}
                          more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Locations */}
          {trial.locations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                Locations ({trial.locations.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trial.countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs text-navy-700"
                  >
                    {country} (
                    {trial.locations.filter((l) => l.country === country).length}
                    )
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Primary Outcomes */}
          {trial.primaryOutcomes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-navy-700 mb-1.5">
                Primary Outcomes
              </h4>
              <div className="space-y-1">
                {trial.primaryOutcomes.slice(0, 3).map((o, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {o.measure}
                    {o.timeFrame && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({o.timeFrame})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={trial.clinicalTrialsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
            >
              View on ClinicalTrials.gov
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            {trial.startDate && (
              <span className="text-xs text-gray-400">
                Started: {trial.startDate}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
