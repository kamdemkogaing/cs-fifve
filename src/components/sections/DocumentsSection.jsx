import { Download, FileText } from "lucide-react";

function DocumentCard({ document, t }) {
  return (
    <article className="document-card">
      <span className="document-card__icon" aria-hidden="true">
        <FileText size={21} />
      </span>
      <div className="document-card__content">
        <h3>{document.title}</h3>
        <p>{document.description}</p>
        <div className="document-card__meta">
          <span>PDF</span>
          <span>{document.updatedAt}</span>
        </div>
      </div>
      <a
        className="document-card__download"
        href={document.href}
        download
        target="_blank"
        rel="noreferrer"
        aria-label={`${t.downloadCta}: ${document.title}`}
      >
        <Download size={17} />
      </a>
    </article>
  );
}

export default function DocumentsSection({ t }) {
  const documents = [
    {
      title: t.reglementTitle,
      description: t.reglementDescription,
      updatedAt: t.updatedValue,
      href: t.reglementHref || "/documents/reglement-interieur-fifve-2027.pdf",
    },
    {
      title: t.charteTitle,
      description: t.charteDescription,
      updatedAt: t.updatedValue,
      href: t.charteHref || "/documents/charte-sportive-fifve-2027.pdf",
    },
  ];

  return (
    <section className="preview-card documents-preview" id="documents">
      <div className="preview-card__heading">
        <div>
          <h2>
            <FileText size={21} />
            {t.badge}
          </h2>
        </div>
      </div>
      <div className="documents-list">
        {documents.map((document) => (
          <DocumentCard
            key={document.href}
            document={document}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
