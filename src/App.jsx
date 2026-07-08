import { MapPin, Medal, Menu, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import {
  classementRules,
  ranking,
  selectedTeamsByCountry,
} from "./data/fifveData";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const splitIndex = Math.ceil(ranking.length / 2);
  const rankingBlockA = ranking.slice(0, splitIndex);
  const rankingBlockB = ranking.slice(splitIndex);

  return (
    <div className="pt-28">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#0646c4] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex min-w-0 items-center gap-3 pr-3 sm:gap-4 md:pr-0">
            <img
              src="/images/logo_fifve.jpeg"
              alt="Logo FIFVE"
              className="h-20 w-20 rounded-full bg-white object-contain p-1"
            />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-blue-100 sm:text-sm">
                FIFVE 2026
              </p>
              <h1 className="text-sm font-bold leading-tight sm:text-2xl">
                Fédération Internationale de Football Vétérans
              </h1>
              <p className="text-xs text-blue-100 sm:text-sm">
                Football our Passion
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-sm md:flex">
            <a
              href="#module"
              className="relative rounded-full px-4 py-2 text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white after:absolute after:left-1/2 after:bottom-1 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
            >
              Module
            </a>
            <a
              href="#classement"
              className="relative rounded-full px-4 py-2 text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white after:absolute after:left-1/2 after:bottom-1 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
            >
              Classement
            </a>
            <a
              href="#retenues"
              className="relative rounded-full px-4 py-2 text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white after:absolute after:left-1/2 after:bottom-1 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
            >
              Équipes retenues
            </a>
            <a
              href="#lieu"
              className="relative rounded-full px-4 py-2 text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white after:absolute after:left-1/2 after:bottom-1 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
            >
              Lieu
            </a>
          </nav>

          <button
            type="button"
            className="ml-2 shrink-0 inline-flex items-center justify-center rounded-xl border border-white/30 p-2 text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-white/20 bg-[#04379a] px-6 py-4 md:hidden">
            <ul className="space-y-3">
              <li>
                <a
                  href="#module"
                  className="block rounded-xl border border-transparent px-3 py-2 font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Module
                </a>
              </li>
              <li>
                <a
                  href="#classement"
                  className="block rounded-xl border border-transparent px-3 py-2 font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Classement
                </a>
              </li>
              <li>
                <a
                  href="#retenues"
                  className="block rounded-xl border border-transparent px-3 py-2 font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Équipes retenues
                </a>
              </li>
              <li>
                <a
                  href="#lieu"
                  className="block rounded-xl border border-transparent px-3 py-2 font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lieu
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <section className="bg-linear-to-br from-[#0646c4] via-[#0b61e8] to-[#159947] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-semibold uppercase tracking-widest text-yellow-300">
            Week-End FIFVE 2026
          </p>
          <h2 className="max-w-4xl text-3xl font-extrabold md:text-5xl">
            Classement officiel, module de points et équipes retenues
          </h2>
          <p className="mt-6 max-w-3xl text-lg">
            Page officielle de présentation des informations sportives de
            l’édition 2026.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-14">
        <section className="grid gap-6 md:grid-cols-4">
          <Card icon={<Trophy />} title="53" text="équipes classées" />
          <Card icon={<Users />} title="24" text="équipes retenues" />
          <Card icon={<Medal />} title="116" text="points du leader" />
          <Card
            icon={<MapPin />}
            title="25 juillet 2026"
            text="tournoi FIFVE"
          />
        </section>

        <section id="module" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
            Module de classement FIFVE 2026
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#0646c4] text-white">
                <tr>
                  <th className="p-3 text-left">Performance</th>
                  <th className="p-3 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {classementRules.map(([name, points], index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{name}</td>
                    <td className="p-3 font-bold text-[#e6002d]">{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-5">
            <h3 className="mb-2 font-bold text-[#0646c4]">
              Protection sportive
            </h3>
            <p>
              Les équipes issues d’une même ville ne pourront pas s’affronter
              lors des matchs de groupe : Bruxelles, Karlsruhe, Londres et
              Paris.
            </p>
          </div>
        </section>

        <section id="classement" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
            Classement actuel des 53 équipes FIFVE
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <RankingBlock
              title={`Bloc 1 (${rankingBlockA[0][0]}-${rankingBlockA[rankingBlockA.length - 1][0]})`}
              teams={rankingBlockA}
            />
            <RankingBlock
              title={`Bloc 2 (${rankingBlockB[0][0]}-${rankingBlockB[rankingBlockB.length - 1][0]})`}
              teams={rankingBlockB}
            />
          </div>
        </section>

        <section id="retenues" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-[#0646c4] md:text-3xl">
            24 équipes retenues pour la FIFVE 2026
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {selectedTeamsByCountry.map((group) => (
              <div
                key={group.country}
                className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
              >
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#0646c4]">
                  <img
                    src={`https://flagcdn.com/24x18/${group.flagCode}.png`}
                    alt={`Drapeau ${group.country}`}
                    className="h-4 w-6 rounded-xs object-cover shadow-sm"
                    loading="lazy"
                  />
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#e6002d]">
                    {group.teams.length}{" "}
                    {group.teams.length > 1 ? "equipes" : "equipe"}
                  </span>
                  <span>{group.country}</span>
                </h3>

                <ul className="space-y-2">
                  {group.teams.map((team) => (
                    <li
                      key={`${group.country}-${team.number}`}
                      className="rounded-xl bg-white px-3 py-2"
                    >
                      <span className="mr-2 font-bold text-[#e6002d]">
                        {team.number}.
                      </span>
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="lieu" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-[#0646c4] md:text-3xl">
            Lieu du tournoi
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-lg font-semibold">Samedi 25 juillet 2026</p>
              <p className="mt-3 text-xl">
                Salzburger Weg 20, 50858 Lindenthal
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Salzburger+Weg+20+50858+Lindenthal"
                target="_blank"
                className="mt-6 inline-block rounded-full bg-[#e6002d] px-6 py-3 font-bold text-white"
              >
                Ouvrir dans Google Maps
              </a>
            </div>

            <iframe
              title="Google Maps FIFVE"
              className="h-80 w-full rounded-3xl"
              loading="lazy"
              src="https://www.google.com/maps?q=Salzburger%20Weg%2020%2050858%20Lindenthal&output=embed"
            ></iframe>
          </div>
        </section>
      </main>

      <footer className="bg-[#0646c4] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <img
              src="/images/logo_fifve.jpeg"
              alt="Logo FIFVE"
              className="mb-4 h-20 w-20 rounded-full bg-white object-contain p-1"
            />
            <h3 className="text-xl font-bold">FIFVE</h3>
            <p>Football our Passion</p>
          </div>

          <div>
            <h4 className="mb-3 font-bold">Contact</h4>
            <p>Johanniterstraße 30</p>
            <p>44787 Bochum, Allemagne</p>
            <p>bureau@fifve.com</p>
            <p>www.fifve.com</p>
          </div>

          <div>
            <h4 className="mb-3 font-bold">Tournoi 2026</h4>
            <p>Samedi 25 juillet 2026</p>
            <p>Salzburger Weg 20</p>
            <p>50858 Lindenthal</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/30 pt-4 text-sm">
          © 2026 Fédération Internationale de Football Vétérans — Tous droits
          réservés.
        </div>
      </footer>
    </div>
  );
}

function RankingBlock({ title, teams }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-md">
      <div className="bg-[#0646c4] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white text-[#0646c4]">
            <tr className="border-b border-blue-100">
              <th className="p-3 text-left">Nr.</th>
              <th className="p-3 text-left">Délégation</th>
              <th className="p-3 text-left">Points</th>
              <th className="p-3 text-left">Ajouts Londres</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team[0]}
                className="border-b border-blue-50 transition-colors hover:bg-blue-50/70"
              >
                <td className="p-3 font-bold">{team[0]}</td>
                <td className="p-3">{team[1]}</td>
                <td className="p-3">{team[2]}</td>
                <td className="p-3">{team[3]}</td>
                <td className="p-3 font-bold text-[#e6002d]">{team[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4 text-[#0646c4]">{icon}</div>
      <h3 className="text-3xl font-extrabold text-[#e6002d]">{title}</h3>
      <p className="mt-2 font-medium">{text}</p>
    </div>
  );
}
