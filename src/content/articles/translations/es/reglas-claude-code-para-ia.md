---
title: "Reglas de Claude Code para IA: instrucciones globales en CLAUDE.md"
date: 2026-03-21
slug: "reglas-claude-code-para-ia"
description: "Mis reglas de Claude Code con CLAUDE.md global: separo preferencias y normas del proyecto para mantener estilo y diffs consistentes entre repositorios."
tags: [productivity, claude-code, ai, llm]
publish: true
thumbnailUrl: "/articles/claude-code-global-rules-terminal.jpg"
language: "es"
originalArticle:
  language: "en"
  slug: "claude-code-rules-for-ai"
translations:
  - language: "en"
    slug: "claude-code-rules-for-ai"
  - language: "zh"
    slug: "claude-code-ai-guize"
  - language: "hi"
    slug: "claude-code-niyam-kritrim-buddhimatta-ke-liye"
  - language: "ar"
    slug: "qawaid-claude-code-lilthakaa-alistinaei"
---

# Reglas de Claude Code para IA: instrucciones globales en CLAUDE.md

Claude Code empezó a funcionarme mucho mejor cuando dejé de repetirle lo mismo en cada chat. Llevo cerca de dos años programando con IA, usando Claude Code desde hace unos seis meses, y la mejora más útil fue absurdamente simple: poner mis reglas por defecto en `~/.claude/CLAUDE.md` y dejar que el agente arrancara desde ahí.

Antes de eso, desperdiciaba mensajes en lo mismo de siempre. Usa tipado estricto. No añadas fallbacks que no pedí. Mantén el diff pequeño. No reescribas medio archivo solo porque te emocionaste. Claude solía obedecer. Aun así, yo tenía que pagar ese impuesto una y otra vez.

Ahora esa base ya está ahí incluso antes de que el repositorio entre en la conversación.

## Dónde guardo mis instrucciones globales de Claude Code

La [documentación de Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) de Anthropic divide esto en varias capas. `~/.claude/CLAUDE.md` es el archivo global del usuario. `./CLAUDE.md` o `./.claude/CLAUDE.md` es la capa compartida del proyecto. `CLAUDE.local.md` sirve para notas personales del proyecto que no deberían entrar en git.

Eso coincide casi exactamente con lo que yo quiero:

1. `~/.claude/CLAUDE.md` para mis preferencias persistentes de desarrollo
2. `CLAUDE.md` del proyecto para arquitectura y comandos específicos del repositorio
3. `CLAUDE.local.md` cuando necesito notas personales del proyecto que deben quedarse fuera de git

No quiero pegar las mismas reglas personales en cada repositorio que abro. Si "sin fallbacks silenciosos" es una preferencia global, debe vivir en el archivo global. Si "ejecuta este extraño comando interno antes de lanzar tests" es algo específico del repo, debe vivir en el archivo del proyecto.

Esta es la versión que uso ahora mismo en Claude Code:

![Instrucciones globales de Claude Code en CLAUDE.md para reglas persistentes de programación con IA](/articles/claude-code-global-rules-terminal.jpg)

## Las reglas de Claude Code que realmente uso

Este bloque es deliberadamente aburrido. Las buenas reglas suelen serlo. No intento describir todos los casos límite por adelantado. Solo quiero que Claude Code deje de cometer los mismos errores predecibles.

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

Ese bloque cubre casi todo lo que me importa en el día a día.

Sin él, Claude deriva de formas muy conocidas. Añade comportamiento de fallback "por si acaso". Relaja tipos porque el tipado estricto le parece incómodo. Envuelve funciones simples en capas extra. Corrige el problema equivocado porque intenta ser complaciente en vez de preciso.

Prefiero invertir diez minutos una vez en escribir un buen archivo global que seguir corrigiendo esos patrones uno por uno en cada sesión nueva.

## Primero el CLAUDE.md global, después el CLAUDE.md del proyecto

No quiero un único `CLAUDE.md` gigante con todo metido a la fuerza.

Mi archivo global debería responder preguntas como:

- ¿Qué tan estricto quiero el tipado?
- ¿Cómo quiero que se manejen los errores?
- ¿Quiero diffs pequeños o refactors amplios?
- ¿Qué tipo de documentación espero?

Mi archivo de proyecto debería responder preguntas distintas:

- ¿Cómo ejecuto el proyecto?
- ¿Qué comandos son seguros y esperados?
- ¿Cuáles son los límites importantes de la arquitectura?
- ¿Dónde viven los tests?
- ¿Qué convenciones son específicas solo de este repo?

En la práctica:

- `CLAUDE.md` global dice cómo trabajo yo
- `CLAUDE.md` del proyecto dice cómo funciona este repo

Cuando mezclas esas dos cosas, el archivo se convierte en lodo. La mitad es demasiado genérica, la otra mitad demasiado local, y Claude tiene que cargar con todo eso en cada tarea.

Anthropic recomienda mantener estos archivos concisos. Bien. Los archivos de instrucciones largos suelen parecer el intento de meter todo un manual de ingeniería dentro del prompt. Eso nunca acaba bien.

## Qué se rompe a mitad de sesión

Las reglas ayudan. No salvan para siempre una sesión caótica.

Si paso veinte mensajes hablando de un subsistema y luego cambio de pronto a otro problema distinto, Claude puede quedarse mentalmente atrapado en el marco anterior. Es normal. No trato los chats largos como si fueran sagrados.

Así que en la práctica hago esto:

- Empiezo una sesión nueva cuando la tarea cambia de exploración a implementación
- Empiezo una sesión nueva cuando paso de un subsistema a otro muy diferente
- Mantengo las instrucciones del proyecto lo bastante concisas para no pagar un impuesto de contexto en cada turno

Por eso también me gustan los archivos markdown para planes y notas. Si la tarea es grande, prefiero guardar el estado explícitamente antes que confiar en que un hilo larguísimo se mantenga limpio.

## Mi despliegue práctico de reglas para Claude Code

Si tuviera que configurar esto desde cero hoy, lo haría en este orden.

### 1. Crear `~/.claude/CLAUDE.md`

Empieza por tus no negociables. No consejos de vida. No manifiestos de ingeniería. Solo las reglas que realmente importan una y otra vez entre repositorios.

Para mí, eso significa:

- tipado estricto
- manejo explícito de errores
- ediciones mínimas
- sin fallbacks silenciosos
- docstrings donde la documentación debe vivir
- hábitos de terminal no interactivos

Solo eso ya cambia el resultado más que la mayoría de los trucos de prompt.

### 2. Añadir un `CLAUDE.md` de proyecto

Usa el archivo del repo para comandos, arquitectura, naming y límites. Anthropic te da `/init` para esbozar uno, y eso ayuda. Aun así, yo lo edito manualmente después porque las instrucciones generadas son un borrador, no un artefacto final.

### 3. Mantener cortas las reglas del proyecto

No conviertas el archivo del proyecto en una segunda copia del personal. Pon ahí comandos específicos del repo, notas de arquitectura y convenciones locales. Deja tus preferencias duraderas en el archivo global.

## Por qué esto importa más que el prompting ingenioso

Mucho contenido sobre la "configuración definitiva" de agentes de código termina derivando bastante rápido en teatro.

Lo que realmente mejoró mi trabajo del día a día fue mucho más simple:

- un `CLAUDE.md` global y estable para todo el usuario
- un `CLAUDE.md` de proyecto claro

Esa combinación hace que Claude esté más calmado. Menos fallbacks aleatorios. Menos abstracciones graciosas. Menos sesiones en las que diez minutos después descubro que el agente y yo estábamos resolviendo problemas ligeramente distintos.

Si usas varios agentes de código, el mismo patrón aparece en otras herramientas. Distinto producto, misma lección: define la base una vez y deja de renegociarla cada mañana.

Si quieres los artículos complementarios, están aquí:

- Reglas de Cursor IDE para IA: [https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/](https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/)
- Reglas de Codex para IA: [https://kirill-markin.com/es/articulos/reglas-codex-para-ia/](https://kirill-markin.com/es/articulos/reglas-codex-para-ia/)
