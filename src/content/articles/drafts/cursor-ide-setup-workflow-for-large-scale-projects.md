---
title: "Cursor IDE Setup and Workflow for Large-Scale Projects"
date: 2025-02-08
description: "My practical workflow for using Cursor IDE with large codebases. How I combine test-driven development, voice commands, and documentation to maximize AI coding efficiency."
tags: [productivity, tools, ai]
publish: false
---

# Cursor IDE Setup and Workflow for Large-Scale Projects

Let me share how I organize my development process in Cursor IDE. With over a decade of coding experience, I've recently made Cursor my primary development environment, using it for about 6 hours each workday and additional time on weekends. Here's the approach I've developed.

## Starting With Test-Based Development

My journey with Cursor began by writing code directly. This approach was fine for smaller projects but became problematic with larger codebases - the AI could inadvertently affect existing functionality. Being cautious slowed me down, which went against Cursor's strength: quick implementation with proper review in pull requests.

A suggestion from my colleague Dmitry led me to explore test-driven development. I started with traditional TDD, writing comprehensive test suites before implementation. While this improved reliability, it was time-intensive, particularly during interface changes when test rewrites were necessary.

The breakthrough came when I started using just 1-2 integration tests with actual credentials. The process is simple: create one failing test, implement the functionality, establish a verification point. More tests can be added later once the interface is stable. This way, when implementing feature #16, a simple test run ensures features 1-15 remain intact.

This approach creates a powerful AI feedback cycle. The test guides the AI's code generation, verifies the results, and helps fix issues automatically. It's more efficient than manual checking while maintaining code quality, even when Cursor makes changes across multiple files.

## Mastering Task Size Management

Learning to scope tasks appropriately has been key to my success with Cursor. The test-first method is particularly effective when you can define small, clear pieces of work. But determining the right size takes practice.

If a task is oversized, Cursor may lose focus, forcing you to start over. If it's too small, the testing overhead becomes excessive. Finding this balance between too large and too minimal is challenging but crucial - it's been my biggest learning curve.

This explains why some developers struggle with Cursor while others succeed effortlessly, even when using voice commands exclusively. Experienced users understand how to divide features into manageable pieces and validate them with tests, allowing the AI to handle most of the implementation with minimal guidance.

## Documenting the Development Process

Initially, I depended heavily on AI chat history. New chats were risky because they meant potentially losing valuable context or solutions, particularly when breaking down complex tasks. Recreating context in each chat consumed valuable time.

My solution was to start saving our discussions and decisions as design documents alongside the code. During PR preparation, I clean up these documents into proper documentation, though I keep the intermediate versions. This allows my team to understand my thinking process and decision points if they're interested, and I can track how ideas evolved.

This approach to documenting conversations, objectives, task divisions, and progress has streamlined my Cursor workflow significantly. Starting fresh chats is no longer an issue - I just reference my design document for context and continue seamlessly.

## Embracing Composer Agent Mode

I began with the standard chat interface, attracted by its model variety and apparent control over code changes. I initially viewed Composer Agent as a beginner-friendly tool, too basic for an experienced developer like myself.

My perspective shifted thanks to my colleague Daniel's persistent recommendations to try Composer Agent exclusively. Though skeptical at first, I discovered its power: the ability to revisit any conversation point, adjust prompts, restore file states, and try again proved invaluable. The built-in terminal integration and result preview accelerated everything.

My usage gradually increased from occasional to exclusive. I haven't touched chat or regular Composer mode in a month - Composer Agent handles everything. I encourage even seasoned developers to give it a chance. There's a learning curve, but you maintain complete control while gaining significant benefits.

## Voice-Based Programming Approach

This aspect might not appeal to everyone. Many developers I know are keyboard enthusiasts who avoid voice interfaces or work in environments where speaking isn't feasible. Yet I've found voice interaction surprisingly natural in development work.

Working primarily from home, I now handle 99% of my Cursor IDE interactions through voice using SuperWhisper. This setup perfectly matches my workflow, though I recognize it's not for everyone - many developers prefer traditional text input, which is perfectly valid.

## Questions & Answers

### Q: Where in your flow do you implement the tests? How does this work when working through a feature with Cursor?

The test implementation has been woven into my feature development since day one. I start by planning the feature and breaking it into manageable steps, documenting everything in a design doc that serves as our roadmap. This document captures both the overall vision and the detailed steps we'll take to get there.

The cursor and I then collaborated on the testing approach. For each step in the design document, we created a focused integration test that served as a checkpoint for that particular piece of functionality. Most features naturally break into 5-6 steps, giving us a clear set of tests to work with.

The implementation flow is where the magic happens. For each step, I write a test to verify that specific piece, run it to see it fail (classic TDD red stage), and create basic stubs without the actual logic. Then Cursor takes the spotlight - I ask it to implement the code to make our test pass and watch as it works through the solution. The process is quite elegant.

By the end, we have a solid suite of 5-6 tests covering the entire feature, each corresponding to one of our planned steps. It's methodical but feels natural once you get into its rhythm.

### Q: Have you implemented any of these best practices through cursor rules that help facilitate them?

Yes, I've implemented these practices across different levels of Cursor configuration - in the IDE-wide settings, in project-level `.cursorrules` files, and sometimes even in `.cursor/rules/*` patterns. However, I'll be honest - I haven't yet found the perfect way to organize these rules. The implementation is currently spread across these different configuration files, and I'm still experimenting with the best approach to structure them more effectively. It's a work in progress, and I'm continuously refining how these practices are reflected in the rules.

### Q: Are you using the cursor AI summary function, or do you keep the entire chat conversation? How exactly do you manage context between chats?

I don't use the summary function or keep chat histories. Instead, I store all context in markdown files right in the repository. Usually, a design document in `docs/tmp/*.md` describes the feature implementation plan and key decisions. Sometimes in the same file, sometimes in a separate one, I maintain the current state with all tasks, subtasks, and their statuses.

Before ending each Composer Agent chat, I ask AI to update these documents. When starting a new chat, I simply add these files to the context. That's it - full context restored instantly.

I can fearlessly start new chats without worrying about losing context. Since these files are committed to git, I can always reflect on how ideas evolved. As a nice bonus, these same files become the foundation for updating project documentation at the end of the feature development.

### Q: Can you give a little more detail into how you integrate SuperWhisper into Cursor? How exactly do you use it?

Fun fact - I'm dictating this answer through SuperWhisper to my Cursor IDE right now! I installed it with basic settings, switched to a different model from the default one, and enabled auto-mute during dictation. I speak naturally into the Composer Agent window, and Cursor's AI polishes my casual speech into proper text, which I can then copy straight to Reddit or anywhere else.

Don't worry about perfect pronunciation or exact file names - Cursor is smart enough to understand what you mean. Just install SuperWhisper, try it with minimal configuration, and let Cursor's LLM clean up the rest. That's literally all there is to it.

One small caveat - very rarely, SuperWhisper might fail to process your voice message into text. It's particularly frustrating when this happens after dictating for a couple of minutes. Fortunately, you can find the audio recording in SuperWhisper's history and retry the conversion. While this workaround helps, I hope the developers will fix these rare hiccups soon, as they can be quite annoying when they occur.

### Q: I'm new to Cursor and know it doesn't have a save chat feature. How do you document the chat history? I saw a third-party extension but don't trust it.

I just save everything in markdown files in my project's `docs/tmp/` directory. Usually it's two files: `feature-design.md` with the detailed description of what we're building and how, and `current-state.md` with all tasks and their statuses. Nothing fancy - just plain markdown files in your repo.

Before ending a chat session, I ask Cursor to update these files with any new insights or decisions. When I start a new chat, I just add these files to the context. It's simple, secure (everything stays in your repo), and actually works better than saving raw chat logs because you get clean, organized documentation instead of messy chat history.

### Q: Would love to see a video of how the TDD works for you!

I'll try to record and share a video in this subreddit soon! But I should clarify something about my TDD approach - it's not traditional TDD. Pure TDD actually slowed me down too much, especially when refactoring interfaces.

Instead, I test each feature with real integration tests using actual credentials, but usually just one or two tests per feature. When we break down a large task into steps, I don't do full TDD coverage for each step while building the feature. It's more about creating a feedback loop for Cursor to work with than actual TDD. Just enough testing to verify the feature works, but not the comprehensive test suite you'd write in traditional TDD.

This approach gives us the benefits of test-driven development (clear requirements, automatic verification) without the overhead of writing extensive test suites while the interface is still evolving.

### Q: Could you share some of your design docs and prompts?

Here are my cursor rules:  
<https://kirill-markin.com/articles/cursor-ide-rules-for-ai/>

But honestly, there isn't much specific about this process in the rules yet. The workflow I described in this article is still mostly manual - for some reason, I haven't stored it in cursor rules. I probably should try to do that, but right now I just use voice commands to guide Cursor through each step of our process.

I literally talk through the stages with Cursor - explaining when we're in the red stage, then green stage, and so on. I'll try to formalize these prompts and add them to my cursor rules, but currently, it's just me verbally walking through the process I described in the article.

### Q: You should create YouTube tutorials or blog posts with content like this. There's a lot of surface-level AI content out there, but this could be a great niche for you.

Thank you so much for the kind words! I honestly didn't expect this article would get so much attention. I'm actually thinking about recording a video to accompany this article, showing my complete workflow with repositories here in the subreddit. I just need to choose a project I can showcase publicly. Your encouragement means a lot - it's unexpected and really pleasant to see this level of interest in the approach.

### Q: Very similar to my flow except the crucial part about testing. I've been doing full TDD and like you mentioned, it's reliable but slow AF. Going to try your testing approach.

Yeah, TDD really slowed me down, especially in new repositories where I wasn't sure about the interfaces yet. That's why I switched to a simpler rule: test each small step, but with just one integration test using real credentials. This creates a feedback loop where Cursor can understand whether it succeeded with each small step or not.

Having just one integration test instead of a full test suite is key here - especially while interfaces are still evolving. Writing comprehensive tests too early means constant rewrites, which is particularly painful when creating new repositories. I'll add more tests once I'm confident the interfaces are stable.

### Q: Do you work with frontend? I've never figured out a good testing setup that's actually helpful and quick to use, specifically with React.

Most of my major repositories have been Python-based, where Cursor works exceptionally well. I always use strict typing and linters in Python, which helps a lot with AI-assisted development.

I'm currently launching two TypeScript projects, and I'm noticing that some habits need adaptation. While strict typing still helps tremendously (just like in Python), I see that LLM sometimes struggles in certain areas with TypeScript. I'm not entirely sure why, but my gut feeling is that AI-assisted development is slightly more challenging with TypeScript than with strictly-typed Python.

I'm actively developing in TypeScript right now, so I hope to share more insights about the differences and specific challenges soon. It's an interesting learning experience, seeing how the same principles need to be adjusted for different languages.

### Q: Sometimes I modify a few lines of code, but Cursor will change it back. How can I tell Cursor to accept my modification?

When I make manual changes to the code, either before applying Composer Agent's suggestions or just on my own, I always explicitly mention this in the chat. I simply tell Cursor something like "I've made some manual changes here, that's intentional, let's continue with that." I've noticed that when I acknowledge these manual changes in the chat, Cursor is less likely to try to revert or override my modifications.

This kind of explicit communication with Cursor helps maintain a better flow - it's like telling your pair programming partner about the changes you've made.

### Q: Can you be more specific about how you use voice? Do you talk in composer mode, telling it what to implement and manually add @file references?

Yes, that's exactly how I started! But over time, I found myself more and more comfortable just speaking filenames directly through SuperWhisper. What's fascinating is that even when SuperWhisper mangles the filename pronunciations (which happens a lot - it's really hard to perfectly pronounce file paths!), Cursor usually figures out which files I'm talking about and starts working with them.

Sometimes, when Cursor doesn't catch the right files, I'll go back and manually add the `@` references. But surprisingly often, Cursor understands which files I mean even with imperfect pronunciation. It's become so natural that I rarely need to type file references manually now, though I still do when needed.

### Q: I tried talking during my coding hours today. It was especially nice when feeling lazy and having a hard time thinking - just rubber ducking out loud to the computer and it often did what I asked!

Yes, exactly! I've noticed something fascinating about this - the voice interface actually helps me start working on complex tasks more easily. Without it, I tend to procrastinate more because starting is the hardest part. Once I'm in the flow, I can code for hours, but that initial barrier is tough.

With voice interface, I can lazily discuss potential approaches with Cursor, like "how could we solve this together?" or "what approaches could we try here?" My brain doesn't register this as a demanding task - it feels more like a casual conversation. I use voice as a kind of "easy entry point" to trick myself into thinking I'm being lazy, while actually starting to engage with the problem. Once that process begins, momentum takes over naturally.

It's become my favorite method for fighting procrastination - turning that intimidating first step into a casual chat.
