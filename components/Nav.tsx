import { site } from "@/lib/site";

export default function Nav() {
  return (
    <nav className="nav">
      <a className="nav__logo" href="#">
        {site.logo}
      </a>
      <ul className="nav__list">
        {site.nav.map((item) => (
          <li key={item.href}>
            <a className="nav__link" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
