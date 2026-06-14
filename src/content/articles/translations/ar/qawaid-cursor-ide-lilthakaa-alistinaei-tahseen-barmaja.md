---
keywords: [
  "قواعد Cursor IDE",
  "قواعد كورسر للذكاء الاصطناعي",
  "البرمجة بمساعدة الذكاء الاصطناعي",
  "ملف .cursorrules",
  "ملفات .cursor/index.mdc",
  "قواعد المشروع في Cursor",
  "تحسين العمل مع أدوات البرمجة بالذكاء الاصطناعي",
  "تخصيص سلوك المساعد البرمجي"
]
title: "قواعد Cursor IDE للذكاء الاصطناعي: إرشادات لمساعد ذكاء اصطناعي متخصص"
date: 2025-05-09
lastmod: 2026-05-20
description: "القواعد التي أستخدمها في Cursor IDE لتحسين البرمجة بمساعدة الذكاء الاصطناعي، من خلال أسلوب شفرة واضح، ومعالجة صارمة للأخطاء، وسير عمل متسق بين المشاريع."
tags: ["productivity", "cursor-ide", "ai", "llm"]
publish: true
thumbnailUrl: "/articles/cursor-ide-rules-for-ai.webp"
language: "ar"
originalArticle:
  language: "en"
  slug: "cursor-ide-rules-for-ai"
translations:
  - language: "en"
    slug: "cursor-ide-rules-for-ai"
  - language: "es"
    slug: "reglas-cursor-ide-para-ia"
  - language: "zh"
    slug: "cursor-ide-ai-bianma-guize-youhua"
  - language: "hi"
    slug: "cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye"
---

# قواعد Cursor IDE للذكاء الاصطناعي: إرشادات لمساعد ذكاء اصطناعي متخصص

يدعم Cursor IDE ثلاثة مستويات من القواعد:

1. قواعد `Rules for AI` داخل إعدادات Cursor IDE، وهي القواعد الأساسية العامة التي تنطبق على جميع المشاريع
2. ملف `.cursor/index.mdc` مع نوع القاعدة `Always`، وهو ملف خاص بالمشروع على مستوى المستودع ويحل محل نهج `.cursorrules` القديم
3. ملفات `.cursor/rules/*.mdc`، وهي قواعد ديناميكية لا تُفعَّل إلا عندما يتعامل الذكاء الاصطناعي مع مهام يطابقها وصف تلك القواعد

أشارك هنا القواعد الأساسية التي أضعها في إعداداتي العامة داخل Cursor IDE. هذه القواعد هي نقطة البداية في جميع أعمالي البرمجية. وعندما تجتمع مع قواعد المستودع والقواعد الديناميكية، تتشكل منظومة قوية تحافظ على جودة الشفرة وتبقي ممارسات التطوير متسقة بين المشاريع.

> **تفضّل الشرح بالفيديو؟** أعددت شرحًا مرئيًا شاملًا لهذا النظام بالكامل. يمكنك مشاهدة [الشرح الكامل لقواعد Cursor IDE للذكاء الاصطناعي: المستويات الخمسة وملف .cursorrules (2025)](https://www.youtube.com/watch?v=gw8otRr2zpw) لترى هذه الأفكار مطبقة خطوة بخطوة.

[![إعداد قواعد Cursor IDE وتطبيقها عمليًا](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## كيف تضبط قواعد Cursor للحصول على أفضل أداء في البرمجة بمساعدة الذكاء الاصطناعي

Cursor -> Settings -> Cursor Settings -> Rules for AI:

```markdown
# Global Rules

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
- Write simple single-purpose functions - no multi-mode behavior, no flag parameters that switch logic. If the user needs multiple modes, they will ask explicitly

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- No fallbacks unless I explicitly ask for them; code should either succeed or fail with a clear error
- Transparent debugging: when something fails, show exactly what went wrong and why
- Fix root causes, not symptoms; fallbacks hide real problems that need solving
- External API or service calls: use retries with warnings, then raise the last error
- Error messages must include enough context to debug: request params, response body, status codes; no generic "something went wrong"
- Logging should use structured fields instead of interpolating dynamic values into message strings

## Language Specifics

- Prefer structured data models over loose dictionaries, such as Pydantic models or typed interfaces
- Avoid generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`
- Use modern package management files like `pyproject.toml` and `package.json`
- Use the language's strict type features when available, such as discriminated unions and enums

## Libraries and Dependencies

- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- If a dependency is installed locally, read its source code when needed instead of guessing, even if it is gitignored
- Update project configuration files when adding dependencies

## Testing

- Respect the current repository testing strategy and existing test suite
- Do not add new unit tests by default
- When tests are needed, prefer integration, end-to-end, or smoke tests that validate real behavior
- Use unit tests only rarely, mainly for stable datasets or pure data transformations
- Never add unit tests just to increase coverage numbers
- Avoid mocks when real calls are practical
- It is usually better to spend a little money on real API or service calls than to maintain fragile mock-based coverage
- Add only the minimum test coverage needed for the requested change

## Terminal Usage

- Prefer non-interactive commands with flags over interactive ones
- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Prefer `rg` for searching code and files

## Workflow

- Read the existing code and relevant project instructions before editing
- Keep changes minimal and related to the current request
- Match the existing style of the repository even if it differs from my personal preference; new code must look like it was written by the same author
- Do not revert unrelated changes
- If you are unsure, inspect the codebase instead of inventing patterns
- Suggest only minimal changes related to the current dialog
- Change as few lines as possible while solving the problem
- Focus only on what the user is asking for; no extra improvements
- When project instructions include test or lint commands, run them before finishing if the task changed code

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code, and only one file per topic
- Never duplicate documentation across files; reference other sources instead
- Store knowledge as current state, not as a changelog of modifications

## Commits

- Never create a git commit unless the user explicitly asks for one
- Prefer `git merge` over `git squash` whenever possible, unless the user explicitly asks for squash.
- Uncommitted changes are the user's review state - they read the diff before deciding what to commit
- Keep changes uncommitted until asked, so the diff stays clean and reviewable
```

![إعداد القواعد العامة في Cursor IDE داخل لوحة الإعدادات](/articles/cursor-ide-rules-global.webp)

## كيف تعظّم الكفاءة عبر استراتيجية متعددة المستويات لقواعد مشروع Cursor

عند العمل مع ميزات الذكاء الاصطناعي في Cursor IDE، وجدت أن تحسين القواعد عبر المستويات الثلاثة أمر حاسم. والفكرة الأساسية بسيطة: قلّل عدد التوكنات (`tokens`) التي تُرسل إلى نموذج اللغة في كل محادثة. فكلما قلّت التوكنات المخصصة للسياق، ازدادت المساحة المتاحة لإنتاج استجابات أفضل.

ولمعرفة المزيد عن آلية عمل قواعد المشروع في Cursor، يمكنك الرجوع إلى [الوثائق الرسمية لـ Cursor حول Rules for AI](https://docs.cursor.com/context/rules).

### تدفق التنفيذ في ثلاث خطوات لقواعد مشروع Cursor

1. **ابدأ بإعدادات IDE فقط**  
   أبدأ بإعدادات Cursor العامة لتثبيت التفضيلات الأساسية. يتيح لي ذلك تجربة صيغ مختلفة للقواعد من دون إثقال المستودعات. وأحصر هذا المستوى في القواعد العامة التي تنطبق على جميع أعمالي البرمجية.

2. **انقل القواعد الخاصة بالمشروع إلى مستوى المستودع**  
   عندما ألاحظ أنماطًا تخص قاعدة شيفرة بعينها أو أرغب في مشاركة هذه التوجيهات مع زملائي، أنقلها إلى ملف `.cursor/index.mdc` مع نوع القاعدة `Always`. وهكذا أحصل على مرجعية مشتركة داخل الفريق مع الحفاظ على خفة إعداداتي العامة. وتجدر الإشارة إلى أن ملف `.cursorrules` القديم لا يزال يعمل، لكنه لم يعد الخيار الموصى به.

3. **قسّم القواعد إلى ملفات مرتبطة بالسياق عند الحاجة**  
   إذا أصبحت قواعد المشروع على مستوى المستودع متضخمة، أقسمها إلى ملفات `.cursor/rules/*.mdc`. وهذا يقلّل استهلاك التوكنات، لأن القواعد ذات الصلة فقط هي التي تُفعَّل عند الحاجة. والنتيجة أن نموذج اللغة يمتلك مساحة ذهنية أكبر للتركيز على المهمة الحالية بدلًا من الانشغال بإرشادات لا ترتبط بها.

هدفي بسيط: في كل محادثة مع المساعد الذكي، أزوّده بالقدر الكافي من السياق ليكون مفيدًا، من دون أن أستهلك قدرته في معلومات لا يحتاج إليها في تلك اللحظة.

## أمثلة عملية من مستودعات إنتاج حقيقية تستخدم قواعد مشروع Cursor

لإظهار كيف أطبّق قواعد Cursor في مستودعات مختلفة، إليك بعض الأمثلة الواقعية:

### ملفات `.cursor/index.mdc` على مستوى المستودع: البنية وطريقة التطبيق

ملفات `.cursor/index.mdc` ذات النوع `Always` تؤدي دورًا مشابهًا لملف `README.md`، لكنها مكتوبة خصيصًا لمساعدي الذكاء الاصطناعي. فهي توفّر سياقًا عن هدف المشروع وبنيته وأنماط البرمجة المتوقعة. أما ملفات `.cursorrules` القديمة فما تزال مدعومة، لكنها ليست الخيار المفضل للمشاريع الجديدة.

![مثال لملف قواعد على مستوى المستودع](/articles/cursor-ide-rules-repo.webp)

#### أمثلة من مستودعات إنتاج تستخدم قواعد مشروع Cursor

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**: أداة لتحويل المستودعات إلى نص، وتتضمن قواعد تشرح هدف المشروع وقراراته المعمارية وأنماط الشفرة التي ينبغي اتباعها.

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**: في هذا البوت الخاص بـ Telegram، تركز القواعد على معمارية البوت وأنماط استخدام API واتفاقيات التعامل مع الرسائل والأوامر.

### ملفات قواعد مشروع Cursor: متى تستخدمها وكيف تستفيد منها

عندما تصبح القواعد على مستوى المستودع أوسع من اللازم، أقسّمها إلى ملفات `.cursor/rules/*.mdc` مرتبطة بسياق محدد، ولا تُفعَّل إلا عندما يكون ذلك السياق حاضرًا فعلًا.

![قواعد مرتبطة بالسياق داخل قسم Project Rules](/articles/cursor-ide-rules-specific.webp)

#### مثال على تنفيذ قواعد مخصصة للمهام

من أفضل الأمثلة على ذلك مستودع موقعي الشخصي:
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

في هذا المستودع أنشأت ملفات قواعد منفصلة من أجل:

- سير عمل إدارة المحتوى
- متطلبات تحسين الصور
- أفضل ممارسات تحسين محركات البحث
- أنماط بنية المكوّنات
- إجراءات النشر

هذا النهج يبقي الذكاء الاصطناعي مركزًا على ما يهم فعلًا، ويمنعه من الغرق في معلومات لا علاقة لها بالمهمة الحالية.

### إدراج القواعد في منتصف الحوار: القيود وأفضل الممارسات

هناك قيد مهم ينبغي الانتباه إليه: تعمل قواعد `.mdc` المرتبطة بالسياق بأفضل صورة عندما تُطبَّق منذ بداية محادثة جديدة. فإذا كنت في منتصف حوار قائم داخل Cursor IDE ثم احتجت فجأة إلى قاعدة متخصصة، مثل إرشادات الاستعلام من قاعدة البيانات، فقد لا يحمّل الذكاء الاصطناعي ملف القاعدة المناسب تلقائيًا. ويحدث ذلك لأن Cursor يكون قد بنى سياق المحادثة بالفعل، ولا يعيد دائمًا تقييم القواعد الواجب تطبيقها أثناء الحوار.

في مثل هذه الحالات، أذكر القاعدة صراحةً، مثل: "يرجى اتباع إرشاداتنا الخاصة بالاستعلام من قاعدة البيانات في هذه المهمة". عندها يبحث Cursor عن القاعدة المناسبة ويطبقها. أما في المهام الحساسة التي تعتمد على إرشادات محددة، فأجد أن بدء حوار جديد أكثر فاعلية، لأن Cursor سيتعرّف تلقائيًا على جميع القواعد المرتبطة بالسياق ويطبقها منذ البداية.

## تطور قواعد مشروع Cursor: من الإعدادات العامة إلى الأنظمة المرتبطة بالسياق

مرّت تجربتي مع قواعد Cursor بعدة مراحل:

### المرحلة الأولى: إعدادات Cursor IDE العامة للقواعد الشاملة

بدأت بوضع كل شيء داخل إعدادات Cursor IDE. كان ذلك بسيطًا وفعّالًا في البداية. لكن مع اكتشافي لأنماط جديدة في أسلوبي العملي، تضخمت هذه القواعد العامة. صحيح أن كل مشروع جديد كان يستفيد منها، لكن الإعدادات صارت في النهاية مرهقة لأنها تضم عددًا كبيرًا من القواعد التي لا تنطبق في كل مكان.

### المرحلة الثانية: قواعد خاصة بالمستودع لفرض معايير المشروع

عندما امتلأت الإعدادات العامة بمعلومات لا تخص جميع المشاريع، انتقلت إلى القواعد على مستوى المستودع. وكان هذا يعني في البداية استخدام ملفات `.cursorrules` في جذر المستودعات، وهي الآن صيغة قديمة. وأصبح هذا النهج هو الأساس بالنسبة إلي، لأنه سمح لي بتخصيص القواعد لكل مشروع مع الحفاظ على معايير متسقة. أما اليوم، فالنهج الموصى به هو استخدام ملفات `.cursor/index.mdc` مع النوع `Always`.

### المرحلة الثالثة: قواعد ديناميكية مرتبطة بالسياق للمهام المتخصصة

عندما أضاف Cursor IDE القواعد الديناميكية `.cursor/rules/*.mdc`، أعدت تنظيم كل شيء. فهذه القواعد لا تُفعَّل إلا عندما يكون الذكاء الاصطناعي يعمل على مهمة مرتبطة بها، وهذا سمح لي بما يلي:

- إبقاء الإعدادات العامة خفيفة وقابلة للتطبيق على نطاق واسع
- استخدام `.cursor/index.mdc` مع النوع `Always` للمعايير العامة الخاصة بالمشروع بدلًا من `.cursorrules` القديم
- إنشاء ملفات `.cursor/rules/*.mdc` مركزة للمهام المتخصصة

هذا النهج المتدرج يزوّد الذكاء الاصطناعي بتوجيه مناسب في اللحظة المناسبة بحسب ما أعمل عليه فعليًا، ويقلل الضجيج ويحسن مدى صلة المساعدة بالمهمة.

وهذا التطور يعكس فهمًا أعمق لكيفية التعاون بفاعلية مع مساعدي الذكاء الاصطناعي: البداية تكون واسعة، ثم يأتي التنقيح التدريجي إلى أن تصبح القواعد مرتبطة بالسياق وبالمهام بطريقة ترفع فعالية المساعد إلى أقصى حد.

## مقارنة كاملة بين مستويات قواعد مشروع Cursor: العامة وعلى مستوى المستودع والمرتبطة بالسياق

فيما يلي مقارنة سريعة بين المستويات الثلاثة لقواعد Cursor داخل Cursor IDE:

| الميزة | إعدادات IDE العامة | قواعد المستودع (`.cursor/index.mdc` مع `Always`) | القواعد المرتبطة بالسياق (`.cursor/rules/*.mdc`) |
|---------|--------------------|---------------------------------------------------|--------------------------------------------------|
| **النطاق** | جميع المشاريع | مستودع محدد | مهام أو سياقات محددة |
| **إمكانية الاطلاع** | أنت فقط عبر الإعدادات المحلية | الفريق كله عبر المستودع | الفريق كله عبر المستودع |
| **الاستمرارية** | تبقى بين المشاريع | مرتبطة بالمستودع | مرتبطة بالمستودع |
| **التفعيل** | فعالة دائمًا | فعالة دائمًا داخل هذا المستودع | تُفعَّل فقط عند ارتباطها بالمهمة الحالية |
| **الأفضل من أجل** | القواعد العامة المشتركة | أنماط بنية المشروع | المعرفة المتخصصة بالمجال |
| **كفاءة استهلاك التوكنات** | منخفضة لأنها موجودة دائمًا | متوسطة لأنها ثابتة داخل المشروع | عالية لأنها تُحمَّل عند الحاجة فقط |
| **مكان الإعداد** | واجهة إعدادات Cursor | ملف `.cursor/index.mdc` | المجلد `.cursor/rules/` |
| **قابلية النقل** | تتطلب إعدادًا يدويًا على كل جهاز | تنتقل تلقائيًا مع استنساخ المستودع | تنتقل تلقائيًا مع استنساخ المستودع |
| **دعم الصيغة القديمة** | غير منطبق | ما يزال `.cursorrules` يعمل لكن بوصفه صيغة قديمة | غير منطبق |

يتيح لك هذا النهج متعدد المستويات تحسين استهلاك التوكنات مع الحفاظ على توجيه ثابت وفعّال في سيناريوهات العمل المختلفة.

## دليل عملي خطوة بخطوة لتطبيق قواعد مشروع Cursor في سير عملك

بعد أن شرحت الفكرة النظرية وراء هذا النهج، لننتقل إلى كيفية بناء نظام مشابه في عملك اليومي.

### إعداد القواعد العامة في Cursor لمساعدة الذكاء الاصطناعي

لإعداد قواعدك العامة في Cursor IDE:

1. افتح Cursor IDE وانتقل إلى الإعدادات من الزر الموجود في أعلى اليمين
2. اذهب إلى `Cursor Settings > Rules for AI`
3. أضف إرشاداتك الأساسية ضمن بنية واضحة مثل التي عرضتها أعلاه
4. أبقِ القواعد العامة محصورة في معايير الترميز التي تنطبق على جميع المشاريع
5. اختبرها باستخدام طلبات بسيطة لترى كيف يستجيب الذكاء الاصطناعي لتعليماتك

#### إدارة الإعدادات المحلية في Cursor IDE بكفاءة

المفتاح هنا هو التوازن: إذا كانت القواعد قليلة جدًا فلن يفهم الذكاء الاصطناعي تفضيلاتك، وإذا كانت كثيرة جدًا فستهدر التوكنات على سياق لا حاجة إليه.

ومن المهم أيضًا أن تعرف أن هذه الإعدادات محفوظة محليًا داخل نسخة Cursor IDE الموجودة على جهازك. لن يراها زملاؤك ما لم يضبطوها هم أيضًا على أجهزتهم. وإذا كنت تستخدم Cursor IDE على أكثر من جهاز، مثل جهاز شخصي وآخر للعمل، فستحتاج إلى إعداد هذه القواعد يدويًا في كل نسخة.

### إنشاء ملفات `.cursor/index.mdc` على مستوى المستودع لفرق المشروع

فيما يخص الإعداد على مستوى المشروع:

1. أنشئ ملف `.cursor/index.mdc` داخل المستودع
2. اضبط نوع القاعدة على `Always` من داخل واجهة Cursor، أو حدده يدويًا في الملف
3. ابدأ بملخص سريع عن المشروع، مثل وظيفة المشروع والمكدس التقني
4. وثّق الأنماط المعمارية التي ينبغي أن يفهمها الذكاء الاصطناعي
5. أضف اتفاقيات الشفرة الخاصة بهذا المشروع
6. حاول أن يبقى الملف تحت 100 سطر لتحسين استهلاك التوكنات

ملاحظة: ملفات `.cursorrules` القديمة ما تزال تعمل، لكنها لم تعد الخيار الموصى به.

#### قالب مختصر لقواعد مشروع Cursor على مستوى المستودع

إليك قالبًا بسيطًا للبداية:

```markdown
# Project: [Project Name]

## Overview
- Purpose: [Brief description]
- Stack: [Key technologies]
- Architecture: [Key pattern - MVC, microservices, etc.]

## Code Patterns
- [List project-specific patterns]

## Style Requirements
- [Project-specific style guidelines]
```

### بناء ملفات قواعد `.mdc` مرتبطة بالسياق للمهام المتخصصة

إذا أردت مستوى أكثر تقدمًا من الإعداد:

1. أنشئ المجلد `.cursor/rules/` داخل المستودع
2. أضف ملفات `.mdc` مخصصة لسياقات مختلفة
3. سمِّ الملفات بطريقة وصفية تعبّر عن الغرض منها
4. احرص على أن يركّز كل ملف على جانب واحد فقط
5. أضف وصفًا موجزًا في أعلى كل ملف ليساعد الذكاء الاصطناعي على فهم متى ينبغي تطبيق هذه القواعد

#### إنشاء القواعد يدويًا أم عبر واجهة Cursor IDE؟

يمكنك إنشاء هذه الملفات يدويًا، أو عبر واجهة Cursor IDE:

1. اذهب إلى `Settings > Rules`
2. انقر على `Add Rule`
3. أدخل اسمًا ووصفًا للقاعدة
4. أضف محتوى القاعدة المخصص
5. احفظ القاعدة، وسيقوم Cursor بإنشاء ملف `.mdc` المناسب داخل المستودع

كلتا الطريقتين فعالتان. يمنحك الإنشاء اليدوي تحكمًا أكبر في بنية الملف، بينما توفّر واجهة Cursor تجربة أكثر توجيهًا.

#### مثال على ملف قواعد Cursor خاص بتطوير React

على سبيل المثال، قد يبدو ملف قواعد مكونات React على هذا النحو:

```markdown
# React Component Guidelines

These rules apply when working with React components in this project.

## Component Structure
- Functional components with TypeScript interfaces for props
- Custom hooks for complex state management
- Styled components for styling

## Naming Conventions
- Component files: PascalCase.tsx
- Hook files: use[Name].ts
- Style files: [name].styles.ts
```

## فوائد ملموسة لاستخدام قواعد مشروع Cursor في البرمجة بمساعدة الذكاء الاصطناعي

بعد تطبيق هذا النظام متعدد المستويات، لاحظت تحسينات عملية وواضحة في أكثر من جانب.

### تحسن جودة الشفرة من خلال قواعد Cursor المتسقة

أول فائدة شعرت بها كانت اتساق جودة الشفرة. فعندما أضمّن تفضيلاتي داخل قواعد المشروع، ينتج الذكاء الاصطناعي شفرة:

- تلتزم بمبادئ البرمجة الوظيفية باستمرار
- تطبق معالجة مناسبة للأخطاء من دون حاجة إلى تذكير متكرر
- تضيف تعريفات أنواع مناسبة من دون تذكير دائم
- تحافظ على اتفاقيات تسمية متسقة في جميع أجزاء المشروع

ويترجم هذا إلى عدد أقل من ملاحظات المراجعة ووقت أقل يُهدر في إصلاحات الأسلوب. ففي أحد المشاريع انخفض عدد تعليقات المراجعة المرتبطة بالأسلوب في طلبات السحب بنسبة 50% بعد تطبيق هذه القواعد.

### تحسين تعاون الفريق عبر قواعد مشتركة لمشروع Cursor

عند العمل ضمن فريق، تخلق هذه القواعد فهمًا مشتركًا:

- يفهم أعضاء الفريق الجدد التوقعات بسرعة من خلال ملف القواعد الموجود في المستودع
- يتحسن التعاون بين التخصصات لأن المهندسين وغير المهندسين يستطيعون الرجوع إلى المرجعية نفسها
- يحدث نقل المعرفة تلقائيًا لأن الذكاء الاصطناعي يطبّق أفضل الممارسات بشكل متسق

وقد وجدت هذا مفيدًا جدًا عند تأهيل المطورين المبتدئين، لأنهم يحصلون على ملاحظات فورية حول أفضل الممارسات بدلًا من انتظار مراجعة الشفرة.

### مكاسب إنتاجية من تحسين التفاعل مع الذكاء الاصطناعي في Cursor IDE

الأرقام هنا معبّرة بوضوح:

- انخفاض بنحو 60% في الوقت الذي يُصرف على شرح معايير الشفرة لأعضاء الفريق الجدد
- تسريع أولي لطلبات السحب بنحو 35% مع عدد أقل من دورات المراجعة
- انخفاض بنحو 40% في `commits` المخصصة فقط لإصلاحات الأسلوب داخل سجل git

لكن المقياس الأهم بالنسبة إلي كان الطاقة الذهنية المتاحة. فعندما يتولى الذكاء الاصطناعي الاهتمام بمسائل الأسلوب، يستطيع المطور التركيز على حل المشكلة نفسها بدلًا من استنزاف انتباهه في قواعد التنسيق.

## تقنيات متقدمة لقواعد مشروع Cursor للمطورين المحترفين

بعد أن تصبح مرتاحًا مع البنية الأساسية للقواعد، يمكنك استخدام تقنيات أكثر تقدمًا لتحسين تجربة العمل مع الذكاء الاصطناعي.

### قواعد متخصصة لمهام شائعة في التطوير

وجدت أن ملفات القواعد المتخصصة فعالة جدًا في سيناريوهات مثل:

#### قواعد الاختبار (`test-guidelines.mdc`)

- احترم استراتيجية الاختبار الحالية في المستودع ومجموعة الاختبارات الموجودة
- فضّل اختبارات التكامل والاختبارات الشاملة من البداية إلى النهاية واختبارات التحقق السريعة على إضافة اختبارات وحدات جديدة
- استخدم اختبارات الوحدات نادرًا، وبالدرجة الأولى مع مجموعات البيانات المستقرة أو تحويلات البيانات النقية
- لا تضف اختبارات وحدات فقط لرفع أرقام التغطية
- تجنّب استخدام `mocks` عندما تكون الاستدعاءات الحقيقية عملية
- غالبًا ما يكون من الأفضل إنفاق قدر بسيط على الاستدعاءات الحقيقية بدلًا من بناء اختبارات هشة قائمة على `mocks`
- حدّد الحد الأدنى فقط من التغطية المطلوبة للمهمة الحالية

#### قواعد تكامل API (`api-standards.mdc`)

- متطلبات معالجة الأخطاء
- أنماط إعادة المحاولة
- معايير تدفق المصادقة

#### قواعد إدارة الحالة (`state-patterns.mdc`)

- اتفاقيات تسمية إجراءات `Redux`
- إرشادات تطبيع الحالة
- أنماط التعامل مع الآثار الجانبية

وعند فصل هذه الجوانب في ملفات مستقلة، يبقى كل ملف مركزًا، ولا يُفعَّل إلا حين يكون ملائمًا للمهمة الحالية.

### تحسين استهلاك التوكنات داخل قواعد مشروع Cursor

لتحقيق أفضل استفادة من نافذة السياق:

1. **أعطِ الأولوية للأهم**: ضع القواعد الأكثر أهمية في بداية الملف أو نهايته
2. **استخدم بنية هرمية**: ابدأ بالمبادئ العامة ثم انتقل إلى التفاصيل
3. **أزل التكرار**: لا تكرر القاعدة نفسها في أكثر من موضع
4. **اكتب بإيجاز**: استخدم نقاطًا مختصرة بدل الفقرات الطويلة
5. **استفد من تنسيق Markdown**: استخدم العناوين لتقسيم فئات القواعد بوضوح

وكقاعدة تقريبية، إذا تجاوز ملف القواعد 100 سطر، فغالبًا أنه يحاول أن يفعل أكثر من اللازم، ومن الأفضل تقسيمه إلى ملفات أكثر تركيزًا.

### معالجة المشكلات الشائعة في قواعد مشروع Cursor

إذا لم تعطِ القواعد النتائج التي تتوقعها:

1. **تعارض القواعد**: تأكد من عدم وجود تعليمات متناقضة بين المستويات المختلفة
2. **عمومية مفرطة**: اجعل القواعد أكثر تحديدًا بإضافة أمثلة ملموسة
3. **تخصيص مفرط**: القواعد الضيقة جدًا قد لا تصلح لسيناريوهات مشابهة
4. **قيود التوكنات**: إذا كانت القواعد تُقتطع، فرتّبها حسب الأولوية واختصرها
5. **نقص السياق**: قد يحتاج الذكاء الاصطناعي إلى سياق إضافي من الملفات ليطبّق القواعد بشكل صحيح
6. **تكدّس القواعد**: عندما تظهر قواعد كثيرة جدًا في الحوار نفسه، يجد النموذج صعوبة في تذكّرها واتباعها كلها في وقت واحد، لذا أعطِ الأولوية للأهم

ومن واقع التجربة، فإن مراجعة الشفرة الناتجة على ضوء هذه القواعد ثم تحسينها تدريجيًا تؤدي إلى تحسن مستمر في جودة المساعدة التي يقدمها الذكاء الاصطناعي.

## Cursor IDE مقارنةً بمساعدي البرمجة الآخرين المعتمدين على الذكاء الاصطناعي

مع أن Cursor يقدّم نظامًا مصممًا بعناية لإدارة القواعد، فإن أدوات أخرى توفر أيضًا وسائل مشابهة للتخصيص:

- يوفّر GitHub Copilot ملف `.github/copilot/settings.yml` للإعداد على مستوى المشروع
- يوفّر JetBrains AI Assistant مقتطفات وقوالب على مستوى المشروع
- يدعم VS Code مع إضافات الذكاء الاصطناعي المختلفة إعدادات مساحة العمل وملفات التخصيص

ملاحظة: يوضّح انتقال Cursor من `.cursorrules` بوصفها صيغة قديمة إلى `.cursor/index.mdc` مع النوع `Always` كيف تستمر هذه الأنظمة في التطور نحو مرونة وتنظيم أفضل.

### اقتصاد التوكنات: كيف تعظّم أداء الذكاء الاصطناعي عبر مختلف الأدوات

ما يجمع كل هذه الأساليب هو مبدأ أساسي واحد: **تقليل استهلاك التوكنات ضروري للحصول على أفضل النتائج**. وبغض النظر عن أداة البرمجة بالذكاء الاصطناعي التي تستخدمها، فإن تقديم مقدار كافٍ من السياق من دون إغراق النموذج هو مفتاح النجاح.

اقتصاد التوكنات يعمل بالطريقة نفسها عبر جميع الأدوات المعتمدة على نماذج اللغة:

1. كل كلمة تضيفها إلى التعليمات تستهلك توكنات
2. التوكنات المستخدمة في التعليمات تقلل من المساحة المتاحة لفهم الشفرة
3. الإرشادات المفرطة في الطول تؤدي إلى عوائد متناقصة

لذلك، سواء كنت تستخدم نظام Cursor ثلاثي المستويات أو خيارات التخصيص في أداة أخرى، حاول دائمًا أن تكون دقيقًا وموجزًا. ركّز على الأنماط والتفضيلات التي تهم فعلًا، واترك للذكاء الاصطناعي مهمة التعامل مع الباقي.

الميزة الحقيقية ليست في الأداة التي تقدم عددًا أكبر من خيارات التخصيص، بل في مدى حسن استخدامك لهذه الخيارات للتعبير عن توقعاتك من دون إهدار التوكنات على تفاصيل غير لازمة.

## شرح فيديو: شاهد التطبيق الكامل لقواعد Cursor IDE

إذا كنت تفضّل التعلم بصريًا، فقد أعددت شرحًا مرئيًا شاملًا يعرض التطبيق الكامل لهذا النظام ثلاثي المستويات:

[![الشرح الكامل لقواعد Cursor IDE للذكاء الاصطناعي: المستويات الخمسة وملف .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

يغطي الفيديو ما يلي:

- إعداد القواعد العامة في إعدادات Cursor IDE
- إنشاء ملفات `.cursorrules` على مستوى المستودع مع أمثلة عملية
- تطبيق ملفات `.cursor/rules/*.mdc` المرتبطة بالسياق للمهام المتخصصة
- شرح كيفية تكامل كل مستوى مع الآخر لتحسين أداء المساعد الذكي
- استعراض المشكلات الشائعة وكيفية تحسين استهلاك التوكنات

سترى سير العمل كاملًا أثناء التطبيق، من الإعداد الأولي حتى البنية متعددة المستويات الأكثر تقدمًا التي تغيّر طريقة تعاونك مع مساعدي الذكاء الاصطناعي.

إذا أردت أيضًا مقالات مماثلة عن مساعدين برمجيين آخرين، فستجدها هنا:

- قواعد Claude Code للذكاء الاصطناعي: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- قواعد Codex للذكاء الاصطناعي: [https://kirill-markin.com/articles/codex-rules-for-ai/](https://kirill-markin.com/articles/codex-rules-for-ai/)
