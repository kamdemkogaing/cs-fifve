export default function Footer({ t }) {
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
