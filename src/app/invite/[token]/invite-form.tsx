"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInvitation } from "@/actions/invite";

export function InviteForm({ token, email, name }: { token: string; email: string; name?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const result = await acceptInvitation(token, formData);

    if (!result.success) {
      setError(result.message || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    // Redirect to login or auto-login (usually login page is safer/simpler)
    router.push("/?invited=true");
  }

  return (
    <Card className="w-full max-w-md bg-white text-black shadow-xl border-none">
      <CardHeader className="space-y-1 pt-8">
        <CardTitle className="text-2xl font-bold text-center">Bienvenue {name || ""}</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Finalisez votre inscription pour : <br/> <span className="font-medium text-black">{email}</span>
        </p>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="h-11 border-slate-300 focus-visible:ring-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="h-11 border-slate-300 focus-visible:ring-slate-900"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            disabled={loading}
          >
            {loading ? "Validation..." : "Définir mon mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
