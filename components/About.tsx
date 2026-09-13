import Image from "next/image";
import { site } from "@/lib/site";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__image">
        <Image
          src="/images/hero-photo.jpg"
          alt="Violinist performing"
          fill
          sizes="(max-width: 960px) 100vw, 45vw"
        />
      </div>
      <div>
        <p className="about__kicker">
          <span className="about__line" />
          About me
        </p>
        <h2 className="about__title">{site.aboutTitle}</h2>
        <p className="about__body">{site.aboutBody}</p>
      </div>
    </section>
  );
}
