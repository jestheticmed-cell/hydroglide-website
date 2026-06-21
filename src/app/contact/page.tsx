import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto min-h-[calc(100vh-88px)] max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h1 className="text-5xl font-normal tracking-[0.04em] text-ink sm:text-6xl">CONTACT US</h1>
        <p className="mt-8 text-xl leading-8 text-graphite">Use the form below for inquiries about Lift Foils and our products.</p>
        <p className="mx-auto mt-10 max-w-4xl text-xl leading-9 text-graphite">
          Send us your request and our team will get back to you within 24 hours.
        </p>

        <ContactForm />
      </section>
    </main>
  );
}
