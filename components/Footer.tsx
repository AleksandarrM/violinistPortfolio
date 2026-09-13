import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer__copy">{site.copyright}</p>
        <p className="footer__credit">
          Violin model by{" "}
          <a href={site.modelCredit.href} target="_blank" rel="noreferrer">
            {site.modelCredit.author} / {site.modelCredit.sourceLabel}
          </a>
          , {site.modelCredit.license}
        </p>
      </div>
      <div className="footer__socials">
        {site.socials.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
      <div className="footer__legal">
        {site.legal.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
