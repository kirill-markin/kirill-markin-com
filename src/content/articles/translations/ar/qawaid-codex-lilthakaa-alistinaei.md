---
title: "قواعد Codex: التعليمات العامة وAGENTS.md وتطبيق Mac"
date: 2026-04-11
slug: "qawaid-codex-lilthakaa-alistinaei"
description: "قواعدي لـ Codex في الذكاء الاصطناعي: كيف أستخدم التعليمات المخصصة وAGENTS.md وتطبيق Mac للحفاظ على نفس أنماط البرمجة عبر المستودعات المختلفة."
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

# قواعد Codex: التعليمات العامة وAGENTS.md وتطبيق Mac

أنا لا أستخدم Codex بجدية إلا منذ نحو شهر فقط، وبالدرجة الأكبر بعد أن جعل GPT-5.4 التجربة أكثر قابلية للاستخدام بالنسبة لي. لذلك فهذه ليست مقالة من نوع "خمس سنوات من الحكمة المجربة في المعارك". ملاحظتي أبسط بكثير: أصبح Codex جيدًا بالنسبة لي في اللحظة التي توقفت فيها عن التعامل معه كصندوق prompts أنيق آخر، وبدأت أعطيه تعليمات ثابتة من البداية.

لدى OpenAI كل من Codex CLI وتطبيق Mac. بالنسبة لي يعمل الاثنان بالفكرة نفسها: تعليمات دائمة، و`AGENTS.md`، وقواعد للمستودع، ووكيل يبدأ وهو محمّل مسبقًا بأنماط التطوير التي أفضّلها. أفضل تطبيق Mac لأنه ببساطة ألطف بكثير للعيش معه من نافذة terminal إضافية.

Codex CLI يؤدي هذا الجزء جيدًا أصلًا. أما تطبيق Mac فيمنحني غلافًا أجمل وأكثر راحة حول نفس سير عمل Codex الأساسي. ما زلت أهتم بالقواعد التطويرية الثابتة نفسها: typing صارم، وdiffs صغيرة، وأخطاء واضحة، ومن دون fallbacks عشوائية، وdocstrings داخل الشفرة بدلًا من الشروحات المبعثرة. لا أريد أن أعلّم Codex هذا من الصفر في كل مهمة جديدة. أريد أن تكون هذه القاعدة الأساسية موجودة منذ البداية.

عمليًا، هذا يعيش في `Settings -> Personalization -> Custom instructions`.

تحت الغطاء، تُترجم تعليمات التطبيق هذه إلى `AGENTS.md` الشخصي. ممتاز. أحصل على تجربة التطبيق الألطف من دون أن أخسر وضوح الملف الحقيقي على طريقة CLI.

## أين تعيش تعليمات Codex المخصصة فعلًا

إذا كنت ستتذكر شاشة واحدة فقط من هذه المقالة، فلتكن هذه.

في التطبيق، تعيش التعليمات العامة ضمن `Settings -> Personalization -> Custom instructions`. هذه هي الشاشة التي سأعرضها أولًا.

تقول [وثائق Codex](https://developers.openai.com/codex/) من OpenAI إن Codex يستطيع قراءة ملف تعليمات عام من مجلد Codex home لديك، ويكون عادة `~/.codex/AGENTS.md`. كما تقول [وثائق إعدادات Codex](https://developers.openai.com/codex/config/) إن تعديل التعليمات المخصصة يحدّث تعليماتك الشخصية في `AGENTS.md`.

هذا هو النموذج الذي أريده بالضبط. أستطيع استخدام التطبيق كواجهة أساسية من دون أن أفقد وضوح الملف الموجود خلفه.

هكذا يبدو النموذج الذهني لدي:

1. `~/.codex/AGENTS.md` الشخصي لافتراضاتي الافتراضية عبر المشاريع
2. `AGENTS.md` الخاص بالمستودع لإرشادات الفريق والمستودع
3. إعدادات تطبيق Codex وإرشادات المستودع فوق هذه القواعد

وهذه هي الشاشة:

![تعليمات Codex المخصصة في التطبيق وملف AGENTS.md الشخصي لقواعد البرمجة العامة](/articles/codex-personalization-custom-instructions.jpg)

## قواعد Codex التي أريد فعلًا أن تكون محمّلة في كل مكان

هذا هو الخط الأساسي الذي أريد أن يحمله Codex إلى أي مستودع قبل أن يرى تعليمات خاصة بالمشروع.

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

هذا الملف ممل بأفضل معنى ممكن.

هو موجود لإزالة الاحتكاك المتكرر:

- أن يخترع Codex refactors واسعة بينما كنت أريد patch صغيرة
- أن يخفي Codex عدم يقينه وراء لغة ناعمة
- أن يضيف Codex سلوك fallback "للأمان"
- أن يتجاوز Codex أعراف المستودع لأن الـ prompt كان ضيقًا جدًا

حين تكون هذه القواعد محمّلة مسبقًا، تصبح الجلسة أهدأ بكثير.

## لماذا أضع القواعد العامة فوق قواعد المستودع

يدعم Codex تدرج `AGENTS.md` بشكل جيد. توثّق OpenAI ملفًا عامًا في `~/.codex/AGENTS.md`، ثم ملفات للمستودع وملفات متداخلة أكثر كلما أصبح مسار العمل أكثر تحديدًا.

هذا التدرج مفيد، لكن الطبقة الأولى لا تزال يجب أن تكون طبقتي أنا.

ملفي الشخصي يجب أن يجيب عن أسئلة مثل:

- إلى أي حد أريد أسلوب الشفرة صارمًا
- ما الذي أعتبره معالجة أخطاء مقبولة
- ما مدى الجرأة التي أريدها من الوكيل في التغييرات
- ماذا تعني كلمة "منجز" في العمل البرمجي المعتاد

أما ملف المستودع فيجب أن يجيب عن:

- كيف تُنظَّم هذه القاعدة البرمجية
- ما الأوامر التي يجب تشغيلها
- ما الأجزاء الهشة
- كيف يريد الفريق التعامل مع PRs أو commits أو الوثائق

النسخة القصيرة:

- `AGENTS.md` الشخصي يقول كيف أعمل أنا
- `AGENTS.md` الخاص بالمستودع يقول كيف تعمل هذه القاعدة البرمجية

إذا خلطت بين الأمرين، فسأحصل على تكرار وانجراف وملف لا يريد أحد صيانته.

وهذا أحد أسباب أن Codex يعمل معي أفضل مما توقعت. هرمية التعليمات واضحة. الأمر يبدو أقل كأنه ألعاب prompts مخفية، وأكثر كأنه نظام حقيقي.

## تطبيق Mac هو السطح الأساسي، وهذه نقطة مهمة

تطبيق Codex الجديد على Mac هو الجزء الذي أستمتع به أكثر الآن.

ليس لأن CLI ضعيف. CLI جيد جدًا أصلًا. فقط التطبيق ألطف بكثير للاستخدام اليومي. نفس Codex في الأسفل، وسطح أكثر راحة بكثير في الأعلى.

لهذا لا أريد أن أتمحور في هذه المقالة حول CLI رغم أهميته. التطبيق هو الطريقة الألطف لاستخدام النظام نفسه.

وما يجعل التطبيق متينًا لا تجميليًا فقط هو أن التعليمات ما زالت مدعومة بـ `AGENTS.md`. تقول وثائق التطبيق إن تعديل التعليمات المخصصة يحدّث التعليمات الشخصية في `AGENTS.md`، وهذه هي العلاقة التي أريدها بالضبط:

- إعدادات التطبيق من أجل الراحة
- تعليمات قائمة على الملفات من أجل الاستمرارية

وهذا يجعل استخدام CLI لاحقًا سهل الفهم أيضًا، لأن نفس التعليمات الأساسية تستمر هناك.

## ما زال AGENTS.md الخاص بالمشروع مهمًا، لكنه ليس الشخصية الرئيسية

لا أريد لهذه المقالة أن تتحول إلى درس عن تداخل `AGENTS.md`، رغم أن Codex يدعم ذلك جيدًا.

نسختي أبسط:

- `AGENTS.md` الشخصي يمنح Codex سلوكي الأساسي
- `AGENTS.md` الخاص بالمستودع يمنح Codex توقعات خاصة بالمستودع
- الملفات المتداخلة مخصصة للحالات النادرة التي تحتاجها فعلًا

بهذا يظل النظام مفهومًا.

إذا فتحت مستودعًا عشوائيًا وتصرف Codex بشكل سيئ، فأنا أريد تشخيص السبب بسرعة. عادة يجب أن تكون الإجابة واحدة من هذه:

1. قواعدي العامة غير واضحة
2. تعليمات المستودع مفقودة
3. المهمة نفسها واسعة أكثر من اللازم

وليس "لقد نسيت أي طبقة من سبع طبقات مخفية ربحت عجلة prompts هذه المرة."

## أين ينسجم CLI داخل إعداد Codex الخاص بي

تطبيق Mac هو سطحي الرئيسي. CLI ليس fallback من درجة ثانية. إنه نفس نظام Codex ولكن بوضعية مختلفة.

وما زال CLI مهمًا لعدة أسباب:

- يجعلك ترى الإعداد القائم على الملفات بوضوح شديد
- يسهل فحص السلوك الدقيق أو كتابته ضمن scripts

لا أريد worldview منفصلًا لـ CLI. أريد نفس `AGENTS.md` الشخصي، ونفس إرشادات المستودع، ونفس guardrails في الاثنين.

هذا الاستمرار جزء كبير من سبب شعور المنتج بالتماسك بالنسبة لي.

## إعداد Codex العملي الذي أستخدمه الآن

لو كنت سأعد هذا من الصفر على Mac اليوم، فسأفعله بهذا الترتيب.

### 1. اكتب التعليمات الشخصية أولًا داخل التطبيق

افتح إعدادات تطبيق Codex باستخدام `Cmd+,`، ثم اذهب إلى `Personalization` واكتب التعليمات المخصصة هناك أولًا. ما زلت أفكر من حيث `~/.codex/AGENTS.md`، لكن التطبيق هو المكان الأساسي الذي أضبط فيه هذا وأراجعه.

### 2. اجعل الملف الشخصي قصيرًا وواضح الموقف

هندسة المشروع لا مكان لها هنا. ما ينتمي هنا هو القواعد البرمجية الدائمة:

- typing صارم
- أخطاء صريحة
- لا fallbacks صامتة
- diffs صغيرة
- docstrings بدل الوثائق المبعثرة
- عادات terminal نظيفة

### 3. أضف AGENTS.md الخاص بالمستودع فقط لحقائق المستودع

الأوامر، والهندسة، والقيود، وتوقعات الاختبار، والتسمية، والمناطق الخطرة. هذه هي طبقة المستودع.

## لماذا يبدو Codex واعدًا بالنسبة لي الآن

ما زلت في بداية الطريق مع Codex، لذلك لن أبالغ في بيعه.

لكن هذه التركيبة قوية بالفعل:

- طبقة تعليمات حقيقية قائمة على الملفات
- تطبيق وCLI يشعران بأنهما متصلان بدل أن يكونا متناقضين

وهذا يكفيني لأواصل استخدامه.

الإعداد الذي يعمل معي أفضل شيء حتى الآن هو أيضًا الأقل بريقًا: اكتب تعليمات دائمة جيدة، وافصل إرشادات المستودع، ودع الوكيل يبدأ من baseline تطابق طريقة عملك أصلًا.

النمط نفسه كما في Cursor. النمط نفسه كما في Claude Code. منتج مختلف، والدرس نفسه: تسير الجلسة أفضل حين يتوقف الوكيل عن تخمين من تكون.

إذا كنت تريد المقالات المرافقة، فهي هنا:

- Cursor IDE Rules for AI: [https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/](https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/)
- Claude Code Rules for AI: [https://kirill-markin.com/ar/maqalat/qawaid-claude-code-lilthakaa-alistinaei/](https://kirill-markin.com/ar/maqalat/qawaid-claude-code-lilthakaa-alistinaei/)
