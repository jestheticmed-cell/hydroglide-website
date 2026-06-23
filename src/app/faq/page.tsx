const faqs = [
  {
    question: "What forms of payment do you accept?",
    answer: "We accept all major credit cards, debit cards and wire transfers."
  },
  {
    question: "How can I check the status of my order?",
    answer: "You can email us anytime at hydroglide@gmail.com, but we'll e-mail you directly with scheduling updates."
  },
  {
    question: "Where do you ship?",
    answer: "We ship worldwide with very few exceptions. Please contact us for any questions."
  },
  {
    question: "What do I do if I receive a damaged product?",
    answer: "Product damaged during transit will be replaced at no cost to you. Product damaged during normal use may be returned and repaired for a fee, after evaluation by us."
  }
];

export default function FAQPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <p className="text-sm font-normal uppercase tracking-[0.16em] text-graphite">Customer Service</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">FAQ</h1>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <section key={faq.question} className="py-8">
              <h2 className="text-xl font-semibold leading-7 text-ink">{faq.question}</h2>
              <p className="mt-4 text-base leading-8 text-charcoal">{faq.answer}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
