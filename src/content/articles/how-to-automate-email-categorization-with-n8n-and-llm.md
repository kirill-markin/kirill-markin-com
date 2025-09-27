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

