"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createReseller, ResellerInput } from "@/actions/reseller";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NewResellerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ResellerInput>({
    name: "",
    email: "",
    companyName: "",
    prefix: "",
    phone: "",
    vatNumber: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    country: "Belgique",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prefix" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createReseller(formData);
      
      if (result.success) {
        if (result.emailError) {
             toast.warning("Compte créé, mais échec de l'envoi du mail.");
        } else {
             toast.success("Revendeur créé et invitation envoyée !");
        }
        setSuccess(true);
      } else {
        toast.error(result.message || "Erreur lors de la création.");
      }
    } catch (error) {
        console.error(error);
      toast.error("Erreur technique.");
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    // ... same as before
    return (
      <Card className="max-w-lg mx-auto border-green-500 bg-green-50/50">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
             <MailCheck className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-center text-green-700">Invitation Envoyée !</CardTitle>
          <CardDescription className="text-center">
            Le compte revendeur <strong>{formData.name}</strong> a été créé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">
            Un email contenant les identifiants de connexion a été envoyé à :
          </p>
          <p className="font-bold text-lg">{formData.email}</p>

          <Alert className="mt-4 bg-white border-green-200">
            <AlertTitle>Sécurité Maximale</AlertTitle>
            <AlertDescription>
               Le mot de passe a été généré et envoyé directement au revendeur. 
               Vous ne pouvez pas le voir.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center pt-4">
            <Button onClick={() => router.push("/dashboard/resellers")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Nouveau Revendeur</CardTitle>
        <CardDescription>
          Créez un compte partenaire. Les accès seront envoyés par email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du contact</Label>
            <Input
              id="name"
              name="name"
              placeholder="Prénom Nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="companyName">Nom de la société</Label>
                <Input
                id="companyName"
                name="companyName"
                placeholder="Ex: Boutique XYZ"
                value={formData.companyName}
                onChange={handleChange}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vatNumber">Numéro de TVA</Label>
                <Input
                id="vatNumber"
                name="vatNumber"
                placeholder="Ex: BE0123456789"
                value={formData.vatNumber}
                onChange={handleChange}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="prefix">Préfixe (Unique)</Label>
                <Input
                id="prefix"
                name="prefix"
                placeholder="Ex: XYZ"
                maxLength={5}
                value={formData.prefix}
                onChange={handleChange}
                required
                className="uppercase font-mono"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                id="phone"
                name="phone"
                placeholder="+32 4..."
                value={formData.phone}
                onChange={handleChange}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email du revendeur</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contact@boutiquexyz.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 border-t pt-2">
            <Label className="text-base font-semibold">Adresse</Label>
            <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-xs text-muted-foreground">Rue et numéro</Label>
                <Input
                    id="addressLine1"
                    name="addressLine1"
                    placeholder="Rue de la Gare 12"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-xs text-muted-foreground">Code postal</Label>
                    <Input
                        id="postalCode"
                        name="postalCode"
                        placeholder="1000"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs text-muted-foreground">Ville</Label>
                    <Input
                        id="city"
                        name="city"
                        placeholder="Bruxelles"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="country" className="text-xs text-muted-foreground">Pays</Label>
                <Input
                    id="country"
                    name="country"
                    placeholder="Belgique"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Créer et Envoyer l'invitation"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
