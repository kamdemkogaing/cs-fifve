import { ArrowRight } from "lucide-react";

export default function HostClubBanner({ t }) {
  return (
    <section className="host-banner">
      <img
        className="host-banner__logo"
        src="/images/veterans-3e-mi-temps-karlsruhe.jpg"
        alt={t.hostLogoAlt}
        loading="lazy"
      />
      <div className="host-banner__copy">
        <p>{t.hostEyebrow}</p>
        <h2>{t.hostName}</h2>
        <span>{t.hostDescription}</span>
      </div>
      <svg
        className="host-banner__landmark"
        viewBox="0 0 180 110"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 101h164M22 100V58h136v42M15 58h150L90 27 15 58Zm63-2V35h24v21M84 26V9h12v17M33 70h12v18H33zm27 0h12v18H60zm48 0h12v18h-12zm27 0h12v18h-12z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <a
        className="host-banner__link"
        href="https://www.facebook.com/profile.php?id=61576463140935"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.hostCta}
        <ArrowRight size={15} />
      </a>
    </section>
  );
}
