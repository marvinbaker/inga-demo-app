import { NewsArticle } from "@/lib/types/news";
import { isRecentArticle, formatPublishDate } from "@/lib/api/pubmed";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const isNew = isRecentArticle(article.publishDate);

  return (
    <a
      href={article.pubmedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600">
          {article.articleType}
        </span>
        {isNew && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            New
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-navy-800 leading-snug mb-2 group-hover:text-accent-500 transition-colors line-clamp-3">
        {article.title}
      </h3>

      <p className="text-xs text-gray-500 mb-1">
        {article.authors.join(", ")}
        {article.authorCount > 3 && " et al."}
      </p>

      <p className="text-xs text-gray-400">
        <span className="font-medium">{article.journal}</span>
        {" \u00B7 "}
        {formatPublishDate(article.publishDate)}
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-500 group-hover:text-accent-600">
        Read on PubMed
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}
