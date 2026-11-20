# CRO-09 — separately authorised publication process

**UNAPPLIED. NO-GO currently.** These are future instructions, not permission to execute. Pete alone authorises publication after ChatGPT reviews the evidence. Current known-good website main is `42c997c13712a432c8e2384915aaa010a16d068b`; verify it again at the time, rather than assuming it remains current.

## 1. Close readiness and freeze the exact candidate

- Close G3/G6/G7/G10 in [the gate matrix](READINESS_REPORT.md): historical asset evidence/acceptance, focus contrast, actual manual acceptance and stale linked-policy release wording. Make only separately authorised corrections in their appropriate repository; this audit branch contains no fixes.
- Record Pete's final photo/brand use and Production-evidence decisions. Keep the cloud-disabled capture qualification. Preserve the approved design and exactly two official badges per route.
- Fetch safely, inspect worktrees/untracked/ignored/upstream state, and record the exact final **implementation SHA**, current **production-before SHA**, diff and release scope. No reset/clean/rebase/force push. Do not publish the audit branch merely because it was pushed.
- In an isolated unpublished Linux/Node 24 environment, record actual Node/npm/embedded Undici versions. Run locked `npm ci`, `npm run check`, `npm run build`, **plain** `npm run verify` and `git diff --check`. Confirm no lock drift. Fresh audit/registry integrity review; assess the documented Astro/runtime findings against that exact tree. Do not use deployment as the first Linux test.
- Inspect the built artifact: two intended HTML pages, correct canonicals/sitemap/robots/CNAME, local optimised images, no concept art/diagnostics/secrets, no pre-consent external requests, preserved attribution/consent. Bind artifact SHA-256 and image/source evidence to the candidate. Retain the known-good production artifact/tree and record a practical rollback owner.

## 2. Explicit publication approval and controlled integration

- Present the closed gate matrix, remaining accepted low-risk limitations, exact candidate SHA, production-before SHA, artifact evidence and rollback target to Pete. Obtain explicit approval to publish **that SHA** to `catchid.app` via the existing workflow. Visual approval or this audit is insufficient.
- Recheck remote heads immediately before the authorised operation. If main/candidate changed, stop and reconcile/review; do not overwrite or opportunistically combine unrelated work.
- Use the separately approved normal integration/PR process. A push to main already triggers deployment; **do not also invoke workflow_dispatch**. No workflow, Pages, DNS, domain, Android, Play or backend change is part of this website publication.
- Verify the workflow run is for the intended commit, all build/check/verify steps pass, the uploaded artifact matches the reviewed output, and the deploy job succeeds. If anything differs or fails, do not bypass the guard or repeat unreviewed actions.

## 3. Verify publication and keep rollback ready

- After the authorised deployment only: read back both live routes, TLS/canonical/sitemap/robots, hero/new screenshot assets and versions. Test a clean first visit and saved rejection for zero analytics requests; equal consent choices, withdrawal, menu/FAQ/focus, two badges and correct Play URLs. Coordinate any accepted live measurement test so it does not pollute reporting or make test installs.
- Record the live deployed SHA, Actions run/artifact IDs, UTC time, results and Pete's acceptance. A deployment success alone is not product acceptance. No release announcement/outreach is implied.
- If a material regression appears, stop promotional use and notify Pete. Under the separately agreed rollback authority, prepare a **normal revert/restoration commit** that restores the recorded production-before implementation tree, preserving history. Review its exact diff and rerun the same checks. Push through the authorised main process once, then verify the restored live pages and deployed SHA. Never reset/force-push main or alter DNS to improvise rollback. If rollback authority was not granted, obtain it before the consequential action.

The minimal release record therefore contains: approval, exact before/after commit SHAs, gate decisions, clean Linux build evidence, reviewed artifact hashes, deployment/run receipt, live verification and a tested/identified rollback target. **None of the publication steps above was performed in CRO-09.**
