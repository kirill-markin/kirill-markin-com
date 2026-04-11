---
title: "Claude Code नियम: AI के लिए Global CLAUDE.md Instructions"
date: 2026-04-11
slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
description: "मेरे Claude Code नियम: global CLAUDE.md instructions के जरिए personal और project rules को अलग रखकर अलग-अलग repos में एक जैसी coding patterns बनाए रखना।"
tags: [productivity, claude-code, ai, llm]
publish: true
thumbnailUrl: "/articles/claude-code-global-rules-terminal.jpg"
language: "hi"
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
  - language: "ar"
    slug: "qawaid-claude-code-lilthakaa-alistinaei"
---

# Claude Code नियम: AI के लिए Global CLAUDE.md Instructions

Claude Code मेरे लिए तब बहुत बेहतर हुआ जब मैंने हर chat में खुद को दोबारा समझाना बंद किया। मैं करीब दो साल से AI के साथ coding कर रहा हूं, Claude Code का इस्तेमाल लगभग पिछले छह महीनों से कर रहा हूं, और सबसे उपयोगी सुधार शर्मनाक रूप से सरल था: अपने default rules को `~/.claude/CLAUDE.md` में डाल दो और agent को वहीं से शुरू होने दो।

उससे पहले मैं बार-बार वही बात लिखने में messages खर्च करता था। strict typing इस्तेमाल करो। वे fallbacks मत जोड़ो जो मैंने नहीं मांगे। diff छोटा रखो। सिर्फ उत्साहित होकर आधी file rewrite मत कर दो। Claude अक्सर सुन भी लेता था। लेकिन मुझे यह tax फिर भी बार-बार देना पड़ता था।

अब repo बातचीत में आने से पहले ही baseline मौजूद रहती है।

## मैं Claude Code की Global Instructions कहां रखता हूं

Anthropic की [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code/overview) इसे कुछ layers में बांटती हैं। `~/.claude/CLAUDE.md` user-wide file है। `./CLAUDE.md` या `./.claude/CLAUDE.md` shared project layer है। `CLAUDE.local.md` उन personal project notes के लिए है जिन्हें git से बाहर रहना चाहिए।

यह लगभग ठीक वैसा ही है जैसा मैं चाहता हूं:

1. मेरी persistent coding preferences के लिए `~/.claude/CLAUDE.md`
2. repository-specific architecture और commands के लिए project `CLAUDE.md`
3. ऐसी personal project notes के लिए `CLAUDE.local.md` जिन्हें git में नहीं जाना चाहिए

मैं हर repository में वही personal rules paste नहीं करना चाहता। अगर "silent fallbacks नहीं" एक global preference है, तो उसे global file में होना चाहिए। अगर "tests से पहले यह अजीब internal bootstrap command चलाओ" repo-specific है, तो उसे project file में होना चाहिए।

यह वह version है जिसे मैं अभी Claude Code में इस्तेमाल कर रहा हूं:

![persistent AI coding rules के लिए CLAUDE.md में Claude Code global instructions](/articles/claude-code-global-rules-terminal.jpg)

## वे Claude Code Rules जिन्हें मैं वास्तव में इस्तेमाल करता हूं

यह block जानबूझकर boring है। अच्छी rules अक्सर ऐसी ही होती हैं। मैं हर edge case को पहले से describe नहीं करना चाहता। मैं सिर्फ चाहता हूं कि Claude Code वही अनुमानित गलतियां बार-बार करना बंद करे।

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

यह block मेरी रोजमर्रा की लगभग सारी जरूरी चीजें कवर करता है।

इसके बिना Claude बहुत परिचित तरीकों से drift करता है। वह "just in case" fallback behavior जोड़ देता है। strict typing inconvenient लगने पर types चौड़ी कर देता है। simple functions पर extra layers चढ़ा देता है। exact होने की जगह accommodating बनने की कोशिश में गलत समस्या ठीक करने लगता है।

मैं एक बार दस मिनट देकर एक अच्छा global file लिखना पसंद करूंगा, बजाय इसके कि हर नए session में इन patterns को एक-एक करके सुधारता रहूं।

## पहले Global CLAUDE.md, फिर Project CLAUDE.md

मैं ऐसा एक giant `CLAUDE.md` नहीं चाहता जिसमें सब कुछ ठूंस दिया गया हो।

मेरी global file को ऐसे सवालों के जवाब देने चाहिए:

- मैं typing को कितना strict चाहता हूं?
- मैं errors को कैसे handle करना चाहता हूं?
- मुझे minimal diffs चाहिए या broad refactors?
- मैं किस तरह की documentation अपेक्षित करता हूं?

मेरी project file को अलग सवालों के जवाब देने चाहिए:

- project कैसे चलाऊं?
- कौन से commands safe और expected हैं?
- architecture की महत्वपूर्ण boundaries क्या हैं?
- tests कहां रहते हैं?
- कौन सी conventions सिर्फ इसी repo के लिए हैं?

व्यवहार में:

- global `CLAUDE.md` बताता है कि मैं कैसे काम करता हूं
- project `CLAUDE.md` बताता है कि यह repo कैसे काम करता है

जब ये दोनों चीजें मिल जाती हैं, तो file कीचड़ बन जाती है। आधा हिस्सा बहुत generic, आधा बहुत local, और Claude को हर task में यह सब साथ लेकर चलना पड़ता है।

Anthropic भी recommend करता है कि इन files को concise रखा जाए। अच्छा है। लंबी instruction files अक्सर ऐसी लगती हैं जैसे किसी ने पूरा engineering handbook prompt में ठूंसने की कोशिश की हो। उसका अंत कभी अच्छा नहीं होता।

## Session के बीच में क्या टूटता है

Rules मदद करती हैं। वे हमेशा के लिए messy session को नहीं बचातीं।

अगर मैं बीस messages तक किसी एक subsystem पर बात करूं और फिर अचानक किसी अलग problem पर switch कर दूं, तो Claude पहले वाले frame में mentally अटका रह सकता है। यह सामान्य है। मैं लंबी chats को sacred नहीं मानता।

इसलिए व्यवहार में मैं यह करता हूं:

- जब task exploration से implementation में बदलती है, तो fresh session शुरू करता हूं
- जब मैं एक subsystem से बिल्कुल अलग subsystem पर जाता हूं, तो fresh session शुरू करता हूं
- project instructions इतनी concise रखता हूं कि हर turn पर context tax न देना पड़े

इसी वजह से मुझे plans और notes के लिए markdown files पसंद हैं। अगर task बड़ी हो, तो मैं state को explicitly save करना पसंद करूंगा, बजाय इसके कि एक लंबी thread के साफ बने रहने पर भरोसा करूं।

## Claude Code Rules के लिए मेरा Practical Rollout

अगर मैं इसे आज scratch से set up कर रहा होता, तो मैं इसे इसी क्रम में करता।

### 1. `~/.claude/CLAUDE.md` बनाइए

अपनी non-negotiables से शुरुआत कीजिए। life advice नहीं। engineering manifestos नहीं। सिर्फ वे rules जो अलग-अलग repos में बार-बार मायने रखती हैं।

मेरे लिए इसका मतलब है:

- strict typing
- explicit error handling
- minimal edits
- silent fallbacks नहीं
- जहां documentation होनी चाहिए वहां docstrings
- non-interactive terminal habits

सिर्फ इतना ही output को ज्यादातर prompt tweaks से ज्यादा बदल देता है।

### 2. एक Project `CLAUDE.md` जोड़िए

Repo file का इस्तेमाल commands, architecture, naming और boundaries के लिए कीजिए। Anthropic `/init` देता है ताकि आप एक draft बना सकें, और यह उपयोगी है। फिर भी मैं उसे हाथ से edit करता हूं, क्योंकि generated instructions एक draft होती हैं, final artifact नहीं।

### 3. Project Rules को छोटा रखिए

Project file को personal file की दूसरी copy मत बनाइए। Repo-specific commands, architecture notes और local conventions वहीं रखिए। अपनी durable preferences global file में छोड़िए।

## यह Clever Prompting से ज्यादा महत्वपूर्ण क्यों है

Coding agents की "ultimate setup" वाली ज्यादातर content बहुत जल्दी theater में बदल जाती है।

जिस चीज़ ने मेरे day-to-day काम को वास्तव में बेहतर बनाया, वह इससे कहीं ज्यादा simple थी:

- एक stable user-wide `CLAUDE.md`
- एक clean project `CLAUDE.md`

यह stack Claude को ज्यादा calm बनाती है। random fallbacks कम, cute abstractions कम, और ऐसे sessions कम जहां मुझे दस मिनट बाद पता चले कि agent और मैं थोड़ी अलग समस्याएं हल कर रहे थे।

अगर आप कई coding agents इस्तेमाल करते हैं, तो यही pattern दूसरी जगहों पर भी दिखती है। Product अलग, lesson वही: baseline एक बार set कीजिए और हर सुबह उसे फिर से renegotiate करना बंद कीजिए।

अगर आप companion articles पढ़ना चाहते हैं, तो वे यहां हैं:

- Cursor IDE Rules for AI: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- Codex Rules for AI: [https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/)
