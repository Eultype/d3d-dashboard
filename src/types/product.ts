// src/types/product.ts

// État du formulaire (Server Action)
export type ProductFormState = {
  errors?: {
    name?: string[];
    sku?: string[];
    dimensions?: string[];
    category?: string[];
    imageFile?: string[];
    priceCents?: string[];
  };
  message?: string | null;
  success?: boolean;
  productId?: string;
};

// Structure d'un produit pour l'affichage dans le tableau
export type ProductRow = {
    id: string;
    name: string;
    sku: string;
    dimensions: string | null;
    category: string | null;
    imageUrl: string | null;
    isActive: boolean;
    priceCents: number;
    createdAt: string; // ISO
};

// Structure d'un produit pour le formulaire d'édition
export type ProductFormData = {
    id: string;
    name: string;
    sku: string;
    dimensions: string | null;
    category: string | null;
    imageUrl: string | null;
    priceCents: number;
    isActive: boolean;
};

// Structure pour les derniers items commandés (dans la page produit)
export type ProductRecentOrderItem = {
    id: string;
    quantity: number;
    unitPriceCents: number;
    order: {
        id: string;
        reference: string | null;
        createdAt: Date;
        items: { id: string }[];
        customer: {
            name: string | null;
        } | null;
    };
};

// Structure pour les derniers clients (dans la page produit)
export type ProductRecentCustomer = {
    id: string;
    name: string | null;
    email: string | null;
};

// Props du composant formulaire
export type ProductFormProps = {
    product?: ProductFormData;
};
