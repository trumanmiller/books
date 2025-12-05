import { type } from 'arktype';

export const BookSchema = type({
  id: 'string',
  title: 'string',
  authors: 'string[]',
  'fileType?': 'string',
  'fileSize?': 'string',
  'year?': 'number',
  'language?': 'string',
  'thumbnail?': 'string',
});

export type Book = typeof BookSchema.infer;

export interface SearchOptions {
  fileType?: string;
  language?: string;
  limit?: number;
}

export interface DownloadUrls {
  ipfs?: string;
  mirrors: string[];
}
