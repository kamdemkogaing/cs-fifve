import { Users } from "lucide-react";

export default function MeetingSection({ t }) {
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

              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#0646c4]">
                  {t.blockedTitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  {t.blockedMessage}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.blockedNote}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#0646c4]">
                {t.blockedTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {t.blockedMessage}
              </p>
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 md:text-sm">
                {t.blockedNote}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
