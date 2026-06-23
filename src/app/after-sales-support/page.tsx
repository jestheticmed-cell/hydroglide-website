const supportTopics = [
  {
    title: "Product Setup",
    body: "Need help preparing your eFoil for the first ride? Our team can guide you through board assembly, battery handling, remote pairing, and safe pre-ride checks."
  },
  {
    title: "Warranty Assistance",
    body: "If you believe your product has a manufacturing issue, contact us with your order information, product photos, and a short description. We will review the case and provide next steps."
  },
  {
    title: "Parts & Maintenance",
    body: "We can help identify compatible replacement parts, maintenance intervals, cleaning recommendations, and storage guidance for long-term performance."
  },
  {
    title: "Shipping & Returns",
    body: "For delivery tracking, damaged parcels, return authorization, or exchange questions, our support team will help confirm the right process for your order."
  }
];

const processSteps = [
  "Email us with your order number, product model, and contact details.",
  "Attach clear photos or videos showing the issue when applicable.",
  "Our support team will review your request and reply with guidance within 24-48 hours.",
  "If service, replacement parts, or return authorization is required, we will confirm the next steps before you ship anything."
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3 text-base leading-7 text-charcoal">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AfterSalesSupportPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-10">
        <p className="text-sm font-normal uppercase tracking-[0.16em] text-graphite">Customer Service</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">After-Sales Support</h1>
        <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-graphite">
          Hydroglide support is here to keep your riding experience smooth, reliable, and confident long after your eFoil arrives.
        </p>

        <div className="mt-16 grid gap-5 text-left md:grid-cols-2">
          {supportTopics.map((topic) => (
            <article key={topic.title} className="border border-line bg-porcelain p-7">
              <h2 className="text-xl font-semibold text-ink">{topic.title}</h2>
              <p className="mt-5 text-base leading-7 text-graphite">{topic.body}</p>
            </article>
          ))}
        </div>

        <section className="mx-auto mt-20 max-w-3xl border-t border-line pt-10 text-left">
          <h2 className="text-2xl font-semibold text-ink">How to request support</h2>
          <BulletList items={processSteps} />
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-line bg-white p-8 text-left shadow-[0_18px_55px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-semibold text-ink">Contact Support</h2>
          <p className="mt-5 text-base leading-8 text-charcoal">
            Email: hydroglide@gmail.com
          </p>
          <p className="mt-2 text-base leading-8 text-charcoal">
            Please include your order email, product model, and a brief description of the issue so we can help faster.
          </p>
        </section>
      </section>
    </main>
  );
}
