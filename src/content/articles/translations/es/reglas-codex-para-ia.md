---
title: "Reglas de Codex: instrucciones globales, AGENTS.md y app para Mac"
date: 2026-03-21
lastmod: 2026-04-14
slug: "reglas-codex-para-ia"
description: "Así uso las instrucciones personalizadas de Codex, AGENTS.md y la app para Mac para mantener los mismos patrones de desarrollo en distintos repositorios."
tags: [productivity, codex, openai, ai]
publish: true
thumbnailUrl: "/articles/codex-personalization-custom-instructions.jpg"
language: "es"
originalArticle:
  language: "en"
  slug: "codex-rules-for-ai"
translations:
  - language: "en"
    slug: "codex-rules-for-ai"
  - language: "zh"
    slug: "codex-ai-guize"
  - language: "hi"
    slug: "codex-niyam-kritrim-buddhimatta-ke-liye"
  - language: "ar"
    slug: "qawaid-codex-lilthakaa-alistinaei"
---

# Reglas de Codex: instrucciones globales, AGENTS.md y app para Mac

Solo llevo usando Codex en serio cosa de un mes, sobre todo desde que GPT-5.4 hizo que me resultara bastante más útil. Así que este no es un artículo de "cinco años de sabiduría curtida en mil batallas". La observación es mucho más simple: Codex empezó a funcionarme de verdad cuando dejé de tratarlo como otro cuadro vistoso para escribir instrucciones y empecé a darle pautas estables desde el arranque.

OpenAI ofrece tanto Codex CLI como la app para Mac. En mi caso, ambos parten de la misma idea general: instrucciones persistentes, `AGENTS.md`, reglas del repositorio y un agente que arranca con mis patrones de desarrollo ya cargados. Prefiero la app para Mac porque, sencillamente, me resulta bastante más agradable que sumar otra ventana de terminal.

Codex CLI ya hace bien esa parte. La app para Mac me da una capa más agradable sobre el mismo flujo de trabajo de Codex. Yo sigo queriendo las mismas pautas persistentes: tipado estricto, diffs mínimos, errores explícitos, nada de planes B añadidos por si acaso y docstrings en el código en vez de explicaciones desperdigadas. No quiero tener que enseñarle todo eso a Codex desde cero en cada tarea nueva. Quiero que esa base ya esté ahí desde el primer momento.

En la práctica, eso está en `Settings -> Personalization -> Custom instructions`.

Detrás de esa pantalla, esas instrucciones se vuelcan en mi `AGENTS.md` personal. Perfecto. Así tengo una experiencia más agradable sin perder la claridad de contar con un archivo real detrás, al estilo del CLI.

## Dónde viven realmente las instrucciones personalizadas de Codex

Si solo te fueras a quedar con una pantalla de este artículo, que sea esta.

En la app, las instrucciones globales están en `Settings -> Personalization -> Custom instructions`. Yo enseñaría esa pantalla primero.

La [documentación de Codex](https://developers.openai.com/codex/) de OpenAI dice que Codex puede leer un archivo global de instrucciones desde tu directorio de Codex, normalmente `~/.codex/AGENTS.md`. La [documentación de configuración de Codex](https://developers.openai.com/codex/config/) también explica que, al editar las instrucciones personalizadas, se actualiza tu archivo `AGENTS.md`.

Ese es exactamente el modelo que quiero. Puedo usar la app como interfaz principal sin perder la claridad de saber que hay un archivo real detrás.

Mi modelo mental es este:

1. `~/.codex/AGENTS.md` personal para mis criterios básicos entre proyectos
2. `AGENTS.md` del repositorio para las reglas del equipo y del propio repositorio
3. Los ajustes de la app de Codex y la guía del repositorio que se apoyan en esas reglas

Aquí está la pantalla:

![Instrucciones personalizadas de la app de Codex y AGENTS.md personal para reglas globales de programación](/articles/codex-personalization-custom-instructions.jpg)

## Las reglas de Codex que quiero tener cargadas en todas partes

Esta es la base que quiero que Codex traiga a cualquier repositorio antes de ver instrucciones específicas del proyecto.

Lo dejo en inglés porque es el contenido literal de mi `AGENTS.md` personal y está pensado para reutilizarse tal cual. En la práctica, el bloque se divide en estilo de código, manejo de errores, herramientas y dependencias, pruebas, flujo de trabajo y documentación.

```markdown
# Personal AGENTS.md

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

## Tooling and Dependencies

- Prefer modern package management files like `pyproject.toml` and `package.json`
- Install dependencies in project environments, not globally
- Add dependencies to project config files, not as one-off manual installs
- Read installed dependency source code when needed instead of guessing behavior

## Testing

- Respect the current repository testing strategy and existing test suite
- Do not add new unit tests by default
- When tests are needed, prefer integration, end-to-end, or smoke tests that validate real behavior
- Use unit tests only rarely, mainly for stable datasets or pure data transformations
- Never add unit tests just to increase coverage numbers
- Avoid mocks when real calls are practical
- It is usually better to spend a little money on real API or service calls than to maintain fragile mock-based coverage
- Add only the minimum test coverage needed for the requested change

## Codex Workflow

- Inspect the repository before editing
- Read active `AGENTS.md` files before making assumptions
- Keep changes minimal and directly related to the current request
- Match the existing repository style even when it differs from my personal preference
- Do not revert unrelated changes
- Prefer `rg` for code search
- Use non-interactive commands with flags
- Always use non-interactive git diff: `git --no-pager diff` or `git diff | cat`
- Run relevant tests or validation commands after code changes when the project already defines them

## Documentation

- Code is the primary documentation - use clear naming, types, and docstrings
- Keep documentation in docstrings of the functions or classes they describe, not in separate files
- Separate docs files only when a concept cannot be expressed clearly in code
- Never duplicate documentation across files
- Store knowledge as current state, not as a changelog of modifications
```

Este archivo es aburrido en el mejor sentido de la palabra.

Existe para eliminar fricción repetida:

- que Codex se invente refactorizaciones amplias cuando yo quería un parche mínimo
- que Codex oculte la incertidumbre detrás de un lenguaje demasiado blando
- que Codex añada un plan B "por seguridad"
- que Codex se salte convenciones del repositorio porque la petición estaba demasiado acotada

Una vez cargadas estas reglas, la sesión se vuelve mucho más tranquila.

## Por qué pongo las reglas globales por encima de las del repositorio

Codex maneja bien la jerarquía de `AGENTS.md`. OpenAI documenta un archivo global en `~/.codex/AGENTS.md` y, después, archivos de repositorio y de directorios anidados a medida que el directorio de trabajo se vuelve más específico.

Esa jerarquía es útil, pero la primera capa tiene que ser mía.

Mi archivo personal debería responder:

- qué tan estricto quiero el estilo de código
- qué considero un tratamiento aceptable de los errores
- cuán agresivo debe ser el agente con los cambios
- qué significa "terminado" en el trabajo normal de programación

El archivo del repositorio debería responder:

- cómo está organizada esta base de código
- qué comandos hay que ejecutar
- qué partes son frágiles
- cómo quiere el equipo manejar PRs, commits o la documentación

Versión corta:

- mi `AGENTS.md` personal dice cómo trabajo
- el `AGENTS.md` del repositorio dice cómo funciona esta base de código

Si mezclo esas dos cosas, acabo con duplicación, deriva y un archivo que nadie quiere mantener.

Esa es una de las razones por las que Codex me funciona mejor de lo que esperaba. La jerarquía de instrucciones es explícita. Se parece menos a un juego de instrucciones ocultas y más a un sistema real.

## La app para Mac es la interfaz principal, y eso importa

La nueva app de Codex para Mac es la parte que más estoy disfrutando ahora mismo.

No porque el CLI se quede corto. El CLI ya es muy bueno. La app es, sencillamente, mucho más agradable para el día a día. Es el mismo Codex por dentro, pero con una experiencia bastante más agradable.

Por eso no quiero centrar este artículo en el CLI, aunque el CLI importe. La app es la forma más agradable de usar el mismo sistema.

Lo que hace que la app sea sólida y no solo un lavado de cara es que las instrucciones siguen estando respaldadas por `AGENTS.md`. La documentación de la app dice que editar las instrucciones personalizadas actualiza las instrucciones personales en `AGENTS.md`, y esa es exactamente la relación que quiero:

- ajustes en la app por comodidad
- instrucciones en archivos por durabilidad

Eso también hace que luego el uso del CLI resulte fácil de entender, porque las mismas instrucciones de base se mantienen.

## El AGENTS.md del proyecto sigue importando, pero no es el protagonista

No quiero que este artículo se convierta en un tutorial sobre cómo anidar `AGENTS.md`, aunque Codex soporte eso perfectamente.

Mi versión es más simple:

- mi `AGENTS.md` personal le da a Codex mi comportamiento de partida
- `AGENTS.md` del repositorio le da a Codex expectativas concretas de ese repositorio
- los archivos anidados son para los casos raros que de verdad los necesitan

Eso mantiene el sistema fácil de entender.

Si abro un repositorio cualquiera y Codex se comporta mal, quiero diagnosticarlo rápido. Normalmente la respuesta debería ser una de estas:

1. mis reglas globales no están claras
2. faltan instrucciones del repositorio
3. la tarea es demasiado amplia

No algo como: "ya no sé cuál de las siete capas ocultas ganó esta ruleta de instrucciones".

## Dónde encaja el CLI en mi configuración de Codex

La app para Mac es mi interfaz principal. El CLI no es una alternativa de segunda. Es el mismo sistema Codex en otro formato.

El CLI sigue importando por varias razones:

- hace muy evidente la configuración basada en archivos
- facilita inspeccionar o automatizar el comportamiento exacto

No quiero una forma distinta de entender el producto para el CLI. Quiero el mismo `AGENTS.md` personal, la misma guía del repositorio y las mismas salvaguardas en ambos entornos.

Esa continuidad es una gran parte de por qué el producto se siente coherente.

## Mi configuración práctica de Codex ahora mismo

Si tuviera que montarlo hoy desde cero en un Mac, lo haría en este orden.

### 1. Escribir primero las instrucciones personales en la app

Abre los ajustes de la app de Codex con `Cmd+,`, ve a `Personalization` y escribe ahí primero las instrucciones personalizadas. Yo sigo pensando en términos de `~/.codex/AGENTS.md`, pero la app es el lugar principal donde las configuro y reviso.

### 2. Mantener el archivo personal breve y con criterio claro

La arquitectura del proyecto no va aquí. Aquí van las reglas duraderas de desarrollo:

- tipado estricto
- errores explícitos
- sin planes B silenciosos
- diffs mínimos
- docstrings en lugar de documentación dispersa
- hábitos de terminal limpios

### 3. Añadir `AGENTS.md` del repositorio solo para lo propio del repositorio

Comandos, arquitectura, restricciones, expectativas de testing, convenciones de nombres y zonas delicadas. Esa es la capa del repositorio.

## Por qué Codex me parece prometedor ahora mismo

Todavía estoy en una etapa temprana con Codex, así que no voy a exagerar.

Pero la combinación ya es fuerte:

- una capa real de instrucciones basada en archivos
- app y CLI conectados en vez de contradictorios

Eso me basta para seguir usándolo.

La configuración que mejor me está funcionando hasta ahora también es la menos glamurosa: escribir buenas instrucciones persistentes, mantener separada la guía del repositorio y dejar que el agente empiece desde una base que ya encaja con tu forma de trabajar.

Mismo patrón que Cursor. Mismo patrón que Claude Code. Producto distinto, misma lección: la sesión va mejor cuando el agente deja de adivinar quién eres.

Si quieres los artículos complementarios, están aquí:

- Reglas de Cursor IDE para IA: [https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/](https://kirill-markin.com/es/articulos/reglas-cursor-ide-para-ia/)
- Reglas de Claude Code para IA: [https://kirill-markin.com/es/articulos/reglas-claude-code-para-ia/](https://kirill-markin.com/es/articulos/reglas-claude-code-para-ia/)
