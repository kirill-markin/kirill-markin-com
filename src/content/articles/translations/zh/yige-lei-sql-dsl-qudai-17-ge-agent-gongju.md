---
title: "为什么我用一个类 SQL DSL 替换了 17 个 Agent 工具，并把接口收敛成一个更易学的统一入口"
date: 2026-04-11
slug: "yige-lei-sql-dsl-qudai-17-ge-agent-gongju"
description: "我如何把 Flashcards Open Source App 里的 17 个 agent 工具压缩成一个类 SQL DSL 端点，让内部与外部 LLM 都能用更少文档、更少重试去完成查询、更新、删除与汇总操作，同时保持接口统一、更容易学习，也更符合模型自然试错的工作方式与推断习惯。"
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "AI agent 的类 SQL DSL",
  "AI agent API 设计",
  "LLM 工具调用 API",
  "agent 单端点 API",
  "面向 LLM 的 SQL API",
  "agent 领域特定语言",
  "agent 工具整合",
  "Flashcards Open Source App",
  "AI agent 查询语言",
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

# 为什么我用一个类 SQL DSL 替换了 17 个 Agent 工具

上周二，我在看 Flashcards Open Source App 里的 agent 文档时，又碰到了那种很典型的后端工程师时刻：一切看起来都很整齐、强类型、显式，而且有点让人受不了。

我给 agent 准备了 17 个独立的工具调用。`list_cards`、`get_cards`、`search_cards`、`list_due_cards`、`create_cards`、`update_cards`、`delete_cards`，然后 deck 再来一遍同样的模式，再加上 tags、scheduler 设置、workspace 上下文、review history。没有任何东西坏掉。烦人的地方恰恰就在这里。一切都能用。

只是它吵得厉害，而且正是 LLM API 最容易变吵的那种方式。人类工程师可以把文档扫一遍，写个 client，然后继续往前走。LLM 没有这种奢侈。它得从示例、描述和报错里反复重学这层接口。如果你把一个简单意图拆散到太多工具里，模型每次都得为此付费。

这套 agent 层服务的是 [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)，所以我很在意对外暴露的表面是否容易学会，而不只是技术上正确。

于是我把整套东西收敛成了一个类 SQL DSL 端点。

不是原生 PostgreSQL。还没勇到那个程度。

![用类 SQL DSL 端点替换 17 个独立 agent 工具](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 个工具真的太多了

旧版本针对几个逻辑资源，把读写拆成了不同工具：

- workspace 上下文
- scheduler 设置
- tags
- cards
- due cards
- decks
- review history

从后端角度看，这很工整。每个工具只做一件事。每个 schema 都很显式。OpenAPI 看起来也很体面。非常经典的后端工程师动作。

但从 agent 角度看，这就是文书工作。

如果模型想要“最近更新过的快速英语卡片”，它首先得猜这到底应该归到 `list_cards`、`search_cards` 还是别的什么。然后它得记住 payload 的结构。接着是分页。接着是过滤。最后如果它想在读完后更新一行，还得再调第二个工具。

这些都能做通。我也确实做通了。

我只是后来不喜欢它了。

## 改了什么

新的公开契约只有一个工具：

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

读和简单写都走同一个端点。

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

重点就这么简单。现在无论内部 agent 还是外部 agent，要学习的都是同一层表面，而不是一小座工具名博物馆。

以前，agent 必须先弄清楚某件事到底对应哪个工具。

现在它基本可以直接从任务本身出发：

- 给我看 cards
- 按 tag 过滤
- 按更新时间排序
- 更新这个字段
- 删除这些行

这和 LLM 实际探索系统的方式更贴合。它们会先试一下，读报错，再重试。一个统一的类 SQL 语言，比 17 个分离工具更适合这个循环。

## 为什么我选 SQL，而不是再发明一个 JSON blob

我选 SQL，不是因为我想把产品做成数据库客户端。

我选 SQL，是因为几乎所有还不错的 LLM 对它都已经有很强的先验。模型大致已经知道 `SELECT`、`UPDATE`、`WHERE`、`ORDER BY` 和 `LIMIT` 应该做什么。这能省掉很多解释。

如果我自己发明一个 JSON DSL，模型就得去学我的动词、我的嵌套方式、我的过滤器、我的边界情况，以及我那周命名时的心情。如果我给它一个类 SQL 的形状，它通常第一下就能落在比较接近正确答案的位置。

即使它写错查询，错法往往也比较有用。通常会是下面这些：

- 列名写错
- 使用了不支持的子句
- 少了 `ORDER BY`
- `LIMIT` 太大

这可比“调用错了工具、payload 结构也错了、现在还得回去重读半份规范”要好得多。

我想要的是一种模型本来就会半说半懂的东西，然后再通过试错修正。SQL 在这件事上很合适。

## 关键点：这不是 PostgreSQL

这个设计最重要的地方，是这个端点**不会**做什么。

它不会把原始 SQL 直接丢到真实数据库里执行。

它会解析这段类 SQL 字符串，按照公开语法做校验，然后编译成产品原本就在使用的那套内部操作。SQL 字符串只是公开 DSL。它不是通往底层存储的隧道。

这样我就能把真实的领域行为留在它该在的位置：

- workspace 范围由服务端注入
- 系统字段可以读，但不能写
- 同步元数据保持内部状态
- 领域不变量仍然留在真实 handler 里
- 以后即使存储层变化，也不会破坏公开契约

这是我不想跨过去的那条线。Flashcards Open Source App 是 offline-first，而且有同步语义。我不想让 agent 直接改原始表，然后假装那就是产品 API。

所以这个契约是诚实的：外面长得像 SQL，里面仍然是领域安全的。

## 语法最终比我预想的还要小

第一版是刻意做小的：

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

一开始我还以为会保留更长的一串逻辑资源列表。后来连这个我也砍了。

最后我让公开表面尽量贴近核心名词：

- `cards`
- `decks`
- `workspace`
- `review_events`

这个变化让整个东西干净了很多。

我没有再发布 `tags_summary`、`due_cards` 这种额外资源，或者其他预先塑形过的视图，而是给这门语言本身多加了一点查询能力。最重要的是 `GROUP BY` 和一些聚合函数。

这样模型就能直接请求摘要，而不用为我上个月碰巧暴露出来的每一种摘要形状，再去学一个单独的工具或资源。

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

这比为每一个小报表需求维护专门端点简单多了。

语法依然是受限的。我并不想伪装成“完整版 Postgres”。

我不支持的东西包括：

- `JOIN`
- `CTE`
- 子查询
- 多语句执行
- 任意函数
- 直接访问内部表
- 直接写入受保护的系统字段

它听起来很受限，因为它本来就很受限。很好。这正是让这套东西保持诚实、可维护的原因。

## 新表面上的几个查询示例

读取 cards：

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

按 tag 分组读取 cards：

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

创建 decks：

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

更新 cards：

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

删除 cards：

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

读取 review event 计数：

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

这已经覆盖了旧工具目录里的很大一部分能力，而且不需要 agent 为每个名词、每种摘要形状都去记一个独立端点。

一个不错的副作用是，文档也更短了。我不再需要解释二十种 payload 结构。我可以给出一小段语法、十个示例，然后让模型边做边学。

## 那个烦人的地方，我还是保留了

这个设计更简单，但它不是魔法。

这里最真实的缺点是，只要你说“类 SQL”，人们就会尝试带入真正的 SQL 习惯。其中一部分会生效，一部分不会。产品必须在查询超出支持语法时给出非常直接的反馈。

我还做了一个数据库纯粹主义者会不喜欢的取舍：v1 直接在 SQL 里使用 `LIMIT` 和 `OFFSET`，而不是 cursor pagination。

我知道缺点。请求之间如果数据发生变化，分页结果可能会漂移。cursor pagination 更稳。

我还是为这层表面选择了 `OFFSET`，因为它对 agent 作者更容易理解，更容易写进示例，也更容易让模型在没有额外协议知识的情况下生成。对这个 API 来说，我更在乎首次使用时的简单性，而不是动态数据上的完美分页行为。

如果这个取舍在实践里开始带来明显问题，我以后可以再修改公开语言。现在，简单更重要。

## 真正的收益并不是端点更少

更深层的收益是，这个 API 现在更符合语言模型天然探索系统的方式。

它们不想参观一整座工具博物馆。它们想要一个地方，先试一个意图，如果猜错了就拿到有用的错误。

这就是为什么它比旧版本感觉更好。它不只是更小。它更容易猜。

对 agent 产品来说，很多时候“容易猜”比“内部架构优雅”更重要。

## 我不会在哪些地方硬套这个模式

如果一个产品严重依赖那些不属于 CRUD 形状的复杂领域动词，我不会用这种方式。

如果真正的动作是 `submit_review`、`run_scheduler` 或 `merge_learning_state` 这类东西，硬把一切都伪装成 `UPDATE`，通常只会让 API 变得更差。那种情况下，我会把复杂操作保留为显式命令，同时把类 SQL DSL 用在宽泛读取层、CRUD 和轻量报表上。

很多团队恰恰是在这里做反了。要么他们直接暴露原始存储，这很鲁莽；要么他们把每个很小的操作都包成一个自定义端点，这很折磨人。

真正有用的中间地带是：

- 用类 SQL DSL 处理宽泛的数据访问
- 用显式命令处理领域重量级动作

这比两个极端都更现实。

## 为什么我喜欢这个方向

短版很简单。

我把一长串工具目录，换成了一门大多数 LLM 已经会半说半懂的查询语言。

工程版只是稍微无聊一点：

我把真实的后端架构、同步行为和不变量原样保留在原来的位置，然后在上面套了一层更薄、更容易学会的契约。

对我来说，这就是正确的分层。

如果你在给 agent 构建 API，我不会从“对人类来说最干净的 OpenAPI 表面是什么”开始。我会从“模型用最少文档、最少重试，可以最快推断出什么”开始。

有时候答案不是再加一个端点。

有时候答案是一门小语言。

如果你想看这个产品本身，在这里：[flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

如果你想看代码，GitHub 项目在这里：[github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app)。这是我的 MIT 许可开源项目。
