export default function ModuleSection({ classementRules, t }) {
  return (
    <section
      id="module"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg"
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>
        <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0646c4] md:text-base">
          {t.effectiveDate}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
        <div className="divide-y divide-blue-100 md:hidden">
          {classementRules.map(([name, points], index) => (
            <article
              key={index}
              className="bg-white px-4 py-3 transition-colors odd:bg-white even:bg-blue-50/30"
            >
              <p className="text-sm font-medium leading-relaxed text-slate-800">
                {t.rules[index] ?? name}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
                  {t.points}
                </span>
                <span className="inline-flex min-w-18.5 items-center justify-center rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-[#e6002d] ring-1 ring-red-100">
                  {points}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-[#0646c4] text-white">
              <tr>
                <th className="border-b border-blue-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider md:text-sm">
                  {t.performance}
                </th>
                <th className="border-b border-blue-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider md:text-sm">
                  {t.points}
                </th>
              </tr>
            </thead>
            <tbody>
              {classementRules.map(([name, points], index) => (
                <tr
                  key={index}
                  className="transition-colors odd:bg-white even:bg-blue-50/40 hover:bg-blue-50"
                >
                  <td className="border-b border-blue-100 px-4 py-3 text-sm text-slate-800 md:text-base">
                    {t.rules[index] ?? name}
                  </td>
                  <td className="border-b border-blue-100 px-4 py-3">
                    <span className="inline-flex min-w-18.5 items-center justify-center rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-[#e6002d] ring-1 ring-red-100 md:text-base">
                      {points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
