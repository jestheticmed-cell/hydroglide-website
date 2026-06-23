const values = [
  {
    title: "Effortless Flight",
    body: "We design electric hydrofoil experiences that make quiet lift, smooth control, and confident cruising feel natural from the first ride."
  },
  {
    title: "Built for Water Time",
    body: "Every board, foil, and component is selected around reliability, range, and the simple pleasure of spending more time above the water."
  },
  {
    title: "Refined Outdoor Technology",
    body: "Hydroglide blends clean engineering with a minimalist visual language, creating equipment that feels precise, capable, and easy to live with."
  }
];

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto min-h-[calc(100vh-88px)] max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h1 className="text-5xl font-normal tracking-[0.04em] text-ink sm:text-6xl">ABOUT US</h1>
        <p className="mt-8 text-xl leading-8 text-graphite">Hydroglide creates premium eFoil systems for riders who want quiet power, elegant control, and a closer connection to open water.</p>
        <p className="mx-auto mt-10 max-w-4xl text-xl leading-9 text-graphite">
          Born from a love of clean design and modern water sport, our mission is to make electric hydrofoiling feel more accessible, refined, and memorable for every rider.
        </p>

        <div className="mx-auto mt-20 grid max-w-5xl gap-5 text-left md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="border border-line bg-porcelain p-7">
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-5 text-base leading-7 text-graphite">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl border-t border-line pt-10">
          <h2 className="text-2xl font-semibold text-ink">Designed for riders worldwide</h2>
          <p className="mt-5 text-lg leading-8 text-graphite">
            From relaxed coastal cruising to fast precise carving, Hydroglide helps riders discover a cleaner way to move across lakes, bays, and ocean surfaces.
          </p>
        </div>
      </section>
    </main>
  );
}
