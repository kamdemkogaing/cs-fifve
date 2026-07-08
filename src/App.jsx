import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
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

export default function App() {
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
    }, 30000);

    return () => clearInterval(timer);
  }, []);

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

      <HeroSection t={t.hero} />

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-14">
        <StatsSection t={t.stats} />
        <ModuleSection classementRules={classementRules} t={t.module} />
        <RankingSection ranking={ranking} t={t.ranking} />
        <SelectedTeamsSection
          selectedTeamsByCountry={selectedTeamsByCountry}
          t={t.selected}
        />
        <ScheduleSection
          currentTime={currentTime}
          language={language}
          t={t.schedule}
        />
        <LocationSection t={t.location} />
      </main>

      <Footer t={t.footer} />
    </div>
  );
}
