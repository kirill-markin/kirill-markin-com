---
title: "Codex AI规则、AGENTS.md 与 Mac 应用指南：跨仓库复用稳定开发指令与编码习惯策略"
date: 2026-03-21
description: "我的 Codex AI 规则实践：结合自定义指令、AGENTS.md 与 Mac 应用，让代理在不同仓库中持续保持一致的编码风格、错误处理方式、最小改动工作流与终端习惯，减少重复说明，把个人偏好稳定带入每次新任务，也让应用与 CLI 共用同一套长期规则、执行边界、协作方式与决策约束。"
tags: [productivity, codex, openai, ai]
publish: true
thumbnailUrl: "/articles/codex-personalization-custom-instructions.jpg"
language: "zh"
originalArticle:
  language: "en"
  slug: "codex-rules-for-ai"
translations:
  - language: "en"
    slug: "codex-rules-for-ai"
  - language: "es"
    slug: "reglas-codex-para-ia"
---

# Codex AI规则：全局指令、AGENTS.md 与 Mac 应用实战

我认真开始使用 Codex 其实也就一个月左右，主要还是在 GPT-5.4 让我感觉它明显更可用之后。所以这不是一篇“经过五年实战验证的终极经验”文章。我的观察要简单得多：当我不再把 Codex 当成另一个高级 prompt 输入框，而是先给它稳定的长期指令之后，它马上就变得对我有用了。

OpenAI 同时提供 Codex CLI 和 Mac 应用。对我来说，它们的底层逻辑是一样的：持久化指令、`AGENTS.md`、仓库规则，以及一个在启动时就已经加载了我开发习惯的代理。我更偏爱 Mac 应用，因为它日常使用起来就是比又一个终端窗口舒服得多。

Codex CLI 本身已经把这部分做得很好。Mac 应用则是在同一套 Codex 工作流之上，给了我一个更漂亮、更舒适的外壳。我在意的仍然是同一套持久化开发模式：严格类型、最小 diff、显式错误、不要随手加 fallback、文档写在代码里的 docstring，而不是散落在各处的说明。我不想在每个新任务里从头把这些重新教给 Codex。我想让这层基线一开始就存在。

实际设置入口就在 `Settings -> Personalization -> Custom instructions`。

在更底层，这些应用里的指令会映射到个人 `AGENTS.md`。很好。这样我既能得到更舒服的应用体验，也不会失去基于真实文件的清晰感。

## Codex 自定义指令到底放在哪里

如果你只记住这篇文章里的一个界面，那就记住这个。

在应用里，全局指令位于 `Settings -> Personalization -> Custom instructions`。如果要先展示一个界面，我会先展示这个。

OpenAI 的 [Codex 文档](https://developers.openai.com/codex/)说明 Codex 会从你的 Codex home 目录读取一个全局指令文件，通常是 `~/.codex/AGENTS.md`。[Codex 配置文档](https://developers.openai.com/codex/config/)也提到，编辑自定义指令会同步更新 `AGENTS.md`。

这正是我想要的模型。我可以把应用当作主要界面来用，同时依然保留背后真实文件带来的清晰结构。

所以我的心智模型是这样的：

1. 个人 `~/.codex/AGENTS.md` 存放跨项目通用默认规则
2. 仓库级 `AGENTS.md` 存放团队和仓库特定约束
3. Codex 应用设置与仓库说明围绕这些规则展开

对应的界面如下：

![Codex 应用自定义指令与个人 AGENTS.md，用于全局编码规则](/articles/codex-personalization-custom-instructions.jpg)

## 我真正希望 Codex 在所有地方默认加载的规则

这是我希望 Codex 在看到项目级指令之前，就能自动带进任何仓库里的那一层基础规则。

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

## Testing

- Respect the current repository testing strategy and existing test suite
- Do not add new unit tests by default
- When tests are needed, prefer integration tests or smoke tests that validate real behavior
- Avoid mocks when real calls are practical
- It is usually better to spend a little money on real API or service calls than to maintain fragile mock-based coverage
- Add only the minimum test coverage needed for the requested change

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

这个文件最好的地方，就是它足够朴素。

它存在的意义，是消除反复出现的摩擦：

- Codex 在我只想打一个小补丁时，却擅自发明大范围重构
- Codex 用柔软措辞掩盖它其实并不确定
- Codex 出于“安全考虑”擅自添加 fallback 行为
- Codex 因为 prompt 太窄而忽略仓库约定

当这些规则已经加载好之后，整个会话会平静很多。

## 为什么我把全局规则放在仓库规则前面

Codex 对 `AGENTS.md` 的分层支持做得不错。OpenAI 文档里明确写了全局文件 `~/.codex/AGENTS.md`，然后随着工作目录越来越具体，再叠加仓库级和更深层目录的文件。

这种分层当然有用，但第一层首先必须是我自己的。

我的个人文件应该回答：

- 我希望代码风格严格到什么程度
- 我认为什么样的错误处理才算合格
- 我希望代理对改动有多激进
- 在正常编码工作里，“完成”到底意味着什么

仓库文件则应该回答：

- 这套代码库是怎么组织的
- 需要运行哪些命令
- 哪些部分很脆弱
- 团队希望如何处理 PR、提交或文档

简短版本就是：

- 个人 `AGENTS.md` 说明我是怎么工作的
- 仓库 `AGENTS.md` 说明这个代码库是怎么工作的

如果把它们混在一起，就只会得到重复、漂移，以及一个没人愿意维护的文件。

这也是 Codex 比我原本预期更好用的原因之一。它的指令层级是显式的。它不像一套隐藏的 prompt 小把戏，而更像一个真正的系统。

## Mac 应用是主要使用界面，这一点很重要

我现在最喜欢的部分，是新的 Codex Mac 应用。

这并不是因为 CLI 不行。CLI 已经很好了。只是应用日常用起来更舒服。同一个 Codex 在下面运行，上层则是一个更顺手的界面。

所以尽管 CLI 很重要，我也不想把这篇文章的重心放在 CLI 上。对我来说，应用才是使用这套系统更舒服的方式。

而真正让这个应用不只是“好看”，而是“靠谱”的点，在于这些指令依然由 `AGENTS.md` 托底。应用文档说，编辑自定义指令会更新个人 `AGENTS.md`，这正是我想要的关系：

- 应用设置负责便利性
- 文件指令负责可持续性

这也让之后理解 CLI 使用方式变得更简单，因为同一套基础指令会一起延续过去。

## 项目级 AGENTS.md 依然重要，只是不是主角

我不想让这篇文章变成一个关于 `AGENTS.md` 嵌套层级的教程，虽然 Codex 完全支持那套玩法。

我的版本更简单：

- 个人 `AGENTS.md` 给 Codex 我的基础行为模式
- 仓库 `AGENTS.md` 给 Codex 这个仓库的具体预期
- 嵌套文件只留给那些真的有必要的少数场景

这样整个系统会更容易理解。

如果我打开一个陌生仓库，而 Codex 表现很差，我希望能迅速定位原因。通常答案应该是下面几种之一：

1. 我的全局规则写得不清楚
2. 仓库指令缺失
3. 任务本身定义得太宽

而不是“我忘了七层隐藏指令里到底哪一层赢了这次 prompt 轮盘”。

## CLI 在我的 Codex 配置里扮演什么角色

Mac 应用是我的主界面。CLI 不是某种次级 fallback，它只是同一套 Codex 系统的另一种姿势。

CLI 仍然重要，原因有几个：

- 它让基于文件的配置一目了然
- 它更容易精确检查或脚本化某些行为

我不想给 CLI 再发明一套独立世界观。我想要的是相同的个人 `AGENTS.md`、相同的仓库说明，以及两边一致的护栏。

这种连续性，是这个产品让我觉得整体感很强的重要原因。

## 我现在实际使用的 Codex 配置

如果我今天在 Mac 上从零开始配置它，我会按这个顺序来。

### 1. 先在应用里写个人指令

打开 Codex 应用设置，按 `Cmd+,`，进入 `Personalization`，先把自定义指令写在那里。虽然我脑子里还是会把它理解成 `~/.codex/AGENTS.md`，但应用确实是我主要设置和回看的地方。

### 2. 让个人文件保持简短而明确

项目架构不应该放在这里。持久的开发规则才应该放在这里：

- 严格类型
- 显式错误
- 不要静默 fallback
- 最小 diff
- 用 docstring 代替散落的文档
- 干净的终端习惯

### 3. 仓库级 AGENTS.md 只写仓库事实

命令、架构、约束、测试预期、命名、危险区域。这些属于仓库层。

## 为什么 Codex 现在让我觉得很有潜力

我还处在使用 Codex 的早期阶段，所以我并不想过度吹捧它。

但这个组合已经很强了：

- 一层真正基于文件的指令系统
- 应用和 CLI 彼此衔接，而不是互相打架

这已经足够让我继续使用下去。

到目前为止，最适合我的配置恰恰也是最不花哨的那种：写好稳定的持久化指令，把仓库说明和个人偏好分开，让代理一开始就站在与你工作方式一致的基线上。

和 Cursor 一样。和 Claude Code 一样。产品不同，经验相同：当代理不再猜测你是谁时，会话效果就会更好。

如果你想看配套文章，可以看这里：

- Cursor IDE AI规则： [https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/](https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/)
- Claude Code AI规则： [https://kirill-markin.com/zh/zhishi/claude-code-ai-guize/](https://kirill-markin.com/zh/zhishi/claude-code-ai-guize/)
