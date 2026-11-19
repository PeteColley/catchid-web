# CID-WEB-CRO-04 — Astro implementation candidate

**IMPLEMENTED CANDIDATE — NOT LIVE · NOT PUBLICATION READY · 19 November 2026.**

The approved CRO-03B journal-first design is implemented across `/` and `/fishing-journal-app/` in the existing static Astro architecture. Shared components preserve the editorial typography, dark Home hero, warm Journal page, section order, genuine product proof and optional identification. The final header has a left logo, centred desktop navigation and no download CTA.

Each page has exactly two real official Google Play badge links, in the hero and final section. The existing URL generator, campaigns and nested install attribution are retained. Production consent logic is unchanged; only its presentation and a bounded menu/focus helper adapt it to the approved layout. Advertising is acknowledged, misleading ad-free promises are removed, and Journal Protection stays qualified/optional.

## Review

- [Offline comparison gallery](index.html)
- [Visual review and before/after screenshots](VISUAL_REVIEW.md)
- [QA and limitations](QA.md)
- [Asset release gates](ASSET_RELEASE_GATES.md)
- [Unapplied Android continuity proposal](PROJECT_STATUS_PROPOSED.md)

| Page | Desktop | Mobile first / saved | Complete page |
| --- | --- | --- | --- |
| Home | [1440×1000](evidence/matrix-home-1440x1000-first.png) | [First](evidence/matrix-home-390x844-first.png) · [Saved](evidence/matrix-home-390x844-saved.png) | [Desktop](evidence/matrix-home-1440x1000-saved-full.png) · [Mobile](evidence/matrix-home-390x844-saved-full.png) |
| Journal | [1440×1000](evidence/matrix-fishing-journal-app-1440x1000-first.png) | [First](evidence/matrix-fishing-journal-app-390x844-first.png) · [Saved](evidence/matrix-fishing-journal-app-390x844-saved.png) | [Desktop](evidence/matrix-fishing-journal-app-1440x1000-saved-full.png) · [Mobile](evidence/matrix-fishing-journal-app-390x844-saved-full.png) |

## Branch and verification receipt

Branch: **`codex/cid-web-cro-04-implementation`**. Based directly on refreshed main **`42c997c13712a432c8e2384915aaa010a16d068b`**. Approved design **`9c7b0847061a460aa095150a6e2dd1972ba7a436`** remains separate and unchanged. No design archive was merged.

The exact pushed implementation SHA and GitHub readback receipt are recorded after verification. The final chat receipt identifies the final branch tip, including any documentation-only receipt update.

PASS: existing npm install/check/build/verify and diff checks; 56 Chrome responsive/text cases; 20 Chrome interaction groups; 8 Edge visual cases and 20 interaction groups; exact official badge/attribution and shared consent regressions; source/asset protection checks. Browser limits are in QA. One existing unused-require hint remains; no check errors or warnings. The static output remains two HTML pages, without added dependencies or client hydration.

## Sceptical review and publication gates

Normal badge placement and product-frame geometry match CRO-03B. Removing preview-only labels brings mobile proof earlier. Visual review caught and corrected the tablet wordmark wrapping at enlarged text. Actual complete pages and first/saved consent states are compared in the review.

The concept photograph is explicitly review-only and **must not be published as-is**. Current approved complete Add Catch/Catch Details and refreshed product screenshots remain decisions for Pete. Firefox, Safari/WebKit, physical-device and screen-reader validation remains outstanding. Local tests do not prove field performance or conversion improvement. These limits prevent a claim of publication readiness.

**Main and catchid.app are untouched.** No merge, deployment, public preview, workflow dispatch, Android release, Google Play change, production analytics configuration or marketing change. The main-only deployment trigger does not match this branch. The Android PROJECT_STATUS proposal is unapplied.

**One recommended next action:** Pete and ChatGPT review the implementation candidate. Stop at this review handoff; publication requires Pete's separate explicit approval after the release gates are resolved.
