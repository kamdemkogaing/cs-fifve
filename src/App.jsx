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

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-28">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMobileMenuOpen(false)}
      />

      <HeroSection />

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-14">
        <StatsSection />
        <ModuleSection classementRules={classementRules} />
        <RankingSection ranking={ranking} />
        <SelectedTeamsSection selectedTeamsByCountry={selectedTeamsByCountry} />
        <ScheduleSection currentTime={currentTime} />
        <LocationSection />
      </main>

      <Footer />
    </div>
  );
}
