# Bilingual interface and grounded teaching review

The library remains 10 reports: four authentic, three weak and three fabricated. Narrator colours are independent of report grading. Companion and Prophet roles remain green; missing assessments remain grey.

`data/english.json` provides reviewed display translations for every recorded narrator field, report judgement, path note and source reference. Each translation includes its exact Arabic original and its stable owner ID. A changed Arabic record cannot silently reuse an old translation. Original Arabic text remains available in expandable disclosures.

## Added primary references

- Sahih Muslim 2354a: names of the Prophet ﷺ.
- Sahih Muslim 1162b: Monday as the day of his birth. No calendar date or birth year is inferred.
- Sahih al-Bukhari 4466: age sixty-three at death, in Aishah’s report.
- Sahih al-Bukhari 3548: age forty at the beginning of the prophetic mission.
- Ibn Hajar, Tahdhib al-Tahdhib, official al-Ifta Hadith Library: Uthman ibn Asim, Abu Hasin (Ḥaṣīn), distinct from the name Husayn.
- Mahmud al-Tahhan, Taysir Mustalah al-Hadith, 10th edition, pp. 15–16: definitions of isnad and matn.

These references add sourced profile information and glossary definitions; they do not add reports to the exploration library. Existing chain identities, scholarly qualifications and report warnings are preserved.

## What the AI adds

The model now chooses an ordered teaching plan from source-bound explanations derived from the selected graph and reviewed data: how to read transmission direction, who received a report from whom, where the selected narrator fits, how parallel paths differ, and which recorded assessments require caution. This is different from displaying a raw biography field.

The server supplies eligible teaching cards and evidence identifiers. The model selects their focus and order; it cannot supply new narrator names, dates, citations or scholarly judgements. All evidence IDs are validated, every card has existing sources, and fabricated-report warnings stay outside the optional model selection. Original evidence remains accessible under the explanation. Unrestricted model prose is never displayed.

This design intentionally trades unrestricted phrasing for verifiable answers. Reviewed question forms are supported in Arabic and English. Unsupported or mixed requests are declined before any provider request. Missing source facts are not completed from the model’s general knowledge. The source-based mode is labelled separately; a provider outage is not presented as an AI answer.

## Interface and verification

The opening screen waits for the visitor to select a hadith. Tracing takes 1.7 seconds per step, with a progress indicator, pause/replay controls and reduced-motion support. Interacting with the map pauses automatic scrolling. Arabic uses bundled IBM Plex Sans Arabic and Noto Naskh Arabic; English uses DM Sans for body text and Cormorant Garamond for display headings; their OFL licences are included in `public/fonts`.

Run `npm test`, `npm run check:data` and the relevant type/build checks. Tests cover identity separation, citations, fabricated warnings, source translations, scoped teaching plans, malicious model identifiers, prompt injection and provider failures. These checks verify software behaviour and source bindings; they do not replace a hadith specialist’s review of the underlying scholarly material.

The interface now uses an olive (#4F5B2A), brass (#B8892D) and parchment (#D8C9A8) palette with decorative geometric SVG accents. The top row has one centred library count in each language. Theme colours do not replace narrator-assessment or report-grading colours.

## Exact English hadith quotations — 3 October 2026

The ten reports were compared with Sunnah.com. All ten current records use its English text verbatim, with attribution, under its individual educational reproduction permission. The three previously unmatched fabricated reports were replaced at the team’s request with Ibn Majah 1388, 4313 and 4054, each with a separate verified chain. This replaces the previous independently prepared matn translations. See SUNNAH-ENGLISH-AUDIT.md and data/hadith-english.json. The source and chain bindings invalidate a translation when its Arabic record changes.

## University identity update — 3 October 2026

The supplied Islamic University of Madinah artwork replaces the app’s brand marks and favicon. Default dark mode uses navy, blue and gold; narrator assessment colours retain their meanings. The footer names Team Sanad, the College of Computer Science and Dr. Ahmad Badr al-Din al-Khidr in the Arabic wording supplied by the team.

The chain appears complete with a brief, calm fade. No animation or automatic scrolling starts on selection. Optional tracing highlights one step every two seconds while leaving the viewport under the user’s control. Reduced-motion preferences disable the reveal and animated tracing.

The current catalog has 10 reports, 55 narrator identities and 73 source records. 65 automated checks and TypeScript checks pass. Missing assessments, ambiguous identity expansions and external requests continue to fail closed.

## Map focus and university header update — 3 October 2026

- Only the header displays the university logo. It uses the original SVG from https://cdn.iu.edu.sa/NDS-iu/assets/img/iu-logo.svg, without changing the artwork. The assistant and footer logos were removed; credits remain.
- Explicit tracing highlights one card for 2.4 seconds with enlargement, a dimmed map background and a glow. Only the map scrolls to the current card. Opening the page or selecting a hadith still does not start tracing. Pointer, keyboard and selection feedback are visible; reduced-motion settings disable movement.
- Ibn Majah 1388 directly links Ibrahim ibn Muhammad to Sunnah.com narrator 11814. His cited assessment is “Truthful, Good Hadith” / “صدوق حسن الحديث”; Ibn Hajar’s wording is “صدوق”. The green card and assistant use that assessment. Al-Mizzi’s uncertainty remains attributed in the chain note. No “thiqa” wording is substituted for “saduq”.
- The catalogue now contains 74 cited sources and 55 narrators; the ten exact English quotations and 4/3/3 report distribution are unchanged.

## Transparent header and navy favicon — 3 October 2026

- The header now uses the team's supplied `Islamic-University-of-Medinah.webp`, copied unchanged with its original transparency. CSS clips only the empty margins; there is no white logo container. The university artwork retains its original colours and remains the property of the university.
- The original Sanad chain favicon is restored with a navy (#102438) background and white chain marks. Both icon metadata entries use the updated SVG.

## Unified graph and generated teaching — 4 October 2026

This section supersedes earlier descriptions of separate maps, wheel/touch pausing and ID-only explanations.

- All recorded paths appear in one graph. Shared narrator IDs merge; similarly named identities remain distinct. Curved links preserve the actual directed transmissions and references. The Bukhari 10 branches remain parallel.
- Smaller circular medallions retain the navy/blue/gold theme and narrator status colours. Focus enlarges one medallion and dims its surroundings. Hover, keyboard focus and selection have visible feedback.
- Tracing is explicit, 2.6 seconds per node. Wheel and touch yield camera control without pausing the timer. No trace starts on initial load or report selection. Reduced-motion settings are respected.
- Profiles group the biography, appraisals, period, knowledge and relationships. Relationships and library appearances are computed only from recorded chains.
- Verified Sunnah.com profile metadata adds the recorded kunyas/generations/periods for Adam (narrator 2), Ismail (989), al-Shabi (4099), Abd al-Razzaq (4533), Abu Hurayra (4396), and Kathir ibn Murra (6576), where fields were missing. Each addition is bound to its existing identity and source; English display text is reviewed. Al-Shabi's disputed death-date range is not converted into an invented exact date. Existing appraisals and qualifications are retained.
- The default AI models now generate question-specific explanations from catalog facts, followed by independent citation-bound verification. Invalid references, foreign narrator owners and unrecorded numbers are rejected locally. Every paragraph must pass the second check. Evidence and generated text remain visibly distinct. The source-only planner remains available as an explicit mode and for compatible custom configurations.
- Each AI answer uses two provider calls. This adds latency and quota use; validation failure returns disclosed original evidence. Model checking is a guardrail, not a guarantee that replaces specialist review.

## Branch spacing and verified Abu al-Haytham — 4 October 2026

- Rank layers use fixed spacing, with reserved routing lanes for source links that skip levels. Internal routing points are never displayed as narrators and do not create new transmission claims.
- Curved links avoid unrelated cards in the initial layouts. Arabic and English captions wrap without truncating their wording and are placed away from cards and other captions. Dragging keeps their geometry current without re-rendering the whole map on every pointer event.
- Fullscreen fits the branch width automatically. Fit branches is also available in the toolbar and zoom controls. Wider layouts remain pannable on small screens.
- Entire library results are green for authentic, yellow for weak and red for fabricated reports. Selection preserves the grade colour; light and dark modes have separate palettes.
- Abu al-Haytham, Sulayman ibn Amr al-Laythi, matches Sunnah.com narrator 3617, directly linked from Ibn Majah 802 and Tirmidhi 2617. His trustworthy appraisal is recorded with attribution to Ibn Hajar, Yahya ibn Main and al-Daraqutni. Both language modes and the assistant receive the same cited profile. The hadith grade is unchanged.
- Current library: 10 reports, 22 paths, 74 narrator identities, 132 source records. All 91 automated tests, TypeScript checks, data validation and production build passed. Local browser checks covered all ten trees in Arabic and English at desktop and 390-pixel widths, plus dragging with connected links and the visible source-backed profile.

## Source-grounded AI workbench — 4 October 2026

This section supersedes the earlier account of AI features being limited to the selected chain or a teaching-card planner. The approved library and its exact Arabic and Sunnah.com English matn records are unchanged.

- Added genuine model-based literal isnad extraction. The server checks names, continuous passages, ordering and branch IDs, then checks each proposed transmission against its passage. A visitor reviews every link before opening a provisional map. Unmatched identities, grades and sources are not completed from memory; drafts remain separate from the library.
- Added Arabic/English semantic research over indexed reviewed excerpts for all ten reports and 74 narrator identities. The model retrieves evidence, composes a cited explanation, and checks it independently. Navigation results come only from records actually cited. This is not live web search or full-book retrieval.
- Added source-bound map commands: the model can choose recorded paths, through-narrator views, junctions, comparisons or recorded review points. The client highlights existing nodes and links and can clear the selection. No generated code or invented graph objects are executed.
- Added adaptive practice. Correct answers come from recorded graph relationships; the model chooses the next exercise based on recent mistakes and successes and writes a checked explanation. No scholarly grading is generated.
- Added local rejection of changed explicit quotations and incomplete paragraphs. Provider failures and rejected output are labelled; workbench features never substitute preset output as an AI result. Existing source-only assistant fallback remains explicitly labelled.
- Live Gemini checks with the current server key produced literal extraction, semantic narrator comparisons, adaptive questions and a map-junction selection. Transient provider-busy responses and rejected outputs were also observed and correctly withheld or disclosed. Two-pass model review reduces errors but does not guarantee scholarly correctness.
- Operational and privacy details are documented in AI-WORKBENCH.md. No source rights, keys or public audience settings were changed.

The AI workbench release passed 101 automated checks, TypeScript validation, catalog validation and the production build.
