import { selectStrategy } from "./strategies.ts";
import { applyTransforms, removeBrackets } from "./transforms.ts";
import { applyPublisherFallback } from "./special-cases.ts";

export function parseAuthors(authorText: string, publisherFallback?: string): string[] {
  if (!authorText.trim()) return [];

  // Clean brackets first (they interfere with comma detection)
  const cleaned = removeBrackets(authorText);

  const strategy = selectStrategy(cleaned);
  const rawAuthors = strategy.split(cleaned);

  const processed = rawAuthors
    .map((author) => applyTransforms(author))
    .filter((author) => author.length > 0);

  return applyPublisherFallback(processed, publisherFallback);
}
