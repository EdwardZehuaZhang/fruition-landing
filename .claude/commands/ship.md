---
description: Commit, PR, and squash-merge the current branch into production once CI passes
allowed-tools: Bash, Read, Glob, Grep
---

Ship the current branch to `production`.

$ARGUMENTS

Steps:

1. Run `git status --short` and `git diff` (plus `git diff --cached`) to see everything that would ship. Read enough of the changed files to know what the change actually does.
2. Sanity-check before shipping. Stop and tell the user instead of shipping if you see:
   - debug leftovers (`console.log`, `debugger`, commented-out blocks left behind)
   - secrets, tokens, or `.env` values in the diff
   - unrelated work mixed in — this repo squash-merges, so one PR should be one change
   - the change is obviously incomplete or was mid-edit
3. Write a commit message: a `type(scope): summary` subject under ~72 chars, then a body explaining *why*, not just what. If the user passed a message in `$ARGUMENTS`, use it.
4. Run the script with that message:

   ```bash
   .claude/scripts/ship.sh "type(scope): summary"
   ```

   Use `.claude/scripts/ship.sh --no-commit` if the branch is already committed.

5. The script pushes, opens the PR, waits for Lint / Typecheck / Preview deploy, and squash-merges only if they all pass. If it exits non-zero, **nothing was merged** — report which check failed and offer to fix it. Do not retry blindly and do not merge by hand to work around a red check.

Notes:
- The script refuses to run on `production` itself. If the user is on `production`, create a branch first.
- Merging to `production` deploys to the live site. If the diff looks risky and the user has not clearly asked to ship it, ask before running the script.
