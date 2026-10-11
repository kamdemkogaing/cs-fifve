import { CalendarClock, Lock, Sparkles } from "lucide-react";

function CountdownUnit({ value, label, isSeconds = false }) {
  return (
    <div className="group rounded-2xl border border-white/60 bg-white px-3 py-3 text-center shadow-[0_12px_28px_rgba(3,37,99,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-white md:px-4">
      <p
        className={`text-3xl font-black tabular-nums tracking-tight text-[#0646c4] md:text-4xl ${
          isSeconds ? "animate-pulse" : ""
        }`}
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
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
    <section className="relative overflow-hidden bg-linear-to-br from-[#04379a] via-[#0b61e8] to-[#159947] px-6 pt-36 pb-16 text-white md:pt-56 md:pb-20 lg:pt-56">
      <div className="pointer-events-none absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"></div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <article className="relative mb-8 overflow-hidden rounded-[30px] border border-white/35 bg-slate-950/15 p-4 shadow-[0_24px_70px_rgba(2,24,72,0.25)] backdrop-blur-xl md:p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-black text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-cyan-100">
                    <CalendarClock size={17} />
                  </span>
                  {scheduleT.badge}
                </p>
                <p className="mt-2 text-xs font-medium text-blue-100">
                  {scheduleT.releaseLabel}: {releaseDateLabel}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black shadow-sm ${
                  isScheduleVisible
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-amber-200 text-amber-950"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isScheduleVisible
                      ? "bg-emerald-600"
                      : "animate-pulse bg-amber-600"
                  }`}
                />
                {isScheduleVisible
                  ? scheduleT.statusOpen
                  : scheduleT.statusLocked}
              </span>
            </div>

            {!isScheduleVisible && (
              <>
                <p className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-200/25 bg-amber-100/10 px-3 py-2 text-xs font-bold text-amber-100 md:text-sm">
                  <Lock size={14} />
                  {scheduleT.lockedUntil} {releaseDateLabel}
                </p>
                <div
                  className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
                  aria-live="polite"
                  aria-label={scheduleT.lockedUntil}
                >
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

          <a
            href="https://www.facebook.com/profile.php?id=61576463140935"
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.hostName} auf Facebook öffnen`}
            className="mt-8 flex max-w-xl items-center gap-4 rounded-3xl border border-white/30 bg-slate-950/20 p-3 shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:border-white/60 hover:bg-slate-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white p-1 shadow-lg">
              <img
                src="/images/veterans-3e-mi-temps-karlsruhe.jpg"
                alt={t.hostLogoAlt}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                {t.hostBadge}
              </p>
              <p className="mt-1 text-lg font-black leading-tight text-white md:text-xl">
                {t.hostName}
              </p>
              <p className="mt-1 text-sm font-medium text-blue-100">
                {t.hostDescription}
              </p>
            </div>
          </a>
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
