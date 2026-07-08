export default function HeroSection({ t }) {
  const worldCupBallImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/FIFA_World_Cup_2026_Draw_Reception_%2854972841852%29.jpg/960px-FIFA_World_Cup_2026_Draw_Reception_%2854972841852%29.jpg";

  return (
    <section className="bg-linear-to-br from-[#0646c4] via-[#0b61e8] to-[#159947] px-6 py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="mb-3 font-semibold uppercase tracking-widest text-yellow-300">
            {t.badge}
          </p>
          <h2 className="max-w-4xl text-3xl font-extrabold md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-3xl text-lg">{t.subtitle}</p>
        </div>

        <figure className="mx-auto w-full max-w-xl rounded-2xl border border-white/30 bg-white/8 p-3 shadow-2xl backdrop-blur-xs">
          <div className="overflow-hidden rounded-xl bg-white/10">
            <img
              src={worldCupBallImage}
              alt={t.ballAlt}
              className="h-[220px] w-full object-cover object-center md:h-[280px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="mt-3 text-center text-sm font-medium text-white/90">
            {t.ballLabel}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
