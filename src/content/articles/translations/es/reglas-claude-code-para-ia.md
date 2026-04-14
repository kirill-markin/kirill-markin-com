---
title: "Reglas de Claude Code para IA: instrucciones globales en CLAUDE.md"
date: 2026-03-21
slug: "reglas-claude-code-para-ia"
description: "Mis reglas de Claude Code con un CLAUDE.md global: separo reglas personales y del proyecto para que el agente mantenga mi forma de programar."
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

Claude Code empezó a rendirme mucho mejor cuando dejé de explicarle lo mismo en cada conversación. Llevo cerca de dos años programando con IA, uso Claude Code desde hace unos seis meses y la mejora más útil fue ridículamente simple: poner mis reglas por defecto en `~/.claude/CLAUDE.md` y hacer que el agente arranque desde ahí.

Antes de eso, desperdiciaba mensajes siempre en lo mismo. Usa tipado estricto. No añadas soluciones de respaldo que no te pedí. Mantén los cambios acotados. No reescribas medio archivo solo porque te has venido arriba. Claude solía hacerme caso. Aun así, yo tenía que pagar ese peaje una y otra vez.

Ahora esa base ya está ahí, incluso antes de que el repositorio entre en escena.

## Dónde guardo mis instrucciones globales de Claude Code

La [documentación de Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) de Anthropic divide esto en varias capas. `~/.claude/CLAUDE.md` es el archivo global del usuario. `./CLAUDE.md` o `./.claude/CLAUDE.md` es la capa compartida del proyecto. `CLAUDE.local.md` sirve para notas personales del proyecto que no deberían acabar en git.

Eso coincide casi exactamente con lo que yo quiero:

1. `~/.claude/CLAUDE.md` para mis preferencias persistentes de desarrollo
2. `CLAUDE.md` del proyecto para arquitectura y comandos específicos del repositorio
3. `CLAUDE.local.md` cuando necesito notas personales del proyecto que deben quedarse fuera de git

No quiero copiar las mismas reglas personales en cada repositorio que abro. Si "nada de soluciones de respaldo silenciosas" es una preferencia global, debe ir en el archivo global. Si "ejecuta este extraño comando interno antes de lanzar las pruebas" es algo específico del repositorio, debe ir en el archivo del proyecto.

Esta es la versión que estoy usando ahora mismo en Claude Code:

![Instrucciones globales de Claude Code en CLAUDE.md para reglas persistentes de programación con IA](/articles/claude-code-global-rules-terminal.jpg)

## Las reglas de Claude Code que realmente uso

Este bloque es deliberadamente aburrido. Las buenas reglas suelen serlo. No intento anticipar todos los casos límite. Solo quiero que Claude Code deje de cometer los mismos errores previsibles.

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

Sin él, Claude se descarrila de maneras muy reconocibles. Añade lógica de respaldo "por si acaso". Relaja los tipos porque el tipado estricto le resulta incómodo. Mete capas innecesarias alrededor de funciones sencillas. Corrige el problema equivocado porque intenta agradar en vez de ser preciso.

Prefiero dedicar diez minutos una vez a escribir un buen archivo global que seguir corrigiendo esos patrones uno por uno en cada sesión nueva.

## Primero el CLAUDE.md global, después el CLAUDE.md del proyecto

No quiero un único `CLAUDE.md` gigantesco con todo embutido.

Mi archivo global debería responder a preguntas como:

- ¿Qué tan estricto quiero el tipado?
- ¿Cómo quiero que se manejen los errores?
- ¿Quiero cambios pequeños o refactorizaciones amplias?
- ¿Qué tipo de documentación espero?

Mi archivo del proyecto debería responder a preguntas distintas:

- ¿Cómo ejecuto el proyecto?
- ¿Qué comandos son seguros y esperados?
- ¿Cuáles son los límites importantes de la arquitectura?
- ¿Dónde están las pruebas?
- ¿Qué convenciones solo aplican a este repositorio?

En la práctica:

- el `CLAUDE.md` global dice cómo trabajo yo
- el `CLAUDE.md` del proyecto dice cómo funciona este repositorio

Cuando mezclas esas dos cosas, el archivo se convierte en un batiburrillo. La mitad es demasiado genérica, la otra mitad demasiado local, y Claude tiene que cargar con todo eso en cada tarea.

Anthropic recomienda mantener estos archivos concisos. Bien. Los archivos de instrucciones largos suelen parecer un intento de meter un manual entero de ingeniería dentro de las instrucciones. Eso nunca acaba bien.

## Qué se rompe a mitad de sesión

Las reglas ayudan. No arreglan para siempre una sesión caótica.

Si paso veinte mensajes hablando de un subsistema y luego cambio de golpe a otro problema distinto, Claude puede quedarse atascado en el contexto anterior. Es normal. No trato las conversaciones largas como si fueran sagradas.

Así que en la práctica hago esto:

- Empiezo una sesión nueva cuando la tarea pasa de exploración a implementación
- Empiezo una sesión nueva cuando salto de un subsistema a otro muy distinto
- Mantengo las instrucciones del proyecto lo bastante concisas para no pagar un peaje de contexto en cada turno

Por eso también me gustan los archivos Markdown para planes y notas. Si la tarea es grande, prefiero dejar el estado por escrito antes que confiar en que un hilo larguísimo se mantenga limpio.

## Mi despliegue práctico de reglas para Claude Code

Si hoy tuviera que configurar esto desde cero, lo haría en este orden.

### 1. Crear `~/.claude/CLAUDE.md`

Empieza por tus líneas rojas. No consejos de vida. No manifiestos sobre ingeniería. Solo las reglas que de verdad importan una y otra vez entre repositorios.

Para mí, eso significa:

- tipado estricto
- manejo explícito de errores
- ediciones mínimas
- sin soluciones de respaldo silenciosas
- docstrings donde la documentación debe vivir
- hábitos de terminal no interactivos

Solo con eso ya cambia más el resultado que la mayoría de los retoques en las instrucciones.

### 2. Añadir un `CLAUDE.md` de proyecto

Usa el archivo del repositorio para comandos, arquitectura, convenciones de nombres y límites. Anthropic te da `/init` para esbozar uno, y eso ayuda. Aun así, yo lo edito a mano después porque las instrucciones generadas son un borrador, no una pieza terminada.

### 3. Mantener cortas las reglas del proyecto

No conviertas el archivo del proyecto en una segunda copia del personal. Pon ahí comandos específicos del repositorio, notas de arquitectura y convenciones locales. Deja las preferencias duraderas en el archivo global.

## Por qué esto importa más que ponerse ingenioso con las instrucciones

Mucho contenido sobre la "configuración definitiva" de agentes de código acaba convirtiéndose bastante rápido en puro teatro.

Lo que de verdad mejoró mi trabajo del día a día fue mucho más simple:

- un `CLAUDE.md` global y estable a nivel de usuario
- un `CLAUDE.md` de proyecto claro

Esa combinación hace que Claude trabaje con más aplomo. Menos soluciones de respaldo aleatorias. Menos abstracciones ingeniosas porque sí. Menos sesiones en las que, diez minutos después, descubro que el agente y yo estábamos resolviendo problemas ligeramente distintos.

Si usas varios agentes de código, el mismo patrón aparece también en otras herramientas. Distinto producto, misma lección: define la base una vez y deja de renegociarla cada mañana.

Si te interesan los artículos complementarios, aquí los tienes:

- Reglas de Cursor IDE para IA: [https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/](https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/)
- Reglas de Codex para IA: [https://kirill-markin.com/es/articulos/reglas-codex-para-ia/](https://kirill-markin.com/es/articulos/reglas-codex-para-ia/)
