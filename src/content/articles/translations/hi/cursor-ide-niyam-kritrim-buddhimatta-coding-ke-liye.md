---
keywords:
  [
    "Cursor IDE",
    "Cursor IDE नियम",
    "एआई कोडिंग",
    "एआई सहायक",
    "कोडिंग दिशा-निर्देश",
    "वैश्विक नियम",
    "रिपॉज़िटरी-स्तर नियम",
    "संदर्भ-संवेदी नियम",
    "Cursor IDE सेटिंग्स",
    "टोकन दक्षता",
  ]
title: "Cursor IDE में एआई के लिए नियम: विशेषज्ञ एआई सहायक हेतु दिशानिर्देश"
date: 2025-05-09
lastmod: 2026-04-14
description: "Cursor IDE में मेरे आजमाए हुए नियम, जो एआई कोडिंग को साफ शैली, सख्त त्रुटि-प्रबंधन और सुव्यवस्थित कार्यप्रवाह के साथ लगातार अधिक भरोसेमंद बनाते हैं।"
tags: ["productivity", "cursor-ide", "ai", "llm"]
publish: true
thumbnailUrl: "/articles/cursor-ide-rules-for-ai.webp"
language: "hi"
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
  - language: "ar"
    slug: "qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja"
---

# Cursor IDE में एआई के लिए नियम: विशेषज्ञ एआई सहायक हेतु दिशानिर्देश

Cursor IDE में नियमों की तीन परतें होती हैं:

1. Cursor IDE की सेटिंग्स में `Rules for AI` के अंतर्गत रखे गए नियम, जो हर परियोजना पर लागू होते हैं
2. `Rule Type` को `"Always"` पर रखकर बनाई गई `.cursor/index.mdc`, जो किसी खास रिपॉज़िटरी के साझा नियम संभालती है
3. `.cursor/rules/*.mdc` फ़ाइलें, जो तभी सक्रिय होती हैं जब एआई उनके विवरण से जुड़े काम पर लगा हो

यहां मैं अपने आधारभूत Cursor नियम साझा कर रहा हूं, यानी वे वैश्विक निर्देश जिन्हें मैं Cursor IDE में इस्तेमाल करता हूं। यही मेरे लगभग हर विकास-कार्य की नींव हैं। जब इन्हें रिपॉज़िटरी-स्तर के नियमों और संदर्भ-संवेदी नियमों के साथ जोड़ा जाता है, तो एक ऐसी व्यवस्था बनती है जो कोड की गुणवत्ता बनाए रखती है और मेरे काम करने के तरीके को लगातार एकसमान रखती है।

> **वीडियो में देखना पसंद है?** मैंने इस पूरी Cursor नियम-व्यवस्था पर एक विस्तार से समझाने वाला वीडियो बनाया है। [Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](https://www.youtube.com/watch?v=gw8otRr2zpw) देखें, जहां यह सब कदम-दर-कदम लागू करके दिखाया गया है।

[![Cursor IDE rules को सेट और इस्तेमाल करते हुए](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## बेहतर एआई कोडिंग के लिए Cursor के नियम कैसे सेट करें

Cursor में यह रास्ता अपनाएं: `Settings` -> `Cursor Settings` -> `Rules for AI`

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
- Write simple single-purpose functions — no multi-mode behavior, no flag parameters that switch logic. If the user needs multiple modes, they will ask explicitly

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- NO FALLBACKS: Code should either succeed or fail with a clear error. Fallbacks are only allowed if the user explicitly asks for them. Never add automatic fallbacks — they hide real problems
- Transparent debugging: When something fails, show exactly what went wrong and why
- Fix root causes, not symptoms - fallbacks hide real problems that need solving
- External API/service calls: use retries with warnings, raise the last error if all attempts fail
- Error messages must include enough context to debug (request params, response body, status codes) — no generic "something went wrong"
- Logging: no dynamic values interpolated into log message strings — pass them as structured data or extra fields. Exceptions can use f-strings for readability

## Language Specifics

- Prefer structured data models over loose dictionaries (Pydantic, interfaces)
- Avoid generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`
- Use modern package management (pyproject.toml, package.json)
- Leverage language-specific type features (discriminated unions, enums)

## Libraries and Dependencies

- Install in virtual environments, not globally
- Add to project configs, not one-off installs
- When a dependency is installed locally (node_modules, .venv, etc.), read its source code directly even if it's gitignored — this is the best way to understand how a library works
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

- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Prefer non-interactive commands with flags over interactive ones

## Code Changes

- Matching the existing code style is more important than "correct" or "ideal" style — new code must look like it was written by the same author
- Suggest only minimal changes related to current dialog
- Change as few lines as possible while solving the problem
- Focus only on what user is asking for - no extra improvements

## Documentation

- Code is the primary documentation — use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions/classes they describe, not in separate files
- Separate docs files (in `docs/`) only when a concept cannot be expressed in code — and only one file per topic
- Never duplicate documentation across files — reference other sources instead
- Store knowledge as current state, not as a changelog of modifications
```

![Cursor IDE की सेटिंग्स पैनल में global rules](/articles/cursor-ide-rules-global.webp)

## तीन-स्तरीय Cursor नियम-रणनीति से दक्षता कैसे बढ़ती है

Cursor IDE की एआई सुविधाओं के साथ काम करते हुए मैंने पाया है कि तीनों स्तरों पर नियमों को सोच-समझकर व्यवस्थित करना बहुत जरूरी है। सबसे अहम बात यह है: हर बातचीत में भाषा मॉडल को भेजे जाने वाले टोकन यथासंभव कम रखे जाएं। जितना कम अनावश्यक संदर्भ जाएगा, उतनी ज्यादा जगह बेहतर जवाब तैयार करने में लगेगी।

अगर आप Cursor में परियोजना-नियम कैसे काम करते हैं, यह विस्तार से समझना चाहते हैं, तो [Rules for AI पर Cursor का आधिकारिक दस्तावेज़](https://docs.cursor.com/context/rules) देख सकते हैं।

### Cursor नियम लागू करने का 3-चरणीय क्रम

1. **शुरुआत सिर्फ IDE-स्तर की सेटिंग्स से करें**
   मैं पहले Cursor IDE की वैश्विक सेटिंग्स में अपनी बुनियादी प्राथमिकताएं तय करता हूं। इससे मैं नियम लिखने के अलग-अलग तरीके आजमा सकता हूं, बिना रिपॉज़िटरी को बेवजह भारी किए। इस स्तर पर मैं सिर्फ वही नियम रखता हूं जो सचमुच हर परियोजना पर लागू होते हैं।

2. **परियोजना-विशेष नियमों को रिपॉज़िटरी स्तर पर ले जाएं**
   जब मुझे किसी खास कोडबेस में बार-बार दिखने वाले ढर्रे नजर आते हैं, या मैं साथियों के साथ एआई के लिए निर्देश साझा करना चाहता हूं, तो मैं उन नियमों को `Rule Type` `"Always"` के साथ `.cursor/index.mdc` में रख देता हूं। इससे साझा समझ बनती है और मेरी वैश्विक सेटिंग्स हल्की रहती हैं। (ध्यान रहे: पुरानी `.cursorrules` फ़ाइल अब भी काम करती है, लेकिन अब वही अनुशंसित तरीका नहीं है।)

3. **जब जरूरत हो, नियमों को संदर्भ-संवेदी फ़ाइलों में बांट दें**
   अगर `.cursorrules` फ़ाइल बहुत बड़ी हो जाए, तो मैं उसे `.cursor/*.mdc` फ़ाइलों में बांट देता हूं। इससे टोकन उपयोग घटता है, क्योंकि सिर्फ वही नियम सक्रिय होते हैं जो मौजूदा काम से संबंधित हैं। इसे ऐसे समझिए: मॉडल को अप्रासंगिक निर्देश याद रखने के बजाय असली समस्या पर सोचने के लिए ज्यादा जगह मिलती है।

मेरा लक्ष्य सीधा है: एआई सहायक को हर बातचीत में उतना ही संदर्भ दूं जितना मददगार होने के लिए जरूरी है, उससे ज्यादा नहीं।

## वास्तविक रिपॉज़िटरी से Cursor नियमों के उदाहरण

यह दिखाने के लिए कि मैं अलग-अलग कोडबेस में Cursor नियम कैसे लागू करता हूं, यहां कुछ वास्तविक उदाहरण हैं:

### रिपॉज़िटरी-स्तर की `.cursor/index.mdc` फ़ाइलें: संरचना और उपयोग

`Rule Type` `"Always"` के साथ मेरी `.cursor/index.mdc` फ़ाइलें एआई सहायक के लिए लिखे गए `README.md` जैसी होती हैं। इनमें परियोजना का उद्देश्य, स्थापत्य, और वे कोडिंग ढर्रे होते हैं जिन्हें एआई को समझना चाहिए। (पुरानी `.cursorrules` फ़ाइलें अब भी समर्थित हैं, लेकिन नए प्रोजेक्ट्स के लिए अनुशंसित नहीं हैं।)

![रिपॉज़िटरी-स्तर की .cursorrules फ़ाइल का उदाहरण](/articles/cursor-ide-rules-repo.webp)

#### प्रोडक्शन रिपॉज़िटरी के उदाहरण

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**: रिपॉज़िटरी को पाठ में बदलने वाले इस उपयोगी औजार में नियम परियोजना का उद्देश्य, स्थापत्य से जुड़े निर्णय, और अपनाए जाने वाले कोड ढर्रे समझाते हैं।

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**: इस Telegram bot में नियम उसकी स्थापत्य-रचना, API के उपयोग के ढर्रों, और संदेशों व कमांड को संभालने की परंपराओं पर केंद्रित हैं।

### `.cursor/*.mdc` फ़ाइलें: कब और कैसे इस्तेमाल करें

जब रिपॉज़िटरी-स्तर के नियम बहुत लंबे होने लगते हैं, तो मैं उन्हें संदर्भ-विशेष `.cursor/*.mdc` फ़ाइलों में बांट देता हूं, जो सिर्फ जरूरत पड़ने पर सक्रिय होती हैं।

![Project Rules अनुभाग में संदर्भ-विशेष नियम](/articles/cursor-ide-rules-specific.webp)

#### काम-विशेष नियमों का उदाहरण

एक अच्छा उदाहरण मेरी निजी वेबसाइट की रिपॉज़िटरी है:
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

इस रिपॉज़िटरी में मैंने अलग-अलग नियम-फ़ाइलें बनाई हैं:

- सामग्री प्रबंधन के कार्यप्रवाह
- छवियों के अनुकूलन से जुड़ी आवश्यकताएं
- SEO की सर्वोत्तम कार्य-पद्धतियां
- कॉम्पोनेंट स्थापत्य के ढर्रे
- परिनियोजन की प्रक्रियाएं

इस तरीके से एआई का ध्यान बंटता नहीं और हर काम में उस पर बेकार का संदर्भ नहीं लादा जाता।

### बातचीत के बीच नियम शामिल करने की सीमाएं और सही तरीका

एक जरूरी सीमा समझने लायक है: संदर्भ-संवेदी `.mdc` नियम सबसे अच्छा तब काम करते हैं जब उन्हें किसी नई बातचीत की शुरुआत से लागू किया जाए। अगर आप Cursor IDE में पहले से चल रही बातचीत के बीच अचानक कोई खास नियम लागू करना चाहें, जैसे डेटाबेस क्वेरी करने के दिशा-निर्देश, तो एआई जरूरी नहीं कि उसे अपने-आप पढ़ ले। ऐसा इसलिए होता है क्योंकि Cursor शुरुआत में संदर्भ तय कर चुका होता है और हर संदेश पर यह दोबारा नहीं परखता कि कौन-से नियम लागू होने चाहिए।

ऐसी स्थिति में मैं साफ लिख देता हूं: "Please follow our database querying guidelines for this task." यह वाक्य अंग्रेज़ी में ही रखना बेहतर है, क्योंकि कई बार इसे सीधे prompt में लिखना पड़ता है। इससे Cursor संबंधित नियम ढूंढकर लागू करता है। जिन कामों में किसी खास दिशा-निर्देश पर बहुत भरोसा हो, वहां नई बातचीत शुरू करना अक्सर ज्यादा असरदार होता है, क्योंकि तब Cursor शुरुआत से ही सभी जरूरी संदर्भ-संवेदी नियम उठा लेता है।

## Cursor नियमों का विकास: वैश्विक सेटिंग्स से संदर्भ-संवेदी व्यवस्था तक

Cursor नियमों के साथ मेरा तरीका कई चरणों से गुजरा है:

### चरण 1: सार्वभौमिक नियमों के लिए Cursor IDE की वैश्विक सेटिंग्स

शुरुआत में मैं सब कुछ Cursor IDE की सेटिंग्स में ही डाल देता था। आरंभिक दौर में यह सरल और असरदार था। लेकिन जैसे-जैसे काम करने के तरीके में नए ढर्रे दिखे, वैश्विक नियम बढ़ते गए। फायदा यह था कि हर नई परियोजना उनसे लाभ उठा सकती थी। नुकसान यह कि आखिरकार विन्यास बोझिल हो गया, क्योंकि बहुत से नियम हर जगह लागू नहीं होते थे।

### चरण 2: परियोजना मानकों के लिए रिपॉज़िटरी-विशेष नियम

जब मेरी वैश्विक सेटिंग्स परियोजना से असंबंधित बातों से भरने लगीं, तो मैंने रिपॉज़िटरी-स्तर के नियम अपनाए। शुरुआत में इसका मतलब रिपॉज़िटरी के मूल फ़ोल्डर में `.cursorrules` फ़ाइलें रखना था, जो अब पुराना तरीका माना जाता है। यह मेरा मुख्य तरीका बन गया, क्योंकि इससे मैं हर परियोजना के हिसाब से नियम ढाल सकता था और मानक भी एक जैसे रख सकता था। आज अनुशंसित तरीका `Rule Type` `"Always"` के साथ `.cursor/index.mdc` है।

### चरण 3: खास कामों के लिए गतिशील, संदर्भ-संवेदी नियम

जब Cursor IDE में `.cursor/*.mdc` गतिशील नियम आए, तो मैंने सब कुछ फिर से व्यवस्थित किया। ये संदर्भ-संवेदी नियम सिर्फ तभी सक्रिय होते हैं जब एआई वही संबंधित काम कर रहा हो। इससे मुझे यह करने की सुविधा मिली:

- वैश्विक सेटिंग्स को छोटा और व्यापक रूप से उपयोगी रखना
- परियोजना-व्यापी मानकों के लिए `Rule Type` `"Always"` के साथ `.cursor/index.mdc` का उपयोग करना
- विशेष कामों के लिए केंद्रित `.cursor/*.mdc` फ़ाइलें बनाना

यह स्तरित तरीका एआई को ठीक उसी समय वही दिशा देता है जिसकी जरूरत होती है। इससे अनावश्यक शोर कम होता है और उसकी मदद ज्यादा प्रासंगिक बनती है।

यह बदलाव मुझे धीरे-धीरे यह समझने से मिला कि एआई सहायकों के साथ प्रभावी सहयोग कैसे किया जाए: पहले व्यापक नियम, फिर धीरे-धीरे संदर्भ-संवेदी, काम-विशेष नियम जो उसकी उपयोगिता को वास्तव में बढ़ाएं।

## Cursor नियमों के स्तरों की तुलना: वैश्विक बनाम रिपॉज़िटरी बनाम संदर्भ-संवेदी

Cursor IDE में नियमों की तीनों परतों की एक त्वरित तुलना यहां है:

| पक्ष                       | वैश्विक IDE सेटिंग्स              | रिपॉज़िटरी नियम (`.cursor/index.mdc` `"Always"`) | संदर्भ-संवेदी नियम (`.cursor/*.mdc`) |
| -------------------------- | --------------------------------- | ------------------------------------------------ | ------------------------------------ |
| **दायरा**                  | सभी परियोजनाएं                    | एक खास रिपॉज़िटरी                                | खास काम या संदर्भ                    |
| **किसे दिखते हैं**         | सिर्फ आपको (स्थानीय सेटिंग्स)     | रिपॉज़िटरी के जरिए पूरी टीम को                   | रिपॉज़िटरी के जरिए पूरी टीम को       |
| **स्थायित्व**              | परियोजना बदलने पर भी बने रहते हैं | रिपॉज़िटरी से जुड़े रहते हैं                     | रिपॉज़िटरी से जुड़े रहते हैं         |
| **कब सक्रिय होते हैं**     | हमेशा                             | उस रिपॉज़िटरी में हमेशा                          | सिर्फ तब जब मौजूदा काम से मेल खाएं   |
| **सबसे उपयुक्त किसके लिए** | सार्वभौमिक नियम                   | परियोजना-स्तर के स्थापत्य ढर्रे                  | विशेष क्षेत्र का ज्ञान               |
| **टोकन दक्षता**            | कम                                | मध्यम                                            | ज्यादा                               |
| **कहां सेट होते हैं**      | Cursor settings UI                | `.cursor/index.mdc` फ़ाइल                        | `.cursor/rules/` डायरेक्टरी          |
| **पोर्टेबिलिटी**           | हर डिवाइस पर हाथ से सेटअप         | रिपॉज़िटरी क्लोन करते ही साथ                     | रिपॉज़िटरी क्लोन करते ही साथ         |
| **पुराने तरीके का समर्थन** | लागू नहीं                         | `.cursorrules` अब भी काम करती है                 | लागू नहीं                            |

यह बहु-स्तरीय तरीका अलग-अलग परिस्थितियों में एकसमान दिशा बनाए रखते हुए टोकन उपयोग को बेहतर करता है।

## अपने विकास-कार्य में Cursor नियम लागू करने की चरण-दर-चरण मार्गदर्शिका

अब जब मैंने अपना तरीका साझा कर दिया है, तो देखते हैं कि आप अपने विकास-कार्य में ऐसी व्यवस्था कैसे लागू कर सकते हैं।

### एआई सहायता के लिए Cursor के वैश्विक नियम सेट करना

Cursor IDE में अपने वैश्विक नियम सेट करने के लिए:

1. Cursor IDE खोलें और `Settings` में जाएं
2. `Cursor Settings` > `Rules for AI` पर जाएं
3. ऊपर दिखाए गए ढांचे में अपने मुख्य निर्देश जोड़ें
4. वैश्विक नियमों को सिर्फ उन कोडिंग मानकों तक सीमित रखें जो हर परियोजना पर लागू होते हैं
5. छोटे prompt देकर जांचें कि एआई आपके निर्देशों पर कैसी प्रतिक्रिया दे रहा है

#### स्थानीय Cursor IDE सेटिंग्स को संभालने का व्यावहारिक तरीका

यहां असली बात संतुलन की है: नियम बहुत कम होंगे तो एआई आपकी पसंद नहीं समझेगा; बहुत ज्यादा होंगे तो टोकन बेकार के संदर्भ में खर्च होंगे।

यह भी याद रखें कि ये सेटिंग्स आपकी Cursor IDE installation में स्थानीय रूप से संग्रहीत होती हैं। आपके सहकर्मी इन्हें तब तक नहीं देखेंगे जब तक वे अपनी मशीन पर इन्हें खुद configure न करें। और अगर आप Cursor IDE कई कंप्यूटरों पर इस्तेमाल करते हैं, जैसे निजी और दफ़्तरी setup अलग-अलग हों, तो हर installation में इन्हें अलग से सेट करना होगा।

### टीम परियोजनाओं के लिए रिपॉज़िटरी-स्तर की `.cursor/index.mdc` फ़ाइलें बनाना

परियोजना-स्तर के विन्यास के लिए:

1. अपनी रिपॉज़िटरी में `.cursor/index.mdc` फ़ाइल बनाइए
2. Cursor interface में `Rule Type` को `"Always"` पर सेट कीजिए, या फ़ाइल में हाथ से लिखिए
3. शुरुआत परियोजना के छोटे-से परिचय से कीजिए: यह क्या करती है, उसका stack क्या है, आदि
4. वे स्थापत्य-ढर्रे लिखिए जिन्हें एआई को समझना चाहिए
5. इस परियोजना की विशिष्ट code conventions जोड़िए
6. बेहतर टोकन दक्षता के लिए फ़ाइल को 100 पंक्तियों के भीतर रखने की कोशिश कीजिए

ध्यान दें: पुरानी `.cursorrules` फ़ाइलें अब भी चलती हैं, लेकिन अब अनुशंसित तरीका नहीं हैं।

#### रिपॉज़िटरी-स्तर के Cursor नियमों के लिए एक छोटा प्रारूप

शुरू करने के लिए यह छोटा प्रारूप काफी है:

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

### विशेष कामों के लिए संदर्भ-संवेदी `.mdc` नियम-फ़ाइलें बनाना

अगर आपको आगे बढ़कर ज्यादा सधा हुआ विन्यास चाहिए, तो:

1. अपनी रिपॉज़िटरी में `.cursor/rules/` डायरेक्टरी बनाइए
2. अलग-अलग संदर्भों के लिए अलग `.mdc` फ़ाइलें जोड़िए
3. फ़ाइलों के नाम उनके उद्देश्य के हिसाब से स्पष्ट रखिए
4. हर फ़ाइल को सिर्फ एक खास विषय पर केंद्रित रखिए
5. ऊपर एक छोटा description जोड़िए ताकि एआई समझ सके कि यह rule कब लागू करना है

#### नियम-फ़ाइल बनाने के दो तरीके: हाथ से फ़ाइल बनाना या Cursor IDE interface

आप ये फ़ाइलें हाथ से भी बना सकते हैं, या Cursor IDE interface का इस्तेमाल भी कर सकते हैं:

1. `Settings` > `Rules` पर जाएं
2. `Add Rule` पर क्लिक करें
3. अपनी rule का name और description लिखें
4. custom rule content जोड़ें
5. rule save करें, Cursor आपकी रिपॉज़िटरी में सही `.mdc` फ़ाइल बना देगा

दोनों तरीके बराबर काम करते हैं। हाथ से फ़ाइल बनाने पर ढांचे पर ज्यादा नियंत्रण मिलता है, जबकि Cursor interface थोड़ा ज्यादा निर्देशित अनुभव देता है।

#### React development के लिए नियम-फ़ाइल का उदाहरण

उदाहरण के लिए, React component rules की फ़ाइल कुछ ऐसी दिख सकती है:

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

## एआई-सहायित कोडिंग में Cursor नियमों के मापने योग्य फायदे

इस बहु-स्तरीय Cursor नियम-व्यवस्था को लागू करने के बाद मुझे कई स्तरों पर ठोस सुधार दिखाई दिए।

### लगातार नियमों से कोड गुणवत्ता में सुधार

सबसे तुरंत दिखने वाला फायदा कोड गुणवत्ता की एकरूपता रहा। Cursor नियमों में अपनी पसंद लिख देने पर एआई ऐसा कोड ज्यादा बार बनाता है जो:

- कार्यात्मक प्रोग्रामिंग के सिद्धांतों का लगातार पालन करता है
- बिना याद दिलाए सही त्रुटि-प्रबंधन लागू करता है
- उचित टाइपिंग देता है
- नामकरण-परंपराओं को एक जैसा बनाए रखता है

इसका सीधा असर यह होता है कि कोड समीक्षा में शैली-संबंधी टिप्पणियां कम आती हैं और formatting या cleanup में कम समय लगता है। एक परियोजना में Cursor नियम लागू करने के बाद शैली से जुड़े PR comments लगभग 50% कम हो गए।

### साझा नियमों से टीम के भीतर सहयोग बेहतर होता है

जब टीम में काम होता है, तो Cursor नियम एक साझा समझ बनाते हैं:

- नए सदस्य `.cursorrules` फ़ाइल या रिपॉज़िटरी-स्तर के नियम देखकर जल्दी समझ जाते हैं कि अपेक्षा क्या है
- इंजीनियर और गैर-तकनीकी सदस्य, दोनों एक ही दिशा-निर्देश का संदर्भ ले सकते हैं
- एआई अच्छी कार्य-पद्धतियों को लगातार लागू करता है, इसलिए ज्ञान का आदान-प्रदान अपने-आप होने लगता है

यह मुझे खास तौर पर जूनियर डेवलपर्स को टीम में शामिल करते समय बहुत उपयोगी लगा है। उन्हें अच्छी कार्य-पद्धतियों पर तुरंत feedback मिल जाता है, code review का इंतजार किए बिना।

### बेहतर एआई संवाद से उत्पादकता में बढ़ोतरी

संख्याएं खुद काफी कुछ बता देती हैं:

- नए सदस्यों को कोड मानक समझाने में लगभग 60% कम समय
- शुरुआती PR submissions लगभग 35% तेज, और revision cycles कम
- git history में शैली-सुधार वाले commits लगभग 40% कम

लेकिन सबसे कीमती चीज मानसिक जगह रही है। जब शैली से जुड़ी चिंताएं एआई संभाल लेता है, तो डेवलपर्स असली समस्या पर ज्यादा ध्यान दे सकते हैं।

## अनुभवी डेवलपर्स के लिए Cursor नियमों की उन्नत तकनीकें

जब बुनियादी ढांचा सहज लगने लगे, तो एआई सहायता को और बेहतर बनाने के लिए ये उन्नत तरीके आजमाइए।

### आम विकास-परिस्थितियों के लिए विशेष काम-उन्मुख नियम

मुझे खास तौर पर इन स्थितियों में विशेष Cursor नियम-फ़ाइलें बहुत प्रभावी लगी हैं:

#### Testing rules (`test-guidelines.mdc`)

- रिपॉज़िटरी की मौजूदा testing strategy का सम्मान करें
- नए unit tests जोड़ने की बजाय integration, end-to-end और smoke coverage को प्राथमिकता दें
- unit tests सिर्फ कभी-कभार, स्थिर datasets या शुद्ध data transformations के लिए रखें
- coverage numbers बढ़ाने के लिए unit tests कभी न जोड़ें
- जहां real calls संभव हों, वहां mocks से बचें
- नाज़ुक mock-based tests बनाने से बेहतर है कि जरूरत हो तो real calls पर थोड़ा खर्च किया जाए
- मौजूदा task के लिए जितनी coverage जरूरी हो, उतनी ही जोड़ें

#### API integration rules (`api-standards.mdc`)

- त्रुटि-प्रबंधन की अपेक्षाएं
- retry logic के ढर्रे
- authentication flow के मानक

#### State management rules (`state-patterns.mdc`)

- Redux action naming conventions
- state normalization के दिशा-निर्देश
- side-effect handling के ढर्रे

जब इन विषयों को अलग-अलग फ़ाइलों में बांटा जाता है, तो हर फ़ाइल केंद्रित रहती है और सिर्फ प्रासंगिक काम पर ही सक्रिय होती है।

### Cursor नियमों में टोकन उपयोग को बेहतर बनाना

एआई के प्रभावी संदर्भ-क्षेत्र का बेहतर उपयोग करने के लिए:

1. **सबसे जरूरी नियमों को आगे या अंत में रखें**: मॉडल इन्हें ज्यादा अच्छी तरह पकड़ता है
2. **स्तरीय संरचना रखें**: पहले व्यापक सिद्धांत, फिर विशिष्ट विवरण
3. **दोहराव हटाएं**: एक ही नियम को कई जगह मत लिखिए
4. **भाषा संक्षिप्त रखें**: लंबे अनुच्छेदों की जगह bullet points बेहतर हैं
5. **Markdown formatting का लाभ लें**: headings अलग-अलग श्रेणियां साफ दिखाती हैं

एक सीधा नियम यह है: अगर कोई rule file 100 पंक्तियों से ज्यादा लंबी हो जाए, तो शायद वह एक ही file में बहुत कुछ समेटने की कोशिश कर रही है और उसे छोटे, focused हिस्सों में बांटना चाहिए।

### Cursor नियमों की आम समस्याएं और उनके समाधान

अगर आपके Cursor नियम उम्मीद के मुताबिक नतीजे नहीं दे रहे हैं, तो इन बातों की जांच कीजिए:

1. **नियमों में टकराव**: अलग-अलग स्तरों पर कहीं विरोधाभासी निर्देश तो नहीं
2. **बहुत सामान्य नियम**: उन्हें ज्यादा ठोस बनाइए और संभव हो तो उदाहरण जोड़िए
3. **बहुत संकरे नियम**: जरूरत से ज्यादा संकरे rules मिलते-जुलते scenarios में लागू नहीं होते
4. **टोकन की सीमाएं**: अगर नियम truncate हो रहे हैं, तो उन्हें छोटा और प्राथमिकताबद्ध कीजिए
5. **संदर्भ की कमी**: एआई को सही नियम लागू करने के लिए अतिरिक्त file context की जरूरत हो सकती है
6. **Rule overload**: अगर एक ही बातचीत में बहुत सारे Cursor नियम आ जाएं, तो मॉडल के लिए सब याद रखकर ठीक से पालन करना मुश्किल हो जाता है

मैंने पाया है कि बने हुए कोड को अपने Cursor नियमों के मुकाबले देखकर, और फिर धीरे-धीरे उन नियमों को परिष्कृत करके, एआई सहायता की गुणवत्ता लगातार बेहतर की जा सकती है।

## Cursor IDE बनाम दूसरे एआई कोडिंग सहायकों की विन्यास-पद्धतियां

नियमों के मामले में Cursor की व्यवस्था काफी अच्छी तरह बनाई गई है, लेकिन दूसरे एआई कोडिंग सहायकों में भी अनुकूलन के अपने तरीके हैं:

- GitHub Copilot परियोजना-स्तर के विन्यास के लिए `.github/copilot/settings.yml` देता है
- JetBrains AI Assistant में परियोजना-स्तर के snippets और templates मिलते हैं
- VS Code में अलग-अलग AI extensions workspace settings और customization files के जरिए ऐसा नियंत्रण मिलता है

ध्यान देने वाली बात यह है कि Cursor का `.cursorrules` से `.cursor/index.mdc` और `Rule Type` `"Always"` की ओर बढ़ना दिखाता है कि ये व्यवस्थाएं समय के साथ ज्यादा लचीली और बेहतर ढंग से व्यवस्थित हो रही हैं।

### टोकन अर्थव्यवस्था: हर tool में एआई का प्रदर्शन कैसे बेहतर रखें

इन सभी तरीकों को जोड़ने वाला मूल सिद्धांत एक ही है: **बेहतर नतीजों के लिए टोकन उपयोग को नियंत्रित रखना जरूरी है।** आप कोई भी एआई कोडिंग सहायक इस्तेमाल करें, मॉडल को उतना ही संदर्भ दें जितना जरूरी हो। जरूरत से ज्यादा guidance आम तौर पर मदद नहीं करती।

टोकन अर्थव्यवस्था लगभग हर LLM-powered tool में एक जैसी चलती है:

1. आपकी instructions का हर शब्द टोकन खर्च करता है
2. instructions में खर्च हुए टोकन, code समझने के लिए बची जगह कम कर देते हैं
3. जरूरत से ज्यादा verbose guidance का फायदा जल्दी घटने लगता है

इसलिए चाहे आप Cursor की तीन-स्तरीय नियम-व्यवस्था इस्तेमाल करें या किसी दूसरे tool की configuration files, लक्ष्य एक ही रखें: साफ, सटीक और जरूरत भर guidance। सबसे महत्वपूर्ण patterns और preferences बताइए, बाकी एआई पर छोड़ दीजिए।

असली बढ़त उस tool में नहीं होती जिसके पास customization options सबसे ज्यादा हों, बल्कि उसमें होती है कि आप उपलब्ध विकल्पों का इस्तेमाल कितनी समझदारी से करते हैं।

## वीडियो ट्यूटोरियल: Cursor IDE नियमों का पूरा लागू रूप देखें

अगर आप चीजें देखकर सीखना पसंद करते हैं, तो मैंने एक विस्तृत वीडियो ट्यूटोरियल बनाया है जो इस तीन-स्तरीय Cursor नियम-व्यवस्था को शुरू से अंत तक लागू करके दिखाता है:

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

वीडियो में आप देखेंगे:

- Cursor IDE settings में वैश्विक Cursor नियम सेट करना
- repository-specific `.cursorrules` files को वास्तविक उदाहरणों के साथ बनाना
- खास कामों के लिए context-aware `.cursor/*.mdc` files लागू करना
- यह दिखाना कि तीनों स्तर मिलकर एआई सहायता को कैसे बेहतर बनाते हैं
- आम समस्याओं का समाधान और टोकन उपयोग बेहतर करने के तरीके

आप पूरा कार्यप्रवाह शुरुआत से अंत तक चलते हुए देखेंगे, और समझ पाएंगे कि बहु-स्तरीय configuration एआई सहायकों के साथ काम करने का तरीका कैसे बदल देती है।

अगर आप दूसरे coding agents के लिए companion articles भी पढ़ना चाहते हैं, तो वे यहां हैं:

- AI के लिए Claude Code के नियम: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- AI के लिए Codex के नियम: [https://kirill-markin.com/articles/codex-rules-for-ai/](https://kirill-markin.com/articles/codex-rules-for-ai/)
