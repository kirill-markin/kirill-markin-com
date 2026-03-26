---
title: "Why I Replaced 17 Agent Tools with One SQL-Like DSL"
date: 2026-03-12
description: "How I collapsed 17 agent tools in Flashcards Open Source App into one SQL-like DSL endpoint that internal and external LLMs can learn quickly."
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "SQL-like DSL for AI agents",
  "AI agent API design",
  "LLM tool calling API",
  "single endpoint API for agents",
  "SQL API for LLMs",
  "domain specific language for agents",
  "agent tools consolidation",
  "Flashcards Open Source App",
  "AI agent query language",
  "LLM-friendly API design"
]
language: "en"
---

# Why I Replaced 17 Agent Tools with One SQL-Like DSL

Last Tuesday I was reading through our agent docs in Flashcards Open Source App and hit that familiar backend-engineer moment: everything looked neat, typed, explicit, and slightly unbearable.

I had 17 separate tool calls for agents. `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`, then the same pattern again for decks, plus tags, scheduler settings, workspace context, review history. Nothing was broken. That was the annoying part. It all worked.

It was just noisy in exactly the way LLM APIs tend to get noisy. A human engineer can skim the docs once, build a client, and move on. An LLM does not get that luxury. It has to keep re-learning the surface from examples, descriptions, and errors. If you split one simple intent across too many tools, the model pays for that every time.

This is the agent layer behind [flashcards-open-source-app.com](https://flashcards-open-source-app.com/), so I cared quite a bit about keeping the external surface learnable, not just technically correct.

So I collapsed the whole thing into one SQL-like DSL endpoint.

Not raw PostgreSQL. I am not that brave.

![SQL-like DSL endpoint replacing 17 separate agent tools](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 tools was too many

The old version had separate tools for reads and writes across a few logical resources:

- workspace context
- scheduler settings
- tags
- cards
- due cards
- decks
- review history

From the backend side, this is tidy. Each tool does one thing. Each schema is explicit. OpenAPI looks respectable. Classic backend engineer move.

From the agent side, it is paperwork.

If the model wants "fast English cards updated recently," it first has to guess whether this belongs to `list_cards`, `search_cards`, or something else. Then it has to remember the payload shape. Then pagination. Then filtering. Then a second tool if it wants to update one row after reading it.

You can make that work. I did make it work.

I just stopped liking it.

## What changed

The new public contract is one tool:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

Same endpoint for reads and simple writes.

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

That is the whole point. Internal agents and external agents now learn one surface instead of a small museum of tool names.

Before, the agent had to figure out which tool existed for a job.

Now it can mostly start with the job itself:

- show me cards
- filter by tag
- sort by update time
- update this field
- delete these rows

That is a much better fit for how LLMs actually poke at systems. They try something, read the error, try again. A single SQL-like language handles that loop much better than 17 separate tools.

## Why I picked SQL and not another JSON blob

I did not pick SQL because I wanted to turn my product into a database client.

I picked SQL because almost every decent LLM already has a huge prior for it. The model already knows roughly what `SELECT`, `UPDATE`, `WHERE`, `ORDER BY`, and `LIMIT` are supposed to do. That saves a lot of explanation.

If I invent a custom JSON DSL, the model has to learn my verbs, my nesting, my filters, my edge cases, and whatever naming mood I was in that week. If I give it a SQL-like shape, it usually lands somewhere near the right answer on the first try.

Even when it gets the query wrong, it tends to get it wrong in a useful way. Usually it is one of these:

- wrong column name
- unsupported clause
- missing `ORDER BY`
- `LIMIT` too large

That is a much better failure mode than "called the wrong tool, with the wrong payload shape, and now needs to reread half the spec."

I wanted something the model could half-speak already, then clean up through try-retry. SQL is very good at that.

## The important part: this is not PostgreSQL

The important part of this design is what the endpoint does **not** do.

It does not execute raw SQL against the real database.

It parses the SQL-like string, validates it against the published grammar, and compiles it into the same internal operations the product already uses. The SQL string is the public DSL. It is not a tunnel into storage.

That lets me keep the real domain behavior where it belongs:

- workspace scope is injected on the server
- system fields can be readable but not writable
- sync metadata stays internal
- domain invariants still live in the real handlers
- storage can change later without breaking the public contract

This was the line I did not want to cross. Flashcards Open Source App is offline-first and sync-aware. I do not want agents mutating raw tables and pretending that is the product API.

So the contract is honest: SQL-shaped outside, domain-safe inside.

## The grammar got smaller than I first expected

Version one is intentionally small:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

At first I thought I would keep a longer list of logical resources. Then I cut that down too.

I ended up keeping the public surface close to the core nouns:

- `cards`
- `decks`
- `workspace`
- `review_events`

That change made the whole thing cleaner.

Instead of publishing extra resources like `tags_summary`, `due_cards`, or other pre-shaped views, I added a bit more query power to the language itself. Most importantly, `GROUP BY` and a few aggregate functions.

That way the model can ask for summaries directly instead of learning a separate tool or resource for every summary shape I happened to expose last month.

For example, this kind of thing is now possible:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

Or:

```sql
SELECT rating, COUNT(*) AS reviews
FROM review_events
GROUP BY rating
ORDER BY reviews DESC
LIMIT 10 OFFSET 0;
```

That is a lot simpler than keeping dedicated endpoints for every little reporting need.

The grammar is still limited. I am not trying to fake "full Postgres."

Things I do not support:

- `JOIN`
- `CTE`
- subqueries
- multi-statement execution
- arbitrary functions
- direct access to internal tables
- direct writes to protected system fields

That sounds restrictive because it is restrictive. Good. That is exactly what keeps this thing honest and maintainable.

## A few queries from the new surface

Read cards:

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

Read cards grouped by tag:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

Create decks:

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

Update cards:

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

Delete cards:

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

Read review event counts:

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

That covers a large chunk of what the old tool catalog used to do, without making the agent memorize a separate endpoint for every noun and every summary shape in the app.

One of the nice side effects here is that docs get shorter too. I do not need to explain twenty payload shapes anymore. I can show a small grammar, ten examples, and let the model learn by doing.

## The annoying part I kept anyway

This design is simpler, but it is not magic.

The biggest honest downside is that once you say "SQL-like," people will try real SQL habits. Some of those habits will work. Some will not. The product has to be very blunt when a query goes outside the supported grammar.

I also made one tradeoff that database purists will hate: v1 uses `LIMIT` and `OFFSET` directly in SQL instead of cursor pagination.

I know the downside. Pages can drift if data changes between requests. Cursor pagination is safer.

I still chose `OFFSET` for this surface because it is easier for agent authors, easier to show in examples, and easier for a model to generate without extra protocol knowledge. For this API, I care more about first-use simplicity than perfect pagination behavior on moving data.

If that tradeoff starts hurting in practice, I can change the published language later. For now, simplicity wins.

## The real win was not fewer endpoints

The deeper win here is that the API now matches how language models naturally probe systems.

They do not want a museum tour of every tool. They want one place to try an intent and get a useful error if they guessed wrong.

That is why this feels better than the previous version. It is not just smaller. It is more guessable.

For agent products, guessable beats elegant internal architecture surprisingly often.

## Where I would not force this pattern

I would not use this approach if the product depends heavily on complex domain verbs that are not CRUD-shaped.

If the real action is something like `submit_review`, `run_scheduler`, or `merge_learning_state`, pretending everything is an `UPDATE` usually makes the API worse. In those cases I would keep explicit commands for the complex operations and use the SQL-like DSL for the broad read layer, CRUD, and lightweight reporting.

That is the part many teams get backwards. They either expose raw storage, which is reckless, or they wrap every tiny operation in a custom endpoint, which is exhausting.

The useful middle ground is:

- SQL-like DSL for broad data access
- explicit commands for domain-heavy actions

That split feels much more realistic than either extreme.

## Why I like this direction

The short version is simple.

I replaced a wide tool catalog with one query language that most LLMs can already half-speak.

The engineering version is only slightly more boring:

I kept the real backend architecture, sync behavior, and invariants exactly where they were, then put a thinner and more learnable contract on top.

That feels like the right split to me.

If you are building APIs for agents, I would not start from "what is the cleanest OpenAPI surface for humans?" I would start from "what can a model infer quickly with the fewest docs and the smallest number of retries?"

Sometimes the answer is not another endpoint.

Sometimes it is a tiny language.

If you want to see the product itself, it is here: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

If you want the code, the GitHub project is here: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). It is my MIT-licensed open-source project.
