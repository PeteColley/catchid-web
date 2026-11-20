# CRO-09 — publication readiness

**20 November 2026 · AUDITED / NO-GO / NOT LIVE.** Pete and ChatGPT have approved the CRO-08 visual design and implementation. This assessment does not reopen that design decision and does not authorise publication.

Audited implementation: `94a4f5ed343b70e7f992556acb1a037158ebb9c4`, `codex/cid-web-cro-08-product-integration`. Audit branch: `codex/cid-web-cro-09-readiness`. Website main was freshly verified at `42c997c13712a432c8e2384915aaa010a16d068b`; Android main at `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`. See [QA and delivery receipt](QA.md).

## Decision

**NO-GO for a publication decision today.** Two specific issues need small, separately authorised corrections: the existing gold keyboard-focus outline fails minimum contrast on light backgrounds, and the linked live privacy policy still describes Production as 1.2.12 without adverts. Historical image rights/fidelity and practical device/assistive-technology acceptance also remain unresolved. No implementation was changed to conceal or fix these findings.

The acquisition experience otherwise retains the approved Record → Journal → Insights story. Both routes build correctly; navigation, equal consent controls, storage failure handling and tracked Google Play handoff work in the tested engines. The authentic new product examples and real hero photograph remain intact. There is no evidence requiring another creative redesign.

## Gate matrix

Severity describes the consequence of an unresolved gate, not an allegation of an incident. An evidence gap is not a failed product test.

| Gate | Result | Evidence | Severity | Blocks publication? | Smallest closing action | Responsible |
| --- | --- | --- | --- | --- | --- | --- |
| G1 Approved implementation preserved | PASS | [615 protected files; 48 identical build files](evidence/static-audit.json) | High if changed | No | None | Auditor |
| G2 Genuine Save catch / Catch details | PASS | [Asset decisions](ASSET_ACCEPTANCE.md), 16 exact derivatives | Medium | No | Retain visible demonstration/excerpt qualification | Pete / maintainer |
| G3 Historical Journal, Records, Insights and ID acceptance | NEEDS PETE DECISION | [Per-asset source, data and rights gaps](ASSET_ACCEPTANCE.md) | High for undocumented photo rights | **Yes** | Supply origins/permissions for embedded fish photos and accept representativeness/data use; replace only assets that cannot be cleared | Pete / original asset supplier |
| G4 Pexels hero and brand-use review | NEEDS PETE DECISION | [Existing licence/hash and current licence check](ASSET_ACCEPTANCE.md) | Low residual | Owner sign-off required; no specific new defect found | Record final intended-use acceptance; no blanket third-party-rights guarantee | Pete |
| G5 Layout, navigation, first-visit consent | PASS | [168 cases across three engines](BROWSER_ACCESSIBILITY.md) | High | No | None for tested conditions | Auditor |
| G6 Keyboard focus contrast | **FAIL** | [Computed colours and screenshots](evidence/focus-contrast.json) | Medium / WCAG AA | **Yes** | Adjust only the focus indicator to achieve ≥3:1 on every adjacent background; rerun focused checks | Separately authorised website maintainer |
| G7 Physical-device, Safari and spoken screen-reader acceptance | **UNTESTED** | [Coverage boundaries and exact manual procedure](BROWSER_ACCESSIBILITY.md) | Medium | **Yes — mandatory acceptance remains open** | Clean Android Chrome and iPhone/Safari session; actual supported screen reader; browser zoom and remaining Apple keyboard acceptance | Pete / authorised tester |
| G8 Security of this static delivery path | PASS, with maintenance findings | [Fresh audit and exposure analysis](SECURITY_PRIVACY.md) | Medium tooling; no identified visitor trigger | No identified security blocker for this exact path | Separate Astro/Node maintenance; reassess if architecture/inputs change | Maintainer / Pete prioritises |
| G9 Consent and Play attribution | PASS | Three-engine interaction results; [security/privacy](SECURITY_PRIVACY.md) | High | No | None; no production analytics traffic was sent | Auditor |
| G10 Linked privacy policy release wording | **FAIL** | [HTTP 200 live readback](evidence/privacy-policy-readback.json) | Medium / misleading disclosure | **Yes** | Separately reconcile outdated Production/no-advert wording with current release evidence; review obsolete native-format wording | Pete / privacy repository maintainer |
| G11 Build, metadata, sitemap, assets | PASS with Windows verifier qualification | [Real commands](QA.md), exact two pages | High | No identified build defect beyond known portability issue | Preserve ordinary Linux preflight before publication | Maintainer |
| G12 Actual Linux/Node workflow execution | **UNTESTED** | LF-source unmodified verifier passes on Windows; Linux unavailable | Medium deployment assurance | Preflight required, not proof of a defect | Run unpublished clean Linux/Node 24 install/check/build/plain verify and inspect artifact | Authorised maintainer |
| G13 Production release evidence | NEEDS PETE DECISION | [Owner confirmation vs dated direct evidence](PLAY_PRODUCTION_EVIDENCE.md) | Low for established journal claims | No blanket block on established functionality; close version-dependent evidence decision | Prefer one current Production dashboard screenshot/receipt; otherwise explicitly record reliance on owner confirmation | Pete |
| G14 Image delivery / performance | PASS for measured local delivery | [Responsive requests and sizes](SECURITY_PRIVACY.md) | Low residual | No identified resource-size blocker | Physical network acceptance; no field CWV claim | Tester |
| G15 Separate publication authority | NEEDS PETE DECISION | This audit is explicitly non-publication work | Critical authority boundary | **Yes** | Pete approves exact final candidate after evidence review, then separately authorises publication | Pete alone |

## Minimum remaining work, in priority order

1. Close the two observed defects through separately scoped changes: focus contrast in the website; stale release/advertising statements in the linked privacy policy. Keep the approved layout, copy direction, photography, consent and attribution unchanged.
2. Record a per-asset rights/data/fidelity decision for the four historical examples. A supported owner/source attestation may close the gaps; a new capture or replacement is necessary only where evidence cannot support the existing example. The Pexels use needs final owner acceptance, not an invented release certificate.
3. Complete one bounded manual acceptance session using clean test data/devices, covering the untested conditions in [Browser accessibility](BROWSER_ACCESSIBILITY.md). Retest the tiny focus correction and any issue actually found, without a new design iteration.
4. Reconcile the current Production evidence, run the unpublished Linux preflight, and present the resulting exact candidate and closed gates to Pete. [Publication checklist](PUBLICATION_CHECKLIST.md) applies only after separate authorisation.

These findings do not dispute Pete's 1.2.15 Production confirmation. They do not claim that historical artwork is fabricated or that its photos are unlicensed; the necessary evidence is missing. Fresh npm findings are also not equated with a vulnerable static visitor page.

**Recommended decision:** retain the approved candidate, withhold publication, and authorise only the minimum closure package above. No merge, deployment, public preview, main push, workflow dispatch, DNS/hosting, Android, Play, Firebase or advertising change occurred.

Reports: [Assets](ASSET_ACCEPTANCE.md) · [Browser/accessibility](BROWSER_ACCESSIBILITY.md) · [Security/privacy](SECURITY_PRIVACY.md) · [Play evidence](PLAY_PRODUCTION_EVIDENCE.md) · [Publication checklist](PUBLICATION_CHECKLIST.md) · [QA](QA.md) · [Offline gallery](index.html).
