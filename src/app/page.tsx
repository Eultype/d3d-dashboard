import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D3D | Connexion",
    description: "Connectez-vous à votre compte pour accéder au dashboard et gérer vos données en toute sécurité."
};

export default function LoginPage() {
  return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-sm text-muted-foreground">
              Accès réservé aux employés.
            </p>
          </div>

          <LoginForm />

          <p className="text-xs text-muted-foreground text-center">
            D3D Dashboard • Gravure 3D cristal
          </p>
        </div>
      </div>
  );
}
