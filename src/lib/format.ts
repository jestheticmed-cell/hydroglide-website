export function formatCents(priceCents: number, currency: "USD" = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(priceCents / 100);
}
