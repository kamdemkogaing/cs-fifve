import { useEffect, useMemo, useState } from "react";

function RankingBlock({ title, teams, t }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-b from-blue-50 to-white shadow-md">
      <div className="bg-[#0646c4] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white text-[#0646c4]">
            <tr className="border-b border-blue-100">
              <th className="p-3 text-left">{t.nr}</th>
              <th className="p-3 text-left">{t.delegation}</th>
              <th className="p-3 text-left">{t.points}</th>
              <th className="p-3 text-left">{t.additions}</th>
              <th className="p-3 text-left">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team[0]}
                className="border-b border-blue-50 transition-colors hover:bg-blue-50/70"
              >
                <td className="p-3 font-bold">{team[0]}</td>
                <td className="p-3">{team[1]}</td>
                <td className="p-3">{team[2]}</td>
                <td className="p-3">{team[3]}</td>
                <td className="p-3 font-bold text-[#e6002d]">{team[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

  const splitIndex = Math.ceil(ranking.length / 2);
  const rankingBlockA = ranking.slice(0, splitIndex);
  const rankingBlockB = ranking.slice(splitIndex);

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

      <div className="grid gap-6 lg:grid-cols-2">
        <RankingBlock
          title={`${t.block} 1 (${rankingBlockA[0][0]}-${rankingBlockA[rankingBlockA.length - 1][0]})`}
          teams={rankingBlockA}
          t={t}
        />
        <RankingBlock
          title={`${t.block} 2 (${rankingBlockB[0][0]}-${rankingBlockB[rankingBlockB.length - 1][0]})`}
          teams={rankingBlockB}
          t={t}
        />
      </div>

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
