import { ServiceFractionalCTOData } from '@/types/services';

export const servicesMilitaryPoliceData: ServiceFractionalCTOData = {
    title: 'Military & Police Consulting Services',
    description: 'Strategic AI and technology consulting for defense and law enforcement operations. We provide secure, professional guidance for implementing advanced technology solutions in mission-critical environments.',
    plans: [
        {
            planId: 'tactical',
            name: 'Tactical Consultation',
            price: '$5,000/month',
            hours: 'Strategic Advisory',
            features: [
                'Secure AI deployment strategies for defense operations',
                'Real-time threat analysis system architecture',
                'Encrypted communication protocol implementation',
                'Mission-critical system reliability engineering',
                'Advanced data security and compliance frameworks',
                'Strategic technology roadmap for law enforcement',
                'Operational efficiency optimization through AI',
                'Cross-agency technology integration planning'
            ],
            buttonText: 'Request Consultation',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'strategic',
            name: 'Strategic Partnership',
            price: '$15,000/month',
            hours: 'Full Integration Support',
            features: [
                'Everything in Tactical Consultation',
                'Dedicated security-cleared technical advisor',
                'Custom AI solution architecture and development',
                '24/7 emergency technical response team',
                'Quarterly security audits and compliance reviews',
                'Training programs for technical personnel',
                'Technology procurement and vendor assessment',
                'Long-term digital transformation planning'
            ],
            highlighted: true,
            buttonText: 'Request Consultation',
            buttonUrl: '/meet/short/'
        },
        {
            planId: 'enterprise',
            name: 'Enterprise Command',
            price: 'Custom Pricing',
            hours: 'Full-Scale Implementation',
            features: [
                'Everything in Strategic Partnership',
                'Multi-agency coordination and integration',
                'Custom development team assignment',
                'Advanced threat modeling and simulation',
                'International compliance and standards alignment',
                'Executive leadership technology briefings',
                'Crisis management technical support',
                'Classified project capability assessment'
            ],
            buttonText: 'Contact for Details',
            buttonUrl: '/meet/short/'
        }
    ]
};

