// Import Next
import type { Metadata } from "next";
// Import des composants
import { LoginForm } from "@/components/auth/login-form";


export const metadata: Metadata = {
  title: "D3D | Connexion",
  description:
    "Connectez-vous à votre compte pour accéder au dashboard et gérer vos données en toute sécurité.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Colonne de gauche : Version Ordinateur - Tablette */}
      <div className="bg-[#0f172a] hidden md:flex items-center justify-center px-10">
        <div className="text-white max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4">2D3D</h1>
          <p className="text-lg opacity-80">Gestion des commandes</p>
          <p className="text-sm opacity-60 mt-2">
            Gravure photo dans le cristal
          </p>
        </div>
      </div>

      {/* Colonne de droite : formulaire de connexion + header mobile */}
      <div className="bg-gray-50 flex flex-col min-h-screen">
        {/* En-tête mobile (visible uniquement sur mobile), style bannière héro */}
        <div className="md:hidden bg-[#0f172a] py-12 px-6 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">2D3D</h1>
          <p className="text-lg opacity-90">Gestion des commandes</p>
          <p className="text-sm opacity-60 mt-1">Gravure photo dans le cristal</p>
        </div>

        {/* Formulaire */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
          <LoginForm />

          {/* Message d'information aux employés */}
          <p className="text-center text-sm text-muted-foreground max-w-sm px-4">
            Accès réservé aux employés. Contactez un administrateur pour obtenir
            un compte.
          </p>
        </div>
      </div>
    </div>
  );
}
