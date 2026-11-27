import { Sparkles, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import {
  loadDashboardConfig,
  WELCOME_MODAL_AVAILABLE,
} from "./components/pages/DashboardPage";
import ClubTeamSection from "./components/sections/ClubTeamSection";
import DocumentsSection from "./components/sections/DocumentsSection";
import HeroSection from "./components/sections/HeroSection";
import HostClubBanner from "./components/sections/HostClubBanner";
import LocationSection from "./components/sections/LocationSection";
import ModuleSection from "./components/sections/ModuleSection";
import QuickNavigationSection from "./components/sections/QuickNavigationSection";
import RankingPreview from "./components/sections/RankingPreview";
import RankingSection from "./components/sections/RankingSection";
import ScheduleSection from "./components/sections/ScheduleSection";
import StatsSection from "./components/sections/StatsSection";
import { fifveDataService } from "./services/publicDataService";
import { getTranslations, normalizeLanguage } from "./i18n";

const ADMIN_AUTH_STORAGE_KEY = "fifve-admin-auth";
const ExportActionsSection = lazy(
  () => import("./components/sections/ExportActionsSection"),
);
const DashboardPage = lazy(
  () => import("./components/pages/AdminDashboardPage"),
);
const LoginPage = lazy(() => import("./components/pages/LoginPage"));
const LicenseApplicationSection = lazy(
  () => import("./components/sections/LicenseApplicationSection"),
);
const TeamWorkspaceSection = lazy(
  () => import("./components/sections/TeamWorkspaceSection"),
);
const ranking = fifveDataService.getRanking();
const selectedTeamsByCountry = fifveDataService.getSelectedTeams();
const classementRules = fifveDataService.getClassificationRules();
const licenseTeams = selectedTeamsByCountry.flatMap(({ country, teams }) =>
  teams.map((team) => ({ ...team, country })),
);

function normalizePathname(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

function getRemainingParts(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function App() {
  const showExportSection = false;
  const [pathname, setPathname] = useState(() =>
    normalizePathname(window.location.pathname),
  );
  const isLoginPage = pathname === "/admin/login";
  const isDashboardPage = pathname === "/admin/dashboard";
  const isRankingPage = pathname === "/classement";
  const isTeamSpacePage = pathname === "/espace-cs";
  const isLicensePage = pathname === "/licences";
  const isTeamsPage = pathname === "/equipes";
  const isSchedulePage = pathname === "/programmation";
  const isLocationPage = pathname === "/lieu";
  const isModulePage = pathname === "/module";
  const isContentRoutePage =
    isTeamsPage || isSchedulePage || isLocationPage || isModulePage;

  const [language, setLanguage] = useState(() => {
    const stored = window.localStorage.getItem("fifve-language");
    return normalizeLanguage(stored);
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "1";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const dashboardConfig = loadDashboardConfig();
  const publicContent = dashboardConfig.publicContent;
  const scheduleReleaseIso = dashboardConfig.schedule.releaseDateIso;
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (!WELCOME_MODAL_AVAILABLE) {
      return false;
    }

    if (typeof window === "undefined") {
      return true;
    }

    return (
      dashboardConfig.sections.welcomeModal &&
      !window.localStorage.getItem("fifve-welcome-modal-seen")
    );
  });
  const t = getTranslations(language);
  const defaultTeamContent = getTranslations("fr").team;
  const getPublicSection = (sectionName) => {
    const translated = t[sectionName] || {};
    const configured = publicContent[sectionName] || {};
    const section = { ...translated, ...configured };

    if (language === "en") {
      ["badge", "title", "subtitle"].forEach((field) => {
        if (translated[field] !== undefined) {
          section[field] = translated[field];
        }
      });
    }

    return section;
  };
  const translatedHero = getPublicSection("hero");
  const publicTranslations = {
    ...t,
    hero: {
      ...translatedHero,
      badge:
        language === "en"
          ? dashboardConfig.hero.badgeEn
          : translatedHero.badge || dashboardConfig.hero.badgeFr,
      title:
        language === "en"
          ? dashboardConfig.hero.titleEn
          : translatedHero.title || dashboardConfig.hero.titleFr,
      subtitle:
        language === "en"
          ? dashboardConfig.hero.subtitleEn
          : translatedHero.subtitle || dashboardConfig.hero.subtitleFr,
    },
    documents: {
      ...getPublicSection("documents"),
      reglementHref: dashboardConfig.documents.reglementUrl,
      charteHref: dashboardConfig.documents.charteUrl,
      updatedValue:
        language === "en"
          ? dashboardConfig.documents.updatedEn
          : dashboardConfig.documents.updatedFr,
    },
    license: {
      ...getPublicSection("license"),
      amountValue: `${dashboardConfig.license.newLicensePrice} EUR`,
      transferAmountValue: `${dashboardConfig.license.transferPrice} EUR`,
    },
    teamWorkspace: getPublicSection("teamWorkspace"),
    team: {
      ...t.team,
      ...publicContent.team,
      title:
        publicContent.team.title === defaultTeamContent.title
          ? t.team.title
          : publicContent.team.title,
      subtitle:
        publicContent.team.subtitle === defaultTeamContent.subtitle
          ? t.team.subtitle
          : publicContent.team.subtitle,
    },
    stats: getPublicSection("stats"),
    module: getPublicSection("module"),
    ranking: getPublicSection("ranking"),
    schedule: {
      ...getPublicSection("schedule"),
      linkOneUrl: dashboardConfig.schedule.linkOne,
    },
    location: getPublicSection("location"),
    footer: {
      ...t.footer,
      email: dashboardConfig.footer.email,
      website: dashboardConfig.footer.website,
      contactPerson: dashboardConfig.footer.contactPerson,
    },
  };
  publicTranslations.ranking.title = publicTranslations.ranking.title.replace(
    /\d+/,
    String(ranking.length),
  );

  useEffect(() => {
    window.localStorage.setItem("fifve-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePathname(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scheduleReleaseTimestamp = Date.parse(scheduleReleaseIso);
  const isScheduleVisible = currentTime >= scheduleReleaseTimestamp;
  const releaseDateLabel = new Date(scheduleReleaseTimestamp).toLocaleString(
    language === "en" ? "en-GB" : "fr-FR",
    {
      timeZone: "Europe/Berlin",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const remainingMs = Math.max(0, scheduleReleaseTimestamp - currentTime);
  const remaining = getRemainingParts(remainingMs);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
    window.localStorage.setItem("fifve-welcome-modal-seen", "true");
  };

  const navigateTo = (nextPathname) => {
    const normalized = normalizePathname(nextPathname);
    if (normalized === pathname) {
      return;
    }

    window.history.pushState({}, "", normalized);
    setPathname(normalized);
    window.scrollTo(0, 0);
  };

  const navigateFromLink = (event, nextPathname) => {
    event.preventDefault();
    navigateTo(nextPathname);
  };

  const handleLoginSuccess = () => {
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "1");
    setIsAdminAuthenticated(true);
    navigateTo("/admin/dashboard");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    setIsAdminAuthenticated(false);
    navigateTo("/admin/login");
  };

  if (isDashboardPage && !isAdminAuthenticated) {
    return (
      <Suspense fallback={<p role="status">{t.header.loading}</p>}>
        <LoginPage
          language={language}
          setLanguage={setLanguage}
          t={t.login}
          onLoginSuccess={handleLoginSuccess}
          forceAuthMessage={t.login.dashboardLockedMessage}
        />
      </Suspense>
    );
  }

  if (isDashboardPage) {
    return (
      <Suspense fallback={<p role="status">{t.header.loading}</p>}>
        <DashboardPage
          language={language}
          setLanguage={setLanguage}
          onLogout={handleLogout}
        />
      </Suspense>
    );
  }

  if (isLoginPage) {
    return (
      <Suspense fallback={<p role="status">{t.header.loading}</p>}>
        <LoginPage
          language={language}
          setLanguage={setLanguage}
          t={t.login}
          onLoginSuccess={handleLoginSuccess}
        />
      </Suspense>
    );
  }

  if (isRankingPage) {
    return (
      <div id="home" className="fifve-app">
        <Header
          language={language}
          setLanguage={setLanguage}
          t={t.header}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
          onCloseMenu={() => setMobileMenuOpen(false)}
          onNavigate={navigateTo}
          isHome={false}
          pathname={pathname}
        />
        <main className="route-page">
          <div className="route-page__inner">
            <h1 className="route-page__title">
              {publicTranslations.ranking.title}
            </h1>
            <RankingSection ranking={ranking} t={publicTranslations.ranking} />
          </div>
        </main>
        {dashboardConfig.sections.footer && (
          <Footer
            t={publicTranslations.footer}
            navT={t.header}
            homeT={t.homepage}
          />
        )}
      </div>
    );
  }

  if (isContentRoutePage) {
    const routeTitle = isTeamsPage
      ? t.header.nav.team
      : isSchedulePage
        ? t.header.nav.programmation
        : isLocationPage
          ? t.header.nav.lieu
          : t.homepage.footerModule;

    return (
      <div id="home" className="fifve-app">
        <Header
          language={language}
          setLanguage={setLanguage}
          t={t.header}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
          onCloseMenu={() => setMobileMenuOpen(false)}
          onNavigate={navigateTo}
          isHome={false}
          pathname={pathname}
        />
        <main className="route-page">
          <div className="route-page__inner">
            <h1 className={isTeamsPage ? "sr-only" : "route-page__title"}>
              {routeTitle}
            </h1>
            {isTeamsPage && dashboardConfig.sections.team && (
              <ClubTeamSection t={publicTranslations.team} />
            )}
            {isSchedulePage && dashboardConfig.sections.schedule && (
              <ScheduleSection
                isScheduleVisible={isScheduleVisible}
                releaseDateLabel={releaseDateLabel}
                t={publicTranslations.schedule}
              />
            )}
            {isLocationPage && dashboardConfig.sections.location && (
              <LocationSection t={publicTranslations.location} />
            )}
            {isModulePage && dashboardConfig.sections.module && (
              <ModuleSection
                classementRules={classementRules}
                t={publicTranslations.module}
              />
            )}
          </div>
        </main>
        {dashboardConfig.sections.footer && (
          <Footer
            t={publicTranslations.footer}
            navT={t.header}
            homeT={t.homepage}
          />
        )}
      </div>
    );
  }

  if (isTeamSpacePage || isLicensePage) {
    return (
      <div id="home" className="fifve-app">
        <Header
          language={language}
          setLanguage={setLanguage}
          t={t.header}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
          onCloseMenu={() => setMobileMenuOpen(false)}
          onNavigate={navigateTo}
          isHome={false}
          pathname={pathname}
        />
        <div className="pb-14 pt-32 sm:pt-36">
          <Suspense fallback={<p role="status">{t.header.loading}</p>}>
            {isTeamSpacePage ? (
              <TeamWorkspaceSection
                t={publicTranslations.teamWorkspace}
                language={language}
              />
            ) : (
              <LicenseApplicationSection
                t={publicTranslations.license}
                teams={licenseTeams}
                isAvailable={false}
              />
            )}
          </Suspense>
        </div>
        {dashboardConfig.sections.footer && (
          <Footer
            t={publicTranslations.footer}
            navT={t.header}
            homeT={t.homepage}
          />
        )}
      </div>
    );
  }

  return (
    <div id="home" className="fifve-app">
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-linear-to-br from-[#f2f7ff] via-white to-[#ecf7ef] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeWelcomeModal}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/80 p-2 text-slate-600 transition hover:bg-white hover:text-slate-900"
              aria-label={
                language === "en" ? "Close dialog" : "Fermer la fenêtre"
              }
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#0646c4]/10 p-3 text-[#0646c4]">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0646c4]">
                  {t.modal.badge}
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.modal.title}
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">
              {t.modal.message}
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">{t.modal.note}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeWelcomeModal}
                className="rounded-full bg-[#0646c4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#04379a]"
              >
                {t.modal.cta}
              </button>
            </div>
          </div>
        </div>
      )}
      <Header
        language={language}
        setLanguage={setLanguage}
        t={t.header}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        onNavigate={navigateTo}
        pathname={pathname}
      />

      {dashboardConfig.sections.hero && (
        <HeroSection
          t={publicTranslations.hero}
          countdown={remaining}
          releaseDateLabel={releaseDateLabel}
          isScheduleVisible={isScheduleVisible}
          scheduleT={publicTranslations.schedule}
        />
      )}
      {(showExportSection || dashboardConfig.sections.export) && (
        <Suspense fallback={<p role="status">{t.export.preparingExport}</p>}>
          <ExportActionsSection t={t.export} />
        </Suspense>
      )}

      <QuickNavigationSection
        t={t.homepage}
        onNavigate={navigateFromLink}
      />

      <main className="home-content">
        {dashboardConfig.sections.stats && (
          <StatsSection
            t={publicTranslations.stats}
            ranking={ranking}
            selectedTeamsByCountry={selectedTeamsByCountry}
          />
        )}
        <div className="feature-grid">
          {dashboardConfig.sections.ranking && (
            <RankingPreview
              ranking={ranking}
              t={{ ...publicTranslations.ranking, ...t.homepage }}
              onViewAll={(event) => navigateFromLink(event, "/classement")}
            />
          )}
          {dashboardConfig.sections.documents && (
            <DocumentsSection t={publicTranslations.documents} />
          )}
        </div>
        {dashboardConfig.sections.team && (
          <HostClubBanner t={t.homepage} />
        )}
      </main>

      {dashboardConfig.sections.footer && (
        <Footer
          t={publicTranslations.footer}
          navT={t.header}
          homeT={t.homepage}
        />
      )}
    </div>
  );
}
