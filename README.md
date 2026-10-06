# Sanad Tree

**[Live demo](https://sanad-tree.nawaf-alsaadi.chatgpt.site/)** · **[Current release — 6 October 2026](docs/RELEASE-2026-10-06.md)**

Explore recorded hadith transmission paths and their sources with an AI assistant grounded in the competition scientific reference guide. This package matches the live demo's interface, data, model configuration and application logic. Hosting adapters differ: the demo uses Cloudflare, and this package runs a local Node server.

- Merged chain maps, connected narrator dragging, fullscreen, drawing and movable notes.
- An in-map hadith library and side panels for narrators, book compilers and transmission wordings.
- Sequential path tracing with one illuminated path and exact source wording fades.
- A unified AI assistant, hadith-to-tree extraction and interactive practice, in Arabic and English.

## Scientific references

The same ten reports and 22 paths remain. Active references now use named Shamela editions, Dorar grades and published HadeethEnc translations. The assistant can retrieve approved original passages through Islamic Content MCP. Four verified English hadith translations include Arabic-version notes; the other six reports retain Arabic rather than an invented translation.

[Guide compliance and pending human review](docs/SCIENTIFIC-REFERENCE-COMPLIANCE.md) · [Source audit](docs/SOURCE-REVIEW.md) · [Approved APIs](docs/API-SOURCES.md) · [Privacy](docs/PRIVACY.md).

**Formal scientific and linguistic human approval remains required.** Model checks and automated tests do not replace it. Dorar live access was blocked during review; verified library quotations remain available.

## Download

[Download ZIP](https://github.com/NawafAlmohammadi/sanad-tree/archive/refs/heads/main.zip), then extract it completely. Open the extracted folder containing `package.json`.

Install [Node.js LTS](https://nodejs.org/en/download) first. Node.js 22.13 or newer is required; npm is included.

## Run on Windows

1. Double-click `SETUP.cmd` once. It installs dependencies and creates `API.env`.
2. Add your API key to `API.env` as shown below, then save it. A valid provider key is required for AI features.
3. Double-click `START.cmd`.
4. Open **http://127.0.0.1:5173** in your browser.

Keep the server window open. Press `Ctrl+C` to stop it. Internet access is required to install dependencies and use an external AI provider.

## Run from a terminal

On Windows, macOS, or Linux, open a terminal in the extracted project folder:

```sh
node scripts/setup.mjs
npm ci
```

Add a valid provider key to `API.env`, then run:

```sh
npm run dev
```

Open **http://127.0.0.1:5173**.

## API key (required)

A valid API key is required for generated explanations, semantic evidence search, AI extraction and adaptive practice.

The setup script copies `API.env.example` to `API.env` without overwriting an existing file. Open `API.env` in a text editor and fill in the key for your provider:

```dotenv
AI_KEY_GEMINI=YOUR_GEMINI_API_KEY
AI_KEY_GROQ=
AI_MODELS=
AI_KEY_PRIMARY=
```

Get a Gemini key from [Google AI Studio](https://aistudio.google.com/apikey), or a Groq key from [Groq Console](https://console.groq.com/keys). For Groq, fill in `AI_KEY_GROQ` instead. One configured provider key is enough; the other key fields may remain empty.

Save the filename as `API.env`, not `API.env.txt`. Restart the server after changing it. Each device uses its own key; keep `API.env` and `.env` out of GitHub.

Default provider/model settings are in `config/ai-models.json`. Keep `AI_MODELS` empty to use those defaults.

The live demo uses its existing server-side configuration. Browsing the recorded library and the clearly labelled source-only mode remain available without an external model; these are not generated AI responses.

## Verify the project

```sh
npm run check:data
npm run check:types
npm test
```

## Build and run production

Stop the development server first, then run:

```sh
npm run build
npm run start
```

Open **http://127.0.0.1:5173**. Keep the server running while using the site.

## Troubleshooting

- **Node/npm not found:** install Node.js, then reopen the terminal.
- **PowerShell blocks npm.ps1:** use `npm.cmd ci` and `npm.cmd run dev`, or use Command Prompt.
- **Port already in use:** close the previous server, or run `npm run dev -- --port 5174` and open port 5174.
- **API option unavailable:** check the key in `API.env`, save the file, and restart the server. Provider errors or quota limits can be checked in your provider account.

## Documentation

- [Current release](docs/RELEASE-2026-10-06.md)
- [AI implementation and source boundaries](docs/AI-WORKBENCH.md)
- [Sources](docs/SOURCES-REGISTER.md)
- [API setup](docs/API-SETUP.md)
- [Tools and licences](docs/TOOLS-AND-LICENSES.md)
