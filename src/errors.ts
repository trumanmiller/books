export class AnnasArchiveError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "AnnasArchiveError";
  }
}

export function createNetworkError(
  status: number,
  url: string,
): AnnasArchiveError {
  const retryable = status === 429 || status >= 500;
  const message = status === 429
      ? "Rate limited - wait before retrying"
      : `HTTP ${status} - ${url}`;

  return new AnnasArchiveError(message, `HTTP_${status}`, retryable);
}

export function createParseError(message: string): AnnasArchiveError {
  return new AnnasArchiveError(message, "PARSE_ERROR", false);
}
