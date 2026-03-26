"use client";

import { useState, useMemo } from "react";
import { NewsArticle } from "@/lib/types/news";
import { isRecentArticle } from "@/lib/api/pubmed";
import NewsHero from "./NewsHero";
import NewsCard from "./NewsCard";

type SortOption = "newest" | "oldest" | "journal";
type FilterOption = "all" | "recent" | "review" | "clinical-trial" | "meta-analysis";

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Articles" },
  { value: "recent", label: "This Week" },
  { value: "review", label: "Reviews" },
  { value: "clinical-trial", label: "Clinical Trials" },
  { value: "meta-analysis", label: "Meta-Analysis" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "journal", label: "Journal A-Z" },
];

interface NewsPageClientProps {
  articles: NewsArticle[];
}

export default function NewsPageClient({ articles }: NewsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.journal.toLowerCase().includes(term) ||
          a.authors.some((author) => author.toLowerCase().includes(term))
      );
    }

    // Category filter
    switch (activeFilter) {
      case "recent":
        filtered = filtered.filter((a) => isRecentArticle(a.publishDate));
        break;
      case "review":
        filtered = filtered.filter((a) =>
          a.articleType.toLowerCase().includes("review")
        );
        break;
      case "clinical-trial":
        filtered = filtered.filter(
          (a) =>
            a.articleType.toLowerCase().includes("clinical trial") ||
            a.articleType.toLowerCase().includes("randomized")
        );
        break;
      case "meta-analysis":
        filtered = filtered.filter(
          (a) =>
            a.articleType.toLowerCase().includes("meta-analysis") ||
            a.articleType.toLowerCase().includes("systematic")
        );
        break;
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishDate).getTime() -
            new Date(b.publishDate).getTime()
        );
        break;
      case "journal":
        filtered.sort((a, b) => a.journal.localeCompare(b.journal));
        break;
    }

    return filtered;
  }, [articles, searchTerm, activeFilter, sortBy]);

  const [featured, ...rest] = filteredArticles;

  return (
    <>
      {/* Hero */}
      <div className="bg-navy-50/50 border-b border-navy-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 mb-6">
        <p className="text-xs font-semibold tracking-widest text-accent-500 uppercase mb-2">
          Latest Updates
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-1">
          Advancing the{" "}
          <span className="text-accent-500">Science of Survival.</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          An editorial deep-dive into the clinical breakthroughs and emerging
          therapies shaping the future of ER+/HER2- breast cancer treatment.
        </p>
      </div>

      {/* Search + Filter + Sort bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search research topics, medications, or oncology terms..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === opt.value
                ? "bg-accent-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-accent-500 hover:text-accent-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500">
            No articles match your current filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
            className="mt-2 text-sm text-accent-500 hover:text-accent-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {featured && <NewsHero article={featured} />}

          {rest.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy-800">
                  More Research
                </h2>
                <span className="text-xs text-gray-400">
                  {filteredArticles.length} article
                  {filteredArticles.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((article) => (
                  <NewsCard key={article.pmid} article={article} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
