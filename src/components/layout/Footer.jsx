import { Globe, Mail, MapPin, MessageCircle, Trophy } from "lucide-react";

export default function Footer({ t }) {
  const whatsappNumber = "491711721204";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="relative overflow-hidden border-t border-white/15 bg-linear-to-br from-[#04379a] via-[#0646c4] to-[#0a5bcf] px-6 py-10 text-white">
      <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1.2fr_1fr]">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <img
            src="/images/logo_fifve.jpeg"
            alt="Logo FIFVE"
            className="mb-4 h-20 w-20 rounded-full bg-white object-contain p-1 shadow-md"
          />
          <h3 className="text-xl font-bold tracking-wide">FIFVE</h3>
          <p className="mt-1 text-blue-100">{t.slogan}</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <h4 className="mb-3 text-lg font-bold">{t.contact}</h4>

          <div className="space-y-2.5 text-sm text-blue-100">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-white" />
              <span>
                Johanniterstraße 30
                <br />
                44787 Bochum, {t.country}
              </span>
            </p>
            <p>
              <a
                href="mailto:bureau@fifve.com"
                className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5 text-blue-100 transition hover:text-white"
              >
                <Mail size={16} className="shrink-0" />
                bureau@fifve.com
              </a>
            </p>
            <p>
              <a
                href="https://www.fifve.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5 text-blue-100 transition hover:text-white"
              >
                <Globe size={16} className="shrink-0" />
                www.fifve.com
              </a>
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-blue-100">
              {t.whatsappLabel}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-[#06341d] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={`${t.whatsappAction} +49 171 1721204`}
            >
              <MessageCircle size={18} />
              {t.whatsappAction}
            </a>
            <p className="mt-2 text-xs text-blue-100">+49 171 1721204</p>
            <p className="mt-1 text-xs text-blue-100">
              {t.contactPersonLabel}:{" "}
              <span className="font-semibold text-white">
                Téofile Tchakoumi
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <h4 className="mb-3 text-lg font-bold">{t.tournament}</h4>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100">
            <Trophy size={14} />
            {t.date}
          </p>
          <p className="mt-3 text-sm text-blue-100">Salzburger Weg 20</p>
          <p className="text-sm text-blue-100">50858 Lindenthal</p>
        </div>
      </div>

      <div className="relative mx-auto mt-7 max-w-7xl border-t border-white/25 pt-4 text-xs text-blue-100 md:text-sm">
        {t.rights}
      </div>
    </footer>
  );
}
