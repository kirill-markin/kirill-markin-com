---
title: "Codex Rules for AI: Global Instructions for a Better Coding Agent"
date: 2026-03-08
slug: "codex-rules-for-ai"
description: "My Codex rules for AI: the global instructions I keep in the new Codex Mac app, plus how personal AGENTS.md and repo guidance make the agent more reliable."
tags: [productivity, codex, openai, ai]
publish: true
thumbnailUrl: "/articles/codex-personalization-custom-instructions.jpg"
---

# Codex Rules for AI: Global Instructions for a Better Coding Agent

I have only been using Codex seriously for about a month, mostly after GPT-5.4 made it feel much more usable to me. So this is not a "five years of battle-tested wisdom" article. It is a much simpler observation: Codex got good for me the moment I stopped treating it like another fancy prompt box and started giving it stable instructions up front.

OpenAI has both Codex CLI and the Mac app. Both work with the same general idea for me: persistent instructions, `AGENTS.md`, repo rules, and an agent that starts with my development patterns already loaded. I prefer the Mac app because it is simply much nicer to live in than another terminal window.

Codex CLI already does this part well. The Mac app gives me a prettier and more pleasant shell around the same underlying Codex workflow. I still care about the same persistent development patterns. Strict typing, minimal diffs, explicit errors, no random fallbacks, docstrings in code instead of scattered explanations. I do not want to teach Codex that from scratch in every new task. I want that baseline there from the start.

In practice, that lives in `Settings -> Personalization -> Custom instructions`.

Under the hood, those app instructions map to personal `AGENTS.md`. Good. I get the nicer app experience without losing the CLI-style clarity of a real file.

## Where Codex Global Instructions Actually Live

If you only remember one screen from this article, make it this one.

In the app, global instructions live under `Settings -> Personalization -> Custom instructions`. I would show that screen first.

OpenAI's [Codex docs](https://developers.openai.com/codex/) say Codex can read a global instruction file from your Codex home directory, usually `~/.codex/AGENTS.md`. The [Codex settings docs](https://developers.openai.com/codex/config/) also say that editing custom instructions updates your personal instructions in `AGENTS.md`.

That is exactly the model I want. I can use the app as the main interface without losing the clarity of a file behind it.

So my mental model looks like this:

1. Personal `~/.codex/AGENTS.md` for my cross-project defaults
2. Repository `AGENTS.md` for team and repo guidance
3. Codex app settings and repository guidance around those rules

Here is the screen:

![Codex app custom instructions and personal AGENTS.md for global coding rules](/articles/codex-personalization-custom-instructions.jpg)

## The Codex Rules I Actually Want Loaded Everywhere

This is the baseline I want Codex to bring into any repository before it sees project-specific instructions.

```markdown
# Personal AGENTS.md

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
- Write simple single-purpose functions - no multi-mode behavior, no flag parameters that switch logic

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- No fallbacks unless I explicitly ask for them
- Fix root causes, not symptoms
- External API or service calls: use retries with warnings, then raise the last error
- Error messages must include enough context to debug: request params, response body, status codes
- Logging should use structured fields instead of interpolating dynamic values into message strings

## Tooling and Dependencies

- Prefer modern package management files like `pyproject.toml` and `package.json`
- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- Read installed dependency source code when needed instead of guessing behavior

## Codex Workflow

- Inspect the repository before editing
- Read active `AGENTS.md` files before making assumptions
- Keep changes minimal and directly related to the current request
- Match the existing repository style even when it differs from my personal preference
- Do not revert unrelated changes
- Prefer `rg` for code search
- Use non-interactive commands with flags
- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Run relevant tests or validation commands after code changes when the project already defines them

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code
- Never duplicate documentation across files
- Store knowledge as current state, not as a changelog of modifications
```

This file is boring in the best possible way.

It exists to remove repeated friction:

- Codex inventing broad refactors when I wanted a minimal patch
- Codex hiding uncertainty behind soft language
- Codex adding fallback behavior "for safety"
- Codex skipping over repository conventions because the prompt was too narrow

Once these rules are loaded, the session gets much calmer.

## Why I Put Global Rules Above Repository Rules

Codex has good support for `AGENTS.md` layering. OpenAI documents a global file in `~/.codex/AGENTS.md`, then repo and nested directory files as the working directory gets more specific.

That layering is useful, but the first layer still has to be mine.

My personal file should answer:

- how strict I want the coding style to be
- what I consider acceptable error handling
- how aggressive the agent should be with changes
- what "done" means in normal coding work

The repository file should answer:

- how this codebase is organized
- which commands to run
- which parts are fragile
- how the team wants PRs, commits, or docs handled

Short version:

- personal `AGENTS.md` says how I work
- repository `AGENTS.md` says how this codebase works

If I mix those together, I get duplication, drift, and a file nobody wants to maintain.

This is one reason Codex works better for me than I expected. The instruction hierarchy is explicit. It feels less like hidden prompt games and more like an actual system.

## The Mac App Is the Main Surface, and That Matters

The new Codex Mac app is the part I enjoy most right now.

That is not because the CLI is weak. The CLI is already very good. The app is just much nicer to live in day to day. Same Codex underneath, much more pleasant surface on top.

That is why I am not centering this article on the CLI even though the CLI matters. The app is the nicer way to use the same system.

What makes the app solid rather than cosmetic is that the instructions are still backed by `AGENTS.md`. The app docs say that editing custom instructions updates personal instructions in `AGENTS.md`, which is exactly the relationship I want:

- app settings for convenience
- file-based instructions for durability

That also makes CLI usage easy to reason about later, because the same base instructions carry over.

## Project AGENTS.md Still Matters, Just Not as the Main Character

I do not want this article to turn into an `AGENTS.md` nesting tutorial, even though Codex supports that just fine.

My version is simpler:

- personal `AGENTS.md` gives Codex my baseline behavior
- repository `AGENTS.md` gives Codex repo-specific expectations
- nested files are for the rare spots that genuinely need them

That keeps the system understandable.

If I open a random repository and Codex behaves badly, I want to debug it fast. Usually the answer should be one of these:

1. my global rules are unclear
2. the repo instructions are missing
3. the task itself is too broad

Not "I forgot which of seven hidden instruction layers won this prompt roulette."

## Where the CLI Fits Into My Codex Setup

The Mac app is my main surface. The CLI is not some second-class fallback. It is the same Codex system in a different posture.

The CLI still matters for a few reasons:

- it makes the file-based configuration very obvious
- it is easier to inspect or script exact behavior

I do not want a separate worldview for the CLI. I want the same personal `AGENTS.md`, the same repo guidance, and the same guardrails across both.

That continuity is a big part of why the product feels coherent.

## My Practical Codex Setup Right Now

If I were setting this up from scratch on a Mac today, I would do it in this order.

### 1. Write Personal Instructions First in the App

Open the Codex app settings with `Cmd+,`, go to `Personalization`, and write the custom instructions there first. I still think in terms of `~/.codex/AGENTS.md`, but the app is the main place where I set this up and review it.

### 2. Keep the Personal File Short and Opinionated

Project architecture does not belong here. Durable coding rules do:

- strict typing
- explicit errors
- no silent fallbacks
- minimal diffs
- docstrings instead of scattered docs
- clean terminal habits

### 3. Add Repository AGENTS.md Only for Repo Truth

Commands, architecture, constraints, testing expectations, naming, dangerous areas. That is the repo layer.

## Why Codex Feels Promising to Me Right Now

I am still early with Codex, so I am not going to oversell it.

But the combination is already strong:

- a real file-based instruction layer
- app and CLI that feel connected instead of contradictory

That is enough for me to keep using it.

The setup that works best so far is also the least glamorous one: write solid persistent instructions, keep repo guidance separate, and let the agent start from a baseline that already matches how you work.

Same pattern as Cursor. Same pattern as Claude Code. Different product, same lesson: the session goes better when the agent stops guessing who you are.

If you want the companion articles, they live here:

- Cursor IDE Rules for AI: [https://kirill-markin.com/articles/cursor-ide-rules-for-ai/](https://kirill-markin.com/articles/cursor-ide-rules-for-ai/)
- Claude Code Rules for AI: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
