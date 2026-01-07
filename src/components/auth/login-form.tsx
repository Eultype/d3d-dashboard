"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

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

        const email = String(formData.get("email") || "").trim().toLowerCase();
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
        <Card>
            <CardHeader>
                <CardTitle>Se connecter</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Connexion..." : "Connexion"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
