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
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/kirill-markin/",
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social_logos/linkedin.png",
    socialLogoUrlHover: "/social_logos/linkedin_hover.png",
    avatarContact: true,
    footerBottom: true
  },
  {
    name: "WhatsApp",
    url: "https://api.whatsapp.com/send?phone=31625351137",
    username: "+31 6 253 51137",
    socialLogoUrlDefault: "/social_logos/whatsapp.png",
    socialLogoUrlHover: "/social_logos/whatsapp_hover.png",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true
  },
  {
    name: "Telegram",
    url: "https://t.me/kirmark",
    username: "@kirmark",
    socialLogoUrlDefault: "/social_logos/telegram.png",
    socialLogoUrlHover: "/social_logos/telegram_hover.png",
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
    socialLogoUrlDefault: "/social_logos/gmail.png",
    socialLogoUrlHover: "/social_logos/google_hover.png",
    avatarContact: true,
    contactBubble: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    header: true
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/kirill.markin.kira/",
    username: "@kirill.markin.kira",
    socialLogoUrlDefault: "/social_logos/instagram.png",
    socialLogoUrlHover: "/social_logos/instagram_hover.png",
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
    footerBottom: true
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@kirill-markin",
    username: "@kirill-markin",
    footerBottom: true
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/user/Kirmark",
    username: "@Kirmark",
    avatarLearnMore: true,
    footerBottom: true,
    footerBottomGreenLine: true,
    socialLogoUrlDefault: "/social_logos/reddit.png",
    socialLogoUrlHover: "/social_logos/reddit_hover.png"
  },
  {
    name: "Twitter",
    url: "https://x.com/kirill_markin_",
    username: "@kirill_markin_",
    socialLogoUrlDefault: "/social_logos/xcom.png",
    socialLogoUrlHover: "/social_logos/xcom_hover.png",
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
    socialLogoUrlDefault: "/social_logos/medium.png",
    socialLogoUrlHover: "/social_logos/medium_hover.png"
  },
  {
    name: "Bluesky",
    url: "https://bsky.app/profile/kirill-markin.bsky.social",
    username: "@kirill-markin",
    socialLogoUrlDefault: "/social_logos/bluesky.png",
    socialLogoUrlHover: "/social_logos/bluesky.png",
    footerBottom: true,
    footerBottomGreenLine: true
  }
]; 