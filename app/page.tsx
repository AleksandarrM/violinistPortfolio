import About from "@/components/About";
import Career from "@/components/Career";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Works from "@/components/Works";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="frame">
        <About />
        <Career />
        <Marquee />
        <Works />
        <ContactForm />
        <Footer />
      </div>
    </>
  );
}
