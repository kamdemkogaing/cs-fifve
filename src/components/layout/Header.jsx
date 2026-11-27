import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const routeSections = {
  "/equipes": "retenues",
  "/classement": "classement",
  "/programmation": "programmation",
  "/lieu": "lieu",
};

export default function Header({
  language,
  setLanguage,
  t,
  mobileMenuOpen,
  onToggleMenu,
  onCloseMenu,
  isHome = true,
  pathname = window.location.pathname,
  onNavigate,
  teamSpacePath = "/espace-cs",
}) {
  const [activeSection, setActiveSection] = useState(
    () => routeSections[pathname] || "home",
  );
  const navItems = [
    {
      href: isHome ? "#home" : "/#home",
      label: t.nav.home,
      section: "home",
    },
    {
      href: "/equipes",
      label: t.nav.team,
      section: "retenues",
      route: true,
    },
    {
      href: "/classement",
      label: t.nav.classement,
      section: "classement",
      route: true,
    },
    {
      href: "/programmation",
      label: t.nav.programmation,
      section: "programmation",
      route: true,
    },
    {
      href: "/lieu",
      label: t.nav.lieu,
      section: "lieu",
      route: true,
    },
    {
      href: isHome ? "#documents" : "/#documents",
      label: t.nav.documents,
      section: "documents",
    },
  ];

  useEffect(() => {
    if (!isHome) {
      setActiveSection(routeSections[pathname] || "home");
      return undefined;
    }

    const handleScroll = () => {
      const sections = [
        "home",
        "retenues",
        "programmation",
        "lieu",
        "documents",
      ];
      let currentSection = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section?.getBoundingClientRect().top <= 120) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, pathname]);

  const handleNavigation = (event, item) => {
    onCloseMenu();
    if (item.route && onNavigate) {
      event.preventDefault();
      onNavigate(item.href);
    }
  };

  const languageSwitch = (
    <div className="language-switch" aria-label={t.languageLabel}>
      {["fr", "en"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a
          href={isHome ? "#home" : "/#home"}
          onClick={onCloseMenu}
          className="brand-lockup"
          aria-label="FIFVE 2027 - Accueil"
        >
          <img src="/images/logo_fifve.jpeg" alt="" />
          <span className="brand-lockup__copy">
            <strong>FIFVE 2027</strong>
            <span>{t.federationName}</span>
            <small>{t.slogan}</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={t.nav.home}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavigation(event, item)}
              className={activeSection === item.section ? "is-active" : ""}
              aria-current={
                activeSection === item.section ? "page" : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {languageSwitch}
          <a
            href={teamSpacePath}
            className="team-space-link"
            onClick={(event) =>
              handleNavigation(event, {
                href: teamSpacePath,
                route: true,
              })
            }
          >
            {t.nav.espaceEquipe}
          </a>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleMenu}
          aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label={t.nav.home}
        >
          <div className="mobile-nav__top">
            {languageSwitch}
            <a
              href={teamSpacePath}
              className="team-space-link"
              onClick={(event) =>
                handleNavigation(event, {
                  href: teamSpacePath,
                  route: true,
                })
              }
            >
              {t.nav.espaceEquipe}
            </a>
          </div>
          {navItems.map((item) => (
            <a
              key={`mobile-${item.href}`}
              href={item.href}
              onClick={(event) => handleNavigation(event, item)}
              className={activeSection === item.section ? "is-active" : ""}
              aria-current={
                activeSection === item.section ? "page" : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
