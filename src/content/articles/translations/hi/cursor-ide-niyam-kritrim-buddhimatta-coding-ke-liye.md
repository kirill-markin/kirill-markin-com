---
keywords: [
  "Cursor IDE",
  "Cursor नियम",
  "एआई कोडिंग",
  "एआई सहायक",
  "कोडिंग दिशानिर्देश",
  "परियोजना नियम",
  "रिपॉजिटरी नियम",
  "संदर्भ-संवेदी नियम",
  "Cursor IDE सेटिंग्स",
  "टोकन दक्षता"
]
title: "Cursor IDE के नियम: विशेषज्ञ एआई सहायक के लिए दिशानिर्देश"
date: 2025-05-09
description: "Cursor IDE में इस्तेमाल किए जाने वाले मेरे परखे हुए नियम, जो एआई कोडिंग को स्पष्ट शैली, सख्त त्रुटि-प्रबंधन और सुव्यवस्थित कार्यप्रवाह के जरिए लगातार बेहतर बनाते हैं।"
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

# Cursor IDE के नियम: विशेषज्ञ एआई सहायक के लिए दिशानिर्देश

Cursor IDE में नियमों के तीन स्तर होते हैं:

1. Cursor IDE settings में `Rules for AI` के तहत रखे जाने वाले नियम, जो हर project पर लागू होते हैं
2. Rule Type `"Always"` के साथ `.cursor/index.mdc`, जो किसी खास repository के लिए साझा नियम रखती है
3. `.cursor/rules/*.mdc` फ़ाइलें, जो तभी सक्रिय होती हैं जब एआई उनके विवरण से जुड़े काम पर लगा हो

यहां मैं अपने आधारभूत Cursor project rules साझा कर रहा हूं, यानी वे वैश्विक सेटिंग्स जिन्हें मैं Cursor IDE में इस्तेमाल करता हूं। यही मेरे लगभग हर विकास कार्यप्रवाह की नींव हैं। जब इन्हें रिपॉजिटरी-स्तर और संदर्भ-संवेदी rules के साथ जोड़ा जाता है, तो एक ऐसी व्यवस्था बनती है जो कोड गुणवत्ता बनाए रखती है और मेरे काम करने के तरीके को लगातार एकसमान रखती है।

> **वीडियो में देखना पसंद है?** मैंने इस पूरी Cursor नियम व्यवस्था पर एक विस्तार से समझाने वाला वीडियो बनाया है। [Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](https://www.youtube.com/watch?v=gw8otRr2zpw) देखें, जहां यह सब कदम-दर-कदम लागू करके दिखाया गया है।

[![Cursor IDE rules को सेट और इस्तेमाल करते हुए](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## एआई कोडिंग का बेहतर प्रदर्शन पाने के लिए Cursor Rules कैसे सेट करें

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

![Cursor IDE settings panel में global rules](/articles/cursor-ide-rules-global.webp)

## तीन-स्तरीय Cursor project rules रणनीति से दक्षता कैसे बढ़ती है

Cursor IDE की एआई सुविधाओं के साथ काम करते हुए मैंने पाया है कि तीनों स्तरों पर rules को सोच-समझकर व्यवस्थित करना बहुत जरूरी है। सबसे महत्वपूर्ण बात यह है: हर बातचीत में भाषा मॉडल को भेजे जाने वाले tokens की संख्या जितनी हो सके उतनी कम रखी जाए। जितना कम अनावश्यक संदर्भ जाएगा, उतनी ज्यादा जगह बेहतर जवाब तैयार करने में लगेगी।

अगर आप Cursor में project rules कैसे काम करते हैं, यह और विस्तार से समझना चाहते हैं, तो [Rules for AI पर Cursor का आधिकारिक documentation](https://docs.cursor.com/context/rules) देख सकते हैं।

### Cursor project rules लागू करने का 3-चरणीय क्रम

1. **शुरुआत सिर्फ IDE-स्तर की सेटिंग्स से करें**
   मैं पहले वैश्विक Cursor IDE settings से अपनी बुनियादी प्राथमिकताएं तय करता हूं। इससे मैं rules लिखने के अलग-अलग तरीके आजमा सकता हूं, बिना repositories को बेवजह भारी किए। इस स्तर पर मैं सिर्फ वही rules रखता हूं जो सचमुच हर project पर लागू होते हैं।

2. **Project-specific rules को repository level पर ले जाएं**  
   जब मुझे किसी खास codebase में दोहराने वाले patterns दिखते हैं, या मैं teammates के साथ एआई के लिए निर्देश साझा करना चाहता हूं, तो मैं उन rules को Rule Type `"Always"` के साथ `.cursor/index.mdc` में रख देता हूं। इससे साझा समझ बनती है और मेरी वैश्विक सेटिंग्स हल्की रहती हैं। (ध्यान रहे: legacy `.cursorrules` file अब भी काम करती है, लेकिन अब वही recommended तरीका नहीं है।)

3. **जब जरूरत हो, rules को संदर्भ-संवेदी files में बांट दें**
   अगर `.cursorrules` file बहुत बड़ी हो जाए, तो मैं उसे `.cursor/*.mdc` files में बांट देता हूं। इससे टोकन उपयोग घटता है, क्योंकि सिर्फ वही rules सक्रिय होते हैं जो मौजूदा काम से संबंधित हैं। इसे ऐसे समझिए: model को अप्रासंगिक निर्देश याद रखने के बजाय असली समस्या पर सोचने के लिए ज्यादा जगह मिलती है।

मेरा लक्ष्य सीधा है: एआई सहायक को हर बातचीत में उतना ही context दूं जितना मददगार होने के लिए जरूरी है, उससे ज्यादा नहीं।

## असली repositories से Cursor project rules के उदाहरण

यह दिखाने के लिए कि मैं अलग-अलग codebases में Cursor project rules कैसे लागू करता हूं, यहां कुछ वास्तविक उदाहरण हैं:

### Repository-level `.cursor/index.mdc` files: संरचना और उपयोग

Rule Type `"Always"` के साथ मेरी `.cursor/index.mdc` फ़ाइलें, एआई सहायक के लिए लिखे गए `README.md` जैसी होती हैं। इनमें project का उद्देश्य, architecture, और वे coding patterns होते हैं जिन्हें एआई को समझना चाहिए। (Legacy `.cursorrules` files अब भी समर्थित हैं, लेकिन नए projects के लिए अनुशंसित नहीं हैं।)

![Repository-level .cursorrules file का उदाहरण](/articles/cursor-ide-rules-repo.webp)

#### Production repositories के उदाहरण

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**: repositories को text में बदलने वाले इस utility tool में rules project का उद्देश्य, architecture decisions, और अपनाए जाने वाले code patterns समझाते हैं।

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**: इस Telegram bot में rules bot की architecture, API usage patterns, और messages व commands संभालने की conventions पर केंद्रित हैं।

### `.cursor/*.mdc` files: कब और कैसे इस्तेमाल करें

जब repository-level rules बहुत लंबे होने लगते हैं, तो मैं उन्हें संदर्भ-विशेष `.cursor/*.mdc` फ़ाइलों में बांट देता हूं, जो सिर्फ जरूरत पड़ने पर सक्रिय होती हैं।

![Project Rules section में context-specific rules](/articles/cursor-ide-rules-specific.webp)

#### काम-विशेष rules का उदाहरण

एक अच्छा उदाहरण मेरी personal website repository है:  
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

इस repo में मैंने अलग-अलग rule files बनाई हैं:

- content management workflows
- image optimization requirements
- SEO best practices
- component architecture patterns
- deployment procedures

इस तरीके से एआई का ध्यान बंटता नहीं और हर काम में उस पर बेकार का context नहीं लादा जाता।

### बातचीत के बीच rules शामिल करने की सीमाएं और सही तरीका

एक जरूरी सीमा समझने लायक है: context-aware `.mdc` rules सबसे अच्छा तब काम करती हैं जब उन्हें किसी नई बातचीत की शुरुआत से लागू किया जाए। अगर आप Cursor IDE में पहले से चल रही बातचीत के बीच अचानक कोई खास rule लागू करना चाहें, जैसे database querying guidelines, तो एआई जरूरी नहीं कि उसे अपने-आप पढ़ ले। ऐसा इसलिए होता है क्योंकि Cursor शुरुआत में संदर्भ तय कर चुका होता है और हर संदेश पर यह दोबारा नहीं परखता कि कौन-से rules लागू होने चाहिए।

ऐसी स्थिति में मैं सीधा लिख देता हूं: "Please follow our database querying guidelines for this task." इससे Cursor संबंधित rule ढूंढकर लागू करता है। जिन कामों में किसी खास guideline पर बहुत भरोसा हो, वहां नई बातचीत शुरू करना अक्सर ज्यादा असरदार होता है, क्योंकि तब Cursor शुरुआत से ही सभी जरूरी context-aware rules उठा लेता है।

## Cursor project rules का विकास: वैश्विक सेटिंग्स से संदर्भ-संवेदी व्यवस्था तक

Cursor project rules के साथ मेरा तरीका कई चरणों से गुजरा है:

### चरण 1: सार्वभौमिक rules के लिए global Cursor IDE settings

शुरुआत में मैं सब कुछ Cursor IDE settings में ही डाल देता था। शुरुआत के लिए यह सरल और असरदार था। लेकिन जैसे-जैसे काम करने के तरीके में नए patterns दिखे, global cursor project rules बढ़ती गईं। फायदा यह था कि हर नया project उनसे लाभ उठा सकता था। नुकसान यह कि आखिरकार configuration बोझिल हो गई, क्योंकि बहुत से rules हर जगह लागू नहीं होते थे।

### चरण 2: project standards के लिए repository-specific rules

जब मेरी वैश्विक सेटिंग्स project से असंबंधित बातों से भरने लगीं, तो मैंने repository-level rules अपनाईं। शुरुआत में इसका मतलब repository root में `.cursorrules` files था, जो अब legacy तरीका माना जाता है। यह मेरा मुख्य तरीका बन गया, क्योंकि इससे मैं हर project के हिसाब से cursor project rules ढाल सकता था और standards भी एक जैसे रख सकता था। आज recommended तरीका Rule Type `"Always"` के साथ `.cursor/index.mdc` है।

### चरण 3: खास कामों के लिए dynamic, context-aware rules

जब Cursor IDE में `.cursor/*.mdc` dynamic rules आईं, तो मैंने सब कुछ फिर से व्यवस्थित किया। ये context-aware cursor project rules सिर्फ तभी सक्रिय होती हैं जब एआई वही संबंधित काम कर रहा हो। इससे मुझे यह करने की आजादी मिली:

- वैश्विक सेटिंग्स को छोटा और व्यापक रूप से उपयोगी रखना
- project-wide standards के लिए Rule Type `"Always"` के साथ `.cursor/index.mdc` का उपयोग करना
- specialized tasks के लिए focused `.cursor/*.mdc` files बनाना

यह स्तरित तरीका एआई को ठीक उसी समय वही दिशा देता है जिसकी जरूरत होती है। इससे अनावश्यक शोर कम होता है और उसकी मदद ज्यादा प्रासंगिक बनती है।

यह बदलाव मुझे धीरे-धीरे यह समझने से मिला कि एआई सहायकों के साथ प्रभावी सहयोग कैसे किया जाए: पहले व्यापक rules, फिर धीरे-धीरे context-aware, task-specific rules जो उसकी उपयोगिता को वास्तव में बढ़ाएं।

## Cursor project rules के स्तरों की पूरी तुलना: Global बनाम Repository बनाम Context-Aware

Cursor IDE में cursor project rules के तीनों स्तरों की एक त्वरित तुलना यहां है:

| पक्ष | Global IDE Settings | Repository Rules (`.cursor/index.mdc` `"Always"`) | Context-Aware Rules (`.cursor/*.mdc`) |
|------|---------------------|---------------------------------------------------|---------------------------------------|
| **दायरा** | सभी projects | एक खास repository | खास tasks या contexts |
| **किसे दिखते हैं** | सिर्फ आपको (स्थानीय settings) | repository के जरिए पूरी team को | repository के जरिए पूरी team को |
| **स्थायित्व** | projects बदलने पर भी बने रहते हैं | repository से जुड़े रहते हैं | repository से जुड़े रहते हैं |
| **कब सक्रिय होते हैं** | हमेशा | उस repository में हमेशा | सिर्फ तब जब मौजूदा task से मेल खाएं |
| **सबसे उपयुक्त किसके लिए** | सार्वभौमिक cursor project rules | project architecture patterns | विशेष domain knowledge |
| **टोकन दक्षता** | कम | मध्यम | ज्यादा |
| **कहां सेट होते हैं** | Cursor settings UI | `.cursor/index.mdc` file | `.cursor/rules/` directory |
| **पोर्टेबिलिटी** | हर device पर हाथ से setup | repository clone करते ही साथ | repository clone करते ही साथ |
| **legacy support** | N/A | `.cursorrules` अब भी काम करती है | N/A |

यह बहु-स्तरीय तरीका अलग-अलग परिस्थितियों में एकसमान दिशा बनाए रखते हुए टोकन उपयोग को बेहतर करता है।

## अपने विकास कार्यप्रवाह में Cursor project rules लागू करने की चरण-दर-चरण मार्गदर्शिका

अब जब मैंने अपना तरीका साझा कर दिया है, तो देखते हैं कि आप अपने विकास कार्यप्रवाह में ऐसा system कैसे लागू कर सकते हैं।

### AI सहायता के लिए global Cursor project rules सेट करना

Cursor IDE में अपने global Cursor project rules सेट करने के लिए:

1. Cursor IDE खोलें और Settings में जाएं
2. Cursor Settings > Rules for AI पर जाएं
3. ऊपर दिखाए गए structure में अपने मुख्य निर्देश जोड़ें
4. Global cursor project rules को सिर्फ उन coding standards तक सीमित रखें जो हर project पर लागू होते हैं
5. छोटे prompts के साथ जांचें कि AI आपकी instructions पर कैसे प्रतिक्रिया दे रहा है

#### Local Cursor IDE settings को संभालने का व्यावहारिक तरीका

यहां असली बात संतुलन की है: rules बहुत कम होंगी तो एआई आपकी पसंद नहीं समझेगा; बहुत ज्यादा होंगी तो tokens बेकार के context में खर्च होंगे।

यह भी याद रखें कि ये settings आपकी Cursor IDE installation में locally stored होती हैं। आपके colleagues इन्हें तब तक नहीं देखेंगे जब तक वे अपनी machine पर इन्हें खुद configure न करें। और अगर आप Cursor IDE कई computers पर इस्तेमाल करते हैं, जैसे personal और work setup अलग-अलग हों, तो हर installation में इन्हें अलग से सेट करना होगा।

### Team projects के लिए repository-level `.cursor/index.mdc` files बनाना

Project-level configuration के लिए:

1. अपनी repository में `.cursor/index.mdc` file बनाइए
2. Cursor interface में Rule Type को `"Always"` पर सेट कीजिए, या file में हाथ से लिखिए
3. शुरुआत एक छोटे project overview से कीजिए: project क्या करता है, stack क्या है, आदि
4. वे architecture patterns लिखिए जिन्हें AI को समझना चाहिए
5. इस project की specific code conventions जोड़िए
6. बेहतर टोकन दक्षता के लिए file को 100 lines के भीतर रखने की कोशिश कीजिए

ध्यान दें: legacy `.cursorrules` files अब भी चलती हैं, लेकिन अब recommended तरीका नहीं हैं।

#### Repository-level Cursor project rules के लिए एक छोटा प्रारूप

शुरू करने के लिए यह minimal template काफी है:

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

### विशेष कामों के लिए context-aware `.mdc` rule files बनाना

अगर आपको आगे बढ़कर ज्यादा सधा हुआ setup चाहिए, तो:

1. अपनी repository में `.cursor/rules/` directory बनाइए
2. अलग-अलग contexts के लिए अलग `.mdc` files जोड़िए
3. File names को उनके उद्देश्य के हिसाब से स्पष्ट रखिए
4. हर file को सिर्फ एक खास विषय पर केंद्रित रखिए
5. ऊपर एक छोटा description जोड़िए ताकि एआई समझ सके कि यह rule कब लागू करनी है

#### Rules बनाने के दो तरीके: manual file या Cursor IDE interface

आप ये files हाथ से भी बना सकते हैं, या Cursor IDE interface का इस्तेमाल भी कर सकते हैं:

1. Settings > Rules पर जाएं
2. "Add Rule" पर क्लिक करें
3. अपनी rule का name और description लिखें
4. Custom rule content जोड़ें
5. Rule save करें, Cursor आपकी repository में सही `.mdc` file बना देगा

दोनों तरीके बराबर काम करते हैं। Manual file creation से structure पर ज्यादा control मिलता है, जबकि Cursor interface थोड़ा ज्यादा निर्देशित अनुभव देता है।

#### React development के लिए rule file का उदाहरण

उदाहरण के लिए, React component rules की file कुछ ऐसी दिख सकती है:

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

## एआई-सहायित कोडिंग में Cursor project rules के मापने योग्य फायदे

इस multi-level cursor project rules system को लागू करने के बाद मुझे कई स्तरों पर ठोस सुधार दिखाई दिए।

### लगातार नियमों से कोड गुणवत्ता में सुधार

सबसे तुरंत दिखने वाला फायदा कोड गुणवत्ता की consistency रहा। Cursor project rules में अपनी पसंद लिख देने पर एआई ऐसा code ज्यादा बार बनाता है जो:

- functional programming principles का लगातार पालन करता है
- बिना याद दिलाए सही error handling लागू करता है
- उचित typing देता है
- naming conventions को एक जैसा बनाए रखता है

इसका सीधा असर यह होता है कि code review में style-related comments कम आते हैं और formatting या cleanup में कम समय लगता है। एक project में cursor project rules लागू करने के बाद style-related PR comments लगभग 50% कम हो गए।

### Shared cursor project rules से टीम के भीतर सहयोग बेहतर होता है

जब teams में काम होता है, तो cursor project rules एक साझा समझ बनाती हैं:

- नए team members `.cursorrules` file या repository rules देखकर जल्दी समझ जाते हैं कि अपेक्षा क्या है
- engineers और non-engineers, दोनों एक ही दिशा-निर्देश को reference कर सकते हैं
- एआई best practices को लगातार लागू करता है, इसलिए knowledge sharing अपने-आप होने लगती है

यह मुझे खास तौर पर junior developers के onboarding में बहुत उपयोगी लगा है। उन्हें best practices पर तुरंत feedback मिल जाता है, code review का इंतजार किए बिना।

### बेहतर AI interactions से उत्पादकता में बढ़ोतरी

संख्याएं खुद काफी कुछ बता देती हैं:

- नए team members को code standards समझाने में लगभग 60% कम समय
- शुरुआती PR submissions लगभग 35% तेज, और revision cycles कम
- git history में style-fix commits लगभग 40% कम

लेकिन सबसे कीमती चीज mental bandwidth रही है। जब style concerns एआई संभाल लेता है, तो developers असली समस्या पर ज्यादा ध्यान दे सकते हैं।

## अनुभवी developers के लिए Cursor project rules की उन्नत तकनीकें

जब basic rule structures सहज लगने लगें, तो एआई assistance को और बेहतर बनाने के लिए ये advanced techniques आजमाइए।

### आम development scenarios के लिए specialized task-specific rules

मुझे खास तौर पर इन स्थितियों में specialized cursor project rules files बहुत प्रभावी लगी हैं:

#### Testing rules (`test-guidelines.mdc`)

- repository की existing testing strategy का सम्मान करें
- नए unit tests जोड़ने की बजाय integration, end-to-end और smoke coverage को प्राथमिकता दें
- unit tests सिर्फ कभी-कभार, stable datasets या pure data transformations के लिए रखें
- coverage numbers बढ़ाने के लिए unit tests कभी न जोड़ें
- जहां real calls संभव हों, वहां mocks से बचें
- fragile mock-based tests बनाने से बेहतर है कि जरूरत हो तो real calls पर थोड़ा खर्च किया जाए
- मौजूदा task के लिए जितनी coverage जरूरी हो, उतनी ही जोड़ें

#### API integration rules (`api-standards.mdc`)

- error handling expectations
- retry logic patterns
- authentication flow standards

#### State management rules (`state-patterns.mdc`)

- Redux action naming conventions
- state normalization guidelines
- side-effect handling patterns

जब इन concerns को अलग-अलग files में बांटा जाता है, तो हर file focused रहती है और सिर्फ relevant task पर ही सक्रिय होती है।

### Cursor project rules में टोकन उपयोग को बेहतर बनाना

एआई के effective context window का बेहतर उपयोग करने के लिए:

1. **सबसे जरूरी rules को आगे या अंत में रखें**: model इन्हें ज्यादा अच्छे से पकड़ता है
2. **स्तरीय संरचना रखें**: पहले व्यापक सिद्धांत, फिर specific details
3. **दोहराव हटाएं**: एक ही rule को कई जगह मत लिखिए
4. **भाषा संक्षिप्त रखें**: लंबे paragraphs की जगह bullet points बेहतर हैं
5. **Markdown formatting का लाभ लें**: headings अलग-अलग categories साफ दिखाती हैं

एक सीधा नियम यह है: अगर कोई rule file 100 lines से ज्यादा लंबी हो जाए, तो शायद वह एक ही file में बहुत कुछ समेटने की कोशिश कर रही है और उसे छोटे, focused हिस्सों में बांटना चाहिए।

### Cursor project rules की आम समस्याएं और उनके समाधान

अगर आपकी cursor project rules उम्मीद के मुताबिक नतीजे नहीं दे रही हैं, तो इन बातों की जांच कीजिए:

1. **Rules में टकराव**: अलग-अलग levels पर कहीं विरोधाभासी guidance तो नहीं
2. **बहुत सामान्य rules**: उन्हें ज्यादा ठोस बनाइए और संभव हो तो उदाहरण जोड़िए
3. **बहुत संकरी rules**: जरूरत से ज्यादा narrow rules मिलते-जुलते scenarios में लागू नहीं होतीं
4. **Token limitations**: अगर rules truncate हो रही हैं, तो उन्हें छोटा और प्राथमिकताबद्ध कीजिए
5. **Context की कमी**: एआई को सही rule लागू करने के लिए अतिरिक्त file context की जरूरत हो सकती है
6. **Rule overload**: अगर एक ही बातचीत में बहुत सारी cursor project rules आ जाएं, तो model के लिए सब याद रखकर ठीक से पालन करना मुश्किल हो जाता है

मैंने पाया है कि generated code को अपनी cursor project rules के मुकाबले देखना और फिर धीरे-धीरे उन rules को refine करना, एआई assistance की quality लगातार बेहतर करता है।

## Cursor IDE बनाम दूसरे AI coding assistants: configuration approaches की तुलना

Rules के मामले में Cursor का system काफी अच्छी तरह बनाया गया है, लेकिन दूसरे AI coding assistants में भी customization के अपने तरीके हैं:

- GitHub Copilot project-level configuration के लिए `.github/copilot/settings.yml` देता है
- JetBrains AI Assistant में project-level snippets और templates मिलते हैं
- VS Code में अलग-अलग AI extensions workspace settings और customization files के जरिए ऐसा control देती हैं

ध्यान देने वाली बात यह है कि Cursor का `.cursorrules` से `.cursor/index.mdc` और Rule Type `"Always"` की ओर बढ़ना दिखाता है कि ये systems समय के साथ ज्यादा flexible और बेहतर ढंग से organized हो रहे हैं।

### Token economy: हर tool में AI performance कैसे बेहतर रखें

इन सभी approaches को जोड़ने वाला मूल सिद्धांत एक ही है: **बेहतर नतीजों के लिए टोकन उपयोग को नियंत्रित रखना जरूरी है।** आप कोई भी AI coding assistant इस्तेमाल करें, model को उतना ही context दें जितना जरूरी हो। जरूरत से ज्यादा guidance आम तौर पर मदद नहीं करती।

Token economy लगभग हर LLM-powered tool में एक जैसी चलती है:

1. आपकी instructions का हर शब्द tokens खर्च करता है
2. Instructions में खर्च हुए tokens, code समझने के लिए बची जगह कम कर देते हैं
3. जरूरत से ज्यादा verbose guidance का फायदा जल्दी घटने लगता है

इसलिए चाहे आप Cursor की तीन-स्तरीय rule system इस्तेमाल करें या किसी दूसरे tool की configuration files, लक्ष्य एक ही रखें: साफ, सटीक और जरूरत भर guidance। सबसे महत्वपूर्ण patterns और preferences बताइए, बाकी एआई पर छोड़ दीजिए।

असली बढ़त उस tool में नहीं होती जिसके पास customization options सबसे ज्यादा हों, बल्कि उसमें होती है कि आप उपलब्ध options का इस्तेमाल कितनी समझदारी से करते हैं।

## वीडियो ट्यूटोरियल: Cursor IDE rules की पूरी implementation देखें

अगर आप चीजें देखकर सीखना पसंद करते हैं, तो मैंने एक विस्तृत वीडियो ट्यूटोरियल बनाया है जो इस तीन-स्तरीय cursor rules system की पूरी implementation दिखाता है:

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

वीडियो में आप देखेंगे:

- Cursor IDE settings में global cursor rules सेट करना
- repository-specific `.cursorrules` files को वास्तविक उदाहरणों के साथ बनाना
- specialized tasks के लिए context-aware `.cursor/*.mdc` files लागू करना
- यह दिखाना कि तीनों स्तर मिलकर एआई assistance को कैसे बेहतर बनाते हैं
- आम समस्याओं का समाधान और टोकन उपयोग को optimize करने के तरीके

आप पूरा workflow शुरुआत से अंत तक चलते हुए देखेंगे, और समझ पाएंगे कि multi-level configuration एआई assistants के साथ काम करने का तरीका कैसे बदल देती है।

अगर आप दूसरे coding agents के लिए companion articles भी पढ़ना चाहते हैं, तो वे यहां हैं:

- AI के लिए Claude Code के नियम: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- AI के लिए Codex के नियम: [https://kirill-markin.com/articles/codex-rules-for-ai/](https://kirill-markin.com/articles/codex-rules-for-ai/)
