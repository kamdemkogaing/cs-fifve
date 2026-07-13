import { CalendarDays, Clipboard, Clock3, Link2, Users } from "lucide-react";
import { useState } from "react";

function AgendaItem({ item }) {
  return (
    <li className="relative rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {item.time}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#0646c4]">{item.title}</p>
      {item.points?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.points.map((point) => (
            <li key={point} className="text-sm text-slate-700">
              • {point}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function MeetingSection({ t }) {
  const [copied, setCopied] = useState(false);

  const copyMeetLink = async () => {
    try {
      await navigator.clipboard.writeText(t.meetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="reunion" className="px-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <article className="relative overflow-hidden rounded-3xl border border-blue-200 bg-linear-to-br from-[#f2f7ff] via-white to-[#ecf7ef] p-6 shadow-xl md:p-8">
          <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#0b61e8]/10 blur-2xl"></div>
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#159947]/10 blur-2xl"></div>

          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#0646c4]/20 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0646c4]">
                <Users size={14} />
                {t.badge}
              </p>

              <h2 className="mt-4 text-2xl font-extrabold text-[#0646c4] md:text-3xl">
                {t.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                {t.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.dateLabel}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0646c4]">
                    <CalendarDays size={14} />
                    {t.dateValue}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.timeLabel}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0646c4]">
                    <Clock3 size={14} />
                    {t.timeValue}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={t.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0646c4] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#04379a]"
                >
                  <Link2 size={14} />
                  {t.joinButton}
                </a>

                <button
                  type="button"
                  onClick={copyMeetLink}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#0646c4]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0646c4] transition hover:bg-blue-50"
                >
                  <Clipboard size={14} />
                  {copied ? t.copiedLabel : t.copyButton}
                </button>
              </div>

              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 md:text-sm">
                {t.meetHint}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0646c4]">
                {t.agendaTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {t.agenda.map((item) => (
                  <AgendaItem key={item.time} item={item} />
                ))}
              </ul>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                {t.footerNote}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
