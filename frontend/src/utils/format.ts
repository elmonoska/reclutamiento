export function formatCurrency(amount: number | null | undefined) {
    if (amount == null) return null;
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
}

export function formatDateTime(dateString: string) {
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
}

export function formatSalaryRange(min: number | null | undefined, max: number | null | undefined) {
    const minLabel = formatCurrency(min);
    const maxLabel = formatCurrency(max);
    if (minLabel && maxLabel) return `${minLabel} - ${maxLabel}`;
    if (minLabel) return `Desde ${minLabel}`;
    if (maxLabel) return `Hasta ${maxLabel}`;
    return "Sueldo a convenir";
}
