# API setup

A valid model provider key is REQUIRED for generated explanations, semantic search, AI extraction and adaptive practice. Run SETUP.cmd or node scripts/setup.mjs, fill AI_KEY_GEMINI or AI_KEY_GROQ in API.env and restart the server. One provider key is enough. Keep real keys out of GitHub.

Model configuration is in config/ai-models.json. Public source services are separate; they never receive the model key. See [README](../README.md), [approved source APIs](API-SOURCES.md), [AI behaviour](AI-WORKBENCH.md) and [privacy](PRIVACY.md).
