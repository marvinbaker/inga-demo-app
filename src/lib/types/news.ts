export interface NewsArticle {
  pmid: string;
  title: string;
  authors: string[];
  authorCount: number;
  journal: string;
  publishDate: string;
  doi: string | null;
  pubmedUrl: string;
  articleType: string;
}
