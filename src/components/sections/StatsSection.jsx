import { MapPin, Medal, Trophy, Users } from "lucide-react";

function Card({ icon, title, text, accent, detail }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)] md:p-6">
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition duration-300 group-hover:scale-125 ${accent}`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0646c4]/8 text-[#0646c4]">
          {icon}
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          FIFVE 2027
        </span>
      </div>
      <div className="relative mt-7">
        <h3 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h3>
        <p className="mt-2 text-sm font-bold text-slate-800">{text}</p>
        {detail && (
          <p className="mt-1 text-xs font-medium text-slate-500">{detail}</p>
        )}
      </div>
      <div className="relative mt-5 h-1 w-12 rounded-full bg-[#e6002d] transition-all duration-300 group-hover:w-20" />
    </article>
  );
}

export default function StatsSection({ t }) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-linear-to-br from-[#f4f8ff] via-white to-[#effaf3] p-5 shadow-[0_24px_70px_rgba(6,70,196,0.1)] md:p-7">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="relative mb-6 flex flex-col gap-2 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0646c4]">
            {t.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            {t.title}
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t.locationBadge}
        </span>
      </div>
      <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={<Trophy size={22} />}
          title="54"
          text={t.teamsRanked}
          detail={t.rankingStatus}
          accent="bg-blue-400/20"
        />
        <Card
          icon={<Users size={22} />}
          title="—"
          text={t.teamsSelected}
          detail={t.selectionStatus}
          accent="bg-amber-400/20"
        />
        <Card
          icon={<Medal size={22} />}
          title="131"
          text={t.leaderPoints}
          detail={`${t.leaderTeam} · ${t.totalStatus}`}
          accent="bg-red-400/20"
        />
        <Card
          icon={<MapPin size={22} />}
          title={t.tournamentDate}
          text={t.tournament}
          detail={t.address}
          accent="bg-emerald-400/20"
        />
      </div>
    </section>
  );
}
