import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Code,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Handshake,
  House,
  Image as ImageIcon,
  Layers,
  ListChecks,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Search,
  Send,
  Settings,
  Trophy,
  Users,
  ChartColumn,
  X,
} from "lucide-react";
import DashboardEditor, {
  loadDashboardConfig,
} from "./DashboardPage";
import {
  getDashboardSummary,
  getRecentChanges,
  getSectionStatus,
  publishConfig,
} from "../../services/adminApi";

const PUBLISHED_KEY = "fifve-dashboard-published-at";
const SITE_URL = "https://cs-fifve.patelot.de/";

const NAV_GROUPS = [
  {
    label: "Contenu du site",
    items: [
      { id: "settings", label: "Paramètres généraux", icon: Settings },
      { id: "home", label: "Page d'accueil", icon: House },
      { id: "hero", label: "Hero", icon: ImageIcon },
      { id: "sections", label: "Sections du site", icon: Layers },
      { id: "visibility", label: "Sichtbarkeit", icon: Eye },
      { id: "planning", label: "Programmation", icon: CalendarDays },
      { id: "documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Tournoi",
    items: [
      { id: "teams", label: "Mannschaften", icon: Users },
      { id: "matches", label: "Programmation (Matchs)", icon: CalendarDays },
      { id: "ranking", label: "Rangliste", icon: Trophy },
      { id: "stats", label: "Statistiques", icon: ChartColumn },
      { id: "points", label: "Module de points", icon: ListChecks },
      { id: "selected", label: "Équipes sélectionnées", icon: Handshake },
    ],
  },
  {
    label: "Verwaltung",
    items: [
      { id: "licenses", label: "Lizenzen", icon: CreditCard },
      { id: "workspace", label: "Espace équipe", icon: Users },
      { id: "location", label: "Lieu / Événement", icon: MapPin },
      { id: "contact", label: "Contact", icon: Mail },
    ],
  },
  {
    label: "Système",
    items: [
      { id: "payload", label: "API / Payload", icon: Code },
      { id: "preferences", label: "Einstellungen", icon: Settings },
    ],
  },
];

const QUICK_ACCESS = [
  { id: "hero", title: "Page d'accueil / Hero", desc: "Titre, slogan, images", icon: ImageIcon, tone: "bg-blue-100 text-blue-600" },
  { id: "teams", title: "Mannschaften", desc: "Équipes inscrites", icon: Users, tone: "bg-emerald-100 text-emerald-600" },
  { id: "documents", title: "Documents", desc: "Règlements et fichiers", icon: FileText, tone: "bg-orange-100 text-orange-600" },
  { id: "planning", title: "Programmation", desc: "Matchs et horaires", icon: CalendarDays, tone: "bg-violet-100 text-violet-600" },
  { id: "ranking", title: "Rangliste", desc: "Classement du tournoi", icon: Trophy, tone: "bg-amber-100 text-amber-600" },
  { id: "licenses", title: "Lizenzen", desc: "Licences et tarifs", icon: CreditCard, tone: "bg-rose-100 text-rose-600" },
];

const CHANGE_ICONS = {
  hero: ImageIcon,
  team: Users,
  document: FileText,
  schedule: CalendarDays,
};

function fmtDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Sidebar({ active, onSelect, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0b1630] text-slate-300 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <img
            src="/images/logo_fifve.jpeg"
            alt="FIFVE"
            className="size-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-white">FIFVE 2027</p>
            <p className="text-[11px] text-slate-400">Football our Passion</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-slate-400 lg:hidden"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <button
            type="button"
            onClick={() => onSelect("dashboard")}
            className={`mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active === "dashboard"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "hover:bg-white/5"
            }`}
          >
            <House size={18} /> Dashboard
          </button>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {group.label}
              </p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                    active === id
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <a
          href={SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 text-xs hover:bg-white/10"
        >
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-white">Site en ligne</span>
            <span className="block truncate text-slate-400">
              cs-fifve.patelot.de
            </span>
          </span>
          <ExternalLink size={14} />
        </a>
      </aside>
    </>
  );
}

function Topbar({ language, setLanguage, onMenu, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>
      <label className="relative hidden max-w-md flex-1 sm:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          placeholder="Rechercher une section, une équipe, un document..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
      </label>
      <div className="ml-auto flex items-center gap-3">
        <label className="relative">
          <Globe
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-8 pr-8 text-sm font-semibold text-slate-700 outline-none"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </label>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex"
        >
          <ExternalLink size={14} /> Voir le site
        </a>
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
          <span className="grid size-9 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
            PK
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-900">
              Patrick Kamdem
            </span>
            <span className="block text-xs text-slate-500">Administrateur</span>
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function KpiCard({ label, value, sub, tone, icon: Icon }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-5 ${tone.card}`}>
      <span className={`grid size-12 place-items-center rounded-xl ${tone.icon}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="truncate text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function Card({ title, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Overview({ config, onSelect, publishedAt, onPublish, notice }) {
  const [summary, setSummary] = useState(null);
  const [changes, setChanges] = useState([]);
  const [sections, setSections] = useState([]);
  const sectionsKey = JSON.stringify(config.sections);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getDashboardSummary(config),
      getRecentChanges(),
      getSectionStatus(config),
    ]).then(([s, c, st]) => {
      if (cancelled) return;
      setSummary(s);
      setChanges(c);
      setSections(st);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsKey]);

  if (!summary) return <p className="p-6 text-sm text-slate-500">Chargement…</p>;

  const disabled = summary.totalSections - summary.activeSections;
  const rows = [
    ["Nom du site", config.site?.siteName],
    ["Slogan FR", config.site?.sloganFr],
    ["Slogan EN", config.site?.sloganEn],
    ["Langue par défaut", (config.site?.defaultLanguage || "fr").toUpperCase()],
    ["Sections actives", `${summary.activeSections} / ${summary.totalSections}`],
    ["Équipes inscrites", summary.teams],
    ["Matchs programmés", summary.matches],
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Bonjour Patrick 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez le contenu de votre site FIFVE 2027 et publiez vos
            modifications en un clic.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="size-2 rounded-full bg-emerald-500" /> Site en ligne
          </span>
          <span className="text-xs text-slate-500">
            Dernière publication : {fmtDateTime(publishedAt)}
          </span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Eye size={15} /> Voir le site
          </a>
          <button
            type="button"
            onClick={onPublish}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700"
          >
            <Send size={15} /> Publier les modifications
          </button>
        </div>
      </div>

      {notice && (
        <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
          {notice}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Site web"
          value={summary.online ? "EN LIGNE" : "HORS LIGNE"}
          sub={summary.siteUrl}
          icon={Globe}
          tone={{ card: "bg-blue-50", icon: "bg-blue-100 text-blue-600" }}
        />
        <KpiCard
          label="Sections actives"
          value={`${summary.activeSections} / ${summary.totalSections}`}
          sub={`${disabled} section${disabled > 1 ? "s" : ""} désactivée${disabled > 1 ? "s" : ""}`}
          icon={Layers}
          tone={{ card: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600" }}
        />
        <KpiCard
          label="Équipes"
          value={summary.teams}
          sub="inscrites"
          icon={Users}
          tone={{ card: "bg-violet-50", icon: "bg-violet-100 text-violet-600" }}
        />
        <KpiCard
          label="Matchs programmés"
          value={summary.matches}
          sub={`sur ${summary.matchDays} jours`}
          icon={CalendarDays}
          tone={{ card: "bg-orange-50", icon: "bg-orange-100 text-orange-600" }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Accès rapide">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {QUICK_ACCESS.map(({ id, title, desc, icon: Icon, tone }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-blue-300 hover:shadow-md"
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}>
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">
                      {title}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {desc}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                  />
                </button>
              ))}
            </div>
          </Card>

          <Card title="Aperçu du tournoi">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative min-h-56 overflow-hidden rounded-xl">
                <img
                  src="/images/veterans-3e-mi-temps-karlsruhe.jpg"
                  alt="FIFVE 2027"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-extrabold">Week-End FIFVE 2027</p>
                  <p className="text-sm text-slate-200">24.–26. Juli 2027</p>
                  <p className="text-xs text-slate-300">Karlsruhe, Deutschland</p>
                  <button
                    type="button"
                    onClick={() => onSelect("settings")}
                    className="mt-3 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"
                  >
                    Modifier les informations
                  </button>
                </div>
              </div>
              <dl className="divide-y divide-slate-100 text-sm">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {v ?? "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="Dernières modifications"
            action={
              <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                Voir tout
              </button>
            }
          >
            <ul className="space-y-3">
              {changes.map((c) => {
                const Icon = CHANGE_ICONS[c.type] || FileText;
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {c.title}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {c.author} · {fmtDateTime(c.at)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card
            title="Statut des sections du site"
            action={
              <button
                type="button"
                onClick={() => onSelect("visibility")}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Gérer
              </button>
            }
          >
            <ul className="space-y-2.5">
              {sections.map((s) => (
                <li key={s.key} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`size-2 rounded-full ${s.active ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  <span className="flex-1 text-slate-700">{s.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      s.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.active ? "Actif" : "Inactif"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage({ language, setLanguage, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [config, setConfig] = useState(() => loadDashboardConfig());
  const [publishedAt, setPublishedAt] = useState(() =>
    window.localStorage.getItem(PUBLISHED_KEY),
  );
  const [notice, setNotice] = useState("");

  const select = (id) => {
    setView(id);
    setMenuOpen(false);
    if (id === "dashboard") setConfig(loadDashboardConfig());
    window.scrollTo({ top: 0 });
  };

  const publish = async () => {
    try {
      const result = await publishConfig(loadDashboardConfig());
      const stamp = result?.publishedAt || new Date().toISOString();
      window.localStorage.setItem(PUBLISHED_KEY, stamp);
      setPublishedAt(stamp);
      setNotice("Modifications publiées.");
    } catch {
      setNotice("Échec de la publication.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans text-slate-900">
      <Sidebar
        active={view}
        onSelect={select}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="lg:pl-64">
        <Topbar
          language={language}
          setLanguage={setLanguage}
          onMenu={() => setMenuOpen(true)}
          onLogout={onLogout}
        />
        {view === "dashboard" ? (
          <Overview
            config={config}
            onSelect={select}
            publishedAt={publishedAt}
            onPublish={publish}
            notice={notice}
          />
        ) : (
          <DashboardEditor
            language={language}
            setLanguage={setLanguage}
            onLogout={onLogout}
          />
        )}
      </div>
    </div>
  );
}
