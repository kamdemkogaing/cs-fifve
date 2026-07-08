export default function HeroSection({ t }) {
  return (
    <section className="bg-linear-to-br from-[#0646c4] via-[#0b61e8] to-[#159947] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-semibold uppercase tracking-widest text-yellow-300">
          {t.badge}
        </p>
        <h2 className="max-w-4xl text-3xl font-extrabold md:text-5xl">
          {t.title}
        </h2>
        <p className="mt-6 max-w-3xl text-lg">{t.subtitle}</p>
      </div>
    </section>
  );
}
