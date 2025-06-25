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
    url: "https://www.linkedin.com/in/kirill-markin/",
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/linkedin.png",
    socialLogoUrlHover: "/social/linkedin_hover.png",
    avatarContact: true,
    footerBottom: true,
    achievement: {
      value: "6,000+",
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
    url: "https://www.youtube.com/@kirill-markin",
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/youtube.svg",
    socialLogoUrlHover: "/social/youtube_hover.svg",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true,
    achievement: {
      value: "170+",
      label: "subscribers"
    }
  },
  {
    name: "Telegram",
    url: "https://t.me/kirmark",
    username: "@kirmark",
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
    url: "https://github.com/kirill-markin",
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
    url: "https://api.whatsapp.com/send?phone=31625351137",
    username: "+31625351137",
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
    url: "mailto:markinkirill@gmail.com",
    username: "markinkirill@gmail.com",
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
    url: "https://www.reddit.com/user/Kirmark",
    username: "@Kirmark",
    avatarLearnMore: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    socialLogoUrlDefault: "/social/reddit.png",
    socialLogoUrlHover: "/social/reddit_hover.png"
  },
  {
    name: "Twitter",
    url: "https://x.com/kirill_markin_",
    username: "@kirill_markin_",
    socialLogoUrlDefault: "/social/xcom.png",
    socialLogoUrlHover: "/social/xcom_hover.png",
    footerBottom: true,
    avatarLearnMore: true,
    footerBottomGreenLine: true
  },
  {
    name: "Medium",
    url: "https://kirill-markin.medium.com/",
    username: "@kirill-markin",
    avatarLearnMore: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    socialLogoUrlDefault: "/social/medium.png",
    socialLogoUrlHover: "/social/medium_hover.png"
  },
  {
    name: "Bluesky",
    url: "https://bsky.app/profile/kirill-markin.bsky.social",
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social/bluesky.png",
    socialLogoUrlHover: "/social/bluesky.png",
    footerBottom: true,
    footerBottomGreenLine: true
  }
]; 