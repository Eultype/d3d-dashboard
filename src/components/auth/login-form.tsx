"use client";

// Import React
import { useState } from "react";
import { signIn } from "next-auth/react";
// Import des composants
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    window.location.href = res.url || "/dashboard";
  }

  return (
      <Card className="w-full max-w-md bg-white text-black shadow-xl border-none">
        {/* En-tête de la carte : titre de connexion et texte d'introduction */}
        <CardHeader className="space-y-1 pt-8">
          <CardTitle className="text-3xl font-bold text-center">Connexion</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Entrez vos identifiants pour accéder au panel
            </p>
        </CardHeader>

        {/* Contenu de la carte : formulaire principal */}
        <CardContent className="p-8 pt-4">
          <form action={onSubmit} className="space-y-6">
            <div className="space-y-2">

              {/* Champ pour l'adresse e-mail */}
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@exemple.com"
                required
                className="h-11 border-slate-300 focus-visible:ring-slate-900"
              />
            </div>

            {/* Champ pour le mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 border-slate-300 focus-visible:ring-slate-900"
              />
            </div>

            {/* Message d'erreur en cas d'échec de connexion*/}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Bouton de soumission du formulaire */}
            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}
