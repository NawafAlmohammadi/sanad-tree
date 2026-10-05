# Architecture and evidence boundaries

The hosted app uses React, TypeScript, Vinext/Vite and Cloudflare Workers API routes. The portable edition shares the UI, catalog and assistant with a local Node.js server. Secrets stay in server environment variables. The browser receives only model IDs, labels and availability.

## Unified chain graph

`unifiedGraph` unions every recorded path in the selected hadith. Narrators merge only by stable identity ID, never by similar display names. Transmission edges retain their path membership, wording and source IDs. Parallel narrators appear on the same layer, with separate curved edges; common narrators appear once. Topological layout rejects cycles instead of inventing a connection. The compiler and the hadith text remain distinct from narrator assessments.

Tracing starts only when requested. It visits the graph in topological order, highlighting the actual incoming edges at a branch or merge. Each focus lasts 2.6 seconds. Scrolling and touch temporarily yield camera control for 5.2 seconds without stopping the trace timer. Selection and zoom do not stop tracing. The pause control or Escape stops it. Reduced-motion settings disable animated tracing and camera movement.

Narrator profiles organize the existing source-bound biography, appraisal, period, additional knowledge and recorded relationships. Relationships are limited to the selected report's paths; library appearances are computed from the reviewed catalog. These are not exhaustive historical teacher/student lists.

## Catalog

Every narrator field identifies its owner and source IDs. Every transmission edge belongs to a specific chain. Import validation rejects foreign owners, missing references and reversed edges. `data/english.json` binds reviewed profile translations to exact Arabic originals and stable owner IDs. Arabic originals remain available. Exact Sunnah.com hadith quotations are handled separately in `data/hadith-english.json`.

## Assistant flow

1. Validate origin, JSON size, question length, question-only history and rate limits.
2. Apply conservative domain and injection gating. Resolve known names globally, check membership across all paths in the selected report, and ask for clarification on ambiguous aliases. Unknown dates are not filled from model memory.
3. Retrieve recorded chains, identity-bound profiles, qualifications, judgements and glossary facts. Every fact has an allowlisted ID, narrator owners and existing source IDs. No runtime web search or tool use is enabled.
4. With `groundedGeneration: true`, the selected model writes short explanations tailored to the question, with evidence IDs and narrator IDs per paragraph. This supports natural questions, path comparison and short follow-ups. Only up to three previous questions are supplied; previous generated answers are never evidence.
5. Validate structure, citations, owner membership, size and numbers against cited facts. Then make a separate provider request to verify each paragraph against only its cited facts. Reversed edges, mixed identities, guessed details, altered quotations and omitted material qualifications must fail verification.
6. Display generated paragraphs only when every paragraph passes. Show sources per paragraph and the original evidence in a disclosure. Weak/fabricated warnings are inserted by the server. If verification fails, show clearly labelled original evidence, without generated prose. Missing references cause refusal.

The two model calls provide layered checks, not a mathematical guarantee of factual accuracy. Specialist review of the catalog and generated explanations remains important. The assistant creates no new hadith grading, scholarly appraisal or religious ruling. A trusted narrator does not establish the authenticity of a report. Prophet and Companion roles remain separate from narrator criticism.

Source mode displays retrieved facts without a model. Custom configurations with `groundedGeneration: false` retain the original ID-only teaching planner for compatibility.

## Providers and API

`config/ai-models.json` is the server allowlist; `AI_MODELS` may override it. Adapters support Gemini Interactions (`store: false`), OpenAI-compatible Chat Completions and Anthropic Messages. Visitors cannot set endpoints or keys. Generated assistant answers normally use two sequential calls. Library research may add a retrieval call. One rejected assistant or research candidate may be corrected and independently checked again using the same evidence. A provider 503 retries once after a short delay. Authentication, quota and redirect failures do not retry. There is no automatic paid upgrade or provider switch.

HTTP 503 can return a disclosed source answer. Authentication and quota failures remain unavailable. Redirects fail without forwarding keys. Limits: 8192-byte request, 500-character question, three history questions of up to 500 characters, 25-second timeout per provider call, 32-KB provider response, 12,000-character structured result, and 20 requests per IP per minute per worker isolate. The in-memory rate limit is not a globally coordinated quota.

Questions, bounded question history and catalog evidence are sent to the chosen provider only in AI mode. Conversation state stays in browser page memory.

`GET /api/models` returns models. `POST /api/assistant` accepts `question`, `hadithId`, `chainId`, optional `narratorId`, `modelId`, `locale` and `history`. `chainId` anchors the record; generated evidence includes all recorded paths for that hadith. Replies include `status`, `engine`, `answer`, `claims`, `sources`, optional `narrator` and generated `blocks`. Source fallbacks include `fallbackReason` and `notice`.
