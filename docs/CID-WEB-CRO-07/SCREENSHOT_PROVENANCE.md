# Screenshot and build provenance

## CRO-07A — three new genuine originals

The [recovery handover](RECOVERY_07A.md) is the exact current capture/build/device/sample-data and rights record; [capture manifest](evidence/recovery-07a/captures.json) binds all three untouched PNGs to source, APK hash, timestamp, dimensions and SHA-256. Captured 19 November 2026 on fresh offline Android 15/API 35 Pixel 5, 1080 × 2340, density 440, font scale 1.0. Reused the unchanged cloud-disabled 1.2.15/35 APK from source `9e9b37e9dfdc2554321602bfbada2e18227d34e7`; no rebuild, fixture or seeder. One fictional no-photo Brown Trout, entered through genuine app UI. No third-party fish photograph or real user's catch is represented.

The newer Android continuity at `35cbf6d562d6f42906e33c5c7be95d0b95800ad7` now explicitly records **Pete's owner confirmation of 1.2.15/35 Production**; no fresh direct Play Console or Play-delivered capture was obtained. App/build files are identical to the APK source. Current-source provenance is verified; independent Production fidelity and owner publication acceptance remain separate gates. Required caption: **Actual CatchID UI · controlled demonstration data · no photo required.**

## CRO-07 initial attempt — historical provenance

**No new product captures.** No sample catch was entered, no CatchID app was installed or launched, and no app screenshot was obtained. The sole new PNG in this folder is explicitly named `evidence/emulator-anr-diagnostic-not-product.png`; it is infrastructure evidence and must never be used as a product asset.

## Attempted capture environment

| Field | Value |
| --- | --- |
| Date / timezone | 19 November 2026, Europe/London (UTC) |
| Android source | `PeteColley/catchid-android`, main `9e9b37e9dfdc2554321602bfbada2e18227d34e7` |
| Qualified application source comparison | Application/build paths equal `f77f76f2dc7b4547d7a124b63c71e6f7783744ca`; later main changes are documentation |
| Build | 1.2.15 / code 35; package `com.catchid.app`; debug playtest; launcher label CatchID Playtest |
| Build switches | `-PcatchidPlaytest=true -PjournalCloudEnabled=false`; unchanged source |
| Toolchain used successfully | Existing JBR 21.0.11; repository Gradle 8.11.1 / AGP 8.10.1; installed Android SDK 36 |
| APK | `app-debug.apk`, 23,569,575 bytes |
| APK SHA-256 | `94248cacfef23ef021dd75c4ffe38879ea5310ade42852227215ce62ddc4d3ac` |
| Local APK | `C:\Users\chen2\Documents\ChatGPT\CatchID\cid-cro07-android-source\app\build\outputs\apk\debug\app-debug.apk` |
| New AVD | `CatchID_CRO07_20261119`, serial `emulator-5568`, new isolated registry/userdata |
| Profile | Pixel 6-derived portrait, 1170 × 2532 pixels, density 480 = 390 × 844dp; normal default font scale intended, not app-verified |
| OS image | Official Android 16 / API 36, Google APIs x86_64 revision 7, extension 17 |
| Emulator | 37.1.11.0 / build 15917651; WHPX usable outside sandbox; automatic software graphics (SwiftShader/lavapipe) |
| Startup | 22:29:35 UTC; snapshots disabled; no previous userdata/account/catches copied |
| Final precheck | 22:35:46 UTC: boot-complete 1, airplane mode 1, active default network none, accounts 0, third-party packages empty, CatchID absent |
| Shutdown | Normal emulator-console shutdown; serial and task emulator processes absent at 22:36:20 UTC |

The official tools/image archives were downloaded only into `cro07-runtime` and checked against Google's repository manifest SHA-1 values: tools `57d04f2d75eb8e8fffc5000a987e5de4b5a63e9d`, image `c6bf44bdcd885bb902b4ba752d111a073ad7a817`. Existing SDK/AVDs were preserved. No SDK image, APK, key or database is committed. The local runtime and detached source checkout remain available for audit; the unhealthy AVD is not recommended for acceptance use.

## Privacy and production differences

Generated BuildConfig and the packaged manifest confirm playtest enabled, cloud disabled, Analytics deactivated and Crashlytics collection disabled. Advertising is still the real consent-gated app implementation with Google demo identifiers; playtest is not an ads-off switch. Offline isolation was prepared, but the phone-service command failed during unhealthy startup. A complete healthy capture environment was therefore **not certified**. CatchID remained absent throughout, so no app cloud writes, ID calls, analytics, ad requests/impressions or sample-data uploads occurred. Android system services did start; this is not a claim that the emulator OS made no network requests before airplane mode.

This debug/playtest APK is neither the signed release AAB nor a Play-delivered installation. Production release configuration has cloud enabled and real advertising units; those were not used. Current source includes Length and Notes, which were introduced after the directly verified 1.2.12 Production baseline. Do not market those as verified-live features until the 1.2.15 Production claim is independently reconciled.

## Existing image rights and lineage

Existing images remain byte-identical at their original paths; [asset history](../ASSETS.md) records their supplied/published lineage. Home is a genuine HOME-04 empty-journal capture with the app's own EXAMPLE guidance. Journal and ID are supplied marketing artwork whose exact capture build/date are unknown. Personal Records and Insights overview were supplied through website issue #1 and downloaded unchanged in September. Their prior publication is evidence of use, not a newly established blanket rights release for every embedded photograph. Existing owner/rights acceptance remains applicable.

No new fish photograph, third-party art, real user history or private location was introduced. The approved Patagonia Savage hero remains untouched and was not repurposed as a sample catch photo. For the future capture procedure, use only a no-photo controlled demonstration catch and label it as sample data in both the evidence and any eventual marketing caption.

The diagnostic PNG is an untouched ADB `exec-out screencap -p` result at 1170 × 2532. It shows the fresh emulator's System UI ANR dialog; no account, CatchID record or private data is visible. Its pixels have not been altered. It is excluded from the recommended asset set and from the gallery's product-image display.
