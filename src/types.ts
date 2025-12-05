export interface Book {
  id: string;
  title: string;
  authors: string[];
  fileType?: string;
  fileSize?: string;
  year?: number;
  language?: string;
  thumbnail?: string;
}

export interface DownloadUrls {
  ipfs?: string;
  libgenMirrors: string[];
}
