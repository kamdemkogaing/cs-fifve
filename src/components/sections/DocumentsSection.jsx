import { Clock3, Download, FileText, Languages, Shield } from "lucide-react";

function DocumentCard({ doc, t }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(6,70,196,0.12)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(6,70,196,0.18)] md:p-7">
      <div className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-[#0b61e8]/10 blur-3xl transition duration-300 group-hover:bg-[#159947]/15"></div>

      <div className="relative flex h-full flex-col">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#0646c4] via-[#0b61e8] to-[#159947] text-white shadow-lg shadow-blue-500/20">
              <FileText size={26} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#159947]">
                {t.fileLabel}
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-slate-900 md:text-2xl">
                {doc.title}
              </h3>
            </div>
          </div>

          <span className="self-start rounded-full border border-[#0646c4]/15 bg-[#0646c4]/6 px-3 py-1 text-center text-xs leading-4 font-bold text-[#0646c4] sm:max-w-none">
            {doc.badge}
          </span>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-700 md:text-base">
          {doc.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {doc.highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>

        <dl className="mt-6 grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {t.languageLabel}
            </dt>
            <dd className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-800">
              <Languages size={15} className="text-[#0646c4]" />
              {doc.language}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {t.updatedLabel}
            </dt>
            <dd className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-800">
              <Clock3 size={15} className="text-[#0646c4]" />
              {doc.updatedAt}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {t.typeLabel}
            </dt>
            <dd className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-800">
              <Shield size={15} className="text-[#0646c4]" />
              PDF
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="break-all text-sm font-medium text-slate-600">
            {doc.filename}
          </p>

          <a
            href={doc.href}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0646c4] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#04379a] sm:w-auto"
          >
            <Download size={16} />
            {t.downloadCta}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function DocumentsSection({ t }) {
  const documents = [
    {
      title: t.reglementTitle,
      badge: t.reglementBadge,
      description: t.reglementDescription,
      highlights: t.reglementHighlights,
      language: t.languageValue,
      updatedAt: t.updatedValue,
      filename: "reglement-interieur-fifve-2026.pdf",
      href: "/documents/reglement-interieur-fifve-2026.pdf",
    },
    {
      title: t.charteTitle,
      badge: t.charteBadge,
      description: t.charteDescription,
      highlights: t.charteHighlights,
      language: t.languageValue,
      updatedAt: t.updatedValue,
      filename: "charte-sportive-fifve-2026.pdf",
      href: "/documents/charte-sportive-fifve-2026.pdf",
    },
  ];

  return (
    <section id="documents" className="px-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <article className="relative overflow-hidden rounded-4xl border border-blue-100/80 bg-linear-to-br from-[#f6fbff] via-white to-[#eef8f0] px-6 py-8 shadow-[0_30px_90px_rgba(6,70,196,0.12)] md:px-8 md:py-10">
          <div className="pointer-events-none absolute -top-24 left-8 h-48 w-48 rounded-full bg-[#0b61e8]/10 blur-3xl"></div>
          <div className="pointer-events-none absolute right-0 -bottom-24 h-56 w-56 rounded-full bg-[#159947]/12 blur-3xl"></div>

          <div className="relative flex flex-col gap-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#0646c4]/15 bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#0646c4]">
                <FileText size={14} />
                {t.badge}
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                {t.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                {t.subtitle}
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {documents.map((doc) => (
                <DocumentCard key={doc.href} doc={doc} t={t} />
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
