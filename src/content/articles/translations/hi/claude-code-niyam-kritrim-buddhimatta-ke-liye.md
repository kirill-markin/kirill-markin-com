---
title: "Claude Code के नियम: AI के लिए वैश्विक CLAUDE.md निर्देश"
date: 2026-04-11
slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
description: "मैं Claude Code में अपने वैश्विक CLAUDE.md नियम अलग रखता हूँ, ताकि निजी पसंद और प्रोजेक्ट-विशेष निर्देश सुसंगत रहें और हर रिपॉज़िटरी में काम एक-सा हो।"
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

# Claude Code के नियम: कृत्रिम बुद्धिमत्ता के लिए `CLAUDE.md` के वैश्विक निर्देश

Claude Code मेरे लिए सच में तब बेहतर हुआ, जब मैंने हर नई बातचीत में खुद को फिर से समझाना बंद कर दिया। मैं लगभग दो साल से कृत्रिम बुद्धिमत्ता की मदद से कोड लिख रहा हूँ, और पिछले करीब छह महीनों से Claude Code इस्तेमाल कर रहा हूँ। इस दौरान सबसे उपयोगी सुधार हैरान कर देने वाला आसान निकला: अपने बुनियादी नियम `~/.claude/CLAUDE.md` में रखिए और एजेंट को वहीं से शुरू करने दीजिए।

इससे पहले मैं एक ही बात पर बार-बार संदेश खर्च करता था। प्रकारों को सख्ती से परिभाषित करो। वे वैकल्पिक रास्ते मत जोड़ो जो मैंने नहीं कहे। बदलाव छोटे रखो। केवल उत्साह में आकर आधी फ़ाइल दोबारा मत लिखो। Claude अक्सर यह मान भी लेता था। फिर भी हर बार वही कीमत चुकानी पड़ती थी।

अब किसी रिपॉज़िटरी की चर्चा शुरू होने से पहले ही आधार तय रहता है।

## मैं Claude Code के वैश्विक निर्देश कहाँ रखता हूँ

Anthropic के [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code/overview) इसे कई परतों में बाँटते हैं। `~/.claude/CLAUDE.md` उपयोगकर्ता-स्तर की फ़ाइल है। `./CLAUDE.md` या `./.claude/CLAUDE.md` परियोजना की साझा परत है। `CLAUDE.local.md` उन निजी परियोजना-टिप्पणियों के लिए है जिन्हें git से बाहर रहना चाहिए।

यह लगभग वैसा ही है जैसा मैं चाहता हूँ:

1. मेरी स्थायी कार्य-पसंद के लिए `~/.claude/CLAUDE.md`
2. परियोजना-विशेष स्थापत्य और कमांड के लिए परियोजना की `CLAUDE.md`
3. ऐसी निजी परियोजना-टिप्पणियों के लिए `CLAUDE.local.md` जिन्हें git में नहीं जाना चाहिए

मैं हर रिपॉज़िटरी में वही निजी नियम फिर से चिपकाना नहीं चाहता। अगर "चुपचाप वैकल्पिक रास्ते मत जोड़ो" मेरी स्थायी पसंद है, तो वह वैश्विक फ़ाइल में होना चाहिए। अगर "परीक्षण चलाने से पहले यह अजीब-सी internal bootstrap कमांड चलाओ" किसी खास परियोजना की बात है, तो वह परियोजना-फ़ाइल में होना चाहिए।

यह वही रूप है जिसे मैं अभी Claude Code में इस्तेमाल कर रहा हूँ:

![कृत्रिम बुद्धिमत्ता के लिए स्थायी कोडिंग नियम रखने वाली Claude Code की वैश्विक `CLAUDE.md` निर्देश फ़ाइल](/articles/claude-code-global-rules-terminal.jpg)

## वे Claude Code नियम जिनका मैं सच में इस्तेमाल करता हूँ

यह अंश जानबूझकर साधारण है। अच्छे नियम अक्सर ऐसे ही होते हैं। मैं हर संभावित किनारे की स्थिति को पहले से लिखकर बंद नहीं करना चाहता। मैं बस इतना चाहता हूँ कि Claude Code वही अनुमानित गलतियाँ बार-बार करना छोड़ दे।

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

यह सूची रोज़मर्रा के ज़्यादातर काम के लिए काफ़ी है।

इसके बिना Claude बहुत पहचाने हुए ढंग से भटकता है। वह "कहीं ज़रूरत पड़ जाए" सोचकर अनावश्यक वैकल्पिक व्यवहार जोड़ देता है। जब सख्त प्रकार-परिभाषा उसे असुविधाजनक लगती है, तो प्रकार ढीले कर देता है। सरल फ़ंक्शन के ऊपर अतिरिक्त परतें चढ़ा देता है। और सटीक समस्या हल करने के बजाय ज़रूरत से ज़्यादा मददगार बनने की कोशिश करता है।

मैं एक बार दस मिनट लगाकर अच्छी वैश्विक फ़ाइल लिखना ज़्यादा पसंद करूँगा, बजाय इसके कि हर नए सत्र में यही पैटर्न फिर से ठीक करता रहूँ।

## पहले वैश्विक `CLAUDE.md`, फिर परियोजना की `CLAUDE.md`

मैं ऐसा एक विशाल `CLAUDE.md` नहीं चाहता जिसमें सब कुछ ठूँस दिया गया हो।

मेरी वैश्विक फ़ाइल को ऐसे सवालों का जवाब देना चाहिए:

- प्रकारों को कितनी सख्ती से परिभाषित करना है?
- त्रुटियों को कैसे संभालना है?
- मुझे छोटे, सीमित बदलाव चाहिए या बड़े पुनर्गठन?
- मैं किस तरह के प्रलेखन की अपेक्षा करता हूँ?

मेरी परियोजना-फ़ाइल को अलग सवालों का जवाब देना चाहिए:

- परियोजना कैसे चलाई जाती है?
- कौन-सी कमांड सुरक्षित और अपेक्षित हैं?
- स्थापत्य की महत्त्वपूर्ण सीमाएँ क्या हैं?
- परीक्षण कहाँ हैं?
- कौन-सी परंपराएँ सिर्फ इसी रिपॉज़िटरी पर लागू होती हैं?

व्यवहार में:

- वैश्विक `CLAUDE.md` बताता है कि मैं कैसे काम करता हूँ
- परियोजना की `CLAUDE.md` बताती है कि यह रिपॉज़िटरी कैसे काम करती है

जब ये दोनों चीज़ें एक ही फ़ाइल में घुलमिल जाती हैं, तो वह खिचड़ी बन जाती है। उसका आधा हिस्सा बहुत सामान्य होता है, आधा बहुत स्थानीय, और Claude को हर काम में यह सब साथ लेकर चलना पड़ता है।

Anthropic भी सलाह देता है कि इन फ़ाइलों को संक्षिप्त रखा जाए। यह ठीक बात है। लंबी निर्देश-फ़ाइलें अक्सर ऐसी लगती हैं मानो किसी ने पूरी इंजीनियरिंग पुस्तिका एक ही निर्देश-पाठ (`prompt`) में ठूँस दी हो। उसका अंजाम आम तौर पर अच्छा नहीं होता।

## लंबे सत्रों के बीच क्या बिगड़ता है

नियम मदद करते हैं। लेकिन वे किसी उलझे हुए सत्र को हमेशा नहीं बचा सकते।

अगर मैं बीस संदेश तक किसी एक उपतंत्र पर बात करूँ और फिर अचानक बिल्कुल अलग समस्या पर पहुँच जाऊँ, तो Claude पहले वाले मानसिक ढाँचे में अटका रह सकता है। यह सामान्य है। मैं लंबी बातचीतों को कोई पवित्र चीज़ नहीं मानता।

इसलिए व्यवहार में मैं यह करता हूँ:

- जब काम खोजबीन से अमल में बदलता है, तो नया सत्र शुरू करता हूँ
- जब मैं एक उपतंत्र से बिल्कुल अलग उपतंत्र पर जाता हूँ, तो नया सत्र शुरू करता हूँ
- परियोजना-निर्देश इतने संक्षिप्त रखता हूँ कि हर चरण पर अनावश्यक संदर्भ-भार न उठाना पड़े

इसी वजह से मुझे योजनाएँ और नोट्स लिखने के लिए markdown फ़ाइलें पसंद हैं। अगर काम बड़ा हो, तो मैं उसकी स्थिति साफ-साफ लिखकर सुरक्षित रखना पसंद करूँगा, बजाय इसके कि एक लंबी बातचीत अपने-आप साफ बनी रहे।

## Claude Code के नियम लागू करने का मेरा व्यावहारिक क्रम

अगर मैं आज इसे बिल्कुल शुरू से सेट कर रहा होता, तो यही क्रम अपनाता।

### 1. `~/.claude/CLAUDE.md` बनाइए

शुरुआत उन बातों से कीजिए जिन पर आप समझौता नहीं करना चाहते। न जीवन-उपदेश। न इंजीनियरिंग घोषणापत्र। सिर्फ वे नियम जो अलग-अलग रिपॉज़िटरी में बार-बार मायने रखते हैं।

मेरे लिए इसका मतलब है:

- प्रकारों को सख्ती से परिभाषित करना
- त्रुटियों को साफ़ और स्पष्ट ढंग से संभालना
- बदलाव सीमित रखना
- बिना कहे वैकल्पिक रास्ते न जोड़ना
- जहाँ प्रलेखन होना चाहिए, वहाँ फ़ंक्शन या क्लास के शुरुआती प्रलेखन-खंड (`docstrings`) रखना
- टर्मिनल में ऐसे तौर-तरीके रखना जिनमें हर कदम पर हाथ से दखल न देना पड़े

सिर्फ इतना ही, निर्देश-पाठ (`prompt`) में किए गए ज़्यादातर छोटे बदलावों से भी ज़्यादा असर डालता है।

### 2. परियोजना की `CLAUDE.md` जोड़िए

परियोजना-फ़ाइल का इस्तेमाल कमांड, स्थापत्य, नामकरण और सीमाओं के लिए कीजिए। Anthropic `/init` देता है, जिससे शुरुआती मसौदा तैयार करना आसान हो जाता है। फिर भी मैं उसे हाथ से संपादित करता हूँ, क्योंकि अपने-आप बने निर्देश शुरुआती मसौदे होते हैं, अंतिम रूप नहीं।

### 3. परियोजना के नियम छोटे रखिए

परियोजना-फ़ाइल को अपनी निजी फ़ाइल की दूसरी प्रति मत बनाइए। रिपॉज़िटरी-विशेष कमांड, स्थापत्य संबंधी टिप्पणियाँ और स्थानीय परंपराएँ वहीं रखिए। अपनी स्थायी पसंद वैश्विक फ़ाइल में रहने दीजिए।

## यह चतुर निर्देश-पाठ लिखने से ज़्यादा महत्त्वपूर्ण क्यों है

कोडिंग एजेंटों पर "यही सबसे सही सेटअप है" जैसी सामग्री बहुत जल्दी दिखावे में बदल जाती है।

जिस चीज़ ने मेरे रोज़मर्रा के काम को सचमुच बेहतर बनाया, वह इससे कहीं ज़्यादा सीधी थी:

- उपयोगकर्ता-स्तर का एक स्थिर `CLAUDE.md`
- परियोजना के लिए एक साफ `CLAUDE.md`

यह संयोजन Claude को ज़्यादा स्थिर बनाता है। बेवजह वैकल्पिक व्यवहार कम होते हैं, अनावश्यक चतुर अमूर्त परतें कम बनती हैं, और ऐसे सत्र भी कम होते हैं जहाँ दस मिनट बाद पता चले कि एजेंट और मैं थोड़ी अलग समस्याएँ हल कर रहे थे।

अगर आप कई कोडिंग एजेंट इस्तेमाल करते हैं, तो यही पैटर्न दूसरी जगहों पर भी दिखता है। उत्पाद बदल जाता है, सबक वही रहता है: आधार एक बार तय कीजिए और हर सुबह उसे फिर से तय करना बंद कीजिए।

अगर आप इसी विषय पर दूसरे लेख पढ़ना चाहते हैं, तो वे यहाँ हैं:

- AI के लिए Cursor IDE के नियम: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- AI के लिए Codex के नियम: [https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/)
