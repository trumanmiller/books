import { fetchHtml } from "./http.ts";
import { parseIpfsUrl, parseAdsPhpUrl, parseGetPhpUrl } from "./parsers/download.ts";
import type { DownloadUrls } from "./types.ts";

const LIBGEN_BASE = "https://libgen.li";

export async function getDownloadUrls(bookId: string): Promise<DownloadUrls> {
  if (!bookId?.trim()) {
    throw new TypeError("Book ID cannot be empty");
  }

  const result: DownloadUrls = {
    libgenMirrors: [],
  };

  const filePhpUrl = `${LIBGEN_BASE}/file.php?md5=${bookId}`;
  const fileHtml = await fetchHtml(filePhpUrl);

  const ipfsUrl = parseIpfsUrl(fileHtml);
  if (ipfsUrl) {
    result.ipfs = ipfsUrl;
  }

  const adsPhpUrl = parseAdsPhpUrl(fileHtml);
  if (adsPhpUrl) {
    const adsHtml = await fetchHtml(adsPhpUrl);
    const getPhpUrl = parseGetPhpUrl(adsHtml);
    if (getPhpUrl) {
      result.libgenMirrors = [getPhpUrl];
    }
  }

  return result;
}
