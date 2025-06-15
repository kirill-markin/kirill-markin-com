---
title: "Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant"
date: 2025-04-19
description: "My battle-tested Cursor IDE rules that enhance AI coding with tailored style, error handling, and workflow patterns for consistent, quality results."
tags: [productivity, cursor-ide, ai, llm]
publish: true
thumbnailUrl: "/articles/cursor-ide-rules-for-ai.webp"
language: "en"
translations:
  - language: "es"
    slug: "reglas-cursor-ide-para-ia"
  - language: "zh"
    slug: "cursor-ide-ai-bianma-guize-youhua"
  - language: "hi"
    slug: "cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye"
  - language: "ar"
    slug: "qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja"
---

# Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant

Cursor IDE implements three levels of cursor rules:

1. Rules for AI in Cursor IDE settings - base cursor rules that apply globally to all projects
2. `.cursor/index.mdc` file with Rule Type "Always" - repository-specific cursor project rules (replaces legacy `.cursorrules` approach)
3. `.cursor/rules/*.mdc` files - dynamic cursor project rules that only activate when AI tackles tasks relevant to their description

I'm sharing my base-level cursor project rules here - the global settings I use in Cursor IDE. These rules form the foundation for all my development work. When combined with repository-level and dynamic rules, they create a powerful system that maintains code quality while keeping my development practices consistent.

> **Prefer Video Tutorial?** I've created a comprehensive video walkthrough of this entire cursor rules system. [Watch Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx) to see these techniques implemented step-by-step.

[![Cursor IDE Rules configuration and implementation in action](/articles/cursor-ide-rules-tutorial.webp)](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx)

## How to Configure Cursor Rules for Optimal AI Coding Performance

Cursor -> Settings -> Cursor Settings -> Rules for AI:

```markdown
<cursorrules_instructions_to_the_dialog>

<cursorrules_code_style>
- Comments in English only
- Prefer functional programming over OOP
- Use separate OOP classes only for connectors and interfaces to external systems
- Write all other logic with pure functions (clear input/output, no hidden state changes)
- Functions must ONLY modify their return values - never modify input parameters, global state, or any data not explicitly returned
- Make minimal, focused changes
- Follow DRY, KISS, and YAGNI principles
- Use strict typing (function returns, variables) in all languages
- Use named parameters in function calls when possible
- No duplicate code; check if some logic is already written before writing it
- Avoid unnecessary wrapper functions without clear purpose
- Prefer strongly-typed collections over generic ones when dealing with complex data structures
- Consider creating proper type definitions for non-trivial data structures
- Native types are fine for simple data structures, but use proper models for complex ones
- Try to avoid using untyped variables and generic types where possible
- Never use default parameter values in function definitions - make all parameters explicit
</cursorrules_code_style>

<cursorrules_error_handling>
- Always raise errors explicitly, never silently ignore them
- If an error occurs in any logical part of code, raise it immediately and do not continue execution
- Use specific error types that clearly indicate what went wrong
- Avoid catch-all exception handlers that hide the root cause
- Error messages should be clear and actionable
- Log errors with appropriate context before raising them
</cursorrules_error_handling>

<cursorrules_python_specifics>
- Prefer Pydantic over TypedDict for data models (e.g., `class ContactData(BaseModel): ...`)
- Avoid `Any` and `@staticmethod`
- Use `pyproject.toml` over `requirements.txt` when possible
- For complex structures, avoid generic collections like `List[Dict[str, Any]]`
- Raise specific exceptions like `ValueError` or `TypeError` instead of generic `Exception`
- Only use classes for clients that connect to external systems (e.g., `NotionClient`)
- For business logic, use pure functions with client as first parameter: `def change(notion_client: NotionClient, param1: str, param2: int) -> Result:`
</cursorrules_python_specifics>

<cursorrules_typescript_specifics>
- Prefer interfaces over type aliases for complex object shapes
- Use typed objects for complex state management
- Use Error objects with descriptive messages: `throw new Error('Specific message')`
- Leverage discriminated unions for complex type scenarios
</cursorrules_typescript_specifics>

<cursorrules_libraries_and_dependencies>
- Install in virtual environments, not globally
- Add to project configs, not one-off installs
- Use source code exploration for understanding
- Prefer project-level dependency management over individual package installation:
  - GOOD: `pip install -r requirements.txt`
  - BETTER: Use `pyproject.toml` with modern Python packaging
- When adding dependencies, update the appropriate project configuration file, not just the environment
</cursorrules_libraries_and_dependencies>

<cursorrules_terminal_usage>
- Run `date` for date-related tasks
- Use GitHub CLI with `printf` for multiline text:
  `git commit -m "$(printf "Title\n\n- Point 1\n- Point 2")"`
- Always use non-interactive git diff commands with: `git --no-pager diff` or `git diff | cat`. NO `git diff` or `git diff --cached`.
- Always prefer commands with parameters that don't require user interaction over interactive ones (use flags, environment variables, or configuration files to avoid prompts)
</cursorrules_terminal_usage>

<cursorrules_planning_practices>
- User can ask you to create a plan for the feature implementation
- You MUST create a tmp directory
- You MUST create a markdown file with the feature plan in the tmp directory
- This feature plan file must contain the following sections:
  1. Overview of current state related to the feature
  2. Overview of the final state of the feature
  3. List of all files to change with text description of what to change (not a code)
  4. Checklist of all tasks that need to be done in 2-level markdown checkbox style
- This feature plan file MUST be minimalistic and contain only the most important minimal changes related to the feature, all additional changes can be described as ideas in additional section, but MUST NOT be implemented if user didn't ask for them
</cursorrules_planning_practices>

<cursorrules_repository_practices>
- Read `README.md` if there is no `.cursorrules` file
- Summarize project before working on it
</cursorrules_repository_practices>

<cursorrules_code_changes>
- You MUST respect existing code style and patterns if the user didn't specify otherwise
- You MUST suggest only minimal changes related to current user dialog
- You MUST change as few lines as possible while solving the problem
- You MUST focus only on what the user is asking for in the current dialog, no extra improvements
- You MUST understand the existing codebase before suggesting changes
- You MUST start with reading related files and codebase before suggesting changes
</cursorrules_code_changes>

</cursorrules_instructions_to_the_dialog>
```

![Cursor IDE global rules configuration in Settings panel](/articles/cursor-ide-rules-global.webp)

## Maximizing Efficiency with Multi-Level Cursor Project Rules Strategy

When working with Cursor IDE's AI features, I've found it's crucial to optimize cursor project rules across all three levels. The key insight? Minimize the number of tokens (symbols) sent to the language model in each dialog. Fewer tokens for context means more capacity for generating quality responses.

For more information on how cursor project rules work in Cursor, check out the [official Cursor documentation on Rules for AI](https://docs.cursor.com/context/rules).

### 3-Step Implementation Flow for Cursor Project Rules

1. **Start with IDE-Level Settings Only**  
   I begin with global Cursor IDE settings to establish baseline preferences. This lets me experiment with different rule formulations without cluttering my repositories. I reserve this level for truly universal cursor project rules that apply to all my coding work.

2. **Move Project-Specific Project Rules to Repository Level**  
   When I spot patterns specific to a particular codebase or want to share my AI guidance with teammates, I move these cursor project rules to a `.cursor/index.mdc` file with Rule Type "Always". This creates a shared understanding while keeping my global settings lean. (Note: the legacy `.cursorrules` file still works but is no longer recommended.)

3. **Split into Context-Aware Project Rules When Necessary**  
   If my `.cursorrules` file gets bloated, I split it into `.cursor/*.mdc` files. This reduces token usage by only activating relevant cursor project rules when needed. It's like giving the language model more mental space to think about my specific task rather than remembering a bunch of irrelevant guidelines.

My goal is simple: in any conversation with the AI assistant, give it just enough context to be helpful without wasting its capacity on information it doesn't need right now.

## Real-World Cursor Project Rules Examples from Production Repositories

To show how I implement cursor project rules across different codebases, here are some real examples:

### Repository-Level .cursor/index.mdc Files: Structure and Implementation

My `.cursor/index.mdc` files with Rule Type "Always" work like a README.md specifically designed for AI assistants. They provide context about the project's purpose, architecture, and coding patterns. (Legacy `.cursorrules` files are still supported but not recommended for new projects.)

![Repository-level .cursorrules file example](/articles/cursor-ide-rules-repo.webp)

#### Production Repository Examples with Cursor Project Rules

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**: This utility for converting repositories to text includes rules explaining the project's purpose, architecture decisions, and code patterns to follow.

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**: For this Telegram bot, the rules focus on the bot's architecture, API usage patterns, and conventions for handling messages and commands.

### Cursor Project Rules Files: When and How to Use Them

When repository-level rules get too extensive, I split them into context-specific `.cursor/*.mdc` files that only activate when relevant.

![Context-specific rules in the Project Rules section](/articles/cursor-ide-rules-specific.webp)

#### Task-Specific Rules Implementation Example

A good example is my personal website repository:
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

In this repo, I've created separate rule files for:
- Content management workflows
- Image optimization requirements
- SEO best practices
- Component architecture patterns
- Deployment procedures

This approach keeps the AI focused and prevents overwhelming it with irrelevant information when I'm working on specific tasks.

### Mid-Dialog Rule Inclusion: Limitations and Best Practices

An important limitation to be aware of: context-aware `.mdc` rules work best when applied at the start of a new dialog. If you're in the middle of an existing conversation with Cursor IDE and suddenly need to apply a specialized rule (like database querying guidelines), the AI may not automatically access that rule file. This happens because Cursor has already established the context for your conversation and doesn't always re-evaluate which rules to apply mid-dialog.

In these situations, I explicitly mention the rule I need: "Please follow our database querying guidelines for this task." This prompts Cursor to look for and apply the relevant rule. For critical tasks that rely on specific guidelines, I find it's more effective to start a fresh dialog where Cursor will automatically detect and apply all relevant context-aware rules from the beginning.

## Evolution of Cursor Project Rules: From Global Settings to Context-Aware Systems

My journey with cursor project rules has evolved through several phases:

### Phase 1: Global Cursor IDE Settings for Universal Cursor Project Rules

I started by dumping everything into Cursor IDE settings. Simple but effective at first. As I identified more patterns in my workflow, these global cursor project rules grew. Every new project benefited, but the configuration eventually became unwieldy - too many rules that didn't apply everywhere.

### Phase 2: Repository-Specific Cursor Project Rules for Project Standards

As my global settings bloated with project-irrelevant information, I shifted to using repository-level rules. Initially, this meant `.cursorrules` files in repository roots (now legacy). This became my primary approach, letting me customize cursor project rules for each project while maintaining consistent standards. Today, the recommended approach is `.cursor/index.mdc` files with Rule Type "Always".

### Phase 3: Dynamic Context-Aware Cursor Project Rules for Specialized Tasks

When Cursor IDE introduced `.cursor/*.mdc` dynamic rules, I restructured everything. These context-aware cursor project rules only activate when the AI is doing relevant tasks. This let me:

- Keep global settings minimal and broadly applicable
- Use `.cursor/index.mdc` with Rule Type "Always" for project-wide standards (replacing legacy `.cursorrules`)
- Create focused `.cursor/*.mdc` files for specialized tasks

This layered approach gives just-in-time guidance to the AI based on what I'm currently working on, cutting through noise and improving the relevance of its assistance.

The evolution reflects my growing understanding of how to effectively collaborate with AI assistants - starting broad and progressively refining toward context-aware, task-specific cursor project rules that maximize the AI's effectiveness.

## Complete Comparison of Cursor Project Rules Levels: Global vs Repository vs Context-Aware

Here's a quick comparison of the three levels of cursor project rules in Cursor IDE:

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

This multi-level approach lets you optimize token usage while maintaining consistent guidance across different scenarios.

## Step-by-Step Guide: Implementing Cursor Project Rules in Your Development Workflow

Now that I've shared the theory behind my approach to cursor project rules, let's dive into how you can implement a similar system for your own development work.

### Setting Up Global Cursor Project Rules for AI Assistance

To set up your own global cursor project rules in Cursor IDE:

1. Open Cursor IDE and go to Settings (right top corner button)
2. Navigate to Cursor Settings > Rules for AI
3. Add your core guidelines in the formatted structure you saw above
4. Keep global cursor project rules focused on universal coding standards that apply across all projects
5. Test with simple prompts to see how the AI responds to your instructions

#### Managing Local Cursor IDE Settings Efficiently

The key is striking a balance - too few rules and the AI won't understand your preferences; too many and you'll waste tokens on irrelevant context.

It's important to note that these settings are stored locally in your Cursor IDE installation. Your colleagues won't see these settings unless they configure them on their own machines. Also, if you use Cursor IDE on multiple computers (like separate personal and work accounts), you'll need to set them up manually on each installation.

### Creating Repository-Level .cursor/index.mdc Files for Project Teams

For project-level configuration:

1. Create a `.cursor/index.mdc` file in your repository
2. Set Rule Type to "Always" in the Cursor interface (or manually specify in the file)
3. Start with a brief project overview (what the project does, tech stack, etc.)
4. Document architecture patterns that the AI should understand
5. Include specific code conventions for this project
6. Keep the file under 100 lines for optimal token usage

Note: Legacy `.cursorrules` files still work but are no longer the recommended approach.

#### Cursor Project Rules Template repository-level

Here's a minimal template to get started:

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

### Building Context-Aware .mdc Rule Files for Specialized Tasks

For more advanced configuration:

1. Create a `.cursor/rules/` directory in your repository
2. Add specific `.mdc` files for different contexts
3. Name files descriptively based on their purpose
4. Keep each file focused on one specific concern
5. Include a brief description at the top of each file to help the AI understand when to apply these rules

#### Creating Rules: Manual vs Cursor IDE Interface Methods

You can create these files manually, or use the Cursor IDE interface:
1. Go to Settings > Rules
2. Click "Add Rule"
3. Enter a name and description for your rule
4. Add your custom rule content
5. Save the rule, and Cursor will create the appropriate `.mdc` file in your repository

Both approaches work equally well - manual file creation gives you more control over the file structure, while the Cursor interface offers a more guided experience.

#### Example Cursor Rule File for React Development

For example, a React component rule file might look like:

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

## Measurable Benefits of Using Cursor Project Rules for AI-Assisted Coding

After implementing this multi-level cursor project rules system, I've seen tangible improvements across several dimensions.

### Improved Code Quality Metrics Through Consistent Cursor Project Rules

The most immediate benefit has been consistent code quality. By encoding my preferences in cursor project rules, the AI generates code that:

- Follows functional programming principles consistently
- Implements proper error handling without prompting
- Includes appropriate typing without constant reminders
- Maintains consistent naming conventions throughout

This translates to fewer review comments and less time spent on style fixes. One project saw a 50% reduction in style-related PRs comments after implementing these cursor project rules.

### Enhanced Team Collaboration with Shared Cursor Project Rules

When working with teams, cursor project rules create a shared understanding:

- New team members quickly understand expectations through the `.cursorrules` file
- Cross-functional collaboration improves as both engineers and non-engineers can reference the same rules
- Knowledge sharing happens automatically as the AI applies best practices consistently

I've found this especially valuable when onboarding junior developers - they get immediate feedback on best practices without waiting for code reviews.

### Productivity Gains from Optimized Cursor IDE AI Interactions

The numbers speak for themselves:

- Around 60% reduction in time spent explaining code standards to new team members
- Around 35% faster initial PR submissions with fewer revision cycles
- Around 40% fewer "style fix" commits cluttering the git history

But the most valuable metric has been mental bandwidth. By offloading style concerns to the AI, developers can focus on solving the actual problem rather than remembering formatting rules.

## Advanced Cursor Project Rules Techniques for Professional Developers

As you become comfortable with basic rule structures, try these advanced techniques to further refine your AI assistance experience.

### Specialized Task-Specific Cursor Project Rules for Common Development Scenarios

I've found specialized cursor project rules files particularly effective for these scenarios:

#### Testing Rules (`test-guidelines.mdc`)

- Test naming patterns
- Mocking strategy guidelines
- Test coverage expectations

#### API Integration Rules (`api-standards.mdc`)

- Error handling expectations
- Retry logic patterns
- Authentication flow standards

#### State Management Rules (`state-patterns.mdc`)

- Redux action naming conventions
- State normalization guidelines
- Side-effect handling patterns

By splitting these concerns, each file stays focused and only activates when relevant to your current task.

### Optimizing AI Token Usage in Cursor Project Rules

To maximize the AI's effective context window:

1. **Prioritize recency**: Place most important rules at the beginning or end of files
2. **Use hierarchical structure**: Start with general principles, then move to specifics
3. **Eliminate redundancy**: Don't repeat the same rule in multiple places
4. **Use concise language**: Write rules in bullet points rather than paragraphs
5. **Leverage markdown formatting**: Use headings to distinguish between rule categories

As a rule of thumb, if a rule file exceeds 100 lines, it's probably trying to do too much and should be split into more focused components.

### Troubleshooting Common Cursor Project Rules Issues and Solutions

When your cursor project rules aren't producing the expected results:

1. **Rule conflicts**: Check if you have contradictory guidelines across different levels
2. **Too generic**: Make cursor project rules more specific with concrete examples
3. **Too specific**: Overly narrow rules might not generalize to similar scenarios
4. **Token limitations**: If cursor project rules are being truncated, prioritize and simplify
5. **Missing context**: The AI might need additional file context to apply rules correctly
6. **Rule overload**: When too many cursor project rules appear in the same dialog, the model struggles to remember and follow all of them simultaneously - prioritize the most important ones

I've found that reviewing the generated code against my cursor project rules and iteratively refining them leads to continuous improvement in AI assistance quality.

## Cursor IDE vs Other AI Coding Assistants: Configuration Approaches Compared

While Cursor has a particularly well-designed system for rules, other AI coding assistants have similar approaches to customization:

- GitHub Copilot offers `.github/copilot/settings.yml` for project-level configuration
- JetBrains AI Assistant has project-level snippets and templates
- VS Code with various AI extensions supports workspace settings and customization files

Note: Cursor's evolution from `.cursorrules` (legacy) to `.cursor/index.mdc` with Rule Type "Always" shows how these systems continue to improve for better flexibility and organization.

### The Token Economy: Maximizing AI Performance Across All Tools

What unites all these approaches is a fundamental principle: **minimizing token usage is essential for optimal results**. Regardless of which AI coding assistant you use, providing just enough context without overwhelming the model is the key to success.

The token economy works the same way across all LLM-powered tools:
1. Every word you add to your instructions consumes tokens
2. Tokens used for instructions reduce the available context for code understanding
3. Extremely verbose guidance leads to diminishing returns

So whether you're using Cursor's three-tier rule system or another tool's configuration options, always aim to be precise and concise. Focus your guidance on the specific patterns and preferences that matter most, and let the AI handle the rest.

The real advantage isn't in which tool provides the most customization options, but in how thoughtfully you use the available options to communicate your expectations without wasting tokens on unnecessary verbosity.

## Video Tutorial: Watch the Complete Cursor IDE Rules Implementation

If you prefer learning visually, I've created a comprehensive video tutorial that demonstrates the complete implementation of this three-tier cursor rules system:

[![Ultimate Cursor AI IDE Rules Guide: All 5 Levels and .cursorrules (2025)](/articles/cursor-ide-rules-video-tutorial.webp)](https://youtu.be/gw8otRr2zpw?si=z5wE2PNHugtH9yrx)

The video walks through:
- Setting up global cursor rules in Cursor IDE settings
- Creating repository-specific `.cursorrules` files with real examples
- Implementing context-aware `.cursor/*.mdc` files for specialized tasks
- Demonstrating how each level works together to optimize AI assistance
- Troubleshooting common issues and optimizing token usage

You'll see the entire workflow in action, from initial setup to advanced multi-level configurations that transform how you collaborate with AI assistants.