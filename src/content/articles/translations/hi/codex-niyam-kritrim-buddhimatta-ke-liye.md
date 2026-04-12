---
title: "Codex के नियम: Global Instructions, AGENTS.md और Mac ऐप"
date: 2026-04-11
slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
description: "मैं Codex में custom instructions, AGENTS.md और Mac ऐप का इस्तेमाल कैसे करता हूं, ताकि अलग-अलग repositories में एक जैसी coding शैली, error handling और minimal diffs बने रहें।"
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

# Codex के नियम: Global Instructions, AGENTS.md और Mac ऐप

मैंने Codex का गंभीर इस्तेमाल अभी लगभग एक महीने पहले ही शुरू किया है, खासकर तब से जब GPT-5.4 ने इसे मेरे लिए सचमुच उपयोगी बना दिया। इसलिए यह लेख "पांच साल के पक्के अनुभव" वाला दावा नहीं करता। मेरी बात बस इतनी है: Codex मेरे लिए तब अच्छा हुआ, जब मैंने उसे किसी चमकदार चैट-खिड़की की तरह बरतना बंद किया और शुरुआत से ही उसे स्थिर निर्देश देने लगा।

OpenAI के पास Codex CLI भी है और Mac ऐप भी। मेरे लिए दोनों का आधार एक ही है: स्थायी निर्देश, `AGENTS.md`, repository के नियम, और ऐसा agent जो मेरे काम करने की आदतों को पहले से जानता हो। मैं Mac ऐप को इसलिए प्राथमिकता देता हूं, क्योंकि उसमें काम करना एक और terminal window में अटके रहने से कहीं ज्यादा सहज लगता है।

Codex CLI यह हिस्सा पहले से अच्छी तरह संभालता है। Mac ऐप उसी कामकाज को बस ज्यादा साफ और आरामदेह रूप देता है। मुझे हर नए task में बार-बार वही बातें नहीं दोहरानीं: strict typing, minimal diffs, explicit errors, बिना वजह के fallbacks नहीं, और इधर-उधर फैली व्याख्याओं की जगह code में docstrings। मैं चाहता हूं कि यह आधार शुरुआत से मौजूद रहे।

व्यवहार में यह सब `Settings -> Personalization -> Custom instructions` में रहता है।

अंदर की परत में, ऐप के ये निर्देश personal `AGENTS.md` में जाकर दर्ज होते हैं। यह मेरे लिए सही व्यवस्था है। मुझे बेहतर ऐप अनुभव भी मिलता है और CLI जैसी file-based स्पष्टता भी बनी रहती है।

## Codex Custom Instructions वास्तव में कहाँ रहते हैं

अगर इस लेख से आपको सिर्फ एक स्क्रीन याद रखनी हो, तो वह यही है।

ऐप में global instructions `Settings -> Personalization -> Custom instructions` के भीतर रहते हैं। मैं सबसे पहले यही स्क्रीन दिखाऊंगा।

OpenAI की [Codex docs](https://developers.openai.com/codex/) कहती हैं कि Codex आपके Codex home directory में रखी global instruction file पढ़ सकता है, जो आम तौर पर `~/.codex/AGENTS.md` होती है। [Codex settings docs](https://developers.openai.com/codex/config/) यह भी बताती हैं कि custom instructions में किया गया बदलाव personal `AGENTS.md` को update करता है।

मुझे यही व्यवस्था चाहिए। मैं ऐप को अपना मुख्य इंटरफेस बना सकता हूं, और फिर भी पीछे मौजूद असली file की साफ-सुथरी संरचना नहीं खोता।

मैं इसे इस तरह समझता हूं:

1. अलग-अलग projects में लागू मेरी default preferences के लिए personal `~/.codex/AGENTS.md`
2. team और repository के निर्देशों के लिए repository `AGENTS.md`
3. इन्हीं नियमों के इर्द-गिर्द रखी गई Codex app settings और repository guidance

यह रही वह स्क्रीन:

![Codex ऐप के custom instructions और global coding rules वाला personal AGENTS.md](/articles/codex-personalization-custom-instructions.jpg)

## वे नियम जिन्हें मैं चाहता हूं कि Codex हर जगह पहले से लेकर चले

यह वह आधार है जिसे मैं चाहता हूं कि Codex किसी भी repository में project-specific instructions देखने से पहले साथ लेकर आए।

```markdown
# निजी AGENTS.md

## कोड शैली

- Comments सिर्फ English में हों
- OOP की तुलना में functional programming को प्राथमिकता दें
- OOP classes का उपयोग केवल connectors और external systems के interfaces के लिए करें
- pure functions लिखें - केवल return values बदलें, input parameters या global state नहीं
- DRY, KISS, और YAGNI सिद्धांतों का पालन करें
- हर जगह strict typing रखें - function returns, variables, collections
- नया code लिखने से पहले जांचें कि वही logic पहले से मौजूद तो नहीं है
- untyped variables और generic types से बचें
- default parameter values कभी न दें - हर parameter को स्पष्ट रखें
- जटिल data structures के लिए सही type definitions बनाएं
- सभी imports file के शीर्ष पर हों
- सरल, एक ही काम करने वाले functions लिखें - multi-mode behavior नहीं, और ऐसे flag parameters नहीं जो logic बदल दें

## त्रुटि प्रबंधन

- errors को हमेशा स्पष्ट रूप से raise करें, उन्हें चुपचाप अनदेखा न करें
- ऐसे specific error types इस्तेमाल करें जो साफ बताएं कि क्या गलत हुआ
- ऐसे catch-all exception handlers से बचें जो root cause छिपा दें
- error messages साफ और काम के होने चाहिए
- fallbacks तभी हों जब मैं उन्हें स्पष्ट रूप से मांगूं
- लक्षण नहीं, root cause ठीक करें
- external API या service calls में retries और warnings का उपयोग करें, फिर आखिरी error raise करें
- error messages में debugging के लिए पर्याप्त context हो: request params, response body, status codes
- logging में dynamic values को message strings में पिरोने के बजाय structured fields का उपयोग करें

## टूलिंग और dependencies

- `pyproject.toml` और `package.json` जैसी आधुनिक package management files को प्राथमिकता दें
- dependencies को global रूप से नहीं, project environments में install करें
- dependencies को project config files में जोड़ें, अलग से एक-बार वाले installs के रूप में नहीं
- जरूरत पड़ने पर installed dependencies के source code को पढ़ें, behavior का अनुमान न लगाएं

## परीक्षण

- repository की मौजूदा testing strategy और existing test suite का सम्मान करें
- default रूप से नए unit tests न जोड़ें
- जब tests की जरूरत हो, तो integration, end-to-end, या smoke tests को प्राथमिकता दें जो वास्तविक behavior को परखें
- unit tests का उपयोग कम ही करें, मुख्यतः stable datasets या pure data transformations के लिए
- केवल coverage numbers बढ़ाने के लिए unit tests कभी न जोड़ें
- जहां real calls व्यावहारिक हों, वहां mocks से बचें
- अक्सर mock-based coverage बनाए रखने की तुलना में real API या service calls पर थोड़ा खर्च करना बेहतर होता है
- मांगे गए बदलाव के लिए जितनी जरूरत हो, उतना ही न्यूनतम test coverage जोड़ें

## Codex कार्यप्रवाह

- edit करने से पहले repository को समझें
- अनुमान लगाने से पहले सक्रिय `AGENTS.md` files पढ़ें
- changes को न्यूनतम और मौजूदा request से सीधे जुड़ा हुआ रखें
- repository की मौजूदा शैली से मेल रखें, भले ही वह मेरी personal preference से अलग हो
- unrelated changes को revert न करें
- code search के लिए `rg` को प्राथमिकता दें
- flags वाले non-interactive commands का उपयोग करें
- हमेशा non-interactive git diff का उपयोग करें: `git --no-pager diff` या `git diff | cat`
- code changes के बाद वही relevant tests या validation commands चलाएं जिन्हें project पहले से परिभाषित करता है

## दस्तावेज़ीकरण

- code ही मुख्य documentation है - साफ naming, types, और docstrings का उपयोग करें
- documentation को उन्हीं functions या classes की docstrings में रखें जिनका वह वर्णन करती है, अलग files में नहीं
- अलग docs files तभी बनाएं जब कोई concept code में साफ व्यक्त न हो सकता हो
- documentation को अलग-अलग files में दोहराएं नहीं
- जानकारी को वर्तमान स्थिति के रूप में रखें, बदलावों की changelog की तरह नहीं
```

यह file जानबूझकर सादी है, और यही इसकी खूबी है।

यह बार-बार की रुकावटें हटाने के लिए मौजूद है:

- जब मुझे छोटा सा patch चाहिए हो, तब Codex का बेवजह बड़े refactors गढ़ देना
- Codex का अपनी अनिश्चितता को मुलायम भाषा के पीछे छिपा देना
- "सुरक्षा" के नाम पर fallback behavior जोड़ देना
- निर्देश बहुत संकरे होने पर repository conventions को नजरअंदाज कर देना

जब ये rules पहले से लोड होते हैं, तो पूरा सेशन कहीं ज्यादा शांत और भरोसेमंद हो जाता है।

## मैं Global Rules को Repository Rules से ऊपर क्यों रखता हूं

Codex में `AGENTS.md` की परतों का अच्छा support है। OpenAI global file `~/.codex/AGENTS.md` का ज़िक्र करता है, और फिर working directory जितनी specific होती जाती है, उतनी repo और nested directory files लागू हो जाती हैं।

यह layering उपयोगी है, लेकिन पहली layer मेरी होनी चाहिए।

मेरी personal file को इन सवालों का जवाब देना चाहिए:

- मैं coding style को कितना सख्त रखना चाहता हूं
- मेरे लिए स्वीकार्य error handling क्या है
- agent changes करते समय कितना आक्रामक हो
- सामान्य coding work में "done" का मतलब क्या है

Repository file को इन सवालों का जवाब देना चाहिए:

- यह codebase किस तरह व्यवस्थित है
- कौन से commands चलाने हैं
- कौन से हिस्से नाजुक हैं
- team PRs, commits या docs को कैसे handle करना चाहती है

संक्षेप में:

- personal `AGENTS.md` बताता है कि मैं कैसे काम करता हूं
- repository `AGENTS.md` बताता है कि यह codebase कैसे चलती है

अगर मैं दोनों को मिला दूं, तो duplication भी होगा, drift भी आएगा, और आखिर में ऐसी file बनेगी जिसे कोई संभालना नहीं चाहेगा।

यही वजहों में से एक है कि Codex मेरे लिए उम्मीद से बेहतर निकला। इसकी निर्देश-परतें साफ दिखाई देती हैं। यह किसी छिपे हुए prompt-जुगाड़ जैसा नहीं लगता, बल्कि एक वास्तविक system जैसा लगता है।

## Mac ऐप ही मेरा मुख्य इंटरफेस है, और यह मायने रखता है

इस समय Codex Mac ऐप का हिस्सा मुझे सबसे ज्यादा पसंद आ रहा है।

यह इसलिए नहीं कि CLI कमजोर है। CLI पहले से बहुत अच्छा है। ऐप बस रोजमर्रा के इस्तेमाल के लिए ज्यादा सुखद है। नीचे वही Codex है, ऊपर कहीं ज्यादा बेहतर इंटरफेस।

इसीलिए मैं इस लेख को CLI के इर्द-गिर्द नहीं बनाना चाहता, भले ही CLI महत्वपूर्ण हो। उसी system को इस्तेमाल करने का मेरे लिए बेहतर तरीका ऐप है।

ऐप को सिर्फ सजावटी चीज नहीं बल्कि ठोस tool बनाने वाली बात यह है कि इसकी instructions अब भी `AGENTS.md` पर आधारित हैं। ऐप docs कहती हैं कि custom instructions edit करने से personal instructions `AGENTS.md` में update होती हैं, और मुझे यही रिश्ता चाहिए:

- सुविधा के लिए ऐप settings
- टिकाऊपन के लिए file-based instructions

इससे बाद में CLI usage को समझना भी आसान हो जाता है, क्योंकि वही base instructions आगे तक साथ चलती हैं।

## Project AGENTS.md अब भी जरूरी है, बस कहानी का केंद्र वही नहीं है

मैं नहीं चाहता कि यह लेख `AGENTS.md` nesting tutorial बन जाए, जबकि Codex इसे अच्छी तरह support करता है।

मेरा तरीका ज्यादा सरल है:

- personal `AGENTS.md` Codex को मेरा बुनियादी व्यवहार देता है
- repository `AGENTS.md` Codex को repository से जुड़ी अपेक्षाएं देता है
- nested files सिर्फ उन दुर्लभ जगहों के लिए हैं जहां उनकी सच में जरूरत हो

इससे पूरी व्यवस्था समझने में आसान रहती है।

अगर मैं कोई अनजान repository खोलूं और Codex अजीब बर्ताव करे, तो मैं उसे जल्दी समझना चाहता हूं। आम तौर पर वजह इनमें से एक होनी चाहिए:

1. मेरे global rules पर्याप्त स्पष्ट नहीं हैं
2. repo instructions गायब हैं
3. task खुद बहुत व्यापक है

ना कि यह सोचना पड़े कि सात छिपी instruction layers में इस बार किसने बाजी मार ली।

## मेरे Codex setup में CLI की जगह

Mac ऐप मेरा मुख्य इंटरफेस है। CLI कोई गौण fallback नहीं है। वह वही Codex system है, बस अलग अंदाज़ में।

CLI कुछ वजहों से अब भी महत्वपूर्ण है:

- यह file-based configuration को बहुत साफ बना देता है
- ठीक-ठीक behavior को जांचना या script में बांधना इसमें आसान होता है

मैं CLI के लिए अलग नजरिया नहीं चाहता। मैं वही personal `AGENTS.md`, वही repo guidance, और दोनों में वही guardrails चाहता हूं।

यही निरंतरता उस बड़ी वजह का हिस्सा है जिसकी वजह से यह product मुझे एकजुट लगता है।

## अभी मेरी व्यावहारिक Codex setup

अगर मैं आज Mac पर इसे बिल्कुल शुरुआत से set up करूं, तो क्रम यही रखूंगा।

### 1. सबसे पहले ऐप में Personal Instructions लिखें

`Cmd+,` से Codex ऐप settings खोलें, `Personalization` में जाएं, और custom instructions पहले वहीं लिखें। मैं अब भी `~/.codex/AGENTS.md` के हिसाब से सोचता हूं, लेकिन setup और समीक्षा के लिए ऐप ही मेरी मुख्य जगह है।

### 2. Personal File को छोटा और साफ राय वाला रखें

Project architecture यहां नहीं होनी चाहिए। यहां टिकाऊ coding rules होनी चाहिए:

- strict typing
- explicit errors
- silent fallbacks नहीं
- minimal diffs
- बिखरे हुए docs की जगह docstrings
- साफ terminal आदतें

### 3. Repository AGENTS.md सिर्फ Repo Truth के लिए जोड़ें

Commands, architecture, constraints, testing expectations, naming, dangerous areas। यही repository वाली परत है।

## अभी Codex मुझे आशाजनक क्यों लगता है

मैं अभी भी Codex के साथ शुरुआती चरण में हूं, इसलिए मैं इसे बढ़ा-चढ़ाकर पेश नहीं करूंगा।

लेकिन इसका संयोजन अभी से मजबूत लगता है:

- file पर आधारित निर्देशों की एक असली परत
- ऐप और CLI, जो एक-दूसरे से जुड़े लगते हैं, टकराते हुए नहीं

मेरे लिए इसे इस्तेमाल करते रहने के लिए इतना काफी है।

अब तक मेरे लिए सबसे अच्छा काम करने वाली setup सबसे कम चमकदार भी है: ठोस स्थायी निर्देश लिखो, repo guidance को अलग रखो, और agent को ऐसे आधार से शुरू होने दो जो पहले से तुम्हारे काम करने के तरीके से मेल खाता हो।

पैटर्न Cursor जैसा ही है। Claude Code जैसा ही है। Product अलग है, सीख वही है: सेशन तब बेहतर होता है, जब agent यह अनुमान लगाना बंद कर दे कि तुम कौन हो।

अगर आप इससे जुड़े दूसरे लेख पढ़ना चाहते हैं, तो वे यहां हैं:

- Cursor IDE Rules for AI: [https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/](https://kirill-markin.com/hi/gyan/cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye/)
- Claude Code Rules for AI: [https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/](https://kirill-markin.com/hi/gyan/claude-code-niyam-kritrim-buddhimatta-ke-liye/)
