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
        // On autorise null si jamais les données viennent brutes de la DB, 
        // mais idéalement on nettoie avant.
        // Ici je reste strict par rapport à votre code actuel.
    };
};
