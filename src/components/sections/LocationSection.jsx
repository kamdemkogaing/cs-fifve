export default function LocationSection({ t }) {
  return (
    <section id="lieu" className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-[#0646c4] md:text-3xl">
        {t.title}
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-lg font-semibold">{t.date}</p>
          <p className="mt-3 text-xl">Salzburger Weg 20, 50858 Lindenthal</p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Salzburger+Weg+20+50858+Lindenthal"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full bg-[#e6002d] px-6 py-3 font-bold text-white"
          >
            {t.mapsButton}
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
  );
}
