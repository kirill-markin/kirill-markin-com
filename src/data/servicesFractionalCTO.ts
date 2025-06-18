import { ServiceFractionalCTOData } from '@/types/services';

export const servicesFractionalCTOData: ServiceFractionalCTOData = {
    title: 'Fractional CTO Services',
    description: 'Strategic technology leadership tailored to your business needs. From startup guidance to enterprise transformation, get the CTO expertise you need without the full-time commitment.',
    subtitle: 'Choose the plan that fits your needs',
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
            price: '$500/month',
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
            price: '$2,500/month',
            hours: '5 hours/month',
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
            name: 'Scale',
            price: '$8,000/month',
            hours: '20 hours/week',
            features: [
                'Dedicated weekly availability',
                'Hands-on technical leadership',
                'Architecture design and review',
                'Team mentoring and development',
                'Full project management support',
                'Direct Slack/email access'
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