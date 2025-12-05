import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { parseSearchResults } from "../src/parsers/search.ts";
import type { Book } from "../src/types.ts";

describe("Book search parser", () => {
  const fixturePath = join(import.meta.dir, "fixtures", "search.html");
  const html = readFileSync(fixturePath, "utf8");
  const books = parseSearchResults(html);

  const expected: Book[] = [
    {
      id: "655f86a6f99a3dee5e0ce409c4a6dfdc",
      title:
        "Docker for Rails Developers: Build, Ship, and Run Your Applications Everywhere",
      authors: ["Rob Isenberg"],
      language: "en",
      fileType: "PDF",
      fileSize: "5.1MB",
      year: 2019,
      thumbnail: "https://example.com/thumb.jpg",
    },
    {
      id: "7c28ff2ffa73af8c06a170e1d190a408",
      title: "Javascript: Javascript Programming For Absolute Beginners",
      authors: ["William Sullivan"],
      language: "en",
      fileType: "LIT",
      fileSize: "0.3MB",
      year: 2017,
      thumbnail: "https://example.com/thumb2.jpg",
    },
    {
      id: "5f42c8fcb4d4178fab9f9a6aafd7effc",
      title: "Easy Learning Data Structures & Algorithms ES6+Javascript",
      authors: ["Yang Hu"],
      language: "en",
      fileType: "EPUB",
      fileSize: "13.7MB",
      year: 2019,
      thumbnail: "https://example.com/thumb3.jpg",
    },
    {
      id: "448a65ee05782afd982ababcdfb155be",
      title: "JavaScript-mancy: Object-Oriented Programming",
      authors: ["Jaime González García", "Artur Mizera"],
      language: "en",
      fileType: "EPUB",
      fileSize: "0.6MB",
      thumbnail: "https://example.com/thumb4.jpg",
    },
    {
      id: "a792f314180a972852f61e313eaaf30d",
      title: "JavaScript In 8 Hours: For Beginners, Learn JavaScript Fast!",
      authors: ["Ray Yao", "Ada R. Swift", "Ruby C. Perl"],
      language: "en",
      fileType: "AZW3",
      fileSize: "0.2MB",
      year: 2015,
      thumbnail: "https://example.com/thumb5.jpg",
    },
    {
      id: "f992f5acc7a903314912f74ed2a46afd",
      title: "JavaScript Programming : Beginner to Professional",
      authors: ["Rahul Maurya", "Rahul Maurya"],
      language: "en",
      fileType: "EPUB",
      fileSize: "0.9MB",
      year: 2020,
      thumbnail: "https://example.com/thumb6.jpg",
    },
    {
      id: "61a6978c57cded15361cc505c627c0a2",
      title: "JavaScript: Best Practice",
      authors: ["Coll."],
      language: "en",
      fileType: "EPUB",
      fileSize: "0.3MB",
      year: 2018,
      thumbnail: "https://example.com/thumb7.jpg",
    },
    {
      id: "b84f2227e629e30522f543196cc0e0e7",
      title: "Python Programming & Javascript",
      authors: ["Lina Polly"],
      language: "en",
      fileType: "PDF",
      fileSize: "0.4MB",
      thumbnail: "https://example.com/thumb8.jpg",
    },
  ];

  it("parses all books with correct structure", () => {
    expect(books).toEqual(expected);
  });

  it("extracts valid MD5 IDs", () => {
    for (const book of books) {
      expect(book.id).toMatch(/^[a-f0-9]{32}$/);
    }
  });

  it("never returns empty authors", () => {
    for (const book of books) {
      expect(book.authors.length).toBeGreaterThan(0);
    }
  });
});
