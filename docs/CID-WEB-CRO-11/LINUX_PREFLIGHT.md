# CRO-11 — clean Linux preflight

**UNTESTED / NOT EXECUTED ON LINUX.** [Environment evidence](evidence/environment.json), 20 November 2026: Windows x64, Node 24.21.0, npm 11.19.0. `wsl --status` exits 50 and `wsl --list --verbose` exits 1: WSL is not installed. Docker/Podman are absent from PATH and checked installation locations. No authorised existing remote Linux host was available. No OS installation, new cloud resource, workflow change or GitHub Pages dispatch was attempted.

A fresh **Windows** locked install/check/build passes; all 48 files match CRO-10 exactly. Plain verify fails solely on the known CRLF SiteInteractions source/HTML comparison. The unchanged in-memory [CRO-06 wrapper](../CID-WEB-CRO-06/qa/verify-baseline.mjs) passes every original assertion. [Both real results](evidence/windows-command-results.json). This is not a Linux pass. CRO-09's LF archive/plain Windows verifier result remains useful historical evidence, but does not prove Linux native image processing.

## Minimal unpublished procedure

Run in an existing isolated **Linux x64 / Node 24** environment with Git/npm access. Use a fresh directory and keep logs outside the checkout. These commands are an unapplied procedure, not a workflow or deployment. No push is involved.

```bash
set -euo pipefail
test "$(uname -s)" = Linux
node -e 'if (process.platform !== "linux" || process.versions.node.split(".")[0] !== "24") process.exit(1)'
task_dir=$(mktemp -d)
git -c core.autocrlf=false clone --no-checkout https://github.com/PeteColley/catchid-web.git "$task_dir/candidate"
cd "$task_dir/candidate"
git -c core.autocrlf=false checkout --detach 537dbc0945452ed66dbd74ef4400a1d04db31c9c
test "$(git rev-parse HEAD)" = 537dbc0945452ed66dbd74ef4400a1d04db31c9c
export ASTRO_TELEMETRY_DISABLED=1
{
  date -u
  uname -a
  node -p 'JSON.stringify(process.versions)'
  npm --version
  git rev-parse HEAD HEAD:package-lock.json
  sha256sum package-lock.json
  npm ci
  npm run check
  npm run build
  npm run verify
  git diff --check
  git diff --exit-code
  test "$(find dist -type f -name '*.html' | wc -l)" -eq 2
  test -f dist/index.html
  test -f dist/fishing-journal-app/index.html
  find dist -type f -print0 | sort -z | xargs -0 sha256sum
  git status --short
} 2>&1 | tee "$task_dir/linux-preflight.log"
```

The pinned CRO-10 commit is the exact implementation approved by Pete. CRO-11 contains documentation/evidence only; [scope proof](evidence/scope.json) establishes identical implementation and lockfile. Before a later publication, verify that the final publication candidate still has no production diff from this pin. If code/lock/workflow changes, build and review that new exact candidate rather than treating this procedure as permanent approval.

The **unmodified verifier** covers two-page structure, metadata/canonicals/sitemap/robots/CNAME, honest claims and image provenance/derivatives, two official badges per route, attribution, dependency restrictions and preserved consent source. Inspect the generated manifest/artifact for only intended files/local images and no concept imagery or diagnostics. Native image encoders can produce platform-specific bytes; investigate differences, do not demand unexplained binary identity or overlook them. Browser privacy/interaction assertions are separately supported by CRO-10/11 and are not claimed to run merely because `npm run verify` passes.

Keep the complete command exit status/log, source/lock hashes, Node/npm versions and generated artifact manifest. A fresh read-only `npm audit --json` may document changed advisories at publication time; do not use `audit fix` or modify the lock. Review the actual CI Node patch version and retained [toolchain maintenance findings](../CID-WEB-CRO-09/SECURITY_PRIVACY.md).

**Condition before publication:** one successful unpublished Linux preflight. No confirmed Linux defect is inferred from its present unavailability. Do not run the Pages deployment workflow to discover whether this build works.
