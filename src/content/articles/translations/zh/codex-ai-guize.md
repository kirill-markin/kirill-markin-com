---
title: "Codex 规则：用全局指令、个人 AGENTS.md 和 Mac 应用统一我的开发基线"
date: 2026-03-21
description: "我如何用 Codex 自定义指令、个人 AGENTS.md 和 Mac 应用，把跨仓库都适用的编码习惯和协作规则固定下来，让应用与 CLI 默认共享同一套开发基线，减少每次进入新项目时重复解释和重新校准的成本。"
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
  - language: "hi"
    slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
  - language: "ar"
    slug: "qawaid-codex-lilthakaa-alistinaei"
---

# Codex 规则：全局指令、AGENTS.md 和 Mac 应用

我认真开始用 Codex，其实也就一个月左右，主要是在 GPT-5.4 让我明显觉得它顺手很多之后。所以这不是一篇“经过五年实战检验”的经验总结。我的体会很简单：当我不再把 Codex 当成另一个花哨的提示词输入框，而是先把一套稳定的长期规则交给它时，它立刻就变得好用了。

OpenAI 现在同时提供 Codex CLI 和 Mac 应用。对我来说，两者遵循的是同一套思路：长期有效的指令、`AGENTS.md`、仓库规则，以及一个一上来就已经带着我开发习惯的 Codex。我更喜欢 Mac 应用，因为日常用起来，它确实比再开一个终端窗口舒服得多。

Codex CLI 在这方面本来就做得不错。Mac 应用只是把同一套工作流包进了一个更顺手、更舒服的界面里。我在意的还是那套稳定的开发习惯：严格类型、最小改动、显式报错、不要随手加兜底逻辑、把说明写进代码里的 docstring，而不是散落在各处。我不想每接一个新任务，都重新把这些教一遍。我希望这层基线从一开始就已经在。

实际设置入口就在 `Settings -> Personalization -> Custom instructions`。

再往下看，这些应用里的指令会映射到个人 `AGENTS.md`。这正合我意。我既能保留应用层面的便利，也不会失去真实文件带来的清晰感。

## Codex 自定义指令到底放在哪里

如果你只记住这篇文章里的一个界面，那就记住这个。

在应用里，全局指令就在 `Settings -> Personalization -> Custom instructions`。如果这篇文章里只能先展示一个界面，我会先放这个。

OpenAI 的 [Codex 文档](https://developers.openai.com/codex/)说明，Codex 会从你的 Codex home 目录读取一个全局指令文件，通常是 `~/.codex/AGENTS.md`。[Codex 配置文档](https://developers.openai.com/codex/config/)也提到，编辑自定义指令会同步更新 `AGENTS.md`。

这正是我想要的结构。我可以把应用当成主界面来用，同时继续保留背后那层真实文件的清晰边界。

所以我脑子里对这套东西的理解是这样的：

1. 个人 `~/.codex/AGENTS.md` 放跨项目通用的默认规则
2. 仓库级 `AGENTS.md` 放团队和仓库特有的约束
3. Codex 应用设置和仓库说明围绕这些规则展开

对应的界面如下：

![Codex 应用自定义指令与个人 AGENTS.md，用于全局编码规则](/articles/codex-personalization-custom-instructions.jpg)

## 我真正希望 Codex 到处都默认加载的规则

这是我希望 Codex 在看到项目级规则之前，就先带进任何仓库的一层基础设置。

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
- When tests are needed, prefer integration, end-to-end, or smoke tests that validate real behavior
- Use unit tests only rarely, mainly for stable datasets or pure data transformations
- Never add unit tests just to increase coverage numbers
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

这个文件最大的优点，就是它足够无聊。

它存在，就是为了消掉那些反复出现的摩擦：

- 我只想补一个小改动，Codex 却擅自扩成大范围重构
- Codex 明明不确定，却用含糊的话带过去
- Codex 出于“安全考虑”自己补上一层兜底逻辑
- Codex 因为任务描述太窄，直接忽略仓库里的约定

这些规则先装进去之后，整个会话会平静很多。

## 为什么我把全局规则放在仓库规则前面

Codex 对 `AGENTS.md` 的分层支持做得不错。OpenAI 文档里明确写了全局文件 `~/.codex/AGENTS.md`，然后随着工作目录越来越具体，再叠加仓库级和更深层目录里的文件。

这种分层当然有用，但第一层必须先是我自己的规则。

我的个人文件应该回答：

- 我希望代码风格严格到什么程度
- 我认为什么样的错误处理才算合格
- 我希望 Codex 在改动上有多激进
- 在正常编码工作里，“完成”到底意味着什么

仓库文件则应该回答：

- 这套代码库是怎样组织的
- 需要运行哪些命令
- 哪些部分很脆弱
- 团队希望如何处理 PR、提交或文档

简短版本就是：

- 个人 `AGENTS.md` 说明我是怎么工作的
- 仓库 `AGENTS.md` 说明这个代码库是怎么工作的

如果把它们混在一起，最后只会得到重复、漂移，以及一个没人想维护的文件。

这也是 Codex 比我原本预期更好用的原因之一。它的指令层级是公开而明确的。它不像一套藏起来的提示词小把戏，更像一个真正的系统。

## Mac 应用是主要使用界面，这一点很重要

我现在最喜欢的部分，是新的 Codex Mac 应用。

这不是因为 CLI 不行。CLI 已经很好了。只是应用日常用起来更舒服。底层还是同一个 Codex，只是外面换了一个更顺手的壳。

所以即使 CLI 很重要，我也不想把这篇文章的重心放在 CLI 上。对我来说，应用才是这套系统更舒服的入口。

而真正让这个应用不只是“好看”，而是“靠谱”的地方，在于这些指令背后依然有 `AGENTS.md` 托底。应用文档说，编辑自定义指令会更新个人 `AGENTS.md`，这正是我想要的关系：

- 应用设置负责方便
- 文件里的指令负责长期稳定

这也让之后理解 CLI 的用法变得更简单，因为同一套基础指令会自然延续过去。

## 项目级 AGENTS.md 依然重要，只是不是主角

我不想让这篇文章变成一篇讲 `AGENTS.md` 嵌套层级的教程，虽然 Codex 完全支持那一套。

我的版本更简单：

- 个人 `AGENTS.md` 让 Codex 先带上我的默认工作方式
- 仓库 `AGENTS.md` 给 Codex 这个仓库的具体预期
- 嵌套文件只留给那些真的有必要的少数场景

这样整套东西就比较好理解。

如果我打开一个陌生仓库，而 Codex 表现得很差，我希望能很快定位原因。通常答案应该只是下面几种之一：

1. 我的全局规则写得不清楚
2. 仓库指令缺失
3. 任务本身定义得太宽

而不是“我忘了七层隐藏指令里，到底是哪一层赢了这次提示词轮盘”。

## CLI 在我的 Codex 配置里扮演什么角色

Mac 应用是我的主界面。CLI 不是次一级的备选方案，它只是同一套 Codex 系统的另一种姿态。

CLI 仍然重要，原因有几个：

- 它让基于文件的配置一目了然
- 它更容易精确检查某些行为，也更方便脚本化

我不想给 CLI 再发明一套单独的世界观。我想要的是同样的个人 `AGENTS.md`、同样的仓库说明，以及两边一致的边界。

这种连续性，是这个产品让我觉得整体很完整的重要原因之一。

## 我现在实际使用的 Codex 配置

如果我今天在 Mac 上从零开始配置它，我会按这个顺序做。

### 1. 先在应用里写个人指令

打开 Codex 应用设置，按 `Cmd+,`，进入 `Personalization`，先把自定义指令写在那里。虽然我脑子里还是会把它理解成 `~/.codex/AGENTS.md`，但应用确实是我主要配置和查看的地方。

### 2. 让个人文件保持简短而鲜明

项目架构不该放在这里。适合长期复用的开发规则才应该放在这里：

- 严格类型
- 显式错误
- 不要静默兜底
- 最小化改动
- 用文档字符串代替散落的说明
- 干净的终端习惯

### 3. 仓库级 AGENTS.md 只写这个仓库的事实

命令、架构、约束、测试预期、命名、危险区域。这些才属于仓库这一层。

## 为什么 Codex 现在让我觉得很有潜力

我还处在使用 Codex 的早期阶段，所以我不想把它说得太夸张。

但这个组合已经很有说服力了：

- 一层真正基于文件的指令系统
- 应用和 CLI 彼此衔接，而不是各说各话

这已经足够让我继续用下去。

到目前为止，最适合我的配置，恰恰也是最不花哨的那种：写好稳定的长期指令，把仓库说明和个人偏好分开，让 Codex 从一开始就按你的工作方式来。

和 Cursor 一样，和 Claude Code 也一样。产品不同，结论却差不多：当 Codex 不再猜测你是谁时，整个会话就会顺很多。

如果你想看配套文章，可以看这里：

- Cursor IDE 规则： [https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/](https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/)
- Claude Code 规则： [https://kirill-markin.com/zh/zhishi/claude-code-ai-guize/](https://kirill-markin.com/zh/zhishi/claude-code-ai-guize/)
