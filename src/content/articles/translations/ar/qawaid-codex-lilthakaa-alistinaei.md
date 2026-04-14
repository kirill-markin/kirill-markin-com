---
title: "قواعد Codex: التعليمات العامة وملف AGENTS.md وتطبيق ماك"
date: 2026-04-11
lastmod: 2026-04-14
slug: "qawaid-codex-lilthakaa-alistinaei"
description: "كيف أستخدم التعليمات المخصصة في Codex وملف AGENTS.md وتطبيق ماك للحفاظ على أسلوب برمجي ثابت عبر المشاريع المختلفة من دون إعادة شرح قواعدي في كل مرة."
tags: [productivity, codex, openai, ai]
publish: true
thumbnailUrl: "/articles/codex-personalization-custom-instructions.jpg"
language: "ar"
originalArticle:
  language: "en"
  slug: "codex-rules-for-ai"
translations:
  - language: "en"
    slug: "codex-rules-for-ai"
  - language: "es"
    slug: "reglas-codex-para-ia"
  - language: "zh"
    slug: "codex-ai-guize"
  - language: "hi"
    slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
---

# قواعد Codex: التعليمات العامة وملف AGENTS.md وتطبيق ماك

لم أبدأ استخدام Codex بجدية إلا منذ نحو شهر، ومعظم ذلك جاء بعد أن جعل GPT-5.4 التجربة أكثر عملية بالنسبة إلي. لذلك فهذه ليست مقالة من نوع "خمس سنوات من الخبرة التي اختبرها الميدان". الفكرة أبسط بكثير: بدأ Codex ينجح معي فعلًا حين توقفت عن التعامل معه بوصفه مجرد مربع أنيق لإدخال التعليمات، وبدأت أزوّده منذ البداية بقواعد ثابتة وواضحة.

توفّر OpenAI كلًا من واجهة سطر الأوامر في Codex وتطبيق ماك. وبالنسبة إلي، فكلاهما يقوم على الفكرة نفسها: تعليمات دائمة، وملف `AGENTS.md`، وقواعد خاصة بالمستودع، ووكيل يبدأ العمل وهو يعرف سلفًا كيف أحب أن تُنجز المهام البرمجية. أميل إلى تطبيق ماك ببساطة لأنه أريح وأمتع في الاستخدام اليومي من نافذة طرفية إضافية.

واجهة سطر الأوامر في Codex تؤدي هذا الدور جيدًا أصلًا. أما تطبيق ماك فيمنحني واجهة أجمل وأكثر راحة لسير العمل نفسه. وما زالت الأمور التي تهمني هي نفسها: تعريف صارم للأنواع، وتعديلات صغيرة ومحددة، وأخطاء صريحة، ومن دون سلوكيات احتياطية عشوائية، وسلاسل توثيق داخل الشفرة بدل الشروح المتناثرة. لا أريد أن أشرح لـ Codex هذه القواعد من الصفر في كل مهمة جديدة. أريد أن يكون هذا الأساس حاضرًا منذ البداية.

عمليًا، مكان ذلك هو `Settings -> Personalization -> Custom instructions`.

وخلف الكواليس، ترتبط تعليمات التطبيق هذه بملف `AGENTS.md` الشخصي. وهذا بالضبط ما أريده. أحصل على تجربة تطبيق ألطف، من دون أن أخسر الوضوح الذي يتيحه وجود ملف حقيقي على طريقة واجهة سطر الأوامر.

## أين توجد تعليمات Codex المخصصة فعلًا

إذا كنت ستتذكر شاشة واحدة فقط من هذه المقالة، فلتكن هذه.

داخل التطبيق، توجد التعليمات العامة تحت `Settings -> Personalization -> Custom instructions`. هذه هي الشاشة التي سأبدأ بها.

تقول [وثائق Codex](https://developers.openai.com/codex/) من OpenAI إن Codex يستطيع قراءة ملف تعليمات عام من مجلد Codex المنزلي لديك، ويكون عادة `~/.codex/AGENTS.md`. كما توضّح [وثائق إعدادات Codex](https://developers.openai.com/codex/config/) أن تعديل التعليمات المخصصة يحدّث تعليماتك الشخصية في `AGENTS.md`.

وهذا هو النموذج الذي أريده بالضبط. أستطيع أن أستخدم التطبيق بوصفه الواجهة الأساسية من دون أن أفقد وضوح الملف الكامن وراءه.

هكذا يبدو تصوري الذهني:

1. ملف `~/.codex/AGENTS.md` الشخصي من أجل القواعد الافتراضية العابرة للمشاريع
2. ملف `AGENTS.md` الخاص بالمستودع من أجل إرشادات الفريق والمشروع
3. إعدادات تطبيق Codex وإرشادات المستودع التي تأتي فوق هذه القواعد

وهذه هي الشاشة:

![تعليمات Codex المخصصة في التطبيق وملف AGENTS.md الشخصي لقواعد البرمجة العامة](/articles/codex-personalization-custom-instructions.jpg)

## القواعد التي أريد أن يحملها Codex معه أينما ذهب

هذا هو الأساس الذي أريد أن يدخل به Codex إلى أي مستودع قبل أن يرى أي تعليمات خاصة بالمشروع.

```markdown
# Personal AGENTS.md

## Code Style

- Comments in English only
- Prefer functional programming over OOP
- Use OOP classes only for connectors and interfaces to external systems
- Write pure functions - only modify return values, never input parameters or global state
- Follow DRY, KISS, and YAGNI principles
- Use strict typing everywhere - function returns, variables, collections
- Check if logic already exists before writing new code
- Avoid untyped variables and generic types
- Never use default parameter values - make all parameters explicit
- Create proper type definitions for complex data structures
- All imports at the top of the file
- Write simple single-purpose functions - no multi-mode behavior, no flag parameters that switch logic

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- No fallbacks unless I explicitly ask for them
- Fix root causes, not symptoms
- External API or service calls: use retries with warnings, then raise the last error
- Error messages must include enough context to debug: request params, response body, status codes
- Logging should use structured fields instead of interpolating dynamic values into message strings

## Tooling and Dependencies

- Prefer modern package management files like `pyproject.toml` and `package.json`
- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- Read installed dependency source code when needed instead of guessing behavior

## Testing

- Respect the current repository testing strategy and existing test suite
- Do not add new unit tests by default
- When tests are needed, prefer integration, end-to-end, or smoke tests that validate real behavior
- Use unit tests only rarely, mainly for stable datasets or pure data transformations
- Never add unit tests just to increase coverage numbers
- Avoid mocks when real calls are practical
- It is usually better to spend a little money on real API or service calls than to maintain fragile mock-based coverage
- Add only the minimum test coverage needed for the requested change

## Codex Workflow

- Inspect the repository before editing
- Read active `AGENTS.md` files before making assumptions
- Keep changes minimal and directly related to the current request
- Match the existing repository style even when it differs from my personal preference
- Do not revert unrelated changes
- Prefer `rg` for code search
- Use non-interactive commands with flags
- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Run relevant tests or validation commands after code changes when the project already defines them

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code
- Never duplicate documentation across files
- Store knowledge as current state, not as a changelog of modifications
```

هذا الملف ممل، وذلك بأفضل معنى ممكن.

وظيفته أن يزيل مصادر الاحتكاك المتكررة:

- أن يخترع Codex إعادة هيكلة واسعة بينما كنت أريد تعديلًا محدودًا
- أن يخفي Codex عدم يقينه خلف لغة ناعمة وملتبسة
- أن يضيف Codex سلوكًا احتياطيًا "من باب الأمان"
- أن يتجاوز Codex أعراف المستودع لأن صياغة المهمة كانت أضيق من اللازم

ومتى كانت هذه القواعد محمّلة سلفًا، تصبح الجلسة أهدأ بكثير.

## لماذا أضع القواعد العامة فوق قواعد المستودع

يدعم Codex تدرّج ملفات `AGENTS.md` بشكل جيد. وتوثّق OpenAI وجود ملف عام في `~/.codex/AGENTS.md`، ثم ملفات خاصة بالمستودع وملفات داخلية أكثر تحديدًا كلما صار مسار العمل أكثر خصوصية.

هذه الطبقات مفيدة، لكن الطبقة الأولى يجب أن تكون طبقتي أنا.

ينبغي لملفي الشخصي أن يجيب عن أسئلة مثل:

- إلى أي حد أريد أسلوب الشفرة صارمًا
- ما الذي أعتبره معالجة أخطاء مقبولة
- إلى أي درجة أريد من الوكيل أن يكون جريئًا في التغييرات
- ما الذي تعنيه كلمة "منجز" في العمل البرمجي المعتاد

أما ملف المستودع فيجب أن يجيب عن:

- كيف يُنظَّم هذا المشروع
- ما الأوامر التي ينبغي تشغيلها
- ما الأجزاء الهشة
- كيف يريد الفريق التعامل مع طلبات الدمج والالتزامات والوثائق

والخلاصة القصيرة:

- `AGENTS.md` الشخصي يشرح كيف أعمل أنا
- `AGENTS.md` الخاص بالمستودع يشرح كيف يعمل هذا المشروع

إذا خلطت بين الاثنين، فسأحصل على تكرار، وانحراف مع الوقت، وملف لا يرغب أحد في صيانته.

وهذا أحد الأسباب التي جعلت Codex يعمل معي أفضل مما توقعت. تدرّج التعليمات واضح. ويبدو الأمر أقل شبهًا بحيل الصياغات الخفية، وأكثر شبهًا بنظام حقيقي.

## تطبيق ماك هو الواجهة الأساسية، وهذا مهم

تطبيق Codex على ماك هو الجزء الذي أستمتع به أكثر في الوقت الحالي.

وليس السبب أن واجهة سطر الأوامر ضعيفة. على العكس، هي جيدة جدًا أصلًا. لكن التطبيق ألطف بكثير في الاستخدام اليومي. Codex نفسه في الخلفية، لكن الواجهة أكثر راحة بكثير.

ولهذا لا أريد أن تتمحور هذه المقالة حول واجهة سطر الأوامر رغم أهميتها. التطبيق هو الطريقة الأريح لاستخدام النظام نفسه.

وما يجعل التطبيق متينًا لا مجرد طبقة تجميلية هو أن التعليمات ما زالت تستند إلى `AGENTS.md`. تقول وثائق التطبيق إن تعديل التعليمات المخصصة يحدّث التعليمات الشخصية في `AGENTS.md`، وهذه هي العلاقة التي أريدها بالضبط:

- إعدادات التطبيق من أجل الراحة
- تعليمات قائمة على الملفات من أجل الاستمرارية

وهذا يجعل استخدام واجهة سطر الأوامر لاحقًا سهل الفهم أيضًا، لأن التعليمات الأساسية نفسها تبقى حاضرة هناك.

## ما زال AGENTS.md الخاص بالمشروع مهمًا، لكنه ليس محور القصة

لا أريد لهذه المقالة أن تتحول إلى درس عن تداخل ملفات `AGENTS.md`، رغم أن Codex يدعم ذلك جيدًا.

الصيغة التي أتبناها أبسط:

- `AGENTS.md` الشخصي يمنح Codex سلوكي الافتراضي
- `AGENTS.md` الخاص بالمستودع يمنح Codex توقعات هذا المستودع تحديدًا
- الملفات الأعمق في المسارات الفرعية مخصصة للحالات النادرة التي تحتاج ذلك فعلًا

وهكذا يظل النظام سهل الفهم.

إذا فتحت مستودعًا عشوائيًا وتصرف Codex بشكل سيئ، فأنا أريد أن أعرف السبب بسرعة. وفي الغالب ينبغي أن تكون الإجابة واحدة من هذه:

1. قواعدي العامة غير واضحة
2. تعليمات المستودع مفقودة
3. المهمة نفسها واسعة أكثر من اللازم

وليس: "نسيت أي طبقة من سبع طبقات خفية رجّحت كفة هذه الجولة."

## أين تأتي واجهة سطر الأوامر في إعداد Codex لدي

تطبيق ماك هو واجهتي الأساسية. وواجهة سطر الأوامر ليست بديلًا من الدرجة الثانية. إنها النظام نفسه، لكن في وضع استخدام مختلف.

ومع ذلك، ما زالت واجهة سطر الأوامر مهمة لعدة أسباب:

- لأنه يجعل الإعداد القائم على الملفات واضحًا جدًا
- ولأنه يسهّل فحص السلوك بدقة أو تضمينه في السكربتات

أنا لا أريد تصورًا منفصلًا عن واجهة سطر الأوامر. أريد ملف `AGENTS.md` الشخصي نفسه، وإرشادات المستودع نفسها، والضوابط نفسها في الحالتين.

وهذا الاتساق جزء كبير من سبب شعوري بأن المنتج متماسك.

## إعداد Codex العملي الذي أستخدمه الآن

لو كنت سأعد هذا من الصفر على جهاز ماك اليوم، فغالبًا سأرتبه بهذا الشكل.

### 1. اكتب التعليمات الشخصية أولًا داخل التطبيق

افتح إعدادات تطبيق Codex باستخدام `Cmd+,`، ثم اذهب إلى `Personalization`، واكتب التعليمات المخصصة هناك أولًا. ما زلت أفكر انطلاقًا من `~/.codex/AGENTS.md`، لكن التطبيق هو المكان الأساسي الذي أضبط فيه هذا وأراجعه.

### 2. اجعل الملف الشخصي قصيرًا وواضحًا

هندسة المشروع لا مكان لها هنا. ما ينتمي إلى هذا الملف هو القواعد البرمجية الدائمة:

- تعريف صارم للأنواع
- أخطاء صريحة
- لا سلوكيات احتياطية صامتة
- تعديلات محدودة
- سلاسل توثيق بدل الوثائق المبعثرة
- عادات نظيفة في الطرفية

### 3. أضف AGENTS.md الخاص بالمستودع فقط لما يخص المستودع نفسه

الأوامر، والهندسة، والقيود، وتوقعات الاختبار، والتسمية، والمناطق الحساسة. هذه هي طبقة المستودع.

## لماذا يبدو Codex واعدًا بالنسبة إلي الآن

ما زلت في بداية الطريق مع Codex، لذلك لن أبالغ في الترويج له.

لكن هذه التركيبة قوية بالفعل:

- طبقة تعليمات حقيقية قائمة على الملفات
- تطبيق وواجهة سطر الأوامر يبدوان مترابطين بدل أن يبدوا متناقضين

وهذا يكفيني لأواصل استخدامه.

الإعداد الذي يعمل معي أفضل من غيره حتى الآن هو أيضًا الأقل استعراضًا: اكتب تعليمات دائمة جيدة، وافصل إرشادات المستودع، ودع الوكيل يبدأ من أساس يطابق طريقتك في العمل أصلًا.

النمط نفسه مع Cursor. والنمط نفسه مع Claude Code. منتج مختلف، والدرس نفسه: تسير الجلسة على نحو أفضل عندما يتوقف الوكيل عن تخمين من تكون.

إذا كنت تريد المقالات المرافقة، فهي هنا:

- قواعد Cursor IDE للذكاء الاصطناعي: [https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/](https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/)
- قواعد Claude Code للذكاء الاصطناعي: [https://kirill-markin.com/ar/maqalat/qawaid-claude-code-lilthakaa-alistinaei/](https://kirill-markin.com/ar/maqalat/qawaid-claude-code-lilthakaa-alistinaei/)
