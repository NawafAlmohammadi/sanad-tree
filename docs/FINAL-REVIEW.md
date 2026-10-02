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
