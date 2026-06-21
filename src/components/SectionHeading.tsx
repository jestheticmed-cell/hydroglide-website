type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
};

export function SectionHeading({ eyebrow, title, copy }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-graphite">{eyebrow}</p> : null}
      <div className={`${eyebrow ? "mt-4" : ""} grid gap-3 lg:grid-cols-[0.9fr_1fr] lg:items-end`}>
        <h2 className="text-3xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h2>
        {copy ? <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-graphite sm:text-base">{copy}</p> : null}
      </div>
    </div>
  );
}
