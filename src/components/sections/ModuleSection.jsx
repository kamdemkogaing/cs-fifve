export default function ModuleSection({ classementRules, t }) {
  return (
    <section id="module" className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>
        <p className="text-sm font-semibold text-[#0646c4] md:text-base">
          {t.effectiveDate}
        </p>
      </div>

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

      <div className="mt-6 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 via-white to-blue-50 p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-[#0646c4]">{t.protectionTitle}</h3>
        <p className="mb-4 leading-relaxed text-slate-700">
          {t.protectionText}
        </p>
        <ul className="grid gap-2 md:grid-cols-2">
          {t.protectionRules.map((rule, index) => (
            <li
              key={index}
              className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <span className="mr-2 font-bold text-[#0646c4]">•</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
