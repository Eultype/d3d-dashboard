// src/types/order.ts

export type ProductItem = {
  uniqueId: string;
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

export type ClientDetails = {
  name: string;
  email: string;
  phone: string;
  companyName?: string | null;
  vatNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
};

export type NewClientData = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  isActive: boolean;
};

export type OrderDraft = {
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  customerId: string | null;
  clientDetails: ClientDetails | null;
  newClientData?: NewClientData | null; // AJOUTÉ
  products: ProductItem[];
  discountType: string;
  internalNote: string;
};

export type ProductFromDB = {
  id: string;
  name: string;
  priceCents: number;
};
