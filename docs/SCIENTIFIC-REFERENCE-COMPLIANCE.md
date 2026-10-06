# Scientific reference guide — implementation record

Reviewed against the supplied 15-page competition guide, version 20/3/1448. Migration: 6 October 2026. This document records implementation evidence and remaining external requirements; it is not an approval certificate.

The same ten reports and 22 route node orders remain. The active library no longer depends on Sunnah.com. Its texts, editions, appraisals, recorded grades and translations have been checked against the guide's approved publishers. See [source audit](SOURCE-REVIEW.md) and the machine-readable `data/source-verification.json`.

| Guide page | Requirement | Implementation and status |
| --- | --- | --- |
| 1 | Scientific reference and data package | Guide version is recorded here; active catalog has `competition-guide-2026` provenance. |
| 2 | Educational scope; no personal fatwas or judging people/groups; response levels A–D | Server preflight refuses invention and identity data, refers personal cases (D) and specialist/disputed questions (C); A/B answers require cited evidence. Classification is conservative, not a complete legal classifier. |
| 3 | Hadiths from Sahihayn, Dorar or approved Shamela editions; originals separate from explanations | Ten reports use named Shamela editions; full source paragraphs retained per path. Original evidence is displayed separately from AI explanation. Narrator appraisals are literal Ibn Hajar entries. Quran/tafsir/creed are not claimed as independently reviewed corpora. |
| 4 | Approved fiqh/history; Bayenat for misconceptions; approved dictionary | Dictionary and Bayenat book are recorded in the reference registry. The app does not invent responses to misconceptions when their primary text was not retrieved. Specialist topics are referred or withheld. Hadith terminology uses cited Taysir Mustalah al-Hadith excerpts. |
| 5 | Traceability, religious reliability, respect, AI disclosure, privacy and terms | Per-paragraph references, exact-quote validation, owner-bound identities, explicit grade warnings, privacy notice, bounded inputs, provider-only secrets and respectful audience prompt. Automated checking is clearly distinguished from human approval. |
| 6 | Acceptance examples | Automated checks cover invented texts, fabricated citations, missing evidence, false consensus, personal marriage referrals and supported graph questions. The complete sample suite, including cultural nuance and misconception answers, still needs human scientific/language acceptance; no pass is claimed without an approved primary passage. |
| 7 | Standard Islamic terminology and reviewed equivalents | No newly generated translation is presented as an approved quotation. Published HadeethEnc English is used for four reports, with version notes. Six reports and unreviewed biography translations retain their Arabic originals. Dictionary expansion requires approved entries and language review. |
| 8 | Scientific and linguistic human review before final approval | REQUIRED, PENDING. The independent model check and automated tests do not satisfy this human-review requirement. Review the source audit and both-language flows with a qualified reviewer before declaring competition approval. |
| 9 | Islamic Content MCP, QuranEnc, HadeethEnc, Byenah and Islamhouse services | MCP search/fetch and HadeethEnc retrieval are connected and tested. The other services are documented as references or outside this app's hadith-chain scope; they are not advertised as connected integrations. |
| 10 | Islamenc, Terminologyenc and ICADB | Registered as guide-approved references. No guessed endpoints or undocumented adapters. Source retrieval must produce an approved original passage before generation. |
| 11 | Risala content platform | Reference registry only; no bulk import or claim of runtime integration. |
| 12 | Quran/tafsir/recitation services | Reference registry only, outside chain visualization. Quran text and translations are never generated to fill gaps. |
| 13 | Fiqh encyclopaedia and scholars' sites | Reference registry only. Personal fatwas remain outside application scope and are referred to specialists. |
| 14 | Arabic-language and King Fahd Complex resources | Registry includes the exact guide links. Formal linguistic approval remains pending. No claim that fonts or language corpora were integrated. |
| 15 | Dorar API; Shamela editions/download | Dorar public JSON adapter is implemented but live access returned HTTP 403 during review. It fails closed. Verified library quotations stay usable offline. Shamela approved pages/editions are used directly; its download is a reference, not an invented API. |

## Release conditions

1. Recheck source identity, wording and grade with the relevant edition, especially where alternate paths have different wordings.
2. Complete scientific and Arabic/English linguistic human review. Record reviewer, date, scope and corrections outside the public repository unless they consent to disclosure.
3. Confirm publisher permissions for the actual copied excerpts and competition distribution. An API's availability does not grant blanket rights.
4. Run the full acceptance examples in page 6 with the configured model and source services. Refusal is acceptable when evidence is missing; invented scripture, untraceable claims and personal rulings are not.

No repository file, badge or UI text asserts 100% scientific approval. Service availability and model verification can change and do not replace human review.
