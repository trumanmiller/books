import { load } from "cheerio";

const LIBGEN_BASE = "https://libgen.li";

export function parseIpfsUrl(html: string): string | null {
  const $ = load(html);
  const ipfsLink = $('a[title*="IPFS"] span.badge:contains("IPFS.io")').parent().attr("href");
  return ipfsLink || null;
}

export function parseAdsPhpUrl(html: string): string | null {
  const $ = load(html);
  const adsLink = $('a[href*="ads.php"]').attr("href");
  if (!adsLink) return null;
  return adsLink.startsWith("http") ? adsLink : `${LIBGEN_BASE}${adsLink}`;
}

export function parseGetPhpUrl(html: string): string | null {
  const $ = load(html);
  const getLink = $('a[href*="get.php"]').attr("href");
  if (!getLink) return null;
  return getLink.startsWith("http") ? getLink : `${LIBGEN_BASE}/${getLink}`;
}
