import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseIpfsUrl,
  parseAdsPhpUrl,
  parseGetPhpUrl,
} from "../src/parsers/download.ts";

describe("parseIpfsUrl", () => {
  const fixturePath = join(import.meta.dir, "fixtures", "libgen.html");
  const html = readFileSync(fixturePath, "utf8");

  it("extracts IPFS.io link from real fixture", () => {
    const url = parseIpfsUrl(html);
    expect(url).toStartWith("https://gateway.ipfs.io/ipfs/");
    expect(url).toContain("?filename=");
  });

  it("returns null when no IPFS link found", () => {
    expect(parseIpfsUrl("<div>No IPFS here</div>")).toBe(null);
  });

  it("returns null for empty HTML", () => {
    expect(parseIpfsUrl("")).toBe(null);
  });

  it("ignores non-IPFS.io badges", () => {
    const html = `
      <a title="IPFS cloudflare" href="https://cloudflare-ipfs.com/test">
        <span class="badge">IPFS cloudflare</span>
      </a>
    `;
    expect(parseIpfsUrl(html)).toBe(null);
  });
});

describe("parseAdsPhpUrl", () => {
  const fixturePath = join(import.meta.dir, "fixtures", "libgen.html");
  const html = readFileSync(fixturePath, "utf8");

  it("extracts ads.php link from real fixture", () => {
    const url = parseAdsPhpUrl(html);
    expect(url).toContain("ads.php?md5=");
  });

  it("converts relative URLs to absolute", () => {
    const html = '<a href="/ads.php?md5=abc123">Download</a>';
    expect(parseAdsPhpUrl(html)).toBe("https://libgen.li/ads.php?md5=abc123");
  });

  it("preserves absolute URLs", () => {
    const html = '<a href="https://libgen.li/ads.php?md5=abc123">Download</a>';
    expect(parseAdsPhpUrl(html)).toBe("https://libgen.li/ads.php?md5=abc123");
  });

  it("returns null when no ads.php link found", () => {
    expect(parseAdsPhpUrl("<div>No ads.php here</div>")).toBe(null);
  });

  it("returns null for empty HTML", () => {
    expect(parseAdsPhpUrl("")).toBe(null);
  });
});

describe("parseGetPhpUrl", () => {
  const fixturePath = join(import.meta.dir, "fixtures", "libgen-ads.html");
  const html = readFileSync(fixturePath, "utf8");

  it("extracts get.php link from real fixture", () => {
    const url = parseGetPhpUrl(html);
    expect(url).toContain("get.php?md5=");
    expect(url).toContain("&key=");
  });

  it("converts relative URLs to absolute", () => {
    const html = '<a href="get.php?md5=abc123&key=KEY123">GET</a>';
    expect(parseGetPhpUrl(html)).toBe(
      "https://libgen.li/get.php?md5=abc123&key=KEY123",
    );
  });

  it("preserves absolute URLs", () => {
    const html =
      '<a href="https://libgen.li/get.php?md5=abc123&key=KEY123">GET</a>';
    expect(parseGetPhpUrl(html)).toBe(
      "https://libgen.li/get.php?md5=abc123&key=KEY123",
    );
  });

  it("returns null when no get.php link found", () => {
    expect(parseGetPhpUrl("<div>No get.php here</div>")).toBe(null);
  });

  it("returns null for empty HTML", () => {
    expect(parseGetPhpUrl("")).toBe(null);
  });
});
