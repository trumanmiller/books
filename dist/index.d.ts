interface Book {
	id: string;
	title: string;
	authors: string[];
	fileType?: string;
	fileSize?: string;
	year?: number;
	language?: string;
	thumbnail?: string;
}
interface DownloadUrls {
	ipfs?: string;
	libgenMirrors: string[];
}
declare function searchBooks(query: string): Promise<Book[]>;
declare function getDownloadUrls(bookId: string): Promise<DownloadUrls>;
declare class AnnasArchiveError extends Error {
	readonly statusCode: number;
	constructor(message: string, statusCode: number);
}
export { searchBooks, getDownloadUrls, DownloadUrls, Book, AnnasArchiveError };
