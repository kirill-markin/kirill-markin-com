---
title: "मैंने 17 एजेंट टूल्स को एक SQL-जैसी DSL से क्यों बदल दिया"
date: 2026-04-11
slug: "sql-jaisi-dsl-se-17-agent-tools-badale"
description: "मैंने Flashcards Open Source App में 17 एजेंट टूल्स को समेटकर एक SQL-जैसे DSL endpoint में कैसे बदला, जिसे internal और external LLM जल्दी सीख सकें।"
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "AI agents ke liye SQL-jaisi DSL",
  "AI agent API design",
  "LLM tool calling API",
  "agents ke liye single endpoint API",
  "LLM ke liye SQL API",
  "agents ke liye domain specific language",
  "agent tools consolidation",
  "Flashcards Open Source App",
  "AI agent query language",
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

# मैंने 17 एजेंट टूल्स को एक SQL-जैसी DSL से क्यों बदल दिया

पिछले मंगलवार मैं Flashcards Open Source App में हमारे agent docs पढ़ रहा था, और वही परिचित backend engineer वाला moment फिर सामने आ गया: सब कुछ साफ-सुथरा, typed, explicit और थोड़ा असहनीय लग रहा था।

मेरे पास agents के लिए 17 अलग-अलग tool calls थे। `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`, फिर decks के लिए वही pattern, उसके अलावा tags, scheduler settings, workspace context, review history। कुछ भी टूटा हुआ नहीं था। वही सबसे परेशान करने वाली बात थी। सब काम कर रहा था।

समस्या बस इतनी थी कि यह ठीक उसी तरीके से noisy हो गया था, जैसे LLM APIs अक्सर noisy हो जाती हैं। एक human engineer docs एक बार skim करके client बना सकता है और आगे बढ़ सकता है। LLM के पास यह luxury नहीं होती। उसे examples, descriptions और errors से बार-बार वही surface फिर सीखना पड़ता है। अगर आप एक simple intent को बहुत सारे tools में बांट देते हैं, तो model हर बार उसकी कीमत चुकाता है।

यह वही agent layer है जो [flashcards-open-source-app.com](https://flashcards-open-source-app.com/) के पीछे काम कर रही है, इसलिए मुझे इस बात की काफी परवाह थी कि external surface सीखने में आसान हो, सिर्फ technically correct होना काफी नहीं था।

इसलिए मैंने पूरी चीज़ को एक SQL-जैसे DSL endpoint में समेट दिया।

Raw PostgreSQL नहीं। मैं इतना बहादुर नहीं हूं।

![17 अलग-अलग agent tools की जगह लेने वाला SQL-जैसा DSL endpoint](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 tools बहुत ज़्यादा थे

पुराने version में कुछ logical resources के लिए read और write अलग tools में बंटे हुए थे:

- workspace context
- scheduler settings
- tags
- cards
- due cards
- decks
- review history

Backend की तरफ से देखें तो यह काफ़ी tidy है। हर tool एक काम करता है। हर schema explicit है। OpenAPI respectable दिखता है। बिल्कुल classic backend engineer move।

Agent की तरफ से देखें तो यह paperwork है।

अगर model को "हाल में update हुई fast English cards" चाहिए, तो पहले उसे अंदाज़ा लगाना पड़ता है कि यह `list_cards`, `search_cards` या किसी और चीज़ में आता है। फिर उसे payload shape याद रखनी पड़ती है। फिर pagination। फिर filtering। फिर अगर पढ़ने के बाद एक row update करनी हो, तो दूसरा tool।

इसे चलाया जा सकता है। मैंने चलाया भी।

बस मुझे यह पसंद आना बंद हो गया।

## क्या बदला

नया public contract सिर्फ एक tool है:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

Read और simple write दोनों के लिए वही endpoint।

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

पूरी बात यही है। Internal agents और external agents अब एक ही surface सीखते हैं, tool names के छोटे museum को नहीं।

पहले agent को यह समझना पड़ता था कि किस काम के लिए कौन-सा tool मौजूद है।

अब वह ज़्यादातर सीधे काम से शुरू कर सकता है:

- मुझे cards दिखाओ
- tag से filter करो
- update time से sort करो
- यह field update करो
- ये rows delete करो

यह उस तरीके से कहीं बेहतर मेल खाता है, जिससे LLM वास्तव में systems को probe करते हैं। वे कुछ try करते हैं, error पढ़ते हैं, फिर दोबारा try करते हैं। एक single SQL-जैसी language इस loop को 17 अलग tools की तुलना में बहुत बेहतर संभालती है।

## मैंने SQL क्यों चुना, कोई दूसरा JSON blob क्यों नहीं

मैंने SQL इसलिए नहीं चुना कि मैं अपने product को database client बनाना चाहता था।

मैंने SQL इसलिए चुना क्योंकि लगभग हर decent LLM के पास इसका पहले से एक बड़ा prior है। Model को लगभग पता होता है कि `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` और `LIMIT` का क्या मतलब होना चाहिए। इससे काफी explanation बचती है।

अगर मैं अपना custom JSON DSL बना दूं, तो model को मेरे verbs, मेरी nesting, मेरे filters, मेरे edge cases, और उस हफ्ते naming करते समय मेरा mood सब सीखना पड़ेगा। अगर मैं उसे SQL-जैसा shape दूं, तो वह अक्सर पहले try में ही काफ़ी करीब पहुंच जाता है।

यहां तक कि जब query गलत होती है, तब भी वह अक्सर useful तरीके से गलत होती है। आम तौर पर गलती इनमें से एक होती है:

- गलत column name
- unsupported clause
- `ORDER BY` missing
- `LIMIT` बहुत बड़ा

यह उस failure mode से कहीं बेहतर है जिसमें "गलत tool call कर दिया, payload shape भी गलत थी, और अब आधी spec फिर से पढ़नी पड़ेगी।"

मुझे कुछ ऐसा चाहिए था जिसे model पहले से आधा बोलना जानता हो, और फिर try-retry से साफ कर सके। SQL इस काम में बहुत अच्छा है।

## सबसे ज़रूरी बात: यह PostgreSQL नहीं है

इस design का सबसे ज़रूरी हिस्सा यह है कि endpoint **क्या नहीं** करता।

यह real database के खिलाफ raw SQL execute नहीं करता।

यह SQL-जैसी string को parse करता है, published grammar के खिलाफ validate करता है, और उसे उन्हीं internal operations में compile करता है जो product पहले से इस्तेमाल करता है। SQL string public DSL है। यह storage तक जाने वाली सुरंग नहीं है।

इससे मैं real domain behavior को वहीं रख सकता हूं जहां उसे होना चाहिए:

- workspace scope server पर inject होता है
- system fields readable हो सकते हैं, writable नहीं
- sync metadata internal रहता है
- domain invariants real handlers में ही रहते हैं
- storage बाद में बदल सकता है बिना public contract तोड़े

यही वह line थी जिसे मैं पार नहीं करना चाहता था। Flashcards Open Source App offline-first है और sync-aware भी। मैं नहीं चाहता कि agents raw tables mutate करें और उसे product API मान लें।

इसलिए contract ईमानदार है: बाहर से SQL-जैसा, अंदर से domain-safe।

## Grammar मेरी उम्मीद से भी छोटी निकली

Version one जान-बूझकर छोटा है:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

शुरू में मुझे लगा था कि मैं logical resources की लंबी list रखूंगा। फिर मैंने उसे भी काट दिया।

आख़िर में public surface को core nouns के करीब रखा:

- `cards`
- `decks`
- `workspace`
- `review_events`

इस बदलाव ने पूरी चीज़ को साफ़ कर दिया।

`tags_summary`, `due_cards` या दूसरे pre-shaped views जैसे extra resources publish करने के बजाय, मैंने language में थोड़ी query power और जोड़ दी। खास तौर पर `GROUP BY` और कुछ aggregate functions।

इससे model सीधे summaries मांग सकता है, बजाय इसके कि वह हर summary shape के लिए अलग tool या resource सीखे जिसे मैंने पिछले महीने expose किया हो।

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

हर छोटे reporting use case के लिए dedicated endpoints बनाए रखने से यह कहीं सरल है।

Grammar अब भी सीमित है। मैं "full Postgres" होने का नाटक नहीं कर रहा।

मैं जिन चीज़ों को support नहीं करता:

- `JOIN`
- `CTE`
- subqueries
- multi-statement execution
- arbitrary functions
- internal tables तक direct access
- protected system fields पर direct writes

यह restrictive लगता है क्योंकि यह restrictive है। अच्छा है। यही चीज़ इसे ईमानदार और maintainable बनाती है।

## नई surface पर कुछ queries

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

यह पुराने tool catalog के बड़े हिस्से को cover कर देता है, बिना agent को हर noun और हर summary shape के लिए अलग endpoint याद करवाए।

एक अच्छा side effect यह भी है कि docs छोटी हो जाती हैं। अब मुझे बीस payload shapes समझाने की ज़रूरत नहीं है। मैं एक छोटी grammar, दस examples दिखा सकता हूं, और model को practice से सीखने दे सकता हूं।

## परेशान करने वाला हिस्सा, जिसे मैंने फिर भी रखा

यह design सरल है, लेकिन जादू नहीं है।

सबसे ईमानदार downside यह है कि जैसे ही आप "SQL-जैसा" कहते हैं, लोग real SQL habits लेकर आएंगे। उनमें से कुछ काम करेंगी। कुछ नहीं करेंगी। Product को तब बहुत साफ़ बोलना पड़ता है जब कोई query supported grammar से बाहर चली जाए।

मैंने एक और tradeoff लिया है जिसे database purists पसंद नहीं करेंगे: v1 cursor pagination की जगह सीधे SQL में `LIMIT` और `OFFSET` इस्तेमाल करता है।

मुझे downside पता है। Requests के बीच data बदल जाए तो pages drift कर सकते हैं। Cursor pagination ज़्यादा सुरक्षित है।

फिर भी मैंने इस surface के लिए `OFFSET` चुना, क्योंकि यह agent authors के लिए आसान है, examples में दिखाना आसान है, और model के लिए extra protocol knowledge के बिना generate करना आसान है। इस API के लिए first-use simplicity मेरे लिए moving data पर perfect pagination behavior से ज़्यादा महत्वपूर्ण है।

अगर यह tradeoff practice में दर्द देने लगे, तो मैं बाद में published language बदल सकता हूं। अभी के लिए, simplicity जीतती है।

## असली जीत कम endpoints नहीं थी

अंदर की बड़ी जीत यह थी कि API अब उस तरीके से मेल खाती है जिससे language models स्वाभाविक रूप से systems को explore करते हैं।

उन्हें हर tool का museum tour नहीं चाहिए। उन्हें एक ऐसी जगह चाहिए जहां वे intent आज़मा सकें और गलत होने पर useful error मिल सके।

इसीलिए यह पिछली version से बेहतर महसूस होता है। यह सिर्फ छोटा नहीं है। यह ज़्यादा guessable है।

Agent products के लिए, guessable होना अक्सर elegant internal architecture से ज़्यादा काम का निकलता है।

## मैं यह pattern कहां नहीं थोपता

अगर product बहुत हद तक ऐसे complex domain verbs पर निर्भर करता है जो CRUD-जैसे नहीं हैं, तो मैं यह approach इस्तेमाल नहीं करूंगा।

अगर असली action `submit_review`, `run_scheduler`, या `merge_learning_state` जैसा कुछ है, तो हर चीज़ को `UPDATE` बनाकर दिखाना आम तौर पर API को खराब कर देता है। ऐसे मामलों में मैं complex operations के लिए explicit commands रखूंगा, और SQL-जैसी DSL को broad read layer, CRUD और lightweight reporting के लिए इस्तेमाल करूंगा।

यहीं कई teams उल्टा कर बैठती हैं। या तो वे raw storage expose कर देती हैं, जो reckless है, या हर छोटी operation को custom endpoint में wrap कर देती हैं, जो exhausting है।

उपयोगी middle ground यह है:

- broad data access के लिए SQL-जैसी DSL
- domain-heavy actions के लिए explicit commands

यह split दोनों extremes से कहीं ज़्यादा यथार्थवादी लगता है।

## मुझे यह दिशा क्यों पसंद है

छोटा version बहुत सरल है।

मैंने tools की चौड़ी catalog को एक ऐसी query language से बदल दिया जिसे ज़्यादातर LLM पहले से आधा बोलना जानते हैं।

Engineering version बस थोड़ा ज़्यादा boring है:

मैंने real backend architecture, sync behavior और invariants को वहीं रखा जहां वे पहले थे, और ऊपर सिर्फ एक पतला और ज़्यादा learnable contract रख दिया।

मुझे यह सही split लगता है।

अगर आप agents के लिए APIs बना रहे हैं, तो मैं "इंसानों के लिए सबसे साफ़ OpenAPI surface क्या है?" से शुरू नहीं करूंगा। मैं "model सबसे कम docs और सबसे कम retries के साथ जल्दी क्या infer कर सकता है?" से शुरू करूंगा।

कभी-कभी जवाब कोई नया endpoint नहीं होता।

कभी-कभी जवाब एक छोटी भाषा होती है।

अगर आप product देखना चाहते हैं, तो वह यहां है: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

अगर आप code देखना चाहते हैं, GitHub project यहां है: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). यह मेरा MIT-licensed open-source project है।
