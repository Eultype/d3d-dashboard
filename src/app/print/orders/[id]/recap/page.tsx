import { prisma } from "@/lib/services/prisma";
import { notFound, redirect } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { formatEUR } from "@/lib/utils/money";
import { calculateOrderTotal } from "@/lib/utils/orders";
import { formatDateFR } from "@/lib/utils/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrintRecap } from "@/app/print/_components/PrintRecap";


export default async function RecapPage({ params }: { params: Promise<{ id?: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin");
    }

    const { id } = await params;
    if (!id) return notFound();

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            items: { include: { product: true }, orderBy: { createdAt: "asc" } },
            files: true,
            notes: { include: { user: true }, orderBy: { createdAt: 'desc' } },
        },
    });

    if (!order) return notFound();

    const date = formatDateFR(new Date(order.createdAt));

    const { totalCents, discountAmountCents, subTotalCents: sousTotalCents } = calculateOrderTotal(
        order.items,
        order.shippingCostCents || 0,
        order.discountType,
        order.discountValue
    );
    const livraisonCents = order.shippingCostCents || 0;
    
    const taxRate = order.taxRate || 21;
    const tvaCents = totalCents - (totalCents / (1 + taxRate / 100));

    // Logique pour le texte de livraison
    let deliveryText = "Livraison";
    if (order.shippingType === 'Retrait Atelier') {
        deliveryText = "Retrait à l'atelier";
    } else {
        const country = order.customer?.country?.trim().toLowerCase();
        if (country === 'belgique' || country === 'belgium') {
            deliveryText = "Livraison Belgique";
        } else {
            deliveryText = "Livraison hors Belgique";
        }
    }

    // Logic for photo (first image file)
    const photoUrl = order.files.find(f => f.type.startsWith('image/'))?.url;

    return (
        <main className="min-h-screen p-0 sm:p-6 bg-neutral-50 print:bg-white print:p-0">
            {/* Action Bar (Screen only) */}
            <div className="max-w-[900px] mx-auto mb-4 p-4 flex justify-between items-center print:hidden bg-white sm:rounded-xl border shadow-sm mt-4">
                <Link href={`/dashboard/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                    ← Retour à la commande
                </Link>
                <PrintRecap />
            </div>

            {/* Feuille A4 */}
            <section
                className={[
                    "mx-auto w-full bg-white text-black shadow-sm sm:ring-1 sm:ring-black/5",
                    "max-w-[900px]",
                    "print:shadow-none print:ring-0 print:max-w-none",
                    "sm:rounded-2xl print:rounded-none",
                ].join(" ")}
            >
                {/* Marges internes */}
                <div className="p-6 sm:p-8 print:p-8">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        <div className="space-y-4 w-full sm:w-auto">
                           {/* Photo instead of Company Details */}
                           {photoUrl ? (
                                <div className="relative w-48 h-40 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
                                    <Image
                                        src={photoUrl}
                                        alt="Photo de commande"
                                        fill={true}
                                        style={{ objectFit: 'contain' }}
                                        className="rounded-xl"
                                    />
                                </div>
                           ) : (
                               <div className="w-48 h-40 rounded-xl border border-neutral-100 bg-neutral-50 flex items-center justify-center text-neutral-400 text-sm italic">
                                   Aucune photo jointe
                               </div>
                           )}
                        </div>

                        <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                            <p className="text-xs uppercase tracking-widest font-bold text-neutral-400">Récapitulatif</p>
                            <h1 className="mt-1 text-3xl font-black text-slate-900">{order.reference}</h1>

                            <div className="mt-4 grid gap-2 text-sm">
                                <div className="flex justify-between sm:justify-end gap-6">
                                    <span className="text-neutral-500">Date d'émission</span>
                                    <span className="font-semibold text-slate-900">{date}</span>
                                </div>
                                <div className="flex justify-between sm:justify-end gap-6">
                                    <span className="text-neutral-500">Référence commande</span>
                                    <span className="font-semibold text-slate-900">{order.reference}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Separator */}
                    <div className="my-6 h-px bg-neutral-100" />

                    {/* Addresses */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="rounded-2xl bg-neutral-50/50 border border-neutral-100 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Destinataire</p>
                            <div className="text-sm space-y-0.5">
                                <p className="font-bold text-base text-slate-900">{order.customer?.name ?? "—"}</p>
                                <p className="text-slate-600 font-medium">{order.customer?.companyName ?? "Particulier"}</p>
                                <p className="text-neutral-500 break-all">{order.customer?.email ?? "—"}</p>
                            </div>

                            <div className="mt-2 text-sm text-slate-600 space-y-0.5 pt-2 border-t border-neutral-200/50">
                                <p className="font-medium text-slate-800">{order.customer?.addressLine1 ?? "—"}</p>
                                {order.customer?.addressLine2?.trim() ? <p>{order.customer.addressLine2}</p> : null}
                                <p>
                                    {(order.customer?.postalCode ?? "—") + " " + (order.customer?.city ?? "—")}
                                </p>
                                <p className="font-medium">{order.customer?.country ?? "—"}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-100 p-4 flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Livraison</p>
                                <p className="text-base font-bold text-slate-900">
                                    {deliveryText}
                                </p>
                                {order.shippingType !== 'Retrait Atelier' && (
                                    <p className="text-sm text-slate-500 italic mt-1">
                                        Identique à l’adresse de facturation
                                    </p>
                                )}
                            </div>
                            
                            {/* Note section removed */}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
                        {/* Table Header (Hidden on mobile) */}
                        <div className="hidden sm:grid grid-cols-12 bg-neutral-50 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b">
                            <div className="col-span-6">Désignation du produit</div>
                            <div className="col-span-2 text-right">P.U. TTC</div>
                            <div className="col-span-2 text-right">Qté</div>
                            <div className="col-span-2 text-right">Total TTC</div>
                        </div>

                        <div className="divide-y divide-neutral-100">
                            {order.items.map((it) => {
                                const name = it.product?.name ?? "Produit supprimé";
                                const sku = it.product?.sku ?? null;
                                const unit = formatEUR(it.unitPriceCents);
                                const line = formatEUR(it.unitPriceCents * it.quantity);
                                
                                // Calcul pour l'affichage détaillé
                                const hasCustomText = !!it.customText;
                                const basePrice = it.product?.priceCents ?? 0;
                                const isPriceIncreased = it.unitPriceCents > basePrice;

                                return (
                                    <div key={it.id} className="flex flex-col sm:grid sm:grid-cols-12 px-6 py-2 text-sm hover:bg-neutral-50/50 transition-colors">
                                        {/* Mobile view: Product name and total on same line */}
                                        <div className="flex justify-between items-start sm:col-span-6 min-w-0 mb-2 sm:mb-0">
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate">{name}</p>
                                                {sku ? <p className="mt-0.5 text-[10px] text-neutral-400 font-mono font-medium tracking-tighter uppercase">{sku}</p> : null}
                                                
                                                {/* Affichage du texte personnalisé et du détail prix */}
                                                {hasCustomText ? (
                                                    <div className="mt-0.5">
                                                        <p className="text-[14px] text-blue-600 font-medium italic">
                                                            Texte personnalisé : "{it.customText}" {isPriceIncreased ? "(+ 10,00 €)" : ""}
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="sm:hidden font-bold text-slate-900 tabular-nums">{line}</div>
                                        </div>

                                        {/* Desktop and Mobile: Price and Quantity */}
                                        <div className="flex sm:block justify-between items-center sm:col-span-2 text-neutral-500 sm:text-right tabular-nums text-xs sm:text-sm">
                                            <span className="sm:hidden">Prix unitaire</span>
                                            {unit}
                                        </div>
                                        <div className="flex sm:block justify-between items-center sm:col-span-2 text-neutral-500 sm:text-right tabular-nums text-xs sm:text-sm">
                                            <span className="sm:hidden">Quantité</span>
                                            x{it.quantity}
                                        </div>
                                        <div className="hidden sm:block sm:col-span-2 text-right font-bold text-slate-900 tabular-nums">{line}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes & Totals */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
                        {/* Notes */}
                        <div className="flex-1 w-full">
                            <div className="rounded-2xl border border-neutral-100 p-4 bg-neutral-50/50 h-full">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Notes</p>
                                {order.notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {order.notes.map((note) => (
                                            <div key={note.id} className="text-sm border-l-2 border-neutral-200 pl-3">
                                                <p className="whitespace-pre-wrap text-slate-600 italic">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-400 italic">Aucune note.</p>
                                )}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="w-full sm:max-w-sm shrink-0">
                            <div className="rounded-2xl bg-slate-50 border border-neutral-100 p-4">
                                <div className="space-y-2 text-sm">
                                    {/* Calculs des bases HT pour la clarté */}
                                    {(() => {
                                        const ratio = 1 + taxRate / 100;
                                        const sousTotalHT = sousTotalCents / ratio;
                                        const remiseHT = discountAmountCents / ratio;
                                        const livraisonHT = livraisonCents / ratio;

                                        return (
                                            <>
                                                <div className="flex items-center justify-between text-neutral-500">
                                                    <span>Sous-total HT</span>
                                                    <span className="tabular-nums font-medium">{formatEUR(Math.round(sousTotalHT))}</span>
                                                </div>
                                                
                                                {discountAmountCents > 0 && (
                                                    <div className="flex items-center justify-between text-green-600 font-medium">
                                                        <span>Remise HT</span>
                                                        <span className="tabular-nums">-{formatEUR(Math.round(remiseHT))}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-neutral-500">
                                                    <span>Livraison HT</span>
                                                    <span className="tabular-nums font-medium">{formatEUR(Math.round(livraisonHT))}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-neutral-500">
                                                    <span>TVA ({taxRate}%)</span>
                                                    <span className="tabular-nums font-medium">{formatEUR(Math.round(tvaCents))}</span>
                                                </div>

                                                <div className="my-3 h-px bg-neutral-200" />

                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-slate-900">Total TTC</span>
                                                    <span className="text-2xl font-black text-slate-900 tabular-nums">{formatEUR(totalCents)}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / mentions */}
                    <footer className="mt-8 space-y-4">
                        <div className="h-px bg-neutral-100" />
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
                            <p>IMMOGER S.A. • BE0442.502.023</p>
                            <p className="sm:text-right">
                                Page 1 / 1 • Généré le {formatDateFR(new Date())}
                            </p>
                        </div>
                    </footer>
                </div>
            </section>

            {/* Print Tips (Screen only) */}
            <div className="max-w-[900px] mx-auto mt-8 mb-12 px-6 py-4 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-600 flex items-start gap-3 print:hidden">
                <div className="mt-0.5 bg-blue-600 text-white rounded-full p-1 shrink-0">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p>
                    <span className="font-bold uppercase mr-1">Astuce d'impression :</span>
                    Pour un rendu professionnel, activez l'option <span className="font-bold italic">"Graphismes d'arrière-plan"</span> dans les paramètres de votre navigateur et réglez les marges sur <span className="font-bold italic">"Aucune"</span>.
                </p>
            </div>
        </main>
    );
}