
// --- Types pour le catalogue de produits venant de la DB ---
export type ProductFromDB = {
  id: string;
  name: string;
  priceCents: number;
};

// --- Types pour les items dans le panier de la commande ---
export type ProductItem = {
  uniqueId: string;
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

// --- Types pour les données d'un nouveau client en cours de création ---
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

// --- Types pour les détails client affichés dans le récap ---
export type ClientDetails = {
  name:string;
  email: string;
  phone: string;
};

// --- Type principal pour le brouillon de la commande ---
export type OrderDraft = {
  // Infos générales (step 1)
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  // Client (step 2)
  customerId: string | null;
  clientDetails: ClientDetails | null;
  newClientData?: NewClientData | null; // Données si nouveau client
  // Produits (step 3)
  products: ProductItem[];
  // Options (step 4)
  discountType: string;
  internalNote: string;
};
