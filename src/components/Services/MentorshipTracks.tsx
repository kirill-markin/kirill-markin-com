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
                            <li>Validation of your AI product architecture and data structure</li>
                            <li>Honest feedback on what's feasible vs. what's pipe dreams</li>
                            <li>Commercialization strategies for AI products and datasets</li>
                            <li>Technical feasibility review before you invest heavily</li>
                            <li>Help bridging the gap between vision and implementation</li>
                        </ul>

                        <div className={styles.example}>
                            <strong>Real Example:</strong> Ryan was building an MVP for a data product. He needed guidance on validating his architecture and understanding commercialization strategies. We worked through his approach, refined the processes, and focused on solid foundations rather than guessing.
                        </div>
                    </div>
                </div>

                <div className={styles.track}>
                    <h3 className={styles.trackTitle}>For Engineers & Tech Leads</h3>
                    <div className={styles.trackContent}>
                        <p>You're diving into AI/LLM development and need guidance to move fast without wasting months on the wrong approaches. You're technical but new to this rapidly evolving space.</p>

                        <h4>What You Get:</h4>
                        <ul>
                            <li>Framework selection that actually makes sense for your use case</li>
                            <li>Architecture guidance for multi-agent systems and LLM pipelines</li>
                            <li>Practical advice on what works in production vs. what's hype</li>
                            <li>Career development strategy as you transition into AI roles</li>
                            <li>Help avoiding 6-month detours on technologies that won't work</li>
                        </ul>

                        <div className={styles.example}>
                            <strong>Real Example:</strong> Jake was building AI agents from scratch. He needed help choosing between AutoGPT, LangChain, and custom solutions. We discussed production patterns, context control, and how to avoid common pitfalls. He paused and resumed his subscription as needed — exactly when he had questions.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorshipTracks;

