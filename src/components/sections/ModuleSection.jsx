export default function ModuleSection({ classementRules }) {
  return (
    <section id="module" className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
        Module de classement FIFVE 2026
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0646c4] text-white">
            <tr>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {classementRules.map(([name, points], index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{name}</td>
                <td className="p-3 font-bold text-[#e6002d]">{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-blue-50 p-5">
        <h3 className="mb-2 font-bold text-[#0646c4]">Protection sportive</h3>
        <p>
          Les équipes issues d’une même ville ne pourront pas s’affronter lors
          des matchs de groupe : Bruxelles, Karlsruhe, Londres et Paris.
        </p>
      </div>
    </section>
  );
}
