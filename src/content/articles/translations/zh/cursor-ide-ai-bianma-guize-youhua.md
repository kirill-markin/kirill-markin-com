---
title: "Cursor IDE 的 AI 规则：我长期使用的一套更稳、更一致的 AI 编码规范与工作流实践准则"
date: 2025-05-08
description: "分享我在 Cursor IDE 中长期使用的一套全局 AI 规则，并解释它如何与仓库级规则及按上下文触发的规则协同工作，帮助 AI 在代码风格、类型约束、错误处理、依赖管理和开发工作流上持续输出更稳定、更一致、更易维护的代码与决策，也让不同项目中的提示、修改与交付方式保持更统一。"
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

# Cursor IDE 的 AI 规则：一套更稳的 AI 编码准则

Cursor IDE 现在有三层规则：

1. Cursor IDE 设置里的 Rules for AI：对所有项目生效的全局规则
2. `.cursor/index.mdc` 文件，并将 Rule Type 设为 "Always"：仓库级规则，用来替代旧的 `.cursorrules`
3. `.cursor/rules/*.mdc` 文件：按上下文动态启用的规则，只有当 AI 处理相关任务时才会生效

这篇文章分享的是我放在 Cursor IDE 全局设置里的那套基础规则。它们是我所有开发工作的底层约束。再配合仓库级规则和动态规则，就能形成一套既能稳住代码质量、又能让开发方式保持一致的系统。

> **更想看视频？** 我录了一期完整演示，专门讲这套 Cursor 规则系统是怎么搭起来的。[点击观看《Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)》](https://www.youtube.com/watch?v=gw8otRr2zpw)，可以直接看到这些方法一步步落地。

[![Cursor IDE 规则配置与实际使用演示](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## 如何配置 Cursor 规则，让 AI 写代码更稳

Cursor -> Settings -> Cursor Settings -> Rules for AI:

下面这段规则我保留英文原文，方便你直接复制到 Cursor 设置里使用：

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

## 用多层 Cursor 规则把效率拉起来

在用 Cursor IDE 的 AI 功能时，我越来越确定一件事：规则不是越多越好，关键是三层规则要分工清楚。核心原则其实很简单，就是尽量减少每次对话里发给模型的 `token`。上下文越精简，模型就越有余量给出高质量结果。

如果你想进一步了解 Cursor 里的项目规则机制，可以看 [Cursor 官方的 Rules for AI 文档](https://docs.cursor.com/context/rules)。

### Cursor 项目规则的三步落地流程

1. **先只用 IDE 层设置**
   我通常先从全局 Cursor IDE 设置开始，先把最基础的偏好放进去。这样我可以先试规则怎么写最顺手，又不会让仓库变得臃肿。这个层级只放真正适用于所有项目的通用规则。

2. **把项目专属规则移到仓库层**
   当我发现某些模式只适用于特定代码库，或者我想把对 AI 的要求共享给团队时，就会把这些规则移到 `.cursor/index.mdc`，并把 Rule Type 设为 "Always"。这样既能让团队有统一理解，也能让全局设置保持精简。（补充一下：旧版 `.cursorrules` 仍然能用，但已经不推荐了。）

3. **必要时再拆成上下文规则**
   如果仓库级规则开始变得臃肿，我就继续拆成 `.cursor/*.mdc` 文件。这样只有相关规则才会在需要时加载，`token` 消耗更低。你可以把它理解成：别让模型背一整本手册，而是在需要的时候递给它对应那一页。

我的目标很直接：每次和 AI 助手对话时，只给它刚好够用的上下文，不浪费容量去塞当前不需要的信息。

## 真实仓库里的 Cursor 项目规则示例

为了说明我在不同代码库里怎么落地这些规则，下面给几个真实例子。

### 仓库级 `.cursor/index.mdc`：结构和用法

我会把 Rule Type 设为 "Always" 的 `.cursor/index.mdc` 当成一份写给 AI 助手看的 `README.md`。它主要提供项目用途、架构背景和需要遵循的代码模式。（旧版 `.cursorrules` 仍受支持，但新项目已经不建议继续使用。）

![仓库级 .cursorrules 文件示例](/articles/cursor-ide-rules-repo.webp)

#### 生产仓库中的实际示例

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**：这是一个把仓库转换成文本的工具，规则里会说明项目目标、架构决策，以及需要遵循的代码模式。

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**：这个 Telegram 机器人项目的规则更偏向机器人架构、API 使用方式，以及消息和命令的处理约定。

### `.cursor/*.mdc` 规则文件：什么时候用，怎么用

当仓库级规则变得太长时，我会把它们拆成只在特定上下文里启用的 `.cursor/*.mdc` 文件。

![Project Rules 区域中的上下文规则](/articles/cursor-ide-rules-specific.webp)

#### 针对具体任务的规则示例

一个很典型的例子是我的个人网站仓库：
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

在这个仓库里，我把规则拆成了几类：

- 内容管理工作流
- 图片优化要求
- SEO 最佳实践
- 组件架构模式
- 部署流程

这样做的好处是，AI 能更专注，不会在处理某个具体任务时被大量无关信息淹没。

### 在对话中途引入规则：限制和最佳实践

这里有个很重要的限制：上下文感知的 `.mdc` 规则，最适合在新对话一开始就生效。如果你已经在 Cursor IDE 里聊到一半，突然又需要应用某条专门规则，比如数据库查询规范，AI 可能不会自动去读取那份规则文件。原因是 Cursor 已经为当前对话建立好了上下文，不一定会在中途重新判断该加载哪些规则。

碰到这种情况时，我会直接点明我要它遵循什么，比如：`请按我们项目的数据库查询规范处理这个任务。` 这样 Cursor 更容易去查找并应用对应规则。对于那些非常依赖特定规范的关键任务，我通常更倾向于直接开一个新对话，让 Cursor 从一开始就自动识别并应用所有相关规则。

## Cursor 项目规则是怎么一步步演变出来的

我这套 Cursor 项目规则，大致经历了几个阶段。

### 第一阶段：把所有规则都塞进 Cursor IDE 全局设置

刚开始时，我把所有东西都写进 Cursor IDE 设置里。起步阶段这种方式很直接，也确实有效。后来我在工作流里总结出的模式越来越多，全局规则也越写越长。虽然每个新项目都能受益，但配置最终还是变得太重了，因为很多规则根本不适用于所有场景。

### 第二阶段：把项目专属规则移到仓库层

当全局设置里混入越来越多项目无关的信息后，我开始把规则迁移到仓库层。最初的做法是在仓库根目录放 `.cursorrules`，现在这已经算旧方案了。那一阶段它成了我的主要方式，因为我可以按项目定制 Cursor 项目规则，同时又保留一致的标准。现在更推荐的做法，是使用 Rule Type 设为 "Always" 的 `.cursor/index.mdc`。

### 第三阶段：为专门任务使用动态上下文规则

当 Cursor IDE 引入 `.cursor/*.mdc` 动态规则后，我把整套体系重新整理了一遍。这些上下文规则只会在 AI 处理相关任务时启用。这样一来，我就可以：

- 让全局设置保持简洁，而且足够通用
- 用 Rule Type 设为 "Always" 的 `.cursor/index.mdc` 保存项目级标准，替代旧版 `.cursorrules`
- 为专门任务拆出更聚焦的 `.cursor/*.mdc` 文件

这种分层方式的好处是，AI 能在合适的时候拿到合适的指导，噪音更少，输出也更贴近当前任务。

这套演变过程，本质上也是我对如何更高效地和 AI 助手协作的理解在不断收敛：先从宽泛规则开始，再一步步变成更贴近上下文、更贴近任务的规则系统。

## Cursor 项目规则三层对比：全局、仓库级、上下文感知

下面是 Cursor IDE 这三层项目规则的快速对比：

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

这种多层结构能兼顾一致性和 `token` 效率。

## 如何把 Cursor 项目规则真正用进日常开发

前面讲的是思路。下面说说，怎么把类似的系统真正落到自己的开发工作里。

### 为 AI 协作设置全局 Cursor 项目规则

如果你想在 Cursor IDE 里建立自己的全局 Cursor 项目规则，可以这样做：

1. 打开 Cursor IDE，进入 Settings（右上角按钮）
2. 找到 Cursor Settings > Rules for AI
3. 按照上面的结构加入你的核心规则
4. 让全局规则只关注真正适用于所有项目的通用编码标准
5. 用几个简单提示测试一下，看看 AI 是否按你的要求响应

#### 如何更高效地管理本地 Cursor IDE 设置

关键在于平衡。规则太少，AI 不够了解你的偏好；规则太多，又会把 `token` 浪费在当前不相关的上下文上。

另外，这些设置是保存在你本地 Cursor IDE 里的。你的同事默认看不到，除非他们也在自己的机器上做同样配置。如果你会在多台电脑上使用 Cursor IDE，比如工作账号和个人账号分开，那也需要在每个安装环境里分别配置一次。

### 为团队创建仓库级 `.cursor/index.mdc` 文件

项目级配置可以这样做：

1. 在仓库里创建 `.cursor/index.mdc`
2. 在 Cursor 界面里把 Rule Type 设为 "Always"（或者直接在文件里手动指定）
3. 从简短的项目概述开始，比如项目做什么、用了什么技术栈
4. 记录 AI 需要理解的架构模式
5. 补充这个项目特有的代码约定
6. 为了提升 `token` 使用效率，尽量把文件控制在 100 行以内

补充一下：旧版 `.cursorrules` 仍然能用，但已经不是推荐方式。

#### 仓库级 Cursor 项目规则模板

下面这个最小模板保留英文，方便你直接复制后再按项目实际情况改写：

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

1. 在仓库里创建 `.cursor/rules/` 目录
2. 针对不同上下文添加对应的 `.mdc` 文件
3. 按用途给文件起清晰、好懂的名字
4. 每个文件只聚焦一个具体问题
5. 在每个文件开头写一小段说明，帮助 AI 判断什么时候该应用这些规则

#### 创建规则文件：手动写还是用 Cursor IDE 界面

你可以手动创建这些文件，也可以直接通过 Cursor IDE 界面完成：

1. 进入 Settings > Rules
2. 点击 "Add Rule"
3. 输入规则名称和描述
4. 添加自定义规则内容
5. 保存后，Cursor 会在仓库里自动创建对应的 `.mdc` 文件

两种方式都可以。手动创建更方便你精确控制文件结构，而 Cursor 界面则更适合按步骤完成配置。

#### React 开发中的规则文件示例

下面是一个 React 组件规则文件示例。这里保留英文写法，方便直接复用：

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

## 使用 Cursor 项目规则后能看到的实际收益

把这套多层 Cursor 项目规则跑起来之后，我在几个维度上都看到了比较明确的改善。

### 一致的 Cursor 项目规则如何提升代码质量

最直接的变化，就是代码质量更稳了。因为我的偏好已经写进 Cursor 项目规则里，AI 生成的代码会更自然地：

- 持续遵循函数式编程原则
- 在不需要额外提醒的情况下处理好错误
- 自动补上合适的类型定义
- 保持一致的命名约定

这会直接带来更少的 review 评论，也减少了花在修风格上的时间。有个项目在引入这些 Cursor 项目规则后，PR 里和代码风格相关的评论减少了 50%。

### 共享的 Cursor 项目规则如何改善团队协作

在团队协作场景里，Cursor 项目规则还能帮助大家对齐预期：

- 新成员可以通过 `.cursorrules` 很快理解团队要求
- 跨职能协作会更顺畅，因为工程师和非工程角色都能参考同一套规则
- AI 持续应用最佳实践时，知识传递也会自然发生

我尤其觉得这对带新人很有帮助。他们能更早收到关于最佳实践的反馈，而不用一直等到代码评审阶段。

### 优化 Cursor IDE AI 交互带来的生产力提升

数据本身已经很能说明问题：

- 给新成员解释代码规范的时间减少了大约 60%
- 首次提交 PR 的速度提升了大约 35%，返工轮次也更少
- 因为“修风格”产生的 commit 数量减少了大约 40%

但我觉得最有价值的，其实是认知负担下降了。把风格层面的事交给 AI 后，开发者就能把更多心力放在真正的问题上，而不是反复记忆格式和约定。

## 面向专业开发者的进阶 Cursor 项目规则技巧

当你已经熟悉基础规则结构后，可以继续尝试下面这些进阶做法，进一步优化与 AI 的协作体验。

### 为常见开发场景建立专门的 Cursor 项目规则

我发现下面这些场景，特别适合拆成独立的 Cursor 项目规则文件：

#### 测试规则（`test-guidelines.mdc`）

- 尊重仓库现有的测试策略
- 优先使用集成测试、端到端测试和冒烟测试（smoke tests），而不是默认新增单元测试
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

这样拆分之后，每个文件都能保持聚焦，而且只会在和当前任务相关时才激活。

### 如何优化 Cursor 项目规则里的 `token` 使用

为了尽量提高 AI 上下文窗口的利用效率，我通常会注意这几点：

1. **优先放重要内容**：把最关键的规则放在文件开头或结尾
2. **使用层级结构**：先写一般原则，再写具体要求
3. **去掉重复内容**：不要在多个地方反复写同一条规则
4. **语言尽量简洁**：多用要点列表，少用长段落
5. **利用 Markdown 结构**：用标题清楚区分不同规则类别

一个实用经验是：如果某个规则文件已经超过 100 行，它大概率承担了太多职责，应该继续拆成更聚焦的部分。

### 常见 Cursor 项目规则问题与排查方法

如果你的 Cursor 项目规则没有达到预期效果，可以先检查这些问题：

1. **规则冲突**：看看不同层级之间是否有互相矛盾的要求
2. **过于笼统**：把规则写得更具体一些，最好带上明确例子
3. **过于狭窄**：过度局限的规则可能无法泛化到相似场景
4. **`token` 限制**：如果规则被截断，就需要重新排序并精简
5. **上下文缺失**：AI 可能还需要额外的文件上下文，才能正确应用规则
6. **规则过载**：如果同一轮对话里同时出现太多规则，模型会更难同时记住并遵守它们

我的经验是，把 AI 生成的代码重新对照 Cursor 项目规则回看，再持续迭代这些规则，通常会让协作质量越来越高。

## Cursor IDE 和其他 AI 编码助手：配置方式怎么比

虽然 Cursor 的规则系统设计得尤其成熟，但其他 AI 编码助手也提供了类似的自定义方式：

- GitHub Copilot 提供 `.github/copilot/settings.yml` 用于项目级配置
- JetBrains AI Assistant 支持项目级片段和模板
- VS Code 配合不同 AI 扩展时，也支持工作区设置和自定义配置文件

顺带一提，Cursor 从旧版 `.cursorrules` 演进到 Rule Type 设为 "Always" 的 `.cursor/index.mdc`，也说明这类系统还在持续演进，目标就是提供更好的灵活性和组织方式。

### Token 经济：在所有工具里都尽量节省上下文

这些方法背后有一个共同原则：**想得到更好的结果，就要尽量节省 `token`。** 不管你用的是哪种 AI 编码助手，关键都在于给模型刚刚好的上下文，而不是让它淹没在冗长说明里。

在所有基于大语言模型的工具里，`token` 这笔“上下文预算”都遵循同一套逻辑：

1. 你写进指令里的每一个词都会消耗 `token`
2. 用于指令的 `token` 越多，留给代码理解的上下文就越少
3. 指导内容一旦过度冗长，收益就会开始递减

所以，无论你使用的是 Cursor 的三层规则系统，还是别的工具提供的配置方式，都应该尽量准确、简洁。把指导集中在真正重要的模式和偏好上，其余部分交给 AI 处理就好。

真正的优势不在于哪个工具给了最多的自定义选项，而在于你能不能有意识地用好这些选项，把自己的预期说清楚，同时避免把 `token` 浪费在不必要的冗长内容上。

## 视频教程：完整演示 Cursor IDE 规则的实现过程

如果你更习惯通过视频学习，我也做了一期完整教程，演示这套三层 Cursor 规则系统是怎么实现的：

[![Cursor IDE 规则完整视频教程封面](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

视频里会演示：

- 如何在 Cursor IDE 设置中配置全局规则
- 如何结合真实案例创建仓库专属的 `.cursorrules`
- 如何为专门任务实现上下文感知的 `.cursor/*.mdc`
- 这几个层级如何协同工作，从而优化 AI 辅助效果
- 如何排查常见问题，以及如何优化 `token` 使用

你会看到整套工作流如何从初始设置一路延伸到更进阶的多层配置，也能更直观地理解这种方式会如何改变你和 AI 助手的协作方式。

如果你还想看面向其他编码代理的配套文章，也可以继续看这两篇：

- Claude Code 相关文章：[Claude Code Rules for AI](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- Codex 相关文章：[Codex Rules for AI](https://kirill-markin.com/articles/codex-rules-for-ai/)
