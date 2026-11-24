import { CalendarClock, Sparkles, Timer, Trophy } from "lucide-react";

function CountdownUnit({ value, label, isSeconds = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border px-2 py-4 text-center shadow-[0_14px_32px_rgba(2,24,72,0.2)] transition duration-300 hover:-translate-y-1 hover:border-cyan-100/70 hover:bg-white/20 sm:px-3 md:rounded-3xl md:py-5 ${
        isSeconds
          ? "border-cyan-100/50 bg-cyan-100/15"
          : "border-white/30 bg-white/10"
      }`}
    >
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />
      <p
        className="text-4xl font-black tabular-nums tracking-[-0.06em] text-white drop-shadow-[0_4px_14px_rgba(2,24,72,0.3)] sm:text-5xl md:text-6xl"
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-50/80 sm:text-[10px] sm:tracking-[0.2em]">
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
          <article className="relative mb-8 overflow-hidden rounded-[30px] border border-white/40 bg-linear-to-br from-[#03276d]/65 via-[#0646a8]/45 to-cyan-500/20 p-4 shadow-[0_28px_80px_rgba(2,24,72,0.32)] backdrop-blur-xl md:p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-blue-300/15 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2.5 text-sm font-black text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/15 text-cyan-100 shadow-inner">
                    <CalendarClock size={18} />
                  </span>
                  {scheduleT.badge}
                </p>
                <p className="mt-2 text-xs font-medium text-blue-100/90">
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
                <div className="relative mt-6 flex items-center gap-2.5 text-sm font-bold text-white md:mt-7 md:text-base">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-amber-950 shadow-[0_0_24px_rgba(252,211,77,0.35)]">
                    <Timer size={17} />
                  </span>
                  <span>{scheduleT.countdownTitle}</span>
                </div>
                <div
                  className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-5 md:gap-4"
                  role="timer"
                  aria-live="off"
                  aria-label={scheduleT.countdownTitle}
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

        <div className="order-1 mx-auto w-full max-w-xl lg:order-2">
          <div className="mb-4 ml-auto flex w-fit max-w-full items-center gap-3 rounded-2xl border border-amber-200/45 bg-linear-to-r from-amber-300/20 via-white/15 to-white/10 p-3 pr-5 shadow-[0_16px_45px_rgba(2,24,72,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-100/70 hover:shadow-[0_20px_55px_rgba(2,24,72,0.35)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-100/50 bg-linear-to-br from-amber-200 to-yellow-400 text-amber-950 shadow-[0_6px_22px_rgba(251,191,36,0.3)]">
              <Trophy size={23} strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                {t.winnerBadge}
              </span>
              <span className="mt-0.5 block truncate text-base font-black leading-tight text-white sm:text-lg">
                {t.winnerTeam}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-blue-100">
                {t.winnerClub}
              </span>
            </span>
          </div>
          <figure className="rounded-2xl border border-white/30 bg-white/8 p-3 shadow-2xl backdrop-blur-xs">
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
      </div>
    </section>
  );
}
