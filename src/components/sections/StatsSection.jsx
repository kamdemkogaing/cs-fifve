import { MapPin, Medal, Trophy, Users } from "lucide-react";

function Card({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4 text-[#0646c4]">{icon}</div>
      <h3 className="text-3xl font-extrabold text-[#e6002d]">{title}</h3>
      <p className="mt-2 font-medium">{text}</p>
    </div>
  );
}

export default function StatsSection({ t }) {
  return (
    <section className="grid gap-6 md:grid-cols-4">
      <Card icon={<Trophy />} title="54" text={t.teamsRanked} />
      <Card icon={<Users />} title="—" text={t.teamsSelected} />
      <Card icon={<Medal />} title="116" text={t.leaderPoints} />
      <Card
        icon={<MapPin />}
        title="23-25 juillet 2027"
        text={t.tournament}
      />
    </section>
  );
}
