---
title: "Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant"
date: 2025-04-19
description: "My custom rules configuration for Cursor IDE that improves AI coding assistance. Includes code style preferences, terminal commands, and project planning guidelines."
tags: [productivity, cursor, ai]
aliases: [cursor-ai-rules, cursor-guidelines]
related: [cursor-ide-setup-workflow-for-large-scale-projects]
publish: true
lastmod: 2025-04-19
thumbnailUrl: "/articles/cursor-ide-rules-for-ai.webp"
---

# Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant

Cursor IDE implements three levels of AI rules:

1. Rules for AI in Cursor IDE settings - base rules that apply globally to all projects
2. `.cursorrules` file in repository root - project-specific rules
3. `.cursor/rules/*.mdc` files - dynamic rules that only activate when AI tackles tasks relevant to their description

I'm sharing my base-level rules here - the global settings I use in Cursor IDE. These rules form the foundation for all my development work. When combined with repository-level and dynamic rules, they create a powerful system that maintains code quality while keeping my development practices consistent.

## Cursor -> Settings -> Cursor Settings -> Rules for AI:

```markdown
<cursorrules_instructions_to_the_dialog>

<cursorrules_code_style>
- Comments in English only
- Prefer functional programming over OOP
- Use separate OOP classes only for connectors and interfaces to external systems
- Write all other logic with pure functions (clear input/output, no hidden state changes)
- Avoid hidden state changes and magic class variables
- Make minimal, focused changes
- Follow DRY, KISS, and YAGNI principles
- Use strict typing (function returns, variables) in all languages
- Use named parameters in function calls when possible
- Functions should only modify return values, never input parameters
- No duplicate code; check if some logic is already written before writing it
- Avoid unnecessary wrapper functions without clear purpose

<cursorrules_python_specifics>
- Prefer Pydantic over TypedDict
- Avoid `Any` and `@staticmethod`
- Use `pyproject.toml` over `requirements.txt` when possible
</cursorrules_python_specifics>

</cursorrules_code_style>

<cursorrules_libraries_and_dependencies>
- Install in virtual environments, not globally
- Add to project configs, not one-off installs
- Use source code exploration for understanding
</cursorrules_libraries_and_dependencies>

<cursorrules_terminal_usage>
- Run `date` for date-related tasks
- Use GitHub CLI with `printf` for multiline text:
  `git commit -m "$(printf "Title\n\n- Point 1\n- Point 2")"`
- Always use non-interactive git diff commands with: `git diff --no-pager` or `git diff | cat`. NO `git diff` or `git diff --cached`.
- Always prefer commands with parameters that don't require user interaction over interactive ones (use flags, environment variables, or configuration files to avoid prompts)
</cursorrules_terminal_usage>

<cursorrules_planning_practices>
- User can ask you to create a plan for the feature implementation
- You MUST create a temp directory
- You MUST create a markdown file with the feature plan in the temp directory
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

## Best Practices for Multi-Level Cursor Rules

When working with Cursor IDE's AI features, I've found it's crucial to optimize rules across all three levels. The key insight? Minimize the number of tokens (symbols) sent to the language model in each dialog. Fewer tokens for context means more capacity for generating quality responses.

### Recommended Flow

1. **Start with IDE-Level Settings Only**  
   I begin with global Cursor IDE settings to establish baseline preferences. This lets me experiment with different rule formulations without cluttering my repositories. I reserve this level for truly universal preferences that apply to all my coding work.

2. **Move Project-Specific Rules to Repository Level**  
   When I spot patterns specific to a particular codebase or want to share my AI guidance with teammates, I move these rules to a `.cursorrules` file in the repository root. This creates a shared understanding while keeping my global settings lean.

3. **Split into Context-Aware Rules When Necessary**  
   If my `.cursorrules` file gets bloated, I split it into `.cursor/*.mdc` files. This reduces token usage by only activating relevant rules when needed. It's like giving the language model more mental space to think about my specific task rather than remembering a bunch of irrelevant guidelines.

My goal is simple: in any conversation with the AI assistant, give it just enough context to be helpful without wasting its capacity on information it doesn't need right now.

## Examples From My Repositories

To show how I implement Cursor rules across different projects, here are some real examples:

### Repository-Level Rules (.cursorrules)

My `.cursorrules` files work like a README.md specifically designed for AI assistants. They provide context about the project's purpose, architecture, and coding patterns.

Examples from my public repositories:

1. **[repo-to-text](https://github.com/kirill-markin/repo-to-text/blob/main/.cursorrules)**: This utility for converting repositories to text includes rules explaining the project's purpose, architecture decisions, and code patterns to follow.

2. **[chatgpt-telegram-bot-telegraf](https://github.com/kirill-markin/chatgpt-telegram-bot-telegraf/blob/main/.cursorrules)**: For this Telegram bot, the rules focus on the bot's architecture, API usage patterns, and conventions for handling messages and commands.

### Context-Specific Rules (.cursor/*.mdc)

When repository-level rules get too extensive, I split them into context-specific `.cursor/*.mdc` files that only activate when relevant.

A good example is my personal website repository:
**[website-next-js/.cursor/rules/](https://github.com/kirill-markin/website-next-js/tree/main/.cursor/rules)**

In this repo, I've created separate rule files for:
- Content management workflows
- Image optimization requirements
- SEO best practices
- Component architecture patterns
- Deployment procedures

This approach keeps the AI focused and prevents overwhelming it with irrelevant information when I'm working on specific tasks.

## Evolution of My Cursor IDE Rules

My journey with Cursor IDE rules has evolved through several phases:

### Phase 1: Global Settings First
I started by dumping everything into Cursor IDE settings. Simple but effective at first. As I identified more patterns in my workflow, these global rules grew. Every new project benefited, but the configuration eventually became unwieldy - too many rules that didn't apply everywhere.

### Phase 2: Repository-Specific Rules
As my global settings bloated with project-irrelevant information, I shifted to using `.cursorrules` files in repository roots. This became my primary approach, letting me customize rules for each project while maintaining consistent standards. During this time, `.cursorrules` was the only option for repository-level configuration.

### Phase 3: Dynamic Context-Aware Rules
When Cursor IDE introduced `.cursor/*.mdc` dynamic rules, I restructured everything. These context-aware rules only activate when the AI is doing relevant tasks. This let me:

- Keep global settings minimal and broadly applicable
- Use `.cursorrules` for project-wide standards
- Create focused `.cursor/*.mdc` files for specialized tasks

This layered approach gives just-in-time guidance to the AI based on what I'm currently working on, cutting through noise and improving the relevance of its assistance.

The evolution reflects my growing understanding of how to effectively collaborate with AI assistants - starting broad and progressively refining toward context-aware, task-specific instructions that maximize the AI's effectiveness.
