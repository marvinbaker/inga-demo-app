import { Suspense } from "react";
import { fetchNewsArticles } from "@/lib/api/pubmed";
import NewsHero from "@/components/news/NewsHero";
import NewsCard from "@/components/news/NewsCard";

export const revalidate = 86400; // 24 hours

async function NewsContent() {
  const articles = await fetchNewsArticles();

  if (articles.length === 0) {
    return (
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
          />
        </svg>
        <p className="mt-3 text-sm text-gray-500">
          No recent research articles found. Check back soon.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <>
      <NewsHero article={featured} />

      {rest.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-navy-800 mb-4">
            More Research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((article) => (
              <NewsCard key={article.pmid} article={article} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function NewsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gray-100 p-8 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded-full mb-3" />
        <div className="h-7 w-3/4 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-gray-100 p-5 animate-pulse"
          >
            <div className="h-3 w-16 bg-gray-200 rounded-full mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-navy-800 mb-1">
          Research News
        </h1>
        <p className="text-sm text-gray-500">
          Latest ER+/HER2- breast cancer research from PubMed, updated daily
        </p>
      </div>

      <Suspense fallback={<NewsLoading />}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
