import { PHONE_NUMBER, EMAIL } from './contacts';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  image: string;
  jobTitle: string;
  secondaryTitle: string;
  tertiaryTitle: string;
}

export const personalInfo: PersonalInfo = {
  name: "Kirill Markin",
  email: EMAIL,
  phone: PHONE_NUMBER,
  image: "/avatars/Kirill-Markin.webp",
  jobTitle: "CTO",
  secondaryTitle: "ex-Founder of ozma.io",
  tertiaryTitle: "AI & Data Engineer"
}; 