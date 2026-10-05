# Sanad Tree

## Download

[Download ZIP](https://github.com/Nawafhikari/sanad-tree/archive/refs/heads/main.zip), then extract it completely. Open the extracted folder containing `package.json`.

Install [Node.js LTS](https://nodejs.org/en/download) first. Node.js 22.13 or newer is required; npm is included.

## Run on Windows

1. Double-click `SETUP.cmd` once. It installs dependencies and creates `API.env`.
2. Optionally add your own API key to `API.env` as shown below, then save it.
3. Double-click `START.cmd`.
4. Open **http://127.0.0.1:5173** in your browser.

Keep the server window open. Press `Ctrl+C` to stop it. Internet access is required to install dependencies and use an external AI provider.

## Run from a terminal

On Windows, macOS, or Linux, open a terminal in the extracted project folder:

```sh
node scripts/setup.mjs
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**.

## API key (optional)

The setup script copies `API.env.example` to `API.env` without overwriting an existing file. Open `API.env` in a text editor and fill in the key for your provider:

```dotenv
AI_KEY_GEMINI=YOUR_GEMINI_API_KEY
AI_KEY_GROQ=
AI_MODELS=
AI_KEY_PRIMARY=
```

Get a Gemini key from [Google AI Studio](https://aistudio.google.com/apikey), or a Groq key from [Groq Console](https://console.groq.com/keys). For Groq, fill in `AI_KEY_GROQ` instead. Leave keys empty to use the built-in source-based answers.

Save the filename as `API.env`, not `API.env.txt`. Restart the server after changing it. Each device uses its own key; keep `API.env` and `.env` out of GitHub.

Default provider/model settings are in `config/ai-models.json`. Keep `AI_MODELS` empty to use those defaults.

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

## النسخة الحالية — 5 أكتوبر 2026

**[Live demo — تجربة الموقع مباشرة](https://sanad-tree.nawaf-alsaadi.chatgpt.site/)** · [المستودع](https://github.com/Nawafhikari/sanad-tree)

مساعد سَنَد يجمع البحث بالمراجع وشرح السند والمقارنة في محادثة واحدة. يحدد النموذج نطاق الأدلة تلقائيًا، ويتحقق من فقرات الإجابة قبل عرضها. نتائج البحث تفتح الحديث والراوي في الشجرة دون مسح المحادثة. «حديث إلى شجرة» و«تدريب تفاعلي» أداتان بجوار المساعد، مع اختيار نموذج واحد. البحث يغطي المقاطع المسجلة في المكتبة، ولا يدّعي البحث في كامل الكتب أو الإنترنت.

تشمل هذه النسخة الخريطة المجمعة للطرق، وتحريك الرواة مع بقاء الوصلات، وملء الشاشة والقلم والممحاة والنصوص القابلة للتحريك، وألوان الجامعة وشعارها المفرغ، ومراجعة النصوص الإنجليزية ومصادر الرواة. التفاصيل والقيود في [توثيق الذكاء الاصطناعي](docs/AI-WORKBENCH.md).

الرابط العام يستخدم إعداد النموذج على الخادم. نسخة GitHub للتشغيل المحلي تقرأ مفتاح جهازك من API.env أو متغيرات البيئة. لا يحتوي المستودع على مفتاح المشروع. توفر النموذج الخارجي مرتبط بخدمة المزود؛ عند انشغالها تظهر رسالة واضحة، والإجابة من المصادر موسومة بأنها دون نموذج خارجي.

نجح 128 اختبارًا وفحص الأنواع وبناء النسخة المستضافة ونسخة GitHub القابلة للتشغيل. الفيديو ورفع الملفات على منصة المسابقة وتأكيد الاستلام خطوات منفصلة يقوم بها الفريق.
