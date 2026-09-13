import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Works from "@/components/Works";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="frame">
        <About />
        <Marquee />
        <Works />
        <ContactForm />
        <Footer />
      </div>
    </>
  );
}
