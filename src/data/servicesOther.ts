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
    serviceId: "career_consulting",
    categoryId: "people",
    name: "Career Consulting",
    description: "Tired of sending CVs into the void? I've hired dozens of engineers, so I know what works and what's just LinkedIn noise.",
    logoUrl: "/services/career-consulting.webp",
    promoText: "",
    buttonText: "Book a call",
    buttonUrl: "/meet/short/"
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
];

