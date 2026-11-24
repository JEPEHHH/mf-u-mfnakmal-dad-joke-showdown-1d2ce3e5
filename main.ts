import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { getValidatedEntry } from "./joke.ts";

export const DEFAULT_OUTPUT_PATH = "/output/entry.txt";

export function resolveOutputPath(argv: readonly string[]): string {
  const outFlagIndex = argv.indexOf("--out");
  if (outFlagIndex !== -1) {
    const candidate = argv[outFlagIndex + 1];
    if (!candidate) {
      throw new Error("Missing path after --out.");
    }
    return candidate;
  }
  return DEFAULT_OUTPUT_PATH;
}

export function writeEntry(outputPath: string = DEFAULT_OUTPUT_PATH): {
  outputPath: string;
  charLength: number;
  byteLength: number;
} {
  const entry = getValidatedEntry();
  mkdirSync(dirname(outputPath), { recursive: true, mode: 0o755 });
  writeFileSync(outputPath, entry, { encoding: "utf8", mode: 0o644 });
  return {
    outputPath,
    charLength: Array.from(entry).length,
    byteLength: Buffer.byteLength(entry, "utf8"),
  };
}

if (import.meta.main) {
  writeEntry(resolveOutputPath(process.argv.slice(2)));
}
