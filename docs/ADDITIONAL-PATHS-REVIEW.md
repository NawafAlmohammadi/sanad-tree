# Additional-path review — 4 October 2026

This is a bounded manual review of the ten existing reports on Sunnah.com, not a claim that every published collection or route has been exhaustively enumerated. Only separately verified full chains were added. The ten primary Arabic and exact Sunnah.com English texts are unchanged. Wording variants are identified in each path note and must be read at that path's source.

| Existing report | Added primary-source pages | New paths |
| --- | --- | --- |
| bukhari-1 | [صحيح البخاري 54](https://sunnah.com/bukhari:54), [صحيح البخاري 2529](https://sunnah.com/bukhari:2529), [صحيح البخاري 5070](https://sunnah.com/bukhari:5070), [صحيح البخاري 6689](https://sunnah.com/bukhari:6689), [صحيح البخاري 6953](https://sunnah.com/bukhari:6953) | 5 |
| bukhari-10 | [صحيح البخاري 6484](https://sunnah.com/bukhari:6484) | 1 |
| bukhari-6018 | [صحيح البخاري 6475](https://sunnah.com/bukhari:6475), [صحيح البخاري 6136](https://sunnah.com/bukhari:6136) | 2 |
| bukhari-6116 | [جامع الترمذي 2020](https://sunnah.com/tirmidhi:2020) | 1 |
| tirmidhi-3371 | No additional complete distinct chain verified in this review | 0 |
| tirmidhi-2687 | [سنن ابن ماجه 4169](https://sunnah.com/ibnmajah:4169) | 1 |
| ibnmajah-802 | [جامع الترمذي 2617](https://sunnah.com/tirmidhi:2617) | 1 |
| ibnmajah-1388 | No additional complete distinct chain verified in this review | 0 |
| ibnmajah-4313 | No additional complete distinct chain verified in this review | 0 |
| ibnmajah-4054 | No additional complete distinct chain verified in this review | 0 |

## Decisions and limits

- 11 paths added; 22 total paths across the same ten reports. The two original Bukhari 10 branches remain separate.
- The compiler of each added path is recorded separately. Tirmidhi 2020 and 2617 start with al-Tirmidhi; Ibn Majah 4169 starts with Ibn Majah. No Bukhari-to-Tirmidhi-teacher edge is invented.
- Bukhari 10's appended Abu Muawiyah and Abd al-Ala routes are suspended (muallaq), not a direct narrated-to-us link from al-Bukhari. They were not added to the current full-chain graph.
- A companion-plus-text digest in Mishkat is not another fully specified chain. It was not expanded with guessed transmitters.
- The Tirmidhi chapter listing and some direct reference numbers disagreed for the mosque report. Tirmidhi 2617 was opened and its actual chain checked; alternate results using 3093/3095 were not used.
- The intentions report's Sufyan in Bukhari 2529 is [al-Thawri](https://sunnah.com/narrator/3436). Bukhari 1's Sufyan is [ibn Uyaynah](https://sunnah.com/narrator/3443). The identities are never merged.
- Archived regression fixture only (Nasai 518 is no longer in the live library): Nasai 518 has a grandfather named Muadh, then Muadh ibn Afra. The linked companion profile cannot establish the grandfather's identity or appraisal. No Sunnah.com appraisal for the grandfather was verified; his appraisal is unset.
- Abu al-Haytham, Sulayman ibn Amr al-Laythi, is now verified as [Sunnah.com narrator 3617](https://sunnah.com/narrator/3617), directly linked from Ibn Majah 802 and Tirmidhi 2617. His teacher Abu Said and student Darraj match these chains. The profile summary is trustworthy, with appraisals attributed to Ibn Hajar, Yahya ibn Main and al-Daraqutni. The unrelated Sulayman ibn Amr al-Jushami is not used. This narrator appraisal does not replace or alter either attributed hadith grade.
- Existing biographies from other attributed sources are retained. Narrator appraisals introduced or revised by this review cite Sunnah.com only. Existing Sunnah.com-backed appraisals keep their source attribution. Node colour is a display category, not a new scholar's verdict or a grade on an entire chain.
- Darussalam grades Tirmidhi 2617 Daif, while al-Tirmidhi describes it as gharib hasan. Both statements are retained with their attribution; the application does not adjudicate the difference.
- For Tirmidhi 3371 and the three fabricated reports (Ibn Majah 1388, 4313, 4054), this review found no additional separately verified complete distinct chain to add. This is not a declaration that none exists elsewhere. Unverified, duplicate, suspended or incomplete routes were left out.

## Narrator appraisal register

Every narrator below is keyed by identity, with the exact source for its displayed appraisal. A missing appraisal is explicitly unrecorded; it is never inferred from a chain's grade.

| Identity | Displayed Arabic appraisal | Appraisal source |
| --- | --- | --- |
| al-humaydi | خلاصة Sunnah.com: ثقة حافظ، أجل أصحاب ابن عيينة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/4698) |
| sufyan | ابن حجر: ثقة حافظ فقيه إمام حجة؛ كان ربما دلس لكن عن الثقات، وتغير حفظه بأخرة. تحفظ هذه القيود. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3443) |
| yahya-al-ansari | خلاصة Sunnah.com: ثقة ثبت. | [Sunnah.com — الرواة](https://sunnah.com/narrator/8272) |
| muhammad-al-taymi | خلاصة Sunnah.com: ثقة؛ نقل الموقع توثيق ابن معين وأبي حاتم والنسائي، ونقد أحمد لبعض مروياته. لا نزعم اتفاق النقاد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/6796) |
| alqama-al-laythi | ابن حجر: ثقة ثبت؛ أخطأ من زعم أن له صحبة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5719) |
| abu-dawud-sulayman-sayf | ابن حجر: ثقة حافظ؛ النسائي: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3598) |
| said-amir-dubai | ابن حجر: ثقة صالح؛ أبو حاتم: صدوق وفي حديثه بعض الغلط؛ البخاري: كثير الغلط. لا يلغي التوثيق هذه الأقوال. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3349) |
| shuba-hajjaj | خلاصة Sunnah.com: ثقة حافظ متقن عابد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3795) |
| saad-ibrahim-zuhri | خلاصة Sunnah.com: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3236) |
| nasr-abdurrahman-qurashi | ابن حجر: مقبول؛ مصنفو تحرير تقريب التهذيب: مجهول، تفرد شعبة بالرواية عنه؛ وذكره ابن حبان في الثقات. تحفظ الأقوال المختلفة دون حكم من التطبيق. | [Sunnah.com — الرواة](https://sunnah.com/narrator/7896) |
| muadh-qurashi-grandfather | لم يسجل حكم من Sunnah.com في هذه المراجعة | No verified matching appraisal |
| adam-abi-iyas | ابن حجر: ثقة عابد. | [ترجمة آدم بن أبي إياس](https://sunnah.com/narrator/2) |
| abdullah-abi-safar | وثقه ابن معين وابن حجر. | [ترجمة عبد الله بن أبي السفر](https://sunnah.com/narrator/4626) |
| ismail-abi-khalid | ابن حجر: ثقة ثبت. | [ترجمة إسماعيل بن أبي خالد](https://sunnah.com/narrator/989) |
| amir-shabi | ابن حجر: ثقة مشهور فقيه فاضل. | [ترجمة عامر الشعبي](https://sunnah.com/narrator/4099) |
| qutayba-said | ابن حجر: ثقة ثبت. | [ترجمة قتيبة بن سعيد](https://sunnah.com/narrator/6460) |
| salam-sulaym-ahwas | ابن حجر: ثقة متقن صاحب حديث. | [ترجمة سلام بن سليم الحنفي](https://sunnah.com/narrator/3457) |
| uthman-asim-hasin | ابن حجر: ثقة ثبت، وربما دلس. | [ترجمة عثمان بن عاصم أبي حصين](https://sunnah.com/narrator/5526) |
| dhakwan-samman | ابن حجر: ثقة ثبت. | [ترجمة أبي صالح السمان](https://sunnah.com/narrator/2840) |
| yahya-yusuf-zammi | وثقه ابن حجر وأبو زرعة. | [ترجمة يحيى بن يوسف الزمي](https://sunnah.com/narrator/8361) |
| abu-bakr-ayyash | خلاصة ابن حجر: ثقة عابد؛ ساء حفظه عند الكبر، وكتابه صحيح. التوثيق لا يلغي هذا القيد. | [ترجمة أبي بكر بن عياش](https://sunnah.com/narrator/130) |
| muhammad-umar-walid | ابن حجر: صدوق. | [ترجمة محمد بن عمر بن الوليد الكندي](https://beta.sunnah.com/narrator/7203) |
| abdullah-numayr | ابن حجر: ثقة صاحب حديث من أهل السنة. | [ترجمة عبد الله بن نمير](https://sunnah.com/narrator/5128) |
| ibrahim-fadl | عدّه ابن حجر والدارقطني متروكًا، وضعّفه الترمذي من جهة حفظه. | [ترجمة إبراهيم بن الفضل المخزومي](https://sunnah.com/narrator/805), [جامع الترمذي](https://sunnah.com/tirmidhi:2687) |
| said-maqburi | ابن حجر: ثقة؛ تغير قبل موته بأربع سنين. يحفظ القيد ولا يعمم الضعف على كل رواياته. | [ترجمة سعيد بن أبي سعيد المقبري](https://sunnah.com/narrator/3280) |
| muhammad-ala-kuraib | ابن حجر: ثقة حافظ. | [ترجمة محمد بن العلاء أبي كريب](https://sunnah.com/narrator/6852) |
| rushdin-saad | ابن حجر: ضعيف. جرح الرواية لا يعني اتهامه بالكذب. | [ترجمة رشدين بن سعد المهري](https://sunnah.com/narrator/2932) |
| amr-harith-masri | ابن حجر: ثقة فقيه حافظ. | [ترجمة عمرو بن الحارث المصري](https://sunnah.com/narrator/6080) |
| darraj-abi-samh | ابن حجر: صدوق، وفي حديثه عن أبي الهيثم ضعف. هذا القيد يخص الطريق المعروض. | [ترجمة دراج أبي السمح](https://sunnah.com/narrator/2812) |
| sulayman-amr-haytham | خلاصة Sunnah.com: ثقة؛ ابن حجر وابن معين والدارقطني: ثقة | [Sunnah.com — Narrators](https://sunnah.com/narrator/3617) |
| ahmad-abdullah-yunus | ابن حجر: ثقة حافظ؛ أبو حاتم: ثقة متقن. | [Sunnah.com — الرواة](https://sunnah.com/narrator/465) |
| hasan-ali-khallal | خلاصة Sunnah.com: ثقة حافظ له تصانيف؛ ونقل الموقع تحفظًا عن أحمد. يحفظ هذا الاختلاف. | [Sunnah.com — الرواة](https://sunnah.com/narrator/1284) |
| abdrazzaq-hammam | ابن حجر: ثقة حافظ مصنف، تغير في آخر عمره بعد العمى. ونقل المصدر عن البخاري أن روايته من كتابه أصح؛ اللون ينبه إلى هذا التفصيل ولا يحكم على الطريق وحده. | [تراجم الرواة — المصدر المحدد](https://sunnah.com/narrator/4533) |
| ibn-abi-sabra | خلاصة Sunnah.com: متهم بالوضع؛ ابن حجر: رموه بالوضع؛ أحمد: كان يضع الحديث. | [Sunnah.com — الرواة](https://sunnah.com/narrator/121) |
| ibrahim-muhammad-sabra | حكمه في Sunnah.com: «صدوق حسن الحديث». ينقل الموقع عن ابن حجر «صدوق»، وعن ابن حبان أنه ذكره في الثقات. | [ترجمة إبراهيم بن محمد الهاشمي — Sunnah.com](https://sunnah.com/narrator/11814) |
| muawiya-abdullah-jafar | خلاصة Sunnah.com: ثقة؛ ابن حجر: مقبول؛ العجلي والذهبي: ثقة. تحفظ الأقوال المختلفة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/7586) |
| said-marwan | وصفه ابن حجر والخطيب بأنه صدوق في الأقوال المنقولة بالمصدر. | [تراجم الرواة — المصدر المحدد](https://sunnah.com/narrator/3395) |
| anbasa-abdurrahman | خلاصة Sunnah.com: متروك الحديث؛ أبو حاتم: متروك الحديث، كان يضع الحديث. | [Sunnah.com — الرواة](https://sunnah.com/narrator/6251) |
| alaq-abi-muslim | ابن حجر: مجهول؛ الذهبي: واه؛ ابن حبان: لا يجوز الاحتجاج به إذا انفرد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5706) |
| aban-uthman | ابن حجر وأحمد: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/17) |
| muhammad-musaffa | ابن حجر: صدوق له أوهام وكان يدلس. ونقلت الترجمة أيضًا توثيقًا عن غيره؛ اللون الأصفر يحفظ هذا التفصيل. | [تراجم الرواة — المصدر المحدد](https://sunnah.com/narrator/7277) |
| muhammad-harb | ابن حجر والنسائي وابن معين: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/6916) |
| said-sinan-himsi | خلاصة Sunnah.com: متهم بالوضع؛ ابن حجر والنسائي: متروك الحديث؛ ونقل الموقع عن صدقة بن خالد: ثقة مرضي. تحفظ الأقوال ولا يزعم الاتفاق. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3344) |
| hudayr-kurayb | خلاصة Sunnah.com: ثقة؛ ابن حجر: صدوق؛ الدارقطني: لا بأس به إذا روي عنه ثقة. تحفظ القيود. | [Sunnah.com — الرواة](https://sunnah.com/narrator/2321) |
| kathir-murra | وثقه ابن حجر والعجلي وابن سعد في الأقوال المنقولة بالمصدر؛ وتنبه الترجمة إلى خطأ عده صحابيًا. | [تراجم الرواة — المصدر المحدد](https://sunnah.com/narrator/6576) |
| abdullah-maslama-qanabi | ابن حجر: ثقة عابد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5085) |
| malik-anas | خلاصة Sunnah.com: رأس المتقنين وكبير المتثبتين؛ أبو حاتم: ثقة، إمام أهل الحجاز. | [Sunnah.com — الرواة](https://sunnah.com/narrator/6659) |
| yahya-qazaa | خلاصة Sunnah.com: ثقة؛ ابن حجر: مقبول؛ الذهبي: ثقة. تحفظ الأقوال المختلفة كما وردت. | [Sunnah.com — الرواة](https://sunnah.com/narrator/8325) |
| muhammad-kathir-abdi | ابن حجر: ثقة، لم يصب من ضعفه؛ ونقل المصدر تضعيف ابن معين والعجلي. لا نزعم اتفاق النقاد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/7248) |
| sufyan-thawri | ابن حجر: ثقة حافظ فقيه عابد إمام حجة، وربما دلس. قيد التدليس محفوظ. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3436) |
| abd-wahhab-thaqafi | ابن حجر: ثقة، تغير قبل موته بثلاث سنين. ونقل العقيلي أن أهله منعوه من التحديث في اختلاطه؛ لا يعمم هذا القيد على كل مروياته. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5280) |
| abu-numan-arim | ابن حجر: ثقة ثبت، تغير في آخر عمره؛ وذكر أن البخاري سمع منه قبل اختلاطه بمدة. لا تنقل علة الاختلاط إلى هذا السماع بلا دليل. | [Sunnah.com — الرواة](https://sunnah.com/narrator/6855) |
| hammad-zayd | ابن حجر: ثقة ثبت فقيه. | [Sunnah.com — الرواة](https://sunnah.com/narrator/2491) |
| abu-nuaym-fadl | ابن حجر: ثقة ثبت. | [Sunnah.com — الرواة](https://sunnah.com/narrator/1548) |
| zakariyya-abi-zaida | ابن حجر: ثقة وكان يدلس، وسماعه من أبي إسحاق بأخرة؛ ونقل المصدر عن الذهبي تدليسه عن الشعبي، وعن أبي حاتم وصفه بلين. تحفظ القيود والاختلاف. | [Sunnah.com — الرواة](https://sunnah.com/narrator/3010) |
| abdaziz-abdallah-uwaysi | خلاصة Sunnah.com: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/4581) |
| ibrahim-saad | ابن حجر: ثقة، تكلم فيه بلا قادح؛ ووصفه في هدي الساري بثقة حجة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/823) |
| ibn-shihab-zuhri | خلاصة Sunnah.com: الفقيه الحافظ، متفق على جلالته وإتقانه. | [Sunnah.com — الرواة](https://sunnah.com/narrator/7272) |
| abu-salama-abdurrahman | خلاصة Sunnah.com: ثقة إمام مكثر. | [Sunnah.com — الرواة](https://sunnah.com/narrator/4903) |
| abdullah-muhammad-musnadi | ابن حجر: ثقة حافظ، جمع المسند. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5060) |
| abdrahman-mahdi | ابن حجر: ثقة ثبت حافظ، عارف بالرجال والحديث. | [Sunnah.com — الرواة](https://sunnah.com/narrator/4493) |
| abdrahman-abdwahhab-ammi | ابن حجر: ثقة. | [Sunnah.com — الرواة](https://sunnah.com/narrator/4433) |
| muhammad-abi-umar-adani | ابن حجر: ثقة؛ أبو حاتم: صالح وبه غفلة. ينقل المصدر اختلاف الأقوال دون إلغاء القيد. | [Sunnah.com — الرواة](https://sunnah.com/narrator/7317) |
| abdullah-wahb | ابن حجر: ثقة حافظ عابد فقيه. | [Sunnah.com — الرواة](https://sunnah.com/narrator/5147) |
