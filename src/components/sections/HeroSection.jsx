import { CalendarClock, Clock3, Lock, Sparkles } from "lucide-react";

function CountdownUnit({ value, label, isSeconds = false }) {
  return (
    <div className="rounded-2xl border border-white/35 bg-white/85 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
      <p
        className={`text-2xl font-black tabular-nums text-[#0646c4] md:text-3xl ${
          isSeconds ? "animate-pulse" : ""
        }`}
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>
    </div>
  );
}

export default function HeroSection({
  t,
  countdown,
  releaseDateLabel,
  isScheduleVisible,
  scheduleT,
}) {
  const worldCupBallImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/FIFA_World_Cup_2026_Draw_Reception_%2854972841852%29.jpg/960px-FIFA_World_Cup_2026_Draw_Reception_%2854972841852%29.jpg";

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#04379a] via-[#0b61e8] to-[#159947] px-6 py-16 text-white md:py-20">
      <div className="pointer-events-none absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"></div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <article className="mb-8 rounded-3xl border border-white/30 bg-white/15 p-4 shadow-xl backdrop-blur-md md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/95">
                <CalendarClock size={16} />
                {scheduleT.badge}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isScheduleVisible
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-amber-200 text-amber-900"
                }`}
              >
                {isScheduleVisible
                  ? scheduleT.statusOpen
                  : scheduleT.statusLocked}
              </span>
            </div>

            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/90">
              <Clock3 size={15} />
              {scheduleT.releaseLabel}: {releaseDateLabel}
            </p>

            {!isScheduleVisible && (
              <>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <Lock size={15} />
                  {scheduleT.lockedUntil} {releaseDateLabel}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <CountdownUnit
                    value={countdown.days}
                    label={scheduleT.days}
                  />
                  <CountdownUnit
                    value={countdown.hours}
                    label={scheduleT.hours}
                  />
                  <CountdownUnit
                    value={countdown.minutes}
                    label={scheduleT.minutes}
                  />
                  <CountdownUnit
                    value={countdown.seconds}
                    label={scheduleT.seconds}
                    isSeconds
                  />
                </div>
              </>
            )}
          </article>

          <p className="mb-3 font-semibold uppercase tracking-widest text-yellow-300">
            {t.badge}
          </p>
          <h2 className="max-w-4xl text-3xl font-extrabold md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-3xl text-lg">{t.subtitle}</p>
        </div>

        <figure className="order-1 mx-auto w-full max-w-xl rounded-2xl border border-white/30 bg-white/8 p-3 shadow-2xl backdrop-blur-xs lg:order-2">
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
            <span className="inline-flex items-center gap-1">
              <Sparkles size={14} />
              {t.ballLabel}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
