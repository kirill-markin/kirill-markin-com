import { ServiceFractionalCTOData } from '@/types/services';
import { getServiceWhatsAppUrl } from './contacts';

const SERVICE_NAME = 'Fractional CTO';

export const servicesFractionalCTOData: ServiceFractionalCTOData = {
    serviceType: 'fractional_cto',
    title: 'Your Fractional CTO Kirill Markin',
    description: 'I provide strategic technology leadership tailored to your business needs. As your fractional CTO, I deliver AI strategy development, enterprise transformation, and CTO expertise without the full-time commitment. Choose the plan that fits your needs.',
    plans: [
        {
            planId: 'free',
            name: 'Free Plan',
            price: 'Free',
            hours: 'WhatsApp Chat',
            features: [
                'Text me anytime on WhatsApp',
                'Any tech question, even the weird ones',
                'Free hiring recommendations of my friends',
                'Honest advice without corporate BS',
                'Usually respond faster than your email provider'
            ],
            buttonText: 'Message on WhatsApp',
            buttonUrl: getServiceWhatsAppUrl('Free', SERVICE_NAME)
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
            buttonText: 'Message on WhatsApp',
            buttonUrl: getServiceWhatsAppUrl('Starter', SERVICE_NAME)
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
            buttonText: 'Message on WhatsApp',
            buttonUrl: getServiceWhatsAppUrl('Growth', SERVICE_NAME)
        },
        {
            planId: 'scale',
            name: 'Full-Time',
            price: 'Secret Price',
            hours: 'Full Time',
            features: [
                'I become your full-time CTO',
                'Ultra efforts before product launches and releases',
                'Board & investor reporting',
                'Direct team access 24/7',
                'Coffee-fueled late-night debugging sessions',
                'Team building and occasional team therapy'
            ],
            soldOut: true,
            soldOutMainText: 'SOLD OUT',
            soldOutAdditionalText: 'my wife said not more than 80 hours per week',
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
            buttonText: 'Message on WhatsApp',
            buttonUrl: getServiceWhatsAppUrl('Custom', SERVICE_NAME)
        }
    ]
}; 