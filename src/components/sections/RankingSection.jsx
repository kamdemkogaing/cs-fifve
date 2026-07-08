import { useEffect, useMemo, useState } from "react";

const SORT_BY = {
  RANK_ASC: "rank-asc",
  RANK_DESC: "rank-desc",
  TOTAL_DESC: "total-desc",
  TEAM_ASC: "team-asc",
};

export default function RankingSection({ ranking, t }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(SORT_BY.RANK_ASC);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamBlock, setSelectedTeamBlock] = useState(null);
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

  const sortedRanking = useMemo(() => {
    const sorted = [...filteredRanking];

    sorted.sort((leftTeam, rightTeam) => {
      const leftRank = Number(leftTeam[0]);
      const rightRank = Number(rightTeam[0]);
      const leftTotal = Number(leftTeam[4]);
      const rightTotal = Number(rightTeam[4]);
      const leftName = String(leftTeam[1]);
      const rightName = String(rightTeam[1]);

      if (sortBy === SORT_BY.RANK_DESC) {
        return rightRank - leftRank;
      }

      if (sortBy === SORT_BY.TOTAL_DESC) {
        if (rightTotal !== leftTotal) {
          return rightTotal - leftTotal;
        }
        return leftRank - rightRank;
      }

      if (sortBy === SORT_BY.TEAM_ASC) {
        return leftName.localeCompare(rightName, "fr", { sensitivity: "base" });
      }

      return leftRank - rightRank;
    });

    return sorted;
  }, [filteredRanking, sortBy]);

  const splitIndex = useMemo(
    () => Math.ceil(sortedRanking.length / 2),
    [sortedRanking.length],
  );

  const rankingBlocks = useMemo(
    () => [sortedRanking.slice(0, splitIndex), sortedRanking.slice(splitIndex)],
    [sortedRanking, splitIndex],
  );

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openTeamModal = (team, blockNumber) => {
    setSelectedTeam(team);
    setSelectedTeamBlock(blockNumber);
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
        <div>
          <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
            {t.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.tableHint}</p>
        </div>

        <div className="w-full rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-white p-3 shadow-sm lg:max-w-xl">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
            {t.searchLabel}
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0646c4] focus:ring-2 focus:ring-blue-100"
            >
              <option value={SORT_BY.RANK_ASC}>{t.sortRankAsc}</option>
              <option value={SORT_BY.RANK_DESC}>{t.sortRankDesc}</option>
              <option value={SORT_BY.TOTAL_DESC}>{t.sortTotalDesc}</option>
              <option value={SORT_BY.TEAM_ASC}>{t.sortTeamAsc}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {sortedRanking.length} / {ranking.length}
        </p>
        <p className="hidden text-xs text-slate-500 md:block">
          {t.clickRowHint}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {rankingBlocks.map((blockTeams, blockIndex) => (
          <div
            key={`ranking-block-${blockIndex}`}
            className="overflow-hidden rounded-2xl border border-blue-100"
          >
            <div className="hidden border-b border-blue-100 bg-[#f6f9ff] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0646c4] md:block">
              {t.block} {blockIndex + 1}
            </div>

            <div className="divide-y divide-blue-100 md:hidden">
              {blockTeams.map((team) => {
                const isTopThree = Number(team[0]) <= 3;

                return (
                  <article
                    key={`${team[0]}-${team[1]}`}
                    className={`cursor-pointer px-4 py-3 transition-colors odd:bg-white even:bg-blue-50/30 hover:bg-blue-50 ${
                      isTopThree ? "bg-yellow-50/40" : ""
                    }`}
                    onClick={() => openTeamModal(team, blockIndex + 1)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#0646c4] px-2 py-1 text-xs font-bold text-white">
                        #{team[0]}
                      </span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[#e6002d] ring-1 ring-red-100">
                        {team[4]} pts
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-[#0646c4]">
                      {team[1]}
                    </h3>

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-blue-100">
                        <dt className="font-medium">{t.points}</dt>
                        <dd className="mt-0.5 text-sm font-bold text-slate-800">
                          {team[2]}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-white px-2.5 py-2 ring-1 ring-blue-100">
                        <dt className="font-medium">{t.total}</dt>
                        <dd className="mt-0.5 text-sm font-extrabold text-[#e6002d]">
                          {team[4]}
                        </dd>
                      </div>
                      <div className="col-span-2 rounded-xl bg-white px-2.5 py-2 ring-1 ring-blue-100">
                        <dt className="font-medium">{t.additions}</dt>
                        <dd className="mt-0.5 text-sm font-bold text-slate-800">
                          {team[3]}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-[#eef3ff] text-xs uppercase tracking-wide text-[#0646c4]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{t.nr}</th>
                    <th className="px-4 py-3 font-semibold">{t.delegation}</th>
                    <th className="px-4 py-3 font-semibold">{t.points}</th>
                    <th className="px-4 py-3 font-semibold">{t.additions}</th>
                    <th className="px-4 py-3 font-semibold">{t.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {blockTeams.map((team) => {
                    const isTopThree = Number(team[0]) <= 3;

                    return (
                      <tr
                        key={`${team[0]}-${team[1]}`}
                        className={`cursor-pointer border-t border-blue-50 transition hover:bg-blue-50/70 focus-within:bg-blue-50/70 ${
                          isTopThree ? "bg-yellow-50/35" : ""
                        }`}
                        onClick={() => openTeamModal(team, blockIndex + 1)}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#0646c4] px-2 py-1 text-xs font-bold text-white">
                            #{team[0]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#0646c4]">
                          <button
                            type="button"
                            className="cursor-pointer text-left outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0646c4]/40"
                            onClick={(event) => {
                              event.stopPropagation();
                              openTeamModal(team, blockIndex + 1);
                            }}
                          >
                            {team[1]}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {team[2]}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {team[3]}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#e6002d]">
                          {team[4]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {sortedRanking.length === 0 && (
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
                {selectedTeamBlock !== null && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.block} {selectedTeamBlock}
                  </p>
                )}
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
