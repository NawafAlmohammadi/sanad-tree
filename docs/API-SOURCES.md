# Approved source services

Source APIs are separate from AI model APIs. At least one valid Gemini/Groq/configured provider key is REQUIRED for generated AI features. The public source adapters below do not receive that key. No Sunnah.com key or endpoint is used by the current application.

| Service | Runtime use | Authentication/access |
| --- | --- | --- |
| [Islamic Content MCP](https://mcp.islamiccontent.org/mcp) | JSON-RPC `tools/call`: `search`, then `fetch` of exact result IDs/printed URLs; read-only `get_hadith` adapter is allowlisted | Public; tested with JSON and SSE envelopes. No authorization header. |
| [HadeethEnc API](https://hadeethenc.com/api-docs/) | `GET https://hadeethenc.com/api/v1/hadeeths/one/?language=ar&id=4709` and published English equivalents | Public. Returned ID, text, grade and attribution are checked; English quotations remain bound to the publisher's Arabic version. |
| [Dorar official API](https://dorar.net/article/389) | `GET https://dorar.net/dorar_api.json?skey=...` adapter | Public documentation; this environment returned HTTP 403 on 6 October. No generated replacement or invented result is shown. |
| [Shamela](https://shamela.ws) | Bounded read of a specific approved book/page, extracting its original `nass` content | Public page retrieval, not a claimed official REST API. Only reviewed edition IDs are allowed. |

Search results are locators, not evidence. The server fetches original passages, checks the exact ID and printed URL, rejects unknown publishers, and presents only paragraphs supported by their cited passages. Source requests have 12-second timeouts, bounded responses and no redirects. Fixed API hosts and strict page allowlists prevent arbitrary URL access. Unavailable sources are disclosed. Published matn translations usually omit the full isnad and cannot create a historical chain.

The library keeps a versioned source audit; live retrieval does not alter it. Full-text extraction creates a separate provisional map, retains literal name/link spans, and assigns no newly inferred narrator grades. Local source mode is clearly labelled as non-AI.

## Guide reference directory

The following exact guide links are reference-only unless marked runtime above. Listing a service is not a claim that an adapter or permission has been provided.

| Guide page | Service/reference | Scope |
| --- | --- | --- |
| 3–4 | [Dawa](https://dawa.center) · [Islamic Content](https://islamic-content.com) | Introduction and approved content |
| 3 | [Quranpedia](https://quranpedia.net) · [Dorar tafsir](https://dorar.net/tafseer) · [Dorar creed](https://dorar.net/aqeeda) | Quran, tafsir, creed |
| 4 | [Dorar fiqh](https://dorar.net/feqhia) · [Dorar history](https://dorar.net/history) | Specialist topics |
| 4 | [Bayenat: questions and answers about Islam](https://dawa.center/file/7937) | Primary reference for misconceptions; no blanket knowledge claim |
| 4 | [Approved terminology dictionary](https://islamic-content.com/dictionary) | Original terminology, no invented equivalents |
| 9 | [QuranEnc API](https://quranenc.com/en/home/api) | Published Quran translations |
| 9 | [Byenah API](https://byenah.com/ar/api) | Multi-language content |
| 9 | [Islamhouse API documentation](https://documenter.getpostman.com/view/7929737/TzkyMfPc) | Content metadata/API access |
| 10 | [Islamenc](https://islamenc.com/ar) · [Terminologyenc](https://terminologyenc.com/ar) | Encyclopaedias/terms |
| 10 | [ICADB API](https://icadb.com/api/docs) | Islamic-content APIs/data |
| 11 | [Risala](https://risala.prh.gov.sa/ar) | Scientific content platform |
| 12 | [Tafsir](https://tafsir.net) · [Modoee](https://modoee.com) · [Surah](https://surahapp.com) · [Wahy](https://wahy.net) | Quran and tafsir |
| 12 | [MP3Quran API](https://mp3quran.net/api) | Recitation/audio |
| 13 | [Kuwait Awqaf](https://bohoth.awqaf.gov.kw) · [IslamQA](https://islamqa.info) · [Ibn Baz](https://binbaz.org.sa) · [Ibn Uthaymeen](https://binothaimeen.net) | Scholarly reference; no personal automated fatwa |
| 14 | [KSAA](https://ksaa.gov.sa) · [Dictionary](https://dictionary.ksaa.gov.sa) · [Siwar](https://siwar.ksaa.gov.sa) · [Falak](https://falak.ksaa.gov.sa) | Arabic-language resources |
| 14 | [King Fahd Complex](https://qurancomplex.gov.sa) · [Translations](https://qurancomplex.gov.sa/quran-translations/) · [Fonts](https://fonts.qurancomplex.gov.sa) · [Developers](https://qurancomplex.gov.sa/quran-dev) | Original Quran and approved translations/development |
| 15 | [Shamela download](https://shamela.ws/page/download) | Approved editions; not a runtime API |

All provider requests remain server-side. Never commit `API.env`, `.env` or real keys. Respect publisher terms, quotas and attribution. Availability is not a licence to bulk-copy a source.
