import Image from "next/image";
import Link from "next/link";
import { AuthCallbackClient } from "@/components/AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f7] px-5">
      <div className="grid justify-items-center gap-8">
        <Link href="/" className="relative block h-24 w-24 overflow-hidden bg-white" aria-label="Hydroglide home">
          <Image src="/brand/hydroglide-login-logo.jpg" alt="Hydroglide logo" fill sizes="96px" className="object-contain" priority />
        </Link>
        <AuthCallbackClient />
      </div>
    </main>
  );
}
