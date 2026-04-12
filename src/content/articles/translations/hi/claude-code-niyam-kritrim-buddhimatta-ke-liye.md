---
title: "Claude Code के नियम: AI के लिए मेरे CLAUDE.md के ग्लोबल निर्देश"
date: 2026-04-11
slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
description: "मैं Claude Code में अपने CLAUDE.md के ग्लोबल नियम कैसे रखता हूं: निजी पसंद और project वाले निर्देश अलग, ताकि हर repository में कोडिंग का तरीका एक जैसा रहे।"
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

# Claude Code के नियम: AI के लिए मेरे CLAUDE.md के ग्लोबल निर्देश

Claude Code मेरे लिए तब सचमुच बेहतर हुआ, जब मैंने हर नई बातचीत में खुद को फिर से समझाना बंद किया। मैं करीब दो साल से AI के साथ कोड लिख रहा हूं, और पिछले लगभग छह महीनों से Claude Code इस्तेमाल कर रहा हूं। इस दौरान सबसे उपयोगी सुधार हैरान करने वाला आसान निकला: अपने बुनियादी नियम `~/.claude/CLAUDE.md` में रखो और एजेंट को वहीं से शुरू करने दो।

इससे पहले मैं बार-बार एक जैसी बातों पर संदेश खर्च करता था। typing सख्त रखो। वे fallback मत जोड़ो जो मैंने नहीं मांगे। diff छोटा रखो। सिर्फ इसलिए आधी file दोबारा मत लिखो कि एजेंट कुछ ज़्यादा उत्साहित हो गया। Claude अक्सर मान भी लेता था। फिर भी हर बार वही कीमत चुकानी पड़ती थी।

अब repository बातचीत में आए, उससे पहले ही आधार तय रहता है।

## मैं Claude Code के ग्लोबल निर्देश कहां रखता हूं

Anthropic के [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code/overview) इस व्यवस्था को कुछ स्तरों में बांटते हैं। `~/.claude/CLAUDE.md` पूरे user के लिए file है। `./CLAUDE.md` या `./.claude/CLAUDE.md` project की साझा layer है। `CLAUDE.local.md` उन निजी project notes के लिए है जिन्हें git से बाहर रहना चाहिए।

यह लगभग वैसा ही है जैसा मैं चाहता हूं:

1. मेरी स्थायी coding पसंद के लिए `~/.claude/CLAUDE.md`
2. repository-specific architecture और commands के लिए project `CLAUDE.md`
3. ऐसी निजी project notes के लिए `CLAUDE.local.md` जिन्हें git में नहीं जाना चाहिए

मैं हर repository में वही निजी नियम दोहराकर paste नहीं करना चाहता। अगर "silent fallback नहीं" मेरी स्थायी पसंद है, तो उसे global file में होना चाहिए। अगर "tests चलाने से पहले यह अजीब internal bootstrap command चलाओ" किसी खास repo की बात है, तो वह project file में होना चाहिए।

यह वही रूप है जिसे मैं अभी Claude Code में इस्तेमाल कर रहा हूं:

![AI कोडिंग के स्थायी नियमों के लिए CLAUDE.md में Claude Code के ग्लोबल निर्देश](/articles/claude-code-global-rules-terminal.jpg)

## वे Claude Code नियम जिन्हें मैं सच में इस्तेमाल करता हूं

यह हिस्सा जानबूझकर साधारण है। अच्छे नियम अक्सर ऐसे ही होते हैं। मैं हर संभावित स्थिति को पहले से लिखकर बंद नहीं करना चाहता। मैं सिर्फ इतना चाहता हूं कि Claude Code वही अनुमानित गलतियां बार-बार करना बंद करे।

```markdown
# वैश्विक नियम

## कोड शैली

- टिप्पणियां केवल English में हों
- OOP की तुलना में functional programming को प्राथमिकता दें
- OOP classes का उपयोग केवल connectors और external systems की interfaces के लिए करें
- pure functions लिखें - केवल return values बदलें, input parameters या global state नहीं
- DRY, KISS, और YAGNI सिद्धांतों का पालन करें
- हर जगह strict typing का उपयोग करें - function returns, variables, collections
- नया code लिखने से पहले जांचें कि वही logic पहले से मौजूद तो नहीं है
- untyped variables और generic types से बचें
- default parameter values कभी न दें - हर parameter स्पष्ट रखें
- complex data structures के लिए सही type definitions बनाएं
- सभी imports file के ऊपर हों
- सरल, एक ही उद्देश्य वाली functions लिखें - multi-mode behavior नहीं, ऐसे flag parameters नहीं जो logic बदल दें

## त्रुटि प्रबंधन

- errors को हमेशा स्पष्ट रूप से raise करें, उन्हें चुपचाप ignore न करें
- ऐसे specific error types इस्तेमाल करें जो साफ बताएं कि क्या गलत हुआ
- ऐसे catch-all exception handlers से बचें जो मूल कारण छिपा दें
- error messages साफ और कार्रवाई योग्य होने चाहिए
- fallbacks तभी दें जब मैं उन्हें स्पष्ट रूप से मांगूं
- लक्षण नहीं, मूल कारण ठीक करें
- external API या service calls में warnings के साथ retries करें, फिर आखिरी error raise करें
- error messages में debugging के लिए पर्याप्त context होना चाहिए: request params, response body, status codes
- logging में structured fields का उपयोग करें, message strings में dynamic values जोड़कर नहीं

## भाषा संबंधी नियम

- loose dictionaries की तुलना में structured data models को प्राथमिकता दें
- `Any`, `unknown`, या `List[Dict[str, Any]]` जैसे generic types से बचें
- `pyproject.toml` और `package.json` जैसी modern package management files का उपयोग करें
- जहां उपलब्ध हों, भाषा की strict type features का उपयोग करें

## लाइब्रेरी और dependencies

- dependencies को globally नहीं, project environments में install करें
- dependencies को एक-बार वाले manual installs की तरह नहीं, project config files में जोड़ें
- अगर कोई dependency local रूप से install है, तो अंदाजा लगाने के बजाय जरूरत पड़ने पर उसका source code पढ़ें
- dependencies जोड़ते समय project configuration files अपडेट करें

## परीक्षण

- repository की मौजूदा testing strategy और existing test suite का सम्मान करें
- default रूप से नए unit tests न जोड़ें
- जब tests की जरूरत हो, तो integration, end-to-end, या smoke tests को प्राथमिकता दें जो वास्तविक behavior validate करें
- unit tests केवल कभी-कभार उपयोग करें, मुख्यतः stable datasets या pure data transformations के लिए
- केवल coverage numbers बढ़ाने के लिए unit tests कभी न जोड़ें
- जहां वास्तविक calls व्यावहारिक हों, वहां mocks से बचें
- नाजुक mock-based coverage बनाए रखने से बेहतर है कि वास्तविक API या service calls पर थोड़ा खर्च किया जाए
- मांगे गए बदलाव के लिए जितना जरूरी हो, उतना ही test coverage जोड़ें

## टर्मिनल उपयोग

- interactive commands की तुलना में flags वाले non-interactive commands को प्राथमिकता दें
- हमेशा non-interactive git diff इस्तेमाल करें: `git --no-pager diff` या `git diff | cat`
- code और files खोजने के लिए `rg` को प्राथमिकता दें

## Claude Code कार्यप्रवाह

- edit करने से पहले existing code और relevant `CLAUDE.md` files पढ़ें
- बदलाव छोटे रखें और मौजूदा request से जुड़े रखें
- repository की existing style से मेल रखें, भले ही वह मेरी personal preference से अलग हो
- unrelated changes को revert न करें
- अगर संदेह हो, तो patterns गढ़ने के बजाय codebase देखें
- अगर project instructions में test या lint commands शामिल हों, तो code बदलने पर समाप्त करने से पहले उन्हें चलाएं

## प्रलेखन

- code ही मुख्य documentation है - clear naming, types, और docstrings का उपयोग करें
- documentation को उन्हीं functions या classes के docstrings में रखें जिनका वह वर्णन करती है, अलग files में नहीं
- अलग docs files केवल तब बनाएं जब किसी concept को code में साफ-साफ व्यक्त न किया जा सके
- documentation को कई files में दोहराएं नहीं
- जानकारी को मौजूदा state के रूप में रखें, modifications के changelog की तरह नहीं
```

यह हिस्सा मेरी रोजमर्रा की लगभग सारी जरूरी चीजें समेट लेता है।

इसके बिना Claude बहुत परिचित ढंग से भटकता है। वह "just in case" fallback behavior जोड़ देता है। types सख्त रखने में असुविधा लगे तो उन्हें ढीला कर देता है। सीधी-सी functions के ऊपर अतिरिक्त परतें चढ़ा देता है। ठीक समस्या पकड़ने के बजाय जरूरत से ज़्यादा accommodating बनने की कोशिश करता है।

मैं एक बार दस मिनट देकर अच्छी global file लिखना ज़्यादा पसंद करूंगा, बजाय इसके कि हर नए session में यही पैटर्न फिर से ठीक करता रहूं।

## पहले global CLAUDE.md, फिर project CLAUDE.md

मैं ऐसा एक विशाल `CLAUDE.md` नहीं चाहता जिसमें सब कुछ ठूंस दिया गया हो।

मेरी global file को ऐसे सवालों का जवाब देना चाहिए:

- मैं typing को कितना सख्त रखना चाहता हूं?
- मैं errors को कैसे handle करना चाहता हूं?
- मुझे minimal diff चाहिए या बड़े refactor?
- मैं किस तरह की documentation की अपेक्षा करता हूं?

मेरी project file को अलग सवालों का जवाब देना चाहिए:

- project कैसे चलती है?
- कौन से commands सुरक्षित और अपेक्षित हैं?
- architecture की महत्वपूर्ण boundaries क्या हैं?
- tests कहां रहते हैं?
- कौन सी conventions सिर्फ इसी repo पर लागू होती हैं?

व्यवहार में:

- global `CLAUDE.md` बताता है कि मैं कैसे काम करता हूं
- project `CLAUDE.md` बताता है कि यह repo कैसे काम करता है

जब ये दोनों चीजें एक ही file में घुलमिल जाती हैं, तो नतीजा कीचड़ जैसा हो जाता है। आधा हिस्सा बहुत generic होता है, आधा बहुत local, और Claude को हर task में यह सब साथ लेकर चलना पड़ता है।

Anthropic भी सलाह देता है कि इन files को संक्षिप्त रखा जाए। यह बात सही है। लंबी instruction files अक्सर ऐसी लगती हैं जैसे किसी ने पूरा engineering handbook prompt में ठूंसने की कोशिश की हो। उसका नतीजा आम तौर पर अच्छा नहीं होता।

## लंबे session के बीच में क्या बिगड़ता है

Rules मदद करते हैं। लेकिन वे हमेशा किसी उलझे हुए session को बचा नहीं सकते।

अगर मैं बीस संदेश तक किसी एक subsystem पर बात करूं और फिर अचानक बिल्कुल अलग problem पर पहुंच जाऊं, तो Claude पहले वाले frame में अटका रह सकता है। यह सामान्य है। मैं लंबी chats को कोई पवित्र चीज़ नहीं मानता।

इसलिए व्यवहार में मैं यह करता हूं:

- जब task exploration से implementation में बदलती है, तो नया session शुरू करता हूं
- जब मैं एक subsystem से बिल्कुल अलग subsystem पर जाता हूं, तो नया session शुरू करता हूं
- project instructions इतनी संक्षिप्त रखता हूं कि हर turn पर context tax न देना पड़े

इसी वजह से मुझे plans और notes के लिए markdown files पसंद हैं। अगर task बड़ी हो, तो मैं उसकी state को साफ-साफ लिखकर बचाना पसंद करूंगा, बजाय इसके कि एक लंबी thread अपने-आप साफ बनी रहे।

## Claude Code नियम लागू करने का मेरा व्यावहारिक तरीका

अगर मैं इसे आज शून्य से सेट कर रहा होता, तो मैं यही क्रम अपनाता।

### 1. `~/.claude/CLAUDE.md` बनाइए

शुरुआत उन बातों से कीजिए जिन पर आप समझौता नहीं करना चाहते। न जीवन-उपदेश, न इंजीनियरिंग घोषणापत्र। सिर्फ वे नियम जो अलग-अलग repositories में बार-बार मायने रखते हैं।

मेरे लिए इसका मतलब है:

- strict typing
- explicit error handling
- minimal edits
- silent fallback नहीं
- जहां documentation होनी चाहिए वहां docstrings
- non-interactive terminal habits

सिर्फ इतनी बात ही नतीजों को prompt में किए गए ज्यादातर छोटे बदलावों से ज्यादा बदल देती है।

### 2. एक project `CLAUDE.md` जोड़िए

Repo file का इस्तेमाल commands, architecture, naming और boundaries के लिए कीजिए। Anthropic `/init` देता है, जिससे शुरुआती draft बनाना आसान हो जाता है। फिर भी मैं उसे हाथ से edit करता हूं, क्योंकि अपने-आप बने निर्देश एक शुरुआती मसौदा होते हैं, अंतिम artifact नहीं।

### 3. Project rules को छोटा रखिए

Project file को अपनी personal file की दूसरी copy मत बनाइए। Repo-specific commands, architecture notes और local conventions वहीं रखिए। अपनी टिकाऊ preferences global file में रहने दीजिए।

## यह clever prompting से ज्यादा महत्वपूर्ण क्यों है

Coding agents की "ultimate setup" वाली सामग्री बहुत जल्दी दिखावे में बदल जाती है।

जिस चीज़ ने मेरे रोजमर्रा के काम को सचमुच बेहतर बनाया, वह इससे कहीं ज्यादा सीधी थी:

- पूरे user के लिए एक स्थिर `CLAUDE.md`
- एक साफ project `CLAUDE.md`

यह संयोजन Claude को ज्यादा स्थिर बनाता है। बेवजह fallback कम होते हैं, अनावश्यक चतुर abstractions कम बनती हैं, और ऐसे sessions भी कम होते हैं जहां दस मिनट बाद पता चले कि एजेंट और मैं थोड़ी अलग समस्याएं हल कर रहे थे।

अगर आप कई coding agents इस्तेमाल करते हैं, तो यही pattern दूसरी जगहों पर भी दिखता है। product बदल जाता है, सबक वही रहता है: आधार एक बार तय कीजिए और हर सुबह उसे फिर से तय करना बंद कीजिए।

अगर आप इससे जुड़ी दूसरी articles पढ़ना चाहते हैं, तो वे यहां हैं:

- AI के लिए Cursor IDE के नियम: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- AI के लिए Codex के नियम: [https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/codex-niyam-kritrim-buddhimatta-ke-liye/)
