---
title: "Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant"
date: 2025-02-10
tags: [productivity, cursor, ai]
aliases: [cursor-ai-rules, cursor-guidelines]
related: [cursor-ide-setup-workflow-for-large-scale-projects]
publish: false
lastmod: 2025-04-14
---

# Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant

Cursor IDE implements three levels of AI rules:

1. Rules for AI in Cursor IDE settings - base rules that apply globally to all projects
2. `.cursorrules` file in repository root - project-specific rules
3. `.cursor/rules/*.mdc` files - dynamic rules that are only activated when AI performs relevant to related description tasks

On this page, I'm publishing my base-level rules - the global Rules for AI settings in Cursor IDE. These rules serve as the foundation for all development tasks. Combined with repository-level and dynamic rules, they create an effective system for maintaining code quality and development practices.

## Cursor -> Settings -> Cursor Settings -> Rules for AI:

```markdown
<cursorrules_instructions_to_the_dialog>

<cursorrules_code_style>
- Comments in English only
- Prefer functional programming over OOP
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
- This fiature plan file with contains the following sections:
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

