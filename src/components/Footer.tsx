"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif]";
  const customerLinks = [
    { href: "/contact", label: "Contact Us" },
    { href: "/after-sales-support", label: "After-Sales Support" },
    { href: "/shipping-delivery", label: "Shipping Guide" },
    { href: "/faq", label: "FAQ" },
    { href: "/#manuals", label: "Product Manuals" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/return-policy", label: "Return Policy" }
  ];
  const productLinks: Array<{ href?: string; label: string }> = [
    { href: "/#efoils", label: "Hydro Therapy&Sport" },
    { href: "/#best-sellers", label: "Best Sellers" },
    { label: "New Arrivals" }
  ];

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setSubscribed(false);
      setError("Enter an email");
      return;
    }

    setError("");
    setSubscribed(true);
  }

  return (
    <footer className={`border-t border-line bg-white text-ink ${footerTypeClass}`}>
      <div className="relative grid gap-12 px-12 py-12 sm:px-20 lg:min-h-[360px] lg:grid-cols-[560px_1fr] lg:px-[120px] lg:py-14 xl:block xl:px-0">
        <div className="max-w-xl xl:ml-[120px]">
          <h2 className="text-[28px] font-normal leading-tight text-ink sm:text-[34px]">
            Get product updates and ride notes.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] font-normal leading-6 text-graphite">
            Leave your email for launch news, product guidance, and refined outdoor travel inspiration.
          </p>

          <form className="mt-7 max-w-lg" onSubmit={handleSubscribe} noValidate>
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <div className={`flex h-[62px] overflow-hidden rounded-full border bg-[#474545] transition ${error ? "border-red-500" : "border-[#2f2d2d]"}`}>
              <input
                id="footer-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Email address"
                className="h-full min-w-0 flex-1 bg-transparent px-7 text-[18px] font-normal text-white outline-none placeholder:text-white"
              />
              <button
                type="submit"
                className="h-full px-8 text-[18px] font-normal text-white transition hover:text-white/80 focus:outline-none"
              >
                Sign up
              </button>
            </div>
            {error ? <p className="mt-2 text-[15px] leading-5 text-red-600">{error}</p> : null}
            {subscribed ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[16px] leading-6 text-ink">
                <CheckCircle className="h-5 w-5 text-[#4a9b57]" aria-hidden="true" />
                Thanks for subscribing
              </p>
            ) : null}
          </form>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:gap-12 xl:absolute xl:left-[1080px] xl:top-10 xl:w-[560px]">
          <div>
            <h2 className="text-[21px] font-normal text-ink">Customer Service</h2>
            <nav className="mt-5 grid gap-3 text-[15px] font-normal text-graphite" aria-label="Customer service">
              {customerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="w-fit transition hover:text-blue-600">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div id="accessories">
            <h2 className="text-[21px] font-normal text-ink">Product Quick Links</h2>
            <nav className="mt-5 grid gap-3 text-[15px] font-normal text-graphite" aria-label="Product quick links">
              {productLinks.map((link) => (
                link.href ? (
                  <Link key={link.label} href={link.href} className="w-fit transition hover:text-blue-600">
                    {link.label}
                  </Link>
                ) : (
                  <span key={link.label} className="w-fit">{link.label}</span>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-12 py-5 text-[14px] font-normal text-graphite sm:px-20 lg:px-[120px]">
        <span>Hydroglide</span>
        <span>Premium outdoor hydrofoil systems</span>
      </div>
    </footer>
  );
}
