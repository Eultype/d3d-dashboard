import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D3D | Connexion",
  description:
    "Connectez-vous à votre compte pour accéder au dashboard et gérer vos données en toute sécurité.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="bg-[#0f172a] flex items-center justify-center px-10">
        <div className="text-white max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4">2D3D</h1>
          <p className="text-lg opacity-80">Gestion des commandes</p>
          <p className="text-sm opacity-60 mt-2">
            Gravure photo dans le cristal
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gray-100 flex items-center justify-center min-h-screen flex-col gap-5 ">
        <LoginForm />
        <p className="text-center text-muted-foreground max-w-96">
          Accès réservé aux employés. Contactez un administrateur pour obtenir
          un compte.
        </p>
      </div>
    </div>
  );
}
