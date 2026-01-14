// src/types/product.ts

// État du formulaire (Server Action)
export type ProductFormState = {
  errors?: {
    name?: string[];
    sku?: string[];
    description?: string[];
    imageFile?: string[];
    priceCents?: string[];
  };
  message?: string | null;
};

// Structure d'un produit pour l'affichage dans le tableau
export type ProductRow = {
    id: string;
    name: string;
    sku: string;
    description: string | null;
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
    description: string | null;
    imageUrl: string | null;
    priceCents: number;
    isActive: boolean;
};

// Props du composant formulaire
export type ProductFormProps = {
    product?: ProductFormData;
};
