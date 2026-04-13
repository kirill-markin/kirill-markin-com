---
title: "Por qué reemplacé 17 herramientas para agentes por un DSL tipo SQL"
date: 2026-04-11
slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
description: "Cómo sustituí 17 herramientas de la capa de agentes de Flashcards Open Source App por un único DSL tipo SQL que los LLM pueden aprender con rapidez."
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "DSL tipo SQL para agentes de IA",
  "diseño de APIs para agentes de IA",
  "API de llamadas a herramientas para LLM",
  "API unificada para agentes",
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

# Por qué reemplacé 17 herramientas para agentes por un DSL tipo SQL

El martes pasado estaba repasando nuestra documentación para agentes en Flashcards Open Source App y me topé con esa sensación tan familiar para cualquier ingeniero de backend: todo se veía limpio, tipado, explícito y un poco insoportable.

Tenía 17 herramientas distintas expuestas a los agentes. `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`; luego el mismo patrón otra vez para los mazos, además de etiquetas, configuración del planificador, contexto del espacio de trabajo e historial de repaso. No había nada roto. Y eso era justamente lo irritante. Todo funcionaba.

Simplemente hacía ruido, justo de la forma en que las APIs para LLM acaban haciendo ruido. Un ingeniero humano puede leer la documentación una vez, montar un cliente y seguir adelante. Un LLM no tiene ese lujo. Tiene que volver a aprender la interfaz a partir de ejemplos, descripciones y errores. Si repartes una intención sencilla entre demasiadas herramientas, el modelo paga ese coste cada vez.

Esta es la capa de agentes que hay detrás de [flashcards-open-source-app.com](https://flashcards-open-source-app.com/), así que me importaba bastante que la API externa fuera fácil de aprender, no solo técnicamente correcta.

Así que concentré todo en un único endpoint con un DSL tipo SQL.

No PostgreSQL en bruto. No soy tan valiente.

![Endpoint con un DSL tipo SQL que reemplaza 17 herramientas separadas para agentes](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 herramientas ya eran demasiadas

La versión anterior tenía herramientas distintas para lecturas y escrituras sobre varios recursos lógicos:

- contexto del espacio de trabajo
- configuración del planificador
- etiquetas
- tarjetas
- tarjetas pendientes
- mazos
- historial de repaso

Desde el punto de vista del backend, eso está muy ordenado. Cada herramienta hace una sola cosa. Cada esquema es explícito. OpenAPI queda impecable. La jugada clásica del ingeniero de backend.

Desde el punto de vista del agente, en cambio, es puro papeleo.

Si el modelo quiere "tarjetas de inglés rápidas, actualizadas hace poco", primero tiene que adivinar si eso corresponde a `list_cards`, `search_cards` o a otra cosa. Luego tiene que recordar la forma exacta del payload. Después la paginación. Luego los filtros. Y después una segunda herramienta si quiere actualizar una fila tras leerla.

Se puede hacer funcionar. Yo hice que funcionara.

Simplemente dejó de gustarme.

## Qué cambió

El nuevo contrato público se reduce a una sola herramienta:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

El mismo endpoint sirve para lecturas y para escrituras sencillas.

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

Esa es toda la idea. Los agentes internos y externos ahora aprenden una sola interfaz en lugar de un pequeño museo de nombres de herramientas.

Antes, el agente tenía que averiguar qué herramienta existía para cada tarea.

Ahora casi siempre puede empezar por la propia intención:

- muéstrame tarjetas
- filtra por etiqueta
- ordénalas por fecha de actualización
- actualiza este campo
- elimina estas filas

Eso encaja mucho mejor con la forma en que los LLM tantean los sistemas de verdad. Prueban algo, leen el error y vuelven a intentarlo. Un único lenguaje tipo SQL resuelve mucho mejor ese bucle que 17 herramientas separadas.

## Por qué elegí SQL y no otro DSL en JSON

No elegí SQL porque quisiera convertir mi producto en un cliente de base de datos.

Elegí SQL porque casi cualquier LLM decente ya trae mucho conocimiento previo sobre él. El modelo ya sabe, más o menos, qué se supone que hacen `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` y `LIMIT`. Eso ahorra mucha explicación.

Si invento un DSL JSON a medida, el modelo tiene que aprender mis verbos, mi anidación, mis filtros, mis casos límite y el estado de ánimo con el que bauticé las cosas esa semana. Si le doy una forma parecida a SQL, normalmente cae bastante cerca de la respuesta correcta en el primer intento.

Incluso cuando se equivoca en la consulta, suele equivocarse de una forma útil. Normalmente pasa una de estas cosas:

- nombre de columna incorrecto
- cláusula no admitida
- falta `ORDER BY`
- `LIMIT` demasiado grande

Es un modo de fallo mucho mejor que "llamó a la herramienta equivocada, con el payload equivocado, y ahora necesita releer media especificación".

Yo quería algo que el modelo ya supiera hablar a medias y luego pudiera pulir mediante prueba y reintento. SQL funciona muy bien para eso.

## La parte importante: esto no es PostgreSQL

Lo importante de este diseño es lo que el endpoint **no** hace.

No ejecuta SQL en bruto contra la base de datos real.

Interpreta la cadena tipo SQL, la valida contra la gramática publicada y la compila en las mismas operaciones internas que el producto ya usa. La cadena SQL es el DSL público. No es un acceso directo al almacenamiento.

Eso me permite mantener el comportamiento real del dominio donde corresponde:

- el ámbito del espacio de trabajo se inyecta en el servidor
- los campos del sistema pueden leerse, pero no escribirse
- los metadatos de sincronización siguen siendo internos
- las invariantes de dominio siguen viviendo en los controladores reales
- el almacenamiento puede cambiar más adelante sin romper el contrato público

Esa era la línea que no quería cruzar. Flashcards Open Source App está pensada para priorizar el modo offline y la sincronización. No quiero que los agentes modifiquen tablas directamente y hagan como si eso fuera la API del producto.

Así que el contrato es honesto: por fuera tiene forma de SQL; por dentro sigue siendo seguro para el dominio.

## La gramática acabó siendo más pequeña de lo que esperaba

La versión uno es deliberadamente pequeña:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

Al principio pensé que mantendría una lista más larga de recursos lógicos. Luego recorté también esa parte.

Al final dejé la interfaz pública muy cerca de los sustantivos principales:

- `cards`
- `decks`
- `workspace`
- `review_events`

Ese cambio limpió bastante el conjunto.

En lugar de publicar recursos extra como `tags_summary`, `due_cards` u otras vistas ya preparadas, le di un poco más de capacidad expresiva al propio lenguaje. Sobre todo `GROUP BY` y algunas funciones de agregación.

Así el modelo puede pedir resúmenes directamente, en vez de aprender una herramienta o un recurso distinto para cada tipo de resumen que a mí se me ocurriera exponer el mes pasado.

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

Eso es mucho más simple que mantener endpoints dedicados para cada pequeña necesidad de informes.

La gramática sigue siendo limitada. No intento fingir que esto es "Postgres completo".

Cosas que no soporta:

- `JOIN`
- `CTE`
- subconsultas
- ejecución de múltiples sentencias
- funciones arbitrarias
- acceso directo a tablas internas
- escrituras directas sobre campos protegidos del sistema

Suena restrictivo porque es restrictivo. Bien. Eso es exactamente lo que mantiene esto honesto y sostenible.

## Algunas consultas de la nueva interfaz

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

Eso cubre una buena parte de lo que antes hacía el viejo catálogo de herramientas, sin obligar al agente a memorizar un endpoint distinto para cada sustantivo y cada tipo de resumen de la aplicación.

Uno de los efectos secundarios agradables es que la documentación también se acorta. Ya no necesito explicar veinte formatos de payload distintos. Puedo mostrar una gramática pequeña, diez ejemplos y dejar que el modelo aprenda haciendo.

## La parte incómoda que decidí conservar

Este diseño es más simple, pero no es magia.

La desventaja más evidente es que, en cuanto dices "tipo SQL", la gente va a intentar usarlo como si fuera SQL real. Algunos de esos hábitos funcionarán. Otros no. El producto tiene que dejar muy claro cuándo una consulta se sale de la gramática admitida.

También hice una concesión que a los puristas de las bases de datos no les va a gustar: la v1 usa `LIMIT` y `OFFSET` directamente en SQL en vez de paginación por cursor.

Conozco la desventaja. Las páginas pueden moverse si los datos cambian entre solicitudes. La paginación por cursor es más segura.

Aun así, elegí `OFFSET` para esta interfaz porque es más fácil para quien escribe agentes, más fácil de enseñar con ejemplos y más fácil de generar para un modelo sin conocimiento adicional del protocolo. En esta API me importa más la simplicidad del primer uso que un comportamiento de paginación perfecto sobre datos que cambian.

Si esa concesión empieza a doler en la práctica, ya podré cambiar el lenguaje publicado más adelante. Por ahora, gana la simplicidad.

## La ganancia real no fue tener menos endpoints

La ganancia de fondo es que la API ahora encaja con la forma en que los modelos de lenguaje exploran los sistemas de manera natural.

No quieren una visita guiada por un museo de herramientas. Quieren un sitio donde probar una intención y recibir un error útil si se equivocaron.

Por eso esta versión se siente mejor que la anterior. No es solo más pequeña. También es más fácil de deducir.

En productos para agentes, lo fácil de deducir suele pesar más que una arquitectura interna elegante, y ocurre más a menudo de lo que parece.

## Dónde no aplicaría este patrón

No usaría este enfoque si el producto dependiera mucho de verbos de dominio complejos que no tienen forma de CRUD.

Si la acción real es algo como `submit_review`, `run_scheduler` o `merge_learning_state`, fingir que todo es un `UPDATE` normalmente empeora la API. En esos casos mantendría comandos explícitos para las operaciones complejas y usaría el DSL tipo SQL para la capa general de lectura, el CRUD y los informes ligeros.

Ahí es donde muchos equipos se equivocan. O exponen el almacenamiento en bruto, lo cual es temerario, o envuelven cada operación diminuta en un endpoint a medida, lo cual acaba agotando.

El punto medio útil es:

- un DSL tipo SQL para acceso amplio a los datos
- comandos explícitos para acciones con mucha lógica de dominio

Esa división me parece bastante más realista que cualquiera de los dos extremos.

## Por qué me gusta esta dirección

La versión corta es sencilla.

Reemplacé un catálogo amplio de herramientas por un lenguaje de consulta único que la mayoría de los LLM ya medio entiende.

La versión para ingeniería solo tiene un poco más de letra pequeña:

Dejé la arquitectura real del backend, el comportamiento de sincronización y las invariantes exactamente donde ya estaban, y encima puse un contrato más fino y más fácil de aprender.

Esa separación me parece la correcta.

Si estás construyendo APIs para agentes, yo no empezaría por "¿cuál es la interfaz OpenAPI más limpia para humanos?". Empezaría por "¿qué puede inferir rápido un modelo con la menor cantidad de documentación y el menor número de reintentos?".

A veces la respuesta no es otro endpoint.

A veces es un lenguaje pequeño.

Si quieres ver el producto, está aquí: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

Si quieres ver el código, el proyecto en GitHub está aquí: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). Es mi proyecto de código abierto con licencia MIT.
