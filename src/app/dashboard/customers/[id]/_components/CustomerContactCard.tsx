import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerContactCard({ customer }: { customer: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Coordonnées
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
                    {/* Nom - Email - Tél - Entreprise - TVA */}
                    <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
                        <span className="text-right font-semibold text-gray-700">
                            Nom / Prénom
                        </span>
                        <div className="row-span-3 w-[2px] self-stretch bg-gray-300" />
                        <span>{customer.name}</span>

                        <span className="text-right font-semibold text-gray-700">
                            Email
                        </span>
                        <span>{customer.email}</span>

                        <span className="text-right font-semibold text-gray-700">
                            Téléphone
                        </span>
                        <span>{customer.phone}</span>

                        <span className="text-right font-semibold text-gray-700">
                            Entreprise
                        </span>
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

                        <span className="text-right font-semibold text-gray-700">
                            Numéro de TVA
                        </span>
                        <span>
                            {customer.vatNumber?.trim() ? (
                                customer.vatNumber
                            ) : (
                                <span className="text-muted-foreground">❌</span>
                            )}
                        </span>
                    </div>

                    {/* Adresse */}
                    <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
                        <span className="text-right font-semibold text-gray-700">
                            Ligne 1
                        </span>
                        <div className="row-span-5 w-[2px] self-stretch bg-gray-300" />
                        <span>{customer.addressLine1}</span>

                        <span className="text-right text-muted-foreground">Ligne 2</span>
                        <span>
                            {customer.addressLine2?.trim() ? (
                                customer.addressLine2
                            ) : (
                                <span className="italic text-muted-foreground">Maison</span>
                            )}
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                            Code postal
                        </span>
                        <span>{customer.postalCode}</span>

                        <span className="text-right font-semibold text-gray-700">
                            Ville
                        </span>
                        <span>{customer.city}</span>

                        <span className="text-right font-semibold text-gray-700">
                            Pays
                        </span>
                        <span>{customer.country}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
