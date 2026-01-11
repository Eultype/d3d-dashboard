import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from 'next/image';
import { formatEUR } from "@/lib/money";
import { orderTotalCents } from "@/lib/orders";
import { formatDateFR } from "@/lib/dates";


export default async function FacturePage({ params }: { params: Promise<{ id?: string }> }) {
    const { id } = await params;
    if (!id) return notFound();

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            items: { include: { product: true }, orderBy: { createdAt: "asc" } },
        },
    });

    if (!order) return notFound();

    const shortId = order.id.slice(0, 10);
    const date = formatDateFR(new Date(order.createdAt));

    const sousTotalCents = orderTotalCents(order.items);
    const livraisonCents = 0;
    const tvaCents = 0;
    const totalCents = sousTotalCents + livraisonCents + tvaCents;

    return (
        <main className="min-h-screen p-6 print:p-0">
            {/* Feuille A4 */}
            <section
                className={[
                    "mx-auto w-full bg-white shadow-sm ring-1 ring-black/5",
                    "max-w-[900px]",
                    "print:shadow-none print:ring-0",
                    // “A4 feel” (suffisant pour Chrome print)
                    "rounded-2xl print:rounded-none",
                ].join(" ")}
            >
                {/* Marges internes */}
                <div className="p-8 print:p-8">
                    {/* Header */}
                    <header className="flex items-start justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl relative">
                                    <Image
                                        src="/logo_2d3d.png"
                                        alt="Logo de votre entreprise"
                                        fill={true}
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-xl"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold leading-none">D3D Crystal</p>
                                    <p className="text-xs text-neutral-500">Gravure 2D – 3D cristal</p>
                                </div>
                            </div>

                            <div className="text-xs text-neutral-500 space-y-1">
                                <p>Chaussée de Louvain 730 • 1030 Schaerbeek • Belgique</p>
                                <p>support@d3d.com • +32 4 00 00 00 00</p>
                                <p>SIRET : 000 000 000 00000 • TVA : BE00 000000000</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-neutral-500">Facture</p>
                            <h1 className="mt-1 text-2xl font-bold">FAC-{shortId.toUpperCase()}</h1>

                            <div className="mt-3 inline-grid gap-1 text-sm">
                                <div className="flex justify-end gap-3">
                                    <span className="text-neutral-500">Date</span>
                                    <span className="font-medium">{date}</span>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <span className="text-neutral-500">Commande</span>
                                    <span className="font-medium">#{shortId}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Separator */}
                    <div className="my-8 h-px bg-neutral-200" />

                    {/* Addresses */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Facturé à</p>
                            <div className="mt-2 text-sm">
                                <p className="font-semibold">{order.customer?.name ?? "—"}</p>
                                <p className="text-neutral-600">{order.customer?.companyName ?? "Particulier"}</p>
                                <p className="text-neutral-600 break-all">{order.customer?.email ?? "—"}</p>
                                <p className="text-neutral-600">{order.customer?.phone ?? "—"}</p>
                            </div>

                            <div className="mt-3 text-sm text-neutral-600 space-y-1">
                                <p>{order.customer?.addressLine1 ?? "—"}</p>
                                {order.customer?.addressLine2?.trim() ? <p>{order.customer.addressLine2}</p> : null}
                                <p>
                                    {(order.customer?.postalCode ?? "—") + " " + (order.customer?.city ?? "—")}
                                </p>
                                <p>{order.customer?.country ?? "—"}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Livré à</p>
                            <p className="mt-2 text-sm text-neutral-600">
                                Identique à l’adresse de facturation
                            </p>

                            <div className="mt-6 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600">
                                <p className="font-medium text-neutral-800">Informations</p>
                                <p className="mt-1">
                                    Merci pour votre commande. Cette facture est générée automatiquement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200">
                        <div className="grid grid-cols-12 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            <div className="col-span-6">Produit</div>
                            <div className="col-span-2 text-right">Prix unitaire</div>
                            <div className="col-span-2 text-right">Quantité</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        <div className="divide-y divide-neutral-200">
                            {order.items.map((it) => {
                                const name = it.product?.name ?? "Produit supprimé";
                                const sku = it.product?.sku ?? null;
                                const unit = formatEUR(it.unitPriceCents);
                                const line = formatEUR(it.unitPriceCents * it.quantity);

                                return (
                                    <div key={it.id} className="grid grid-cols-12 px-4 py-4 text-sm">
                                        <div className="col-span-6 min-w-0">
                                            <p className="font-semibold truncate">{name}</p>
                                            {sku ? <p className="mt-0.5 text-xs text-neutral-500 font-mono">{sku}</p> : null}
                                        </div>

                                        <div className="col-span-2 text-right tabular-nums">{unit}</div>
                                        <div className="col-span-2 text-right tabular-nums">{it.quantity}</div>
                                        <div className="col-span-2 text-right font-semibold tabular-nums">{line}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full max-w-md rounded-2xl border border-neutral-200 p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">Sous-total</span>
                                    <span className="tabular-nums">{formatEUR(sousTotalCents)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">Livraison</span>
                                    <span className="tabular-nums">{formatEUR(livraisonCents)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">TVA</span>
                                    <span className="tabular-nums">{formatEUR(tvaCents)}</span>
                                </div>

                                <div className="my-3 h-px bg-neutral-200" />

                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold">Total</span>
                                    <span className="text-base font-bold tabular-nums">{formatEUR(totalCents)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / mentions */}
                    <footer className="mt-10 space-y-2">
                        <div className="h-px bg-neutral-200" />
                        <div className="gap-6 text-xs text-neutral-500">
                            <p className="text-right">
                                Page 1/1
                                <br />
                                Généré le {formatDateFR(new Date())}
                            </p>
                        </div>
                    </footer>
                </div>
            </section>

            {/* Petit hint écran (pas imprimé) */}
            <div className="mx-auto mt-4 max-w-[900px] text-xs text-neutral-500 print:hidden">
                Astuce : dans la boîte d’impression, mets “Marges : Aucune” ou “Par défaut” et “Arrière-plans : Activés” pour un rendu encore plus propre.
            </div>
        </main>
    );
}

