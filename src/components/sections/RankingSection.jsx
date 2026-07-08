import { useEffect, useMemo, useState } from "react";

function RankingCard({ team, t }) {
  const isTopThree = Number(team[0]) <= 3;

  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isTopThree
          ? "border-yellow-200 bg-linear-to-b from-yellow-50 via-white to-blue-50"
          : "border-blue-100 bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#0646c4] px-2 py-1 text-xs font-bold text-white">
          #{team[0]}
        </span>
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#e6002d] ring-1 ring-red-100">
          {team[4]} pts
        </span>
      </div>

      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0646c4] md:text-base">
        {team[1]}
      </h3>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 md:text-sm">
        <div className="rounded-xl bg-blue-50 px-2.5 py-2">
          <dt className="font-medium">{t.points}</dt>
          <dd className="mt-0.5 font-bold text-[#0646c4]">{team[2]}</dd>
        </div>
        <div className="rounded-xl bg-blue-50 px-2.5 py-2">
          <dt className="font-medium">{t.additions}</dt>
          <dd className="mt-0.5 font-bold text-[#0646c4]">{team[3]}</dd>
        </div>
        <div className="col-span-2 rounded-xl bg-red-50 px-2.5 py-2 ring-1 ring-red-100">
          <dt className="font-medium text-slate-700">{t.total}</dt>
          <dd className="mt-0.5 text-lg font-extrabold text-[#e6002d]">
            {team[4]}
          </dd>
        </div>
      </dl>

      {isTopThree && (
        <p className="mt-3 inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
          Top 3
        </p>
      )}
    </article>
  );
}

export default function RankingSection({ ranking, t }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizeText = (value) =>
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredRanking = useMemo(() => {
    const query = searchTerm.trim();
    if (!query) {
      return ranking;
    }

    const normalizedQuery = normalizeText(query);
    return ranking.filter((team) =>
      normalizeText(team[1]).includes(normalizedQuery),
    );
  }, [ranking, searchTerm]);

  const hasSearchValue = useMemo(
    () => searchTerm.trim().length > 0,
    [searchTerm],
  );

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();
    if (!query) {
      setSearchError("");
      return;
    }

    const normalizedQuery = normalizeText(query);
    const foundTeam = ranking.find((team) =>
      normalizeText(team[1]).includes(normalizedQuery),
    );

    if (!foundTeam) {
      setSearchError(t.noTeamFound);
      return;
    }

    setSearchError("");
    setSelectedTeam(foundTeam);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <section id="classement" className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>

        <form
          onSubmit={handleSearch}
          className="w-full rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-white p-3 shadow-sm lg:max-w-md"
        >
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
            {t.searchLabel}
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                if (searchError) {
                  setSearchError("");
                }
              }}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#0646c4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!hasSearchValue}
            >
              {t.searchButton}
            </button>
          </div>

          {searchError && (
            <p className="mt-2 text-xs font-medium text-[#e6002d]">
              {searchError}
            </p>
          )}
        </form>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {filteredRanking.length} / {ranking.length}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredRanking.map((team) => (
          <RankingCard key={`${team[0]}-${team[1]}`} team={team} t={t} />
        ))}
      </div>

      {filteredRanking.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-sm text-slate-600">
          {t.noTeamFound}
        </div>
      )}

      {isModalOpen && selectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.modalTitle}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {t.modalTitle}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#0646c4]">
                  {selectedTeam[1]}
                </h3>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                onClick={closeModal}
              >
                {t.close}
              </button>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {t.nr}
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0646c4]">
                  {selectedTeam[0]}
                </dd>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {t.points}
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0646c4]">
                  {selectedTeam[2]}
                </dd>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {t.additions}
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0646c4]">
                  {selectedTeam[3]}
                </dd>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {t.total}
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#e6002d]">
                  {selectedTeam[4]}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
