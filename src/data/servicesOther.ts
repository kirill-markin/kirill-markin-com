import { ServiceOtherData } from '@/types/services';

export const servicesOtherData: ServiceOtherData[] = [

  // Category: Business
  {
    serviceId: "fractional_ai_cto",
    categoryId: "business",
    name: "Fractional CTO",
    description: "Need a CTO but don't want to sell your kidney? Get strategic AI-powered tech leadership without the full-time drama (or salary).",
    logoUrl: "/services/fractional-ai-cto.webp",
    promoText: "Most Popular Service",
    buttonText: "View Plans",
    buttonUrl: "/services/fractional-ai-cto-kirill-markin/"
  },

  // Category: People
  {
    serviceId: "ai_mentorship",
    categoryId: "people",
    name: "AI Technical Mentorship",
    description: "Building an AI product or transitioning into AI/LLM development? Get expert guidance to avoid 6-month mistakes and move faster.",
    logoUrl: "/services/career-consulting.webp",
    promoText: "",
    buttonText: "View Plans",
    buttonUrl: "/services/mentorship/"
  },
  {
    serviceId: "expense_budget_tracker",
    categoryId: "people",
    name: "Expense Budget Tracker",
    description: "Need a personal finance system that handles real-life budgets, multiple currencies, and full control over your data? Use the open-source tracker I built for people who want clarity instead of spreadsheet chaos.",
    logoUrl: "/services/expense-budget-tracker.webp",
    promoText: "",
    buttonText: "Open Website",
    buttonUrl: "https://expense-budget-tracker.com/"
  },
  {
    serviceId: "flashcards_open_source_app",
    categoryId: "people",
    name: "Flashcards Open Source App",
    description: "Want a spaced repetition app with AI workflows, self-hosting, and no lock-in? Use the open-source flashcards system I built for focused learning across web, mobile, and agent-driven workflows.",
    logoUrl: "/services/flashcards-open-source-app.webp",
    promoText: "",
    buttonText: "Open Website",
    buttonUrl: "https://flashcards-open-source-app.com/"
  },
  // {
  //   serviceId: "telegram_chatgpt_subscription",
  //   categoryId: "people",
  //   name: "Telegram ChatGPT Subscription",
  //   description: "AI-powered assistance directly in Telegram - because sometimes you need answers faster than Google can load.",
  //   logoUrl: "",
  //   promoText: "",
  //   buttonText: "Try for free",
  //   buttonUrl: "https://t.me/chat_gpt_ai_open_source_bot"
  // },

  // Category: Journalists
  {
    serviceId: "article",
    categoryId: "journalists",
    name: "Write an Article",
    description: "Need someone who can translate tech jargon into human speak? Expert quotes that don't sound like they came from a corporate robot.",
    logoUrl: "/services/article.webp",
    promoText: "",
    buttonText: "Book a call",
    buttonUrl: "/meet/short/"
  },
  {
    serviceId: "conference",
    categoryId: "journalists",
    name: "Conference talk",
    description: "Looking for a speaker who won't put your audience to sleep? AI and tech talks without the buzzword bingo.",
    logoUrl: "/services/conference.webp",
    promoText: "",
    buttonText: "Book a call",
    buttonUrl: "/meet/short/"
  },

  // Category: Police
  {
    serviceId: "police_consulting",
    categoryId: "police",
    name: "Police Consulting",
    description: "Strategic AI and technology consulting for law enforcement. Secure, professional guidance for mission-critical police operations.",
    logoUrl: "/services/police.webp",
    promoText: "",
    buttonText: "View Details",
    buttonUrl: "/services/police/"
  },
];
