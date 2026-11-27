import { ArrowUpRight, CalendarDays, MapPin, Trophy, Users } from "lucide-react";

export default function QuickNavigationSection({ t, onNavigate }) {
  const cards = [
    {
      href: "/programmation",
      title: t.scheduleTitle,
      description: t.scheduleDescription,
      icon: <CalendarDays size={20} />,
      route: true,
    },
    {
      href: "/classement",
      title: t.rankingTitle,
      description: t.rankingDescription,
      icon: <Trophy size={20} />,
      route: true,
    },
    {
      href: "/equipes",
      title: t.teamsTitle,
      description: t.teamsDescription,
      icon: <Users size={20} />,
      route: true,
    },
    {
      href: "/lieu",
      title: t.locationTitle,
      description: t.locationDescription,
      icon: <MapPin size={20} />,
      route: true,
    },
  ];

  return (
    <nav className="quick-navigation" aria-label={t.quickNavTitle}>
      {cards.map((card) => (
        <a
          href={card.href}
          key={card.title}
          onClick={
            card.route
              ? (event) => onNavigate(event, card.href)
              : undefined
          }
          className="quick-navigation__card"
        >
          <span className="quick-navigation__icon">{card.icon}</span>
          <span className="quick-navigation__copy">
            <strong>{card.title}</strong>
            <small>{card.description}</small>
          </span>
          <ArrowUpRight size={17} className="quick-navigation__arrow" />
        </a>
      ))}
    </nav>
  );
}
