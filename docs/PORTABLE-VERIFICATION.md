# Portable and hosted verification

Updated on 3 October 2026. Engineering checks do not establish independent scholarly approval.

## Current source and portable package

- All 61 automated cases passed, including narrator identity, references, colours, report-text cards, grounded teaching plans and out-of-scope refusal.
- The catalog contains 10 reports, 11 paths, 51 identities and 68 source entries: 4 authentic, 3 weak and 3 fabricated reports. The portable catalog matches the hosted source exactly.
- The portable test command includes the teaching-plan review suite.
- The archive includes source, data, package-lock, API templates, English README and font licence notices. It excludes actual keys, installed dependencies, build output, Git and hosting-account configuration.

## Portable run checks on 2 October 2026

A clean installation used npm ci and the included lockfile, separately from the hosted workspace. Windows checks used Node.js 25.9.0. The package minimum is 22.13.0; an LTS release is recommended. A second physical computer, macOS and Linux were not tested.

- TypeScript checks and the portable production build passed without Cloudflare configuration or hosting secrets.
- Development, production and START.cmd operation succeeded on Windows.
- The ZIP was extracted into a new folder whose name contained a space. Lockfile installation, private API.env creation and the extracted application all worked.
- Page and model-list requests returned HTTP 200. Source-based answers showed six referenced relationships for the first Bukhari report.
- An unrelated Python-code request was refused before provider use. A request with a disallowed origin returned HTTP 403.
- A fabricated report's answer retained its attribution warning and sources.
- A deliberately invalid test value in API.env made Gemini selectable without exposing the value in HTML or model-list responses. Setup preserved an existing configuration file.
- The development server blocked API.env downloads and the production server returned 404. No test value appeared in public responses. The local test configuration was restored to empty keys.

No real-key provider request was sent from the portable test package. Another device supplies its own key and quota. A selectable model alone is not proof of provider connectivity; source-based answers work without a key.

## Public hosted checks on 3 October 2026

The owner approved public access. Requests used no cookie, bypass token or authentication header.

- The live page and /api/models returned HTTP 200; Gemini was ready.
- Arabic and English chain-explanation requests returned status answered and engine model, with six evidence claims, one source and three teaching lessons in each response.
- A Python-code request returned status refused and engine none, with no evidence or lessons.
- No API key appeared in the checked page or API responses. The existing server-side key was preserved.

These are point-in-time connection checks, not a guarantee of future provider quota or performance on every device. The repository, source-based mode and external-model mode are distinct, and their status is visible to the user.

See TOOLS-AND-LICENSES.md, SOURCES-REGISTER.md and SUBMISSION.md for the remaining delivery checks.
