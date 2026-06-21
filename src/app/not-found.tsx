import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-white px-5 py-24 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-graphite">Not found</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">This page is not available.</h1>
        <Link href="/" className="mt-8 inline-flex h-12 items-center justify-center border border-ink bg-ink px-6 text-sm font-semibold text-white">
          Back Home
        </Link>
      </div>
    </main>
  );
}
