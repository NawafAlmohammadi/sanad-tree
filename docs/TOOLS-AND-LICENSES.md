# Tools and licence register

Reviewed on 3 October 2026 against the portable package-lock.json and bundled font notices.

## Project code

The team retains the rights to its original code. No redistribution licence has been selected. A public GitHub repository does not itself grant an open-source licence. This register does not apply another owner's licence to the team's code or to hadith source material.

## Direct dependencies

| Package | Locked version | Licence declared by package |
| --- | --- | --- |
| @types/node | 22.19.19 | MIT |
| @types/react | 19.2.14 | MIT |
| @types/react-dom | 19.2.3 | MIT |
| @vitejs/plugin-react | 6.0.2 | MIT |
| @vitejs/plugin-rsc | 0.5.26 | MIT |
| lucide-react | 1.31.0 | ISC |
| next | 16.3.4 | MIT |
| react | 19.2.6 | MIT |
| react-dom | 19.2.6 | MIT |
| react-server-dom-webpack | 19.2.6 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| vinext | 1.0.0-beta.5 | MIT |
| vite | 8.0.13 | MIT |

## Fonts and visual assets

IBM Plex Sans Arabic, Noto Naskh Arabic, Source Sans 3, DM Sans and Cormorant Garamond are bundled with their SIL Open Font Licence notices in public/fonts. Preserve these notices when copying the package.

The geometric SVG ornaments were authored for the project. The presentation uses actual project screenshots and its existing visual identity. The opening-session images supplied by the team are cited as the source of delivery requirements and judging weights; their organisers' branding remains theirs.

## Hadith data and scholarly references

The active catalog records 104 source entries from guide-approved publishers. Original texts and narrator entries use named Shamela editions; grades cite Dorar and the relevant edition; four published English translations come from HadeethEnc with version notes. See SOURCE-REVIEW.md. Publisher rights are retained; public retrieval or an API does not grant blanket redistribution rights. Confirm applicable permissions for distribution and larger imports. Historical test fixtures are not runtime evidence.

## AI and hosting services

The hosted demonstration uses Gemini with the existing server-side key. Model access is subject to the provider's terms and account quota, separately from software licences. Supported adapters also include OpenAI-compatible and Anthropic APIs, but an adapter does not establish an active account or key.

In AI mode the server sends the question and retrieved project evidence to the selected provider. The current Gemini request sets store:false; this does not establish a zero-retention policy for Google's service. Google's unpaid-service terms describe content use and human review. Do not submit personal or confidential material. The intended demonstration audience is adult university students and judges.

- Gemini API terms: https://ai.google.dev/gemini-api/terms (reviewed 3 October 2026).
- Approved reference services and source rights: see [API directory](API-SOURCES.md) and [source audit](SOURCE-REVIEW.md).
- Font licence notices: public/fonts/*-OFL.txt.
- Installed package licence files: node_modules after npm ci.

## Full locked dependency inventory

This is a metadata inventory, not a substitute for each package's complete copyright and licence notice. Optional platform packages can appear here without being installed on the current device. Keep upstream notices if distributing their code or a bundled binary.

| Package | Version | Declared licence | Role |
| --- | --- | --- | --- |
| @emnapi/core | 1.10.0 | MIT | Build / development |
| @emnapi/runtime | 1.10.0 | MIT | Build / development |
| @emnapi/runtime | 1.11.3 | MIT | Runtime / dependency |
| @emnapi/wasi-threads | 1.2.1 | MIT | Build / development |
| @img/colour | 1.1.0 | MIT | Runtime / dependency |
| @img/sharp-darwin-arm64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-darwin-x64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-freebsd-wasm32 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-libvips-darwin-arm64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-darwin-x64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-arm | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-arm64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-ppc64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-riscv64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-s390x | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linux-x64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linuxmusl-arm64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-libvips-linuxmusl-x64 | 1.3.4 | LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-linux-arm | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linux-arm64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linux-ppc64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linux-riscv64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linux-s390x | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linux-x64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linuxmusl-arm64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-linuxmusl-x64 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-wasm32 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later AND MIT | Runtime / dependency |
| @img/sharp-webcontainers-wasm32 | 0.35.5 | Apache-2.0 | Runtime / dependency |
| @img/sharp-win32-arm64 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-win32-ia32 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | Runtime / dependency |
| @img/sharp-win32-x64 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | Runtime / dependency |
| @jridgewell/gen-mapping | 0.3.13 | MIT | Runtime / dependency |
| @jridgewell/resolve-uri | 3.1.2 | MIT | Runtime / dependency |
| @jridgewell/source-map | 0.3.11 | MIT | Runtime / dependency |
| @jridgewell/sourcemap-codec | 1.6.0 | MIT | Runtime / dependency |
| @jridgewell/trace-mapping | 0.3.31 | MIT | Runtime / dependency |
| @napi-rs/wasm-runtime | 1.2.4 | MIT | Build / development |
| @next/env | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-darwin-arm64 | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-darwin-x64 | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-linux-arm64-gnu | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-linux-arm64-musl | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-linux-x64-gnu | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-linux-x64-musl | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-win32-arm64-msvc | 16.3.4 | MIT | Runtime / dependency |
| @next/swc-win32-x64-msvc | 16.3.4 | MIT | Runtime / dependency |
| @nodelib/fs.scandir | 2.1.5 | MIT | Build / development |
| @nodelib/fs.stat | 2.0.5 | MIT | Build / development |
| @nodelib/fs.walk | 1.2.8 | MIT | Build / development |
| @oxc-project/types | 0.130.0 | MIT | Build / development |
| @resvg/resvg-wasm | 2.4.0 | MPL-2.0 | Build / development |
| @rolldown/binding-android-arm64 | 1.0.1 | MIT | Build / development |
| @rolldown/binding-darwin-arm64 | 1.0.1 | MIT | Build / development |
| @rolldown/binding-darwin-x64 | 1.0.1 | MIT | Build / development |
| @rolldown/binding-freebsd-x64 | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-arm-gnueabihf | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-arm64-gnu | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-arm64-musl | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-ppc64-gnu | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-s390x-gnu | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-x64-gnu | 1.0.1 | MIT | Build / development |
| @rolldown/binding-linux-x64-musl | 1.0.1 | MIT | Build / development |
| @rolldown/binding-openharmony-arm64 | 1.0.1 | MIT | Build / development |
| @rolldown/binding-wasm32-wasi | 1.0.1 | MIT | Build / development |
| @rolldown/binding-win32-arm64-msvc | 1.0.1 | MIT | Build / development |
| @rolldown/binding-win32-x64-msvc | 1.0.1 | MIT | Build / development |
| @rolldown/pluginutils | 1.0.0-rc.18 | MIT | Build / development |
| @rolldown/pluginutils | 1.0.1 | MIT | Build / development |
| @shuding/opentype.js | 1.4.0-beta.0 | MIT | Build / development |
| @swc/helpers | 0.5.23 | Apache-2.0 | Runtime / dependency |
| @tybys/wasm-util | 0.10.4 | MIT | Build / development |
| @types/estree | 1.0.9 | MIT | Runtime / dependency |
| @types/json-schema | 7.0.15 | MIT | Runtime / dependency |
| @types/node | 22.19.19 | MIT | Runtime / dependency |
| @types/react | 19.2.14 | MIT | Build / development |
| @types/react-dom | 19.2.3 | MIT | Build / development |
| @unpic/core | 1.0.3 | MIT | Build / development |
| @unpic/react | 1.0.2 | MIT | Build / development |
| @vercel/og | 0.8.6 | MPL-2.0 | Build / development |
| @vinext/types | 1.0.1 | MIT | Build / development |
| @vitejs/plugin-react | 6.0.2 | MIT | Build / development |
| @vitejs/plugin-rsc | 0.5.26 | MIT | Build / development |
| @webassemblyjs/ast | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/floating-point-hex-parser | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/helper-api-error | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/helper-buffer | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/helper-numbers | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/helper-wasm-bytecode | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/helper-wasm-section | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/ieee754 | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/leb128 | 1.13.2 | Apache-2.0 | Runtime / dependency |
| @webassemblyjs/utf8 | 1.13.2 | MIT | Runtime / dependency |
| @webassemblyjs/wasm-edit | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/wasm-gen | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/wasm-opt | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/wasm-parser | 1.14.1 | MIT | Runtime / dependency |
| @webassemblyjs/wast-printer | 1.14.1 | MIT | Runtime / dependency |
| @xtuc/ieee754 | 1.2.0 | BSD-3-Clause | Runtime / dependency |
| @xtuc/long | 4.2.2 | Apache-2.0 | Runtime / dependency |
| acorn | 8.18.0 | MIT | Runtime / dependency |
| acorn-loose | 8.5.2 | MIT | Runtime / dependency |
| ajv | 8.20.0 | MIT | Runtime / dependency |
| ajv-formats | 3.0.1 | MIT | Runtime / dependency |
| ajv-keywords | 5.1.0 | MIT | Runtime / dependency |
| base64-js | 0.0.8 | MIT | Build / development |
| baseline-browser-mapping | 2.11.27 | Apache-2.0 | Runtime / dependency |
| braces | 3.0.3 | MIT | Build / development |
| browserslist | 4.29.3 | MIT | Runtime / dependency |
| buffer-from | 1.1.2 | MIT | Runtime / dependency |
| camelize | 1.0.1 | MIT | Build / development |
| caniuse-lite | 1.0.30001814 | CC-BY-4.0 | Runtime / dependency |
| chrome-trace-event | 1.0.4 | MIT | Runtime / dependency |
| client-only | 0.0.1 | MIT | Runtime / dependency |
| color-name | 1.1.4 | MIT | Build / development |
| commander | 2.20.3 | MIT | Runtime / dependency |
| css-background-parser | 0.1.0 | MIT | Build / development |
| css-box-shadow | 1.0.0-3 | MIT | Build / development |
| css-color-keywords | 1.0.0 | ISC | Build / development |
| css-gradient-parser | 0.0.16 | MIT | Build / development |
| css-to-react-native | 3.2.0 | MIT | Build / development |
| csstype | 3.2.3 | MIT | Build / development |
| detect-libc | 2.1.2 | Apache-2.0 | Runtime / dependency |
| electron-to-chromium | 1.5.444 | ISC | Runtime / dependency |
| emoji-regex-xs | 2.0.1 | MIT | Build / development |
| enhanced-resolve | 5.26.0 | MIT | Runtime / dependency |
| es-module-lexer | 1.7.0 | MIT | Build / development |
| es-module-lexer | 2.3.2 | MIT | Runtime / dependency |
| escalade | 3.2.0 | MIT | Runtime / dependency |
| escape-html | 1.0.3 | MIT | Build / development |
| estree-walker | 3.0.3 | MIT | Build / development |
| events | 3.3.0 | MIT | Runtime / dependency |
| fast-deep-equal | 3.1.3 | MIT | Runtime / dependency |
| fast-glob | 3.3.3 | MIT | Build / development |
| fast-uri | 3.1.8 | BSD-3-Clause | Runtime / dependency |
| fastq | 1.20.3 | ISC | Build / development |
| fdir | 6.5.0 | MIT | Build / development |
| fflate | 0.7.5 | MIT | Build / development |
| fill-range | 7.1.1 | MIT | Build / development |
| fsevents | 2.3.3 | MIT | Build / development |
| glob-parent | 5.1.2 | ISC | Build / development |
| graceful-fs | 4.2.11 | ISC | Runtime / dependency |
| has-flag | 4.0.0 | MIT | Runtime / dependency |
| hex-rgb | 4.3.0 | MIT | Build / development |
| image-size | 2.0.2 | MIT | Build / development |
| ipaddr.js | 2.5.0 | MIT | Build / development |
| is-extglob | 2.1.1 | MIT | Build / development |
| is-glob | 4.0.3 | MIT | Build / development |
| is-number | 7.0.0 | MIT | Build / development |
| jest-worker | 27.5.1 | MIT | Runtime / dependency |
| js-tokens | 9.0.1 | MIT | Build / development |
| json-schema-traverse | 1.0.0 | MIT | Runtime / dependency |
| lightningcss | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-android-arm64 | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-darwin-arm64 | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-darwin-x64 | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-freebsd-x64 | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-linux-arm-gnueabihf | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-linux-arm64-gnu | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-linux-arm64-musl | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-linux-x64-gnu | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-linux-x64-musl | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-win32-arm64-msvc | 1.33.0 | MPL-2.0 | Build / development |
| lightningcss-win32-x64-msvc | 1.33.0 | MPL-2.0 | Build / development |
| linebreak | 1.1.0 | MIT | Build / development |
| lucide-react | 1.31.0 | ISC | Runtime / dependency |
| magic-string | 0.30.21 | MIT | Build / development |
| merge-stream | 2.0.0 | MIT | Runtime / dependency |
| merge2 | 1.4.1 | MIT | Build / development |
| micromatch | 4.0.8 | MIT | Build / development |
| mime-db | 1.54.0 | MIT | Runtime / dependency |
| minimizer-webpack-plugin | 5.12.0 | MIT | Runtime / dependency |
| nanoid | 3.3.19 | MIT | Runtime / dependency |
| neo-async | 2.6.2 | MIT | Runtime / dependency |
| next | 16.3.4 | MIT | Runtime / dependency |
| node-releases | 2.0.57 | MIT | Runtime / dependency |
| pako | 0.2.9 | MIT | Build / development |
| parse-css-color | 0.2.1 | MIT | Build / development |
| picocolors | 1.1.1 | ISC | Runtime / dependency |
| picomatch | 2.3.2 | MIT | Build / development |
| picomatch | 4.0.7 | MIT | Build / development |
| postcss | 8.5.23 | MIT | Runtime / dependency |
| postcss-value-parser | 4.2.0 | MIT | Build / development |
| queue-microtask | 1.2.3 | MIT | Build / development |
| react | 19.2.6 | MIT | Runtime / dependency |
| react-dom | 19.2.6 | MIT | Runtime / dependency |
| react-server-dom-webpack | 19.2.6 | MIT | Runtime / dependency |
| require-from-string | 2.0.2 | MIT | Runtime / dependency |
| reusify | 1.1.0 | MIT | Build / development |
| rolldown | 1.0.1 | MIT | Build / development |
| run-parallel | 1.2.0 | MIT | Build / development |
| satori | 0.16.0 | MPL-2.0 | Build / development |
| scheduler | 0.27.0 | MIT | Runtime / dependency |
| schema-utils | 4.5.0 | MIT | Runtime / dependency |
| semver | 7.8.5 | ISC | Runtime / dependency |
| sharp | 0.35.5 | Apache-2.0 | Runtime / dependency |
| source-map | 0.6.1 | BSD-3-Clause | Runtime / dependency |
| source-map-js | 1.2.2 | BSD-3-Clause | Runtime / dependency |
| source-map-support | 0.5.21 | MIT | Runtime / dependency |
| srvx | 0.11.22 | MIT | Build / development |
| string.prototype.codepointat | 0.2.1 | MIT | Build / development |
| strip-literal | 3.1.0 | MIT | Build / development |
| styled-jsx | 5.1.6 | MIT | Runtime / dependency |
| supports-color | 8.1.1 | MIT | Runtime / dependency |
| tapable | 2.3.3 | MIT | Runtime / dependency |
| terser | 5.51.2 | BSD-2-Clause | Runtime / dependency |
| tiny-inflate | 1.0.3 | MIT | Build / development |
| tinyglobby | 0.2.17 | MIT | Build / development |
| to-regex-range | 5.0.1 | MIT | Build / development |
| tslib | 2.8.1 | 0BSD | Runtime / dependency |
| turbo-stream | 3.2.1 | MIT | Build / development |
| typescript | 5.9.3 | Apache-2.0 | Build / development |
| undici-types | 6.21.0 | MIT | Runtime / dependency |
| unicode-trie | 2.0.0 | MIT | Build / development |
| unpic | 4.2.2 | MIT | Build / development |
| update-browserslist-db | 1.3.3 | MIT | Runtime / dependency |
| vinext | 1.0.0-beta.5 | MIT | Build / development |
| vite | 8.0.13 | MIT | Build / development |
| vite-plugin-commonjs | 0.10.4 | MIT | Build / development |
| vite-plugin-dynamic-import | 1.6.0 | MIT | Build / development |
| vitefu | 1.1.3 | MIT | Build / development |
| watchpack | 2.5.2 | MIT | Runtime / dependency |
| web-vitals | 4.2.4 | Apache-2.0 | Build / development |
| webpack | 5.111.1 | MIT | Runtime / dependency |
| webpack-sources | 3.6.0 | MIT | Runtime / dependency |
| yoga-layout | 3.2.1 | MIT | Build / development |

## University artwork

The header uses the original Islamic University of Madinah SVG, served by the university at https://cdn.iu.edu.sa/NDS-iu/assets/img/iu-logo.svg and linked from https://iu.edu.sa/. The artwork is bundled unchanged. The previously supplied PNGs remain available for the favicon and asset history. University marks remain the property of the university; no open-source licence for those marks is granted by this project.
