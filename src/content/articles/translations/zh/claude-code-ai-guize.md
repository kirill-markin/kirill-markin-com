---
title: "Claude Code 规则：用 CLAUDE.md 固定 AI 的长期编码习惯、项目边界与协作约束"
date: 2026-03-21
description: "我把长期有效的 Claude Code 规则写进 `~/.claude/CLAUDE.md`，把个人编码偏好、仓库命令、架构边界和本地备注分层管理，让 AI 在不同项目与每次新会话中持续延续同一套工作方式，减少反复说明严格类型、最小改动、不静默添加兜底逻辑和先读代码再改的沟通成本。"
tags: [productivity, claude-code, ai, llm]
publish: true
thumbnailUrl: "/articles/claude-code-global-rules-terminal.jpg"
language: "zh"
originalArticle:
  language: "en"
  slug: "claude-code-rules-for-ai"
translations:
  - language: "en"
    slug: "claude-code-rules-for-ai"
  - language: "es"
    slug: "reglas-claude-code-para-ia"
  - language: "hi"
    slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
  - language: "ar"
    slug: "qawaid-claude-code-lilthakaa-alistinaei"
---

# Claude Code 规则：用 CLAUDE.md 固定 AI 的长期编码习惯与项目边界

当我不必在每次新对话里反复解释自己的工作方式时，Claude Code 就变得顺手多了。我用 AI 写代码大约两年，过去半年左右主要在用 Claude Code。对我帮助最大的改进，其实简单得有点不好意思说出口：把默认规则写进 `~/.claude/CLAUDE.md`，让代理从这里起步。

在那之前，我总得重复同样几句话。用严格类型。不要补上我没要求的兜底逻辑。改动范围尽量小。别一兴奋就重写半个文件。Claude 通常也会照做，但这些要求我还是得一遍又一遍地重申。

现在，在仓库本身进入对话之前，这层基础约束就已经先到位了。

## 我的 Claude Code 全局指令放在哪里

Anthropic 的 [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code/overview)把这套配置分成了几层。`~/.claude/CLAUDE.md` 是用户级文件，`./CLAUDE.md` 或 `./.claude/CLAUDE.md` 是团队共享的项目层，`CLAUDE.local.md` 则适合放你自己的项目备注，那些不该进 git 的内容就留在这里。

这几乎就是我想要的结构：

1. `~/.claude/CLAUDE.md` 放长期稳定的编码偏好
2. 项目里的 `CLAUDE.md` 写仓库特有的架构和命令
3. `CLAUDE.local.md` 放不该进 git 的个人项目笔记

我不想每打开一个仓库，都把同样的个人规则重新粘贴一遍。如果“不要静默补上兜底逻辑”是全局偏好，那它就应该放在全局文件里。如果“跑测试前先执行某个古怪的内部初始化命令”只和某个仓库有关，那它就应该写进项目文件。

下面是我现在在 Claude Code 里用的版本：

![Claude Code 的全局 CLAUDE.md 指令，用来固定 AI 的编码规则](/articles/claude-code-global-rules-terminal.jpg)

## 我真正使用的 Claude Code 规则

这段内容我故意写得很无聊。好的规则通常就是这样。我不是想提前穷尽所有边缘情况，只是想让 Claude Code 别再反复犯那些完全可以预见的错误。

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

## Language Specifics

- Prefer structured data models over loose dictionaries
- Avoid generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`
- Use modern package management files like `pyproject.toml` and `package.json`
- Use the language's strict type features when available

## Libraries and Dependencies

- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- If a dependency is installed locally, read its source code when needed instead of guessing
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

- Prefer non-interactive commands with flags over interactive ones
- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Prefer `rg` for searching code and files

## Claude Code Workflow

- Read the existing code and relevant `CLAUDE.md` files before editing
- Keep changes minimal and related to the current request
- Match the existing style of the repository even if it differs from my personal preference
- Do not revert unrelated changes
- If you are unsure, inspect the codebase instead of inventing patterns
- When project instructions include test or lint commands, run them before finishing if the task changed code

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code
- Never duplicate documentation across files
- Store knowledge as current state, not as a changelog of modifications
```

这段规则已经覆盖了我日常最在意的大部分事情。

没有这层约束时，Claude 会沿着几条很熟悉的轨道慢慢跑偏。它会“以防万一”地加上兜底逻辑。它会因为严格类型显得麻烦，就顺手把类型放宽。它会给本来很简单的函数多包几层。它还会因为太想显得配合，最后修错真正的问题，因为它在努力迁就，而不是努力做到准确。

我宁可一次花十分钟把全局文件写好，也不想在每个新会话里继续一条条纠正这些老毛病。

## 先有全局 CLAUDE.md，再有项目 CLAUDE.md

我不想要一个把所有东西都塞进去的巨型 `CLAUDE.md`。

我的全局文件应该回答这些问题：

- 我希望类型有多严格？
- 我希望错误如何处理？
- 我想要尽量小的改动，还是大规模重构？
- 我希望看到什么样的文档？

而项目文件应该回答的是另外一组问题：

- 这个项目要怎么运行？
- 哪些命令是安全且推荐的？
- 架构边界里哪些最重要？
- 测试放在哪里？
- 哪些约定只属于这个仓库？

实际落地时：

- 全局 `CLAUDE.md` 说明我是怎么工作的
- 项目 `CLAUDE.md` 说明这个仓库是怎么工作的

如果把这两类内容混在一起，文件最后只会变成一团浆糊。一半太泛，一半太局部，而 Claude 每做一个任务都得把整包信息一起背着走。

Anthropic 也建议把这些文件写得简洁一点。很好。过长的指令文件，往往像是有人想把整本工程手册一股脑塞进提示词里。这通常不会有什么好结果。

## 会话进行到一半时会出什么问题

规则有帮助，但救不了一个已经变乱的会话。

如果我花了二十条消息讨论某个子系统，然后突然切到另一个完全不同的问题，Claude 就可能还卡在前面的思路里。这很正常。我不会把长对话当成什么必须一直延续下去的神圣线程。

所以我的实际做法是：

- 当任务从探索切换到实现时，开一个新会话
- 当问题从一个子系统跳到另一个完全不同的子系统时，开一个新会话
- 让项目指令足够简短，免得我在每一轮都要付上下文税

这也是我为什么喜欢用 markdown 文件来记计划和笔记。如果任务很大，我宁可把当前状态明确存下来，也不愿意赌一条超长会话能一直保持清爽。

## 我实际采用的 Claude Code 规则落地顺序

如果今天让我从零开始重新设置，我会按这个顺序来。

### 1. 创建 `~/.claude/CLAUDE.md`

先写那些你不会退让的规则。不是人生建议，也不是工程宣言，只写那些会在不同仓库里反复起作用的东西。

对我来说，这包括：

- 严格类型
- 显式错误处理
- 尽量小的改动
- 不要静默加兜底逻辑
- 把文档字符串（`docstring`）放在该放的地方
- 非交互式终端习惯

光是这些，对输出结果的影响就已经比大多数提示词技巧更大。

### 2. 添加项目级 `CLAUDE.md`

把命令、架构、命名和边界放进仓库里的文件。Anthropic 提供了 `/init` 来起草一版，这确实有用。但我之后还是会手动改，因为自动生成的内容只是草稿，不是成品。

### 3. 保持项目规则简短

不要把项目文件写成你个人文件的第二份拷贝。把仓库特有的命令、架构说明和本地约定放在这里，把长期稳定的个人偏好留在全局文件里。

## 为什么这比花哨的提示词技巧更重要

很多关于编码代理“终极配置”的内容，很快就会滑向一种表演式的复杂化。

真正改善我日常工作的，其实简单得多：

- 一个稳定的用户级 `CLAUDE.md`
- 一个干净的项目级 `CLAUDE.md`

这套组合会让 Claude 更稳。随机冒出来的兜底逻辑更少，自作聪明的抽象更少，也更少出现那种过了十分钟我才发现代理和我其实在解决两个稍微错位的问题的情况。

如果你同时在用几个编码代理，别的产品上也会出现同样的模式。产品不同，结论一样：把基线一次讲清楚，别每天早上重新谈判。

如果你还想看配套文章，可以看这里：

- Cursor IDE 规则：[https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/](https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/)
- Codex 规则：[https://kirill-markin.com/zh/zhishi/codex-ai-guize/](https://kirill-markin.com/zh/zhishi/codex-ai-guize/)
