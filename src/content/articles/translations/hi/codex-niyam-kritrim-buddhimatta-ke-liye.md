---
title: "Codex नियम: Global Instructions, AGENTS.md और Mac ऐप"
date: 2026-04-11
slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
description: "मेरे Codex नियम: custom instructions, AGENTS.md और Mac ऐप के जरिए अलग-अलग repos में एक जैसा coding style, error handling और minimal diffs बनाए रखना।"
tags: [productivity, codex, openai, ai]
publish: true
thumbnailUrl: "/articles/codex-personalization-custom-instructions.jpg"
language: "hi"
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
  - language: "ar"
    slug: "qawaid-codex-lilthakaa-alistinaei"
---

# Codex नियम: Global Instructions, AGENTS.md और Mac ऐप

मैंने Codex को गंभीरता से इस्तेमाल करना अभी करीब एक महीने पहले ही शुरू किया है, खासकर तब से जब GPT-5.4 ने इसे मेरे लिए काफी ज्यादा उपयोगी बना दिया। इसलिए यह "पांच साल की battle-tested wisdom" वाला लेख नहीं है। मेरी बात इससे बहुत सरल है: Codex मेरे लिए उसी क्षण अच्छा हो गया जब मैंने उसे एक और fancy prompt box की तरह ट्रीट करना बंद किया और शुरुआत से ही स्थिर निर्देश देना शुरू किया।

OpenAI के पास Codex CLI भी है और Mac ऐप भी। मेरे लिए दोनों एक ही मूल विचार पर काम करते हैं: persistent instructions, `AGENTS.md`, repo rules, और एक ऐसा agent जो मेरे development patterns के साथ पहले से शुरू होता है। मैं Mac ऐप को पसंद करता हूं क्योंकि वह एक और terminal window की तुलना में कहीं ज्यादा अच्छा अनुभव देता है।

Codex CLI यह हिस्सा पहले से ही अच्छी तरह करता है। Mac ऐप उसी Codex workflow पर एक ज्यादा साफ और सुखद परत देता है। मुझे अब भी वही persistent development patterns चाहिए: strict typing, minimal diffs, explicit errors, random fallbacks नहीं, और बिखरी हुई explanations की जगह code में docstrings। मैं हर नई task में यह सब Codex को फिर से नहीं सिखाना चाहता। मैं चाहता हूं कि यह baseline शुरुआत से मौजूद हो।

व्यवहार में यह `Settings -> Personalization -> Custom instructions` में रहता है।

अंदर ही अंदर, ऐप के ये निर्देश personal `AGENTS.md` में map हो जाते हैं। यह अच्छा है। मुझे CLI जैसी स्पष्टता खोए बिना बेहतर ऐप अनुभव मिल जाता है।

## Codex Custom Instructions वास्तव में कहां रहते हैं

अगर इस लेख से आपको सिर्फ एक screen याद रखनी हो, तो वह यही होनी चाहिए।

ऐप में global instructions `Settings -> Personalization -> Custom instructions` के अंदर रहते हैं। मैं सबसे पहले यही screen दिखाऊंगा।

OpenAI की [Codex docs](https://developers.openai.com/codex/) कहती हैं कि Codex आपके Codex home directory से global instruction file पढ़ सकता है, जो आम तौर पर `~/.codex/AGENTS.md` होती है। [Codex settings docs](https://developers.openai.com/codex/config/) यह भी कहती हैं कि custom instructions edit करने से आपका personal `AGENTS.md` update होता है।

मुझे यही मॉडल चाहिए। मैं ऐप को main interface की तरह इस्तेमाल कर सकता हूं और फिर भी पीछे मौजूद असली file की स्पष्टता बनाए रख सकता हूं।

इसलिए मेरा mental model कुछ ऐसा है:

1. cross-project defaults के लिए personal `~/.codex/AGENTS.md`
2. team और repo guidance के लिए repository `AGENTS.md`
3. उन नियमों के ऊपर Codex ऐप settings और repository guidance

यह रही वह screen:

![Codex ऐप के custom instructions और global coding rules के लिए personal AGENTS.md](/articles/codex-personalization-custom-instructions.jpg)

## वे Codex Rules जिन्हें मैं हर जगह लोड देखना चाहता हूं

यह वह baseline है जिसे मैं चाहता हूं कि Codex किसी भी repository में project-specific instructions देखने से पहले साथ लेकर आए।

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

यह file अच्छे अर्थ में boring है।

यह बार-बार होने वाली friction हटाने के लिए मौजूद है:

- जब मुझे minimal patch चाहिए था तब Codex का broad refactors गढ़ लेना
- Codex का uncertainty को soft language के पीछे छिपाना
- Codex का "safety" के नाम पर fallback behavior जोड़ देना
- prompt बहुत narrow होने पर Codex का repository conventions छोड़ देना

जब ये rules पहले से लोड हों, तो session काफी शांत हो जाती है।

## मैं Global Rules को Repository Rules के ऊपर क्यों रखता हूं

Codex में `AGENTS.md` layering का अच्छा support है। OpenAI global file `~/.codex/AGENTS.md` को document करता है, और फिर working directory के ज्यादा specific होने पर repo और nested directory files लागू होती हैं।

यह layering उपयोगी है, लेकिन पहली layer मेरी होनी चाहिए।

मेरी personal file को इन सवालों का जवाब देना चाहिए:

- मैं coding style को कितना strict रखना चाहता हूं
- मेरे लिए acceptable error handling क्या है
- agent changes के साथ कितना aggressive हो
- सामान्य coding work में "done" का मतलब क्या है

Repository file को इन सवालों का जवाब देना चाहिए:

- यह codebase कैसे organized है
- कौन से commands चलाने हैं
- कौन से हिस्से fragile हैं
- team PRs, commits या docs को कैसे handle करना चाहती है

छोटा version:

- personal `AGENTS.md` बताता है कि मैं कैसे काम करता हूं
- repository `AGENTS.md` बताता है कि यह codebase कैसे काम करती है

अगर मैं दोनों को मिला दूं, तो duplication, drift और ऐसा file मिलता है जिसे कोई maintain नहीं करना चाहता।

यही उन कारणों में से एक है जिनकी वजह से Codex मेरे लिए उम्मीद से बेहतर निकला। इसकी instruction hierarchy साफ है। यह hidden prompt games जैसा कम और एक वास्तविक system जैसा ज्यादा लगता है।

## Mac ऐप मुख्य surface है, और यह बात मायने रखती है

नया Codex Mac ऐप अभी मेरे लिए सबसे enjoyable हिस्सा है।

यह इसलिए नहीं कि CLI कमजोर है। CLI पहले से बहुत अच्छा है। ऐप बस रोजमर्रा के इस्तेमाल के लिए ज्यादा सुखद है। नीचे वही Codex है, ऊपर बहुत बेहतर surface।

इसीलिए मैं इस लेख को CLI के इर्द-गिर्द नहीं बनाना चाहता, भले ही CLI महत्वपूर्ण हो। वही system इस्तेमाल करने का बेहतर तरीका मेरे लिए ऐप है।

ऐप को सिर्फ cosmetic नहीं बल्कि solid बनाने वाली बात यह है कि इसकी instructions अब भी `AGENTS.md` से backed हैं। ऐप docs कहती हैं कि custom instructions edit करने से personal instructions `AGENTS.md` में update होती हैं, और मुझे यही relation चाहिए:

- convenience के लिए ऐप settings
- durability के लिए file-based instructions

इससे बाद में CLI usage को समझना भी आसान हो जाता है, क्योंकि वही base instructions आगे चलती हैं।

## Project AGENTS.md अब भी जरूरी है, बस वही main character नहीं है

मैं नहीं चाहता कि यह लेख `AGENTS.md` nesting tutorial बन जाए, जबकि Codex इसे ठीक से support करता है।

मेरा version ज्यादा simple है:

- personal `AGENTS.md` Codex को मेरा baseline behavior देता है
- repository `AGENTS.md` Codex को repo-specific expectations देता है
- nested files सिर्फ उन rare जगहों के लिए हैं जहां उनकी सच में जरूरत हो

इससे system समझने योग्य रहता है।

अगर मैं कोई random repository खोलूं और Codex खराब behave करे, तो मैं उसे जल्दी debug करना चाहता हूं। आम तौर पर जवाब इनमें से एक होना चाहिए:

1. मेरे global rules स्पष्ट नहीं हैं
2. repo instructions missing हैं
3. task खुद बहुत broad है

ना कि "मुझे याद ही नहीं कि सात hidden instruction layers में कौन सी इस prompt roulette में जीत गई।"

## मेरी Codex Setup में CLI कहां फिट होता है

Mac ऐप मेरी main surface है। CLI कोई second-class fallback नहीं है। वह वही Codex system है, बस अलग posture में।

CLI कुछ वजहों से अब भी महत्वपूर्ण है:

- यह file-based configuration को बहुत obvious बनाता है
- exact behavior inspect या script करना इसमें आसान होता है

मैं CLI के लिए अलग worldview नहीं चाहता। मैं वही personal `AGENTS.md`, वही repo guidance, और दोनों में वही guardrails चाहता हूं।

यह continuity ही उस बड़ी वजह का हिस्सा है जिसकी वजह से product coherent लगता है।

## अभी मेरी Practical Codex Setup

अगर मैं आज Mac पर इसे scratch से set up कर रहा होता, तो मैं इसे इसी क्रम में करता।

### 1. पहले ऐप में Personal Instructions लिखें

`Cmd+,` से Codex ऐप settings खोलें, `Personalization` में जाएं, और custom instructions वहीं पहले लिखें। मैं अब भी `~/.codex/AGENTS.md` के terms में सोचता हूं, लेकिन setup और review के लिए ऐप ही main जगह है।

### 2. Personal File को छोटा और opinionated रखें

Project architecture यहां नहीं होनी चाहिए। यहां durable coding rules होनी चाहिए:

- strict typing
- explicit errors
- silent fallbacks नहीं
- minimal diffs
- scattered docs की जगह docstrings
- clean terminal habits

### 3. Repository AGENTS.md सिर्फ Repo Truth के लिए जोड़ें

Commands, architecture, constraints, testing expectations, naming, dangerous areas. यही repo layer है।

## Codex अभी मुझे promising क्यों लगता है

मैं अभी भी Codex के साथ शुरुआती चरण में हूं, इसलिए मैं इसे बढ़ा-चढ़ाकर नहीं बेचूंगा।

लेकिन इसका combination पहले से मजबूत है:

- एक असली file-based instruction layer
- ऐप और CLI जो connected लगते हैं, contradictory नहीं

मेरे लिए उपयोग जारी रखने के लिए इतना काफी है।

अब तक मेरे लिए सबसे अच्छा काम करने वाली setup सबसे कम glamorous भी है: solid persistent instructions लिखो, repo guidance को अलग रखो, और agent को ऐसी baseline से शुरू होने दो जो पहले से तुम्हारे काम करने के तरीके से मेल खाती हो।

Cursor जैसा वही pattern। Claude Code जैसा वही pattern। Product अलग है, lesson वही है: session तब बेहतर होती है जब agent यह अनुमान लगाना बंद कर दे कि तुम कौन हो।

अगर आप companion articles पढ़ना चाहते हैं, तो वे यहां हैं:

- Cursor IDE Rules for AI: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- Claude Code Rules for AI: [https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/)
