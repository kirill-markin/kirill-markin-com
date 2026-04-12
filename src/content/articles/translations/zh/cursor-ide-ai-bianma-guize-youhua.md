---
title: "Cursor IDE 的 AI 规则：为专业 AI 助手建立清晰、一致的编码约束"
date: 2025-05-08
description: "分享我在 Cursor IDE 中长期使用的一套全局 AI 规则，以及如何与仓库级和上下文规则配合使用，帮助 AI 更稳定地遵循代码风格、错误处理、类型约束和开发流程。"
tags: ["productivity", "cursor-ide", "ai", "llm"]
publish: true
thumbnailUrl: "/articles/cursor-ide-rules-for-ai.webp"
language: "zh"
originalArticle:
  language: "en"
  slug: "cursor-ide-rules-for-ai"
translations:
  - language: "en"
    slug: "cursor-ide-rules-for-ai"
  - language: "es"
    slug: "reglas-cursor-ide-para-ia"
  - language: "hi"
    slug: "cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye"
  - language: "ar"
    slug: "qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja"
---

# Cursor IDE 的 AI 规则：为专业 AI 助手准备的指南

Cursor IDE 目前支持三层规则体系：

1. Cursor IDE 设置中的 Rules for AI：作用于所有项目的全局基础规则
2. `.cursor/index.mdc` 文件，并将 Rule Type 设为 "Always"：仓库级项目规则，用来替代旧版 `.cursorrules` 方案
3. `.cursor/rules/*.mdc` 文件：按上下文动态启用的项目规则，只有当 AI 处理与其描述相关的任务时才会生效

这篇文章里，我分享的是自己的基础层规则，也就是我放在 Cursor IDE 全局设置中的那一套。它们构成了我所有开发工作的底层约束。再配合仓库级规则和动态规则，就能形成一套既能维持代码质量、又能让开发习惯保持一致的完整系统。

> **更喜欢视频教程？** 我录制了一期完整视频，详细演示这整套 Cursor 规则系统的搭建方式。[观看 Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](https://www.youtube.com/watch?v=gw8otRr2zpw)，可以逐步看到这些方法是如何落地的。

[![Cursor IDE 规则配置与实际使用演示](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## 如何配置 Cursor 规则，获得更好的 AI 编码表现

Cursor -> Settings -> Cursor Settings -> Rules for AI:

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
- Write simple single-purpose functions — no multi-mode behavior, no flag parameters that switch logic. If the user needs multiple modes, they will ask explicitly

## Error Handling

- Always raise errors explicitly, never silently ignore them
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- NO FALLBACKS: Code should either succeed or fail with a clear error. Fallbacks are only allowed if the user explicitly asks for them. Never add automatic fallbacks — they hide real problems
- Transparent debugging: When something fails, show exactly what went wrong and why
- Fix root causes, not symptoms - fallbacks hide real problems that need solving
- External API/service calls: use retries with warnings, raise the last error if all attempts fail
- Error messages must include enough context to debug (request params, response body, status codes) — no generic "something went wrong"
- Logging: no dynamic values interpolated into log message strings — pass them as structured data or extra fields. Exceptions can use f-strings for readability

## Language Specifics

- Prefer structured data models over loose dictionaries (Pydantic, interfaces)
- Avoid generic types like `Any`, `unknown`, or `List[Dict[str, Any]]`
- Use modern package management (pyproject.toml, package.json)
- Leverage language-specific type features (discriminated unions, enums)

## Libraries and Dependencies

- Install in virtual environments, not globally
- Add to project configs, not one-off installs
- When a dependency is installed locally (node_modules, .venv, etc.), read its source code directly even if it's gitignored — this is the best way to understand how a library works
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

- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Prefer non-interactive commands with flags over interactive ones

## Code Changes

- Matching the existing code style is more important than "correct" or "ideal" style — new code must look like it was written by the same author
- Suggest only minimal changes related to current dialog
- Change as few lines as possible while solving the problem
- Focus only on what user is asking for - no extra improvements

## Documentation

- Code is the primary documentation — use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions/classes they describe, not in separate files
- Separate docs files (in `docs/`) only when a concept cannot be expressed in code — and only one file per topic
- Never duplicate documentation across files — reference other sources instead
- Store knowledge as current state, not as a changelog of modifications
```

![Cursor IDE 设置面板中的全局规则配置](/articles/cursor-ide-rules-global.webp)

## 用好多层 Cursor 项目规则，最大化效率

在使用 Cursor IDE 的 AI 功能时，我发现关键在于把三层项目规则搭配好。核心思路其实只有一个：尽量减少每次对话里发送给语言模型的 token 数量。上下文占用越少，模型就越有空间生成高质量回答。

如果你想进一步了解 Cursor 中项目规则的工作方式，可以参考 [Cursor 官方关于 Rules for AI 的文档](https://docs.cursor.com/context/rules)。

### Cursor 项目规则的三步实施流程

1. **先只使用 IDE 层设置**
   我会先从全局 Cursor IDE 设置开始，用它建立最基础的偏好。这样我就能试验不同规则的写法，而不会让仓库变得臃肿。这个层级我只保留真正适用于所有项目的通用规则。

2. **把项目专属规则移到仓库层**
   当我发现某些模式只适用于特定代码库，或者希望把对 AI 的要求共享给团队成员时，我就会把这些规则移到 `.cursor/index.mdc`，并将 Rule Type 设为 "Always"。这样既能形成团队共识，也能让我的全局设置保持精简。（补充说明：旧版 `.cursorrules` 仍然可用，但已经不再推荐。）

3. **必要时再拆成上下文感知规则**  
   如果 `.cursorrules` 文件变得过于臃肿，我就会进一步拆成 `.cursor/*.mdc` 文件。这样做可以降低 token 消耗，因为只有相关规则才会在需要时加载。你可以把它理解成：不给模型塞一堆无关说明，而是让它把更多注意力留给当前任务。

我的目标很简单：在和 AI 助手的每一轮对话中，只给它刚好足够、有实际价值的上下文，而不是浪费它的容量去记住眼下不需要的信息。

## 来自真实生产仓库的 Cursor 项目规则示例

为了说明我是如何在不同代码库中使用 Cursor 项目规则的，下面给出几个真实例子。

### 仓库级 `.cursor/index.mdc` 文件：结构与实现方式

我会把 Rule Type 设为 "Always" 的 `.cursor/index.mdc` 文件，当作一份专门写给 AI 助手看的 `README.md`。它主要提供项目用途、架构背景和需要遵循的编码模式。（旧版 `.cursorrules` 文件仍受支持，但新项目已经不建议继续使用。）

![仓库级 .cursorrules 文件示例](/articles/cursor-ide-rules-repo.webp)

#### 生产仓库中的实际示例

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**：这是一个把仓库转换成文本的工具，规则里会说明项目目的、架构决策，以及应该遵循的代码模式。

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**：这个 Telegram 机器人项目的规则更偏向说明机器人架构、API 使用模式，以及消息和命令的处理约定。

### `.cursor/*.mdc` 规则文件：何时使用，如何使用

当仓库级规则变得过于庞杂时，我会把它们拆成只在特定上下文中启用的 `.cursor/*.mdc` 文件。

![Project Rules 区域中的上下文规则](/articles/cursor-ide-rules-specific.webp)

#### 针对具体任务的规则示例

一个很好的例子是我的个人网站仓库：
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

在这个仓库里，我为以下场景分别建立了独立的规则文件：

- 内容管理工作流
- 图片优化要求
- SEO 最佳实践
- 组件架构模式
- 部署流程

这种做法能让 AI 保持聚焦，避免它在处理某个具体任务时被大量无关信息淹没。

### 在对话中途引入规则：限制与最佳实践

这里有一个很重要的限制：上下文感知的 `.mdc` 规则，在新对话开始时效果最好。如果你已经在 Cursor IDE 中进行到一半，突然又需要应用某条专门规则，比如数据库查询规范，AI 可能不会自动读取对应的规则文件。原因在于 Cursor 已经为当前对话建立了上下文，它不一定会在中途重新评估应该加载哪些规则。

遇到这种情况时，我会直接点明需要遵循的规则，比如：“Please follow our database querying guidelines for this task.” 这样会提示 Cursor 去查找并应用相关规则。对于那些高度依赖特定规范的关键任务，我通常更倾向于直接开启一轮新对话，这样 Cursor 就能从一开始自动识别并应用所有相关的上下文规则。

## Cursor 项目规则的演变：从全局设置到上下文感知系统

我对 Cursor 项目规则的使用，大致经历了几个阶段：

### 第一阶段：把所有规则都塞进 Cursor IDE 全局设置

最开始，我把所有东西都写进 Cursor IDE 设置里。起步阶段这样做简单直接，也确实有效。随着我在工作流里逐渐总结出更多模式，这些全局规则也越来越长。每个新项目都能从中受益，但配置最终还是变得过于笨重，因为其中有太多规则并不适用于所有场景。

### 第二阶段：把项目专属规则移到仓库层

当我的全局设置被大量项目无关的信息撑得越来越臃肿时，我开始把规则迁移到仓库层。最初的方式是在仓库根目录使用 `.cursorrules` 文件，如今这已经属于旧方案。那时这成为我的主要做法，因为它让我可以针对每个项目定制 Cursor 项目规则，同时又维持统一标准。现在更推荐的方式，是使用 Rule Type 设为 "Always" 的 `.cursor/index.mdc`。

### 第三阶段：为专门任务使用动态上下文规则

当 Cursor IDE 引入 `.cursor/*.mdc` 动态规则后，我重新整理了整套体系。这些上下文感知规则只会在 AI 处理相关任务时启用。这样一来，我就可以：

- 让全局设置保持简洁，而且具有普适性
- 使用 Rule Type 设为 "Always" 的 `.cursor/index.mdc` 保存项目级标准，替代旧版 `.cursorrules`
- 为专门任务拆出聚焦的 `.cursor/*.mdc` 文件

这种分层方法能在恰当的时机，把恰当的指导交给 AI，减少噪音，让它提供的帮助更贴近当前任务。

这套演变过程，其实也反映了我对如何高效协作 AI 助手的理解在不断加深：先从宽泛规则出发，再逐步收敛成更贴合上下文、更面向任务的 Cursor 项目规则，从而最大化 AI 的实际效果。

## Cursor 项目规则三层完整对比：全局、仓库级、上下文感知

下面是 Cursor IDE 三层项目规则的快速对比：

| 对比项 | 全局 IDE 设置 | 仓库规则（`.cursor/index.mdc`，Rule Type 为 "Always"） | 上下文感知规则（`.cursor/*.mdc`） |
|--------|---------------|--------------------------------------------------------|-----------------------------------|
| **作用范围** | 所有项目 | 特定仓库 | 特定任务或上下文 |
| **可见性** | 仅自己可见（本地设置） | 仓库内整个团队可见 | 仓库内整个团队可见 |
| **持续性** | 跨项目持续生效 | 绑定在仓库上 | 绑定在仓库上 |
| **激活方式** | 始终生效 | 在该仓库中始终生效 | 仅在与当前任务相关时生效 |
| **最适合** | 通用的 Cursor 项目规则 | 项目架构模式 | 专门领域知识 |
| **Token 效率** | 低（始终存在） | 中（在该项目中始终存在） | 高（需要时才加载） |
| **配置位置** | Cursor 设置界面 | `.cursor/index.mdc` 文件 | `.cursor/rules/` 目录 |
| **可移植性** | 每台设备都要手动配置 | 克隆仓库后自动获得 | 克隆仓库后自动获得 |
| **旧方案兼容** | 不适用 | `.cursorrules` 仍可用，但属于旧方案 | 不适用 |

这种多层结构，让你既能保持规则一致性，又能更高效地利用 token。

## 如何把 Cursor 项目规则真正落到日常开发流程中

前面讲的是整体思路。下面说说，你可以怎样把类似的系统应用到自己的开发工作里。

### 为 AI 协作设置全局 Cursor 项目规则

如果你想在 Cursor IDE 中建立自己的全局 Cursor 项目规则，可以这样做：

1. 打开 Cursor IDE，进入 Settings（右上角按钮）
2. 找到 Cursor Settings > Rules for AI
3. 按照上面的结构添加你的核心规则
4. 让全局规则只关注真正适用于所有项目的通用编码标准
5. 用一些简单提示做测试，看看 AI 是否按你的要求作出响应

#### 如何更高效地管理本地 Cursor IDE 设置

关键在于找到平衡点：规则太少，AI 无法充分理解你的偏好；规则太多，又会把 token 浪费在当前并不相关的上下文上。

还需要注意一点，这些设置是保存在你本地 Cursor IDE 安装里的。你的同事默认看不到，除非他们也在自己的机器上做同样配置。另外，如果你会在多台电脑上使用 Cursor IDE，比如分开使用工作账号和个人账号，那就需要在每个安装环境里分别配置一次。

### 为团队创建仓库级 `.cursor/index.mdc` 文件

项目级配置可以这样做：

1. 在仓库里创建一个 `.cursor/index.mdc` 文件
2. 在 Cursor 界面里把 Rule Type 设为 "Always"（或者直接在文件中手动指定）
3. 从简短的项目概述开始，比如项目做什么、使用什么技术栈
4. 记录 AI 需要理解的架构模式
5. 补充这个项目特有的代码约定
6. 为了更高的 token 使用效率，尽量把文件控制在 100 行以内

补充说明：旧版 `.cursorrules` 仍然可用，但已经不是推荐方式。

#### 仓库级 Cursor 项目规则模板

下面是一个可以直接起步的最小模板：

```markdown
# Project: [Project Name]

## Overview
- Purpose: [Brief description]
- Stack: [Key technologies]
- Architecture: [Key pattern - MVC, microservices, etc.]

## Code Patterns
- [List project-specific patterns]

## Style Requirements
- [Project-specific style guidelines]
```

### 为专门任务建立上下文感知的 `.mdc` 规则文件

如果你想做更深入的配置，可以这样：

1. 在仓库中创建 `.cursor/rules/` 目录
2. 针对不同上下文添加对应的 `.mdc` 文件
3. 根据用途给文件起清晰、可读的名字
4. 让每个文件只聚焦一个具体问题
5. 在每个文件开头写一段简短说明，帮助 AI 判断何时应该应用这些规则

#### 创建规则文件：手动编写还是用 Cursor IDE 界面

你可以手动创建这些文件，也可以直接通过 Cursor IDE 界面完成：

1. 进入 Settings > Rules
2. 点击 "Add Rule"
3. 输入规则名称和描述
4. 添加自定义规则内容
5. 保存后，Cursor 会在仓库中自动创建对应的 `.mdc` 文件

两种方法都可行。手动创建能让你更细致地控制文件结构，而使用 Cursor 界面则会更有引导性。

#### React 开发中的规则文件示例

例如，一个 React 组件规则文件可以长这样：

```markdown
# React Component Guidelines

These rules apply when working with React components in this project.

## Component Structure
- Functional components with TypeScript interfaces for props
- Custom hooks for complex state management
- Styled components for styling

## Naming Conventions
- Component files: PascalCase.tsx
- Hook files: use[Name].ts
- Style files: [name].styles.ts
```

## 使用 Cursor 项目规则后能获得的实际收益

在实施这套多层 Cursor 项目规则系统之后，我在几个维度上都看到了比较明确的改善。

### 一致的 Cursor 项目规则如何提升代码质量

最直接的变化，是代码质量变得更稳定了。因为我的偏好已经被写进 Cursor 项目规则，AI 生成的代码会更自然地：

- 持续遵循函数式编程原则
- 在不需要额外提醒的情况下做好错误处理
- 自动补上合适的类型定义
- 保持一致的命名约定

这会直接转化成更少的代码审查意见，也减少了花在风格修正上的时间。就有一个项目在引入这些 Cursor 项目规则后，和代码风格相关的 PR 评论减少了 50%。

### 共享的 Cursor 项目规则如何改善团队协作

在团队协作场景里，Cursor 项目规则还能带来统一预期：

- 新成员可以通过 `.cursorrules` 文件快速理解团队要求
- 跨职能协作会更顺畅，因为工程师和非工程角色都可以参考同一套规则
- 随着 AI 持续应用最佳实践，知识分享也会自然发生

我尤其觉得这对带新人很有帮助。他们能更早收到关于最佳实践的反馈，而不必一直等到代码评审阶段。

### 优化 Cursor IDE AI 交互带来的生产力提升

数据本身已经很能说明问题：

- 向新成员解释代码规范所花的时间减少了大约 60%
- 首次提交 PR 的速度提升了大约 35%，返工轮次也更少
- 因为“修风格”产生的 commit 数量减少了大约 40%

但我认为最有价值的指标，其实是认知负担下降了。把风格层面的事情交给 AI 后，开发者就能把更多心力放在真正的问题上，而不是反复记忆格式和约定。

## 面向专业开发者的进阶 Cursor 项目规则技巧

当你已经熟悉基础规则结构之后，可以继续尝试这些进阶做法，进一步优化与 AI 协作的体验。

### 为常见开发场景建立专门的 Cursor 项目规则

我发现下面这些场景，特别适合拆成独立的 Cursor 项目规则文件：

#### 测试规则（`test-guidelines.mdc`）

- 尊重仓库现有的测试策略
- 优先使用集成测试、端到端测试和 smoke test，而不是默认新增单元测试
- 只在少数情况下使用单元测试，主要针对稳定数据集或纯数据转换
- 不要为了提高覆盖率数字而新增单元测试
- 只要真实调用可行，就尽量避免使用 mock
- 与其维护脆弱的 mock 测试，通常更值得为真实调用多花一点成本
- 只定义当前任务真正需要的最小覆盖范围

#### API 集成规则（`api-standards.mdc`）

- 错误处理预期
- 重试逻辑模式
- 认证流程标准

#### 状态管理规则（`state-patterns.mdc`）

- Redux action 的命名约定
- 状态规范化指导原则
- 副作用处理模式

通过这样的拆分，每个文件都能保持聚焦，并且只会在与你当前任务相关时才激活。

### 如何优化 Cursor 项目规则中的 token 使用

为了尽可能提高 AI 上下文窗口的利用效率，我通常会注意下面几点：

1. **优先强调重要内容**：把最关键的规则放在文件开头或结尾
2. **使用层级结构**：先写一般原则，再写具体要求
3. **去掉重复内容**：不要在多个地方反复写同一条规则
4. **语言尽量简洁**：多用要点列表，少用长段落
5. **利用 Markdown 结构**：用标题清楚区分不同规则类别

一个实用经验是：如果某个规则文件已经超过 100 行，它大概率承担了太多职责，应该继续拆成更聚焦的部分。

### 常见 Cursor 项目规则问题与排查方法

如果你的 Cursor 项目规则没有产生预期效果，可以先检查以下问题：

1. **规则冲突**：看看不同层级之间是否存在互相矛盾的要求
2. **过于笼统**：把 Cursor 项目规则写得更具体一些，最好带上明确例子
3. **过于狭窄**：过度局限的规则可能无法泛化到相似场景
4. **token 限制**：如果 Cursor 项目规则被截断，就需要重新排序并精简
5. **上下文缺失**：AI 可能需要额外的文件上下文，才能正确应用规则
6. **规则过载**：如果同一轮对话里同时出现太多 Cursor 项目规则，模型会更难同时记住并遵守它们

我的经验是，把 AI 生成的代码重新对照 Cursor 项目规则回看，再持续迭代这些规则，通常会让协作质量不断提升。

## Cursor IDE 与其他 AI 编码助手：配置方式对比

虽然 Cursor 的规则系统设计得尤其完善，但其他 AI 编码助手也提供了类似的自定义方式：

- GitHub Copilot 提供 `.github/copilot/settings.yml` 用于项目级配置
- JetBrains AI Assistant 支持项目级片段和模板
- VS Code 配合不同 AI 扩展时，也支持工作区设置和自定义配置文件

顺带一提，Cursor 从旧版 `.cursorrules` 演进到 Rule Type 设为 "Always" 的 `.cursor/index.mdc`，也说明这类系统本身仍在持续改进，以提供更好的灵活性和组织方式。

### Token 经济：在所有工具中都尽量节省上下文

这些方法背后有一个共同原则：**想要得到更好的结果，就必须尽量节省 token。** 不管你使用的是哪种 AI 编码助手，关键都在于给模型提供刚刚好的上下文，而不是让它淹没在冗长说明里。

在所有基于大语言模型的工具中，token 经济遵循同样的逻辑：

1. 你写进指令里的每一个词都会消耗 token
2. 用于指令的 token 越多，留给代码理解的上下文就越少
3. 指导内容一旦过度冗长，收益就会开始递减

所以，无论你使用的是 Cursor 的三层规则系统，还是别的工具提供的配置方式，都应该追求准确和简洁。把指导集中在真正重要的模式与偏好上，其余部分交给 AI 处理。

真正的优势，不在于哪个工具提供了最多的自定义选项，而在于你是否能有意识地使用这些选项，把自己的预期清楚表达出来，同时避免把 token 浪费在不必要的冗长内容上。

## 视频教程：完整演示 Cursor IDE 规则的实现过程

如果你更习惯通过视频学习，我也制作了一期完整教程，演示这套三层 Cursor 规则系统的完整实现方式：

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

视频中会演示：

- 如何在 Cursor IDE 设置中配置全局规则
- 如何结合真实案例创建仓库专属的 `.cursorrules` 文件
- 如何为专门任务实现上下文感知的 `.cursor/*.mdc` 文件
- 这几个层级如何协同工作，从而优化 AI 辅助效果
- 如何排查常见问题，以及如何优化 token 使用

你会看到整套工作流如何从初始设置一路延伸到进阶的多层配置，也能更直观地理解这种方式会如何改变你与 AI 助手的协作方式。

如果你还想看面向其他编码代理的配套文章，也可以继续读这里：

- Claude Code Rules for AI: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- Codex Rules for AI: [https://kirill-markin.com/articles/codex-rules-for-ai/](https://kirill-markin.com/articles/codex-rules-for-ai/)
