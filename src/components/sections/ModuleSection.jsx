export default function ModuleSection({ classementRules, t }) {
  return (
    <section id="module" className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
        {t.title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0646c4] text-white">
            <tr>
              <th className="p-3 text-left">{t.performance}</th>
              <th className="p-3 text-left">{t.points}</th>
            </tr>
          </thead>
          <tbody>
            {classementRules.map(([name, points], index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{t.rules[index] ?? name}</td>
                <td className="p-3 font-bold text-[#e6002d]">{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-blue-50 p-5">
        <h3 className="mb-2 font-bold text-[#0646c4]">{t.protectionTitle}</h3>
        <p>{t.protectionText}</p>
      </div>
    </section>
  );
}
