export const MAX_JOKE_CHARS = 200;

export interface JokeValidationResult {
  valid: boolean;
  charLength: number;
  byteLength: number;
  reason?: string;
}

export interface JokeCandidate {
  id: string;
  text: string;
  notes: string;
}

export const JOKE_CANDIDATES: readonly JokeCandidate[] = [
  {
    id: "colander-water",
    text: "I made a case for buying a new colander, but my wife said it didn't hold water.",
    notes: "Winner: clean double meaning on 'hold water' and double-antecedent 'it', fresh, warm dinner-table rhythm.",
  },
  {
    id: "scale-weigh-in",
    text: "We couldn't agree on which bathroom scale to buy, so I decided to weigh in.",
    notes: "Runner-up: tight and clean pun on 'weigh in', slightly less physical groan than colander.",
  },
  {
    id: "round-table-corners",
    text: "I hired a carpenter to build a round dining table, and I'm pretty sure he cut corners.",
    notes: "Strong third: fresh and clever, slight literal stretch since cutting corners produces an octagon.",
  },
  {
    id: "parking-lot-line",
    text: 'I asked the guy painting the parking lot why he stopped halfway. He said, "You have to draw the line somewhere."',
    notes: "Fourth: longer two-sentence dialogue and slightly looser logic on stopping halfway.",
  },
];

export const SELECTED_DAD_JOKE = JOKE_CANDIDATES[0].text;

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
  if (text !== text.trim()) {
    return {
      valid: false,
      charLength,
      byteLength,
      reason: "Joke must not contain leading or trailing whitespace.",
    };
  }
  if (/[\r\n\t\0]/.test(text)) {
    return {
      valid: false,
      charLength,
      byteLength,
      reason: "Joke must be a single line without control characters.",
    };
  }
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    return {
      valid: false,
      charLength,
      byteLength,
      reason: "Joke must be valid UTF-8 without unpaired surrogates.",
    };
  }
  return { valid: true, charLength, byteLength };
}

export function getValidatedEntry(): string {
  const check = validateJoke(SELECTED_DAD_JOKE);
  if (!check.valid) {
    throw new Error(`Invalid dad joke entry: ${check.reason}`);
  }
  return SELECTED_DAD_JOKE;
}
