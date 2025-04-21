---
title: "Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant"
date: 2025-04-19
description: "My battle-tested Cursor IDE rules configuration that improves AI coding performance with tailored code style preferences and workflow patterns."
tags: [productivity, cursor-ide, ai]
aliases: [cursor-ai-rules, cursor-guidelines, cursor-ide-configuration, cursor-rules-setup]
related: [cursor-ide-setup-workflow-for-large-scale-projects]
publish: true
lastmod: 2025-04-21
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

## Comparison of Cursor IDE Rule Levels

Here's a quick comparison of the three levels of rules in Cursor IDE:

| Feature | Global IDE Settings | Repository Rules (.cursorrules) | Context-Aware Rules (.cursor/*.mdc) |
|---------|--------------------|-----------------------------|----------------------------------|
| **Scope** | All projects | Specific repository | Specific tasks or contexts |
| **Visibility** | Only you (local settings) | Entire team via repository | Entire team via repository |
| **Persistence** | Stays across projects | Tied to the repository | Tied to the repository |
| **Activation** | Always active | Always active for repository | Only when relevant to current task |
| **Best for** | Universal coding standards | Project architecture patterns | Specialized domain knowledge |
| **Token efficiency** | Low (always present) | Medium (always present for project) | High (only loads when needed) |
| **Setup location** | Cursor settings UI | Repository root file | .cursor/rules/ directory |
| **Portability** | Requires manual setup on each device | Automatic with repository clone | Automatic with repository clone |

This multi-level approach lets you optimize token usage while maintaining consistent guidance across different scenarios.

## Practical Implementation Guide

Now that I've shared the theory behind my approach to Cursor rules, let's dive into how you can implement a similar system for your own development work.

### Setting Up Global Rules in Cursor IDE

To set up your own global rules in Cursor IDE:

1. Open Cursor IDE and go to Settings (right top corner button)
2. Navigate to Cursor Settings > Rules for AI
3. Add your core guidelines in the formatted structure you saw above
4. Keep global rules focused on universal coding standards that apply across all projects
5. Test with simple prompts to see how the AI responds to your instructions

The key is striking a balance - too few rules and the AI won't understand your preferences; too many and you'll waste tokens on irrelevant context.

It's important to note that these settings are stored locally in your Cursor IDE installation. Your colleagues won't see these settings unless they configure them on their own machines. Also, if you use Cursor IDE on multiple computers (like separate personal and work accounts), you'll need to set them up manually on each installation.

### Creating Repository-Specific Rules

For project-level configuration:

1. Create a `.cursorrules` file in the root of your repository
2. Start with a brief project overview (what the project does, tech stack, etc.)
3. Document architecture patterns that the AI should understand
4. Include specific code conventions for this project
5. Keep the file under 100 lines for optimal token usage

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

### Building Context-Aware Rule Files

For more advanced configuration:

1. Create a `.cursor/rules/` directory in your repository
2. Add specific `.mdc` files for different contexts
3. Name files descriptively based on their purpose
4. Keep each file focused on one specific concern
5. Include a brief description at the top of each file to help the AI understand when to apply these rules

You can create these files manually, or use the Cursor IDE interface:
1. Go to Settings > Rules
2. Click "Add Rule"
3. Enter a name and description for your rule
4. Add your custom rule content
5. Save the rule, and Cursor will create the appropriate `.mdc` file in your repository

Both approaches work equally well - manual file creation gives you more control over the file structure, while the Cursor interface offers a more guided experience.

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

## Real-World Benefits

After implementing this multi-level rules system, I've seen tangible improvements across several dimensions.

### Code Quality Improvements

The most immediate benefit has been consistent code quality. By encoding my preferences in rules, the AI generates code that:

- Follows functional programming principles consistently
- Implements proper error handling without prompting
- Includes appropriate typing without constant reminders
- Maintains consistent naming conventions throughout

This translates to fewer review comments and less time spent on style fixes. One project saw a 47% reduction in style-related PRs comments after implementing these rules.

### Team Collaboration Advantages

When working with teams, Cursor rules create a shared understanding:

- New team members quickly understand expectations through the `.cursorrules` file
- Cross-functional collaboration improves as both engineers and non-engineers can reference the same rules
- Knowledge sharing happens automatically as the AI applies best practices consistently

I've found this especially valuable when onboarding junior developers - they get immediate feedback on best practices without waiting for code reviews.

### Productivity Metrics

The numbers speak for themselves:

- Around 60% reduction in time spent explaining code standards to new team members
- Around 35% faster initial PR submissions with fewer revision cycles
- Around 40% fewer "style fix" commits cluttering the git history

But the most valuable metric has been mental bandwidth. By offloading style concerns to the AI, developers can focus on solving the actual problem rather than remembering formatting rules.

## Advanced Techniques

As you become comfortable with basic rule structures, try these advanced techniques to further refine your AI assistance experience.

### Task-Specific Rules Examples

I've found specialized rule files particularly effective for these scenarios:

**Testing Rules (`test-guidelines.mdc`):**
- Test naming patterns
- Mocking strategy guidelines
- Test coverage expectations

**API Integration Rules (`api-standards.mdc`):**
- Error handling expectations
- Retry logic patterns
- Authentication flow standards

**State Management Rules (`state-patterns.mdc`):**
- Redux action naming conventions
- State normalization guidelines
- Side-effect handling patterns

By splitting these concerns, each file stays focused and only activates when relevant to your current task.

### Optimizing Token Usage

To maximize the AI's effective context window:

1. **Prioritize recency**: Place most important rules at the beginning or end of files
2. **Use hierarchical structure**: Start with general principles, then move to specifics
3. **Eliminate redundancy**: Don't repeat the same rule in multiple places
4. **Use concise language**: Write rules in bullet points rather than paragraphs
5. **Leverage markdown formatting**: Use headings to distinguish between rule categories

As a rule of thumb, if a rule file exceeds 100 lines, it's probably trying to do too much and should be split into more focused components.

### Troubleshooting Common Issues

When your rules aren't producing the expected results:

1. **Rule conflicts**: Check if you have contradictory guidelines across different levels
2. **Too generic**: Make rules more specific with concrete examples
3. **Too specific**: Overly narrow rules might not generalize to similar scenarios
4. **Token limitations**: If rules are being truncated, prioritize and simplify
5. **Missing context**: The AI might need additional file context to apply rules correctly
6. **Rule overload**: When too many rules appear in the same dialog, the model struggles to remember and follow all of them simultaneously - prioritize the most important ones

I've found that reviewing the generated code against my rules and iteratively refining them leads to continuous improvement in AI assistance quality.

## Comparing with Other AI Tools

While Cursor has a particularly well-designed system for rules, other AI coding assistants have similar approaches to customization:

- GitHub Copilot offers `.github/copilot/settings.yml` for project-level configuration
- JetBrains AI Assistant has project-level snippets and templates
- VS Code with various AI extensions supports workspace settings and customization files

What unites all these approaches is a fundamental principle: **minimizing token usage is essential for optimal results**. Regardless of which AI coding assistant you use, providing just enough context without overwhelming the model is the key to success.

The token economy works the same way across all LLM-powered tools:
1. Every word you add to your instructions consumes tokens
2. Tokens used for instructions reduce the available context for code understanding
3. Extremely verbose guidance leads to diminishing returns

So whether you're using Cursor's three-tier rule system or another tool's configuration options, always aim to be precise and concise. Focus your guidance on the specific patterns and preferences that matter most, and let the AI handle the rest.

The real advantage isn't in which tool provides the most customization options, but in how thoughtfully you use the available options to communicate your expectations without wasting tokens on unnecessary verbosity.
