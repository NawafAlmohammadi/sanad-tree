# ربط المساعد بمفتاحك

١. شغل SETUP.cmd أو node scripts/setup.mjs لإنشاء API.env. احتفظ بالمفتاح على جهازك فقط.
٢. افتح API.env واكتب AI_KEY_GEMINI= ثم مفتاحك على نفس السطر دون مسافات داخله. احفظ باسم API.env، وأوقف الخادم ثم أعد تشغيله.
٣. افتح الموقع واختر حديثًا، ثم Gemini من طريقة الإجابة، ثم «اشرح لي هذا السند». كل معلومة يجب أن تحمل المصدر. جرّب طلب البرمجة للتحقق من الامتناع.

## تبديل الموديلات

config/ai-models.json قائمة مزودين. كل عنصر يحدد id وlabel وprovider وmodel وkeyEnv؛ لا يضم المفتاح نفسه. المفتاح في API.env باسم keyEnv، مثل AI_KEY_GEMINI أو AI_KEY_GROQ.

المزودون المدعومون: gemini بواجهة Interactions، openai-compatible بواجهة chat/completions، وanthropic بواجهة messages. مثال بديل في API.env.example؛ لا تستبدل نموذجًا بمعرف غير متاح لحسابك.

يمكن استبدال القائمة كلها بقيمة JSON في AI_MODELS. القيمة [] تعطل الخارجي. الخادم لا يعرض القيم السرية في /api/models؛ يعرض الأسماء وجاهزية وجود مفتاح فقط. لا يستخدم أدوات بحث أو معرفة النموذج العامة في صياغة النصوص؛ يختار أدلة الكتالوج ثم يتحقق البرنامج من معرفاتها ومراجعها. لا يوافق على إجابة حرة أو حذف تنبيه الرواية الموضوعة.

مراجع المزود: [Google AI Studio](https://aistudio.google.com/apikey)، [Interactions](https://ai.google.dev/gemini-api/docs/interactions-overview)، [إدارة مفاتيح Gemini](https://ai.google.dev/gemini-api/docs/api-key). توفر المجانية وحصصها وموديلاتها يراجع من حساب المزود عند الاستخدام.
