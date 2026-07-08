import {
  CalendarClock,
  Clock3,
  ExternalLink,
  Link2,
  Lock,
  QrCode,
} from "lucide-react";

function getRemainingParts(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}

function CountdownCard({ value, label }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-[#0646c4]">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </p>
    </div>
  );
}

function ScheduleLinkCard({ title, url, isVisible, t }) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-linear-to-b from-white to-blue-50/40 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t.linksLabel}
      </p>
      <p className="mt-1 text-base font-semibold text-[#0646c4]">{title}</p>

      {isVisible ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#0646c4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#04379a]"
        >
          {t.openLink}
          <ExternalLink size={16} />
        </a>
      ) : (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
          <Lock size={14} />
          {t.linkUnavailable}
        </div>
      )}
    </article>
  );
}

export default function ScheduleSection({ currentTime, language, t }) {
  const scheduleReleaseTimestamp = Date.parse("2026-07-24T18:00:00Z");
  const isScheduleVisible = currentTime >= scheduleReleaseTimestamp;
  const releaseDateLabel = new Date(scheduleReleaseTimestamp).toLocaleString(
    language === "en" ? "en-GB" : "fr-FR",
    {
      timeZone: "Europe/Berlin",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const remainingMs = Math.max(0, scheduleReleaseTimestamp - currentTime);
  const remaining = getRemainingParts(remainingMs);

  return (
    <section
      id="programmation"
      className="relative overflow-hidden rounded-3xl border border-blue-200 bg-linear-to-br from-[#f2f7ff] via-white to-[#edf9f2] p-6 shadow-lg"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#0b61e8]/10 blur-2xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#159947]/10 blur-2xl"></div>

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0646c4]/20 bg-white/90 px-3 py-1 text-sm font-semibold text-[#0646c4]">
          <CalendarClock size={16} />
          {t.badge}
        </div>

        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-700 md:text-base">
          {t.subtitle}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.releaseLabel}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0646c4]">
              {releaseDateLabel}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.timezoneLabel}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0646c4]">
              <Clock3 size={14} />
              {t.timezoneValue}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.statusLabel}
            </p>
            <p
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                isScheduleVisible
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {isScheduleVisible ? t.statusOpen : t.statusLocked}
            </p>
          </div>
        </div>

        {!isScheduleVisible && (
          <div className="mt-6 rounded-2xl border border-amber-300/70 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center gap-2 text-amber-900">
              <Lock size={16} />
              <p className="font-semibold">
                {t.lockedUntil} {releaseDateLabel}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-md">
              <CountdownCard value={remaining.days} label={t.days} />
              <CountdownCard value={remaining.hours} label={t.hours} />
              <CountdownCard value={remaining.minutes} label={t.minutes} />
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ScheduleLinkCard
            title={t.linkOne}
            url="https://www.meinturnierplan.de/c/tmfs3ecd/fifve-cologne-2026-part-1-6-felds/"
            isVisible={isScheduleVisible}
            t={t}
          />
          <ScheduleLinkCard
            title={t.linkTwo}
            url="https://www.meinturnierplan.de/showit.php?id=2jw4wox3ow"
            isVisible={isScheduleVisible}
            t={t}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#0646c4]">
            <Link2 size={18} />
            <p className="text-base font-semibold">{t.qrTitle}</p>
          </div>

          <p className="mt-2 text-sm text-slate-600">{t.qrDescription}</p>

          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-5 text-center sm:flex-row sm:justify-start sm:gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-blue-200 bg-white text-[#0646c4] shadow-sm">
              <QrCode size={44} />
            </div>

            <div className="mt-3 sm:mt-0">
              <p className="text-sm font-semibold text-[#0646c4]">
                {t.qrPlaceholderTitle}
              </p>
              <p className="mt-1 text-xs text-slate-600">{t.qrSuggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
