export function formatEUR(cents: number) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format((cents ?? 0) / 100);
}
