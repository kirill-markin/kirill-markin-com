import { ServiceFractionalCTOData } from '@/types/services';

export const servicesFractionalCTOData: ServiceFractionalCTOData = {
    title: 'Your Fractional AI CTO Kirill Markin',
    description: 'I provide strategic AI-powered technology leadership tailored to your business needs. From AI strategy development to enterprise AI transformation, get the specialized CTO expertise you need without the full-time commitment. Choose the plan that fits your needs.',
    plans: [
        {
            planId: 'free',
            name: 'Free Plan',
            price: 'Free',
            hours: 'WhatsApp Chat',
            features: [
                'Direct messaging via WhatsApp',
                'Ask any technology questions',
                'Free hiring recommendations',
                'Strategic advice and guidance',
                'Quick responses when available'
            ],
            socialButtons: [
                {
                    name: 'WhatsApp',
                    url: 'https://api.whatsapp.com/send?phone=31625351137',
                    username: '+31625351137',
                    icon: '/social/whatsapp.png'
                },
                {
                    name: 'Telegram',
                    url: 'https://t.me/kirmark',
                    username: '@kirmark',
                    icon: '/social/telegram.png'
                }
            ]
        },
        {
            planId: 'starter',
            name: 'Starter',
            price: '$400/month',
            hours: '1 hour/month',
            features: [
                'Monthly strategy session',
                'Technology roadmap review',
                'Unlimited text questions anytime',
                'Architecture guidance',
                'Team communication support',
                'Hiring assistance and recommendations'
            ],
            buttonText: 'Start Free Trial',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'growth',
            name: 'Growth',
            price: '$1,200/month',
            hours: '4 hours/month',
            features: [
                'Everything in Starter plan',
                'Weekly strategy sessions',
                'Unlimited text questions from all team members',
                'Advanced architecture guidance',
                'Participation in hiring interviews'
            ],
            highlighted: true,
            buttonText: 'Start Free Trial',
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
            buttonText: 'Contact Me',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'custom',
            name: 'Custom',
            price: 'Contact me',
            hours: 'Flexible',
            features: [
                'Tailored engagement model',
                'Custom scope and deliverables',
                'Flexible time commitment',
                'Specialized expertise focus',
                'Enterprise-level support'
            ],
            buttonText: 'Contact Me',
            buttonUrl: '/meet/short/'
        }
    ]
}; 