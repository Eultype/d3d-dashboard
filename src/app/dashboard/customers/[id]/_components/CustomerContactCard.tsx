// Import du client via Prisma
import { Customer } from "@prisma/client";
// Import des composants
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Composant coordonnées du client
export function CustomerContactCard({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardHeader>
        {/* Titre */}
        <CardTitle className="text-sm text-muted-foreground">
          Coordonnées
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
          {/* Bloc coordonnéees : Nom - Email - Tél - Entreprise - TVA */}
          <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
            {/* Nom */}
            <span className="text-right font-semibold ">Nom / Prénom</span>
            {/* Séparateur */}
            <div className="row-span-3 w-[2px] self-stretch bg-gray-300" />
            <span>{customer.name}</span>

            {/* Email */}
            <span className="text-right font-semibold ">Email</span>
            <span>{customer.email}</span>

            {/* Téléphone */}
            <span className="text-right font-semibold ">Téléphone</span>
            <span>{customer.phone}</span>

            {/* Entreprise */}
            <span className="text-right font-semibold ">Entreprise</span>
            <div className="row-span-2 w-[2px] self-stretch bg-gray-300" />
            <span>
              {customer.companyName?.trim() ? (
                customer.companyName
              ) : (
                <span className="italic text-muted-foreground">
                  Particulier
                </span>
              )}
            </span>

            {/* Numéro de TVA */}
            <span className="text-right font-semibold ">Numéro de TVA</span>
            <span>
              {customer.vatNumber?.trim() ? (
                customer.vatNumber
              ) : (
                <span className="text-muted-foreground">❌</span>
              )}
            </span>
          </div>

          {/* Bloc adresse : Ligne 1 - Ligne 2 - Code postal - Ville - Pays */}
          <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
            {/* Ligne 1 */}
            <span className="text-right font-semibold ">Ligne 1</span>
            {/* Séparateur */}
            <div className="row-span-5 w-[2px] self-stretch bg-gray-300" />
            <span>{customer.addressLine1}</span>

            {/* Ligne 2 */}
            <span className="text-right text-muted-foreground">Ligne 2</span>
            <span>
              {customer.addressLine2?.trim() ? (
                customer.addressLine2
              ) : (
                // Si vide = Maison
                <span className="italic text-muted-foreground">Maison</span>
              )}
            </span>

            {/* Code postal */}
            <span className="text-right font-semibold ">Code postal</span>
            <span>{customer.postalCode}</span>

            {/* Ville */}
            <span className="text-right font-semibold ">Ville</span>
            <span>{customer.city}</span>

            {/* Pays */}
            <span className="text-right font-semibold ">Pays</span>
            <span>{customer.country}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}