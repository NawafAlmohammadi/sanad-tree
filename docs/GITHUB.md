# رفع شجرة الأسانيد إلى GitHub

## الطريقة الأولى: موقع GitHub

١. سجل الدخول إلى حسابك في GitHub. افتح [إنشاء مستودع باسم sanad-tree](https://github.com/new?name=sanad-tree&visibility=public).
٢. اختر صاحب المستودع (حسابك)، واسم sanad-tree أو اسمًا متاحًا، وحدد Public إذا أردت رابطًا عامًا للتسليم. اترك Add README و.gitignore وLicense دون إنشاء إضافي لأن الحزمة مجهزة. اضغط Create repository.
٣. في صفحة المستودع الجديد اضغط uploading an existing file؛ في مستودع فيه ملفات، اختر Add file ثم Upload files.
٤. افتح المجلد المفكوك sanad-tree واسحب محتوياته إلى مربع الرفع، مع المجلدات الداخلية كما هي. تأكد من ظهور README.md وpackage.json في الجذر، ولا تضف طبقة مجلد إضافية أو ترفع ZIP وحده. عند رفع الملفات من المتصفح، استثناءات .gitignore لا تمنعك من اختيار الأسرار يدويًا: استبعد API.env و.env وnode_modules وdist بنفسك، وضمّن API.env.example و.env.example و.gitignore.
٥. اكتب وصفًا مثل «نسخة شجرة الأسانيد للتشغيل المحلي» واضغط Commit changes أو Propose changes بحسب الواجهة. إذا طلب اختيار فرع، main هو الفرع الافتراضي المناسب لمستودع جديد.
٦. انسخ رابط المستودع. على الجهاز الآخر: Code → Download ZIP، ثم فك الضغط وشغّل SETUP.cmd وSTART.cmd. بعض الهواتف لا تدعم رفع مجلدات؛ استخدم الكمبيوتر.

## الطريقة الثانية: Git من الطرفية

أنشئ مستودعًا فارغًا أولاً كما سبق، وثبت Git من [موقعه الرسمي](https://git-scm.com/downloads). داخل مجلد المشروع المفكوك:

```sh
git init
git add .
git commit -m "Add complete Sanad Tree project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sanad-tree.git
git push -u origin main
```

استبدل YOUR_USERNAME باسم حسابك. لا تكتب مفتاح API أو رمز GitHub في الرابط أو ملفات المشروع. أكمل تسجيل الدخول المعتاد إذا طلبه Git. تستخدم هذه الأوامر مجلدًا مفكوكًا جديدًا بلا مستودع سابق؛ لا تستعمل أوامر استبدال أو force على مستودع موجود.

مراجع GitHub الرسمية: [إنشاء مستودع](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)، [رفع ملفات](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

مستودع المشروع: [Nawafhikari/sanad-tree](https://github.com/Nawafhikari/sanad-tree). لا يلزم GitHub لتجربة ملف ZIP مباشرة على جهاز آخر. الخطوات أعلاه تصلح كذلك لإنشاء نسختك الخاصة من المشروع.
