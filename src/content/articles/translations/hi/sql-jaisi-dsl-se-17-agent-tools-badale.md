---
title: "मैंने 17 एजेंट टूल्स की जगह एक SQL-जैसी DSL क्यों बनाई"
date: 2026-04-11
slug: "sql-jaisi-dsl-se-17-agent-tools-badale"
description: "Flashcards Open Source App में 17 एजेंट टूल्स समेटकर मैंने एक SQL-जैसी DSL एंडपॉइंट बनाई, ताकि आंतरिक और बाहरी LLM उसे जल्दी और आसानी से समझ सकें।"
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "AI एजेंट्स के लिए SQL-जैसी DSL",
  "AI एजेंट API डिज़ाइन",
  "LLM के लिए टूल-कॉलिंग API",
  "एजेंट्स के लिए एकल API endpoint",
  "LLM के लिए SQL API",
  "एजेंट्स के लिए domain-specific language",
  "एजेंट टूल्स का एकीकरण",
  "Flashcards Open Source App",
  "AI एजेंट query language",
  "LLM-friendly API design"
]
language: "hi"
originalArticle:
  language: "en"
  slug: "sql-like-dsl-for-ai-agents"
translations:
  - language: "en"
    slug: "sql-like-dsl-for-ai-agents"
  - language: "zh"
    slug: "yige-lei-sql-dsl-qudai-17-ge-agent-gongju"
  - language: "es"
    slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
  - language: "ar"
    slug: "istabdalat-17-adat-lilwukala-bi-dsl-shabih-bisql"
---

# मैंने 17 एजेंट टूल्स की जगह एक SQL-जैसी DSL क्यों बनाई

पिछले मंगलवार मैं Flashcards Open Source App के एजेंट दस्तावेज़ पढ़ रहा था, और वही परिचित बैकएंड इंजीनियर वाला क्षण फिर सामने आ गया: सब कुछ सुव्यवस्थित, type-safe, स्पष्ट और थोड़ा असहनीय लग रहा था।

मेरे पास एजेंट्स के लिए 17 अलग-अलग टूल कॉल थे। `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`, फिर decks के लिए वही ढांचा, और उसके बाद tags, scheduler settings, workspace context, review history। कुछ भी टूटा हुआ नहीं था। यही सबसे खीझ पैदा करने वाली बात थी। सब ठीक से चल रहा था।

मुश्किल बस यह थी कि पूरा इंटरफ़ेस ठीक उसी तरह शोरभरा हो गया था, जैसे LLM APIs अक्सर हो जाती हैं। कोई मानव इंजीनियर दस्तावेज़ एक बार सरसरी तौर पर पढ़कर क्लाइंट बना सकता है और आगे बढ़ सकता है। LLM के पास यह सुविधा नहीं होती। उसे उदाहरणों, विवरणों और त्रुटियों के सहारे उसी बाहरी सतह को बार-बार फिर सीखना पड़ता है। अगर आप एक साधारण मंशा को बहुत सारे tools में बाँट देते हैं, तो मॉडल हर बार उसकी कीमत चुकाता है।

यह वही एजेंट परत है जो [flashcards-open-source-app.com](https://flashcards-open-source-app.com/) के पीछे काम करती है, इसलिए मेरे लिए यह अहम था कि उसका बाहरी इंटरफ़ेस सीखना आसान हो, सिर्फ तकनीकी रूप से सही होना काफी नहीं था।

इसीलिए मैंने पूरी चीज़ को एक SQL-जैसी DSL एंडपॉइंट में समेट दिया।

Raw PostgreSQL नहीं। मैं इतना साहसी नहीं हूँ।

![17 अलग-अलग agent tools की जगह लेने वाला SQL-जैसा DSL endpoint](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 tools बहुत ज़्यादा थे

पुराने version में कुछ तार्किक संसाधनों के लिए पढ़ने और लिखने वाले काम अलग-अलग tools में बँटे हुए थे:

- workspace context
- scheduler settings
- tags
- cards
- due cards
- decks
- review history

बैकएंड की दृष्टि से देखें तो यह काफी सुथरा लगता है। हर tool एक ही काम करता है। हर स्कीमा स्पष्ट है। OpenAPI सम्मानजनक दिखता है। बिल्कुल वैसा कदम, जैसा कोई पारंपरिक बैकएंड इंजीनियर उठाता है।

एजेंट की दृष्टि से देखें तो यह कागजी झंझट है।

अगर मॉडल को "हाल में update हुई fast English cards" चाहिए, तो पहले उसे अंदाज़ा लगाना पड़ता है कि यह `list_cards`, `search_cards` या किसी और tool के अंतर्गत आता है। फिर उसे अनुरोध की संरचना याद रखनी पड़ती है। फिर pagination। फिर filtering। और अगर पढ़ने के बाद एक row update करनी हो, तो एक और tool चलाना पड़ता है।

इसे चलाया जा सकता है। मैंने चलाया भी।

बस मुझे यह पसंद आना बंद हो गया।

## क्या बदला

नया सार्वजनिक अनुबंध सिर्फ एक tool है:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

पढ़ने और साधारण बदलाव, दोनों के लिए वही endpoint।

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

पूरी बात यही है। आंतरिक और बाहरी एजेंट्स अब एक ही इंटरफ़ेस सीखते हैं, टूल नामों के छोटे संग्रहालय को नहीं।

पहले एजेंट को यह समझना पड़ता था कि किस काम के लिए कौन-सा tool मौजूद है।

अब वह ज़्यादातर सीधे काम से शुरू कर सकता है:

- मुझे cards दिखाओ
- tag से filter करो
- update time के हिसाब से sort करो
- यह field update करो
- ये rows delete करो

यह उस तरीके से कहीं बेहतर मेल खाता है, जिससे LLM वास्तव में systems को टटोलते हैं। वे कुछ कोशिश करते हैं, error पढ़ते हैं, फिर दोबारा कोशिश करते हैं। एक SQL-जैसी भाषा इस पूरे चक्र को 17 अलग-अलग tools की तुलना में कहीं बेहतर संभालती है।

## मैंने SQL क्यों चुना, कोई और JSON blob क्यों नहीं

मैंने SQL इसलिए नहीं चुना कि मैं अपने product को database client बनाना चाहता था।

मैंने SQL इसलिए चुना क्योंकि लगभग हर ठीक-ठाक LLM के पास इसका पहले से मजबूत पूर्व-ज्ञान होता है। मॉडल को मोटे तौर पर पता होता है कि `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` और `LIMIT` से क्या होना चाहिए। इससे बहुत-सी व्याख्या बच जाती है।

अगर मैं अपनी custom JSON DSL बना देता, तो मॉडल को मेरी क्रियाएँ, मेरी nesting, मेरे filters, मेरी अपवाद-स्थितियाँ, और उस हफ्ते naming करते समय मेरा जो भी मूड रहा हो, सब सीखना पड़ता। अगर मैं उसे SQL-जैसा आकार दूँ, तो वह अक्सर पहली कोशिश में ही सही जवाब के काफी करीब पहुँच जाता है।

यहाँ तक कि जब query गलत होती है, तब भी वह अक्सर उपयोगी तरीके से गलत होती है। आम तौर पर गलती इनमें से एक होती है:

- गलत कॉलम नाम
- असमर्थित क्लॉज़
- `ORDER BY` छूट जाना
- `LIMIT` बहुत बड़ा होना

यह उस विफलता-स्थिति से कहीं बेहतर है जिसमें "गलत tool call कर दिया, अनुरोध की संरचना भी गलत थी, और अब आधा विनिर्देश फिर से पढ़ना पड़ेगा।"

मुझे कुछ ऐसा चाहिए था जिसे मॉडल पहले से आधा बोलना जानता हो, और फिर बार-बार कोशिश करके उसे साफ कर सके। SQL इस काम में बहुत अच्छा है।

## सबसे ज़रूरी बात: यह PostgreSQL नहीं है

इस design का सबसे अहम हिस्सा यह है कि endpoint **क्या नहीं** करता।

यह real database पर raw SQL execute नहीं करता।

यह SQL-जैसी string को parse करता है, प्रकाशित व्याकरण के अनुसार validate करता है, और उसे उन्हीं internal operations में compile करता है जिनका product पहले से इस्तेमाल करता है। SQL string सार्वजनिक DSL है। यह storage तक जाने वाली सुरंग नहीं है।

इससे मैं वास्तविक domain behavior को वहीं रख सकता हूँ, जहाँ उसे होना चाहिए:

- workspace scope server पर inject होता है
- system fields readable हो सकते हैं, writable नहीं
- sync metadata internal रहता है
- domain invariants असली handlers में ही रहते हैं
- storage बाद में बदला जा सकता है, बिना सार्वजनिक अनुबंध तोड़े

यही वह रेखा थी जिसे मैं पार नहीं करना चाहता था। Flashcards Open Source App offline-first है और sync-aware भी। मैं नहीं चाहता कि agents raw tables mutate करें और उसे product API समझ लें।

इसलिए अनुबंध साफ है: बाहर से SQL-जैसा, अंदर से domain-safe।

## व्याकरण मेरी उम्मीद से भी छोटा निकला

Version one जान-बूझकर छोटा है:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

शुरू में मुझे लगा था कि मैं तार्किक संसाधनों की लंबी list रखूँगा। फिर मैंने उसे भी घटा दिया।

आखिर में सार्वजनिक इंटरफ़ेस को मुख्य संज्ञाओं के करीब रखा:

- `cards`
- `decks`
- `workspace`
- `review_events`

इस बदलाव ने पूरी चीज़ को और साफ कर दिया।

`tags_summary`, `due_cards` या दूसरे pre-shaped views जैसे extra resources publish करने के बजाय, मैंने भाषा में query करने की थोड़ी और क्षमता जोड़ दी। खास तौर पर `GROUP BY` और कुछ aggregate functions।

इससे मॉडल सीधे summaries माँग सकता है, बजाय इसके कि वह हर summary shape के लिए अलग tool या resource सीखे, जिसे मैंने पिछले महीने expose किया हो।

उदाहरण के लिए, अब यह संभव है:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

या:

```sql
SELECT rating, COUNT(*) AS reviews
FROM review_events
GROUP BY rating
ORDER BY reviews DESC
LIMIT 10 OFFSET 0;
```

हर छोटी reporting ज़रूरत के लिए अलग endpoints बनाए रखने की तुलना में यह कहीं सरल है।

यह व्याकरण अब भी सीमित है। मैं "full Postgres" होने का नाटक नहीं कर रहा।

मैं जिन चीज़ों का समर्थन नहीं करता:

- `JOIN`
- `CTE`
- subqueries
- multi-statement execution
- arbitrary functions
- internal tables तक सीधी पहुँच
- protected system fields पर direct writes

यह प्रतिबंधित लगता है क्योंकि यह सचमुच प्रतिबंधित है। अच्छा है। यही बात इसे ईमानदार और संभालने योग्य बनाए रखती है।

## नए इंटरफ़ेस पर कुछ queries

Cards पढ़ना:

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

Tag के हिसाब से grouped cards पढ़ना:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

Decks बनाना:

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

Cards update करना:

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

Cards delete करना:

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

Review event counts पढ़ना:

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

यह पुराने tool catalog के बड़े हिस्से को समेट लेता है, बिना एजेंट को app के हर noun और हर summary shape के लिए अलग endpoint याद करवाए।

एक अच्छा सह-लाभ यह भी है कि दस्तावेज़ छोटे हो जाते हैं। अब मुझे बीस अलग-अलग अनुरोध संरचनाएँ समझाने की ज़रूरत नहीं है। मैं एक छोटा व्याकरण, दस examples दिखा सकता हूँ, और मॉडल को करके सीखने दे सकता हूँ।

## परेशान करने वाला हिस्सा, जिसे मैंने फिर भी रखा

यह design सरल है, लेकिन कोई जादू नहीं है।

सबसे ईमानदार नुकसान यह है कि जैसे ही आप "SQL-जैसा" कहते हैं, लोग real SQL habits लेकर आएँगे। उनमें से कुछ काम करेंगी। कुछ नहीं करेंगी। Product को तब बहुत साफ़ ढंग से बताना पड़ता है कि query समर्थित व्याकरण से बाहर चली गई है।

मैंने एक और समझौता किया है जिसे database purists पसंद नहीं करेंगे: v1 cursor pagination की जगह सीधे SQL में `LIMIT` और `OFFSET` इस्तेमाल करता है।

मुझे इसका नुकसान पता है। Requests के बीच data बदल जाए तो pages खिसक सकते हैं। Cursor pagination ज़्यादा सुरक्षित है।

फिर भी मैंने इस इंटरफ़ेस के लिए `OFFSET` चुना, क्योंकि यह एजेंट बनाने वालों के लिए आसान है, examples में दिखाना आसान है, और मॉडल के लिए अतिरिक्त प्रोटोकॉल-ज्ञान के बिना generate करना आसान है। इस API में मेरे लिए पहली बार इस्तेमाल की सादगी, लगातार बदलते data पर बिल्कुल सही pagination behavior से ज़्यादा महत्वपूर्ण है।

अगर यह समझौता व्यवहार में परेशानी देने लगे, तो मैं बाद में प्रकाशित भाषा बदल सकता हूँ। अभी के लिए सादगी जीतती है।

## असली जीत कम endpoints नहीं थी

असली गहरी जीत यह थी कि API अब उस तरीके से मेल खाती है, जिससे भाषा मॉडल स्वाभाविक रूप से systems को परखते हैं।

उन्हें हर tool का संग्रहालय-भ्रमण नहीं चाहिए। उन्हें एक ऐसी जगह चाहिए जहाँ वे कोई मंशा आज़मा सकें और गलत होने पर उपयोगी error मिल सके।

इसीलिए यह पिछली version से बेहतर महसूस होता है। यह सिर्फ छोटा नहीं है। इसका अनुमान लगाना आसान है।

एजेंट products के लिए, अनुमान-योग्य होना अक्सर सुंदर आंतरिक architecture से ज़्यादा काम का निकलता है।

## मैं यह तरीका कहाँ नहीं लागू करूँगा

अगर आपका product बहुत हद तक ऐसे जटिल domain verbs पर निर्भर करता है जो CRUD-जैसे नहीं हैं, तो मैं यह तरीका इस्तेमाल नहीं करूँगा।

अगर असली action `submit_review`, `run_scheduler`, या `merge_learning_state` जैसा कुछ है, तो हर चीज़ को `UPDATE` बनाकर दिखाना आम तौर पर API को और खराब कर देता है। ऐसे मामलों में मैं complex operations के लिए explicit commands रखूँगा, और SQL-जैसी DSL को broad read layer, CRUD, और lightweight reporting के लिए इस्तेमाल करूँगा।

यहीं कई टीमें गलती करती हैं। या तो वे raw storage expose कर देती हैं, जो लापरवाही है, या हर छोटी operation को custom endpoint में wrap कर देती हैं, जो थका देने वाला है।

काम का बीच का उपयोगी रास्ता यह है:

- broad data access के लिए SQL-जैसी DSL
- domain-heavy actions के लिए explicit commands

यह विभाजन दोनों extremes से कहीं ज़्यादा यथार्थवादी लगता है।

## मुझे यह दिशा क्यों पसंद है

इसका छोटा version बहुत सरल है।

मैंने tools की फैली हुई catalog को एक ऐसी query language से बदल दिया जिसे ज़्यादातर LLM पहले से आधा बोलना जानते हैं।

इंजीनियरिंग वाला version बस थोड़ा अधिक नीरस है:

मैंने वास्तविक backend architecture, sync behavior और invariants को वहीं रखा जहाँ वे पहले थे, और ऊपर सिर्फ एक पतला, ज़्यादा सीखने योग्य अनुबंध रख दिया।

मुझे यह सही विभाजन लगता है।

अगर आप agents के लिए APIs बना रहे हैं, तो मैं "इंसानों के लिए सबसे साफ OpenAPI इंटरफ़ेस क्या है?" से शुरुआत नहीं करूँगा। मैं "मॉडल सबसे कम दस्तावेज़ और सबसे कम retries के साथ जल्दी क्या समझ सकता है?" से शुरुआत करूँगा।

कभी-कभी जवाब कोई नया endpoint नहीं होता।

कभी-कभी जवाब एक छोटी भाषा होती है।

अगर आप product देखना चाहते हैं, तो वह यहाँ है: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

अगर आप code देखना चाहते हैं, तो GitHub project यहाँ है: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). यह मेरा MIT-licensed open-source project है।
