# Architecture and evidence boundaries

The hosted app uses React, TypeScript and Vinext/Vite with Cloudflare Workers API routes. The portable edition shares the UI, catalog and assistant with a local Node.js server. API secrets are server-side environment variables. The browser receives only model IDs, labels and availability.

The catalog is a reviewed JSON knowledge graph. Every narrator field and knowledge item identifies its owner and source IDs. Every ordered transmission edge belongs to a specific chain. Import validation rejects foreign owners, missing references and reversed edges.

data/english.json contains reviewed display translations bound to exact Arabic originals and stable owner IDs. Arabic text remains available in expandable disclosures. A changed record cannot silently reuse a stale translation.

## Assistant flow

1. Validate origin, JSON body, length and rate limits.
2. Resolve a reviewed Arabic or English question form. Unsupported or mixed requests are declined before a provider call.
3. Resolve narrator identity globally, then check chain membership. Ambiguous names require clarification. An explicit name takes precedence over the selected card.
4. Retrieve source-bound facts and derive eligible teaching cards from the selected graph: transmission direction, narrator relationships, parallel paths and recorded assessments.
5. In AI mode, the provider selects all evidence IDs and an ordered selection of up to six eligible teaching-card IDs. In source mode, the retrieved evidence is displayed directly.
6. Validate evidence completeness, teaching IDs, ownership and references. Render only server-owned explanations and evidence. Model prose is never displayed.

Fabricated-report warnings remain mandatory outside optional teaching selection. Report grading is independent of narrator colours. The assistant creates no hadith grading or new scholarly assessment. Prophet and Companion roles are separate from narrator criticism.

This is a constrained teaching planner, with no unrestricted generation or live web search. Its contribution is selecting and ordering explanations from the current chain and reviewed knowledge. Evidence stays accessible; unrecorded facts remain unavailable. Reviewed question forms intentionally limit phrasing.

## Providers and API

config/ai-models.json is the allowlist; server-side AI_MODELS may override it. Adapters support Gemini Interactions (store: false), OpenAI-compatible Chat Completions and Anthropic Messages. The visitor cannot set arbitrary endpoints or keys.

HTTP 503 may return a clearly labelled source-based answer from retrieved evidence. Authentication, quota and invalid-output failures remain unavailable. No hidden retries, paid upgrades or automatic provider changes occur. Redirects fail without forwarding credentials.

Limits: 4096-byte body, 500-character question, 15-second provider timeout, 32-KB provider response, 20 requests per IP per minute per worker isolate. Questions and retrieved evidence are sent to the selected provider only in AI mode. Conversation state remains in page memory.

GET /api/models returns models. POST /api/assistant accepts question, hadithId, chainId, optional narratorId/modelId/locale. Replies include status, engine, answer, claims, sources, optional narrator and ordered lessons. Source fallback includes fallbackReason and notice.

Automated checks verify software behaviour and source bindings; they do not replace specialist review of the scholarly material. See FINAL-REVIEW.md for added references and verification details.
