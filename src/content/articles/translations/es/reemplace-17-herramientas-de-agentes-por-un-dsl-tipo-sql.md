---
title: "Por qué reemplacé 17 herramientas para agentes por un único DSL tipo SQL"
date: 2026-04-11
slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
description: "Cómo condensé 17 herramientas para agentes en Flashcards Open Source App en un único endpoint con un DSL tipo SQL que los LLM internos y externos pueden aprender rápido."
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "DSL tipo SQL para agentes de IA",
  "diseño de API para agentes de IA",
  "API de tool calling para LLM",
  "API de un único endpoint para agentes",
  "API SQL para LLM",
  "lenguaje específico de dominio para agentes",
  "consolidación de herramientas para agentes",
  "Flashcards Open Source App",
  "lenguaje de consultas para agentes de IA",
  "diseño de API orientado a LLM"
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

# Por qué reemplacé 17 herramientas para agentes por un único DSL tipo SQL

El martes pasado estaba repasando nuestra documentación para agentes en Flashcards Open Source App y me dio esa sensación tan familiar de cualquier ingeniero de backend: todo estaba ordenado, tipado, explícito y, aun así, resultaba un poco insoportable.

Tenía 17 herramientas distintas para agentes. `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`; luego el mismo patrón otra vez para decks, además de tags, configuración del scheduler, contexto del workspace e historial de repaso. No había nada roto. Y eso era precisamente lo irritante. Todo funcionaba.

El problema es que hacía ruido justo de la forma en que las APIs para LLM suelen volverse ruidosas. Un ingeniero humano puede leer la documentación una vez, montar un cliente y seguir con su vida. Un LLM no tiene esa ventaja. Tiene que reaprender la interfaz a partir de ejemplos, descripciones y errores. Si repartes una intención sencilla entre demasiadas herramientas, el modelo paga ese coste una y otra vez.

Esta es la capa de agentes detrás de [flashcards-open-source-app.com](https://flashcards-open-source-app.com/), así que me importaba bastante que la interfaz externa fuese fácil de entender, no solo técnicamente correcta.

Así que lo reduje todo a un único endpoint con un DSL tipo SQL.

No SQL crudo de PostgreSQL. No soy tan valiente.

![Endpoint con DSL tipo SQL que reemplaza 17 herramientas de agentes separadas](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 herramientas eran demasiadas

La versión anterior tenía herramientas distintas para lecturas y escrituras sobre varios recursos lógicos:

- contexto del workspace
- configuración del scheduler
- tags
- cards
- due cards
- decks
- historial de repaso

Desde la perspectiva del backend, todo esto está muy ordenado. Cada herramienta hace una sola cosa. Cada esquema es explícito. OpenAPI queda impecable. El movimiento clásico del ingeniero de backend.

Para el agente, en cambio, es puro papeleo.

Si el modelo quiere "tarjetas de inglés rápidas actualizadas hace poco", primero tiene que adivinar si eso corresponde a `list_cards`, `search_cards` o a otra cosa. Luego tiene que recordar la estructura del payload. Después, la paginación. Luego, los filtros. Y después, una segunda herramienta si quiere actualizar una fila tras leerla.

Eso se puede hacer funcionar. Yo hice que funcionara.

Simplemente dejó de convencerme.

## Qué cambió

El nuevo contrato público es una sola herramienta:

```json
{
  "sql": "SELECT * FROM cards WHERE tags OVERLAP ('english') AND effort_level IN ('fast', 'medium') ORDER BY updated_at DESC LIMIT 20 OFFSET 0"
}
```

El mismo endpoint para lecturas y escrituras simples.

```json
{
  "sql": "UPDATE cards SET back_text = 'Updated answer' WHERE card_id = '123e4567-e89b-42d3-a456-426614174000'"
}
```

Esa es la idea. Los agentes internos y externos ahora aprenden una sola interfaz en lugar de un pequeño museo de nombres de herramientas.

Antes, el agente tenía que averiguar qué herramienta existía para cada tarea.

Ahora puede empezar casi directamente por lo que quiere hacer:

- enséñame tarjetas
- filtra por etiqueta
- ordénalas por fecha de actualización
- actualiza este campo
- elimina estas filas

Eso encaja mucho mejor con la forma real en que los LLM tantean sistemas. Prueban algo, leen el error y vuelven a intentarlo. Un único lenguaje tipo SQL maneja ese bucle mucho mejor que 17 herramientas separadas.

## Por qué elegí SQL y no otro blob JSON

No elegí SQL porque quisiera convertir mi producto en un cliente de base de datos.

Elegí SQL porque casi cualquier LLM decente ya parte con bastante conocimiento previo sobre él. El modelo ya sabe, más o menos, qué deberían hacer `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` y `LIMIT`. Eso ahorra mucha explicación.

Si invento un DSL JSON a medida, el modelo tiene que aprender mis verbos, mi anidamiento, mis filtros, mis casos límite y el humor con el que bauticé las cosas esa semana. Si le doy una forma parecida a SQL, normalmente aterriza bastante cerca de la respuesta correcta al primer intento.

Incluso cuando se equivoca en la consulta, suele equivocarse de una forma útil. Normalmente pasa una de estas cosas:

- nombre de columna incorrecto
- cláusula no admitida
- falta `ORDER BY`
- `LIMIT` demasiado grande

Ese modo de fallo es muchísimo mejor que: "ha llamado a la herramienta equivocada, con el payload equivocado, y ahora necesita releer media especificación".

Quería algo que el modelo ya supiera hablar a medias y luego pudiera ir afinando mediante prueba y error. SQL sirve muy bien para eso.

## La parte importante: esto no es PostgreSQL

La parte importante de este diseño es lo que el endpoint **no** hace.

No ejecuta SQL crudo contra la base de datos real.

Analiza la cadena tipo SQL, la valida contra la gramática publicada y la compila a las mismas operaciones internas que el producto ya utiliza. La cadena SQL es el DSL público. No es un túnel directo hasta el almacenamiento.

Eso me permite mantener el comportamiento real del dominio donde corresponde:

- el ámbito del workspace se inyecta en el servidor
- los campos del sistema pueden leerse, pero no escribirse
- los metadatos de sincronización siguen siendo internos
- las invariantes del dominio siguen viviendo en los handlers reales
- el almacenamiento puede cambiar más adelante sin romper el contrato público

Esa era la línea que no quería cruzar. Flashcards Open Source App es offline-first y está diseñada pensando en la sincronización. No quiero que los agentes muten tablas a pelo y finjan que eso es la API del producto.

Así que el contrato es honesto: por fuera se parece a SQL; por dentro sigue siendo seguro para el dominio.

## La gramática terminó siendo más pequeña de lo que esperaba

La versión uno es intencionalmente pequeña:

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

Ese cambio lo simplificó todo bastante.

En lugar de publicar recursos extra como `tags_summary`, `due_cards` u otras vistas ya preparadas, le di un poco más de capacidad de consulta al propio lenguaje. Sobre todo `GROUP BY` y algunas funciones de agregación.

Así el modelo puede pedir resúmenes directamente, en vez de aprender una herramienta o un recurso distinto para cada tipo de resumen que a mí se me ocurriera exponer el mes pasado.

Por ejemplo, ahora se puede hacer algo así:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

O:

```sql
SELECT rating, COUNT(*) AS reviews
FROM review_events
GROUP BY rating
ORDER BY reviews DESC
LIMIT 10 OFFSET 0;
```

Eso es mucho más sencillo que mantener endpoints dedicados para cada necesidad menor de informes.

La gramática sigue siendo limitada. No estoy intentando fingir "Postgres completo".

Lo que no admito:

- `JOIN`
- `CTE`
- subconsultas
- ejecución de múltiples sentencias
- funciones arbitrarias
- acceso directo a tablas internas
- escrituras directas en campos protegidos del sistema

Suena restrictivo porque lo es. Bien. Eso es precisamente lo que mantiene esto honesto y mantenible.

## Algunas consultas posibles con la nueva interfaz

Leer cards:

```sql
SELECT *
FROM cards
WHERE tags OVERLAP ('english', 'grammar')
  AND effort_level IN ('fast', 'medium')
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;
```

Leer cards agrupadas por tag:

```sql
SELECT tag, COUNT(*) AS card_count
FROM cards
GROUP BY tag
ORDER BY card_count DESC
LIMIT 20 OFFSET 0;
```

Crear decks:

```sql
INSERT INTO decks (name, effort_levels, tags)
VALUES
  ('Grammar', ('medium', 'long'), ('english', 'grammar'));
```

Actualizar cards:

```sql
UPDATE cards
SET back_text = 'Updated answer',
    tags = ('english', 'verbs')
WHERE card_id = '123e4567-e89b-42d3-a456-426614174000';
```

Eliminar cards:

```sql
DELETE FROM cards
WHERE card_id IN (
  '123e4567-e89b-42d3-a456-426614174000',
  '123e4567-e89b-42d3-a456-426614174001'
);
```

Leer conteos de `review_events`:

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

Eso cubre buena parte de lo que antes resolvía el viejo catálogo de herramientas, sin obligar al agente a memorizar un endpoint distinto para cada sustantivo y para cada tipo de resumen dentro de la app.

Además, la documentación también se acorta. Ya no necesito explicar veinte formas de payload. Puedo enseñar una gramática pequeña, diez ejemplos y dejar que el modelo aprenda haciendo.

## La parte molesta que igual mantuve

Este diseño es más simple, pero no es magia.

La desventaja más clara es que, en cuanto dices "tipo SQL", la gente intentará usarlo como si fuera SQL real. Algunas de esas costumbres funcionarán. Otras no. El producto tiene que dejarlo muy claro cuando una consulta se sale de la gramática admitida.

También hice una concesión que a los puristas de bases de datos no les va a gustar: la v1 usa `LIMIT` y `OFFSET` directamente en SQL en vez de paginación por cursor.

Conozco la pega. Las páginas pueden desajustarse si los datos cambian entre solicitudes. La paginación por cursor es más segura.

Aun así, elegí `OFFSET` para esta interfaz porque es más fácil para quien escribe agentes, más fácil de enseñar con ejemplos y más fácil de generar para un modelo sin conocimiento adicional del protocolo. En esta API me importa más la simplicidad del primer uso que un comportamiento de paginación impecable sobre datos que van cambiando.

Si esa concesión empieza a doler en la práctica, ya cambiaré el lenguaje publicado más adelante. Por ahora, gana la simplicidad.

## La verdadera ganancia no fue tener menos endpoints

La ventaja de fondo es que la API ahora encaja con la forma en que los modelos de lenguaje exploran sistemas de manera natural.

No quieren una visita guiada por un museo de herramientas. Quieren un lugar donde probar una intención y recibir un error útil si se equivocaron al intuirla.

Por eso esto se siente mejor que la versión anterior. No es solo más pequeño. Es más fácil de intuir.

En productos pensados para agentes, que algo se pueda intuir pesa más que una arquitectura interna elegante con más frecuencia de la que uno imaginaría.

## Dónde no forzaría este patrón

No usaría este enfoque si el producto dependiera mucho de verbos de dominio complejos que no tienen forma de CRUD.

Si la acción real es algo como `submit_review`, `run_scheduler` o `merge_learning_state`, fingir que todo es un `UPDATE` normalmente empeora la API. En esos casos mantendría comandos explícitos para las operaciones complejas y usaría el DSL tipo SQL para la capa general de lectura, CRUD y resúmenes ligeros.

Esa es la parte que muchos equipos entienden al revés. O exponen el almacenamiento en bruto, que es una imprudencia, o envuelven cada operación diminuta en un endpoint a medida, que es agotador.

El punto medio útil es:

- un DSL tipo SQL para acceso amplio a datos
- comandos explícitos para acciones con mucha lógica de dominio

Esa división me parece bastante más realista que cualquiera de los dos extremos.

## Por qué me gusta esta dirección

La versión corta es simple.

Reemplacé un catálogo amplio de herramientas por un único lenguaje de consulta que la mayoría de los LLM ya sabe hablar a medias.

La versión para ingenieros es solo un poco menos emocionante:

Mantuve exactamente donde estaban la arquitectura real del backend, el comportamiento de sincronización y las invariantes, y encima coloqué un contrato más fino y más fácil de aprender.

Esa separación me parece la adecuada.

Si estás construyendo APIs para agentes, yo no empezaría por "¿cuál es la interfaz OpenAPI más limpia para humanos?". Empezaría por "¿qué puede inferir rápido un modelo con la menor cantidad de documentación y el menor número de reintentos?".

A veces la respuesta no es otro endpoint.

A veces es un lenguaje pequeño.

Si quieres ver el producto en sí, está aquí: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

Si quieres el código, el proyecto en GitHub está aquí: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). Es mi proyecto de código abierto con licencia MIT.
