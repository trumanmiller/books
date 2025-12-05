import { fetchHtml, fetchJson } from "./http.ts";
import { parseLibgenMirrors, extractIpfsCidFromMetadata } from "./parsers/download.ts";
import type { DownloadUrls } from "./types.ts";

const ANNAS_ARCHIVE_BASE = "https://annas-archive.org";
const LIBGEN_BASE = "http://libgen.li";
const IPFS_GATEWAY = "https://gateway.ipfs.io/ipfs";

export async function getDownloadUrls(bookId: string): Promise<DownloadUrls> {
  if (!bookId?.trim()) {
    throw new TypeError("Book ID cannot be empty");
  }

  const result: DownloadUrls = {
    libgenMirrors: [],
  };

  try {
    const metadataUrl = `${ANNAS_ARCHIVE_BASE}/dyn/small_file/md5/${bookId}`;
    const metadata = await fetchJson(metadataUrl);
    const ipfsCid = extractIpfsCidFromMetadata(metadata);

    if (ipfsCid) {
      result.ipfs = `${IPFS_GATEWAY}/${ipfsCid}`;
    }
  } catch {
    // IPFS not available, continue to Libgen mirrors
  }

  try {
    const libgenUrl = `${LIBGEN_BASE}/library.php?md5=${bookId}`;
    const libgenHtml = await fetchHtml(libgenUrl);
    const mirrors = parseLibgenMirrors(libgenHtml);

    result.libgenMirrors = mirrors;
  } catch {
    // Libgen mirrors not available
  }

  return result;
}
