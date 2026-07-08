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
  const splitIndex = Math.ceil(ranking.length / 2);
  const rankingBlockA = ranking.slice(0, splitIndex);
  const rankingBlockB = ranking.slice(splitIndex);

  return (
    <section id="classement" className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
        {t.title}
      </h2>

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
    </section>
  );
}
