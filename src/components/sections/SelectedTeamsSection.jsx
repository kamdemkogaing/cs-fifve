import { useMemo, useState } from "react";

export default function SelectedTeamsSection({ selectedTeamsByCountry, t }) {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortMode, setSortMode] = useState("alpha-asc");

  const sortedGroups = useMemo(() => {
    const groups = [...selectedTeamsByCountry];

    groups.sort((a, b) => {
      const countryA = t.countryNames[a.flagCode] ?? a.country;
      const countryB = t.countryNames[b.flagCode] ?? b.country;

      if (sortMode === "alpha-desc") {
        return countryB.localeCompare(countryA);
      }

      if (sortMode === "teams-desc") {
        const countDiff = b.teams.length - a.teams.length;
        return countDiff !== 0 ? countDiff : countryA.localeCompare(countryB);
      }

      return countryA.localeCompare(countryB);
    });

    return groups;
  }, [selectedTeamsByCountry, sortMode, t.countryNames]);

  const visibleGroups = useMemo(() => {
    if (selectedCountry === "all") {
      return sortedGroups;
    }

    return sortedGroups.filter((group) => group.flagCode === selectedCountry);
  }, [selectedCountry, sortedGroups]);

  const countryOptions = useMemo(() => {
    return selectedTeamsByCountry.map((group) => ({
      code: group.flagCode,
      name: t.countryNames[group.flagCode] ?? group.country,
      count: group.teams.length,
    }));
  }, [selectedTeamsByCountry, t.countryNames]);

  const totalVisibleTeams = useMemo(
    () => visibleGroups.reduce((sum, group) => sum + group.teams.length, 0),
    [visibleGroups],
  );

  return (
    <section
      id="retenues"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>

        <div className="w-full rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 via-white to-blue-50 p-4 shadow-sm lg:max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
            {t.filterPanelTitle}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {t.filterByCountry}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-blue-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">{t.allCountries}</option>
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.count})
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                >
                  ▼
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {t.sortBy}
              <div className="relative">
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-blue-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="alpha-asc">{t.sortAlphaAsc}</option>
                  <option value="alpha-desc">{t.sortAlphaDesc}</option>
                  <option value="teams-desc">{t.sortByTeamCount}</option>
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                >
                  ▼
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCountry("all")}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition ${
            selectedCountry === "all"
              ? "bg-[#0646c4] text-white shadow"
              : "border border-blue-200 bg-white text-[#0646c4] hover:bg-blue-50"
          }`}
        >
          {t.allCountries}
        </button>

        {countryOptions.map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => setSelectedCountry(country.code)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition ${
              selectedCountry === country.code
                ? "bg-[#0646c4] text-white shadow"
                : "border border-blue-200 bg-white text-[#0646c4] hover:bg-blue-50"
            }`}
          >
            {country.name} ({country.count})
          </button>
        ))}

        <span className="ml-auto rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0646c4]">
          {totalVisibleTeams}{" "}
          {totalVisibleTeams > 1 ? t.teamPlural : t.teamSingular}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleGroups.map((group) => (
          <div
            key={group.country}
            className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 bg-linear-to-r from-blue-50 to-white px-4 py-3">
              <h3 className="flex items-center gap-3 text-base font-bold text-[#0646c4] md:text-lg">
                <img
                  src={`https://flagcdn.com/24x18/${group.flagCode}.png`}
                  alt={group.country}
                  className="h-5 w-7 rounded-xs object-cover shadow-sm"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <span>{t.countryNames[group.flagCode] ?? group.country}</span>
              </h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#e6002d] ring-1 ring-red-100">
                {group.teams.length}{" "}
                {group.teams.length > 1 ? t.teamPlural : t.teamSingular}
              </span>
            </div>

            <ul className="space-y-2 p-4">
              {group.teams.map((team) => (
                <li
                  key={`${group.country}-${team.number}`}
                  className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0646c4] text-sm text-white">
                    <span aria-hidden="true">⚽</span>
                  </span>
                  <span className="text-sm font-medium text-slate-800 group-hover:text-[#0646c4] md:text-base">
                    {team.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {visibleGroups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-sm text-slate-600 md:col-span-2">
            {t.noResults}
          </div>
        )}
      </div>
    </section>
  );
}
