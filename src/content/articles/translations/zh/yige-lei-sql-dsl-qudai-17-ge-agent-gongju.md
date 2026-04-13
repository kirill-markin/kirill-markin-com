---
title: "为什么我在 Flashcards Open Source App 里用 SQL 风格 DSL 替掉了 17 个智能体工具"
date: 2026-04-11
slug: "yige-lei-sql-dsl-qudai-17-ge-agent-gongju"
description: "我在 Flashcards Open Source App 里把 17 个分散的智能体工具收敛成一个 SQL 风格的 DSL 接口，让内部和外部 LLM 更容易学会查询、更新、删除、过滤和汇总，也让这套面向智能体的 API 更一致、更好教、更少噪音，并显著降低文档维护和工具选择成本。"
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "SQL 风格 DSL",
  "智能体 API 设计",
  "LLM 工具调用 API",
  "单接口 API",
  "面向 LLM 的 DSL",
  "智能体查询语言",
  "Flashcards Open Source App",
  "LLM 友好的 API 设计"
]
language: "zh"
originalArticle:
  language: "en"
  slug: "sql-like-dsl-for-ai-agents"
translations:
  - language: "en"
    slug: "sql-like-dsl-for-ai-agents"
  - language: "hi"
    slug: "sql-jaisi-dsl-se-17-agent-tools-badale"
  - language: "es"
    slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
  - language: "ar"
    slug: "istabdalat-17-adat-lilwukala-bi-dsl-shabih-bisql"
---

# 为什么我用一种 SQL 风格的 DSL 替掉了 17 个智能体工具

上周二，我在重读 Flashcards Open Source App 的智能体文档时，又撞上了那种熟悉的后端工程师时刻：一切都很规整、类型齐全、定义明确，同时也让人有点受不了。

我当时给智能体准备了 17 个分开的工具调用：`list_cards`、`get_cards`、`search_cards`、`list_due_cards`、`create_cards`、`update_cards`、`delete_cards`，卡组也是同样一套模式，再加上标签、调度设置、工作区上下文和复习历史。没有哪里坏掉。麻烦恰恰就在这里：它们全都能正常工作。

只是这种设计会制造一种很典型的 LLM API 噪音。人类工程师可以扫一遍文档，写个客户端，然后继续往前走。LLM 没有这种奢侈。它得靠示例、说明和报错，一遍又一遍地重学这层接口。如果你把一个简单意图拆进太多工具里，模型每次都得重新为这件事买单。

这套智能体接口服务的就是 [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)，所以我很在意对外接口是不是足够容易让模型学会，而不只是技术上说得过去。

所以我把整套对外接口收成了一个 SQL 风格的 DSL 接口。

不是原生 PostgreSQL。我还没大胆到那个程度。

![用一个 SQL 风格的 DSL 接口取代 17 个独立的智能体工具](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 个工具实在太多了

旧版本把几个逻辑资源的读写拆成了不同工具：

- 工作区上下文
- 调度设置
- 标签
- 卡片
- 待复习卡片
- 卡组
- 复习历史

从后端视角看，这很工整。每个工具只做一件事。每份 schema 都写得明明白白。OpenAPI 看起来也像模像样。很典型的后端工程师做法。

但对智能体来说，这基本就是在填表。

如果模型想找“最近更新过的快速英语卡片”，它首先得猜这件事到底该落到 `list_cards`、`search_cards` 还是别的什么上。然后它得记住请求体长什么样。接着是分页。接着是过滤。最后，如果它想在读完之后更新一行，还得再调第二个工具。

这些都能跑通。我也确实把它做通了。

我只是后来不喜欢它了。

## 具体改了什么

新的对外约定只剩一个工具：

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

读操作和简单写操作都走同一个接口。

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

核心变化就这么简单。现在无论内部智能体还是外部智能体，要学的都是同一套调用方式，而不是一整排工具名。

以前，智能体得先搞清楚某件事到底该调用哪个工具。

现在它基本可以直接从任务本身出发：

- 列出卡片
- 按标签过滤
- 按更新时间排序
- 更新这个字段
- 删除这些行

这更符合 LLM 实际摸索系统的方式。它会先试一下，读报错，再重试。一门统一的 SQL 风格语言，比 17 个彼此分离的工具更适合这个循环。

## 为什么我选 SQL，而不是再造一套 JSON 结构

我选 SQL，不是因为我想把产品做成数据库客户端。

我选 SQL，是因为几乎所有靠谱的 LLM 对它都有现成的认知。模型大致已经知道 `SELECT`、`UPDATE`、`WHERE`、`ORDER BY` 和 `LIMIT` 是干什么的。这能省掉很多解释。

如果我自己发明一套 JSON DSL，模型就得重新去学我的动词、我的嵌套方式、我的过滤条件、我的边界情况，以及我那周写代码时的命名心情。如果我给它一个 SQL 风格的外形，它第一次通常就能猜到一个离正确答案不太远的结果。

即使它把查询写错，错法往往也还是有用的。通常会是下面这些：

- 列名写错
- 用了不支持的子句
- 少了 `ORDER BY`
- `LIMIT` 太大

这总比“工具调错了，请求体结构也错了，现在还得回去重读半份规范”强得多。

我想要的是一种模型本来就会一点、然后可以靠试错慢慢修正的东西。SQL 在这件事上非常合适。

## 关键点：这不是 PostgreSQL

这个设计最重要的地方，是这个接口**不会**做什么。

它不会把原始 SQL 直接丢到真实数据库里执行。

它会先解析这段 SQL 风格的字符串，按公开语法做校验，再把它编译成产品原本就在用的那套内部操作。SQL 字符串只是对外公开的 DSL，并不是直通底层存储的隧道。

这样一来，我就能把真正的领域约束留在它该待的位置：

- 工作区范围由服务端自动注入
- 系统字段可以读，但不能写
- 同步元数据仍然只在内部流转
- 领域不变量继续留在真正的处理逻辑里
- 以后即使存储层变化，也不会破坏公开契约

这是我不想跨过去的那条线。Flashcards Open Source App 是离线优先的，而且带有同步语义。我不想让智能体直接改原始数据表，然后假装那就是产品 API。

所以这个对外约定是诚实的：外面看起来像 SQL，里面仍然遵守产品本身的领域约束。

## 语法比我一开始想的还要小

第一版是故意做小的：

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

一开始我还以为自己会保留更长的一串逻辑资源。后来连这个我也砍掉了。

最后，对外接口只保留最核心的几个名词：

- `cards`
- `decks`
- `workspace`
- `review_events`

这个变化让整套东西干净了很多。

我没有再暴露 `tags_summary`、`due_cards` 这种额外资源，也没有继续增加那些预先封装好的视图，而是给这门语言本身补了一点查询能力。最重要的是 `GROUP BY` 和几个聚合函数。

这样模型就能直接要汇总结果，而不用为了我上个月碰巧暴露出来的每一种汇总方式，再去学一个独立的工具或资源。

比如现在就可以这样：

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

或者：

```sql
SELECT rating, COUNT(*) AS reviews
FROM review_events
GROUP BY rating
ORDER BY reviews DESC
LIMIT 10 OFFSET 0;
```

这比为了每一个小报表需求都单独维护一个接口简单多了。

这套语法依然是受限的。我并不想把它伪装成“完整版 Postgres”。

我不支持的东西包括：

- `JOIN`
- `CTE`
- 子查询
- 多语句执行
- 任意函数
- 直接访问内部表
- 直接写入受保护的系统字段

它听起来很受限，因为它本来就该受限。这样很好。这正是让这套东西保持诚实、可维护的原因。

## 新接口上的几个查询示例

读取卡片：

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

按标签分组读取卡片：

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

创建卡组：

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

更新卡片：

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

删除卡片：

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

查询复习事件计数：

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

这已经覆盖了旧工具清单里的很大一部分能力，而且不需要智能体为每个名词、每一种汇总结果都去记一个单独的接口。

另一个不错的副作用是，文档也变短了。我不再需要解释二十种请求体结构。我只要给出一小段语法、十个示例，然后让模型边做边学就够了。

## 那个麻烦，我还是留下了

这个设计更简单，但它不是魔法。

这里最真实的缺点是，只要你说自己是“SQL 风格”，人们就会按真正的 SQL 习惯来用。其中一部分会生效，一部分不会。只要查询超出了支持的语法范围，产品就必须给出非常直白的反馈。

我还做了一个数据库纯粹主义者大概不会喜欢的取舍：v1 直接在 SQL 里使用 `LIMIT` 和 `OFFSET`，而不是游标分页。

我知道缺点。请求之间如果数据发生变化，分页结果可能会漂移。游标分页更稳。

我还是给这层接口选了 `OFFSET`，因为它对智能体开发者更容易理解，更容易写进示例，也更容易让模型在没有额外协议知识的前提下生成。对这个 API 来说，我更在乎第一次上手时的简单性，而不是动态数据场景里的完美分页行为。

如果这个取舍在实践里开始带来明显问题，我以后可以再调整对外语法。现在，简单更重要。

## 真正的收益不只是接口变少了

更深层的收益是，这个 API 现在更符合语言模型天然探索系统的方式。

它们不想先参观一整座工具博物馆。它们想要的是一个地方，先试一个意图，如果猜错了就拿到一个有用的错误。

这就是为什么它比旧版本顺手得多。它不只是更小，而是更容易猜对。

对智能体产品来说，很多时候“更容易猜对”比“内部架构优雅”更重要。

## 我不会把这个模式硬套到所有地方

如果一个产品真正依赖的是那些不属于 CRUD 形状的复杂领域动作，我不会用这种方式。

如果真正的动作是 `submit_review`、`run_scheduler` 或 `merge_learning_state` 这类东西，硬把一切都伪装成 `UPDATE`，通常只会让 API 变得更差。那种情况下，我会把复杂操作继续保留成显式命令，同时把 SQL 风格的 DSL 用在通用读取层、CRUD 和轻量报表上。

很多团队恰恰是在这里走偏了。要么他们直接暴露原始存储，这很鲁莽；要么他们把每个很小的操作都包成一个自定义接口，这又很折磨人。

真正有用的中间地带是：

- 用 SQL 风格的 DSL 处理宽泛的数据访问
- 用显式命令处理领域负担更重的动作

这比两个极端都更现实。

## 为什么我喜欢这个方向

短版很简单：

我把一长串工具目录，换成了一门大多数 LLM 本来就会一点的查询语言。

工程版只是稍微无聊一点：

我没有动真实的后端架构、同步行为和不变量，只是在上面加了一层更薄、更容易学会的对外约定。

对我来说，这就是正确的分层。

如果你在给智能体设计 API，我不会从“对人类来说最干净的 OpenAPI 表面是什么”开始。我会从“模型靠最少文档、最少重试，最快能推断出什么”开始。

有时候答案不是再加一个端点。

有时候答案是一门小语言。

如果你想看这个产品本身，在这里：[flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

如果你想看代码，GitHub 项目在这里：[github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app)。这是我的 MIT 许可开源项目。
