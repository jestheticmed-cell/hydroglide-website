import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AccountPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { email } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 sm:px-10 lg:px-[140px]">
      <div className="flex items-start justify-between">
        <Link href="/" className="relative block h-24 w-24 overflow-hidden bg-transparent" aria-label="Hydroglide home">
          <Image src="/brand/hydroglide-login-logo.jpg" alt="Hydroglide logo" fill sizes="96px" className="object-contain" priority />
        </Link>
        <Link href="/login" aria-label="Account" className="mt-3 text-graphite transition hover:text-[#078b8b]">
          <CircleUserRound className="h-9 w-9" aria-hidden="true" />
        </Link>
      </div>

      <section className="mt-16 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-20">
        <aside className="text-[28px] font-semibold leading-tight text-ink">
          <Link href="/account" className="block transition hover:text-[#078b8b]">
            Orders
          </Link>
          <Link href="/account" className="mt-3 block text-graphite transition hover:text-[#078b8b]">
            Profile
          </Link>
        </aside>

        <div className="max-w-5xl rounded-2xl border border-line bg-white px-8 py-10 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:px-12 lg:min-h-[440px]">
          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-[30px] font-semibold leading-tight text-ink">Welcome</h1>
              <p className="mt-1 text-[30px] font-semibold leading-tight text-graphite">Ready to shop?</p>
              {email ? <p className="mt-4 text-sm text-graphite">{email}</p> : null}
            </div>
            <Link href="/" className="rounded-xl bg-[#41b8ae] px-6 py-4 text-[20px] font-semibold text-white transition hover:bg-[#36a9a0]">
              Shop now
            </Link>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative h-32 w-44 sm:h-40 sm:w-56">
              <Image src="/products/lift-5f-cruiser/blue-iso-small.webp" alt="Hydroglide eFoil" fill sizes="224px" className="object-contain" priority />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
