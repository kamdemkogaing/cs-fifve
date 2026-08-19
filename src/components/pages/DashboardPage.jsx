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
  { key: "hero", label: "Section accueil / Hero" },
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
  { key: "footer", label: "Section footer" },
];

const editablePublicBlocks = [
  ["hero", "Hero / accueil"],
  ["meeting", "Reunion"],
  ["documents", "Documents"],
  ["license", "Licence"],
  ["teamWorkspace", "Espace equipe"],
  ["team", "Equipes"],
  ["stats", "Statistiques"],
  ["module", "Module"],
  ["ranking", "Classement"],
  ["selected", "Equipes retenues"],
  ["schedule", "Programmation"],
  ["location", "Lieu"],
  ["footer", "Footer"],
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
    hero: true,
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
    footer: true,
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
  publicContent: {
    hero: {
      badge: "Week-End FIFVE 2026",
      title: "Classement officiel, module de points et equipes retenues",
      subtitle:
        "Page officielle de presentation des informations sportives de l'edition 2026.",
    },
    meeting: {
      badge: "Seance de travail",
      title: "Reunion a venir",
      subtitle: "Aucune reunion n'est prevue pour le moment.",
    },
    documents: {
      badge: "Documents officiels",
      title: "Telechargez les documents de reference du tournoi",
      subtitle: "Retrouvez les documents officiels du Week-end FIFVE 2026.",
    },
    license: {
      badge: "Inscription licence",
      title: "Demandez votre licence FIFVE",
      subtitle:
        "Completez votre inscription pour participer aux activites FIFVE.",
    },
    teamWorkspace: {
      badge: "Espace equipe",
      title: "Votre espace equipe",
      subtitle: "Retrouvez les ressources et informations de votre equipe.",
    },
    team: {
      title: "Equipes participantes",
      subtitle: "Decouvrez les clubs et equipes de la FIFVE.",
    },
    stats: {
      title: "Les chiffres du tournoi",
      subtitle: "Une vue rapide des indicateurs de la competition.",
    },
    module: {
      title: "Module de classement FIFVE 2026",
      subtitle: "Les regles et points qui structurent le classement.",
    },
    ranking: {
      title: "Classement actuel des 54 equipes FIFVE",
      subtitle: "Consultez le classement actualise des equipes.",
    },
    selected: {
      title: "24 equipes retenues pour la FIFVE 2026",
      subtitle: "Les equipes selectionnees pour le Week-end FIFVE.",
    },
    schedule: {
      badge: "Programmation des matchs",
      title: "Combinaisons des rencontres FIFVE Cologne 2026",
      subtitle: "La programmation officielle des rencontres.",
    },
    location: {
      title: "Lieu du Week-end FIFVE",
      subtitle: "Toutes les informations pratiques pour rejoindre l'evenement.",
    },
    footer: { email: "bureau@fifve.com", website: "https://www.fifve.com" },
  },
};

export function loadDashboardConfig() {
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
      publicContent: Object.keys(initialDashboardConfig.publicContent).reduce(
        (content, key) => ({
          ...content,
          [key]: {
            ...initialDashboardConfig.publicContent[key],
            ...parsed.publicContent?.[key],
          },
        }),
        {},
      ),
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
          publicBlocks: "Public page blocks",
          publicHint:
            "Edit the visible content of each section on the main page.",
          publicBadge: "Badge / label",
          publicTitle: "Section title",
          publicSubtitle: "Section description",
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
          publicBlocks: "Blocs de la page publique",
          publicHint:
            "Modifiez le contenu visible de chaque section de la page principale.",
          publicBadge: "Badge / libelle",
          publicTitle: "Titre de section",
          publicSubtitle: "Description de section",
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
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-7 sm:py-7 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-inset ring-blue-100">
                  {ui.adminBadge}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 ring-1 ring-inset ring-slate-200">
                  {ui.mode}
                </span>
              </div>
              <h1 className="mt-4 max-w-4xl text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl xl:text-[2.15rem]">
                {ui.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
                {ui.subtitle}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3 xl:justify-end">
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
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
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                <LogOut size={16} />
                {ui.logout}
              </button>
            </div>
          </div>

          <div className="grid gap-px border-t border-slate-200 bg-slate-200 md:grid-cols-3">
            {dashboardStats.map((item) => (
              <div key={item.label} className="bg-white px-5 py-4 sm:px-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <nav
            className="sticky top-5 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block"
            aria-label={ui.blocks}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-2 pb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <span>{ui.blocks}</span>
              <strong>
                {enabledSectionsCount} / {sectionToggles.length}
              </strong>
            </div>
            <a
              href="#dashboard-general"
              className="group flex items-center gap-3 rounded-xl bg-slate-950 px-3 py-3 text-sm font-semibold text-white transition"
            >
              <Settings2 size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[10px] opacity-60">01</b>
                {ui.blockGeneral}
              </span>
            </a>
            <a
              href="#dashboard-visibility"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Eye size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[10px] opacity-60">02</b>
                {ui.blockVisibility}
              </span>
            </a>
            <a
              href="#dashboard-hero"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <LayoutTemplate size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[10px] opacity-60">03</b>
                {ui.blockHero}
              </span>
            </a>
            <a
              href="#dashboard-planning"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <CalendarDays size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[10px] opacity-60">04</b>
                {ui.blockPlanning}
              </span>
            </a>
            <a
              href="#dashboard-commercial"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <CreditCard size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[10px] opacity-60">05</b>
                {ui.blockCommercial}
              </span>
            </a>
            <a
              href="#dashboard-payload"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <FileText size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[9px] opacity-60">JSON</b>
                {ui.payload}
              </span>
            </a>
            <a
              href="#dashboard-public-content"
              className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <LayoutTemplate size={16} />
              <span className="flex min-w-0 items-center gap-2">
                <b className="text-[9px] opacity-60">PUBLIC</b>
                {ui.publicBlocks}
              </span>
            </a>
          </nav>

          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                id="dashboard-public-content"
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
                      <LayoutTemplate size={18} />
                    </span>
                    <div>
                      <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                        {ui.publicBlocks}
                      </h2>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {ui.publicHint}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {editablePublicBlocks.map(([key, label]) => (
                    <fieldset
                      className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 [&>legend]:px-2 [&>legend]:text-sm [&>legend]:font-bold [&>legend]:text-slate-800"
                      key={key}
                    >
                      <legend>{label}</legend>
                      {key !== "footer" && (
                        <>
                          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
                            <span>{ui.publicBadge}</span>
                            <input
                              value={config.publicContent[key]?.badge || ""}
                              onChange={(event) =>
                                updateSectionField("publicContent", key, {
                                  ...config.publicContent[key],
                                  badge: event.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </label>
                          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
                            <span>{ui.publicTitle}</span>
                            <input
                              value={config.publicContent[key]?.title || ""}
                              onChange={(event) =>
                                updateSectionField("publicContent", key, {
                                  ...config.publicContent[key],
                                  title: event.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </label>
                          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
                            <span>{ui.publicSubtitle}</span>
                            <textarea
                              rows={2}
                              value={config.publicContent[key]?.subtitle || ""}
                              onChange={(event) =>
                                updateSectionField("publicContent", key, {
                                  ...config.publicContent[key],
                                  subtitle: event.target.value,
                                })
                              }
                              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </label>
                        </>
                      )}
                      {key === "footer" && (
                        <>
                          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
                            <span>{ui.footerEmail}</span>
                            <input
                              value={config.publicContent.footer?.email || ""}
                              onChange={(event) =>
                                updateSectionField("publicContent", "footer", {
                                  ...config.publicContent.footer,
                                  email: event.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </label>
                          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
                            <span>{ui.footerWebsite}</span>
                            <input
                              value={config.publicContent.footer?.website || ""}
                              onChange={(event) =>
                                updateSectionField("publicContent", "footer", {
                                  ...config.publicContent.footer,
                                  website: event.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </label>
                        </>
                      )}
                    </fieldset>
                  ))}
                </div>
              </section>

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                data-variant="general"
                data-block="01"
                id="dashboard-general"
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
                      <Settings2 size={18} />
                    </span>
                    <h2 className="pt-2 text-base font-bold tracking-[-0.01em] text-slate-950">
                      {ui.generalTitle}
                    </h2>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>

                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="fr">fr</option>
                      <option value="en">en</option>
                    </select>
                  </label>

                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>

                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>
              </section>

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                data-variant="visibility"
                data-block="02"
                id="dashboard-visibility"
              >
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.visibility}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sectionToggles.map((item) => (
                    <label
                      key={item.key}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                    >
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
                        className="peer sr-only"
                      />
                      <span
                        className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-blue-600 peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/20"
                        aria-hidden="true"
                      >
                        <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                data-variant="hero"
                data-block="03"
                id="dashboard-hero"
              >
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.hero}
                </h2>
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>
              </section>

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                data-variant="planning"
                data-block="04"
                id="dashboard-planning"
              >
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.meeting}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 sm:col-span-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>
              </section>

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                data-variant="commercial"
                data-block="05"
                id="dashboard-commercial"
              >
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.licence}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.actions}
                </h2>
                <div
                  className={`mt-4 flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm ${
                    hasUnsavedChanges
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-current" />
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
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <RefreshCw size={16} />
                    {ui.refresh}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    <Save size={16} />
                    {ui.saveLocal}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <Send size={16} />
                    {ui.publish}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100"
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

              <section
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                id="dashboard-payload"
              >
                <h2 className="text-base font-bold tracking-[-0.01em] text-slate-950">
                  {ui.payload}
                </h2>
                <pre className="mt-3 max-h-128 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] leading-5 text-slate-300">
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
