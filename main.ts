import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { SELECTED_DAD_JOKE, validateJoke } from "./joke.ts";

export const DEFAULT_OUTPUT_PATH = "/output/entry.txt";

export function writeEntry(outputPath: string = DEFAULT_OUTPUT_PATH): void {
  const check = validateJoke(SELECTED_DAD_JOKE);
  if (!check.valid) {
    throw new Error(`Invalid dad joke entry: ${check.reason}`);
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, SELECTED_DAD_JOKE, { encoding: "utf8" });
}

if (import.meta.main) {
  writeEntry(DEFAULT_OUTPUT_PATH);
}
