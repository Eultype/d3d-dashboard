// src/types/customer.ts

// État du formulaire (Server Action)
export type CustomerFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    companyName?: string[];
    vatNumber?: string[];
    isActive?: string[];
    addressLine1?: string[];
    addressLine2?: string[];
    postalCode?: string[];
    city?: string[];
    country?: string[];
  };
  message?: string | null;
  success?: boolean;
  customerId?: string;
};

// Structure d'un client pour l'affichage dans le tableau
export type CustomerRow = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    vatNumber: string | null;
    isActive: boolean;
    createdAt: string; // ISO
};

// Structure pour les commandes récentes d'un client
export type CustomerRecentOrder = {
    id: string;
    reference: string | null;
    status: string;
    createdAt: Date;
    items: { quantity: number; unitPriceCents: number }[];
    shippingCostCents: number;
    discountType?: string | null;
    discountValue?: number | null;
};

// Structure pour les derniers items commandés par un client
export type CustomerLastOrderItem = {
    id: string;
    quantity: number;
    unitPriceCents: number;
    orderId: string;
    order: {
        createdAt: Date;
        reference: string | null;
    };
    product: {
        name: string;
        sku: string | null;
    };
};

// Props du composant formulaire (pour édition)
export type CustomerFormProps = {
    customer?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        companyName: string;
        vatNumber: string;
        isActive: boolean;
        addressLine1: string;
        addressLine2: string;
        postalCode: string;
        city: string;
        country: string;
    };
};
