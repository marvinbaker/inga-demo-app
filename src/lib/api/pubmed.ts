import { NewsArticle } from "@/lib/types/news";

const ESEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const ESUMMARY_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";

const SEARCH_TERM = `("breast cancer" OR "breast neoplasm") AND ("ER positive" OR "estrogen receptor positive" OR "oestrogen receptor positive" OR "HR positive" OR "hormone receptor positive") AND ("HER2 negative" OR "HER2-negative" OR "HER2-") AND ("treatment" OR "therapy" OR "clinical trial" OR "research")`;

function getDateRange(): { minDate: string; maxDate: string } {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const format = (d: Date) =>
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  return { minDate: format(thirtyDaysAgo), maxDate: format(now) };
}

async function searchPubMed(): Promise<string[]> {
  const { minDate, maxDate } = getDateRange();
  const params = new URLSearchParams({
    db: "pubmed",
    term: SEARCH_TERM,
    retmax: "20",
    retmode: "json",
    sort: "date",
    mindate: minDate,
    maxdate: maxDate,
    datetype: "pdat",
  });

  const res = await fetch(`${ESEARCH_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`PubMed ESearch error: ${res.status}`);

  const data = await res.json();
  return data.esearchresult?.idlist || [];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchSummaries(ids: string[]): Promise<NewsArticle[]> {
  if (ids.length === 0) return [];

  const params = new URLSearchParams({
    db: "pubmed",
    id: ids.join(","),
    retmode: "json",
  });

  const res = await fetch(`${ESUMMARY_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`PubMed ESummary error: ${res.status}`);

  const data = await res.json();
  const result = data.result || {};

  return ids
    .filter((id) => result[id])
    .map((id) => {
      const article = result[id];
      const authors = (article.authors || []).map(
        (a: any) => a.name
      );
      const publishDate = article.pubdate || article.sortpubdate || "";
      const doi =
        (article.articleids || []).find((a: any) => a.idtype === "doi")
          ?.value || null;

      const pubTypes: string[] = article.pubtype || [];
      const articleType =
        pubTypes.find(
          (t: string) =>
            t !== "Journal Article" &&
            !t.includes("Research Support") &&
            !t.includes("English")
        ) ||
        pubTypes[0] ||
        "Article";

      return {
        pmid: id,
        title: article.title || "",
        authors: authors.slice(0, 3),
        authorCount: authors.length,
        journal: article.fulljournalname || article.source || "",
        publishDate,
        doi,
        pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        articleType,
      };
    });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const ids = await searchPubMed();
  return fetchSummaries(ids);
}

export function isRecentArticle(publishDate: string): boolean {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const pubDate = new Date(publishDate);
  return pubDate >= sevenDaysAgo;
}

export function formatPublishDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
