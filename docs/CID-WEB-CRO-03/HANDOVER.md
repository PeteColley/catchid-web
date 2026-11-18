# CID-WEB-CRO-03A — final visual polish

**DESIGN ONLY — NOT LIVE · 18 November 2026**

The approved CRO-03 direction is preserved. Three refinements are ready for review:

1. **Earlier product proof:** compact mobile opening and equal bottom consent choices bring a real saved catch into the 390 × 844 first view. The official badge is 75.5px earlier; its artwork and size are unchanged.
2. **Brighter atmosphere:** raised mobile fish crop beside the journal at full opacity, clear of body text. Concept-art label retained; no publication rights inferred.
3. **Less repetition:** Home’s second Journal phone becomes a genuine saved-record excerpt. Journal appears once. Manual-entry proof, Insights, optional ID, seven sections and the distinct landing-page purpose remain.

## Review

- [Offline gallery](index.html) — open directly; no npm/server needed.
- [Before/after visual review](VISUAL_REVIEW.md)
- [QA](QA.md) · [Capture index](CRO03A_CAPTURE_INDEX.md) · [Provenance and missing captures](ASSET_PROVENANCE.md)
- [Complete file inventory](FILE_MANIFEST.md)
- Previous CRO-03: [review](CRO03_VISUAL_REVIEW_ARCHIVE.md), [QA](CRO03_QA_ARCHIVE.md), [handover](CRO03_HANDOVER_ARCHIVE.md).

| Page | Desktop | Mobile first visit | Mobile saved choice |
| --- | --- | --- | --- |
| Home | [1440 × 1000](evidence/cro03a/matrix-home-1440x1000-first.png) | [390 × 844](evidence/cro03a/matrix-home-390x844-first.png) | [390 × 844](evidence/cro03a/matrix-home-390x844-saved.png) |
| Fishing Journal | [1440 × 1000](evidence/cro03a/matrix-fishing-journal-app-1440x1000-first.png) | [390 × 844](evidence/cro03a/matrix-fishing-journal-app-390x844-first.png) | [390 × 844](evidence/cro03a/matrix-fishing-journal-app-390x844-saved.png) |

## Branch and receipt

Continues **codex/cid-web-cro-03-design**, preserving history from reviewed **d0df9e0bdfc0c23fbdc0db1fad94dd948ab7f5a6**. Main remains **42c997c13712a432c8e2384915aaa010a16d068b**. Changes are only within `docs/CID-WEB-CRO-03/`. All 117 prior assets/reference/evidence files and 78 production-baseline blobs remain unchanged. No production source/config/package/README/workflow edit.

Verified pushed design commit: **`c14e07be71fbe3f9abb02b0f3c3636319b5178a6`**. GitHub API readback at that exact commit matched the local committed blobs:

- `index.html`: `355716dea4aef012c8b35cd7532fc5ba4f117e1e`.
- `VISUAL_REVIEW.md`: `351ae0a89711bc254994055e0bc7b49c029d719c`.

Remote main remained `42c997c13712a432c8e2384915aaa010a16d068b`; CRO-02 remained `1095c41927f2f5eabd6e0ac1996325d780009530`. Only the review branch advanced, by normal fast-forward push. The worktree was clean and no changed path fell outside this design folder.

The final response supplies the exact final branch-tip SHA, which includes this receipt-only handover/inventory update. The tested design and screenshots are unchanged by that final commit.

[GitHub review files](https://github.com/PeteColley/catchid-web/tree/codex/cid-web-cro-03-design/docs/CID-WEB-CRO-03) · [Visual review](https://github.com/PeteColley/catchid-web/blob/codex/cid-web-cro-03-design/docs/CID-WEB-CRO-03/VISUAL_REVIEW.md). Repository files, not a public preview.

## Verification and limits

PASS: npm ci/check/build/verify, scoped diff checks, 36 responsive cases, six file:// cases, consent parity, keyboard traversal including 1.6× text, focus obstruction, FAQ/menu/dialog and reduced motion. Zero external page requests/exceptions; authored contrast ≥4.5:1. Existing check diagnostic: one unused-require hint, no errors/warnings.

Two browser passes and an inline alternative are preserved. Self-review finds clearer early understanding, stronger mobile photography and less full-phone repetition. The fixed panel consumes viewport space; space is reserved and tested focused controls remain visible. Enlarged text requires scrolling.

Approved current Add Catch/Catch Details captures are still missing. The saved-record excerpt does not pretend to fill that gap. Old screenshot age, concept-photo rights/resolution and unperformed physical-device/Safari/Firefox/screen-reader testing remain limits. No catch, feature, statistic or conversion uplift is invented.

**NOT LIVE:** catchid.app, production consent/analytics/attribution/privacy, Android and Google Play are unchanged. No merge, deployment, public preview, PR or release. Review-branch push does not trigger main-only deployment.

**One next action:** Pete and ChatGPT inspect CRO-03A’s before/after gallery and approve or request final revisions. No production implementation or publication is implied.
