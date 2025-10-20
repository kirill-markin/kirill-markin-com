import { ServiceFractionalCTOData } from '@/types/services';

export const servicesMentorshipData: ServiceFractionalCTOData = {
    title: 'AI Technical Mentorship with Kirill Markin',
    description: 'Whether you\'re a founder building your first AI product or an engineer transitioning into AI/LLM development — I help you make the right technical decisions, avoid 6-month rewrites, and move faster without expensive trial-and-error.',
    plans: [
        {
            planId: 'free',
            name: 'Free Chat',
            price: 'Free',
            hours: 'WhatsApp / Telegram',
            features: [
                'Text me anytime with quick questions',
                'Framework recommendations that actually make sense',
                'Architecture sanity checks (before you waste months)',
                'Honest "is this a terrible idea?" feedback',
                'Usually respond faster than Stack Overflow'
            ],
            socialButtons: [
                {
                    name: 'WhatsApp',
                    url: 'https://api.whatsapp.com/send?phone=359879906085',
                    username: '+359879906085',
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
            planId: 'lite',
            name: 'Lite',
            price: '$260/month',
            hours: '1 call + async chat',
            features: [
                'Monthly 1-hour strategy call',
                'Unlimited "help, I\'m stuck!" messages',
                'Framework selection without the paralysis',
                'We\'ll figure out your AI mess together',
                'Skip the 6-month rewrite horror stories',
                'Pause/resume anytime (Jake did this twice)'
            ],
            buttonText: 'Book Free Trial Call',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'standard',
            name: 'Standard',
            price: '$480/month',
            hours: '2 calls + priority async',
            features: [
                'Everything in Lite plan',
                'Two 1-hour calls per month (bi-weekly check-ins)',
                'Priority "oh crap, production is broken" support',
                'Product validation before you waste runway',
                'Intros to people who actually solved your exact problem',
                'Deep architecture talks over virtual coffee'
            ],
            highlighted: true,
            buttonText: 'Book Free Trial Call',
            buttonUrl: '/meet/short/'
        }
    ]
};

