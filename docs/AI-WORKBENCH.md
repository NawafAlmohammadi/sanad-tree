# AI workbench

An enabled external model and its server-side API key are required for generated explanations, semantic evidence search, adaptive practice and AI extraction. The source-only answer mode, reviewed matn matches and narrow literal Arabic chain parser work without a model. The Gemini key does not grant access to Sunnah.com data. No user input is stored automatically.

**Sanad assistant** combines evidence search and chain questions in one conversation inside **From text to understanding**. A model tool choice routes a selected-report question to its chain evidence or a broader question to the indexed library excerpts. Comparisons can include narrators outside the currently selected report; selecting a report does not restrict an explicitly broader question. The source-only option uses original excerpts, without generated explanations. Cited library records link directly to their report maps and narrator cards. Opening a record preserves the conversation. Extraction and practice remain separate tools, sharing the same model selector. Switching tools or models cancels pending UI requests and ignores late responses.

## Hadith to tree

Paste a hadith text, a full transmission chain, or a canonical Sunnah.com report URL. Recorded matn matches open the reviewed library tree directly, without generating a new chain. Other matn inputs search Sunnah.com and fetch a matching report page before extracting its Arabic chain. Public page retrieval can be blocked by the source; this returns SOURCE_UNAVAILABLE, never a chain recalled from model memory. A Sunnah.com API key is separate from the Gemini model key. A successful Gemini connection alone does not grant access to Sunnah.com data.

Configure the optional server secret SUNNAH_API_KEY with a key issued by Sunnah.com to use its official API. For matn-only input, Gemini proposes at most three reference locators; these suggestions are never evidence. The server fetches each actual API record, checks its collection/number and a literal normalized match against its original Arabic or recorded English text, then extracts only that fetched Arabic isnad. A suggested, nonexistent, mismatched or inaccessible reference cannot supply a chain. Direct report URLs use the official endpoint without model reference selection. Source API credentials go only to api.sunnah.com; redirects are rejected.

For full transmission text, the model selects literal name spans and branch order; the server copies each edge excerpt from those spans. It rejects altered names, quotations, reversed links, omitted supplied intermediaries, invented matn and sequential links crossing the branch-switch marker ح. A second model pass checks the extracted edges. A rejected candidate receives one bounded correction under the same rules. Narrated event text may include its literal terminal Prophet mention, without allowing ordinary narrator spans into the matn.

When the model is unavailable, a narrow parser can draw explicit Arabic transmission formulas from the supplied text, under the same literal-span, direction and branch-switch rules. This is labelled direct extraction without AI generation; no model result that failed grounding is replaced this way. Unsupported syntax remains unresolved.

The provisional tree appears automatically after checks. Original text and edge excerpts remain available in a disclosure, with JSON export. No per-edge checkbox gate is required. Short names and pronouns retain their exact wording and unresolved identities. If a branch would need an assumed pronoun identity to join the common tail, it stays separate and a notice explains the incomplete branch. No appraisal or biography is invented. Extracted trees stay outside the reviewed ten-report catalog and are not stored automatically.

Source URL fetching permits only HTTPS Sunnah.com canonical report pages or the fixed search endpoint. Redirects are not followed; source response sizes and timeouts are bounded. Provider credentials are never attached to source-page requests. Search snippets alone cannot supply a chain. An inaccessible source and a genuine no-match result have distinct responses.

## Evidence inside the unified assistant

The model interprets Arabic and English questions and retrieves relevant records from indexed, previously reviewed catalog excerpts. The current corpus covers ten reports, 22 paths and 74 narrator identities, with the existing source references. After retrieval, it writes a question-specific explanation with evidence IDs. Each cited fact must exist, identities must belong to the cited evidence, numeric claims must have cited support, and explicit quotations must occur verbatim in the cited passages. A separate model pass checks the assertions.

Compiler-teacher queries (such as “Who did al-Bukhari narrate from?”) retrieve the actual compiler-to-first-narrator edges across recorded reports before generation. This avoids a selected-card refusal or a biography-only citation that does not establish the relationship. The answer must state that the library is not a complete historical list of the compiler's teachers. All citations retain their individual route provenance.

Only records actually cited by a verified paragraph become navigation results. Users can open their report or narrator in the existing map and inspect original evidence. Important recorded appraisal qualifiers (including tadlis, changed memory, truthfulness, weakness or an unresolved identity) have additional local retention checks; internal citation IDs are removed from displayed prose and rendered as source controls instead. Weak or fabricated report grades remain visible whenever report evidence is used. This is retrieval over stored excerpts, not unrestricted web search. A reference URL does not mean the model has read an entire linked page or book. No new scholarly judgement is generated. Exact English matn quotations remain bound to the verified Sunnah.com records.

## Assistant map selections

The server computes a finite set of recorded path, through-narrator, junction, comparison and review views. The model chooses a view ID with its required evidence. The server validates that choice and returns only existing nodes and transmission links. The application highlights them, dims the other branches and provides a reset control. The model never supplies executable code, arbitrary coordinates, new edges or new narrators. Dragging and fullscreen annotation remain available.

## Adaptive practice

Questions and correct options are derived from actual recorded directed edges and branch joins. The model selects an exercise based on the learner's recent attempts and writes a brief explanation from that exercise's evidence. The explanation is checked before being shown after an answer. Previous answers are scored against the graph-derived answer, not a client-supplied score. Unrecorded ordering, dates, grades and chain-connectedness claims are rejected. The next exercise can target the missed skill and avoids recently answered questions while alternatives remain.

This is educational practice, not a secure examination. Answer IDs are returned to the browser for feedback and are not confidential.

## Privacy, failure handling and validation

- Source text and questions are sent to the selected model provider for processing. Gemini interactions use `store:false`; no persistent interaction ID is used. This does not override the provider's own account terms or data handling.
- Keys remain on the server; responses contain no key, endpoint configuration or raw provider error. Inputs are size-bounded and same-origin checked; the workbench has a shared request rate limit.
- Extraction and practice normally use two model calls; library retrieval, composition and verification use three, while compiler-edge research uses two. When a report is selected, the unified assistant first makes one bounded tool choice; this cannot create evidence or bypass answer verification. Generation can make one correction attempt using original evidence and explicit validation feedback. The corrected answer passes the same local rules and a fresh independent review; a second failure remains withheld. This does not relax source checks.
- A provider 503 receives one bounded retry, with a short delay. Authentication failures, quota exhaustion and redirects are not retried. Each provider request has a 25-second timeout. Failures log only a stage, model ID and error code, never credentials, source text or user questions. No preset answer is labelled as AI output.
- The existing assistant may return clearly labelled original source evidence when its model is busy or verification fails. It does not return an unverified map action in that fallback.
- Model checking is a guardrail, not a guarantee of zero error. Source attribution and scientific review are still required.

Automated checks exercise forged citations, literal extraction, omitted intermediaries, reversed edges, unresolved names, map-action allowlists, namesake separation, semantic retrieval provenance, adaptive scoring, prompt injection, bounded inputs and failure disclosure. Run the checks described in the README before deployment.
# Reviewed identity joins

The literal extraction draft keeps every original name span and quotation. A separate reviewed source-identity layer may join occurrences only for an explicitly recorded source match. It does not merge equal short names generally or import narrator appraisals. Bukhari 59 is the first reviewed case: its Sunnah.com page links both `فليح` and `أبي` to [narrator 6437](https://sunnah.com/narrator/6437). The exact printed isnad and narrated-event opening must match before applying that join. Its shared tail retains the second branch's original edge evidence. Both original mentions remain in the exported extraction evidence; the displayed graph uses their source-confirmed shared identity. Other inputs retain unresolved pronouns and incomplete branches.
