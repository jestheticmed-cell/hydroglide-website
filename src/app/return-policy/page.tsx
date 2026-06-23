const returnSections = [
  {
    title: "1. Return & Exchange Eligibility",
    items: [
      "Timeframe: 30 days from the date of delivery.",
      "Condition: Items must be unused, unaltered, in original packaging with all tags and promotional gifts."
    ]
  },
  {
    title: "2. Return Process",
    items: [
      "Contact Customer Service within 30 days to request a return authorization (RA).",
      "Ship the item to the provided return address (do not use the parcel's original address).",
      "Use a trackable shipping method. Unauthorized returns will not be accepted."
    ]
  },
  {
    title: "3. Return Costs",
    items: [
      "Buyer's Responsibility: Return shipping fees (unless the return is due to our error).",
      "Deductions: Original shipping costs (non-refundable).",
      "Deductions: Value of missing promotional gifts."
    ]
  },
  {
    title: "4. Refunds",
    items: ["Processing Time: 7 business days after receiving the returned item.", "Refund Method: Original payment account."]
  },
  {
    title: "5. Exceptions (Free Returns)",
    items: [
      "Wrong item received.",
      "Defective/damaged items (report within 48 hours of delivery).",
      "Incorrect engraving.",
      "We cover return costs for these cases."
    ]
  },
  {
    title: "6. Order Cancellation",
    items: [
      "Before Production: Cancel within 2 hours of payment (no fee).",
      "After Production: Standard orders incur a 20% material fee.",
      "Shipped Orders: Cannot cancel; apply for return upon delivery."
    ]
  }
];

const instructionItems = [
  "Items returned without authorisation will not be accepted.",
  "The timeframe for returns and exchanges cannot exceed 30 days from receipt of the original order.",
  "All returned merchandise must be in its original condition with no scratches or signs of using.",
  "Please use local logistics when returning items. If we do not receive your parcel by courier, you are responsible for your own losses.",
  "When returning an item, all promotional giveaways received must be returned with the returned item. Otherwise, the retail price of the promotional giveaways will be deducted from the refund amount."
];

const cautionItems = [
  "The return address is not the address on your parcel, so please contact our customer service and get a return authorisation first.",
  "Returns and reshipments are at the buyer's expense.",
  "Although you may have taken advantage of free or low cost shipping, original shipping charges are non-refundable. In the case of free shipping orders, the appropriate postage cost will be deducted.",
  "Customs insurance is non-refundable once the item has been delivered and the order transaction has been completed, should there be any post-sale issues with the order."
];

const redeliveryItems = [
  "The customer has received the wrong item.",
  "The item is broken, defective or incorrectly engraved. For broken or defective items, the customer must contact our customer service within 48 hours of receiving the order."
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3 text-base leading-7 text-charcoal">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ReturnPolicyPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <p className="text-sm font-normal uppercase tracking-[0.16em] text-graphite">Customer Service</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">Standard Returns Policy</h1>

        <div className="mt-12 grid gap-10">
          {returnSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <BulletList items={section.items} />
            </section>
          ))}

          <section className="border-t border-line pt-10">
            <p className="text-base leading-8 text-charcoal">
              For your peace of mind when shopping on our site, we offer a 30-day return and exchange policy. You can enjoy a quick and easy return or exchange experience on our website! You can return or exchange an unused item in its original condition as long as you contact us within 30 days of the date of receipt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">Order Cancellation Policy</h2>
            <p className="mt-4 text-base leading-8 text-charcoal">
              All items will be in production 120 minutes after we receive payment. Therefore, orders cancelled after this time will incur a 20% material and processing fee. Generally, personalised, engraved and special orders cannot be cancelled once production has begun, so please check your personalisation information carefully before submitting your order. If you insist on cancelling a custom order, you will incur a 50% custom and material processing fee. If the order has already been shipped, cancellation will not be allowed, you can wait for the goods to arrive and apply for the return process, if you have any questions before placing your order, please feel free to contact our customer service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">Return and Exchange Instructions</h2>
            <BulletList items={instructionItems} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">Caution</h2>
            <BulletList items={cautionItems} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">Redelivery Cases</h2>
            <p className="mt-4 text-base leading-8 text-charcoal">We will arrange for a new product to be re-delivered in the following circumstances:</p>
            <BulletList items={redeliveryItems} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink">Refunds</h2>
            <p className="mt-4 text-base leading-8 text-charcoal">
              Refunds and exchanges will be processed within 7 working days once the returned parcel has been received. The refund will be issued to your original payment account.
            </p>
            <p className="mt-4 text-base leading-8 text-charcoal">
              Please note: Pre-discounted standard shipping rates will apply and are non-refundable. Although you may have benefited from free or low cost shipping, we do incur original shipping costs for each order. Therefore, we do not refund original shipping costs.
            </p>
          </section>

          <section className="border-t border-line pt-10">
            <h2 className="text-xl font-semibold text-ink">Return Contact</h2>
            <div className="mt-4 grid gap-2 text-base leading-7 text-charcoal">
              <p>Email: hydroglide@gmail.com</p>
              <p>Phone Number: +86</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
