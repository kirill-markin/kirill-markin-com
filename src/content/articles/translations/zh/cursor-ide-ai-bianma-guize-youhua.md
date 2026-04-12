---
title: "Cursor IDE 的 AI 规则：面向专业 AI 助手的指南"
date: 2025-05-08
description: "这是我在 Cursor IDE 中使用的一套基础规则，用来通过统一的代码风格、错误处理和工作流约定，让 AI 更稳定地生成高质量代码。"
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

# Cursor IDE 的 AI 规则：面向专业 AI 助手的指南

Cursor IDE 目前有三层规则：

1. Cursor IDE 设置里的 Rules for AI：适用于所有项目的全局基础规则
2. `.cursor/index.mdc` 文件，Rule Type 设为 "Always"：仓库级项目规则，用来替代旧的 `.cursorrules` 方案
3. `.cursor/rules/*.mdc` 文件：按上下文动态启用的项目规则，只会在 AI 处理与其描述相关的任务时生效

这里我分享的是自己的基础级规则，也就是我在 Cursor IDE 里使用的全局设置。它们是我所有开发工作的底层约束。和仓库级规则、动态规则结合后，这套体系既能保持代码质量，也能让我在不同项目里维持一致的开发习惯。

> **更喜欢视频教程？** 我录了一期完整的视频，演示这套 Cursor 规则系统的整体思路。[观看 Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](https://www.youtube.com/watch?v=gw8otRr2zpw)，可以看到这些做法是怎样一步步落地的。

[![Cursor IDE 规则配置与实际使用演示](/articles/cursor-ide-rules-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

## 如何配置 Cursor 规则，以获得更好的 AI 编码效果

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

在使用 Cursor IDE 的 AI 功能时，我发现关键在于把三层项目规则都配置好。核心思路只有一个：尽量减少每次对话里发给语言模型的 token。上下文占用越少，模型就越有空间生成更高质量的回答。

如果你想进一步了解 Cursor 里的项目规则机制，可以看 [Cursor 官方关于 Rules for AI 的文档](https://docs.cursor.com/context/rules)。

### Cursor 项目规则的三步实施流程

1. **先只用 IDE 级设置**  
   我会先从全局 Cursor IDE 设置开始，建立最基本的偏好。这让我可以先试验不同规则的写法，而不会把仓库弄得很杂。这个层级只放真正适用于所有项目的规则。

2. **把项目专属规则移到仓库级**  
   当我发现某些模式只适用于特定代码库，或者想把 AI 约束分享给团队成员时，我会把这些规则移到 `.cursor/index.mdc`，并把 Rule Type 设为 "Always"。这样既能形成团队共识，也能让全局设置保持精简。（补充说明：旧的 `.cursorrules` 仍然可用，但已经不再推荐。）

3. **必要时再拆成上下文感知规则**  
   如果 `.cursorrules` 或仓库级规则文件变得太臃肿，我会继续拆成多个 `.cursor/*.mdc` 文件。这样做的好处是，只有在真正相关时才会加载对应规则，能减少 token 消耗。你可以把它理解成：不给模型塞一堆当前任务无关的说明，让它把注意力留给眼前的问题。

我的目标很简单：每次和 AI 助手对话时，只给它足够有用的上下文，而不是把不需要的信息也一起塞进去。

## 来自真实仓库的 Cursor 项目规则示例

为了说明我是怎样在不同代码库里使用这些规则的，这里放几个真实例子。

### 仓库级 `.cursor/index.mdc` 文件：结构与用法

我会把 Rule Type 设为 "Always" 的 `.cursor/index.mdc` 当成一份专门写给 AI 助手看的 `README.md`。它主要提供项目用途、架构背景，以及应该遵循的编码模式。（旧版 `.cursorrules` 仍受支持，但新项目不建议再用。）

![仓库级 .cursorrules 文件示例](/articles/cursor-ide-rules-repo.webp)

#### 生产仓库里的实际示例

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**：这个把仓库转换成文本的工具，规则里会说明项目目的、架构决策，以及需要遵循的代码模式。

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**：这个 Telegram 机器人项目的规则更偏向架构说明、API 使用方式，以及消息和命令的处理约定。

### `.cursor/*.mdc` 规则文件：何时使用，怎么使用

当仓库级规则写得太多时，我会把它们拆成只在特定上下文中生效的 `.cursor/*.mdc` 文件。

![Project Rules 区域中的上下文规则](/articles/cursor-ide-rules-specific.webp)

#### 针对任务的规则示例

一个很典型的例子是我的个人网站仓库：  
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

在这个仓库里，我把规则拆成了几个独立文件，分别用于：

- 内容管理工作流
- 图片优化要求
- SEO 最佳实践
- 组件架构模式
- 部署流程

这样做的好处是，AI 能更专注，不会在处理某个具体任务时被无关信息干扰。

### 在对话中途引入规则的限制与最佳实践

有一个限制需要注意：这类上下文感知 `.mdc` 规则，在新对话开始时效果最好。如果你已经在 Cursor IDE 里进行到一半，突然又需要某条专门规则，比如数据库查询规范，AI 不一定会自动读取对应的规则文件。原因是 Cursor 已经为当前对话建立好了上下文，不一定会在中途重新判断应该加载哪些规则。

遇到这种情况时，我会直接说明我要用哪条规则，比如：“请按我们的数据库查询规范处理这个任务。” 这样能提醒 Cursor 去查找并应用对应规则。对于那些非常依赖特定规范的任务，我一般更倾向于直接开一个新对话，这样 Cursor 会从一开始就自动识别并应用相关的上下文规则。

## Cursor 项目规则的演变：从全局设置到上下文系统

我对 Cursor 项目规则的使用，大致经历了几个阶段。

### 第一阶段：把所有规则都塞进全局设置

一开始，我把所有东西都写进 Cursor IDE 设置里。最初这样很简单，也确实有效。但随着我在工作流中总结出的模式越来越多，全局规则也越写越长，最后变得很难维护，因为很多规则并不适用于所有项目。

### 第二阶段：把项目专属规则移到仓库级

当全局设置开始混入大量项目无关的信息时，我转向了仓库级规则。最早是把 `.cursorrules` 放在仓库根目录里，现在它已经属于旧方案。这个阶段成为我主要的做法，因为它能让我按项目定制规则，同时保留一致的标准。现在更推荐的是使用 Rule Type 设为 "Always" 的 `.cursor/index.mdc`。

### 第三阶段：为专门任务使用动态上下文规则

当 Cursor IDE 引入 `.cursor/*.mdc` 动态规则后，我重新整理了整套配置。这类上下文规则只会在 AI 处理相关任务时启用。这样我就可以：

- 让全局设置保持简短，而且足够通用
- 用 Rule Type 为 "Always" 的 `.cursor/index.mdc` 保存项目级标准，替代旧的 `.cursorrules`
- 为专门任务拆出聚焦的 `.cursor/*.mdc` 文件

这种分层方式，本质上是在我当前所做的事情上，及时给 AI 足够有用的提示，减少噪音，让它的帮助更贴题。

这套演变过程，其实也反映了我对如何与 AI 助手协作的理解在逐步加深：先从宽泛规则开始，再不断收敛到更贴合上下文、也更面向任务的项目规则。

## Cursor 项目规则三层对比：全局、仓库级、上下文感知

下面是 Cursor IDE 这三层规则的简要对比：

| Feature | Global IDE Settings | Repository Rules (.cursor/index.mdc "Always") | Context-Aware Rules (.cursor/*.mdc) |
|---------|--------------------|-----------------------------|----------------------------------|
| **Scope** | All projects | Specific repository | Specific tasks or contexts |
| **Visibility** | Only you (local settings) | Entire team via repository | Entire team via repository |
| **Persistence** | Stays across projects | Tied to the repository | Tied to the repository |
| **Activation** | Always active | Always active for repository | Only when relevant to current task |
| **Best for** | Universal cursor project rules | Project architecture patterns | Specialized domain knowledge |
| **Token efficiency** | Low (always present) | Medium (always present for project) | High (only loads when needed) |
| **Setup location** | Cursor settings UI | .cursor/index.mdc file | .cursor/rules/ directory |
| **Portability** | Requires manual setup on each device | Automatic with repository clone | Automatic with repository clone |
| **Legacy support** | N/A | .cursorrules still works (legacy) | N/A |

这种多层结构，可以在保持规则一致性的同时，更高效地利用 token。

## 如何把 Cursor 项目规则真正用进日常开发流程

前面讲的是我的思路，下面说说你可以怎样把类似系统用到自己的开发工作里。

### 为 AI 协作设置全局 Cursor 项目规则

如果你想在 Cursor IDE 里建立自己的全局规则，可以这样做：

1. 打开 Cursor IDE，进入 Settings（右上角按钮）
2. 找到 Cursor Settings > Rules for AI
3. 按照上面的格式写入你的核心规则
4. 全局规则只保留真正适用于所有项目的通用编码标准
5. 用一些简单提示测试，看看 AI 是否按你的要求响应

#### 怎样更高效地管理本地 Cursor IDE 设置

关键在于平衡。规则太少，AI 不容易理解你的偏好；规则太多，又会把 token 浪费在当前无关的上下文上。

还要注意一点：这些设置保存在你本地的 Cursor IDE 中。你的同事默认是看不到的，除非他们也在自己的机器上做同样配置。如果你在多台电脑上使用 Cursor IDE，比如一台工作电脑、一台个人电脑，那每个环境都需要单独设置。

### 为团队创建仓库级 `.cursor/index.mdc` 文件

项目级配置可以这样做：

1. 在仓库中创建 `.cursor/index.mdc`
2. 在 Cursor 界面中把 Rule Type 设为 "Always"（也可以手动写入）
3. 先写一个简短的项目概述，比如项目做什么、技术栈是什么
4. 写清楚 AI 需要理解的架构模式
5. 加入这个项目特有的代码约定
6. 为了更省 token，尽量把文件控制在 100 行以内

补充说明：旧的 `.cursorrules` 仍然可用，但已经不是推荐方案。

#### 一个可直接使用的仓库级规则模板

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

如果你想做更细的配置，可以这样：

1. 在仓库里创建 `.cursor/rules/` 目录
2. 为不同上下文分别建立 `.mdc` 文件
3. 用能准确表达用途的文件名
4. 每个文件只处理一个具体问题
5. 在文件开头写一句简短说明，帮助 AI 判断什么时候该用这条规则

#### 创建规则文件：手动写，还是用 Cursor IDE 界面

你可以手动创建这些文件，也可以直接通过 Cursor IDE 的界面完成：

1. 进入 Settings > Rules
2. 点击 "Add Rule"
3. 输入规则名称和说明
4. 写入你的规则内容
5. 保存后，Cursor 会在仓库里自动创建对应的 `.mdc` 文件

两种方式都可以。手动创建更方便你控制文件结构，而界面方式会更有引导感。

#### React 开发中的规则文件示例

比如，一个 React 组件规则文件可以长这样：

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

## 使用 Cursor 项目规则后，能带来哪些实际收益

在把这套多层规则体系真正用起来之后，我在几个方面都看到了比较明确的改进。

### 通过一致规则提升代码质量

最直接的变化，是代码质量变得更稳定了。因为我的偏好已经写进规则里，AI 生成的代码会更自然地：

- 持续遵守函数式编程原则
- 在不需要额外提醒的情况下做好错误处理
- 自动补上合适的类型定义
- 维持统一的命名风格

这意味着代码审查里的风格类评论会变少，花在样式修正上的时间也更少。有一个项目在引入这些规则之后，和代码风格相关的 PR 评论减少了 50%。

### 用共享规则改善团队协作

在团队环境里，项目规则也能带来统一预期：

- 新成员可以通过 `.cursorrules` 更快理解团队要求
- 工程师和非工程角色都可以基于同一套规则沟通
- AI 会稳定应用最佳实践，知识共享会自然发生

我尤其觉得这对带新人很有帮助。他们能更早收到关于最佳实践的反馈，而不用一直等到代码评审阶段。

### 优化 Cursor IDE 交互后带来的效率提升

从结果上看，也有一些比较直观的收益：

- 向新成员解释代码规范所花的时间减少了大约 60%
- 初次提交 PR 的速度提升了大约 35%，返工轮次更少
- 因为“修风格”而产生的 commit 数量减少了大约 40%

但我觉得最有价值的，其实是认知负担降低了。把风格和约束交给 AI 处理后，开发者能把注意力放回真正的问题上，而不是反复记忆格式细节。

## 面向专业开发者的进阶 Cursor 项目规则技巧

当你已经熟悉基本规则结构后，可以继续尝试一些更进阶的做法，让 AI 的配合更稳定。

### 为常见开发场景建立专门规则

我发现下面这些场景，很适合拆成独立的规则文件：

#### 测试规则（`test-guidelines.mdc`）

- 尊重仓库现有的测试策略
- 优先做集成测试、端到端测试和 smoke test，而不是默认新增单元测试
- 单元测试只在少数情况下使用，主要用于稳定数据集或纯数据转换
- 不要为了提高覆盖率数字而新增单元测试
- 如果真实调用可行，就尽量少用 mock
- 与其维护脆弱的 mock 测试，通常更值得为真实调用多花一点成本
- 只补当前任务真正需要的最小测试覆盖

#### API 集成规则（`api-standards.mdc`）

- 错误处理预期
- 重试逻辑模式
- 认证流程标准

#### 状态管理规则（`state-patterns.mdc`）

- Redux action 的命名约定
- 状态规范化的指导原则
- 副作用处理模式

这样拆分后，每个文件都更聚焦，也只会在真正相关的时候被启用。

### 如何优化 Cursor 项目规则里的 token 使用

为了更有效地利用 AI 的上下文窗口，我会注意以下几点：

1. **优先级靠前**：把最重要的规则放在文件开头或结尾
2. **层级清晰**：先写总原则，再写具体要求
3. **避免重复**：同一条规则不要在多个地方反复出现
4. **语言简洁**：尽量用要点式表达，而不是长段落
5. **利用 Markdown 结构**：用标题把规则分类清楚

一个经验判断是：如果某个规则文件已经超过 100 行，通常说明它承担的内容太多了，应该继续拆开。

### 常见问题与排查方法

如果你的 Cursor 项目规则没有达到预期效果，可以先检查这些问题：

1. **规则冲突**：看看不同层级里是否有彼此矛盾的要求
2. **过于笼统**：可以把规则写得更具体一些，最好带明确例子
3. **过于狭窄**：太局限的规则可能无法迁移到相似场景
4. **token 限制**：如果规则被截断，就要重新排序并删减
5. **上下文不足**：AI 可能还需要更多相关文件，才能正确应用规则
6. **规则过载**：如果同一轮对话里同时出现太多规则，模型会更难同时记住并遵守它们

我的经验是，把 AI 生成的代码重新对照规则回看，再持续调整规则写法，往往能不断提高协作质量。

## Cursor IDE 与其他 AI 编码助手：配置方式对比

虽然 Cursor 的规则系统设计得尤其完整，但其他 AI 编码助手也有类似的自定义方式：

- GitHub Copilot 可以用 `.github/copilot/settings.yml` 做项目级配置
- JetBrains AI Assistant 有项目级片段和模板
- VS Code 配合不同的 AI 扩展，也支持工作区设置和自定义文件

顺带一提，Cursor 从旧的 `.cursorrules` 逐步演进到 Rule Type 为 "Always" 的 `.cursor/index.mdc`，也说明这类系统本身还在持续改进，以便提供更灵活、更清晰的组织方式。

### Token 经济：在所有工具里都尽量留出更多上下文

这些做法背后有一个共同原则：**想要获得更好的结果，就要尽量节省 token。** 不管你用的是哪种 AI 编码助手，关键都在于给它刚刚好的上下文，而不是把模型淹没在大量说明里。

在所有基于大语言模型的工具里，token 的基本逻辑都是一样的：

1. 你写进指令里的每个词都会消耗 token
2. 用于指令的 token 越多，留给代码理解的上下文就越少
3. 指导写得极度冗长，收益会越来越低

所以，不管你是在用 Cursor 的三层规则系统，还是别的工具提供的配置方式，原则都一样：尽量精确，也尽量简洁。把说明集中在真正重要的模式和偏好上，其余部分交给 AI。

真正的优势，不在于哪个工具能配置得最多，而在于你是否能用现有能力，把自己的预期表达清楚，同时不把 token 浪费在不必要的冗长内容上。

## 视频教程：完整看一遍 Cursor IDE 规则的实际配置

如果你更习惯看视频，我也做了一期完整教程，演示这套三层 Cursor 规则系统是怎样搭建的：

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://www.youtube.com/watch?v=gw8otRr2zpw)

视频内容包括：

- 如何在 Cursor IDE 设置里配置全局规则
- 如何结合真实案例创建仓库级 `.cursorrules` 文件
- 如何为专门任务建立上下文感知的 `.cursor/*.mdc` 文件
- 这几个层级是怎样协同工作的
- 常见问题的排查，以及 token 使用的优化方法

你可以看到从最初设置到多层配置的完整过程，也能更直观地理解这种方式会怎样改变你和 AI 助手的协作方式。

如果你还想看面向其他编码代理的配套文章，也可以继续看这里：

- Claude Code Rules for AI: [https://kirill-markin.com/articles/claude-code-rules-for-ai/](https://kirill-markin.com/articles/claude-code-rules-for-ai/)
- Codex Rules for AI: [https://kirill-markin.com/articles/codex-rules-for-ai/](https://kirill-markin.com/articles/codex-rules-for-ai/)
