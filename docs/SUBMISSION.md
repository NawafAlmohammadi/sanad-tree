# Delivery checklist

Updated on 6 October 2026. This file records readiness; it is not proof of submission to the organiser.

## Links

- Live solution: https://sanad-tree.nawaf-alsaadi.chatgpt.site/
- Public code and run files: https://github.com/Nawafhikari/sanad-tree
- Download and run instructions: ../README.md
- Sources: SOURCES-REGISTER.md and TEN-HADITHS-REVIEW.md
- Tools, dependency licences, font notices and source rights: TOOLS-AND-LICENSES.md and ../NOTICE.md

The live solution is a server application. The GitHub repository provides the code; it does not replace the required live link. GitHub Pages alone cannot run the included assistant backend.

## Required delivery items

| Item | Readiness |
| --- | --- |
| PDF or PowerPoint presentation | Prepared separately as an editable PowerPoint file; use the team's chosen final version. |
| Working live solution | Public visitor access enabled with the team's approval; page, model list and assistant tested without authentication using the existing server-side Gemini key. |
| Public GitHub repository | Synchronized with the published demo's application and data; English download/run instructions require a valid provider API key for AI features. |
| Practical video, no longer than two minutes | To be recorded and supplied by the team. |
| Setup, operation, sources, tools and licences | Included in README, API.env.example, NOTICE and docs. |
| Organiser upload and confirmation | Pending: the submission portal and completed video have not been provided. |

## Current checks

- 131 automated cases passed for the final portable source; data validation, TypeScript and production build passed.
- Data checks: 10 reports, 22 paths, 74 identities and 132 source entries.
- The final portable source matches the demo application, data, model configuration and assets. Local API environment adapters are documented in RELEASE-2026-10-06.md.

## Earlier hosted connection checks

The following were recorded on 3 October 2026; they are not new provider requests on the submission day.
- Public hosted requests returned Arabic and English explanations through the model, with references, without authentication.
- An unrelated Python-code request was refused without a model call.
- No API key was present in the checked page or assistant responses. Keys are server-side and excluded from the download.
- The automatic external-link scan reached 8 of 65 unique reference URLs. Other requests were blocked or did not connect; this does not establish that those references are invalid. Book titles and locations remain available for manual review.

These are engineering checks, not an independent scholarly approval or an educational impact study. The source-based answering mode is labelled separately from model mode. Provider availability depends on its quota.

## Before the organiser upload

1. Open the live link in a signed-out browser. It must show the library without the owner's account.
2. Select a report, open a narrator, open the text/source tab, ask the active model and verify an out-of-scope refusal. Repeat one question in English.
3. Download this repository on another device and follow README. Each device supplies its own API.env key.
4. Confirm all five required items, including the video duration and readable PowerPoint slides.
5. Upload through the official submission portal, check the uploaded files and links, then save its actual confirmation message or receipt.

## Final presentation

Rehearse the team's final slides with a short live demonstration and leave time for questions. Keep source references available for review. Do not claim measured learning outcomes or a new automatic hadith judgement.
