import type { Book, SearchOptions } from './types.ts';
import { ANNAS_ARCHIVE_BASE, USER_AGENT } from './constants.ts';
import { createNetworkError } from './errors.ts';
import { parseSearchResults } from './parsers/search-page.ts';

export async function searchBooks(
  query: string,
  options: SearchOptions = {},
): Promise<Book[]> {
  if (!query?.trim()) {
    throw new TypeError('Query cannot be empty');
  }

  const url = buildSearchUrl(query, options);
  const html = await fetchHtml(url);
  
  return parseSearchResults(html, options.limit);
}

function buildSearchUrl(query: string, options: SearchOptions): string {
  const params = new URLSearchParams({ q: query });
  
  if (options.fileType) {
    params.set('ext', options.fileType);
  }
  
  if (options.language) {
    params.set('lang', options.language);
  }
  
  return `${ANNAS_ARCHIVE_BASE}/search?${params}`;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw createNetworkError(response.status, url);
  }

  return response.text();
}
