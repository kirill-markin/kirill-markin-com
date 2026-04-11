---
title: "قواعد Claude Code: تعليمات CLAUDE.md العامة للذكاء الاصطناعي"
date: 2026-04-11
slug: "qawaid-claude-code-lilthakaa-alistinaei"
description: "قواعدي لـ Claude Code باستخدام تعليمات CLAUDE.md العامة: كيف أفصل بين القواعد الشخصية وقواعد المشروع حتى يحافظ الوكيل على أنماط البرمجة نفسها عبر المستودعات."
tags: [productivity, claude-code, ai, llm]
publish: true
thumbnailUrl: "/articles/claude-code-global-rules-terminal.jpg"
language: "ar"
originalArticle:
  language: "en"
  slug: "claude-code-rules-for-ai"
translations:
  - language: "en"
    slug: "claude-code-rules-for-ai"
  - language: "es"
    slug: "reglas-claude-code-para-ia"
  - language: "zh"
    slug: "claude-code-ai-guize"
  - language: "hi"
    slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
---

# قواعد Claude Code: تعليمات CLAUDE.md العامة للذكاء الاصطناعي

أصبح Claude Code أفضل بكثير بالنسبة لي عندما توقفت عن إعادة شرح نفسي في كل chat. أنا أبرمج مع الذكاء الاصطناعي منذ نحو سنتين، وأستخدم Claude Code منذ حوالي الأشهر الستة الأخيرة، وكان التحسين الأكثر فائدة بسيطًا إلى حد محرج: ضع قواعدي الافتراضية في `~/.claude/CLAUDE.md` ودع الوكيل يبدأ من هناك.

قبل ذلك، كنت أستهلك الرسائل في الأشياء نفسها. استخدم typing صارمًا. لا تضف fallbacks لم أطلبها. أبقِ diff صغيرة. لا تعِد كتابة نصف الملف لأنك تحمست. غالبًا كان Claude يستمع. لكنني كنت أضطر إلى دفع هذه الضريبة مرة بعد مرة.

الآن صار هذا الخط الأساسي موجودًا قبل أن يدخل المستودع أصلًا في المحادثة.

## أين أحتفظ بتعليمات Claude Code العامة

تقسم [وثائق Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) من Anthropic هذا إلى عدة طبقات. `~/.claude/CLAUDE.md` هو الملف على مستوى المستخدم. و`./CLAUDE.md` أو `./.claude/CLAUDE.md` هي طبقة المشروع المشتركة. و`CLAUDE.local.md` مخصص لملاحظات المشروع الشخصية التي يجب أن تبقى خارج git.

هذا يطابق تقريبًا تمامًا ما أريده:

1. `~/.claude/CLAUDE.md` لتفضيلاتي البرمجية الدائمة
2. `CLAUDE.md` الخاص بالمشروع للهندسة والأوامر الخاصة بالمستودع
3. `CLAUDE.local.md` عندما أحتاج إلى ملاحظات مشروع شخصية يجب أن تبقى خارج git

لا أريد لصق القواعد الشخصية نفسها في كل مستودع أفتحه. إذا كانت "لا fallbacks صامتة" تفضيلًا عامًا، فيجب أن تعيش في الملف العام. وإذا كان "شغّل هذا الأمر الداخلي الغريب قبل الاختبارات" شيئًا خاصًا بالمستودع، فيجب أن يعيش في ملف المشروع.

هذه هي النسخة التي أستخدمها الآن في Claude Code:

![تعليمات Claude Code العامة في CLAUDE.md لقواعد برمجة الذكاء الاصطناعي الدائمة](/articles/claude-code-global-rules-terminal.jpg)

## قواعد Claude Code التي أستخدمها فعلًا

هذه الكتلة مملة عن قصد. القواعد الجيدة غالبًا تكون كذلك. أنا لا أحاول وصف كل edge case مسبقًا. أريد فقط أن يتوقف Claude Code عن ارتكاب الأخطاء المتوقعة نفسها.

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

## Language Specifics

- Prefer structured data models over loose dictionaries
- Avoid generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`
- Use modern package management files like `pyproject.toml` and `package.json`
- Use the language's strict type features when available

## Libraries and Dependencies

- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- If a dependency is installed locally, read its source code when needed instead of guessing
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

## Claude Code Workflow

- Read the existing code and relevant `CLAUDE.md` files before editing
- Keep changes minimal and related to the current request
- Match the existing style of the repository even if it differs from my personal preference
- Do not revert unrelated changes
- If you are unsure, inspect the codebase instead of inventing patterns
- When project instructions include test or lint commands, run them before finishing if the task changed code

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code
- Never duplicate documentation across files
- Store knowledge as current state, not as a changelog of modifications
```

هذه الكتلة تغطي معظم ما يهمني يومًا بعد يوم.

من دونها، ينحرف Claude بطرق مألوفة جدًا. يضيف سلوك fallback "احتياطًا". يوسّع الأنواع لأن strict typing تبدو مزعجة. يلف الوظائف البسيطة بطبقات إضافية. ويصلح المشكلة الخطأ لأنه يحاول أن يكون مجاملًا بدل أن يكون دقيقًا.

أفضل أن أقضي عشر دقائق مرة واحدة في كتابة ملف عام جيد، بدلًا من الاستمرار في تصحيح هذه الأنماط واحدًا واحدًا في كل جلسة جديدة.

## أولًا CLAUDE.md العام، ثم CLAUDE.md الخاص بالمشروع

لا أريد ملف `CLAUDE.md` واحدًا ضخمًا محشوًا بكل شيء.

ملفي العام يجب أن يجيب عن أسئلة مثل:

- إلى أي حد أريد typing صارمًا؟
- كيف أريد التعامل مع الأخطاء؟
- هل أريد diffs صغيرة أم refactors واسعة؟
- ما نوع الوثائق التي أتوقعها؟

أما ملف المشروع فيجب أن يجيب عن أسئلة مختلفة:

- كيف أشغّل المشروع؟
- ما الأوامر الآمنة والمتوقعة؟
- ما أهم حدود الهندسة؟
- أين تعيش الاختبارات؟
- ما الأعراف الخاصة بهذا المستودع فقط؟

عمليًا:

- `CLAUDE.md` العام يقول كيف أعمل أنا
- `CLAUDE.md` الخاص بالمشروع يقول كيف يعمل هذا المستودع

حين يختلط هذان الأمران، يتحول الملف إلى طين. نصفه عام أكثر من اللازم، ونصفه محلي أكثر من اللازم، ويضطر Claude إلى حمل كل ذلك في كل مهمة.

وتوصي Anthropic أيضًا بالحفاظ على هذه الملفات موجزة. جيد. ملفات التعليمات الطويلة غالبًا ما تبدو كأن أحدهم حاول دفع دليل هندسي كامل داخل الـ prompt. وهذا لا ينتهي جيدًا أبدًا.

## ما الذي ينكسر في منتصف الجلسة

القواعد تساعد. لكنها لا تنقذ جلسة فوضوية إلى الأبد.

إذا قضيت عشرين رسالة وأنا أناقش نظامًا فرعيًا ثم انتقلت فجأة إلى مشكلة مختلفة تمامًا، فقد يبقى Claude عالقًا ذهنيًا في الإطار السابق. هذا طبيعي. أنا لا أتعامل مع المحادثات الطويلة كشيء مقدس.

لذلك عمليًا أفعل هذا:

- أبدأ جلسة جديدة عندما تنتقل المهمة من الاستكشاف إلى التنفيذ
- أبدأ جلسة جديدة عند الانتقال من نظام فرعي إلى آخر مختلف جدًا
- أبقي تعليمات المشروع موجزة بما يكفي حتى لا أدفع context tax في كل turn

ولهذا أيضًا أحب ملفات markdown للخطط والملاحظات. إذا كانت المهمة كبيرة، فأنا أفضل حفظ الحالة بشكل صريح بدل أن أثق في أن thread طويلة ستبقى نظيفة.

## طريقتي العملية لنشر قواعد Claude Code

لو كنت سأعد هذا من الصفر اليوم، فسأفعله بهذا الترتيب.

### 1. أنشئ `~/.claude/CLAUDE.md`

ابدأ بما لا تقبل التفاوض عليه. لا نصائح حياة. لا بيانات هندسية. فقط القواعد التي تتكرر أهميتها عبر المستودعات.

بالنسبة لي، هذا يعني:

- typing صارم
- معالجة أخطاء صريحة
- تعديلات صغيرة
- لا fallbacks صامتة
- docstrings حيث ينبغي أن تكون الوثائق
- عادات terminal غير تفاعلية

هذا وحده يغير النتيجة أكثر من معظم حيل prompts.

### 2. أضف `CLAUDE.md` للمشروع

استخدم ملف المستودع للأوامر والهندسة والتسمية والحدود. تعطيك Anthropic أمر `/init` لصياغة مسودة، وهذا مفيد. لكنني ما زلت أعدله يدويًا بعد ذلك، لأن التعليمات المولدة مسودة وليست artifact نهائيًا.

### 3. أبقِ قواعد المشروع قصيرة

لا تحول ملف المشروع إلى نسخة ثانية من ملفك الشخصي. ضع فيه الأوامر الخاصة بالمستودع وملاحظات الهندسة والأعراف المحلية. واترك تفضيلاتك الدائمة في الملف العام.

## لماذا هذا أهم من الـ Prompting الذكي

الكثير من محتوى "الإعداد النهائي" لوكلاء البرمجة ينزلق سريعًا إلى نوع من المسرحة.

ما حسّن عملي اليومي فعلًا كان أبسط بكثير:

- `CLAUDE.md` عام وثابت على مستوى المستخدم
- `CLAUDE.md` خاص بالمشروع ونظيف

هذا الترتيب يجعل Claude أهدأ. fallbacks عشوائية أقل. تجريدات لطيفة أقل. وجلسات أقل أكتشف فيها بعد عشر دقائق أنني والوكيل كنا نحل مشكلتين مختلفتين قليلًا.

إذا كنت تستخدم عدة وكلاء برمجة، فالنمط نفسه يظهر في أماكن أخرى أيضًا. منتج مختلف، والدرس نفسه: اضبط baseline مرة واحدة وتوقف عن إعادة التفاوض عليها كل صباح.

إذا كنت تريد المقالات المرافقة، فهي هنا:

- Cursor IDE Rules for AI: [https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/](https://kirill-markin.com/ar/maqalat/qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja/)
- Codex Rules for AI: [https://kirill-markin.com/ar/maqalat/qawaid-codex-lilthakaa-alistinaei/](https://kirill-markin.com/ar/maqalat/qawaid-codex-lilthakaa-alistinaei/)
