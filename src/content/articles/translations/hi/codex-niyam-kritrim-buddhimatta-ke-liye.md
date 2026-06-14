---
title: "Codex के नियम: वैश्विक निर्देश, AGENTS.md और Mac ऐप"
date: 2026-04-11
lastmod: 2026-05-20
slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
description: "मैं Codex के स्थायी निर्देशों, AGENTS.md और Mac ऐप की मदद से अलग-अलग रिपॉज़िटरी में एकसार कोडिंग ढंग, साफ त्रुटि-प्रबंधन और छोटे-सटीक बदलाव कैसे बनाए रखता हूं।"
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

# Codex के नियम: वैश्विक निर्देश, AGENTS.md और Mac ऐप

मैंने Codex का गंभीरता से इस्तेमाल अभी करीब एक महीने पहले ही शुरू किया है, खासकर तब से जब GPT-5.4 ने इसे मेरे लिए सच में उपयोगी बना दिया। इसलिए यह कोई "पांच साल की कड़ी परीक्षा से निकली समझ" वाला लेख नहीं है। मेरी बात इससे कहीं सीधी है: Codex मेरे लिए उसी दिन बेहतर हुआ, जब मैंने उसे एक और चमकदार प्रॉम्प्ट बॉक्स की तरह लेना बंद किया और शुरू से ही उसे स्थिर निर्देश देने लगा।

OpenAI के पास Codex CLI भी है और Mac ऐप भी। मेरे लिए दोनों का मूल विचार एक ही है: स्थायी निर्देश, `AGENTS.md`, रिपॉज़िटरी के नियम, और ऐसा एजेंट जो मेरे काम करने के तरीके को पहले से समझकर चले। मैं Mac ऐप को इसलिए पसंद करता हूं, क्योंकि उसमें काम करना एक और टर्मिनल विंडो में फंसे रहने से कहीं ज़्यादा सहज लगता है।

Codex CLI यह काम पहले से अच्छी तरह कर लेता है। Mac ऐप उसी मूल कार्यप्रवाह को बस अधिक साफ, सुंदर और आरामदेह रूप देता है। मैं हर नए काम में बार-बार यह नहीं समझाना चाहता कि मुझे कड़ा प्रकार-निर्धारण चाहिए, बदलाव छोटे और सीधे हों, त्रुटियां साफ दिखाई दें, बेवजह की बचाव-व्यवस्थाएं न हों, और बिखरी हुई व्याख्याओं की जगह कोड के भीतर docstrings लिखी जाएं। मैं चाहता हूं कि यह आधार शुरू से मौजूद रहे।

व्यवहार में यह सब `Settings -> Personalization -> Custom instructions` में रहता है।

असल में ऐप के ये निर्देश आपकी निजी `AGENTS.md` फ़ाइल से जुड़े होते हैं। यह मेरे लिए अच्छी बात है। इससे एक ओर बेहतर ऐप अनुभव मिलता है, और दूसरी ओर CLI जैसी फ़ाइल-आधारित स्पष्टता भी बनी रहती है।

## Codex के Custom Instructions वास्तव में कहाँ रहते हैं

अगर इस लेख से आपको सिर्फ एक स्क्रीन याद रखनी हो, तो वही यह स्क्रीन होनी चाहिए।

ऐप में वैश्विक निर्देश `Settings -> Personalization -> Custom instructions` के अंदर रहते हैं। मैं सबसे पहले यही स्क्रीन दिखाऊंगा।

OpenAI के [Codex docs](https://developers.openai.com/codex/) कहते हैं कि Codex आपकी Codex होम डायरेक्टरी में रखी वैश्विक निर्देश-फ़ाइल पढ़ सकता है, जो आम तौर पर `~/.codex/AGENTS.md` होती है। [Codex settings docs](https://developers.openai.com/codex/config/) यह भी कहते हैं कि `Custom Instructions` में किया गया बदलाव आपकी निजी `AGENTS.md` को अपडेट करता है।

मुझे यही ढांचा चाहिए। मैं ऐप को अपना मुख्य इंटरफ़ेस बना सकता हूं, और फिर भी उसके पीछे मौजूद असली फ़ाइल की स्पष्टता नहीं खोता।

मेरे मन में इसकी परतें कुछ इस तरह बैठती हैं:

1. अलग-अलग परियोजनाओं में लागू मेरी डिफ़ॉल्ट प्राथमिकताओं के लिए व्यक्तिगत `~/.codex/AGENTS.md`
2. टीम और रिपॉज़िटरी से जुड़े निर्देशों के लिए रिपॉज़िटरी `AGENTS.md`
3. इन नियमों के आसपास Codex ऐप की सेटिंग्स और रिपॉज़िटरी मार्गदर्शन

यह रही वह स्क्रीन:

![Codex ऐप के Custom Instructions और वैश्विक कोडिंग नियमों वाला निजी AGENTS.md](/articles/codex-personalization-custom-instructions.jpg)

## वे नियम जिन्हें मैं चाहता हूं कि Codex हर जगह पहले से साथ लाए

यह वही बुनियाद है जिसे मैं चाहता हूं कि Codex किसी भी रिपॉज़िटरी में परियोजना-विशेष निर्देश पढ़ने से पहले साथ लेकर पहुंचे।

```markdown
# Global Rules

## Code Style

- Comments in English only
- Prefer functional programming over OOP
- Use OOP classes only for connectors and interfaces to external systems
- Write pure functions - only modify return values, never input parameters or global state
- Follow DRY, KISS, and YAGNI principles
- Prefer simple solutions and avoid premature abstractions
- Use strict typing for returns, variables, collections, and complex data; prefer structured models or typed interfaces over loose dictionaries; avoid weak generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`; use strict language features such as discriminated unions and enums
- Check if logic already exists before writing new code
- Never use default parameter values - make all parameters explicit
- Write simple single-purpose functions - no multi-mode behavior, no flag parameters that switch logic. If the user needs multiple modes, they will ask explicitly

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- No fallbacks unless I explicitly ask for them; fix root causes instead of masking symptoms, and make code either succeed or fail with a clear error
- External API or service calls: use retries with warnings, then raise the last error
- Error messages must be clear, actionable, and specific: explain what failed and why, include request params, response body, status codes, and avoid generic "something went wrong"
- Logging should use structured fields instead of interpolating dynamic values into message strings

## Libraries and Dependencies

- Use modern package management files like `pyproject.toml` and `package.json`; install dependencies in project environments, not globally
- Add or update dependencies in project config files, not as one-off manual installs
- If a dependency is installed locally, read its source code when needed instead of guessing, even if it is gitignored

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

## Workflow

- Read the existing code and relevant project instructions before editing
- Keep changes minimal and tightly scoped to the current request: make the smallest useful diff, change only the lines needed to solve the problem, and avoid unrelated improvements unless the user asks for them
- Match the existing style of the repository even if it differs from my personal preference; new code must look like it was written by the same author
- Do not revert unrelated changes
- If you are unsure, inspect the codebase instead of inventing patterns
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

यह फ़ाइल सबसे अच्छे अर्थ में बिलकुल सीधी-सादी है।

इसका काम बस बार-बार होने वाली रगड़ कम करना है:

- जब मुझे बस छोटा सा `patch` चाहिए हो, तब Codex का पूरा `refactor` छेड़ देना
- Codex का अपनी अनिश्चितता को मुलायम भाषा के पीछे छिपा देना
- "सुरक्षा" के नाम पर अनावश्यक बचाव-व्यवस्था जोड़ देना
- जब निर्देश बहुत संकरे हों, तब रिपॉज़िटरी की परंपराओं को अनदेखा कर देना

जब ये नियम पहले से लोड होते हैं, तो पूरा सत्र कहीं ज़्यादा शांत हो जाता है।

## मैं वैश्विक नियमों को रिपॉज़िटरी नियमों से ऊपर क्यों रखता हूं

Codex, `AGENTS.md` की परतदार व्यवस्था को अच्छी तरह संभालता है। OpenAI वैश्विक फ़ाइल `~/.codex/AGENTS.md` का ज़िक्र करता है, और फिर जैसे-जैसे काम की निर्देशिका अधिक विशिष्ट होती जाती है, वैसे-वैसे रिपॉज़िटरी और भीतर की निर्देशिका-फ़ाइलें लागू होने लगती हैं।

यह परतदार व्यवस्था उपयोगी है, लेकिन पहली परत फिर भी मेरी होनी चाहिए।

मेरी निजी फ़ाइल को इन सवालों का जवाब देना चाहिए:

- मैं कोड लिखने का ढंग कितना सख्त रखना चाहता हूं
- मेरे लिए किस तरह का त्रुटि-प्रबंधन स्वीकार्य है
- बदलाव करते समय एजेंट कितना आक्रामक हो
- रोज़मर्रा के कोडिंग काम में किस बिंदु पर चीज़ को पूरा माना जाए

रिपॉज़िटरी फ़ाइल को इन सवालों का जवाब देना चाहिए:

- यह कोडबेस किस तरह व्यवस्थित है
- कौन-कौन सी कमांड चलानी हैं
- कौन से हिस्से नाज़ुक हैं
- टीम PR, commit या दस्तावेज़ीकरण को कैसे संभालना चाहती है

संक्षेप में:

- व्यक्तिगत `AGENTS.md` बताता है कि मैं कैसे काम करता हूं
- रिपॉज़िटरी `AGENTS.md` बताता है कि यह कोडबेस कैसे चलती है

अगर मैं दोनों को मिला दूं, तो दोहराव होगा, धीरे-धीरे फर्क पैदा होगा, और आखिर में ऐसी फ़ाइल बनेगी जिसे कोई बनाए रखना नहीं चाहेगा।

यही वजहों में से एक है कि Codex मेरे लिए उम्मीद से बेहतर निकला। इसकी निर्देश-श्रृंखला साफ दिखाई देती है। यह किसी छिपे हुए प्रॉम्प्ट-जुगाड़ जैसा कम और एक वास्तविक व्यवस्था जैसा ज़्यादा लगता है।

## Mac ऐप ही मेरा मुख्य इंटरफ़ेस है, और यह मायने रखता है

इस समय Codex Mac ऐप का हिस्सा मुझे सबसे ज़्यादा पसंद आ रहा है।

यह इसलिए नहीं कि CLI कमजोर है। CLI पहले से बहुत अच्छा है। ऐप बस रोज़मर्रा के इस्तेमाल के लिए ज़्यादा सुखद है। नीचे वही Codex है, ऊपर कहीं बेहतर अनुभव।

इसीलिए मैं इस लेख का केंद्र CLI को नहीं बना रहा, भले ही CLI महत्वपूर्ण हो। उसी व्यवस्था को इस्तेमाल करने का मेरे लिए बेहतर तरीका ऐप है।

ऐप को सिर्फ सजावटी चीज़ की जगह एक ठोस साधन बनाने वाली बात यह है कि उसके निर्देश अब भी `AGENTS.md` पर टिके हैं। ऐप के दस्तावेज़ कहते हैं कि `Custom Instructions` बदलने से निजी निर्देश `AGENTS.md` में अपडेट होते हैं, और मुझे यही रिश्ता चाहिए:

- सुविधा के लिए ऐप सेटिंग्स
- टिकाऊपन के लिए फ़ाइल-आधारित निर्देश

इससे बाद में CLI के उपयोग को समझना भी आसान हो जाता है, क्योंकि वही आधारभूत निर्देश आगे तक साथ चलते हैं।

## रिपॉज़िटरी `AGENTS.md` अब भी ज़रूरी है, बस वही कहानी का मुख्य पात्र नहीं है

मैं नहीं चाहता कि यह लेख `AGENTS.md` की परतों पर पूरा मार्गदर्शक बन जाए, जबकि Codex यह काम ठीक से करता है।

मेरा तरीका इससे सरल है:

- व्यक्तिगत `AGENTS.md` Codex को मेरा बुनियादी व्यवहार देता है
- रिपॉज़िटरी `AGENTS.md` Codex को रिपॉज़िटरी से जुड़ी अपेक्षाएं देता है
- अंदरूनी स्तर की फ़ाइलें सिर्फ उन दुर्लभ जगहों के लिए हैं जहां उनकी सच में जरूरत हो

इससे पूरी व्यवस्था समझने में आसान रहती है।

अगर मैं कोई अनजान रिपॉज़िटरी खोलूं और Codex अजीब बर्ताव करे, तो मैं वजह जल्दी समझना चाहता हूं। आम तौर पर जवाब इनमें से एक होना चाहिए:

1. मेरे वैश्विक नियम पर्याप्त स्पष्ट नहीं हैं
2. रिपॉज़िटरी निर्देश गायब हैं
3. काम खुद बहुत व्यापक है

यह नहीं कि मुझे बैठकर सोचना पड़े कि सात छिपी हुई निर्देश-परतों में इस बार किसकी चली।

## मेरी Codex व्यवस्था में CLI की जगह

Mac ऐप मेरा मुख्य इंटरफ़ेस है। CLI कोई दोयम दर्जे का सहारा नहीं है। वह वही Codex व्यवस्था है, बस उसका रूप अलग है।

CLI कुछ वजहों से अब भी महत्वपूर्ण है:

- यह फ़ाइल-आधारित विन्यास को एकदम साफ कर देता है
- ठीक-ठीक व्यवहार को जांचना या उसे स्क्रिप्ट में ढालना इसमें आसान होता है

मैं CLI के लिए अलग सोच नहीं रखना चाहता। मैं वही व्यक्तिगत `AGENTS.md`, वही रिपॉज़िटरी मार्गदर्शन, और दोनों जगह वही सुरक्षा-सीमाएं चाहता हूं।

यही निरंतरता उस बड़ी वजह का हिस्सा है जिसके कारण यह उत्पाद मुझे एकसार लगता है।

## अभी मेरी व्यावहारिक Codex व्यवस्था

अगर मैं आज Mac पर इसे बिल्कुल शुरुआत से सेट करूं, तो क्रम यही रखूंगा।

### 1. सबसे पहले ऐप में अपने निजी निर्देश लिखें

`Cmd+,` दबाकर Codex ऐप की सेटिंग्स खोलें, `Personalization` में जाएं, और सबसे पहले `Custom Instructions` वहीं लिखें। मैं अब भी `~/.codex/AGENTS.md` के हिसाब से सोचता हूं, लेकिन इसे जमाने और समय-समय पर देखने की मेरी मुख्य जगह ऐप ही है।

### 2. व्यक्तिगत फ़ाइल छोटी रखें, लेकिन रुख साफ हो

परियोजना की संरचना यहां नहीं होनी चाहिए। यहां वे टिकाऊ नियम होने चाहिए जो हर जगह साथ चलें:

- कड़ा प्रकार-निर्धारण
- स्पष्ट त्रुटि-प्रबंधन
- चुपचाप दूसरी राह पकड़ लेने वाली व्यवस्था नहीं
- छोटे और सीधे बदलाव
- बिखरे हुए दस्तावेज़ों की जगह कोड के भीतर लिखी docstrings
- टर्मिनल के साफ-सुथरे तौर-तरीके

### 3. रिपॉज़िटरी AGENTS.md केवल रिपॉज़िटरी-सत्य के लिए जोड़ें

यहीं कमांड, बनावट, सीमाएं, नामकरण, परीक्षण की अपेक्षाएं और संवेदनशील हिस्सों की जानकारी होनी चाहिए। यही रिपॉज़िटरी वाली परत है।

## अभी Codex मुझे आशाजनक क्यों लगता है

मैं अभी भी Codex के साथ शुरुआती दौर में हूं, इसलिए मैं इसे बढ़ा-चढ़ाकर पेश नहीं करूंगा।

लेकिन इसका मेल अभी से मजबूत लगता है:

- फ़ाइल पर आधारित निर्देशों की एक असली परत
- ऐप और CLI, जो एक-दूसरे से जुड़े लगते हैं, टकराते हुए नहीं

मेरे लिए इसे इस्तेमाल करते रहने के लिए इतना काफी है।

अब तक मेरे लिए सबसे असरदार साबित हुई व्यवस्था सबसे कम चमकदार भी है: ठोस स्थायी निर्देश लिखो, रिपॉज़िटरी मार्गदर्शन को अलग रखो, और एजेंट को ऐसे आधार से शुरू होने दो जो पहले से तुम्हारे काम करने के तरीके से मेल खाता हो।

ढर्रा Cursor जैसा ही है। Claude Code जैसा ही है। उत्पाद अलग है, सीख वही है: सत्र तब बेहतर होता है, जब एजेंट यह अंदाज़ा लगाना बंद कर दे कि आप कौन हैं।

अगर आप इससे जुड़े दूसरे लेख पढ़ना चाहते हैं, तो वे यहां हैं:

- Cursor IDE के नियम: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- Claude Code के नियम: [https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/)
