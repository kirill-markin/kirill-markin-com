import { ServiceFractionalCTOData } from '@/types/services';

export const servicesFractionalCTOData: ServiceFractionalCTOData = {
    title: 'Fractional AI CTO Services',
    description: 'Strategic AI-powered technology leadership tailored to your business needs. From AI strategy development to enterprise AI transformation, get the specialized CTO expertise you need without the full-time commitment. Choose the plan that fits your needs.',
    plans: [
        {
            planId: 'free',
            name: 'Free Plan',
            price: 'Free',
            hours: '15 minutes',
            features: [
                'Initial consultation call',
                'Basic technology assessment',
                'Strategic direction overview',
                'Q&A session'
            ],
            buttonText: 'Get Started',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'starter',
            name: 'Starter',
            price: '$400/month',
            hours: '1 hour/month',
            features: [
                'Monthly strategy session',
                'Technology roadmap review',
                'Priority support via email',
                'Basic architecture guidance'
            ],
            buttonText: 'Contact Us',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'growth',
            name: 'Growth',
            price: '$1,200/month',
            hours: '4 hours/month',
            features: [
                'Weekly strategy sessions',
                'Team leadership guidance',
                'Technology stack optimization',
                'Hiring and team building support',
                'Performance metrics setup'
            ],
            highlighted: true,
            buttonText: 'Contact Us',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'scale',
            name: 'Full-Time',
            price: '$300,000+/year',
            hours: 'Full Time',
            features: [
                'Complete CTO responsibility',
                'Full technical leadership',
                'Strategic planning & execution',
                'Team building & management',
                'Board & investor reporting',
                'Technology vision & roadmap',
                'Direct team access 24/7'
            ],
            buttonText: 'Contact Us',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'custom',
            name: 'Custom',
            price: 'Contact us',
            hours: 'Flexible',
            features: [
                'Tailored engagement model',
                'Custom scope and deliverables',
                'Flexible time commitment',
                'Specialized expertise focus',
                'Enterprise-level support'
            ],
            buttonText: 'Contact Us',
            buttonUrl: '/meet/short/'
        }
    ]
}; 