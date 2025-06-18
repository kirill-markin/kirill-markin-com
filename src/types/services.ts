// Service Other Data (renamed from ServiceData)
export interface ServiceOtherData {
  serviceId: string;
  categoryId: string;
  name: string;
  description: string;
  logoUrl: string;
  promoText: string;
  buttonText: string;
  buttonUrl: string;
}

// Social Contact Button Interface
export interface SocialContactButton {
  name: string;
  url: string;
  username: string;
  icon: string;
}

// Fractional CTO Plan Interface
export interface ServiceFractionalCTOPlan {
  planId: string;
  name: string;
  price: string;
  hours: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  socialButtons?: SocialContactButton[];
}

// Fractional CTO Service Data
export interface ServiceFractionalCTOData {
  title: string;
  description: string;
  subtitle?: string;
  plans: ServiceFractionalCTOPlan[];
}

