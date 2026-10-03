# Delivery checklist

Prepared on 3 October 2026. This file records readiness; it is not proof of submission to the organiser.

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
| PDF or PowerPoint presentation | Prepared separately in the submission bundle: 12 main slides and 6 evidence/Q&A appendices. |
| Working live solution | Public visitor access enabled with the team's approval; page, model list and assistant tested without authentication using the existing server-side Gemini key. |
| Public GitHub repository | Available; download/run instructions are in English. Check the latest commit before submission. |
| Practical video, no longer than two minutes | To be recorded and supplied by the team. |
| Setup, operation, sources, tools and licences | Included in README, API.env.example, NOTICE and docs. |
| Organiser upload and confirmation | Pending: the submission portal and completed video have not been provided. |

## Current checks

- 61 automated cases passed for the current source and portable version.
- Data checks: 10 reports, 11 paths, 51 identities and 68 source entries.
- Public hosted requests returned Arabic and English explanations through the model, with references, without authentication.
- An unrelated Python-code request was refused without a model call.
- No API key was present in the checked page or assistant responses. Keys are server-side and excluded from the download.
- The automatic external-link scan reached 8 of 65 unique reference URLs. Other requests were blocked or did not connect; this does not establish that those references are invalid. Book titles and locations remain available for manual review.

These are engineering checks, not an independent scholarly approval or an educational impact study. The source-based answering mode is labelled separately from model mode. Provider availability depends on its quota.

## Before the organiser upload

1. Open the live link in a signed-out browser. It must show the library without the owner's account.
2. Select a report, open a narrator, open the text/source tab, ask the active model and verify an out-of-scope refusal. Repeat one question in English.
3. Download this repository on another device and follow README. Each device supplies its own API.env key.
4. Confirm all five required items, including the video duration and readable PDF.
5. Upload through the official submission portal, check the uploaded files and links, then save its actual confirmation message or receipt.

## Final presentation

Rehearse slides 1–12 in five minutes, including a short live demonstration. Keep slides 13–18 for the three-minute question period. The seven judging weights in the supplied opening-session image are 25%, 15%, 15%, 10%, 20%, 10% and 5%; the appendix maps each to inspectable evidence. Do not claim measured learning outcomes or a new automatic hadith judgement.
