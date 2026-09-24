export interface RSSSource {
  id: string;
  name: string;
  category: string;
  url: string;
  enabled?: boolean;
}

export interface RawRSSItem {
  guid?: string;
  id?: string;
  title?: string;
  link?: string;
  description?: string;
  summary?: string;
  content?: string;
  contentSnippet?: string;
  contentEncoded?: string;
  'content:encoded'?: string;
  pubDate?: string;
  isoDate?: string;
  enclosure?: {
    url?: string;
    type?: string;
    length?: string;
    $?: {
      url?: string;
    };
  };
  mediaContent?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
  'media:content'?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
}

export interface ParsedNewsItem {
  guid: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  sourceLink: string;
  sourceName: string;
  category: string;
  rawImageUrl: string | null;
  publishedAt: string;
}

export interface INewsArticle {
  id: string;
  guid: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  sourceLink: string;
  sourceName: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SyncNewsResult {
  success: boolean;
  message: string;
  timestamp: string;
  stats: {
    totalSourcesChecked: number;
    totalFeedsFetched: number;
    newArticlesAdded: number;
    duplicatesSkipped: number;
    imagesDownloaded: number;
    failedImages: number;
  };
  sources: {
    sourceName: string;
    fetched: number;
    added: number;
    error?: string;
  }[];
}
