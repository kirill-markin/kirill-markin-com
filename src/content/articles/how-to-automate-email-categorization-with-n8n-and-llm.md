---
keywords: [
  "automate email categorization",
  "n8n email workflow",
  "AI email sorting",
  "LLM email automation",
  "Gmail automation n8n",
  "email categorization system",
  "n8n workflow tutorial",
  "GPT email filtering",
  "automated email labels",
  "email productivity automation"
]
title: "How to Automate Email Categorization with n8n and LLM"
date: 2025-09-27
description: "My 3-month proven system for automating email categorization using n8n workflows and GPT-4 nano. Archive, read, or answer - let AI decide for you."
tags: [productivity, ai]
publish: true
thumbnailUrl: "/articles/how-to-automate-email-categorization-with-n8n-and-llm.webp"
language: "en"
---

# How to Automate Email Categorization with n8n and LLM

I got tired of waiting for Gmail to figure out which emails actually matter to me. After three months of letting AI handle my personal email categorization, I can't imagine going back to manual sorting.

My system is embarrassingly simple: every email gets sorted into one of three buckets by GPT-4 nano. Archive it, read it, or answer it. That's it.

The whole thing runs on n8n and costs me almost nothing since I'm using the cheapest OpenAI model with structured output. Sure, OpenAI now sees all my personal emails, but let's be honest—they probably know more about me from my ChatGPT conversations anyway.

This isn't some theoretical concept I'm pitching. I've been running this in production for three months, and it saves me hours every week.

## Why I Built This Email Automation System

I receive way too many emails. Newsletter subscriptions, service notifications, actual important messages from real humans—it all lands in the same inbox. Gmail's built-in categorization kept missing obvious patterns, and I was spending 20 minutes every morning just deciding what to read.

The breaking point came when I realized I was archiving 80% of my emails without reading them. If most emails don't need my attention, why am I the one deciding which ones do?

## The Three-Category System That Actually Works

My AI categorizes every email into exactly three options:

- **Archive** - Newsletters I subscribed to but never read, automated notifications, promotional emails
- **Read** - Content I want to consume but don't need to respond to
- **Answer** - Emails that require a human response from me

No complex folder structures. No priority levels. Just three simple actions that cover 100% of my email.

## Setting Up the n8n Workflow

Here's the complete n8n workflow that handles everything automatically:

![n8n Email Categorization Workflow](/articles/assets/n8n-email-workflow-full.webp)

The workflow triggers every time a new email arrives in my Gmail inbox. It grabs the email content, sends it to OpenAI for categorization, then applies the appropriate Gmail label and archives emails that don't need my attention.

### Required n8n Nodes

You'll need these nodes in your workflow:

1. **Gmail Trigger** - Monitors for new emails
2. **OpenAI Chat Model** - Categorizes the email content
3. **Gmail** - Applies labels and archives emails
4. **IF conditions** - Routes emails based on AI decision

The magic happens in the OpenAI node configuration. Here's how I set it up:

![OpenAI LLM Node Configuration in n8n](/articles/assets/n8n-llm-node-config.webp)

## The LLM Prompt That Makes It Work

The prompt is the heart of this system. After testing dozens of variations, this one gives me the most consistent results:

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

I use structured output to ensure the AI always returns a valid category. No parsing errors, no edge cases where the AI gets creative with its response format.

## Three Months of Real-World Results

Since implementing this system:

- **Time saved**: About 15-20 minutes per day on email triage
- **Accuracy**: The AI correctly categorizes roughly 95% of emails
- **Cost**: Under $3 per month using GPT-4 nano
- **False positives**: Maybe 2-3 emails per week get miscategorized

The 5% error rate is totally manageable. When the AI gets it wrong, I just move the email to the right category and move on. Still faster than manually sorting everything.

## Security Considerations (And Why I'm Okay With Them)

Yes, OpenAI now processes all my personal emails. This isn't ideal from a privacy standpoint, but I made peace with it for a few reasons:

First, I already use a password manager with 2FA codes (not email-based), so email compromise isn't catastrophic. Second, OpenAI already knows plenty about me from regular ChatGPT usage. Third, the time savings are worth the privacy trade-off for my personal workflow.

If you're handling sensitive business emails, you might want to use a local LLM instead of OpenAI's API. The n8n setup works the same way.

## Getting Started With Your Own Email Automation

Here's how to build this system yourself:

1. **Set up n8n** - Either self-hosted or use n8n Cloud
2. **Connect Gmail** - You'll need to authenticate your Gmail account
3. **Get OpenAI API access** - Create an account and grab your API key
4. **Import the workflow** - I'll share the JSON export if people want it
5. **Customize the prompt** - Adjust the categories for your email patterns
6. **Test with a few emails** - Start small before automating everything

The whole setup takes about 30 minutes if you're familiar with n8n. Maybe an hour if you're starting from scratch.

## Why This Beats Gmail's Built-in Features

Gmail's automatic categorization is designed for everyone, which means it's optimized for no one. My system learns my specific email patterns and preferences.

Plus, I can modify the logic anytime. Want to add a fourth category? Change the prompt. Need different handling for emails from specific senders? Add a condition node. Gmail's rules are rigid; this system adapts to whatever I need.

## The Bottom Line

Three months in, this email automation system has become essential to my daily workflow. It's not perfect, but it's way better than manually sorting hundreds of emails every week.

The setup is straightforward, the ongoing costs are minimal, and the time savings are real. If you're drowning in email like I was, this approach might be worth trying.

Just remember: start simple, test thoroughly, and don't automate anything you can't easily undo.

## Complete n8n Workflow JSON

For those ready to implement this system, here's the complete n8n workflow you can import directly:

<details>
<summary>Click to expand the full JSON workflow</summary>

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
        704,
        80
      ],
      "id": "1745bfda-0eb0-488f-abe0-d861a322e12d",
      "name": "Switch"
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        -512,
        160
      ],
      "id": "3ae78a57-9585-44c7-b04c-5952fa0b315f",
      "name": "When clicking ‘Execute workflow’"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        0,
        80
      ],
      "id": "a734b8d0-d058-4fc3-a01f-820cc3bf5d8f",
      "name": "Loop Over Items"
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
        560,
        112
      ],
      "id": "6518f5e1-e0f8-4a5b-8d98-92fc96f74f3f",
      "name": "Merge"
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
        960,
        -272
      ],
      "id": "1e1d5d38-508a-4743-9eac-9476d1b24ca1",
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
        960,
        128
      ],
      "id": "05e3d00e-6a81-46f5-85c5-0afe305b4589",
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
        960,
        -64
      ],
      "id": "88f63420-aa04-4d56-afd0-509fc4fc5ab2",
      "name": "Add label to_read",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "addLabels",
        "threadId": "={{ $('Merge').item.json.threadId }}",
        "labelIds": []
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        1376,
        304
      ],
      "id": "8a403314-9912-4a7a-b788-d2d6500f5a9a",
      "name": "Add label processed_by_ai",
      "webhookId": "",
      "credentials": {}
    },
    {
      "parameters": {
        "resource": "thread",
        "operation": "removeLabels",
        "threadId": "={{ $('Merge').item.json.threadId }}",
        "labelIds": [
          "INBOX"
        ]
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        1216,
        -144
      ],
      "id": "034b5a8d-80ea-43b3-9871-267a82a5af8c",
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
        -512,
        -16
      ],
      "id": "8bb1ba5b-c755-43a6-ae3f-206980b2f027",
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
        144,
        -256
      ],
      "id": "94b05019-c6f1-4e5a-adc8-b88f2fe1eaba",
      "name": "exceptions"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-5-nano",
          "mode": "list",
          "cachedResultName": "GPT-5-NANO"
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
        288,
        208
      ],
      "id": "d843ef03-546f-4b24-8b5a-23bf79a90023",
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
        -192,
        80
      ],
      "id": "f3f59907-c206-43a7-8cd5-0406fefee02e",
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
        960,
        304
      ],
      "id": "3018fb23-32f2-4420-bbde-a1fc49350efc",
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
        -352,
        80
      ],
      "id": "1d492d99-23df-438a-8d43-7c25101908f8",
      "name": "Get emails with filter",
      "webhookId": "",
      "credentials": {}
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
    "When clicking ‘Execute workflow’": {
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
            "node": "Merge",
            "type": "main",
            "index": 0
          },
          {
            "node": "exceptions",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "Switch",
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
            "node": "llm categorization",
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
            "node": "Merge",
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
            "node": "Filter: not processed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
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

### Import Instructions

1. Copy the JSON above
2. Save it to a file with the name `email-ai-automation-personal.json`
3. In n8n, go to Workflows → Import from JSON
4. Select the file you saved and click Import
5. Configure your Gmail and OpenAI credentials
6. Update the `__REPLACE_WITH_YOUR_PROCESSED_LABEL_ID__` with the ID of the label you want to use for the processed emails
7. Setup email to send in case of error (fallback)
8. Test with a few emails before enabling the trigger

Remember to update the OpenAI API key and Gmail authentication after importing the workflow.

