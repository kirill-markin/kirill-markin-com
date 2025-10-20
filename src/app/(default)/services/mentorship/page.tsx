import { Metadata } from 'next';
import Link from 'next/link';
import { servicesMentorshipData } from '@/data/servicesMentorship';
import ServicesFractionalCTOSection from '@/components/Services/ServicesFractionalCTOSection';
import MentorshipTracks from '@/components/Services/MentorshipTracks';
import Footer from '@/components/Footer';
import styles from '@/app/(default)/services/page.module.css';
import { generateMentorshipPageMetadata } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    return generateMentorshipPageMetadata();
}

export default async function MentorshipPage() {
    return (
        <>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <ServicesFractionalCTOSection
                            data={servicesMentorshipData}
                            isStandalonePage={true}
                            ariaLabel="Mentorship Pricing Plans"
                        />

                        <MentorshipTracks />

                        <article className={styles.articleContent}>
                            <section>
                                <h2>Avoid Spending 6 Months Building the Wrong Thing</h2>
                                <p>Here's what I see constantly: smart engineers dive into AI development, pick a framework that seems popular on Reddit, spend months building beautiful architectures, and then realize they need to throw everything away because the approach doesn't actually work for their use case.</p>

                                <p>This isn't about lack of skill. It's about the AI/LLM space moving so absurdly fast that what was cutting-edge three months ago is now a meme. The frameworks change weekly, "best practices" get replaced monthly, and entire approaches become outdated before your PR even gets reviewed.</p>

                                <p>I've watched this horror movie play out with LangChain, Streamlit, various agent frameworks, and custom solutions held together with hope and string concatenation. Sometimes the tool is genuinely wrong for the job. Sometimes it's right but used incorrectly. And sometimes it works but there's a much simpler approach that would save weeks of development and your sanity.</p>

                                <p>When Jake was building AI agents for fraud detection, he initially went with AutoGPT because it seemed like the obvious choice from all the hype. We discussed the tradeoffs, looked at alternatives, and talked through what actually matters for production systems. The key question wasn't "what's most popular?" but "what gives you the most control over context and behavior?" Turns out, sometimes boring and custom beats exciting and uncontrollable.</p>

                                <p>This kind of guidance is exactly what mentorship provides. You're not paying me to write code for you — you're paying to avoid spending half a year heading confidently in the wrong direction. One conversation can save you months of wasted effort and one existential crisis.</p>
                            </section>

                            <section>
                                <h2>Get Your AI Product Validated Before You Scale</h2>
                                <p>If you're a founder building an AI product, you face a unique challenge: you need to make technical decisions that will determine whether your startup becomes a unicorn or just another "we pivoted 47 times" story, but you might not have deep AI expertise in-house yet.</p>

                                <p>Hiring a senior AI engineer full-time is expensive and slow. By the time you find the right person, you might have already burned three months of runway building in the wrong direction. And if you hire too junior, you get someone learning on your dime while making expensive mistakes that you won't discover until demo day.</p>

                                <p>This is where strategic technical mentorship makes sense. You get someone who's currently building AI products in production, who knows what actually works versus what just sounds impressive in pitch decks, and who can validate your approach before you bet the company on it.</p>

                                <p>Ryan came to me at the MVP stage of his data product. He had designed the core architecture and workflow, but as someone new to the business side, he needed someone to say "yes, this will work" or "no, this is going to explode at scale." We worked through his structure, discussed commercialization strategies (because building cool tech that nobody buys is just an expensive hobby), and made sure he was building on solid foundations rather than quicksand.</p>

                                <p>The goal isn't to make every technical decision for you — it's to give you confidence that you're heading in the right direction, or brutally honest feedback when you're not. Much cheaper than discovering problems after you've invested six months of runway into an approach that looked great on paper but doesn't actually work in the real world.</p>
                            </section>

                            <section>
                                <h2>Framework Selection That Actually Makes Sense</h2>
                                <p>One of the most common questions I get: "Should I use LangChain, LlamaIndex, build custom, or use something else entirely that just got released this week?"</p>

                                <p>The honest answer is always: it depends on your specific use case, team, and constraints. But more importantly, I can share patterns I've seen work (and catastrophically fail) across dozens of real implementations.</p>

                                <p>I've ripped out LangChain and replaced it with Vercel AI SDK when the product needed tight frontend integration. I've replaced it with custom thin wrappers when context control was critical and we couldn't afford mystery tokens disappearing into framework overhead. I've kept LangChain when it was already working and the team knew it well (sometimes "don't fix what works" is the smartest strategy). I've used LlamaIndex when starting fresh because the code is cleaner and doesn't make you want to cry during debugging.</p>

                                <p>The decision isn't about which framework is "best" in abstract terms or has the most GitHub stars. It's about which one fits your actual requirements: Do you need to control every single token in context? Is frontend integration critical? Do you have existing code to maintain? Are you building for on-premise deployment with paranoid enterprise security requirements? Is your team comfortable reading framework source code when things inevitably break in weird ways?</p>

                                <p>During our conversations, I share real examples from production systems I've built or reviewed. Not theoretical advice from blog posts, but "here's what happened when we tried X, here's why we switched to Y at 2am during an incident, and here's what we'd do differently if we could go back in time and slap our past selves."</p>

                                <p>This practical, battle-tested guidance is what saves you from framework paralysis (where you spend three months researching instead of building) or worse — picking something that sounds great in documentation but doesn't actually fit your needs and forces you to rewrite everything in month four.</p>
                            </section>

                            <section>
                                <h2>How Mentorship Actually Works</h2>
                                <p>I structure mentorship to match how real work actually happens. You don't need someone sitting in meetings all day pretending to add value — you need someone available when you're stuck, making key decisions, or need someone to tell you if your approach is genius or insane.</p>

                                <p><strong>The Async-First Approach:</strong> Most communication happens via text (Telegram, WhatsApp, or whatever messaging app won't get blocked by your IT department). You send me questions as they come up. I respond with detailed thoughts, code examples, or links to relevant resources. This async approach means you're not blocked waiting for our next scheduled call while your deadline gets closer and your stress levels rise.</p>

                                <p><strong>Strategic Calls:</strong> We schedule calls (monthly for Lite, bi-weekly for Standard) for deeper discussions that need more than text. These are for architecture reviews, discussing complex tradeoffs, or working through problems that need real-time back-and-forth conversation rather than async tennis. You set the agenda based on what's most valuable to you right now, not what I think is interesting.</p>

                                <p><strong>Flexible Pause/Resume:</strong> Like Jake did (twice, actually), you can pause your subscription when you don't have active questions, then resume when you need guidance again. I'm not trying to lock you into paying for months when you don't need help — that's not how good mentorship works, that's how gym memberships work.</p>

                                <p><strong>Network Access:</strong> Sometimes the best answer isn't something I know directly — it's connecting you with someone from my network who's solved exactly your weird problem before. I've made intros to specialists in model training, specific domains, or obscure technologies when that's what actually helps. Why make you figure it out alone when I know someone who spent three months solving exactly this?</p>

                                <p>The goal is making you more effective and confident, not creating dependency. You should feel smarter and more capable after our conversations, not reliant on asking me every tiny detail. Good mentorship makes itself obsolete over time — though most people stick around because new questions keep coming up.</p>
                            </section>

                            <section>
                                <h2>Real Technical Depth When You Need It</h2>
                                <p>Here's what sets this apart from generic business coaching: I write code every single day. I'm currently VP of Engineering at a funded AI startup. I personally deal with the same challenges you're facing — production systems melting down, model selection analysis paralysis, framework decisions that keep you up at night, and team building (which is just herding cats but with more Slack messages).</p>

                                <p>When we discuss context management in LLM applications, I can show you exactly how I handle it in production code running right now. When we talk about multi-agent architectures, I can walk through real examples of what works and what catastrophically fails at 3am. When you're debugging why your agent keeps cheerfully ignoring instructions, I've probably hit that exact infuriating issue and can tell you the three things to try first (and the four things that won't work but seem obvious).</p>

                                <p>This isn't about flexing technical knowledge or showing off how many frameworks I know — it's about being actually useful. You need someone who's currently solving these problems in production, not someone who stopped writing code five years ago and now only "advises" from the comfortable sidelines while their knowledge slowly becomes obsolete.</p>

                                <p>I've built complete customer support automation systems that actually work (not just demos that fail in production). I've implemented AI-enhanced onboarding flows that improved conversion rates instead of confusing users. I've created custom LLM integrations when off-the-shelf solutions were hilariously inadequate. I've debugged multi-agent systems handling complex business logic that worked perfectly in testing and then completely lost their minds in production.</p>

                                <p>I've made the mistakes so you don't have to. I've wasted weeks on approaches that didn't work so you can skip straight to what does. I've had the 2am incidents so you can learn from them without the stress and the angry Slack messages from your CEO.</p>

                                <p>That's the value of mentorship with someone actively working in the trenches: practical, current, battle-tested advice rather than theoretical knowledge from blog posts written by people who haven't deployed to production in years.</p>
                            </section>

                            <section>
                                <h2>Getting Started: Your First Call</h2>
                                <p>We start with a completely free 1-hour call. No strings attached, no payment required upfront, no credit card "just to verify your identity". This call serves two purposes:</p>

                                <p><strong>For you:</strong> Decide if my experience and communication style actually help you. Some people need very structured guidance with homework and milestones. Others want someone to bounce ideas off when they're stuck. We need to figure out if there's a good fit, because bad mentorship is worse than no mentorship.</p>

                                <p><strong>For me:</strong> Understand your specific situation, challenges, and goals. Sometimes I can solve your problem in this first free call and you don't need to pay me anything. Sometimes I realize you don't actually need mentorship — you need to hire an engineer, or change your approach entirely, or just ship the damn thing already. I'll tell you honestly either way, even if it means less money for me.</p>

                                <p>After this call, you decide if you want to continue. If yes, you pick a plan (Lite or Standard) and we schedule our first official session. If not, no hard feelings — at minimum, you got a free hour of advice from someone who's made all the mistakes you're trying to avoid.</p>

                                <p>During the first month, we focus on:</p>
                                <ul>
                                    <li>Understanding your current situation and biggest pain points (what's keeping you up at night)</li>
                                    <li>Reviewing your architecture or product approach (finding the landmines before you step on them)</li>
                                    <li>Identifying quick wins and longer-term strategy (some things need to ship this week, others can wait)</li>
                                    <li>Setting up our communication rhythm (how often to chat, when to call, what works for your timezone)</li>
                                    <li>Getting you unstuck on immediate blockers (the stuff that's stopping you from shipping right now)</li>
                                </ul>

                                <p>Most people see value immediately — either from architectural insights, framework recommendations, or simply having someone confirm they're on the right track (validation is underrated). If you're not getting value, you can cancel anytime. I'm not interested in keeping people subscribed who aren't benefiting — that's just exhausting for everyone.</p>

                                <p>Ready to see if this makes sense for you? Book a free trial call below. Worst case, you get an hour of free technical advice from someone who's actually doing this work. Best case, you avoid months of expensive mistakes and ship something people actually want.</p>
                            </section>
                        </article>

                        <ServicesFractionalCTOSection
                            data={servicesMentorshipData}
                            isStandalonePage={false}
                            ariaLabel="Mentorship Pricing Plans - Call to Action"
                        />

                        <nav className={styles.articleContent}>
                            <div className={styles.backLink}>
                                <Link href="/services/">← Back to All Services</Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </main>
            <Footer
                language="en"
                currentPath="/services/mentorship/"
                availableLanguages={['en']}
            />
        </>
    );
}

