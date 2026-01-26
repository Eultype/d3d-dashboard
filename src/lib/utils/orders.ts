export function orderTotalCents(items: { quantity: number; unitPriceCents: number }[]) {
    return items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
}

export function calculateOrderTotal(
    items: { quantity: number; unitPriceCents: number }[],
    shippingCostCents: number,
    discountType?: string | null,
    discountValue?: number | null
): { totalCents: number; discountAmountCents: number; subTotalCents: number } {
    const subTotalCents = orderTotalCents(items);
    let discountAmountCents = 0;

    if (discountType === "percent" && discountValue) {
        discountAmountCents = Math.round(subTotalCents * (discountValue / 100));
    } else if (discountType === "amount" && discountValue) {
        discountAmountCents = Math.round(discountValue);
    }

    const totalCents = Math.max(0, subTotalCents - discountAmountCents) + shippingCostCents;

    return { totalCents, discountAmountCents, subTotalCents };
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