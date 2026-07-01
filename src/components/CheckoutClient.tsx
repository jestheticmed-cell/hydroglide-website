"use client";

import { ChevronDown, ChevronLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { formatCents } from "@/lib/format";
import { useCart } from "./CartProvider";

const requiredFields = [
  { name: "email", message: "Enter an email" },
  { name: "firstName", message: "Enter a first name" },
  { name: "lastName", message: "Enter a last name" },
  { name: "address", message: "Enter an address" },
  { name: "city", message: "Enter a city" },
  { name: "state", message: "Select a state / province" },
  { name: "zip", message: "Enter a ZIP / postal code" },
  { name: "phone", message: "Enter a phone number" }
] as const;

type RequiredFieldName = (typeof requiredFields)[number]["name"];
type CheckoutErrors = Partial<Record<RequiredFieldName, string>>;
type CountryOption = { isoCode: string; name: string };
type StateOption = { isoCode: string; name: string };
type CityOption = { name: string };
const manualOptionValue = "__manual__";

export function CheckoutClient() {
  const { items, subtotalCents, openCart } = useCart();
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [countryCode, setCountryCode] = useState("US");
  const [manualCountry, setManualCountry] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [manualCity, setManualCity] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const response = await fetch("/api/locations", { signal: controller.signal });
        const result = (await response.json()) as { countries?: CountryOption[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Unable to load countries");
        setCountries(result.countries ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLocationError(error instanceof Error ? error.message : "Unable to load countries");
      } finally {
        if (!controller.signal.aborted) setLoadingCountries(false);
      }
    }

    void loadCountries();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (countryCode === manualOptionValue) {
      setLoadingRegions(false);
      setLoadingCities(false);
      setStateCode("");
      setCity("");
      setManualCity(false);
      setStates([]);
      setCities([]);
      setErrors((current) => ({ ...current, state: undefined, city: undefined }));
      setLocationError("");
      return;
    }

    const controller = new AbortController();

    async function loadRegions() {
      setLoadingRegions(true);
      setStateCode("");
      setCity("");
      setManualCity(false);
      setStates([]);
      setCities([]);
      setErrors((current) => ({ ...current, state: undefined, city: undefined }));
      setLocationError("");

      try {
        const response = await fetch(`/api/locations?country=${encodeURIComponent(countryCode)}`, { signal: controller.signal });
        const result = (await response.json()) as { states?: StateOption[]; cities?: CityOption[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Unable to load regions");
        setStates(result.states ?? []);
        setCities(result.cities ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLocationError(error instanceof Error ? error.message : "Unable to load regions");
      } finally {
        if (!controller.signal.aborted) setLoadingRegions(false);
      }
    }

    void loadRegions();
    return () => controller.abort();
  }, [countryCode]);

  useEffect(() => {
    if (!stateCode || countryCode === manualOptionValue) {
      setLoadingCities(false);
      return;
    }
    const controller = new AbortController();

    async function loadCities() {
      setLoadingCities(true);
      setCity("");
      setManualCity(false);
      setCities([]);
      setErrors((current) => ({ ...current, city: undefined }));
      setLocationError("");

      try {
        const response = await fetch(
          `/api/locations?country=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(stateCode)}`,
          { signal: controller.signal }
        );
        const result = (await response.json()) as { cities?: CityOption[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Unable to load cities");
        setCities(result.cities ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLocationError(error instanceof Error ? error.message : "Unable to load cities");
      } finally {
        if (!controller.signal.aborted) setLoadingCities(false);
      }
    }

    void loadCities();
    return () => controller.abort();
  }, [countryCode, stateCode]);

  const inputClass = (field: RequiredFieldName) =>
    `h-14 rounded-lg border bg-white px-4 text-base outline-none focus:border-[#41b8ae] ${
      errors[field] ? "border-[#d83b0d]" : "border-line"
    }`;

  const renderError = (field: RequiredFieldName) => (errors[field] ? <p className="mt-2 text-[15px] leading-5 text-[#d83b0d]">{errors[field]}</p> : null);

  function handlePayNow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextErrors = requiredFields.reduce<CheckoutErrors>((acc, field) => {
      if (field.name === "state" && states.length === 0) return acc;
      const value = String(formData.get(field.name) ?? "").trim();
      if (!value) {
        acc[field.name] = field.message;
      }
      return acc;
    }, {});

    setErrors(nextErrors);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.58fr_0.42fr]">
        <form onSubmit={handlePayNow} noValidate className="bg-white px-5 py-10 sm:px-10 lg:min-h-screen lg:px-16 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <Link href="/" className="block text-3xl font-semibold text-ink">
              AeroLift
            </Link>

            <nav className="mt-10 flex flex-wrap items-center gap-3 text-sm text-graphite" aria-label="Checkout steps">
              <Link href="/" className="text-[#41b8ae]">
                Cart
              </Link>
              <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
              <span className="font-semibold text-ink">Information</span>
              <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
              <span>Shipping</span>
              <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
              <span>Payment</span>
            </nav>

            <div className="mt-10">
              <p className="text-center text-lg text-graphite">Express checkout</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button type="button" className="h-14 rounded-lg bg-[#5632f5] text-lg font-semibold text-white">
                  shop
                </button>
                <button type="button" className="h-14 rounded-lg bg-[#ffc439] text-lg font-semibold text-[#123984]">
                  PayPal
                </button>
                <button type="button" className="h-14 rounded-lg bg-black text-lg font-semibold text-white">
                  G Pay
                </button>
              </div>
            </div>

            <div className="my-10 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-graphite">
              <span className="h-px bg-line" />
              <span>OR</span>
              <span className="h-px bg-line" />
            </div>

            <section>
              <div className="flex items-center justify-between gap-6">
                <h1 className="text-3xl font-semibold text-ink">Contact</h1>
                <Link href="/account" className="text-sm text-[#41b8ae] underline">
                  Sign in
                </Link>
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className={`mt-5 h-14 w-full rounded-lg border bg-white px-4 text-base outline-none focus:border-[#41b8ae] ${
                  errors.email ? "border-[#d83b0d]" : "border-[#41b8ae]"
                }`}
              />
              {renderError("email")}
              <label className="mt-4 flex items-center gap-3 text-base text-ink">
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#41b8ae]" />
                Email me with news and offers
              </label>
            </section>

            <section className="mt-10">
              <h2 className="text-3xl font-semibold text-ink">Shipping address</h2>
              <div className="mt-5 grid gap-4">
                <label className="relative block">
                  <span className="absolute left-4 top-2 text-xs text-graphite">Country/Region</span>
                  <select
                    name={countryCode === manualOptionValue ? undefined : "country"}
                    value={countryCode}
                    disabled={loadingCountries}
                    onChange={(event) => {
                      setStateCode("");
                      setCities([]);
                      setManualCity(false);
                      setCountryCode(event.target.value);
                    }}
                    className="h-16 w-full appearance-none rounded-lg border border-line bg-white px-4 pt-5 text-base text-ink outline-none disabled:cursor-wait disabled:text-graphite"
                  >
                    {loadingCountries ? <option value="US">Loading countries...</option> : null}
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                    ))}
                    <option value={manualOptionValue}>Other / Enter manually</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" aria-hidden="true" />
                </label>
                {countryCode === manualOptionValue ? (
                  <input
                    name="country"
                    value={manualCountry}
                    onChange={(event) => setManualCountry(event.target.value)}
                    placeholder="Enter country / region"
                    className="h-14 rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-[#41b8ae]"
                  />
                ) : null}
                {locationError ? <p className="text-[15px] leading-5 text-[#d83b0d]">{locationError}. You can still enter the address manually.</p> : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input name="firstName" placeholder="First name" className={inputClass("firstName")} />
                    {renderError("firstName")}
                  </div>
                  <div>
                    <input name="lastName" placeholder="Last name" className={inputClass("lastName")} />
                    {renderError("lastName")}
                  </div>
                </div>
                <label className="relative block">
                  <input name="address" placeholder="Address" className={`${inputClass("address")} w-full pr-12`} />
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" aria-hidden="true" />
                  {renderError("address")}
                </label>
                <input placeholder="Apartment, suite, etc. (optional)" className="h-14 rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-[#41b8ae]" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    {loadingRegions || loadingCities || (states.length > 0 && !stateCode) || cities.length > 0 ? (
                      <select
                        name={manualCity ? undefined : "city"}
                        value={manualCity ? manualOptionValue : city}
                        disabled={loadingRegions || loadingCities || (states.length > 0 && !stateCode)}
                        onChange={(event) => {
                          if (event.target.value === manualOptionValue) {
                            setManualCity(true);
                            setCity("");
                            return;
                          }
                          setManualCity(false);
                          setCity(event.target.value);
                        }}
                        className={`h-14 w-full rounded-lg border bg-white px-4 text-base text-graphite outline-none focus:border-[#41b8ae] disabled:cursor-wait ${
                          errors.city ? "border-[#d83b0d]" : "border-line"
                        }`}
                      >
                        <option value="">
                          {loadingRegions
                            ? "Loading regions..."
                            : loadingCities
                              ? "Loading cities..."
                              : states.length > 0 && !stateCode
                                ? "Select state first"
                                : "City"}
                        </option>
                        {cities.map((cityOption, index) => (
                          <option key={`${cityOption.name}-${index}`} value={cityOption.name}>{cityOption.name}</option>
                        ))}
                        {cities.length > 0 ? <option value={manualOptionValue}>Other / Enter manually</option> : null}
                      </select>
                    ) : (
                      <input name="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className={inputClass("city")} />
                    )}
                    {manualCity ? (
                      <input
                        name="city"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Enter city"
                        className={`mt-3 w-full ${inputClass("city")}`}
                      />
                    ) : null}
                    {renderError("city")}
                  </div>
                  <div>
                    {states.length > 0 || loadingRegions ? (
                      <select
                        name="state"
                        value={stateCode}
                        disabled={loadingRegions}
                        onChange={(event) => setStateCode(event.target.value)}
                        className={`h-14 w-full rounded-lg border bg-white px-4 text-base text-graphite outline-none focus:border-[#41b8ae] disabled:cursor-wait ${
                          errors.state ? "border-[#d83b0d]" : "border-line"
                        }`}
                      >
                        <option value="">{loadingRegions ? "Loading regions..." : "State / Province"}</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input name="state" placeholder="State / Province (optional)" className="h-14 w-full rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-[#41b8ae]" />
                    )}
                    {renderError("state")}
                  </div>
                  <div>
                    <input name="zip" placeholder="ZIP code" className={inputClass("zip")} />
                    {renderError("zip")}
                  </div>
                </div>
                <div>
                  <input name="phone" placeholder="Phone" className={`w-full ${inputClass("phone")}`} />
                  {renderError("phone")}
                </div>
              </div>
            </section>

            <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={openCart} className="inline-flex items-center gap-2 text-[#41b8ae]">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                Return to cart
              </button>
              <button type="submit" className="h-14 rounded-lg bg-[#41b8ae] px-8 text-base font-semibold text-white hover:bg-[#35a89f]">
                Pay now
              </button>
            </div>
          </div>
        </form>

        <aside className="border-l border-line bg-[#f3f3f3] px-5 py-10 sm:px-10 lg:min-h-screen lg:px-12 lg:py-14">
          <div className="mx-auto max-w-xl">
            <div className="grid max-h-[440px] gap-5 overflow-y-auto pr-2">
              {items.length === 0 ? (
                <p className="text-base text-graphite">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <article key={`${item.productId}-${item.color ?? "default"}`} className="grid grid-cols-[78px_1fr_auto] gap-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-white">
                      <Image src={item.image} alt={item.productName} fill sizes="78px" className="object-cover" />
                      <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1 text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-ink">{item.productName}</h3>
                      {item.color ? <p className="mt-1 text-sm text-graphite">{item.color}</p> : null}
                    </div>
                    <p className="text-base font-semibold text-ink">{formatCents(item.priceCents * item.quantity, item.currency)}</p>
                  </article>
                ))
              )}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <div className="grid grid-cols-[1fr_96px] gap-4">
                <input placeholder="Discount code" className="h-14 rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-[#41b8ae]" />
                <button type="button" className="h-14 rounded-lg border border-line bg-white text-base font-semibold text-graphite hover:text-[#41b8ae]">
                  Apply
                </button>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_96px] gap-4">
                <input placeholder="Have an instructor code?" className="h-14 rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-[#41b8ae]" />
                <button type="button" className="h-14 rounded-lg border border-line bg-white text-base font-semibold text-[#41b8ae]">
                  Apply
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-line pt-6 text-base">
              <div className="flex justify-between">
                <span>Subtotal · {items.length} items</span>
                <span>{formatCents(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-graphite">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex items-end justify-between pt-2 text-2xl font-semibold text-ink">
                <span>Total</span>
                <span>
                  <span className="mr-2 text-sm font-normal text-graphite">USD</span>
                  {formatCents(subtotalCents)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
