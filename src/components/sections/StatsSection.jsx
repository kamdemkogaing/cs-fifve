import { CalendarDays, Medal, Trophy, Users } from "lucide-react";

export default function StatsSection({
  t,
  ranking,
  selectedTeamsByCountry,
}) {
  const selectedTeamCount = selectedTeamsByCountry.reduce(
    (total, country) => total + country.teams.length,
    0,
  );
  const leader = ranking[0];
  const statistics = [
    {
      icon: <Trophy size={21} />,
      value: ranking.length,
      label: t.teamsRanked,
    },
    {
      icon: <Users size={21} />,
      value: selectedTeamCount || "—",
      label: t.teamsSelected,
    },
    {
      icon: <Medal size={21} />,
      value: leader?.[4] ?? "—",
      label: t.leaderPoints,
      detail: leader?.[1],
    },
    {
      icon: <CalendarDays size={21} />,
      value: t.tournamentDate,
      label: t.tournament,
      detail: t.address,
    },
  ];

  return (
    <section className="stats-section" aria-labelledby="tournament-stats">
      <div className="stats-section__heading">
        <div>
          <p>{t.eyebrow}</p>
          <h2 id="tournament-stats">{t.title}</h2>
        </div>
        <span>{t.locationBadge}</span>
      </div>
      <div className="stats-grid">
        {statistics.map((statistic) => (
          <article className="stat-card" key={statistic.label}>
            <span className="stat-card__icon">{statistic.icon}</span>
            <strong className="stat-card__value">{statistic.value}</strong>
            <span className="stat-card__label">{statistic.label}</span>
            {statistic.detail && (
              <span className="stat-card__detail">{statistic.detail}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
