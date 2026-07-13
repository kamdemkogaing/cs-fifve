import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ExportActionsSection from "./components/sections/ExportActionsSection";
import HeroSection from "./components/sections/HeroSection";
import LocationSection from "./components/sections/LocationSection";
import ModuleSection from "./components/sections/ModuleSection";
import RankingSection from "./components/sections/RankingSection";
import ScheduleSection from "./components/sections/ScheduleSection";
import SelectedTeamsSection from "./components/sections/SelectedTeamsSection";
import StatsSection from "./components/sections/StatsSection";
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

  return (
    <div id="home" className="pt-28">
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
      {showExportSection && <ExportActionsSection t={t.export} />}

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-14">
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
