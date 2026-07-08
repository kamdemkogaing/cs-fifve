export default function SelectedTeamsSection({ selectedTeamsByCountry, t }) {
  return (
    <section id="retenues" className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
        {t.title}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {selectedTeamsByCountry.map((group) => (
          <div
            key={group.country}
            className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
          >
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#0646c4]">
              <img
                src={`https://flagcdn.com/24x18/${group.flagCode}.png`}
                alt={group.country}
                className="h-4 w-6 rounded-xs object-cover shadow-sm"
                loading="lazy"
              />
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#e6002d]">
                {group.teams.length}{" "}
                {group.teams.length > 1 ? t.teamPlural : t.teamSingular}
              </span>
              <span>{t.countryNames[group.flagCode] ?? group.country}</span>
            </h3>

            <ul className="space-y-2">
              {group.teams.map((team) => (
                <li
                  key={`${group.country}-${team.number}`}
                  className="rounded-xl bg-white px-3 py-2"
                >
                  <span className="mr-2 font-bold text-[#e6002d]">
                    {team.number}.
                  </span>
                  {team.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
