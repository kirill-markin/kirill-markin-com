import { ServiceFractionalCTOData } from '@/types/services';
import { PHONE_NUMBER, getWhatsAppUrl, getTelegramUrl, TELEGRAM_USERNAME } from './contacts';

// Message template for mentorship plans: {planName} will be replaced with actual plan name
const MENTORSHIP_MESSAGE_TEMPLATE = "Hi! I'm interested in the {planName} mentorship plan.";

// Generate WhatsApp URL with pre-filled mentorship message
function getMentorshipWhatsAppUrl(planName: string): string {
    const message = MENTORSHIP_MESSAGE_TEMPLATE.replace('{planName}', planName);
    return getWhatsAppUrl(message);
}

export const servicesMentorshipData: ServiceFractionalCTOData = {
    title: 'Your AI Technical Mentor Kirill Markin',
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
                    url: getWhatsAppUrl(),
                    username: PHONE_NUMBER,
                    icon: '/social/whatsapp.png'
                },
                {
                    name: 'Telegram',
                    url: getTelegramUrl(),
                    username: `@${TELEGRAM_USERNAME}`,
                    icon: '/social/telegram.png'
                }
            ]
        },
        {
            planId: 'lite',
            name: 'Lite',
            price: '$240/month',
            hours: '1 call + async chat',
            features: [
                'Monthly 1-hour strategy call',
                'Unlimited "help, I\'m stuck!" messages',
                'Framework selection without the paralysis',
                'Concrete tech guidance: LangChain vs LlamaIndex vs custom solutions',
                'We\'ll figure out your AI mess together',
                'Skip the 6-month rewrite horror stories',
                'Pause/resume anytime (Jake paused twice — when traveling to Japan, then resumed when questions came up)'
            ],
            buttonText: 'Message on WhatsApp',
            buttonUrl: getMentorshipWhatsAppUrl('Lite')
        },
        {
            planId: 'standard',
            name: 'Standard',
            price: '$340/month',
            hours: '2 calls + priority async',
            features: [
                'Everything in Lite plan',
                'Two 1-hour calls per month (bi-weekly check-ins)',
                'Priority "oh crap, production is broken" support',
                'Product validation before you waste runway',
                'Network access: intros to specialists who solved your exact problem',
                'Production patterns: human-in-the-loop rollout strategies',
                'Deep architecture talks over virtual coffee'
            ],
            highlighted: true,
            buttonText: 'Message on WhatsApp',
            buttonUrl: getMentorshipWhatsAppUrl('Standard')
        },
        {
            planId: 'premium',
            name: 'Premium',
            price: '$1000/month',
            hours: '4 calls + VIP access',
            features: [
                'Everything in Standard plan',
                'Four 1-hour calls per month (weekly check-ins)',
                'Code & architecture review access',
                'Your whole team can join calls — architecture reviews together',
                'Direct Slack/Discord channel (no context switching)',
                'Quarterly roadmap planning sessions',
                'Emergency "this is on fire" same-day support'
            ],
            buttonText: 'Message on WhatsApp',
            buttonUrl: getMentorshipWhatsAppUrl('Premium')
        }
    ]
};

