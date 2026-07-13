import { Users } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    id: "jean-jaures",
    firstName: "Jean Jaures",
    fullName: "Jean Jaures Mboune Essangui",
    photo: "Jean Jaures Mboune Essangui.jpeg",
    whatsappNumber: "447435091081",
  },
  {
    id: "gaston",
    firstName: "Gaston",
    fullName: "Gaston Evotche",
    photo: "Gaston Evotche.jpeg",
    whatsappNumber: "491715743077",
  },
  {
    id: "eutrope",
    firstName: "Eutrope",
    fullName: "Eutrope FOTSO NEAM",
    photo: "Eutrope FOTSO NEAM.jpeg",
    whatsappNumber: "32472690852",
  },
  {
    id: "teofile",
    firstName: "Téofile",
    fullName: "Teofile Tchakoumi Nzepan",
    photo: "Teofile Tchakoumi Nzepan.jpeg",
    whatsappNumber: "491711721204",
  },
  {
    id: "stephane",
    firstName: "Stephane",
    fullName: "Stephane Besong",
    photo: "Stephane Besong.jpeg",
    whatsappNumber: "447432599332",
  },
  {
    id: "samson",
    firstName: "Franck",
    fullName: "Samson",
    photo: "Samson.jpeg",
    whatsappNumber: "4915771365401",
  },
  {
    id: "patrick",
    firstName: "Patrick",
    fullName: "Patrick Kamdem",
    photo: "Patrick Kamdem.jpeg",
    whatsappNumber: "491714170604",
  },
  {
    id: "olivier",
    firstName: "Olivier",
    fullName: "Olivier KENGNE",
    photo: "Olivier KENGNE.jpeg",
    whatsappNumber: "32484902176",
  },
  {
    id: "jean-paul",
    firstName: "Jean Paul",
    fullName: "Jean Paul Njeboh",
    photo: "Jean Paul Njeboh.jpeg",
    whatsappNumber: "4915212697725",
  },
  /*   {
    id: "fred",
    firstName: "Fred",
    fullName: "Fred Siewe",
    photo: "Fred Siewe.jpeg",
    whatsappNumber: "491711721204",
  }, */
  {
    id: "francis",
    firstName: "Francis",
    fullName: "FRANCIS NJAWE",
    photo: "FRANCIS NJAWE.jpeg",
    whatsappNumber: "393343031132",
  },
  {
    id: "filomain",
    firstName: "Filomain",
    fullName: "Filomain Nguemo",
    photo: "Filomain Nguemo.jpeg",
    whatsappNumber: "491736956407",
  },
  {
    id: "dimitri",
    firstName: "Dimitri",
    fullName: "Dimitri Diffo",
    photo: "Dimitri Diffo.jpeg",
    whatsappNumber: "41782473631",
  },
  {
    id: "achille",
    firstName: "Achille",
    fullName: "Achille Kapya",
    photo: "Achille Kapya.jpeg",
    whatsappNumber: "491729028332",
  },
];

function TeamMemberCard({ member, t }) {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white/95 p-4 shadow-md ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:ring-blue-100">
      <div className="pointer-events-none absolute -top-20 -right-16 h-36 w-36 rounded-full bg-blue-100/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-14 h-32 w-32 rounded-full bg-emerald-100/50 blur-2xl" />

      <div className="relative flex h-48 items-center justify-center rounded-2xl border border-blue-100 bg-linear-to-br from-slate-100 via-white to-blue-50 p-2">
        {imageMissing ? (
          <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-[#0646c4] text-3xl font-black text-white shadow-md">
            {member.firstName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-50 shadow-md">
            <img
              src={`/images/${member.photo}`}
              alt={member.fullName}
              loading="lazy"
              className="h-full w-full object-cover object-center"
              onError={() => setImageMissing(true)}
            />
          </div>
        )}
      </div>

      <div className="relative mt-4 flex flex-col gap-3">
        <div>
          <p className="text-xl font-extrabold tracking-tight text-[#0646c4]">
            {member.firstName}
          </p>
          <p className="mt-1 text-sm text-slate-600">{member.fullName}</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700 transition group-hover:border-blue-300 group-hover:bg-blue-100/70">
          {t.memberLabel ?? "Team member"}
        </span>
      </div>
    </article>
  );
}

export default function ClubTeamSection({ t }) {
  return (
    <section
      id="team"
      className="relative overflow-hidden rounded-3xl border border-blue-200 bg-linear-to-br from-[#f2f7ff] via-white to-[#edf9f2] p-6 shadow-lg"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#0b61e8]/10 blur-2xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#159947]/10 blur-2xl"></div>

      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#0646c4]/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
          <Users size={14} />
          {t.badge}
        </p>

        <h2 className="mt-3 text-2xl font-extrabold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-700 md:text-base">
          {t.subtitle}
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
