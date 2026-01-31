---
keywords: [
  "कर्सर आईडीई",
  "कृत्रिम बुद्धिमत्ता",
  "एकीकृत विकास परिवेश",
  "कर्सर नियम",
  "कोडिंग सहायक",
  "एआई कोडिंग",
  "प्रोग्रामिंग सहायता",
  "स्वचालित कोड निर्माण",
  "कोड विकास",
  "एआई प्रोग्रामिंग टूल"
]
title: "कर्सर आईडीई नियम: कृत्रिम बुद्धिमत्ता कोडिंग के लिए दिशानिर्देश"
date: 2025-05-09
description: "मेरे युद्ध-परीक्षित कर्सर आईडीई नियम जो अनुकूलित शैली, त्रुटि प्रबंधन और कार्यप्रवाह पैटर्न के साथ एआई कोडिंग को बढ़ाते हैं, जिससे सुसंगत परिणाम मिलते हैं।"
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

# कर्सर आईडीई नियम: कृत्रिम बुद्धिमत्ता कोडिंग के लिए दिशानिर्देश 

कर्सर आईडीई में तीन स्तरों पर नियम लागू किए जाते हैं:

1. कर्सर आईडीई सेटिंग्स में एआई के लिए नियम - आधार नियम जो सभी प्रोजेक्ट्स पर वैश्विक रूप से लागू होते हैं
2. `.cursor/index.mdc` फ़ाइल Rule Type "Always" के साथ - रिपॉजिटरी-विशिष्ट कर्सर प्रोजेक्ट नियम (पुराने `.cursorrules` दृष्टिकोण को प्रतिस्थापित करता है)
3. `.cursor/rules/*.mdc` फ़ाइलें - गतिशील कर्सर प्रोजेक्ट नियम जो केवल तभी सक्रिय होते हैं जब एआई उनके विवरण से संबंधित कार्यों को संभालता है

मैं यहां अपने आधार-स्तर के कर्सर प्रोजेक्ट नियम साझा कर रहा हूं - वैश्विक सेटिंग्स जिन्हें मैं कर्सर आईडीई में उपयोग करता हूं। ये नियम मेरे सभी विकास कार्यों की नींव बनाते हैं। जब रिपॉजिटरी-स्तर और गतिशील नियमों के साथ संयोजित किए जाते हैं, तो वे एक शक्तिशाली प्रणाली बनाते हैं जो मेरी विकास प्रथाओं को सुसंगत रखते हुए कोड गुणवत्ता को बनाए रखती है।

> **वीडियो ट्यूटोरियल पसंद करते हैं?** मैंने इस पूरे कर्सर नियम सिस्टम का एक व्यापक वीडियो वॉकथ्रू बनाया है। [Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025) देखें](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx) इन तकनीकों को चरणबद्ध तरीके से लागू होते देखने के लिए।

[![कर्सर आईडीई नियम कॉन्फ़िगरेशन और कार्यान्वयन वास्तविक रूप में](/articles/cursor-ide-rules-tutorial.webp)](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx)

## इष्टतम एआई कोडिंग प्रदर्शन के लिए कर्सर नियम कैसे कॉन्फ़िगर करें

कर्सर -> सेटिंग्स -> कर्सर सेटिंग्स -> एआई के लिए नियम:

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

## वीडियो ट्यूटोरियल: पूर्ण कर्सर आईडीई नियम कार्यान्वयन देखें

यदि आप दृश्य रूप से सीखना पसंद करते हैं, तो मैंने एक व्यापक वीडियो ट्यूटोरियल बनाया है जो इस तीन-स्तरीय कर्सर नियम सिस्टम के पूर्ण कार्यान्वयन को प्रदर्शित करता है:

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx)

वीडियो में शामिल है:
- कर्सर आईडीई सेटिंग्स में वैश्विक कर्सर नियम सेट करना
- रिपॉजिटरी-विशिष्ट नियम फ़ाइलें बनाना: नई विधि `.cursor/index.mdc` (Rule Type "Always") और पुराती विधि `.cursorrules` (legacy)
- विशेष कार्यों के लिए संदर्भ-जागरूक `.cursor/*.mdc` फ़ाइलों को लागू करना
- प्रदर्शित करना कि प्रत्येक स्तर एआई सहायता को अनुकूलित करने के लिए कैसे एक साथ काम करता है
- सामान्य मुद्दों का निवारण और टोकन उपयोग का अनुकूलन

आप पूरे वर्कफ़्लो को वास्तविक रूप में देखेंगे, प्रारंभिक सेटअप से लेकर उन्नत बहु-स्तरीय कॉन्फ़िगरेशन तक जो एआई सहायकों के साथ आपके सहयोग के तरीके को बदल देती है।