import { Menu, X } from "lucide-react";

const navItems = [
  { href: "#module", label: "Module" },
  { href: "#classement", label: "Classement" },
  { href: "#retenues", label: "Équipes retenues" },
  { href: "#programmation", label: "Programmation" },
  { href: "#lieu", label: "Lieu" },
];

export default function Header({ mobileMenuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0646c4] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex min-w-0 items-center gap-3 pr-3 sm:gap-4 md:mr-6 md:pr-0 lg:mr-10">
          <img
            src="/images/logo_fifve.jpeg"
            alt="Logo FIFVE"
            className="h-20 w-20 rounded-full bg-white object-contain p-1"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-blue-100 sm:text-sm">
              FIFVE 2026
            </p>
            <h1 className="text-sm font-bold leading-tight sm:text-xl lg:text-2xl">
              Fédération Internationale de Football Vétérans
            </h1>
            <p className="text-xs text-blue-100 sm:text-sm">
              Football our Passion
            </p>
          </div>
        </div>

        <nav className="ml-4 hidden shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-sm md:flex lg:ml-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-full px-4 py-2 text-blue-100 transition-colors duration-300 hover:bg-white/15 hover:text-white after:absolute after:left-1/2 after:bottom-1 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white/90 after:transition-all after:duration-300 hover:after:w-6"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="ml-2 shrink-0 inline-flex items-center justify-center rounded-xl border border-white/30 p-2 text-white transition hover:bg-white/10 md:hidden"
          onClick={onToggleMenu}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-white/20 bg-[#04379a] px-6 py-4 md:hidden">
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
