---
title: "Por qué reemplacé 17 herramientas de agentes por un DSL tipo SQL"
date: 2026-04-11
slug: "reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql"
description: "Cómo condensé 17 herramientas de agentes en Flashcards Open Source App en un endpoint con DSL tipo SQL fácil de aprender para LLM internos y externos."
tags: [productivity, ai, llm]
publish: true
thumbnailUrl: "/articles/sql-like-dsl-for-ai-agents.webp"
keywords: [
  "DSL tipo SQL para agentes de IA",
  "diseno de API para agentes de IA",
  "API de tool calling para LLM",
  "API de endpoint unico para agentes",
  "API SQL para LLM",
  "lenguaje especifico de dominio para agentes",
  "consolidacion de herramientas de agentes",
  "Flashcards Open Source App",
  "lenguaje de consultas para agentes de IA",
  "diseno de API amigable para LLM"
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

# Por qué reemplacé 17 herramientas de agentes por un DSL tipo SQL

El martes pasado estaba revisando nuestra documentación de agentes en Flashcards Open Source App y me golpeó ese momento tan familiar de ingeniero backend: todo se veía ordenado, tipado, explícito y un poco insoportable.

Tenía 17 llamadas de herramienta separadas para agentes. `list_cards`, `get_cards`, `search_cards`, `list_due_cards`, `create_cards`, `update_cards`, `delete_cards`, luego el mismo patrón otra vez para decks, además de tags, configuración del scheduler, contexto del workspace e historial de repasos. Nada estaba roto. Esa era la parte irritante. Todo funcionaba.

Solo que era ruidoso exactamente en la forma en que las APIs para LLM tienden a volverse ruidosas. Un ingeniero humano puede leer la documentación una vez, construir un cliente y seguir adelante. Un LLM no tiene ese lujo. Tiene que volver a aprender la superficie a partir de ejemplos, descripciones y errores. Si repartes una intención sencilla entre demasiadas herramientas, el modelo paga ese costo cada vez.

Esta es la capa de agentes detrás de [flashcards-open-source-app.com](https://flashcards-open-source-app.com/), así que me importaba bastante que la superficie externa fuera fácil de aprender, no solo técnicamente correcta.

Así que colapsé todo en un único endpoint con un DSL tipo SQL.

No SQL crudo de PostgreSQL. No soy tan valiente.

![Endpoint con DSL tipo SQL que reemplaza 17 herramientas de agentes separadas](/articles/sql-like-dsl-for-ai-agents.webp)

## 17 herramientas eran demasiadas

La versión anterior tenía herramientas separadas para lecturas y escrituras sobre varios recursos lógicos:

- contexto del workspace
- configuración del scheduler
- tags
- cards
- due cards
- decks
- historial de repasos

Desde el lado backend, esto es prolijo. Cada herramienta hace una sola cosa. Cada esquema es explícito. OpenAPI se ve respetable. Movimiento clásico de ingeniero backend.

Desde el lado del agente, es papeleo.

Si el modelo quiere "cards de inglés rápidas actualizadas recientemente", primero tiene que adivinar si eso pertenece a `list_cards`, `search_cards` o alguna otra cosa. Luego tiene que recordar la forma del payload. Después la paginación. Luego el filtrado. Luego una segunda herramienta si quiere actualizar una fila después de leerla.

Eso se puede hacer funcionar. Yo hice que funcionara.

Simplemente dejó de gustarme.

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

Ese es todo el punto. Los agentes internos y externos ahora aprenden una sola superficie en lugar de un pequeño museo de nombres de herramientas.

Antes, el agente tenía que averiguar qué herramienta existía para cada trabajo.

Ahora puede empezar casi directamente por el trabajo en sí:

- muéstrame cards
- filtra por tag
- ordena por fecha de actualización
- actualiza este campo
- elimina estas filas

Eso encaja mucho mejor con la manera real en que los LLM tantean sistemas. Prueban algo, leen el error y vuelven a probar. Un único lenguaje tipo SQL maneja ese bucle mucho mejor que 17 herramientas separadas.

## Por qué elegí SQL y no otro blob JSON

No elegí SQL porque quisiera convertir mi producto en un cliente de base de datos.

Elegí SQL porque casi cualquier LLM decente ya trae un gran prior sobre eso. El modelo ya sabe más o menos qué deberían hacer `SELECT`, `UPDATE`, `WHERE`, `ORDER BY` y `LIMIT`. Eso ahorra mucha explicación.

Si invento un DSL JSON personalizado, el modelo tiene que aprender mis verbos, mi anidamiento, mis filtros, mis casos borde y el estado de ánimo con el que nombré las cosas esa semana. Si le doy una forma parecida a SQL, normalmente cae bastante cerca de la respuesta correcta en el primer intento.

Incluso cuando se equivoca en la consulta, suele equivocarse de una manera útil. Normalmente es una de estas:

- nombre de columna incorrecto
- cláusula no soportada
- falta `ORDER BY`
- `LIMIT` demasiado grande

Ese es un modo de fallo mucho mejor que "llamó a la herramienta equivocada, con la forma de payload equivocada, y ahora necesita releer media especificación".

Quería algo que el modelo ya pudiera hablar a medias y luego pulir mediante prueba y error. SQL es muy bueno para eso.

## La parte importante: esto no es PostgreSQL

La parte importante de este diseño es lo que el endpoint **no** hace.

No ejecuta SQL crudo contra la base de datos real.

Parsea la cadena tipo SQL, la valida contra la gramática publicada y la compila a las mismas operaciones internas que el producto ya usa. La cadena SQL es el DSL público. No es un túnel directo al almacenamiento.

Eso me permite mantener el comportamiento real del dominio donde corresponde:

- el alcance del workspace se inyecta en el servidor
- los campos del sistema pueden ser legibles pero no escribibles
- los metadatos de sincronización permanecen internos
- las invariantes del dominio siguen viviendo en los handlers reales
- el almacenamiento puede cambiar más adelante sin romper el contrato público

Esa era la línea que no quería cruzar. Flashcards Open Source App es offline-first y consciente de la sincronización. No quiero que los agentes muten tablas crudas y finjan que eso es la API del producto.

Así que el contrato es honesto: con forma de SQL por fuera, seguro para el dominio por dentro.

## La gramática terminó siendo más pequeña de lo que esperaba

La versión uno es intencionalmente pequeña:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

Al principio pensé que mantendría una lista más larga de recursos lógicos. Luego recorté eso también.

Terminé dejando la superficie pública cerca de los sustantivos centrales:

- `cards`
- `decks`
- `workspace`
- `review_events`

Ese cambio limpió todo bastante.

En lugar de publicar recursos extra como `tags_summary`, `due_cards` u otras vistas preformateadas, añadí un poco más de poder de consulta al propio lenguaje. Sobre todo `GROUP BY` y algunas funciones agregadas.

Así el modelo puede pedir resúmenes directamente en vez de aprender una herramienta o recurso separado para cada forma de resumen que se me ocurrió exponer el mes pasado.

Por ejemplo, ahora es posible algo como esto:

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

Eso es mucho más simple que mantener endpoints dedicados para cada pequeña necesidad de reporting.

La gramática sigue siendo limitada. No estoy intentando fingir "Postgres completo".

Cosas que no soporto:

- `JOIN`
- `CTE`
- subconsultas
- ejecución de múltiples sentencias
- funciones arbitrarias
- acceso directo a tablas internas
- escrituras directas en campos protegidos del sistema

Eso suena restrictivo porque es restrictivo. Bien. Eso es exactamente lo que mantiene esta cosa honesta y mantenible.

## Algunas consultas de la nueva superficie

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

Leer conteos de review events:

```sql
SELECT review_grade, COUNT(*) AS total_reviews
FROM review_events
GROUP BY review_grade
ORDER BY total_reviews DESC
LIMIT 10 OFFSET 0;
```

Eso cubre una gran parte de lo que hacía antes el catálogo de herramientas viejo, sin obligar al agente a memorizar un endpoint separado para cada sustantivo y cada forma de resumen en la app.

Uno de los efectos secundarios agradables es que la documentación también se acorta. Ya no necesito explicar veinte formas de payload. Puedo mostrar una gramática pequeña, diez ejemplos y dejar que el modelo aprenda haciendo.

## La parte molesta que igual mantuve

Este diseño es más simple, pero no es magia.

La mayor desventaja honesta es que, en cuanto dices "tipo SQL", la gente intentará usar hábitos de SQL real. Algunos de esos hábitos funcionarán. Otros no. El producto tiene que ser muy tajante cuando una consulta sale de la gramática soportada.

También hice una concesión que a los puristas de bases de datos les va a molestar: la v1 usa `LIMIT` y `OFFSET` directamente en SQL en lugar de paginación por cursor.

Conozco la desventaja. Las páginas pueden desplazarse si los datos cambian entre solicitudes. La paginación por cursor es más segura.

Igualmente elegí `OFFSET` para esta superficie porque es más fácil para quienes escriben agentes, más fácil de mostrar en ejemplos y más fácil de generar para un modelo sin conocimiento extra de protocolo. Para esta API, me importa más la simplicidad del primer uso que el comportamiento perfecto de paginación sobre datos que se mueven.

Si esa concesión empieza a doler en la práctica, puedo cambiar el lenguaje publicado más adelante. Por ahora, gana la simplicidad.

## La verdadera ganancia no fue tener menos endpoints

La ganancia más profunda aquí es que la API ahora coincide con la manera en que los modelos de lenguaje exploran sistemas de forma natural.

No quieren una visita guiada por un museo de herramientas. Quieren un sitio donde probar una intención y recibir un error útil si adivinaron mal.

Por eso esto se siente mejor que la versión anterior. No es solo más pequeño. Es más fácil de adivinar.

Para productos dirigidos a agentes, que algo sea fácil de adivinar supera a una arquitectura interna elegante con más frecuencia de la que uno esperaría.

## Dónde no forzaría este patrón

No usaría este enfoque si el producto depende mucho de verbos de dominio complejos que no tienen forma de CRUD.

Si la acción real es algo como `submit_review`, `run_scheduler` o `merge_learning_state`, fingir que todo es un `UPDATE` normalmente empeora la API. En esos casos mantendría comandos explícitos para las operaciones complejas y usaría el DSL tipo SQL para la capa amplia de lectura, CRUD y reporting ligero.

Esa es la parte que muchos equipos entienden al revés. O exponen almacenamiento crudo, lo cual es imprudente, o envuelven cada operación diminuta en un endpoint personalizado, lo cual es agotador.

El punto medio útil es:

- DSL tipo SQL para acceso amplio a datos
- comandos explícitos para acciones pesadas de dominio

Esa división me parece mucho más realista que cualquiera de los dos extremos.

## Por qué me gusta esta dirección

La versión corta es simple.

Reemplacé un catálogo amplio de herramientas por un único lenguaje de consulta que la mayoría de los LLM ya puede hablar a medias.

La versión de ingeniería es apenas un poco más aburrida:

Mantuve exactamente donde estaban la arquitectura backend real, el comportamiento de sincronización y las invariantes, y luego puse encima un contrato más fino y más fácil de aprender.

Esa separación me parece la correcta.

Si estás construyendo APIs para agentes, yo no empezaría por "¿cuál es la superficie OpenAPI más limpia para humanos?". Empezaría por "¿qué puede inferir rápido un modelo con la menor cantidad de documentación y el menor número de reintentos?".

A veces la respuesta no es otro endpoint.

A veces es un lenguaje pequeño.

Si quieres ver el producto en sí, está aquí: [flashcards-open-source-app.com](https://flashcards-open-source-app.com/)

Si quieres el código, el proyecto en GitHub está aquí: [github.com/kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app). Es mi proyecto open source con licencia MIT.
