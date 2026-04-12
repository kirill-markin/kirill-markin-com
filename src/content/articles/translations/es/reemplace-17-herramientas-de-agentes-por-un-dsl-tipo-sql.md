---
title: "Por qué reemplacé 17 herramientas para agentes por un DSL similar a SQL"
date: 2026-04-11
slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
description: "Cómo concentré 17 herramientas para agentes de Flashcards Open Source App en un único punto de acceso con un DSL similar a SQL que los LLM pueden aprender rápido."
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "DSL similar a SQL para agentes de IA",
  "diseño de API para agentes de IA",
  "API de invocación de herramientas para LLM",
  "API con un único punto de acceso para agentes",
  "API SQL para LLM",
  "lenguaje específico de dominio para agentes",
  "consolidación de herramientas para agentes",
  "Flashcards Open Source App",
  "lenguaje de consulta para agentes de IA",
  "diseño de API fácil de aprender para LLM"
]
language: "es"
originalArticle:
  language: "en"
  slug: "sql-like-dsl-for-ai-agents"
translations:
  - language: "en"
    slug: "sql-like-dsl-for-ai-agents"
  - language: "zh"
    slug: "yige-lei-sql-dsl-qudai-17-ge-agent-gongju"
  - language: "hi"
    slug: "sql-jaisi-dsl-se-17-agent-tools-badale"
  - language: "ar"
    slug: "istabdalat-17-adat-lilwukala-bi-dsl-shabih-bisql"
---

# Por qué reemplacé 17 herramientas para agentes por un DSL similar a SQL

El martes pasado estaba repasando nuestra documentación para agentes en Flashcards Open Source App y me encontré con esa sensación tan conocida para cualquier ingeniero de backend: todo estaba ordenado, tipado, explícito y, aun así, resultaba un poco insoportable.

Tenía 17 invocaciones de herramientas distintas para agentes. `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`; luego el mismo patrón otra vez para los mazos, además de etiquetas, configuración del planificador, contexto del espacio de trabajo e historial de repaso. No había nada roto. Y esa era precisamente la parte irritante. Todo funcionaba.

Simplemente hacía ruido justo de la forma en que las API para LLM suelen acabar haciendo ruido. Un ingeniero humano puede leer la documentación una vez, montar un cliente y seguir adelante. Un LLM no tiene ese lujo. Tiene que reaprender la superficie a partir de ejemplos, descripciones y errores. Si repartes una intención sencilla entre demasiadas herramientas, el modelo paga ese coste cada vez.

Esta es la capa de agentes que está detrás de [flashcards-open-source-app.com](https://flashcards-open-source-app.com/), así que me importaba bastante que la interfaz externa fuera fácil de aprender, no solo técnicamente correcta.

Así que lo concentré todo en un único punto de acceso con un DSL similar a SQL.

No PostgreSQL en bruto. No soy tan valiente.

![Punto de acceso con un DSL similar a SQL que sustituye 17 herramientas de agentes separadas](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 herramientas eran demasiadas

La versión anterior tenía herramientas distintas para lecturas y escrituras sobre varios recursos lógicos:

- contexto del espacio de trabajo
- configuración del planificador
- etiquetas
- tarjetas
- tarjetas pendientes
- mazos
- historial de repaso

Desde el punto de vista del backend, eso está muy limpio. Cada herramienta hace una sola cosa. Cada esquema es explícito. La especificación OpenAPI queda perfectamente ordenada. La jugada clásica del ingeniero de backend.

Desde el punto de vista del agente, en cambio, es papeleo.

Si el modelo quiere "tarjetas de inglés rápidas actualizadas hace poco", primero tiene que adivinar si eso corresponde a `list_cards`, `search_cards` o a otra cosa. Luego tiene que recordar la forma de la carga útil. Después la paginación. Luego los filtros. Y después una segunda herramienta si quiere actualizar una fila tras leerla.

Se puede hacer funcionar. Yo hice que funcionara.

Simplemente dejó de gustarme.

## Qué cambió

El nuevo contrato público es una sola herramienta:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

El mismo punto de acceso para lecturas y escrituras sencillas.

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

Esa es toda la idea. Los agentes internos y externos ahora aprenden una sola superficie en lugar de un pequeño museo de nombres de herramientas.

Antes, el agente tenía que averiguar qué herramienta existía para cada tarea.

Ahora casi puede empezar por la tarea en sí:

- enséñame tarjetas
- filtra por etiqueta
- ordénalas por fecha de actualización
- actualiza este campo
- elimina estas filas

Eso encaja mucho mejor con la forma en que los LLM realmente tantean los sistemas. Prueban algo, leen el error y vuelven a intentarlo. Un único lenguaje similar a SQL resuelve mucho mejor ese bucle que 17 herramientas separadas.

## Por qué elegí SQL y no otro bloque JSON

No elegí SQL porque quisiera convertir mi producto en un cliente de base de datos.

Elegí SQL porque casi cualquier LLM competente ya tiene una enorme base previa sobre él. El modelo ya sabe, más o menos, qué se supone que hacen `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` y `LIMIT`. Eso ahorra mucha explicación.

Si invento un DSL JSON a medida, el modelo tiene que aprender mis verbos, mi anidación, mis filtros, mis casos límite y el estado de ánimo con el que bauticé las cosas esa semana. Si le doy una forma parecida a SQL, normalmente cae bastante cerca de la respuesta correcta en el primer intento.

Incluso cuando se equivoca en la consulta, suele equivocarse de una forma útil. Normalmente ocurre una de estas cosas:

- nombre de columna incorrecto
- cláusula no admitida
- falta `ORDER BY`
- `LIMIT` demasiado grande

Ese es un modo de fallo mucho mejor que "llamó a la herramienta equivocada, con la carga útil equivocada, y ahora necesita releer media especificación".

Yo quería algo que el modelo ya supiera hablar a medias y luego pudiera pulir mediante prueba y reintento. SQL funciona muy bien para eso.

## La parte importante: esto no es PostgreSQL

La parte importante de este diseño es lo que el punto de acceso **no** hace.

No ejecuta SQL en bruto contra la base de datos real.

Analiza la cadena similar a SQL, la valida contra la gramática publicada y la compila en las mismas operaciones internas que el producto ya usa. La cadena SQL es el DSL público. No es un acceso directo al almacenamiento.

Eso me permite mantener el comportamiento real del dominio donde corresponde:

- el ámbito del espacio de trabajo se inyecta en el servidor
- los campos del sistema pueden leerse, pero no escribirse
- los metadatos de sincronización siguen siendo internos
- las invariantes del dominio siguen viviendo en los controladores reales
- el almacenamiento puede cambiar más adelante sin romper el contrato público

Esa era la línea que no quería cruzar. Flashcards Open Source App está pensada para funcionar primero sin conexión y con sincronización en mente. No quiero que los agentes modifiquen tablas directamente y hagan como si eso fuera la API del producto.

Así que el contrato es honesto: por fuera tiene forma de SQL; por dentro sigue siendo seguro para el dominio.

## La gramática acabó siendo más pequeña de lo que esperaba

La versión uno es deliberadamente pequeña:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

Al principio pensé que mantendría una lista más larga de recursos lógicos. Luego recorté también esa parte.

Al final dejé la superficie pública muy cerca de los sustantivos principales:

- `cards`
- `decks`
- `workspace`
- `review_events`

Ese cambio limpió bastante todo el conjunto.

En lugar de publicar recursos extra como `tags_summary`, `due_cards` u otras vistas ya preparadas, le añadí un poco más de capacidad de consulta al propio lenguaje. Sobre todo `GROUP BY` y algunas funciones de agregación.

Así el modelo puede pedir resúmenes directamente, en vez de aprender una herramienta o un recurso distinto para cada forma de resumen que a mí se me ocurriera exponer el mes pasado.

Por ejemplo, ahora se puede hacer algo así:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

O esto:

```sql
SELECT rating, COUNT(*) AS reviews
FROM review_events
GROUP BY rating
ORDER BY reviews DESC
LIMIT 10 OFFSET 0;
```

Eso es mucho más simple que mantener puntos de acceso dedicados para cada pequeña necesidad de informes.

La gramática sigue siendo limitada. No estoy intentando fingir que esto es "Postgres completo".

Cosas que no admito:

- `JOIN`
- `CTE`
- subconsultas
- ejecución de múltiples sentencias
- funciones arbitrarias
- acceso directo a tablas internas
- escrituras directas sobre campos protegidos del sistema

Suena restrictivo porque es restrictivo. Bien. Eso es exactamente lo que mantiene esto honesto y sostenible.

## Algunas consultas de la nueva superficie

Leer tarjetas:

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

Leer tarjetas agrupadas por etiqueta:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

Crear mazos:

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

Actualizar tarjetas:

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

Eliminar tarjetas:

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

Leer recuentos de `review_events`:

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

Eso cubre una buena parte de lo que antes hacía el viejo catálogo de herramientas, sin obligar al agente a memorizar un punto de acceso distinto para cada sustantivo y cada tipo de resumen de la aplicación.

Uno de los efectos secundarios agradables es que la documentación también se acorta. Ya no necesito explicar veinte formas distintas de carga útil. Puedo mostrar una gramática pequeña, diez ejemplos y dejar que el modelo aprenda haciendo.

## La parte molesta que mantuve de todos modos

Este diseño es más simple, pero no es magia.

La desventaja más evidente es que, en cuanto dices "similar a SQL", la gente va a intentar usar hábitos de SQL real. Algunos funcionarán. Otros no. El producto tiene que ser muy directo cuando una consulta se sale de la gramática admitida.

También hice una concesión que a los puristas de las bases de datos no les va a gustar: la v1 usa `LIMIT` y `OFFSET` directamente en SQL en vez de paginación por cursor.

Conozco la desventaja. Las páginas pueden desplazarse si los datos cambian entre solicitudes. La paginación por cursor es más segura.

Aun así, elegí `OFFSET` para esta superficie porque es más fácil para quien escribe agentes, más fácil de mostrar en ejemplos y más fácil de generar para un modelo sin conocimiento adicional del protocolo. En esta API me importa más la simplicidad del primer uso que un comportamiento de paginación perfecto sobre datos en movimiento.

Si esa concesión empieza a causar problemas en la práctica, ya podré cambiar el lenguaje publicado más adelante. Por ahora, gana la simplicidad.

## La verdadera ganancia no fue tener menos puntos de acceso

La ganancia de fondo es que la API ahora encaja con la forma en que los modelos de lenguaje sondean los sistemas de manera natural.

No quieren una visita guiada por un museo de herramientas. Quieren un lugar donde probar una intención y recibir un error útil si se equivocaron.

Por eso esto se siente mejor que la versión anterior. No es solo más pequeño. También es más fácil de inferir.

En productos para agentes, que algo sea fácil de inferir supera a una arquitectura interna elegante con una frecuencia sorprendente.

## Dónde no aplicaría este patrón

No usaría este enfoque si el producto dependiera mucho de verbos de dominio complejos que no tienen forma de CRUD.

Si la acción real es algo como `submit_review`, `run_scheduler` o `merge_learning_state`, fingir que todo es un `UPDATE` normalmente empeora la API. En esos casos mantendría comandos explícitos para las operaciones complejas y usaría el DSL similar a SQL para la capa amplia de lectura, el CRUD y los informes ligeros.

Esa es la parte que muchos equipos entienden al revés. O exponen el almacenamiento en bruto, lo cual es temerario, o envuelven cada operación diminuta en un punto de acceso a medida, lo cual es agotador.

El punto medio útil es:

- un DSL similar a SQL para acceso amplio a los datos
- comandos explícitos para acciones con mucha lógica de dominio

Esa división me parece bastante más realista que cualquiera de los dos extremos.

## Por qué me gusta esta dirección

La versión corta es simple.

Reemplacé un catálogo amplio de herramientas por un único lenguaje de consulta que la mayoría de los LLM ya sabe hablar a medias.

La versión para ingenieros es solo un poco más aburrida:

Mantuve exactamente donde estaban la arquitectura real del backend, el comportamiento de sincronización y las invariantes, y encima coloqué un contrato más fino y más fácil de aprender.

Esa separación me parece la correcta.

Si estás construyendo APIs para agentes, yo no empezaría por "¿cuál es la superficie OpenAPI más limpia para humanos?". Empezaría por "¿qué puede inferir rápido un modelo con la menor cantidad de documentación y el menor número de reintentos?".

A veces la respuesta no es otro punto de acceso.

A veces es un lenguaje pequeño.

Si quieres ver el producto, está aquí: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

Si quieres ver el código, el proyecto en GitHub está aquí: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). Es mi proyecto de código abierto con licencia MIT.
