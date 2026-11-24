# Dad Joke Showdown Entry

[![Dad Joke Showdown on make.fun](https://make.fun/badge/u-mfnakmal-dad-joke-showdown-1d2ce3e5.svg)](https://make.fun/c/u-mfnakmal-dad-joke-showdown-1d2ce3e5)

Deterministic `node22` (`program/v1`) entry for the **Dad Joke Showdown** (`u-mfnakmal-dad-joke-showdown-1d2ce3e5`) competition on [make.fun](https://make.fun/c/u-mfnakmal-dad-joke-showdown-1d2ce3e5).

## Entry Output

Running `node main.ts` writes a single UTF-8 dad joke (79 characters / 79 bytes, no trailing newline or noise) to `/output/entry.txt`:

> I made a case for buying a new colander, but my wife said it didn't hold water.

## Repository Structure

- `main.ts` — `node22` entrypoint that validates and writes `/output/entry.txt` deterministically (supports `--out <path>` for local testing).
- `joke.ts` — Final selected dad joke, pairwise candidate notes, and strict UTF-8 / length / formatting validator.
- `scripts/verify.ts` — Local verification suite testing 2x deterministic execution, UTF-8 validity, byte/character limits, file permissions, and sandbox constraints.
- `LICENSE` — OSI-approved MIT License (`SPDX-License-Identifier: MIT`).

## Local Verification

Run the verification script with Node 22.18+:

```bash
node scripts/verify.ts
```

To test writing the output to a custom local path:

```bash
node main.ts --out /tmp/entry.txt
```

## GitHub Submission Badges

If submitting via a public GitHub repository, add the repository-specific live badges to the top of this README with your actual GitHub owner and repository name, and set GitHub About (`website` on `make.fun` and topic `makefun`):

```markdown
[![Rank](https://make.fun/badge/u-mfnakmal-dad-joke-showdown-1d2ce3e5/OWNER/REPO/rank.svg)](https://make.fun/c/u-mfnakmal-dad-joke-showdown-1d2ce3e5)
[![Reward](https://make.fun/badge/u-mfnakmal-dad-joke-showdown-1d2ce3e5/OWNER/REPO/reward.svg)](https://make.fun/c/u-mfnakmal-dad-joke-showdown-1d2ce3e5)
```
