import { Metadata } from 'next';
import { servicesFractionalCTOData } from '@/data/servicesFractionalCTO';
import ServicesFractionalCTOSection from '@/components/Services/ServicesFractionalCTOSection';
import Footer from '@/components/Footer';
import styles from '@/app/(default)/services/page.module.css';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    const title = 'Your Fractional AI CTO Kirill Markin - Strategic AI Technology Leadership';
    const description = 'Get strategic AI-powered technology leadership tailored to your business needs. From AI strategy development to enterprise AI transformation, get the specialized CTO expertise you need without the full-time commitment.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: '/services/fractional-ai-cto-kirill-markin/',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: '/services/fractional-ai-cto-kirill-markin/',
        },
    };
}

export default async function FractionalAICTOPage() {
    return (
        <>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <ServicesFractionalCTOSection
                            data={servicesFractionalCTOData}
                            isStandalonePage={true}
                        />

                        {/* Здесь будет дополнительный контент статьи */}
                        <section className={styles.articleContent}>
                            <h2>How It Works</h2>
                            <p>Coming soon - detailed article about Fractional AI CTO services...</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer
                language="en"
                currentPath="/services/fractional-ai-cto-kirill-markin/"
                availableLanguages={['en']}
            />
        </>
    );
} 