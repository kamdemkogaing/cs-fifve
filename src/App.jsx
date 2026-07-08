import { MapPin, Medal, Trophy, Users } from "lucide-react";
import { classementRules, ranking, selectedTeams } from "./data/fifveData";

export default function App() {
  return (
    <div>
      <header className="bg-[#0646c4] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo_fifve.jpeg"
              alt="Logo FIFVE"
              className="h-20 w-20 rounded-full bg-white object-contain p-1"
            />
            <div>
              <p className="text-sm uppercase tracking-widest">FIFVE 2026</p>
              <h1 className="text-2xl font-bold">
                Fédération Internationale de Football Vétérans
              </h1>
            </div>
          </div>

          <nav className="hidden gap-6 md:flex">
            <a href="#module">Module</a>
            <a href="#classement">Classement</a>
            <a href="#retenues">Équipes retenues</a>
            <a href="#lieu">Lieu</a>
          </nav>
        </div>
      </header>

      <section className="bg-linear-to-br from-[#0646c4] via-[#0b61e8] to-[#159947] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-semibold uppercase tracking-widest text-yellow-300">
            Week-End FIFVE 2026
          </p>
          <h2 className="max-w-4xl text-4xl font-extrabold md:text-6xl">
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
          <h2 className="mb-6 text-3xl font-bold text-[#0646c4]">
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
          <h2 className="mb-6 text-3xl font-bold text-[#0646c4]">
            Classement actuel des 53 équipes FIFVE
          </h2>

          <div className="max-h-162.5 overflow-auto rounded-2xl border">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-[#0646c4] text-white">
                <tr>
                  <th className="p-3 text-left">Nr.</th>
                  <th className="p-3 text-left">Délégation</th>
                  <th className="p-3 text-left">Points</th>
                  <th className="p-3 text-left">Ajouts Londres</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((team) => (
                  <tr key={team[0]} className="border-b hover:bg-blue-50">
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
        </section>

        <section id="retenues" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-[#0646c4]">
            24 équipes retenues pour la FIFVE 2026
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedTeams.map((team, index) => (
              <div
                key={team}
                className="rounded-2xl border border-blue-100 bg-blue-50 p-4"
              >
                <span className="mr-2 font-bold text-[#e6002d]">
                  {index + 1}.
                </span>
                {team}
              </div>
            ))}
          </div>
        </section>

        <section id="lieu" className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-3xl font-bold text-[#0646c4]">
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

function Card({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4 text-[#0646c4]">{icon}</div>
      <h3 className="text-4xl font-extrabold text-[#e6002d]">{title}</h3>
      <p className="mt-2 font-medium">{text}</p>
    </div>
  );
}
