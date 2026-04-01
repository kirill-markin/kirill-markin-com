---
title: "Claude Code AI规则与 CLAUDE.md 全局指令指南：跨仓库保持稳定编码风格与最小改动"
date: 2026-03-21
description: "我的 Claude Code AI 规则实践：通过全局 CLAUDE.md 拆分个人偏好与项目规范，让代理在不同仓库中持续遵循同一套编码风格、错误处理原则、最小改动习惯与终端工作方式，从一开始就减少重复沟通、上下文漂移，以及每次新会话里反复解释相同要求、重复修正相同行为的长期成本。"
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
---

# Claude Code AI规则：用 CLAUDE.md 管理全局开发指令

当我不再在每个对话里反复解释自己之后，Claude Code 对我来说一下子好用了很多。我用 AI 写代码差不多两年了，真正开始高频使用 Claude Code 大概是最近六个月，而最有用的改进其实简单得有点尴尬：把我的默认规则写进 `~/.claude/CLAUDE.md`，让代理从那里开始。

在那之前，我总是在重复消耗消息额度。用严格类型。不要加我没要求的 fallback。保持 diff 小。不要一兴奋就重写半个文件。Claude 往往也会听，但我还是得一遍又一遍重复这些要求。

现在，这层基础在仓库进入对话之前就已经存在了。

## 我的 Claude Code 全局指令放在哪里

Anthropic 的 [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code/overview)把这套机制拆成几层。`~/.claude/CLAUDE.md` 是用户级文件，`./CLAUDE.md` 或 `./.claude/CLAUDE.md` 是项目共享层，`CLAUDE.local.md` 则用于那些不该进 git 的个人项目备注。

这和我想要的模型几乎完全一致：

1. `~/.claude/CLAUDE.md` 用来存放我跨项目持续生效的开发偏好
2. 项目里的 `CLAUDE.md` 用来描述仓库特定的架构和命令
3. `CLAUDE.local.md` 用来存放不该提交的个人项目笔记

我不想把同一套个人规则粘贴进每一个打开的仓库里。如果“不要静默 fallback”是全局偏好，那它就应该属于全局文件。如果“跑测试前先执行这个奇怪的内部启动命令”只和某个仓库有关，那它就应该属于项目文件。

这就是我现在在 Claude Code 里使用的版本：

![Claude Code 在 CLAUDE.md 中的全局指令，用于持久化 AI 编码规则](/articles/claude-code-global-rules-terminal.jpg)

## 我真正使用的 Claude Code 规则

这个规则块故意写得很朴素。好的规则通常就是这样。我并不是想提前描述所有边缘情况，我只是想让 Claude Code 停止犯那些反复出现、完全可以预测的错误。

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

这个规则块覆盖了我日常最在意的大部分事情。

没有它的时候，Claude 会以非常熟悉的方式慢慢跑偏。它会“以防万一”地添加 fallback。它会因为严格类型显得麻烦而偷偷放宽类型。它会给本来简单的函数套上多余的层级。它会因为想表现得更体贴而修错问题，而不是精确解决真正的问题。

我宁可一次花十分钟写一个像样的全局文件，也不想在每次新会话里继续一条条纠正这些模式。

## 先有全局 CLAUDE.md，再有项目 CLAUDE.md

我不想要一个把所有东西硬塞进去的巨大 `CLAUDE.md`。

我的全局文件应该回答这些问题：

- 我希望类型有多严格？
- 我希望错误如何处理？
- 我想要最小 diff，还是大规模重构？
- 我期待什么样的文档风格？

而项目文件应该回答的是另外一组问题：

- 这个项目要怎么运行？
- 哪些命令是安全且推荐的？
- 架构边界里哪些最重要？
- 测试放在哪里？
- 哪些约定只属于这个仓库？

实际落地时：

- 全局 `CLAUDE.md` 说明我是怎么工作的
- 项目 `CLAUDE.md` 说明这个仓库是怎么工作的

如果把这两类东西混在一起，文件最后只会变成一团浆糊。一半过于泛化，一半过于本地化，而 Claude 在每个任务里都得背着全部内容前进。

Anthropic 也建议把这些文件写得简洁一些。很好。超长指令文件通常都像是有人试图把整本工程手册直接塞进 prompt 里。那种做法从来不会有好结果。

## 会话进行到一半时会出什么问题

规则有帮助，但它们并不能永远拯救一个已经混乱的会话。

如果我花了二十条消息讨论某个子系统，然后突然切到一个完全不同的问题，Claude 很容易还停留在前一个思维框架里。这很正常。我不会把长对话当成什么神圣不可打断的东西。

所以我的实际做法是：

- 当任务从探索切换到实现时，开一个新会话
- 当问题从一个子系统跳到另一个完全不同的子系统时，开一个新会话
- 把项目指令压缩到足够短，这样我就不用在每一轮都支付上下文税

这也是我喜欢用 markdown 文件记录计划和笔记的原因。如果任务很大，我宁可把状态显式保存下来，也不愿意赌一个很长的对话线程始终保持干净。

## 我实际采用的 Claude Code 规则落地顺序

如果我今天要从零开始配置这套东西，我会按这个顺序来。

### 1. 创建 `~/.claude/CLAUDE.md`

先写你的非谈判项。不是人生建议，也不是工程宣言。只写那些会在不同仓库里反复重要的规则。

对我来说，这包括：

- 严格类型
- 显式错误处理
- 尽量小的改动
- 不要静默 fallback
- 把 docstring 放在该放的地方
- 非交互式终端习惯

光是这些，对结果的影响就已经比大多数 prompt 花招更大了。

### 2. 添加项目级 `CLAUDE.md`

把命令、架构、命名和边界写进仓库文件。Anthropic 提供了 `/init` 来帮你起草，这很有用。但我之后仍然会手动改，因为自动生成的指令只是草稿，不是成品。

### 3. 保持项目规则简短

不要把项目文件变成你个人文件的第二份拷贝。仓库特定的命令、架构说明和本地约定写在这里。持久的个人偏好放在全局文件里。

## 为什么这比花哨的 Prompt 技巧更重要

很多关于“终极配置”的编码代理内容，很快就会滑向一种表演性质的复杂化。

真正改善我日常工作的，其实简单得多：

- 一个稳定的用户级 `CLAUDE.md`
- 一个干净的项目级 `CLAUDE.md`

这套组合会让 Claude 更稳定。随机 fallback 更少，花哨抽象更少，也更少出现那种十分钟后我才发现代理和我其实在解决两个略有偏差问题的情况。

如果你同时使用多个编码代理，同样的模式也会在别处出现。产品不同，结论一样：先把基础设定好一次，不要每天早上重新谈判。

如果你想看配套文章，可以看这里：

- Cursor IDE AI规则： [https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/](https://kirill-markin.com/zh/zhishi/cursor-ide-ai-bianma-guize-youhua/)
- Codex AI规则： [https://kirill-markin.com/zh/zhishi/codex-ai-guize/](https://kirill-markin.com/zh/zhishi/codex-ai-guize/)
