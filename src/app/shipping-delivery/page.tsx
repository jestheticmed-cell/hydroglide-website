const sections = [
  {
    title: "1. Processing Time",
    items: [
      "Standard Orders: Processed and dispatched within 1-8 business days.",
      "Custom Orders: Require 4 weeks for processing and shipping."
    ]
  },
  {
    title: "2. Shipping Methods",
    items: [
      "Standard Shipping (9 - 15 business days): Regular Express - $7.99 (for orders less than $59.00), free for orders over $59.00.",
      "Express Shipping (5 - 10 business days): DHL - $35.00 (for orders less than $300.00), free for orders over $300.00."
    ]
  },
  {
    title: "3. Customs & Duties",
    items: ["All prices include applicable customs duties and taxes. No additional fees are required at delivery."]
  },
  {
    title: "4. Delivery Tracking",
    items: ["A tracking number and estimated delivery date will be emailed once your order ships."]
  },
  {
    title: "5. Can I edit or change my order after purchasing?",
    items: [
      "We are unable to cancel or edit an order after it has been placed, as it will be sent to the manufacturing department within minutes of being placed. We cannot make adjustments to any items that are already in manufacturing."
    ]
  }
];

export default function ShippingDeliveryPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <p className="text-sm font-normal uppercase tracking-[0.16em] text-graphite">Customer Service</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">Shipping & Delivery Policy</h1>
        <p className="mt-6 text-lg leading-8 text-charcoal">We offer worldwide express shipping</p>

        <div className="mt-12 grid gap-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <ul className="mt-4 grid gap-3 text-base leading-7 text-charcoal">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
