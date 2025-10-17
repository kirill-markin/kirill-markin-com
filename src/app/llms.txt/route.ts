import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

/**
 * Generates an llms.txt file for the website following the llms.txt specification
 * Provides LLM-friendly content about Kirill Markin's website and services
 * 
 * @returns {Response} llms.txt content as plain text
 */
export async function GET(): Promise<NextResponse> {
    const baseUrl = 'https://kirill-markin.com';

    // Get articles for content examples
    const articles = await getAllArticles(DEFAULT_LANGUAGE);
    const recentArticles = articles.slice(0, 3); // Get 3 most recent articles

    const llmsContent = `# Kirill Markin - AI & Data Engineering Expert

> Personal website of Kirill Markin — CTO, ex-Founder of ozma.io, AI & Data Engineer. Specializes in AI/LLM implementation, data engineering, startup guidance, and technical consulting across multiple languages and industries.

Kirill Markin is an experienced AI and data engineering professional who helps businesses and individuals leverage artificial intelligence and data technologies. His expertise spans from technical implementation to strategic consulting, with a focus on practical, real-world applications.

Key areas of expertise:
- AI/LLM implementation and optimization for businesses
- Data engineering and analytics department auditing
- Startup launch guidance and technical co-founder matching
- Career coaching for tech professionals
- R&D department strategy and optimization

## Articles & Insights

${recentArticles.map(article =>
        `- [${article.metadata.title}](${baseUrl}/articles/${article.slug}/): ${article.metadata.description}`
    ).join('\n')}
- [All Articles](${baseUrl}/articles/): Complete collection of articles on AI, data engineering, and technology

## Services & Consulting

- [All Services](${baseUrl}/services/): Complete overview of all available services and consulting options
- [For Individuals](${baseUrl}/services/?category=people): Personal consulting and career guidance
- [For Businesses](${baseUrl}/services/?category=business): Business consulting and technical implementation
- [For Media & Journalists](${baseUrl}/services/?category=journalists): Media relations and expert commentary

## Professional Background

- [About Page](${baseUrl}/): Detailed professional background and experience
- [Schedule Meeting](${baseUrl}/meet/): Book meetings and consultations with Kirill
- [Professional Network](${baseUrl}/): LinkedIn and other professional profiles

## Optional

- [Payment Options](${baseUrl}/pay/): Information about payment methods and billing
- [Multilingual Content](${baseUrl}/es/, ${baseUrl}/zh/, ${baseUrl}/ar/, ${baseUrl}/hi/): Content available in Spanish (es), Chinese (zh), Arabic (ar), and Hindi (hi)
- [RSS/Sitemap](${baseUrl}/sitemap.xml): Complete site structure and content index`;

    return new NextResponse(llmsContent, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        },
    });
} 