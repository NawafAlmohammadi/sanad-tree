# Privacy and processing

Sanad does not ask for religious affiliation, identify beliefs, or build religious profiles. Questions, draft maps, annotations and recent conversation stay in page memory and reset when the page is refreshed. The application has no persistent conversation database or analytics profiling. Hosting infrastructure can still retain access logs under its own policy.

In AI mode, the server sends the question, relevant approved excerpts and up to three recent questions to the selected model provider. Prior generated answers are not source evidence. Extraction sends the submitted source text. Practice uses the current graph and recent attempts. Live reference search sends the search question to the public Islamic Content service, then retrieves matching original passages. Provider retention terms apply; `store:false` is not a guarantee that a provider retains no operational data.

Do not submit names tied to personal cases, email, phone, identity numbers or other unnecessary personal details. A bounded server preflight rejects recognizable contact/identity details before downstream model or source requests; this is not a complete detector for every possible personal identifier. Personal fatwas are referred to qualified specialists.

Keys stay on the server. Fixed/allowlisted source hosts never receive model credentials and redirects are not followed. Inputs, history, output sizes, timeouts and request frequency are bounded. Failure logging uses a stage/model/error code, not prompts, source text or keys. The in-memory per-IP request limiter is temporary and is not a global persistent user identifier.

Human scientific and linguistic review remains required for formal approval. The app discloses AI-generated explanations and keeps original quoted evidence inspectable.
