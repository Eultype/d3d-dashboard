export function orderTotalCents(items: { quantity: number; unitPriceCents: number }[]) {
    return items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
}

export function statusLabelFR(status: string) {
    switch (status) {
        case "A_VERIFIER":
            return "À confirmer";
        case "PROD":
            return "En production";
        case "A_EXPEDIER":
            return "Expédition";
        case "TERMINE":
            return "Livrée";
        default:
            return status;
    }
}
