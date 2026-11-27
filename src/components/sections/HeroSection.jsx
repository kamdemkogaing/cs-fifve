import { CalendarDays, LockKeyhole, Timer } from "lucide-react";

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown-unit">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

function FootballMark() {
  return (
    <svg viewBox="0 0 220 220" className="hero-football" aria-hidden="true">
      <defs>
        <radialGradient id="ball-surface" cx="32%" cy="24%" r="78%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#edf5fb" />
          <stop offset="1" stopColor="#a8bfce" />
        </radialGradient>
        <radialGradient id="ball-gloss" cx="30%" cy="20%" r="78%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".62" />
          <stop offset=".55" stopColor="#ffffff" stopOpacity=".06" />
          <stop offset="1" stopColor="#06294d" stopOpacity=".25" />
        </radialGradient>
        <clipPath id="ball-clip">
          <circle cx="110" cy="100" r="91" />
        </clipPath>
        <clipPath id="ball-logo-clip">
          <circle cx="110" cy="101" r="23" />
        </clipPath>
      </defs>
      <ellipse cx="112" cy="201" rx="77" ry="12" fill="#06284a" opacity=".34" />
      <circle
        cx="110"
        cy="100"
        r="93"
        fill="url(#ball-surface)"
        stroke="#e8f4fb"
        strokeWidth="3"
      />
      <g clipPath="url(#ball-clip)">
        <path
          d="m110 63 28 20-11 34h-34L82 83z"
          fill="#073b78"
          stroke="#172b3b"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="m82 83-35-12-24 26 9 37 37 10 24-27"
          fill="#102741"
          stroke="#dce8ed"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="m138 83 34-11 26 27-9 35-37 10-25-27"
          fill="#07558d"
          stroke="#dce8ed"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="m82 83 28-20-4-42-34-14-25 23 0 41m91 12-28-20 4-42 34-14 25 23 0 41m-91 46-25 27 11 37 38 13 38-13 11-37-25-27"
          fill="none"
          stroke="#20384a"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="m87 92 23-17 23 17-9 27h-28z"
          fill="#fff"
          stroke="#18354b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <image
          href="/images/logo_fifve.jpeg"
          x="87"
          y="78"
          width="46"
          height="46"
          clipPath="url(#ball-logo-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
        <circle cx="110" cy="100" r="91" fill="url(#ball-gloss)" />
      </g>
      <circle
        cx="110"
        cy="100"
        r="92"
        fill="none"
        stroke="#d5e4ee"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function HeroSection({
  t,
  countdown,
  releaseDateLabel,
  isScheduleVisible,
  scheduleT,
}) {
  return (
    <section className="hero-section">
      <div className="hero-section__glow hero-section__glow--one" />
      <div className="hero-section__glow hero-section__glow--two" />
      <div className="hero-section__inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">{t.badge}</p>
          <h1>{t.title}</h1>
          <p className="hero-description">{t.subtitle}</p>
          <div className="hero-actions">
            <a className="button button--yellow" href="/programmation">
              <CalendarDays size={14} />
              {t.scheduleCta}
            </a>
            <a className="button button--outline" href="/module">
              {t.tournamentCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-countdown">
          <div className="hero-countdown__heading">
            <span className="hero-countdown__icon">
              <CalendarDays size={17} />
            </span>
            <div>
              <strong>{scheduleT.badge}</strong>
              <small>
                {scheduleT.releaseLabel}: {releaseDateLabel}
              </small>
            </div>
            <span
              className={`schedule-status ${
                isScheduleVisible ? "schedule-status--open" : ""
              }`}
            >
              {isScheduleVisible ? (
                scheduleT.statusOpen
              ) : (
                <>
                  <LockKeyhole size={12} />
                  {scheduleT.statusLocked}
                </>
              )}
            </span>
          </div>
          {!isScheduleVisible && (
            <>
              <p className="hero-countdown__label">
                <Timer size={15} />
                {scheduleT.countdownTitle}
              </p>
              <div
                className="countdown-grid"
                role="timer"
                aria-live="off"
                aria-label={scheduleT.countdownTitle}
              >
                <CountdownUnit value={countdown.days} label={scheduleT.days} />
                <CountdownUnit value={countdown.hours} label={scheduleT.hours} />
                <CountdownUnit
                  value={countdown.minutes}
                  label={scheduleT.minutes}
                />
                <CountdownUnit
                  value={countdown.seconds}
                  label={scheduleT.seconds}
                />
              </div>
            </>
          )}
          {isScheduleVisible && (
            <p className="hero-countdown__released">{scheduleT.statusOpen}</p>
          )}
        </div>

        <div className="hero-visual">
          <FootballMark />
        </div>
      </div>
    </section>
  );
}
