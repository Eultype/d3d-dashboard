export function formatDateFR(d: Date) {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

export function formatDateTimeFR(d: Date) {
    const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d);
    const time = new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" }).format(d);
    return { date, time };
}
