export interface StoreData {
  id: string;
  name: string;
  location: string;
  website: string;
  rating: number;
  description: string;
  contactEmail: string;
  phoneNumber: string;
  openingHours: string;
  shippingInformation: ShippingInformationData;
  returnPolicy: string;
  featuredItems: string[];
}

export interface ShippingInformationData {
  domestic: DomesticShipping;
  international: InternationalShipping;
}

export interface DomesticShipping {
  standard: string;
  express: string;
}

export interface InternationalShipping {
  economy: string;
  express: string;
}

// Domestic.standard: "€5.00 (3-5 business days)"
// Domestic.express: "€10.00 (1-2 business days)"
// International.economy: "€15.00 (7-14 business days)"
// International.express: "€25.00 (3-5 business days)"
