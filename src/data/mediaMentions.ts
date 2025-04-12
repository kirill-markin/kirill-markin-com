export interface MediaMention {
  title: string;
  alternativeTitle?: string;
  url: string;
  publisher?: string;
  date?: string;
  type: string;
  language: string;
  thumbnailUrl: string;
  websiteLogoUrl: string;
  description?: string;
  achievementValue?: string;
  achievementLabel?: string;
  isVideo?: boolean;
  event?: string;
  eventUrl?: string;
}

export const mediaMentions: MediaMention[] = [
  {
    title: "Cursor IDE: Setup and Workflow in\u00A0Larger Projects",
    url: "https://www.reddit.com/r/cursor/comments/1ikq9m6/cursor_ide_setup_and_workflow_in_larger_projects/",
    publisher: "Reddit",
    date: "2025-02-08",
    type: "Article",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/reddit-2025-02-08.webp",
    websiteLogoUrl: "/images/website_logos/cursor.png",
    achievementValue: "54,000",
    achievementLabel: "views"
  },
  {
    title: "Merged pull request to Computer Using Agent Sample App",
    url: "https://github.com/openai/openai-cua-sample-app/pull/11",
    publisher: "openai",
    date: "2024-04-01",
    type: "Contribution",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/openai-2024-04-01.webp",
    websiteLogoUrl: "/images/website_logos/openai.png",
    achievementValue: "merged",
    achievementLabel: ""
  },
  {
    title: "AI web\u00A0scraping - Data Collection reimagined",
    url: "https://youtu.be/QDFDTN30YOs?si=fpeSOig9h1el2zkK",
    publisher: "noah-conference.com",
    date: "2023-12-14",
    type: "Conference Talk",
    event: "NOAH Conference 2023, Zurich",
    eventUrl: "https://www.noah-conference.com/program-noah-zurich-conference-2023/",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/noah-2023-12-14.webp",
    websiteLogoUrl: "/images/website_logos/noah-conf.png",
    isVideo: true
  },
  {
    title: "How to\u00A0Work with\u00A0Jupyter Notebooks via\u00A0LLM in\u00A0Cursor IDE?",
    url: "https://youtu.be/eOSfeBIBzr0?si=kbJlYFZQtdDR8Ipo",
    publisher: "Youtube",
    date: "2025-02-18",
    type: "Video",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/youtube-2025-02-18.webp",
    websiteLogoUrl: "/images/website_logos/youtube.png",
    achievementValue: "2,600",
    achievementLabel: "views",
    isVideo: true
  },
  {
    title: "How to\u00A0handle a\u00A0billion new\u00A0records per\u00A0day",
    url: "https://verigram.ai/blog/Kazakhstan-AI-ML-community-is-delighted-with-VeriMeet",
    publisher: "verigram.ai",
    date: "2023-09-08",
    type: "Conference Talk",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/verigram-2023-09-08.webp",
    websiteLogoUrl: "/images/website_logos/verigram.png"
  },
  {
    title: "How to\u00A0write code with\u00A0AI, ChatGPT? From\u00A0scratch to\u00A068 GitHub stars",
    url: "https://youtu.be/9MyJJRMRCW0?si=T2o6DG8iSBheMFfG",
    publisher: "Kirill Markin",
    date: "2024-01-21",
    type: "Video",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/kirill-2024-01-21.webp",
    websiteLogoUrl: "/images/website_logos/youtube.png",
    achievementValue: "5,000",
    achievementLabel: "views",
    isVideo: true
  },
  {
    title: "Build with\u00A0AI Custom ERP and\u00A0CRM - No\u00A0Code Required",
    url: "https://youtu.be/Una8_vv6mlY?si=oaPzSTpdla7tfXmF",
    publisher: "ozma-io youtube channel",
    date: "2024-04-01",
    type: "Video",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/ozma-2024-04-01.webp",
    websiteLogoUrl: "/images/website_logos/youtube.png",
    isVideo: true
  },
  {
    title: "CRM-система: как\u00A0сэкономить деньги и\u00A0выбрать наилучший вариант",
    alternativeTitle: "CRM System: How to\u00A0Save Money and\u00A0Choose the\u00A0Best Option",
    url: "https://rb.ru/opinion/best-crm/",
    publisher: "Rusbase",
    date: "2021-03-12",
    type: "Article",
    language: "ru",
    thumbnailUrl: "/images/articles_thumbnails/rusbase-2021-03-12.webp",
    websiteLogoUrl: "/images/website_logos/rusbase.png"
  },
  {
    title: "Write article as\u00A0programmer: IDE Cursor and\u00A0LLM magic",
    url: "https://youtu.be/ySA8_aVqu5I?si=muBLOwv3Smjltt3u",
    publisher: "Kirill Markin",
    date: "2024-09-04",
    type: "Video",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/kirill-2024-09-04.webp",
    websiteLogoUrl: "/images/website_logos/youtube.png",
    isVideo: true
  },
  {
    title: "Как\u00A0сделать таск-трекер под\u00A0себя на\u00A0low-code конструкторе",
    alternativeTitle: "How to\u00A0Make a\u00A0Task Tracker for\u00A0Yourself on\u00A0a\u00A0Low-Code Constructor",
    url: "https://habr.com/ru/articles/673874/",
    publisher: "Habr",
    date: "2022-07-12",
    type: "Article",
    language: "ru",
    thumbnailUrl: "/images/articles_thumbnails/habr-2022-07-12.webp",
    websiteLogoUrl: "/images/website_logos/habr.svg",
    achievementValue: "13,000",
    achievementLabel: "views"
  },
  {
    title: "Как\u00A0мотивировать сотрудников использовать AI инструменты в\u00A0работе",
    alternativeTitle: "How to\u00A0Motivate Employees to\u00A0Use AI Tools in\u00A0Their Work",
    url: "https://web.archive.org/web/20240617095343/https://epicgrowth.io/ai-conference#agenda",
    publisher: "epicgrowth.io",
    date: "2024-03-14",
    type: "Panel Discussion",
    event: "Epic AI Conference 2024",
    eventUrl: "https://web.archive.org/web/20240617095343/https://epicgrowth.io/ai-conference#agenda",
    thumbnailUrl: "/images/articles_thumbnails/epicgrowth-2024-03-14.webp",
    language: "ru",
    websiteLogoUrl: "/images/website_logos/epicgrowth.svg",
    achievementValue: "Moderator",
    achievementLabel: ""
  },
  {
    title: "Как\u00A0прикрутить AI к\u00A0вашему продукту: пример на\u00A0ozma.io",
    alternativeTitle: "How to\u00A0Integrate AI into\u00A0Your Product: An\u00A0Example from\u00A0ozma.io",
    url: "https://web.archive.org/web/20240617095343/https://epicgrowth.io/ai-conference#agenda",
    publisher: "epicgrowth.io",
    date: "2024-03-12",
    type: "Conference Talk",
    event: "Epic AI Conference 2024",
    eventUrl: "https://web.archive.org/web/20240617095343/https://epicgrowth.io/ai-conference#agenda",
    thumbnailUrl: "/images/articles_thumbnails/epicgrowth-2024-03-12.webp",
    websiteLogoUrl: "/images/website_logos/epicgrowth.svg",
    language: "ru"
  },
  {
    title: "Custom CRM from\u00A0scratch on\u00A0low-code platform ozma.io",
    url: "https://ozma.io/articles/custom-crm-from-scratch-on-low-code-platform-ozma-io/",
    publisher: "Ozma Inc.",
    date: "2022-08-27",
    type: "Article",
    language: "en",
    thumbnailUrl: "/images/articles_thumbnails/ozma-2022-08-27.webp",
    websiteLogoUrl: "/images/website_logos/ozma.svg"
  }
]; 