import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginPanel } from "@/components/LoginPanel";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] px-5 sm:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col items-center">
        <Link href="/" className="relative mt-8 block h-24 w-24 overflow-hidden bg-white sm:mt-12 sm:h-28 sm:w-28" aria-label="Hydroglide home">
          <Image src="/brand/hydroglide-login-logo.jpg" alt="Hydroglide logo" fill sizes="(min-width: 640px) 112px, 96px" className="object-contain" priority />
        </Link>

        <section className="mt-20 w-full max-w-[390px] sm:mt-[38vh] sm:-translate-y-1/2">
          <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[30px]">Sign in</h1>
          <p className="mt-2 text-[17px] text-graphite sm:mt-3 sm:text-[19px]">Sign in or create an account</p>
          <div className="mt-6 sm:mt-7">
            <Suspense fallback={null}>
              <LoginPanel />
            </Suspense>
          </div>
        </section>

        <Link href="/privacy" className="mb-6 mt-auto pt-10 text-[16px] text-[#20aaa3] transition hover:text-[#078b8b] sm:text-[18px]">
          Privacy policy
        </Link>
      </div>
    </main>
  );
}
