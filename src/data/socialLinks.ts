import { PHONE_NUMBER, getWhatsAppUrl, EMAIL, getEmailUrl, getTelegramUrl, TELEGRAM_USERNAME, SOCIAL_URLS } from './contacts';

export interface SocialLink {
  name: string;
  url: string;
  username: string;
  socialLogoUrlDefault?: string;
  socialLogoUrlHover?: string;
  avatarContact?: boolean;
  contactBubble?: boolean;
  footerBottom?: boolean;
  footerBottomGreenLine?: boolean;
  header?: boolean;
  avatarLearnMore?: boolean;
  hidden?: boolean;
  achievement?: {
    value: string;
    label: string;
  };
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: SOCIAL_URLS.linkedin,
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/linkedin.png",
    socialLogoUrlHover: "/social/linkedin_hover.png",
    avatarContact: true,
    footerBottom: true,
    achievement: {
      value: "7,000+",
      label: "followers"
    }
  },
  {
    name: "CV CTO",
    url: "/data/cv-kirill-markin-cto.pdf",
    username: "CV CTO",
    socialLogoUrlDefault: "/social/cv.svg",
    socialLogoUrlHover: "/social/cv_hover.svg",
    avatarContact: true,
    footerBottom: true,
    achievement: {
      value: "12+",
      label: "years"
    }
  },
  {
    name: "CV DE",
    url: "/data/cv-kirill-markin-data-engineer.pdf",
    username: "CV DE",
    socialLogoUrlDefault: "/social/cv.svg",
    socialLogoUrlHover: "/social/cv_hover.svg",
    avatarContact: true,
    footerBottom: true,
    hidden: true,
    achievement: {
      value: "12+",
      label: "years"
    }
  },
  {
    name: "YouTube",
    url: SOCIAL_URLS.youtube,
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/youtube.svg",
    socialLogoUrlHover: "/social/youtube_hover.svg",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true,
    achievement: {
      value: "300+",
      label: "subscribers"
    }
  },
  {
    name: "Telegram",
    url: getTelegramUrl(),
    username: `@${TELEGRAM_USERNAME}`,
    socialLogoUrlDefault: "/social/telegram.png",
    socialLogoUrlHover: "/social/telegram_hover.png",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true
  },
  {
    name: "GitHub",
    url: SOCIAL_URLS.github,
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/github.svg",
    socialLogoUrlHover: "/social/github_hover.svg",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true,
    achievement: {
      value: "35+",
      label: "repos"
    }
  },
  {
    name: "WhatsApp",
    url: getWhatsAppUrl(),
    username: PHONE_NUMBER,
    socialLogoUrlDefault: "/social/whatsapp.png",
    socialLogoUrlHover: "/social/whatsapp_hover.png",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true
  },
  {
    name: "Email",
    url: getEmailUrl(),
    username: EMAIL,
    socialLogoUrlDefault: "/social/gmail.png",
    socialLogoUrlHover: "/social/google_hover.png",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true
  },
  {
    name: "Reddit",
    url: SOCIAL_URLS.reddit,
    username: "@Kirmark",
    avatarLearnMore: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    socialLogoUrlDefault: "/social/reddit.png",
    socialLogoUrlHover: "/social/reddit_hover.png"
  },
  {
    name: "Twitter",
    url: SOCIAL_URLS.twitter,
    username: "@kirill_markin_",
    socialLogoUrlDefault: "/social/xcom.png",
    socialLogoUrlHover: "/social/xcom_hover.png",
    footerBottom: true,
    avatarLearnMore: true,
    footerBottomGreenLine: true
  },
  {
    name: "Medium",
    url: SOCIAL_URLS.medium,
    username: "@kirill-markin",
    avatarLearnMore: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    socialLogoUrlDefault: "/social/medium.png",
    socialLogoUrlHover: "/social/medium_hover.png"
  },
  {
    name: "Bluesky",
    url: SOCIAL_URLS.bluesky,
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/bluesky.png",
    socialLogoUrlHover: "/social/bluesky.png",
    footerBottom: true,
    footerBottomGreenLine: true
  }
]; 