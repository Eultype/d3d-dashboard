export function orderTotalCents(items: { quantity: number; unitPriceCents: number }[]) {
    return items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
}

export function statusLabelFR(status: string) {
    switch (status) {
        case "A_VERIFIER":
            return "Confirmation";
        case "PROD":
            return "En traitement";
        case "TERMINE":
            return "Livrée";
        default:
            return status;
    }
}
