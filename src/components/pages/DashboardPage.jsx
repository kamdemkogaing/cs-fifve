import {
  CalendarDays,
  CreditCard,
  Eye,
  FileText,
  LayoutTemplate,
  LogOut,
  RefreshCw,
  Save,
  Send,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";

const DASHBOARD_CONFIG_STORAGE_KEY = "fifve-dashboard-config";
const DASHBOARD_PUBLISHED_AT_STORAGE_KEY = "fifve-dashboard-published-at";

const sectionToggles = [
  { key: "meeting", label: "Section reunion" },
  { key: "documents", label: "Section documents" },
  { key: "license", label: "Section licence" },
  { key: "teamWorkspace", label: "Section espace equipe" },
  { key: "team", label: "Section equipe" },
  { key: "stats", label: "Section statistiques" },
  { key: "module", label: "Section module" },
  { key: "ranking", label: "Section classement" },
  { key: "selected", label: "Section equipes retenues" },
  { key: "schedule", label: "Section programmation" },
  { key: "location", label: "Section lieu" },
  { key: "export", label: "Section export" },
  { key: "welcomeModal", label: "Popup de bienvenue" },
];

const initialDashboardConfig = {
  site: {
    siteName: "FIFVE 2026",
    sloganFr: "Football our Passion",
    sloganEn: "Football our Passion",
    defaultLanguage: "fr",
    timezone: "Europe/Berlin",
  },
  sections: {
    meeting: true,
    documents: true,
    license: true,
    teamWorkspace: true,
    team: true,
    stats: true,
    module: true,
    ranking: true,
    selected: true,
    schedule: true,
    location: true,
    export: false,
    welcomeModal: true,
  },
  hero: {
    badgeFr: "Week-End FIFVE 2026",
    badgeEn: "FIFVE Weekend 2026",
    titleFr: "Classement officiel, module de points et equipes retenues",
    titleEn: "Official rankings, scoring module and selected teams",
    subtitleFr:
      "Page officielle de presentation des informations sportives de l'edition 2026.",
    subtitleEn:
      "Official page presenting sports information for the 2026 edition.",
  },
  meeting: {
    meetingUrl: "https://meet.google.com/huk-ijth-nnx",
    dateFr: "A definir",
    dateEn: "To be defined",
    timeFr: "A definir",
    timeEn: "To be defined",
    noteFr: "Merci de revenir regulierement sur cette page.",
    noteEn: "Please check back regularly.",
  },
  documents: {
    reglementUrl: "/documents/Reglement_interieur_FIFVE_2026.pdf",
    charteUrl: "/documents/Charte_sportive_FIFVE_2026.pdf",
    updatedFr: "Juillet 2026",
    updatedEn: "July 2026",
  },
  license: {
    newLicensePrice: "10",
    transferPrice: "25",
    paymentProvider: "PayPal / Carte bancaire",
  },
  teamWorkspace: {
    workspacePassword: "FIFVE-TEAM-2026",
    reportsDocxUrl: "/documents/Rapport_sportif_FIFVE_2026.docx",
  },
  schedule: {
    releaseDateIso: "2026-07-24T18:00:00Z",
    linkOne: "",
    linkTwo: "",
  },
  footer: {
    email: "bureau@fifve.com",
    website: "https://www.fifve.com",
    whatsappNumber: "+49 171 1721204",
    contactPerson: "Teofile Tchakoumi",
  },
};

function loadDashboardConfig() {
  try {
    const raw = window.localStorage.getItem(DASHBOARD_CONFIG_STORAGE_KEY);
    if (!raw) {
      return initialDashboardConfig;
    }

    const parsed = JSON.parse(raw);
    return {
      ...initialDashboardConfig,
      ...parsed,
      site: { ...initialDashboardConfig.site, ...parsed.site },
      sections: { ...initialDashboardConfig.sections, ...parsed.sections },
      hero: { ...initialDashboardConfig.hero, ...parsed.hero },
      meeting: { ...initialDashboardConfig.meeting, ...parsed.meeting },
      documents: { ...initialDashboardConfig.documents, ...parsed.documents },
      license: { ...initialDashboardConfig.license, ...parsed.license },
      teamWorkspace: {
        ...initialDashboardConfig.teamWorkspace,
        ...parsed.teamWorkspace,
      },
      schedule: { ...initialDashboardConfig.schedule, ...parsed.schedule },
      footer: { ...initialDashboardConfig.footer, ...parsed.footer },
    };
  } catch {
    return initialDashboardConfig;
  }
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage({ language, setLanguage, onLogout }) {
  const [config, setConfig] = useState(() => loadDashboardConfig());
  const [savedAt, setSavedAt] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    () => window.localStorage.getItem(DASHBOARD_PUBLISHED_AT_STORAGE_KEY) || "",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const ui =
    language === "en"
      ? {
          adminBadge: "Admin dashboard",
          mode: "Editing mode",
          title: "Complete configuration of https://cs-fifve.patelot.de/",
          subtitle:
            "Prepare the site settings in frontend mode. Later, this payload will be sent to your Java endpoints for online publication.",
          logout: "Log out",
          stats: {
            sections: "Active sections",
            save: "Last local save",
            publication: "Publication",
            none: "None",
            notPublished: "Not published",
          },
          generalTitle: "General settings",
          siteName: "Site name",
          defaultLanguage: "Default language",
          sloganFr: "Slogan FR",
          sloganEn: "Slogan EN",
          visibility: "Section visibility",
          hero: "Hero content (FR / EN)",
          badgeFr: "Badge FR",
          badgeEn: "Badge EN",
          titleFr: "Title FR",
          titleEn: "Title EN",
          meeting: "Meeting, schedule and documents",
          meetLink: "Google Meet link",
          dateFr: "Date FR",
          dateEn: "Date EN",
          releaseIso: "Schedule publication (ISO)",
          linkOne: "Schedule link 1",
          linkTwo: "Schedule link 2",
          reglement: "Rules PDF URL",
          charte: "Charter PDF URL",
          licence: "License, team workspace and footer",
          newLicensePrice: "New license price",
          transferPrice: "Transfer price",
          workspacePassword: "Team workspace password",
          footerEmail: "Footer email",
          footerWebsite: "Footer website",
          actions: "Publication actions",
          refresh: "Reload saved data",
          refreshConfirm:
            "Discard the current unsaved changes and reload the saved data?",
          resetConfirm:
            "Discard the current changes and reset the form to its default values?",
          changes: "Unsaved changes",
          changesHint: "Save locally before leaving this page.",
          noChanges: "All changes saved",
          saveLocal: "Save locally",
          publish: "Publish online (demo mode)",
          reset: "Reset",
          status: "Status",
          statusReady: "Ready for publication",
          payload: "JSON payload to send to backend",
          blocks: "Configuration blocks",
          blockGeneral: "General settings",
          blockVisibility: "Visibility",
          blockHero: "Hero content",
          blockPlanning: "Planning & documents",
          blockCommercial: "License & contact",
          ready: "Ready",
          saveSuccess: "Configuration saved locally.",
          publishSuccess:
            "Demo publication completed. Connect your Java endpoint here later.",
          resetSuccess: "Form reset to default values.",
        }
      : {
          adminBadge: "Dashboard Administrateur",
          mode: "Mode édition",
          title: "Configuration complète de https://cs-fifve.patelot.de/",
          subtitle:
            "Préparez les paramètres du site en mode frontend. Plus tard, ce payload sera envoyé à vos endpoints Java pour publication en ligne.",
          logout: "Déconnexion",
          stats: {
            sections: "Sections actives",
            save: "Dernière sauvegarde",
            publication: "Publication",
            none: "Aucune",
            notPublished: "Non publiée",
          },
          generalTitle: "Paramètres généraux",
          siteName: "Nom du site",
          defaultLanguage: "Langue par défaut",
          sloganFr: "Slogan FR",
          sloganEn: "Slogan EN",
          visibility: "Visibilité des sections",
          hero: "Contenu Hero (FR / EN)",
          badgeFr: "Badge FR",
          badgeEn: "Badge EN",
          titleFr: "Titre FR",
          titleEn: "Titre EN",
          meeting: "Réunion, programmation et documents",
          meetLink: "Lien Google Meet",
          dateFr: "Date FR",
          dateEn: "Date EN",
          releaseIso: "Publication programmation (ISO)",
          linkOne: "Lien programmation 1",
          linkTwo: "Lien programmation 2",
          reglement: "URL Règlement PDF",
          charte: "URL Charte PDF",
          licence: "Licence, espace équipe et footer",
          newLicensePrice: "Prix nouvelle licence",
          transferPrice: "Prix transfert",
          workspacePassword: "Mot de passe espace équipe",
          footerEmail: "Email footer",
          footerWebsite: "Site web footer",
          actions: "Actions de publication",
          refresh: "Actualiser les données enregistrées",
          refreshConfirm:
            "Abandonner les modifications en cours et recharger les données enregistrées ?",
          resetConfirm:
            "Abandonner les modifications en cours et réinitialiser le formulaire par défaut ?",
          changes: "Modifications non enregistrées",
          changesHint: "Sauvegardez localement avant de quitter ce dashboard.",
          noChanges: "Toutes les modifications sont enregistrées",
          saveLocal: "Sauvegarder localement",
          publish: "Publier en ligne (mode démo)",
          reset: "Réinitialiser",
          status: "Statut",
          statusReady: "Prêt pour la publication",
          payload: "Payload JSON à envoyer au backend",
          blocks: "Blocs de configuration",
          blockGeneral: "Paramètres généraux",
          blockVisibility: "Visibilité",
          blockHero: "Contenu Hero",
          blockPlanning: "Programmation & documents",
          blockCommercial: "Licence & contact",
          ready: "Prêt",
          saveSuccess: "Configuration enregistrée localement.",
          publishSuccess:
            "Publication simulée effectuée. Branchez ici votre endpoint Java plus tard.",
          resetSuccess: "Formulaire réinitialisé sur les valeurs par défaut.",
        };

  const enabledSectionsCount = Object.values(config.sections).filter(
    Boolean,
  ).length;
  const dashboardStats = [
    {
      label: ui.stats.sections,
      value: `${enabledSectionsCount}/${sectionToggles.length}`,
      tone: "blue",
    },
    {
      label: ui.stats.save,
      value: savedAt ? formatDateTime(savedAt) : ui.stats.none,
      tone: "green",
    },
    {
      label: ui.stats.publication,
      value: publishedAt ? formatDateTime(publishedAt) : ui.stats.notPublished,
      tone: "purple",
    },
  ];

  const payloadPreview = useMemo(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const savedConfigRaw = window.localStorage.getItem(
    DASHBOARD_CONFIG_STORAGE_KEY,
  );
  const comparisonConfigRaw =
    savedConfigRaw || JSON.stringify(initialDashboardConfig);
  const hasUnsavedChanges = JSON.stringify(config) !== comparisonConfigRaw;

  const updateSectionField = (section, key, value) => {
    setConfig((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const handleLanguageSelect = (nextLanguage) => {
    setLanguage(nextLanguage);
    setConfig((current) => ({
      ...current,
      site: {
        ...current.site,
        defaultLanguage: nextLanguage,
      },
    }));
  };

  const handleSaveDraft = () => {
    window.localStorage.setItem(
      DASHBOARD_CONFIG_STORAGE_KEY,
      JSON.stringify(config),
    );
    const stamp = new Date().toISOString();
    setSavedAt(stamp);
    setStatusMessage(ui.saveSuccess);
  };

  const handlePublish = () => {
    window.localStorage.setItem(
      DASHBOARD_CONFIG_STORAGE_KEY,
      JSON.stringify(config),
    );
    const stamp = new Date().toISOString();
    window.localStorage.setItem(DASHBOARD_PUBLISHED_AT_STORAGE_KEY, stamp);
    setPublishedAt(stamp);
    setStatusMessage(ui.publishSuccess);
  };

  const handleReset = () => {
    if (hasUnsavedChanges && !window.confirm(ui.resetConfirm)) {
      return;
    }
    setConfig(initialDashboardConfig);
    setStatusMessage(ui.resetSuccess);
  };

  const handleRefresh = () => {
    if (hasUnsavedChanges && !window.confirm(ui.refreshConfirm)) {
      return;
    }

    setConfig(loadDashboardConfig());
    setStatusMessage(ui.noChanges);
  };

  return (
    <div className="dashboard-page min-h-screen px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="dashboard-hero rounded-4xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="status-pill status-pill--primary">
                  {ui.adminBadge}
                </span>
                <span className="status-pill status-pill--neutral">
                  {ui.mode}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl xl:text-[2.1rem]">
                {ui.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
                {ui.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm ring-1 ring-slate-200/80">
                <button
                  type="button"
                  onClick={() => handleLanguageSelect("fr")}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    language === "fr"
                      ? "bg-[#0646c4] text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  aria-pressed={language === "fr"}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSelect("en")}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    language === "en"
                      ? "bg-[#0646c4] text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="dashboard-button dashboard-button--ghost inline-flex items-center gap-2"
              >
                <LogOut size={16} />
                {ui.logout}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {dashboardStats.map((item) => (
              <div
                key={item.label}
                className={`dashboard-stat-card dashboard-stat-card--${item.tone}`}
              >
                <p className="dashboard-stat-card__label">{item.label}</p>
                <p className="dashboard-stat-card__value">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="dashboard-workspace">
          <nav className="dashboard-block-nav" aria-label={ui.blocks}>
            <div className="dashboard-block-nav__heading">
              <span>{ui.blocks}</span>
              <strong>
                {enabledSectionsCount} / {sectionToggles.length}
              </strong>
            </div>
            <a
              href="#dashboard-general"
              className="dashboard-block-nav__item dashboard-block-nav__item--active"
            >
              <Settings2 size={16} />
              <span>
                <b>01</b>
                {ui.blockGeneral}
              </span>
            </a>
            <a
              href="#dashboard-visibility"
              className="dashboard-block-nav__item"
            >
              <Eye size={16} />
              <span>
                <b>02</b>
                {ui.blockVisibility}
              </span>
            </a>
            <a href="#dashboard-hero" className="dashboard-block-nav__item">
              <LayoutTemplate size={16} />
              <span>
                <b>03</b>
                {ui.blockHero}
              </span>
            </a>
            <a href="#dashboard-planning" className="dashboard-block-nav__item">
              <CalendarDays size={16} />
              <span>
                <b>04</b>
                {ui.blockPlanning}
              </span>
            </a>
            <a
              href="#dashboard-commercial"
              className="dashboard-block-nav__item"
            >
              <CreditCard size={16} />
              <span>
                <b>05</b>
                {ui.blockCommercial}
              </span>
            </a>
            <a href="#dashboard-payload" className="dashboard-block-nav__item">
              <FileText size={16} />
              <span>
                <b>JSON</b>
                {ui.payload}
              </span>
            </a>
          </nav>

          <div className="dashboard-content grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5">
              <section
                className="dashboard-card"
                data-block="01"
                id="dashboard-general"
              >
                <div className="dashboard-card__header">
                  <div className="dashboard-card__title-wrap">
                    <span className="dashboard-card__icon">
                      <Settings2 size={18} />
                    </span>
                    <h2>{ui.generalTitle}</h2>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="dashboard-field">
                    <span>{ui.siteName}</span>
                    <input
                      value={config.site.siteName}
                      onChange={(event) =>
                        updateSectionField(
                          "site",
                          "siteName",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>

                  <label className="dashboard-field">
                    <span>{ui.defaultLanguage}</span>
                    <select
                      value={config.site.defaultLanguage}
                      onChange={(event) => {
                        const nextLanguage = event.target.value;
                        updateSectionField(
                          "site",
                          "defaultLanguage",
                          nextLanguage,
                        );
                        handleLanguageSelect(nextLanguage);
                      }}
                      className="dashboard-input"
                    >
                      <option value="fr">fr</option>
                      <option value="en">en</option>
                    </select>
                  </label>

                  <label className="dashboard-field">
                    <span>{ui.sloganFr}</span>
                    <input
                      value={config.site.sloganFr}
                      onChange={(event) =>
                        updateSectionField(
                          "site",
                          "sloganFr",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>

                  <label className="dashboard-field">
                    <span>{ui.sloganEn}</span>
                    <input
                      value={config.site.sloganEn}
                      onChange={(event) =>
                        updateSectionField(
                          "site",
                          "sloganEn",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                </div>
              </section>

              <section
                className="dashboard-card"
                data-block="02"
                id="dashboard-visibility"
              >
                <h2 className="dashboard-card__title">{ui.visibility}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sectionToggles.map((item) => (
                    <label key={item.key} className="dashboard-toggle-item">
                      <input
                        type="checkbox"
                        checked={config.sections[item.key]}
                        onChange={(event) =>
                          updateSectionField(
                            "sections",
                            item.key,
                            event.target.checked,
                          )
                        }
                        className="dashboard-toggle"
                      />
                      <span
                        className="dashboard-toggle-track"
                        aria-hidden="true"
                      >
                        <span className="dashboard-toggle-thumb" />
                      </span>
                      <span className="dashboard-toggle-label">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section
                className="dashboard-card"
                data-block="03"
                id="dashboard-hero"
              >
                <h2 className="dashboard-card__title">{ui.hero}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="dashboard-field sm:col-span-2">
                    <span>{ui.badgeFr}</span>
                    <input
                      value={config.hero.badgeFr}
                      onChange={(event) =>
                        updateSectionField(
                          "hero",
                          "badgeFr",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field sm:col-span-2">
                    <span>{ui.badgeEn}</span>
                    <input
                      value={config.hero.badgeEn}
                      onChange={(event) =>
                        updateSectionField(
                          "hero",
                          "badgeEn",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>{ui.titleFr}</span>
                    <textarea
                      rows={3}
                      value={config.hero.titleFr}
                      onChange={(event) =>
                        updateSectionField(
                          "hero",
                          "titleFr",
                          event.target.value,
                        )
                      }
                      className="dashboard-input dashboard-input--textarea"
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>{ui.titleEn}</span>
                    <textarea
                      rows={3}
                      value={config.hero.titleEn}
                      onChange={(event) =>
                        updateSectionField(
                          "hero",
                          "titleEn",
                          event.target.value,
                        )
                      }
                      className="dashboard-input dashboard-input--textarea"
                    />
                  </label>
                </div>
              </section>

              <section
                className="dashboard-card"
                data-block="04"
                id="dashboard-planning"
              >
                <h2 className="dashboard-card__title">{ui.meeting}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.meetLink}
                    </span>
                    <input
                      value={config.meeting.meetingUrl}
                      onChange={(event) =>
                        updateSectionField(
                          "meeting",
                          "meetingUrl",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.dateFr}
                    </span>
                    <input
                      value={config.meeting.dateFr}
                      onChange={(event) =>
                        updateSectionField(
                          "meeting",
                          "dateFr",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.dateEn}
                    </span>
                    <input
                      value={config.meeting.dateEn}
                      onChange={(event) =>
                        updateSectionField(
                          "meeting",
                          "dateEn",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.releaseIso}
                    </span>
                    <input
                      value={config.schedule.releaseDateIso}
                      onChange={(event) =>
                        updateSectionField(
                          "schedule",
                          "releaseDateIso",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.linkOne}
                    </span>
                    <input
                      value={config.schedule.linkOne}
                      onChange={(event) =>
                        updateSectionField(
                          "schedule",
                          "linkOne",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.linkTwo}
                    </span>
                    <input
                      value={config.schedule.linkTwo}
                      onChange={(event) =>
                        updateSectionField(
                          "schedule",
                          "linkTwo",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.reglement}
                    </span>
                    <input
                      value={config.documents.reglementUrl}
                      onChange={(event) =>
                        updateSectionField(
                          "documents",
                          "reglementUrl",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {ui.charte}
                    </span>
                    <input
                      value={config.documents.charteUrl}
                      onChange={(event) =>
                        updateSectionField(
                          "documents",
                          "charteUrl",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0646c4]"
                    />
                  </label>
                </div>
              </section>

              <section
                className="dashboard-card"
                data-block="05"
                id="dashboard-commercial"
              >
                <h2 className="dashboard-card__title">{ui.licence}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="dashboard-field">
                    <span>{ui.newLicensePrice}</span>
                    <input
                      value={config.license.newLicensePrice}
                      onChange={(event) =>
                        updateSectionField(
                          "license",
                          "newLicensePrice",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>{ui.transferPrice}</span>
                    <input
                      value={config.license.transferPrice}
                      onChange={(event) =>
                        updateSectionField(
                          "license",
                          "transferPrice",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field sm:col-span-2">
                    <span>{ui.workspacePassword}</span>
                    <input
                      value={config.teamWorkspace.workspacePassword}
                      onChange={(event) =>
                        updateSectionField(
                          "teamWorkspace",
                          "workspacePassword",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>{ui.footerEmail}</span>
                    <input
                      value={config.footer.email}
                      onChange={(event) =>
                        updateSectionField(
                          "footer",
                          "email",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>{ui.footerWebsite}</span>
                    <input
                      value={config.footer.website}
                      onChange={(event) =>
                        updateSectionField(
                          "footer",
                          "website",
                          event.target.value,
                        )
                      }
                      className="dashboard-input"
                    />
                  </label>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="dashboard-card dashboard-card--sticky dashboard-actions-card">
                <h2 className="dashboard-card__title">{ui.actions}</h2>
                <div
                  className={`dashboard-change-state ${
                    hasUnsavedChanges
                      ? "dashboard-change-state--warning"
                      : "dashboard-change-state--ok"
                  }`}
                >
                  <span className="dashboard-change-state__dot" />
                  <span>
                    <strong>
                      {hasUnsavedChanges ? ui.changes : ui.noChanges}
                    </strong>
                    <small>
                      {hasUnsavedChanges ? ui.changesHint : ui.statusReady}
                    </small>
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="dashboard-button dashboard-button--refresh inline-flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    {ui.refresh}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="dashboard-button dashboard-button--secondary inline-flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {ui.saveLocal}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="dashboard-button dashboard-button--primary inline-flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {ui.publish}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="dashboard-button dashboard-button--danger inline-flex items-center justify-center gap-2"
                  >
                    {ui.reset}
                  </button>
                </div>
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/80 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    {ui.status}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {statusMessage || ui.statusReady}
                  </p>
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {language === "en"
                    ? "When you connect the Java backend, replace handlePublish with a POST/PUT call to your endpoints."
                    : "Quand vous brancherez le backend Java, remplacez handlePublish par un appel POST/PUT vers vos endpoints."}
                </p>
              </section>

              <section className="dashboard-card" id="dashboard-payload">
                <h2 className="dashboard-card__title">{ui.payload}</h2>
                <pre className="dashboard-preview mt-3 max-h-112 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-cyan-100">
                  {payloadPreview}
                </pre>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
