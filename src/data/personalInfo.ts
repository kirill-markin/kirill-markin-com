import { PHONE_NUMBER, EMAIL } from './contacts';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  image: string;
  jobTitle: string;
  secondaryTitle: string;
}

export const personalInfo: PersonalInfo = {
  name: "Kirill Markin",
  email: EMAIL,
  phone: PHONE_NUMBER,
  image: "/avatars/Kirill-Markin.webp",
  jobTitle: "Staff Software Engineer",
  secondaryTitle: "Founder"
}; 
