import { site } from "@/lib/site";

export default function Marquee() {
  const row = [...site.concerts, ...site.concerts];

  return (
    <div className="banner" aria-hidden="true">
      <div className="banner__track">
        {row.map((name, index) => (
          <span className="banner__item" key={`${name}-${index}`}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
