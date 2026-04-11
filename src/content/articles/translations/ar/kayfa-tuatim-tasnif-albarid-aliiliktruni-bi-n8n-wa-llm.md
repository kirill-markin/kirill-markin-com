---
keywords: [
  "أتمتة تصنيف البريد الإلكتروني",
  "سير عمل البريد في n8n",
  "فرز البريد بالذكاء الاصطناعي",
  "أتمتة البريد باستخدام LLM",
  "أتمتة Gmail مع n8n",
  "نظام تصنيف البريد الإلكتروني",
  "شرح سير عمل n8n",
  "تصفية البريد باستخدام GPT",
  "وسوم بريد آلية",
  "أتمتة إنتاجية البريد الإلكتروني"
]
title: "كيف تؤتمت تصنيف البريد الإلكتروني باستخدام n8n و LLM"
date: 2026-04-11
description: "نظامي المجرب لمدة 3 أشهر لأتمتة تصنيف البريد الإلكتروني باستخدام سير عمل n8n و GPT-5-nano. أرشف أو اقرأ أو أجب، واترك الذكاء الاصطناعي يقرر."
tags: [productivity, ai]
publish: true
thumbnailUrl: "/articles/how-to-automate-email-categorization-with-n8n-and-llm.webp"
language: "ar"
originalArticle:
  language: "en"
  slug: "how-to-automate-email-categorization-with-n8n-and-llm"
translations:
  - language: "en"
    slug: "how-to-automate-email-categorization-with-n8n-and-llm"
  - language: "es"
    slug: "como-automatizar-la-categorizacion-de-correos-con-n8n-y-llm"
  - language: "zh"
    slug: "ruhe-yong-n8n-he-llm-zidong-fenlei-youjian"
  - language: "hi"
    slug: "n8n-aur-llm-se-email-vargikaran-automate-kaise-karen"
---

# كيف تؤتمت تصنيف البريد الإلكتروني باستخدام n8n و LLM

سئمت من انتظار Gmail حتى يفهم وحده أي الرسائل تهمني فعلا. وبعد ثلاثة أشهر من ترك الذكاء الاصطناعي يدير تصنيف بريدي الشخصي، لم أعد أستطيع تخيل العودة إلى الفرز اليدوي.

نظامي بسيط بشكل محرج: GPT-5-nano يضع كل رسالة في واحدة من ثلاث خانات فقط. أرشفة، قراءة، أو رد. هذا كل شيء.

كل النظام يعمل على n8n، ويكلفني تقريبا لا شيء لأنني أستخدم أرخص نموذج من OpenAI مع مخرجات منظمة. نعم، OpenAI يرى الآن كل رسائلي الشخصية، لكن بصراحة ربما يعرفون عني أكثر مما يعرفونه من محادثاتي في ChatGPT أصلا.

هذه ليست فكرة نظرية أطرحها للتجربة. أنا أشغّل هذا النظام في بيئة إنتاج منذ ثلاثة أشهر، وهو يوفر علي ساعات كل أسبوع.

## لماذا بنيت نظام أتمتة البريد هذا

أتلقى عددا كبيرا جدا من الرسائل. نشرات بريدية، إشعارات من الخدمات، ورسائل مهمة فعلا من أشخاص حقيقيين، وكل ذلك يهبط في صندوق وارد واحد. وكان التصنيف المدمج في Gmail يخطئ باستمرار في أنماط واضحة، بينما كنت أقضي 20 دقيقة كل صباح فقط لأقرر ما الذي يستحق أن أقرأه.

جاءت لحظة الحسم عندما أدركت أنني كنت أؤرشف 80% من رسائلي من دون أن أقرأها. إذا كانت أغلب الرسائل لا تحتاج إلى انتباهي، فلماذا أبقى أنا من يقرر أيها يحتاجه؟

> **هل تفضل شرحا بالفيديو؟** لقد أنشأت عرضا مرئيا خطوة بخطوة يشرح سير عمل أتمتة البريد بالكامل. [شاهد شرح Email Automation with n8n and LLM](https://www.youtube.com/watch?v=xn1RyMlZudE) لترى عملية الإعداد كاملة أثناء التنفيذ.

[![عرض توضيحي لسير عمل أتمتة البريد باستخدام n8n و LLM](https://img.youtube.com/vi/xn1RyMlZudE/maxresdefault.jpg)](https://www.youtube.com/watch?v=xn1RyMlZudE)

## نظام الفئات الثلاث الذي يعمل فعلا

الذكاء الاصطناعي عندي يصنف كل رسالة إلى واحدة من ثلاث حالات فقط:

- **Archive** - النشرات البريدية التي اشتركت بها ولا أقرأها، الإشعارات التلقائية، والرسائل الترويجية
- **Read** - محتوى أريد قراءته لكن لا يحتاج إلى رد
- **Answer** - رسائل تحتاج إلى رد بشري مني

لا توجد هياكل معقدة للمجلدات. ولا مستويات أولوية. فقط ثلاث إجراءات بسيطة تغطي 100% من بريدي.

## إعداد سير عمل n8n

إليك سير عمل n8n الكامل الذي يتولى كل شيء تلقائيا:

![سير عمل تصنيف البريد الإلكتروني في n8n](/articles/assets/n8n-email-workflow-full.webp)

يتفعل هذا السير كلما وصلت رسالة جديدة إلى صندوق Gmail الخاص بي. يأخذ محتوى الرسالة، ويرسله إلى OpenAI لتصنيفها، ثم يطبق وسم Gmail المناسب ويؤرشف الرسائل التي لا تحتاج إلى انتباهي.

### عقد n8n المطلوبة

ستحتاج إلى هذه العقد داخل سير العمل:

1. **Gmail Trigger** - يراقب الرسائل الجديدة
2. **OpenAI Chat Model** - يصنف محتوى الرسالة
3. **Gmail** - يطبق الوسوم ويؤرشف الرسائل
4. **IF conditions** - يوجه الرسائل بناء على قرار الذكاء الاصطناعي

السحر الحقيقي يحدث داخل إعداد عقدة OpenAI. هذه هي الطريقة التي ضبطتها بها:

![إعداد عقدة OpenAI LLM في n8n](/articles/assets/n8n-llm-node-config.webp)

## الـ LLM Prompt الذي يجعل النظام يعمل

الـ prompt هو قلب هذا النظام. وبعد اختبار عشرات الصيغ المختلفة، هذه هي الصيغة التي منحتني أكثر النتائج ثباتا:

> **ملاحظة**: هذا مجرد prompt لتصنيف البريد الإلكتروني. إذا كنت تريد أتمتة n8n الكاملة، بما في ذلك جميع العقد والاتصالات، فانزل إلى قسم "Complete n8n Workflow JSON" أدناه.

<details>
<summary>اضغط لعرض الـ LLM prompt الكامل</summary>

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

أستخدم المخرجات المنظمة حتى أضمن أن الذكاء الاصطناعي يعيد دائما فئة صحيحة. لا أخطاء parsing، ولا حالات طرفية يبدأ فيها النموذج بابتكار تنسيق غريب للرد.

## نتائج حقيقية بعد ثلاثة أشهر

منذ أن طبقت هذا النظام:

- **الوقت الموفَّر**: نحو 15 إلى 20 دقيقة يوميا في فرز البريد
- **الدقة**: الذكاء الاصطناعي يصنف نحو 95% من الرسائل بشكل صحيح
- **التكلفة**: أقل من 3 دولارات شهريا باستخدام GPT-5-nano
- **الإيجابيات الكاذبة**: ربما 2 إلى 3 رسائل أسبوعيا تُصنف بشكل خاطئ

نسبة الخطأ البالغة 5% يمكن التعامل معها بسهولة. عندما يخطئ الذكاء الاصطناعي، أنقل الرسالة إلى الفئة الصحيحة وأكمل عملي. وما يزال ذلك أسرع بكثير من فرز كل شيء يدويا.

## اعتبارات الأمان والخصوصية (ولماذا أنا متصالح معها)

نعم، OpenAI يعالج الآن كل رسائلي الشخصية. هذا ليس مثاليا من ناحية الخصوصية، لكنني تقبلته لعدة أسباب.

أولا، أنا أستخدم بالفعل مدير كلمات مرور مع رموز 2FA لا تعتمد على البريد، لذلك اختراق البريد وحده ليس كارثيا. ثانيا، OpenAI يعرف عني الكثير أصلا من استخدامي المعتاد لـ ChatGPT. ثالثا، توفير الوقت يستحق هذا التنازل بالنسبة إلى سير عملي الشخصي.

إذا كنت تتعامل مع رسائل أعمال حساسة، فقد يكون من الأفضل استخدام LLM محلي بدلا من OpenAI API. أما إعداد n8n نفسه فيبقى كما هو.

## كيف تبدأ ببناء أتمتة البريد الخاصة بك

يمكنك بناء هذا النظام بنفسك عبر الخطوات التالية:

1. **إعداد n8n** - إما على خادمك الخاص أو عبر n8n Cloud
2. **ربط Gmail** - ستحتاج إلى توثيق حساب Gmail الخاص بك
3. **الحصول على OpenAI API** - أنشئ حسابا وخذ مفتاح API
4. **استيراد سير العمل** - سأشارك ملف JSON إذا أراد الناس ذلك
5. **تخصيص الـ prompt** - عدّل الفئات بحسب أنماط بريدك
6. **الاختبار على عدد قليل من الرسائل** - ابدأ بشكل صغير قبل أتمتة كل شيء

الإعداد الكامل يستغرق نحو 30 دقيقة إذا كنت تعرف n8n جيدا. وربما ساعة إذا كنت تبدأ من الصفر.

## لماذا هذا أفضل من مزايا Gmail المدمجة

التصنيف التلقائي في Gmail مصمم للجميع، وهذا يعني أنه ليس محسنا تماما لأي شخص بعينه. أما نظامي فهو يتعلم أنماط بريدي أنا وتفضيلاتي أنا.

وفوق ذلك، أستطيع تعديل المنطق في أي وقت. تريد فئة رابعة؟ عدّل الـ prompt. تحتاج إلى التعامل بطريقة مختلفة مع رسائل مرسلين محددين؟ أضف عقدة شرطية. قواعد Gmail جامدة، أما هذا النظام فيتكيف مع ما أحتاجه.

## الخلاصة

بعد ثلاثة أشهر، أصبح نظام أتمتة البريد هذا جزءا أساسيا من سير عملي اليومي. ليس مثاليا، لكنه أفضل بكثير من فرز مئات الرسائل يدويا كل أسبوع.

الإعداد مباشر، والتكلفة المستمرة منخفضة جدا، وتوفير الوقت حقيقي. إذا كنت تغرق في البريد كما كنت أنا، فقد تكون هذه المقاربة جديرة بالتجربة.

فقط تذكر: ابدأ ببساطة، اختبر جيدا، ولا تؤتمت أي شيء لا يمكنك التراجع عنه بسهولة.

## Complete n8n Workflow JSON

لمن هم مستعدون لتطبيق هذا النظام مباشرة، إليك سير عمل n8n الكامل الذي يمكنك استيراده مباشرة:

<details>
<summary>اضغط لعرض JSON الكامل لسير العمل</summary>

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

### تعليمات الاستيراد

1. انسخ JSON أعلاه
2. احفظه في ملف باسم `email-ai-automation-personal.json`
3. في n8n اذهب إلى Workflows → Import from JSON
4. اختر الملف الذي حفظته واضغط Import
5. اضبط بيانات الاعتماد الخاصة بـ Gmail و OpenAI
6. استبدل `__REPLACE_WITH_YOUR_PROCESSED_LABEL_ID__` بمعرف الوسم الذي تريد استخدامه للرسائل المعالجة
7. اضبط البريد الذي سيُرسل في حالة الخطأ (fallback)
8. اختبر على عدد قليل من الرسائل قبل تفعيل الـ trigger

تذكر أن تحدّث مفتاح OpenAI API ومصادقة Gmail بعد استيراد سير العمل.

## شرح بالفيديو: شاهد الإعداد الكامل

إذا كنت تفضل التعلم بصريا، فقد أنشأت شرحا مفصلا بالفيديو يمر على العملية كاملة لإعداد هذا النظام:

[![شرح فيديو لأتمتة البريد باستخدام n8n و LLM](https://img.youtube.com/vi/xn1RyMlZudE/maxresdefault.jpg)](https://www.youtube.com/watch?v=xn1RyMlZudE)

يعرض الفيديو كل خطوة من إنشاء سير عمل n8n، وضبط تكامل OpenAI، وإعداد اتصالات Gmail، واختبار الأتمتة كاملة. سترى إعدادات العقد كما هي، والـ LLM prompt أثناء التشغيل، وكيف يصنف النظام رسائل حقيقية في الوقت الفعلي.
