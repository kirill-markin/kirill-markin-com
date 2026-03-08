export const subscribe = {
    en: {
        title: 'Subscribe to My Brain Dumps',
        description: 'I write about AI, tech, and whatever else catches my attention. No corporate BS, no weekly promises I can\'t keep. Just real insights when I actually have something interesting to share.',
        metaTitle: 'Subscribe to AI Strategy Updates | Kirill Markin Newsletter',
        metaDescription: 'Subscribe to Kirill Markin\'s newsletter for AI strategy insights, emerging technology trends, and practical tools. Expert content for professionals.',
        benefits: {
            title: 'What You\'ll Actually Get:',
            items: [
                'AI insights when I discover something genuinely useful',
                'Early access to articles before I post them everywhere',
                'Practical tools I actually use (not just recommend)',
                'Honest takes on AI trends, including the overhyped ones',
                'Real case studies from projects that didn\'t explode',
            ],
        },
        form: {
            emailPlaceholder: 'Your email (for the occasional brain dump)',
            subscribeButton: 'Subscribe',
            loadingText: 'Adding you to the list...',
            successMessage: 'Welcome aboard! I\'ll send you something when I have actual news.',
            errorMessage: 'Something broke. Try again?',
            validationError: 'That doesn\'t look like an email address',
            privacyNote: 'I respect your privacy. Unsubscribe anytime without drama.',
        },
    },
} as const;
