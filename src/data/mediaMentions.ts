export interface MediaMention {
  title: string;
  alternativeTitle?: string;
  url: string;
  publisher?: string;
  date?: string;
  type: string;
  language: string;
  thumbnailUrl?: string | null;
  websiteLogoUrl?: string | null;
  description?: string;
  achievementValue?: string | null;
  achievementLabel?: string | null;
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
    thumbnailUrl: "/articles/reddit-2025-02-08.webp",
    websiteLogoUrl: "/logos/cursor.png",
    achievementValue: "57,000",
    achievementLabel: "views"
  },
  {
    title: "Merged pull request to Computer Using Agent Sample App",
    url: "https://github.com/openai/openai-cua-sample-app/pull/11",
    publisher: "openai",
    date: "2024-04-01",
    type: "Contribution",
    language: "en",
    thumbnailUrl: "/articles/openai-2024-04-01.webp",
    websiteLogoUrl: "/logos/openai.png",
    achievementValue: "merged",
    achievementLabel: null
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
    thumbnailUrl: "/articles/noah-2023-12-14.webp",
    websiteLogoUrl: "/logos/noah-conf.png",
    isVideo: true
  },
  {
    title: "How to\u00A0write code with\u00A0AI, ChatGPT? From\u00A0scratch to\u00A068 GitHub stars",
    url: "https://youtu.be/9MyJJRMRCW0?si=T2o6DG8iSBheMFfG",
    publisher: "Kirill Markin",
    date: "2024-01-21",
    type: "Video",
    language: "en",
    thumbnailUrl: "/articles/kirill-2024-01-21.webp",
    websiteLogoUrl: "/logos/youtube.png",
    achievementValue: "5,100",
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
    thumbnailUrl: "/articles/verigram-2023-09-08.webp",
    websiteLogoUrl: "/logos/verigram.png"
  },
  {
    title: "How to\u00A0Work with\u00A0Jupyter Notebooks via\u00A0LLM in\u00A0Cursor IDE?",
    url: "https://youtu.be/eOSfeBIBzr0?si=kbJlYFZQtdDR8Ipo",
    publisher: "Youtube",
    date: "2025-02-18",
    type: "Video",
    language: "en",
    thumbnailUrl: "/articles/youtube-2025-02-18.webp",
    websiteLogoUrl: "/logos/youtube.png",
    achievementValue: "3,700",
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
    thumbnailUrl: "/articles/ozma-2024-04-01.webp",
    websiteLogoUrl: "/logos/youtube.png",
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
    thumbnailUrl: "/articles/rusbase-2021-03-12.webp",
    websiteLogoUrl: "/logos/rusbase.png"
  },
  {
    title: "Write article as\u00A0programmer: IDE Cursor and\u00A0LLM magic",
    url: "https://youtu.be/ySA8_aVqu5I?si=muBLOwv3Smjltt3u",
    publisher: "Kirill Markin",
    date: "2024-09-04",
    type: "Video",
    language: "en",
    thumbnailUrl: "/articles/kirill-2024-09-04.webp",
    websiteLogoUrl: "/logos/youtube.png",
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
    thumbnailUrl: "/articles/habr-2022-07-12.webp",
    websiteLogoUrl: "/logos/habr.svg",
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
    thumbnailUrl: "/articles/epicgrowth-2024-03-14.webp",
    language: "ru",
    websiteLogoUrl: "/logos/epicgrowth.svg",
    achievementValue: "Moderator",
    achievementLabel: null
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
    thumbnailUrl: "/articles/epicgrowth-2024-03-12.webp",
    websiteLogoUrl: "/logos/epicgrowth.svg",
    language: "ru"
  },
  {
    title: "Как\u00A0решить сложную большую задачу с\u00A0помощью AI: пайплайны, агенты и\u00A0другие шалости",
    alternativeTitle: "How to\u00A0Solve a\u00A0Complex Big Problem with\u00A0AI: Pipelines, Agents, and\u00A0Other Tricks",
    url: "https://youtu.be/DLLqjrj4AME?si=3JFw1azmqDLXFgS6",
    publisher: "podlodka.io",
    date: "2024-03-21",
    type: "Workshop",
    event: "Podlodka Product Crew #5",
    eventUrl: "https://podlodka.io/productcrew",
    thumbnailUrl: "/articles/podlodka-2024-03-21.webp",
    language: "ru",
    websiteLogoUrl: "/logos/podlodka.png",
    isVideo: true
  },
  {
    title: "Агрегация и\u00A0аналитика данных в\u00A0масштабе ТОП-3 прокси-провайдера в\u00A0мире",
    alternativeTitle: "Aggregation and\u00A0Analytics of\u00A0Data at\u00A0the\u00A0Scale of\u00A0the\u00A0Top 3 Proxy Providers in\u00A0the\u00A0World",
    url: "https://matemarketing.ru/video?v=MTAwMTk4PzIjMzI5Nw",
    publisher: "matemarketing.ru",
    date: "2023-11-09",
    type: "Conference Talk",
    event: "Матемаркетинг 2023",
    eventUrl: "https://matemarketing.ru/mm23",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "ML-гайд: сколько стоит, как\u00A0без ML, что\u00A0учить, если ты\u00A0продакт",
    alternativeTitle: "ML-guide: How Much It\u00A0Costs, How to\u00A0Do Without ML, What to\u00A0Study If\u00A0You Are a\u00A0Product Manager",
    url: "https://youtu.be/-b1N4Si-CUQ?si=Pll8us45Eh5S0F7D",
    publisher: "Anna Podobrazhnykh youtube channel",
    date: "2023-09-16",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/youtube-2023-09-16-1.webp",
    websiteLogoUrl: "/logos/youtube.png",
    isVideo: true
  },
  {
    title: "ML Product Day: Q&A session",
    alternativeTitle: "ML Product Day: Q&A session",
    url: "https://youtu.be/wrW8N-G2L90?si=TY2UlYTXh5pOH65w",
    publisher: "Anna Podobrazhnykh youtube channel",
    date: "2023-09-16",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/youtube-2023-09-16-2.webp",
    websiteLogoUrl: "/logos/youtube.png",
    isVideo: true
  },
  {
    title: "Не\u00A0повторять! Ошибки в\u00A0общении с\u00A0клиентами, которые роняют продажи",
    alternativeTitle: "Don't Repeat! Mistakes in\u00A0Communication with\u00A0Customers That Ruin Sales",
    url: "https://e.gd.ru/1031609",
    publisher: "Журнал \"Генеральный директор\"",
    date: "2022-07-12",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Как\u00A0с\u00A0помощью ChatGPT автоматизировать техподдержку за\u00A02 дня",
    alternativeTitle: "How to\u00A0Automate Customer Support with\u00A0ChatGPT in\u00A02 Days",
    url: "https://my.epicgrowth.io/programs/markin?category_id=135092",
    publisher: "epicgrowth.io",
    date: "2023-06-08",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/epicgrowth-2023-06-08.webp",
    websiteLogoUrl: "/logos/epicgrowth-platform.png",
    isVideo: true
  },
  {
    title: "Грядущие продукты на\u00A0основе Chat-GPT: что\u00A0ожидать в\u00A0наших приложениях и\u00A0системах",
    alternativeTitle: "Upcoming Products Based on\u00A0Chat-GPT: What to\u00A0Expect in\u00A0Our Applications and\u00A0Systems",
    url: "https://www.comnews.ru/digital-economy/content/227470/2023-07-16/2023-w28/gryaduschie-produkty-osnove-chat-gpt-chto-ozhidat-nashikh-prilozheniyakh-i-sistemakh",
    publisher: "COMNEWS",
    date: "2023-07-18",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Как\u00A0CRM облегчает жизнь отдела продаж",
    alternativeTitle: "How CRM Makes Life Easier for\u00A0Sales Department",
    url: "https://www.it-world.ru/it-news/market/194728.html",
    publisher: "it-world",
    date: "2023-07-19",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Инцидент-менеджмент: как\u00A0настроить процесс расследования без\u00A0подключения data-аналитиков",
    alternativeTitle: "Incident Management: How to\u00A0Set Up a\u00A0Investigation Process Without Connecting Data Analysts",
    url: "https://www.itweek.ru/management/article/detail.php?ID=226693",
    publisher: "itWeek",
    date: "2023-06-30",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Лекции Технопарка. Программирование в\u00A0управлении. История одного студента Бауманки",
    alternativeTitle: "Lectures of\u00A0the\u00A0Technopark. Programming in\u00A0Management. The\u00A0Story of\u00A0One Student of\u00A0Bauman",
    url: "https://habr.com/ru/companies/vk/articles/250593/",
    publisher: "VK group",
    date: "2015-02-15",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Программирование в\u00A0управлении. История одного студента Бауманки",
    alternativeTitle: "Programming in\u00A0Management. The\u00A0Story of\u00A0One Student of\u00A0Bauman",
    url: "https://www.youtube.com/watch?v=FYT9nm6ryGc",
    publisher: "VK group",
    date: "2015-02-23",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/youtube-2015-02-23.webp",
    websiteLogoUrl: "/logos/youtube.png",
    isVideo: true
  },
  {
    title: "За\u00A0жизнь: актер и\u00A0IT-специалист о\u00A0бомжевании",
    alternativeTitle: "For Life: Actor and\u00A0IT Specialist on\u00A0Homelessness",
    url: "https://youtu.be/VD-ZF4wNT-E",
    publisher: "Blogger Tanya Rybakova youtube channel",
    date: "2018-08-05",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/youtube-2018-08-05.webp",
    websiteLogoUrl: "/logos/tanya-rybakova-youtube.png",
    isVideo: true
  },
  {
    title: "Применение долгосрочной памяти в\u00A0GPT-чатах для\u00A0бизнеса: практические примеры",
    alternativeTitle: "Application of\u00A0Long-Term Memory in\u00A0GPT Chats for\u00A0Business: Practical Examples",
    url: "https://digital-report.ru/primenenie-dolgosrochnoj-pamjati-v-gpt-chatah-dlja-biznesa-prakticheskie-primery-i-sluchai-ispolzovanija/",
    publisher: "digital-report.ru",
    date: "2023-06-20",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Ошибки в\u00A0общении с\u00A0клиентами, которые роняют продажи",
    alternativeTitle: "Mistakes in\u00A0Communication with\u00A0Customers That Ruin Sales",
    url: "https://www.kom-dir.ru/article/4267-oshibki-v-obshchenii-s-klientami",
    publisher: "Журнал \"Коммерческий директор\"",
    date: "2023-08-29",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Эволюция названия стартапа: 4 шага к\u00A0идеальному имени",
    alternativeTitle: "Evolution of\u00A0a\u00A0Startup Name: 4 Steps to\u00A0the\u00A0Perfect Name",
    url: "https://www.novostiitkanala.ru/news/detail.php?ID=170421",
    publisher: "IT Channel News",
    date: "2023-07-11",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "«Жизнь после диплома» — интервью с\u00A0Кириллом Маркиным",
    alternativeTitle: "Life After Diploma: An\u00A0Interview with\u00A0Kirill Markin",
    url: "https://vk.com/@bmstu1830-zhizn-posle-diploma-intervu-s-kirillom-markinym",
    publisher: "Bauman Moscow state technical University",
    date: "2021-10-28",
    type: "Interview",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Голосовой чат GPT своими руками: пошаговое руководство для\u00A0начинающих",
    alternativeTitle: "Voice Chat GPT with\u00A0Your Own Hands: Step-by-Step Guide for\u00A0Beginners",
    url: "https://vc.ru/chatgpt/734427-golosovoy-chat-gpt-svoimi-rukami-poshagovoe-rukovodstvo-dlya-nachinayushchih",
    publisher: "vc.ru",
    date: "2023-06-23",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Создание бота Telegram с\u00A0голосовой поддержкой для\u00A0чата GPT без\u00A0DevOps",
    alternativeTitle: "Creating a\u00A0Telegram Bot with\u00A0Voice Support for\u00A0GPT Chat Without DevOps",
    url: "https://vc.ru/u/343006-kirill-markin/762087-sozdanie-bota-telegram-s-golosovoy-podderzhkoy-dlya-chata-gpt-bez-devops-podrobnyy-gayd",
    publisher: "vc.ru",
    date: "2023-07-18",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "CRM для\u00A0школы актёрского мастерства Gogol School: пример внедрения ozma.io",
    alternativeTitle: "CRM for\u00A0the\u00A0Gogol School of\u00A0Acting: An\u00A0Example of\u00A0Implementation of\u00A0ozma.io",
    url: "https://ozma.io/ru/articles/crm-dlya-shkoly-aktyorskogo-masterstva/",
    publisher: "Ozma Inc.",
    date: "2022-02-21",
    type: "Case Study",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: "/logos/ozma.svg"
  },
  {
    title: "CRM для\u00A0провайдера: пример внедрения ozma.io",
    alternativeTitle: "CRM for\u00A0the\u00A0Provider: An\u00A0Example of\u00A0Implementation of\u00A0ozma.io",
    url: "https://ozma.io/ru/articles/crm-dlya-provajdera/",
    publisher: "Ozma Inc.",
    date: "2022-02-21",
    type: "Case Study",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: "/logos/ozma.svg"
  },
  {
    title: "ИИ-инструменты для\u00A0агентов по\u00A0недвижимости",
    alternativeTitle: "AI Tools for\u00A0Real Estate Agents",
    url: "https://www.youtube.com/live/utRAu4_f1mo?si=I2cyJL-ZqiV3dWrU",
    publisher: "Youtube",
    date: "2024-02-06",
    type: "Video",
    language: "ru",
    thumbnailUrl: "/articles/youtube-2024-02-06.webp",
    websiteLogoUrl: "/logos/fedor-youtube-channel.png",
    isVideo: true
  },
  {
    title: "LOW CODE - тренд на\u00A0\"упрощенку\"",
    alternativeTitle: "LOW CODE - Trend on\u00A0'Simplification'",
    url: "https://www.facebook.com/watch/?v=2846719108881072&ref=sharing",
    publisher: "TAGES",
    date: "2021-05-19",
    type: "Video",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null,
    isVideo: true
  },
  {
    title: "Автоматизация процессов с\u00A0помощью CRM: как\u00A0проще всего это\u00A0сделать?",
    alternativeTitle: "Automation of\u00A0Processes with\u00A0CRM: How to\u00A0Do It\u00A0the\u00A0Simplest Way?",
    url: "https://vc.ru/marketing/212774-avtomatizaciya-processov-s-pomoshyu-crm-kak-proshe-vsego-eto-sdelat",
    publisher: "VC.RU",
    date: "2021-02-24",
    type: "Article",
    language: "ru",
    thumbnailUrl: null,
    websiteLogoUrl: null
  },
  {
    title: "Creating a\u00A0voice-enabled Telegram Bot for\u00A0GPT Chat without DevOps",
    url: "https://kirill-markin.medium.com/creating-a-voice-enabled-telegram-bot-for-gpt-chat-without-devops-a-comprehensive-guide-8a905241cb9c",
    publisher: "Medium",
    date: "2023-06-22",
    type: "Article",
    language: "en",
    thumbnailUrl: "/articles/medium-2023-06-22.webp",
    websiteLogoUrl: "/logos/medium.png"
  },
  {
    title: "DIY Voice-Controlled GPT Chat: A\u00A0Step-by-Step Guide for\u00A0Beginners",
    url: "https://kirill-markin.medium.com/diy-voice-controlled-gpt-chat-a-step-by-step-guide-for-beginners-5535330a7979",
    publisher: "Medium",
    date: "2023-06-08",
    type: "Article",
    language: "en",
    thumbnailUrl: "/articles/medium-2023-06-08.webp",
    websiteLogoUrl: "/logos/medium.png"
  },
  {
    title: "Where CRM is\u00A0used? Discovering the\u00A0Applications of\u00A0CRM: Company Size, Function, and\u00A0Industry",
    url: "https://ozma.io/articles/where-crm-is-used-discovering-the-applications-of-crm-size-function-industry/",
    publisher: "Ozma Inc.",
    date: "2023-06-04",
    type: "Article",
    language: "en",
    thumbnailUrl: "/articles/ozma-2023-06-04.webp",
    websiteLogoUrl: "/logos/ozma.svg"
  },
  {
    title: "CRM in\u00A0Excel — Benefits and\u00A0Differences",
    url: "https://ozma.io/articles/crm-in-excel-benefits-and-differences/",
    publisher: "Ozma Inc.",
    date: "2022-10-03",
    type: "Article",
    language: "en",
    thumbnailUrl: "/articles/ozma-2022-10-03.webp",
    websiteLogoUrl: "/logos/ozma.svg"
  },
  {
    title: "Custom CRM from\u00A0scratch on\u00A0low-code platform ozma.io",
    url: "https://ozma.io/articles/custom-crm-from-scratch-on-low-code-platform-ozma-io/",
    publisher: "Ozma Inc.",
    date: "2022-08-27",
    type: "Article",
    language: "en",
    thumbnailUrl: "/articles/ozma-2022-08-27.webp",
    websiteLogoUrl: "/logos/ozma.svg"
  }
]; 