import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseSearchResults } from "../src/parsers/search.ts";

describe("Search HTML parsing", () => {
  const fixturePath = join(import.meta.dir, "fixtures", "search.html");
  const html = readFileSync(fixturePath, "utf8");
  const books = parseSearchResults(html);

  it("extracts all books from fixture", () => {
    expect(books).toBeArrayOfSize(8);
  });

  it("extracts valid MD5 IDs", () => {
    for (const book of books) {
      expect(book.id).toMatch(/^[a-f0-9]{32}$/);
    }
  });

  it("extracts titles", () => {
    expect(books[0]?.title).toBe("Docker for Rails Developers");
    expect(books[1]?.title).toBe("JavaScript Programming For Beginners");
  });

  it("parses single author", () => {
    expect(books[0]?.authors).toEqual(["Rob Isenberg"]);
  });

  it("parses LastName, FirstName format", () => {
    expect(books[1]?.authors).toEqual(["William Sullivan"]);
  });

  it("parses multiple authors with 'and'", () => {
    expect(books[2]?.authors).toEqual([
      "Ray Yao",
      "Ada R. Swift",
      "Ruby C. Perl",
    ]);
  });

  it("parses semicolon-separated authors", () => {
    expect(books[3]?.authors).toEqual(["Rahul Maurya", "Rahul Maurya"]);
  });

  it("handles bibliographic placeholder with publisher fallback", () => {
    expect(books[4]?.authors).toEqual(["SitePoint"]);
  });

  it("parses & separator", () => {
    expect(books[5]?.authors).toEqual([
      "W. Richard Stevens",
      "Stephen A. Rago",
    ]);
  });

  it("handles honorific in 3-part tuple", () => {
    expect(books[6]?.authors).toEqual(["St. John Chrysostom"]);
  });

  it("handles Cyrillic period-delimited format", () => {
    expect(books[7]?.authors).toEqual([
      "Sheila Pemberton",
      "И. Б. Соболева",
      "Val Biro",
    ]);
  });

  it("extracts file metadata", () => {
    expect(books[0]).toMatchObject({
      language: "en",
      fileType: "PDF",
      fileSize: "5.1MB",
      year: 2019,
    });
  });

  it("handles missing year", () => {
    const bookWithoutYear = books.find((b) => b.year === undefined);
    expect(bookWithoutYear).toBeDefined();
  });

  it("never returns empty authors array", () => {
    for (const book of books) {
      expect(book.authors.length).toBeGreaterThan(0);
    }
  });

  it("extracts language codes", () => {
    const englishBook = books.find((b) => b.language === "en");
    expect(englishBook).toBeDefined();

    const russianBook = books.find((b) => b.language === "ru");
    expect(russianBook).toBeDefined();
  });
});

describe("Search HTML edge cases", () => {
  it("returns empty array for no results", () => {
    const html = '<div class="js-aarecord-list-outer"></div>';
    expect(parseSearchResults(html)).toEqual([]);
  });

  it("skips books with missing required fields", () => {
    const html = `
      <div class="js-aarecord-list-outer">
        <div class="flex pt-3">
          <a href="/md5/abc123"></a>
        </div>
      </div>
    `;
    expect(parseSearchResults(html)).toEqual([]);
  });

  it("handles malformed HTML gracefully", () => {
    const html = "<div>Not even the right structure</div>";
    expect(parseSearchResults(html)).toEqual([]);
  });
});
