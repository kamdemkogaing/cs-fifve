import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ClubTeamSection from "./components/sections/ClubTeamSection";
import DocumentsSection from "./components/sections/DocumentsSection";
import ExportActionsSection from "./components/sections/ExportActionsSection";
import HeroSection from "./components/sections/HeroSection";
import LocationSection from "./components/sections/LocationSection";
import MeetingSection from "./components/sections/MeetingSection";
import ModuleSection from "./components/sections/ModuleSection";
import RankingSection from "./components/sections/RankingSection";
import ScheduleSection from "./components/sections/ScheduleSection";
import SelectedTeamsSection from "./components/sections/SelectedTeamsSection";
import StatsSection from "./components/sections/StatsSection";
import TeamWorkspaceSection from "./components/sections/TeamWorkspaceSection";
import {
  classementRules,
  ranking,
  selectedTeamsByCountry,
} from "./data/fifveData";
import { getTranslations, normalizeLanguage } from "./i18n";

const SCHEDULE_RELEASE_ISO = "2026-07-24T18:00:00Z";

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

  const [language, setLanguage] = useState(() => {
    const stored = window.localStorage.getItem("fifve-language");
    return normalizeLanguage(stored);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return !window.localStorage.getItem("fifve-welcome-modal-seen");
  });
  const t = getTranslations(language);

  useEffect(() => {
    window.localStorage.setItem("fifve-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scheduleReleaseTimestamp = Date.parse(SCHEDULE_RELEASE_ISO);
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

  return (
    <div id="home">
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
      />

      <HeroSection
        t={t.hero}
        countdown={remaining}
        releaseDateLabel={releaseDateLabel}
        isScheduleVisible={isScheduleVisible}
        scheduleT={t.schedule}
      />
      <MeetingSection t={t.meeting} />
      <DocumentsSection t={t.documents} />
      <TeamWorkspaceSection t={t.teamWorkspace} />
      {showExportSection && <ExportActionsSection t={t.export} />}

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-14">
        <ClubTeamSection t={t.team} />
        <StatsSection t={t.stats} />
        <ModuleSection classementRules={classementRules} t={t.module} />
        <RankingSection ranking={ranking} t={t.ranking} />
        <SelectedTeamsSection
          selectedTeamsByCountry={selectedTeamsByCountry}
          t={t.selected}
        />
        <ScheduleSection
          isScheduleVisible={isScheduleVisible}
          releaseDateLabel={releaseDateLabel}
          t={t.schedule}
        />
        <LocationSection t={t.location} />
      </main>

      <Footer t={t.footer} />
    </div>
  );
}
