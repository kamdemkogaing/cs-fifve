import { CalendarDays, ExternalLink, MapPin, Navigation } from "lucide-react";

export default function LocationSection({ t }) {
  return (
    <section
      id="lieu"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#0646c4] md:text-3xl">
          {t.title}
        </h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
          FIFVE 2026
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
        <div className="rounded-2xl border border-blue-100 bg-linear-to-b from-blue-50 via-white to-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0646c4]">
            {t.venueLabel}
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-900">
            {t.venueName}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <CalendarDays
                size={16}
                className="mt-0.5 shrink-0 text-[#0646c4]"
              />
              <span>
                <span className="font-semibold text-slate-900">
                  {t.dateLabel}:{" "}
                </span>
                {t.date}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#0646c4]" />
              <span>
                <span className="font-semibold text-slate-900">
                  {t.addressLabel}:{" "}
                </span>
                {t.address}
              </span>
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Salzburger+Weg+20+50858+Lindenthal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0646c4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ExternalLink size={15} />
              {t.mapsButton}
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Salzburger+Weg+20+50858+Lindenthal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0646c4] transition hover:bg-blue-50"
            >
              <Navigation size={15} />
              {t.routeButton}
            </a>
          </div>

          <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs text-slate-600">
            {t.locationNote}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
          <iframe
            title="Google Maps FIFVE"
            className="h-105 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Salzburger%20Weg%2020%2050858%20Lindenthal&output=embed"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
