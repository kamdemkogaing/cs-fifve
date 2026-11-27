import { Mail, MapPin, MessageCircle } from "lucide-react";

const facebookUrl = "https://www.facebook.com/fifve1";

function FooterLinks({ title, links }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      {links.map((link) => (
        <a href={link.href} key={link.label}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function Footer({ t, navT, homeT }) {
  const whatsappNumber = "491711721204";

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="footer-brand">
          <a href="/#home" className="footer-brand__lockup">
            <img src="/images/logo_fifve.jpeg" alt="Logo FIFVE" />
            <span>
              <strong>FIFVE 2027</strong>
              <small>{t.slogan}</small>
            </span>
          </a>
          <p>{navT.federationName}</p>
        </div>

        <FooterLinks
          title={homeT.footerNavigation}
          links={[
            { label: navT.nav.home, href: "/#home" },
            { label: navT.nav.team, href: "/equipes" },
            { label: navT.nav.classement, href: "/classement" },
          ]}
        />
        <FooterLinks
          title={homeT.footerTournament}
          links={[
            {
              label: navT.nav.programmation,
              href: "/programmation",
            },
            { label: navT.nav.lieu, href: "/lieu" },
            { label: homeT.footerModule, href: "/module" },
          ]}
        />
        <FooterLinks
          title={homeT.footerInformation}
          links={[
            { label: navT.nav.documents, href: "/#documents" },
            { label: navT.nav.licences, href: "/licences" },
            { label: navT.nav.espaceEquipe, href: "/espace-cs" },
          ]}
        />

        <div className="footer-column footer-contact">
          <h3>{t.contact}</h3>
          <a href={`mailto:${t.email}`}>
            <Mail size={15} />
            {t.email}
          </a>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={15} />
            +49 171 1721204
          </a>
          <span>
            <MapPin size={15} />
            Karlsruhe, {t.country}
          </span>
        </div>

        <div className="footer-column footer-social-column">
          <h3>{homeT.footerFollow}</h3>
          <a
            className="footer-social"
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook FIFVE"
          >
            <span aria-hidden="true">f</span>
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>{t.rights}</p>
        <div>
          <span>{homeT.legalNotice}</span>
          <span>{homeT.privacy}</span>
        </div>
      </div>
    </footer>
  );
}
