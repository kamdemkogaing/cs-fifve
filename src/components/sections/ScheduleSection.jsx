import {
  CalendarClock,
  Clock3,
  ExternalLink,
  Link2,
  Lock,
  QrCode,
} from "lucide-react";
import { useState } from "react";

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
          className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-[#0646c4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#04379a]"
        >
          {t.openLink}
          <ExternalLink size={16} />
        </a>
      ) : (
        <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-500">
          <Lock size={14} />
          <span className="min-w-0 whitespace-normal wrap-break-word">
            {t.linkUnavailable}
          </span>
        </div>
      )}
    </article>
  );
}

function QrAccessCard({
  title,
  imagePath,
  linkUrl,
  hint,
  isVisible,
  releaseDateLabel,
  t,
}) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <article className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t.linksLabel}
      </p>
      <h3 className="mt-1 text-base font-semibold text-[#0646c4]">{title}</h3>

      <div className="mt-3 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50/40 p-3 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-[#0646c4] shadow-sm">
          {!isVisible ? (
            <div className="flex flex-col items-center text-slate-500">
              <Lock size={26} />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide">
                Lock
              </span>
            </div>
          ) : hasImageError ? (
            <QrCode size={36} />
          ) : (
            <img
              src={imagePath}
              alt={`${title} QR code`}
              className="h-20 w-20 rounded-md object-contain"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-600">
            {isVisible ? hint : `${t.lockedUntil} ${releaseDateLabel}`}
          </p>
          {isVisible ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full bg-[#0646c4] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#04379a]"
            >
              {t.openLink}
              <ExternalLink size={14} />
            </a>
          ) : (
            <div className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-center text-xs font-semibold text-slate-500">
              <Lock size={13} />
              <span className="min-w-0 whitespace-normal wrap-break-word">
                {t.linkUnavailable}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ScheduleSection({
  isScheduleVisible,
  releaseDateLabel,
  t,
}) {
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

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <QrAccessCard
              title={t.linkOne}
              imagePath="/images/qr-combinaisons-fifve-part-1.png"
              linkUrl="https://www.meinturnierplan.de/c/tmfs3ecd/fifve-cologne-2026-part-1-6-felds/"
              hint={t.qrPartOneHint}
              isVisible={isScheduleVisible}
              releaseDateLabel={releaseDateLabel}
              t={t}
            />
            <QrAccessCard
              title={t.linkTwo}
              imagePath="/images/qr-combinaisons-fifve-part-2.png"
              linkUrl="https://www.meinturnierplan.de/showit.php?id=2jw4wox3ow"
              hint={t.qrPartTwoHint}
              isVisible={isScheduleVisible}
              releaseDateLabel={releaseDateLabel}
              t={t}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">{t.qrSuggestion}</p>
        </div>
      </div>
    </section>
  );
}
