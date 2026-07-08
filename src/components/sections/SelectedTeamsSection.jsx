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

  return (
    <section id="retenues" className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>

        <div className="w-full rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-white p-3 shadow-sm lg:max-w-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
            {t.filterPanelTitle}
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {t.filterByCountry}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-blue-200 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
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
                  className="w-full cursor-pointer appearance-none rounded-xl border border-blue-200 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition hover:border-blue-300 focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
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

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCountry("all")}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition ${
            selectedCountry === "all"
              ? "bg-[#0646c4] text-white shadow"
              : "bg-blue-50 text-[#0646c4] hover:bg-blue-100"
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
                : "bg-blue-50 text-[#0646c4] hover:bg-blue-100"
            }`}
          >
            {country.name} ({country.count})
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {visibleGroups.map((group) => (
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
                crossOrigin="anonymous"
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
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0646c4]">
                    <span className="text-sm leading-none" aria-hidden="true">
                      ⚽
                    </span>
                  </span>
                  <span>{team.name}</span>
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
