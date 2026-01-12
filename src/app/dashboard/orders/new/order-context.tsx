"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Types des données ---

// Reprends tes types définis précédemment ici pour qu'ils soient globaux
export type ProductItem = {
  uniqueId: string;
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

export type OrderData = {
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  clientId: string | null;
  clientDetails?: any; // Tu pourras typer ça mieux avec ton modèle Client Prisma
  products: ProductItem[];
  discountType: "none" | "percent" | "amount";
  internalNote: string;
};

// Valeurs par défaut
const initialOrderData: OrderData = {
  info: { prefix: "", channel: "", delivery: "" },
  clientId: null,
  products: [],
  discountType: "none",
  internalNote: "",
};

// --- Context Setup ---

type OrderContextType = {
  data: OrderData;
  updateData: (partialData: Partial<OrderData>) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OrderData>(initialOrderData);

  const updateData = (partialData: Partial<OrderData>) => {
    setData((prev) => ({ ...prev, ...partialData }));
  };

  return (
    <OrderContext.Provider value={{ data, updateData }}>
      {children}
    </OrderContext.Provider>
  );
}

// Hook personnalisé pour utiliser le context facilement
export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
