---
keywords: [
  "automatizar la categorización de correos",
  "flujo de correo en n8n",
  "clasificación de correos con IA",
  "automatización de correos con LLM",
  "automatización de Gmail con n8n",
  "sistema de categorización de correos",
  "tutorial de flujo de trabajo en n8n",
  "filtrado de correos con GPT",
  "etiquetas automáticas en Gmail",
  "automatización de productividad con correo electrónico"
]
title: "Cómo automatizar la categorización de correos con n8n y LLM"
date: 2026-04-11
slug: "como-automatizar-la-categorizacion-de-correos-con-n8n-y-llm"
description: "El sistema que he usado durante tres meses para automatizar la categorización de correos con n8n y GPT-5-nano. Archivar, leer o responder: deja que la IA decida por ti."
tags: [productivity, ai]
publish: true
thumbnailUrl: "/articles/how-to-automate-email-categorization-with-n8n-and-llm.webp"
language: "es"
originalArticle:
  language: "en"
  slug: "how-to-automate-email-categorization-with-n8n-and-llm"
translations:
  - language: "en"
    slug: "how-to-automate-email-categorization-with-n8n-and-llm"
  - language: "zh"
    slug: "ruhe-yong-n8n-he-llm-zidong-fenlei-youjian"
  - language: "hi"
    slug: "n8n-aur-llm-se-email-vargikaran-automate-kaise-karen"
  - language: "ar"
    slug: "kayfa-tuatim-tasnif-albarid-aliiliktruni-bi-n8n-wa-llm"
---

# Cómo automatizar la categorización de correos con n8n y LLM

Me cansé de esperar a que Gmail entendiera qué correos me importan de verdad. Después de tres meses dejando que la IA gestione la clasificación de mi correo personal, no me imagino volver al orden manual.

Mi sistema es ridículamente simple: GPT-5-nano clasifica cada correo en una de tres categorías. Archivar, leer o responder. Ya está.

Todo funciona sobre n8n y me cuesta casi nada porque uso el modelo más barato de OpenAI con salida estructurada. Sí, ahora OpenAI ve todos mis correos personales, pero seamos sinceros: probablemente ya sepan más de mí por mis conversaciones en ChatGPT.

No estoy vendiendo una idea teórica. Llevo tres meses usando esto en producción y me ahorra horas cada semana.

## Por qué construí este sistema de automatización del correo

Recibo demasiados correos. Boletines a los que estoy suscrito, notificaciones de servicios, mensajes realmente importantes de personas reales: todo cae en la misma bandeja de entrada. La categorización integrada de Gmail seguía pasando por alto patrones evidentes, y yo gastaba 20 minutos cada mañana solo en decidir qué leer.

El punto de quiebre llegó cuando me di cuenta de que archivaba el 80% de mis correos sin leerlos. Si la mayoría no necesita mi atención, ¿por qué sigo siendo yo quien decide cuáles sí?

> **¿Prefieres un tutorial en video?** He grabado una demostración paso a paso de todo este flujo de automatización del correo. [Mira el tutorial de automatización de correo con n8n y LLM](https://www.youtube.com/watch?v=xn1RyMlZudE) para ver el proceso completo en acción.

[![Demostración del flujo de automatización del correo con n8n y LLM](https://img.youtube.com/vi/xn1RyMlZudE/maxresdefault.jpg)](https://www.youtube.com/watch?v=xn1RyMlZudE)

## El sistema de tres categorías que sí funciona

Mi IA clasifica cada correo en exactamente tres opciones:

- **Archivar** - boletines a los que me suscribí pero nunca leo, notificaciones automáticas y correos promocionales
- **Leer** - contenido que quiero consumir pero que no requiere respuesta
- **Responder** - correos que necesitan una respuesta humana de mi parte

Sin estructuras complejas de carpetas. Sin niveles de prioridad. Solo tres acciones simples que cubren el 100% de mi correo.

## Cómo configurar el flujo de n8n

Este es el flujo completo de n8n que lo gestiona todo automáticamente:

![Flujo de categorización de correos en n8n](/articles/assets/n8n-email-workflow-full.webp)

El flujo se activa cada vez que llega un correo nuevo a mi bandeja de Gmail. Toma el contenido del mensaje, lo envía a OpenAI para que lo categorice y después aplica la etiqueta adecuada de Gmail y archiva los correos que no necesitan mi atención.

### Nodos de n8n necesarios

Necesitarás estos nodos en tu flujo:

1. **Gmail Trigger** - monitoriza los correos nuevos
2. **OpenAI Chat Model** - categoriza el contenido del correo
3. **Gmail** - aplica etiquetas y archiva correos
4. **IF conditions** - dirige los correos según la decisión de la IA

La magia está en la configuración del nodo de OpenAI. Así lo tengo montado:

![Configuración del nodo LLM de OpenAI en n8n](/articles/assets/n8n-llm-node-config.webp)

## El prompt del LLM que lo hace funcionar

El prompt es el corazón del sistema. Después de probar docenas de variaciones, este es el que me da resultados más consistentes:

> **Nota**: Esto es solo el prompt del LLM para categorizar correos. Si quieres la automatización completa de n8n, con todos los nodos y conexiones, baja hasta la sección "JSON completo del flujo de n8n".

<details>
<summary>Haz clic para desplegar el prompt completo del LLM</summary>

```
Act as an Email classifier. You will get email data and need to return the correct label from the list of available labels.

<email-data>
<from>{{ $json.From }}</from>
<to>{{ $json.To }}</to>
<email-subject>
{{ $json.Subject }}
</email-subject>
<email-snippet>
{{ $json.snippet }}
</email-snippet>
</email-data>

<possible-labels>

<to_read>
- `to_read` — for emails that need to be read by a human. 
<to_read-examples>
- a secret code from the app/service
- notification about a message in another system, Kirill needs to log in and answer
- notification about something important Kirill needs to do
- notification from GitHub about a new message or issue in my project
</to_read-examples>
</to_read>

<to_hide>
- `to_hide` — for emails that are OK to be in the archive, but not needed to be read by a human right now. 
<to_hide-examples> 
- Invoices 
- Some subscription for charity or news
- Product updates
- Advertising
- Proposals from companies without a history of our communications, but do not hide proposals from individuals
- Mentioning me in Discord or Slack (most likely spam and group mentions, or I will see it again in Slack, and no need to see here)
- Slack notification about new messages because Kirill will see them in Slack, no need to see them in email.
- Community summaries
- Some service incidents are mentioned, and an overview
- Notification about one more subscriber, because it does not need action from Kirill, and we can hide it.
- meeting notes from some AI software, because it is OK to have them in the archive, but Kirill doesn't need to reread them now.
</to_hide-examples>
</to_hide>

<to_answer>
- `to_answer` — for emails that need an answer.
<to_answer-examples>
- some emails with questions from a person or a company
</to_answer-examples>
<to_answer-bad-examples>
- message in external system, not in Gmail — bad example because Kirill can not answer via email. We need to mark these emails as to_read.
</to_answer-bad-examples>
</to_answer>

</possible-labels>

{{$node["exceptions"].json["additional-data-for-classify"]}}

Answer in JSON with two fields:
- `reasoning`
- `label`
```

</details>

Uso salida estructurada para asegurar que la IA siempre devuelva una categoría válida. Sin errores al procesar la respuesta, sin casos raros en los que el modelo se inventa un formato creativo.

## Tres meses de resultados reales

Desde que implementé este sistema:

- **Tiempo ahorrado**: unos 15-20 minutos al día en la clasificación inicial del correo
- **Precisión**: la IA categoriza correctamente alrededor del 95% de los correos
- **Coste**: menos de 3 dólares al mes usando GPT-5-nano
- **Falsos positivos**: quizá 2-3 correos a la semana quedan mal clasificados

Ese 5% de error es perfectamente manejable. Cuando la IA se equivoca, solo muevo el correo a la categoría correcta y sigo. Aun así es mucho más rápido que ordenar todo manualmente.

## Consideraciones de seguridad (y por qué me parece aceptable)

Sí, OpenAI ahora procesa todos mis correos personales. No es ideal desde la privacidad, pero hice las paces con eso por varias razones.

Primero, ya uso un gestor de contraseñas con códigos 2FA que no dependen del correo electrónico, así que una filtración del correo no sería catastrófica. Segundo, OpenAI ya sabe bastante sobre mí por mi uso habitual de ChatGPT. Tercero, el ahorro de tiempo compensa esa cesión de privacidad en mi flujo personal.

Si trabajas con correos empresariales sensibles, quizá prefieras usar un LLM local en lugar de la API de OpenAI. La configuración en n8n funciona igual.

## Cómo empezar con tu propia automatización de correo

Así puedes montar este sistema:

1. **Configura n8n** - autoalojado o con n8n Cloud
2. **Conecta Gmail** - tendrás que autenticar tu cuenta
3. **Consigue acceso a la API de OpenAI** - crea una cuenta y obtén tu clave de API
4. **Importa el flujo** - compartiré el JSON exportado si la gente lo pide
5. **Personaliza el prompt** - ajusta las categorías a tus patrones de correo
6. **Prueba con unos pocos correos** - empieza poco a poco antes de automatizarlo todo

Todo el montaje lleva unos 30 minutos si ya conoces n8n. Quizá una hora si empiezas desde cero.

## Por qué esto supera a las funciones integradas de Gmail

La categorización automática de Gmail está diseñada para todo el mundo, y eso significa que no está optimizada para nadie en particular. Mi sistema aprende mis patrones y preferencias concretas de correo.

Además, puedo modificar la lógica cuando quiera. ¿Quieres añadir una cuarta categoría? Cambia el prompt. ¿Necesitas tratar de otra forma los correos de ciertos remitentes? Añade un nodo condicional. Las reglas de Gmail son rígidas; este sistema se adapta a lo que yo necesito.

## La conclusión

Después de tres meses, este sistema de automatización de correo se ha vuelto esencial en mi rutina diaria. No es perfecto, pero es muchísimo mejor que clasificar manualmente cientos de correos cada semana.

La configuración es directa, el coste continuo es mínimo y el ahorro de tiempo es real. Si estás ahogándote en correo como me pasaba a mí, quizá valga la pena probar este enfoque.

Solo recuerda: empieza simple, prueba bien y no automatices nada que no puedas deshacer con facilidad.

## JSON completo del flujo de n8n

Para quienes quieran implementar el sistema ya mismo, aquí está el flujo completo de n8n que puedes importar directamente:

<details>
<summary>Haz clic para desplegar el JSON completo del flujo</summary>

```json
{
  "name": "email-ai-automation-personal",
  "nodes": [
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.message.content.label }}",
                    "rightValue": "to_read",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "585b8b65-2369-4f4e-ba0d-4a7dfc7cdef9"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "to_read"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "99e46836-ea2f-41d7-8ebc-24bd5cfadd41",
                    "leftValue": "={{ $json.message.content.label }}",
                    "rightValue": "to_hide",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "to_hide"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "2a10fb26-99e6-43ab-854c-2d208f701ac3",
                    "leftValue": "={{ $json.message.content.label }}",
                    "rightValue": "to_answer",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "to_answer"
            }
          ]
        },
        "options": {
          "fallbackOutput": "extra"
        }
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        -1552,
        432
      ],
      "id": "ff266540-edd6-42ef-8e07-f1754c1aa394",
      "name": "Switch"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        -2256,
        432
      ],
      "id": "66a72457-b0e5-4ab0-bf49-ef00a06213aa",
      "name": "Loop Over Items"
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "addLabels",
        "threadId": "={{ $json.threadId }}",
        "labelIds": []
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -1296,
        112
      ],
      "id": "47db305c-2f55-4797-b646-331903a798ad",
      "name": "Add label to_hide",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "addLabels",
        "threadId": "={{ $json.threadId }}",
        "labelIds": []
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -1296,
        480
      ],
      "id": "bb1c5387-99a2-42ba-b615-ae65f39e9337",
      "name": "Add label to_answer",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "addLabels",
        "threadId": "={{ $json.threadId }}",
        "labelIds": []
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -1296,
        288
      ],
      "id": "82f68387-c342-4222-87c3-f6bbb1a23f77",
      "name": "Add label to_read",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "addLabels",
        "threadId": "={{ $('Merge2').item.json.threadId }}",
        "labelIds": []
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -880,
        656
      ],
      "id": "7de8f655-3c3d-49f9-9074-b39eaf4abaf2",
      "name": "Add label processed_by_ai",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "removeLabels",
        "threadId": "={{ $('Merge2').item.json.threadId }}",
        "labelIds": [
          "INBOX"
        ]
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -1040,
        208
      ],
      "id": "438c1618-edf3-41a1-b991-fef18b003edf",
      "name": "Remove label from thread",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyX"
            }
          ]
        },
        "filters": {}
      },
      "type": "n8n-nodes-base.gmailTrigger",
      "typeVersion": 1.2,
      "position": [
        -2560,
        160
      ],
      "id": "676e065d-fc0b-4ae4-8c1b-4b663267023f",
      "name": "Gmail Trigger",
      "credentials": {}
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "be8e84b9-48af-4a49-b4f7-797382c13afe",
              "name": "additional-data-for-classify",
              "value": "<additional-data-for-classify>\n- All messages from Deel with the main idea, like `New contractor submission`, please mark as `to_hide`.\n</additional-data-for-classify>",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -2240,
        -32
      ],
      "id": "9cb4e14e-cd43-4a7b-96c9-7acd93b8b947",
      "name": "exceptions"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-5-mini",
          "mode": "list",
          "cachedResultName": "GPT-5-MINI"
        },
        "messages": {
          "values": [
            {
              "content": "=Act as an Email classifier. You will get email data and need to return the correct label from the list of available labels.\n\n<email-data>\n<from>{{ $json.From }}</from>\n<to>{{ $json.To }}</to>\n<email-subject>\n{{ $json.Subject }}\n</email-subject>\n<email-snippet>\n{{ $json.snippet }}\n</email-snippet>\n</email-data>\n\n<possible-lables>\n\n<to_read>\n- `to_read` — for emails that need to be read by a human. \n<to_read-examples>\n- a secret code from the app/service\n- notification about a message in another system, Kirill needs to log in and answer\n- notification about something important Kirill needs to do\n- notification from GitHub about a new message or issue in my project\n</to_read-examples>\n</to_read>\n\n<to_hide>\n- `to_hide` — for emails that are OK to be in the archive, but not needed to be read by a human right now. \n<to_hide-examples> \n- Invoices \n- Some subscription for charity or news\n- Product uddates\n- Advertising\n- Proposals from companies without a history of our communications, but do not hide proposals from individuals\n- Mentioning me in Discord or Slack (most likely spam and group mentions, or I will see it again in Slack, and no need to see here)\n- Slack notification about new messages because Kirill will see them in Slack, no need to see them in email.\n- Community summaries\n- Some service incidents are mentioned, and an overview\n- Notification about one more subscriber, because it does not need action from Kirill, and we can hide it.\n- meeting notes from some AI software, because it is OK to have them in the archive, but Kirill doesn't need to reread them now.\n</to_hide-examples>\n</to_hide>\n\n<to_answer>\n- `to_answer` — for emails that need an answer.\n<to_answer-examples>\n- some emails with questions from a person or a company\n</to_answer-examples>\n<to_answer-bad-examples>\n- message in external system, not in Gmail — bad example because Kirill can not answer via email. We need to mark these emails as to_read.\n</to_answer-bad-examples>\n</to_answer>\n\n</possible-lables>\n\n{{$node[\"exceptions\"].json[\"additional-data-for-classify\"]}}\n\nAnswer in JSON with two fields:\n- `reasoning`\n- `label`"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        -2032,
        560
      ],
      "id": "4f65ce04-67eb-4c28-9d56-6d2f03dedd41",
      "name": "llm categorization",
      "alwaysOutputData": false,
      "credentials": {}
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "95f8838a-df88-496c-a0ea-d19c612eb81b",
              "leftValue": "={{ $json.labels.filter(item => item.id == \"__REPLACE_WITH_YOUR_PROCESSED_LABEL_ID__\") }}",
              "rightValue": "={{ \"\" }}",
              "operator": {
                "type": "array",
                "operation": "empty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2.2,
      "position": [
        -1936,
        144
      ],
      "id": "cc8dda5a-414c-4fb8-9774-6bdfe1224976",
      "name": "Filter: not processed"
    },
    {
      "parameters": {
        "sendTo": "",
        "subject": "There is a problem with AI email workflow — AI choose the wrong option",
        "emailType": "text",
        "message": "!",
        "options": {}
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -1296,
        656
      ],
      "id": "90cfc5e9-cddd-418e-bf95-5e9eb77b6778",
      "name": "Send error message",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "operation": "getAll",
        "returnAll": true,
        "filters": {
          "q": "=label:INBOX -label:__REPLACE_WITH_YOUR_PROCESSED_LABEL_ID__ after:2025/06/15"
        }
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        -2400,
        160
      ],
      "id": "5d534d0c-0210-4d32-853d-d26a5b13c646",
      "name": "Get emails with filter",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineByPosition",
        "options": {}
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.2,
      "position": [
        -2080,
        144
      ],
      "id": "c6e6b5bd-0196-4a4f-a36d-1f119df3ee5d",
      "name": "Merge1"
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineByPosition",
        "options": {}
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.2,
      "position": [
        -1696,
        464
      ],
      "id": "d109e9f9-1089-4060-89e4-e70762d0aea5",
      "name": "Merge2"
    }
  ],
  "pinData": {},
  "connections": {
    "Switch": {
      "main": [
        [
          {
            "node": "Add label to_read",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Add label to_hide",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Add label to_answer",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Send error message",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Over Items": {
      "main": [
        [],
        [
          {
            "node": "llm categorization",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add label to_hide": {
      "main": [
        [
          {
            "node": "Remove label from thread",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add label to_answer": {
      "main": [
        [
          {
            "node": "Add label processed_by_ai",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add label to_read": {
      "main": [
        [
          {
            "node": "Add label processed_by_ai",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add label processed_by_ai": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Remove label from thread": {
      "main": [
        [
          {
            "node": "Add label processed_by_ai",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gmail Trigger": {
      "main": [
        [
          {
            "node": "Get emails with filter",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "exceptions": {
      "main": [
        [
          {
            "node": "Merge1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "llm categorization": {
      "main": [
        [
          {
            "node": "Merge2",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Filter: not processed": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send error message": {
      "main": [
        [
          {
            "node": "Add label processed_by_ai",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get emails with filter": {
      "main": [
        [
          {
            "node": "exceptions",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge1",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Merge1": {
      "main": [
        [
          {
            "node": "Filter: not processed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge2": {
      "main": [
        [
          {
            "node": "Switch",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner"
  },
  "versionId": "",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": ""
  },
  "id": "",
  "tags": []
}
```

---

</details>

### Instrucciones para la importación

1. Copia el JSON de arriba
2. Guárdalo en un archivo llamado `email-ai-automation-personal.json`
3. En n8n, ve a `Workflows → Import from JSON`
4. Selecciona el archivo que guardaste y haz clic en `Import`
5. Configura tus credenciales de Gmail y OpenAI
6. Sustituye `__REPLACE_WITH_YOUR_PROCESSED_LABEL_ID__` por el ID de la etiqueta que quieras usar para los correos procesados
7. Configura el correo que se enviará en caso de error
8. Prueba con unos pocos correos antes de activar el disparador

Recuerda actualizar la clave de API de OpenAI y la autenticación de Gmail después de importar el flujo.

## Tutorial en video: la configuración completa

Si prefieres aprender de forma visual, he creado un tutorial en video que recorre todo el proceso de configuración de este sistema:

[![Tutorial en video de automatización de correo con n8n y LLM](https://img.youtube.com/vi/xn1RyMlZudE/maxresdefault.jpg)](https://www.youtube.com/watch?v=xn1RyMlZudE)

El video muestra cada paso de la creación del flujo de n8n, la configuración de la integración con OpenAI, la conexión con Gmail y las pruebas de la automatización completa. Verás la configuración exacta de los nodos, el prompt del LLM en funcionamiento y cómo el sistema categoriza correos reales en tiempo real.
