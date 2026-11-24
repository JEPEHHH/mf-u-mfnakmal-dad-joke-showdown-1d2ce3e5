import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JOKE_CANDIDATES, MAX_JOKE_CHARS, SELECTED_DAD_JOKE, validateJoke } from "../joke.ts";
import { DEFAULT_OUTPUT_PATH, resolveOutputPath } from "../main.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const mainPath = join(repoRoot, "main.ts");
const jokePath = join(repoRoot, "joke.ts");
const licensePath = join(repoRoot, "LICENSE");

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function runOnce(outFile: string): { bytes: Buffer; elapsedMs: number; stdout: string } {
  const start = performance.now();
  const stdout = execFileSync(process.execPath, [mainPath, "--out", outFile], {
    cwd: repoRoot,
    encoding: "utf8",
    timeout: 60_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const elapsedMs = performance.now() - start;
  const stat = lstatSync(outFile);
  assert.equal(stat.isFile(), true, "Output must be a plain regular file.");
  assert.equal(stat.isSymbolicLink(), false, "Output must not be a symbolic link.");
  const bytes = readFileSync(outFile);
  return { bytes, elapsedMs, stdout };
}

function verifyStaticRules(): void {
  assert.equal(DEFAULT_OUTPUT_PATH, "/output/entry.txt", "Default output path must be /output/entry.txt.");
  assert.equal(resolveOutputPath([]), "/output/entry.txt", "Empty argv must resolve to /output/entry.txt.");

  const licenseText = readFileSync(licensePath, "utf8");
  assert.match(licenseText, /SPDX-License-Identifier:\s*MIT/, "LICENSE must declare an OSI-approved MIT license.");

  const forbiddenPattern = /\b(fetch|http|https|net|dgram|tls|child_process|worker_threads)\b/;
  for (const srcPath of [mainPath, jokePath]) {
    const src = readFileSync(srcPath, "utf8");
    assert.equal(
      forbiddenPattern.test(src),
      false,
      `${srcPath} must not reference network or subprocess primitives.`,
    );
  }
}

function verifyValidationLogic(): void {
  assert.equal(validateJoke("").valid, false, "Empty string must fail validation.");
  assert.equal(validateJoke("   \t ").valid, false, "Whitespace-only string must fail validation.");
  assert.equal(validateJoke("a".repeat(MAX_JOKE_CHARS + 1)).valid, false, "Over-length string must fail validation.");
  assert.equal(validateJoke("Valid joke\n").valid, false, "Trailing newline must fail validation.");
  assert.equal(validateJoke(" Valid joke").valid, false, "Leading space must fail validation.");

  for (const candidate of JOKE_CANDIDATES) {
    const res = validateJoke(candidate.text);
    assert.equal(res.valid, true, `Candidate ${candidate.id} must be valid: ${res.reason ?? ""}`);
  }
}

function main(): void {
  verifyStaticRules();
  verifyValidationLogic();

  const workDir = mkdtempSync(join(tmpdir(), "dad-joke-verify-"));
  try {
    const run1Path = join(workDir, "run1", "entry.txt");
    const run2Path = join(workDir, "run2", "entry.txt");

    const r1 = runOnce(run1Path);
    const r2 = runOnce(run2Path);

    assert.equal(r1.stdout, "", "Run 1 should not emit stray stdout noise.");
    assert.equal(r2.stdout, "", "Run 2 should not emit stray stdout noise.");
    assert.ok(r1.elapsedMs < 5_000, `Run 1 too slow (${r1.elapsedMs.toFixed(1)} ms).`);
    assert.ok(r2.elapsedMs < 5_000, `Run 2 too slow (${r2.elapsedMs.toFixed(1)} ms).`);

    const hash1 = sha256(r1.bytes);
    const hash2 = sha256(r2.bytes);
    assert.equal(hash1, hash2, "Two runs must produce byte-identical outputs.");
    assert.equal(r1.bytes.equals(r2.bytes), true, "Output buffers must match byte for byte.");

    const decoder = new TextDecoder("utf-8", { fatal: true });
    const text = decoder.decode(r1.bytes);
    const check = validateJoke(text);
    assert.equal(check.valid, true, `Output failed joke validation: ${check.reason ?? ""}`);
    assert.equal(text, SELECTED_DAD_JOKE, "Output text must match SELECTED_DAD_JOKE.");

    const rssMb = process.memoryUsage().rss / (1024 * 1024);
    assert.ok(rssMb < 512, `Memory usage must stay well under 512 MB (got ${rssMb.toFixed(1)} MB).`);

    console.log(
      JSON.stringify(
        {
          ok: true,
          output: text,
          charLength: check.charLength,
          byteLength: check.byteLength,
          sha256: hash1,
          run1Ms: Number(r1.elapsedMs.toFixed(2)),
          run2Ms: Number(r2.elapsedMs.toFixed(2)),
          rssMb: Number(rssMb.toFixed(2)),
        },
        null,
        2,
      ),
    );
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

main();
