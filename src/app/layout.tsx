// Import Next
import type { Metadata } from "next";
// Import CSS
import "./globals.css";
// Import des composants
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Metadata de la page de connexion
export const metadata: Metadata = {
    title: "D3D | Connexion",
    description:
        "Connectez-vous à votre compte pour accéder au dashboard et gérer vos données en toute sécurité.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
        </body>
        </html>
    );
}
