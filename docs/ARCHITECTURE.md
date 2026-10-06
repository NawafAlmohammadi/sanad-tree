# Architecture

React/TypeScript UI and source-bound libraries are shared by the hosted Cloudflare Worker and portable Node.js server. Their three API-route environment adapters differ; keys stay server-side.

The map unions the selected report's recorded paths by stable narrator ID, retaining each edge's path membership, transmission formula and source IDs. Curved directed edges follow dragged nodes. Topological layout rejects cycles. Tracing highlights one recorded path at a time: the current narrator glows strongly, preceding narrators less strongly. Scrolling/touch yields camera control without stopping the trace timer. Fullscreen retains the side inspector, library, drawing and movable text annotations. Layout/annotations are temporary page state.

The active catalog carries approved-source provenance, literal source paragraphs and owner-bound appraisals. Published English quotations are separate, tied to exact Arabic versions; unreviewed English fields are withheld. Historic regression fixtures are not loaded by the app.

Before any generation the server applies guide privacy/scope rules. Evidence comes from the indexed library or fetched approved passages. Per-paragraph citations, literal quotation checks, owner checks and independent model verification precede display. Missing evidence causes withholding or a disclosed original-source fallback. See [AI implementation](AI-WORKBENCH.md), [APIs](API-SOURCES.md) and [privacy](PRIVACY.md).

GET `/api/models` exposes model IDs, labels and availability only. POST `/api/assistant` supports a bounded question, locale, model and optional selected graph/history. POST `/api/ai-workbench` supports extraction/practice. Origin, JSON sizes and request frequency are checked; source allowlists prevent arbitrary fetch destinations.
