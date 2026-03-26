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
      className="group block bg-gradient-to-br from-navy-50 to-accent-400/10 rounded-2xl border border-navy-100 p-6 md:p-8 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center rounded-full bg-navy-600 px-3 py-1 text-xs font-medium text-white">
          Featured
        </span>
        <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-navy-600">
          {article.articleType}
        </span>
        {isNew && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            New
          </span>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-navy-800 leading-tight mb-3 group-hover:text-accent-600 transition-colors">
        {article.title}
      </h2>

      <p className="text-sm text-gray-600 mb-2">
        {article.authors.join(", ")}
        {article.authorCount > 3 && " et al."}
      </p>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="font-medium">{article.journal}</span>
        <span>{formatPublishDate(article.publishDate)}</span>
        {article.doi && (
          <span className="text-xs text-gray-400">DOI: {article.doi}</span>
        )}
      </div>

      <div className="mt-5">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy-600 px-5 py-2.5 text-sm font-medium text-white group-hover:bg-navy-700 transition-colors">
          Read on PubMed
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>
    </a>
  );
}
