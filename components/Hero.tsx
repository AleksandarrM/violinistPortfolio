import Image from "next/image";
import { site } from "@/lib/site";
import Nav from "./Nav";

export default function Hero() {
  return (
    <section className="hero">
      <Image
        className="hero__photo"
        src="/images/hero-photo.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero__scrim" />
      <Nav />
      <div className="hero__content">
        <p className="hero__tagline">{site.tagline}</p>
        <h1 className="hero__title">
          Lorem
          <br />
          Ipsum
        </h1>
        <p className="hero__sub">{site.subtitle}</p>
      </div>
      <div className="hero__scroll" aria-hidden="true" />
    </section>
  );
}
