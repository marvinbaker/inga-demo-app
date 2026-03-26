import { NewsArticle } from "@/lib/types/news";
import { formatPublishDate, isRecentArticle } from "@/lib/api/pubmed";

interface NewsHeroProps {
  article: NewsArticle;
}

export default function NewsHero({ article }: NewsHeroProps) {
  const isNew = isRecentArticle(article.publishDate);

  return (
    <a
      href={article.pubmedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-gray-200 hover:border-accent-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
            Featured Analysis
          </span>
          <span className="inline-flex items-center rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {article.articleType}
          </span>
          {isNew && (
            <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              New
            </span>
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-navy-800 leading-tight mb-3 group-hover:text-accent-500 transition-colors">
          {article.title}
        </h2>

        <p className="text-sm text-gray-500 mb-1">
          {article.authors.join(", ")}
          {article.authorCount > 3 && " et al."}
        </p>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="font-medium text-gray-600">{article.journal}</span>
          <span>{formatPublishDate(article.publishDate)}</span>
          {article.doi && (
            <span className="text-xs">DOI: {article.doi}</span>
          )}
        </div>

        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-500 group-hover:text-accent-600 uppercase tracking-wide">
            Read Full Report
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
