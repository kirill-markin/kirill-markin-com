import { ServiceFractionalCTOData } from '@/types/services';

export const servicesFractionalCTOData: ServiceFractionalCTOData = {
    title: 'Your Fractional CTO Kirill Markin',
    description: 'I provide strategic technology leadership tailored to your business needs. As your fractional CTO, I deliver AI strategy development, enterprise transformation, and CTO expertise without the full-time commitment. Choose the plan that fits your needs.',
    plans: [
        {
            planId: 'free',
            name: 'Free Plan',
            price: 'Free',
            hours: 'WhatsApp / Telegram Chat',
            features: [
                'Text me anytime on WhatsApp and Telegram',
                'Any tech question, even the weird ones',
                'Free hiring recommendations of my friends',
                'Honest advice without corporate BS',
                'Usually respond faster than your email provider'
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
                'We\'ll figure out your tech mess together',
                'Unlimited \'is this normal?\' questions',
                'Architecture advice that actually makes sense',
                'Hiring help and recommendations from my network'
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
                'Unlimited \'help us!\' messages from your whole team',
                'Deep architecture talks over virtual coffee',
                'Help your devs talk to humans',
                'I\'ll help you spot the rockstars and red flags'
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
                'I become your full-time CTO',
                'Ultra efforts before product launches and releases',
                'Board & investor reporting',
                'Direct team access 24/7',
                'Coffee-fueled late-night debugging sessions',
                'Team building and occasional team therapy'
            ],
            buttonText: 'Read My CTO CV',
            buttonUrl: '/data/cv-kirill-markin-cto.pdf'
        },
        {
            planId: 'custom',
            name: 'Custom',
            price: 'Contact me',
            hours: 'Flexible',
            features: [
                'We\'ll invent something that fits perfectly',
                'You dream it, we scope it',
                'Flexible time commitment',
                'Deep dive into your specific tech challenges',
                'White-glove treatment for serious projects'
            ],
            buttonText: 'Contact Me',
            buttonUrl: '/meet/short/'
        }
    ]
}; 