import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({
  language,
  setLanguage,
  t,
  mobileMenuOpen,
  onToggleMenu,
  onCloseMenu,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#reunion", label: t.nav.reunion },
    { href: "#team", label: t.nav.team },
    { href: "#module", label: t.nav.module },
    { href: "#classement", label: t.nav.classement },
    { href: "#retenues", label: t.nav.retenues },
    { href: "#programmation", label: t.nav.programmation },
    { href: "#lieu", label: t.nav.lieu },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-500 ${
        isScrolled
          ? "border-b border-white/15 bg-[#04379a]/88 shadow-2xl backdrop-blur-xl"
          : "bg-linear-to-r from-[#0646c4]/92 via-[#0b61e8]/84 to-[#0a5bcf]/90 shadow-lg backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1600px] items-center justify-between pl-2 pr-4 transition-all duration-500 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 ${
          isScrolled ? "py-2.5" : "py-4"
        }`}
      >
        <a
          href="#home"
          onClick={onCloseMenu}
          className="flex min-w-0 items-center gap-2 pr-1 sm:gap-3 md:mr-4 md:pr-0 lg:mr-6"
          aria-label="Home"
        >
          <img
            src="/images/logo_fifve.jpeg"
            alt="Logo FIFVE"
            className={`rounded-full bg-white object-contain p-1 shadow-md transition-all duration-500 ${
              isScrolled ? "h-14 w-14" : "h-20 w-20"
            }`}
          />
          <div className="min-w-0 max-w-44 sm:max-w-52 lg:max-w-none">
            <p
              className={`uppercase tracking-widest text-blue-100 transition-all duration-500 ${
                isScrolled ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
              }`}
            >
              FIFVE 2026
            </p>
            <h1
              className={`font-bold leading-tight transition-all duration-500 ${
                isScrolled
                  ? "text-xs sm:text-base lg:text-xl"
                  : "text-sm sm:text-lg lg:text-2xl"
              }`}
            >
              {t.federationName}
            </h1>
            <p
              className={`text-blue-100 transition-all duration-500 ${
                isScrolled ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
              }`}
            >
              {t.slogan}
            </p>
          </div>
        </a>

        <div className="ml-2 hidden flex-1 items-center justify-end gap-3 md:flex lg:gap-4">
          <a
            href="#home"
            onClick={onCloseMenu}
            className="hidden rounded-full border border-white/20 bg-white/6 px-4 py-2 text-sm font-medium text-blue-50 shadow-sm backdrop-blur-sm transition hover:border-white/35 hover:bg-white/14 hover:text-white xl:inline-flex"
          >
            {t.homeLabel}
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/8 p-1.5 pl-3 shadow-sm backdrop-blur-sm lg:inline-flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/80">
              {t.languageLabel}
            </span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  language === "fr"
                    ? "bg-white text-[#0646c4]"
                    : "text-blue-100 hover:bg-white/15 hover:text-white"
                }`}
                aria-pressed={language === "fr"}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  language === "en"
                    ? "bg-white text-[#0646c4]"
                    : "text-blue-100 hover:bg-white/15 hover:text-white"
                }`}
                aria-pressed={language === "en"}
              >
                EN
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-full border border-white/20 bg-white/6 p-1.5 shadow-sm backdrop-blur-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative whitespace-nowrap rounded-full px-3 py-2 text-sm text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white lg:px-4 after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="ml-2 shrink-0 inline-flex items-center justify-center rounded-xl border border-white/30 p-2 text-white transition hover:bg-white/10 md:hidden"
          onClick={onToggleMenu}
          aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-white/20 bg-[#04379a]/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <a
            href="#home"
            className="mb-4 block rounded-xl border border-white/15 bg-white/8 px-3 py-2 font-medium text-blue-50 transition hover:bg-white/14"
            onClick={onCloseMenu}
          >
            {t.homeLabel}
          </a>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 p-1 pl-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/80">
              {t.languageLabel}
            </span>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition ${
                language === "fr"
                  ? "bg-white text-[#0646c4]"
                  : "text-blue-100 hover:bg-white/15 hover:text-white"
              }`}
              aria-pressed={language === "fr"}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition ${
                language === "en"
                  ? "bg-white text-[#0646c4]"
                  : "text-blue-100 hover:bg-white/15 hover:text-white"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>

          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={`mobile-${item.href}`}>
                <a
                  href={item.href}
                  className="block rounded-xl border border-transparent px-3 py-2 font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white"
                  onClick={onCloseMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
