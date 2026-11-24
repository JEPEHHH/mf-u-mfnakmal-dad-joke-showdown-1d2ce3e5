export const MAX_JOKE_CHARS = 200;

export interface JokeValidationResult {
  valid: boolean;
  charLength: number;
  byteLength: number;
  reason?: string;
}

// Initial placeholder; will be replaced after pairwise dad joke selection in Milestone 2.
export const SELECTED_DAD_JOKE = "I told my carpenter his shelves were crooked, but he swore they were on the level.";

export function validateJoke(text: string): JokeValidationResult {
  const charLength = Array.from(text).length;
  const byteLength = Buffer.byteLength(text, "utf8");

  if (charLength < 1 || text.trim().length === 0) {
    return { valid: false, charLength, byteLength, reason: "Joke must not be empty or whitespace-only." };
  }
  if (charLength > MAX_JOKE_CHARS) {
    return {
      valid: false,
      charLength,
      byteLength,
      reason: `Joke exceeds ${MAX_JOKE_CHARS} characters (${charLength}).`,
    };
  }
  return { valid: true, charLength, byteLength };
}
