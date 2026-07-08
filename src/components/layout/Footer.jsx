import { MessageCircle } from "lucide-react";

export default function Footer({ t }) {
  const whatsappNumber = "491711721204";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-[#0646c4] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <img
            src="/images/logo_fifve.jpeg"
            alt="Logo FIFVE"
            className="mb-4 h-20 w-20 rounded-full bg-white object-contain p-1"
          />
          <h3 className="text-xl font-bold">FIFVE</h3>
          <p>{t.slogan}</p>
        </div>

        <div>
          <h4 className="mb-3 font-bold">{t.contact}</h4>
          <p>Johanniterstraße 30</p>
          <p>44787 Bochum, {t.country}</p>
          <p>bureau@fifve.com</p>
          <p>www.fifve.com</p>

          <div className="mt-4 rounded-2xl border border-white/25 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-sm text-blue-100">{t.whatsappLabel}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 font-semibold text-[#06341d] transition-transform duration-200 hover:scale-[1.02] hover:bg-[#2af07a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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

        <div>
          <h4 className="mb-3 font-bold">{t.tournament}</h4>
          <p>{t.date}</p>
          <p>Salzburger Weg 20</p>
          <p>50858 Lindenthal</p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/30 pt-4 text-sm">
        {t.rights}
      </div>
    </footer>
  );
}
