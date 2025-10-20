import styles from './MentorshipTracks.module.css';

const MentorshipTracks: React.FC = () => {
    return (
        <section className={styles.tracksSection}>
            <h2 className={styles.sectionTitle}>Who This Is For</h2>
            <div className={styles.tracksContainer}>
                <div className={styles.track}>
                    <h3 className={styles.trackTitle}>For Founders & Product People</h3>
                    <div className={styles.trackContent}>
                        <p>You're building an AI product and need technical validation before you scale. You have a clear vision but want to make sure your technical approach is solid.</p>

                        <h4>What You Get:</h4>
                        <ul>
                            <li>Validation of your AI architecture and data structure</li>
                            <li>Honest feedback: feasible vs. pipe dreams</li>
                            <li>Commercialization strategies for AI and data products</li>
                            <li>Production rollout strategies (human review first)</li>
                            <li>Context control for cost and quality optimization</li>
                            <li>Bridge the gap between vision and implementation</li>
                        </ul>

                        <div className={styles.example}>
                            <strong>Real Example:</strong> Ryan was building an MVP for a data analysis product. He had designed the core structure but needed guidance on validation, commercialization strategies, and what would scale vs. break at 10x volume. We worked through his approach and made sure he was building on solid foundations rather than optimistic assumptions.
                        </div>
                    </div>
                </div>

                <div className={styles.track}>
                    <h3 className={styles.trackTitle}>For Engineers & Tech Leads</h3>
                    <div className={styles.trackContent}>
                        <p>You're diving into AI/LLM development and need guidance to move fast without wasting months on the wrong approaches. You're technical but new to this rapidly evolving space.</p>

                        <h4>What You Get:</h4>
                        <ul>
                            <li>Framework selection guidance (LangChain, LlamaIndex, custom, etc.)</li>
                            <li>Multi-agent architecture: delegation, artifacts, context control</li>
                            <li>Production deployment from human-supervised to autonomous</li>
                            <li>What works in production vs. what's just hype</li>
                            <li>Career development strategy for AI role transitions</li>
                            <li>Avoid 6-month detours on wrong technologies</li>
                        </ul>

                        <div className={styles.example}>
                            <strong>Real Example:</strong> Jake was building a multi-agent system for automated widget generation. He needed help choosing between AutoGPT, LangChain, and custom solutions. We discussed production patterns, context control, and specific issues like agent supervisors doing work themselves instead of delegating. He used the subscription flexibly — pausing twice (once for 2 months in Japan), resuming when questions came up.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorshipTracks;

