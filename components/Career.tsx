"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

// Scroll-driven "zoom and blur" (after Zach Richard's pen): the pinned photo
// starts zoomed in and sharp, then zooms out, blurs and fades as the reader
// scrolls through the section while the text passes over it.
const ZOOM_START = 1.25;
// Stay slightly above 1 so the blur's soft edges never expose the frame.
const ZOOM_END = 1.04;
const BLUR_MAX_PX = 14;
const FADE_MIN = 0.35;

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.setProperty("--career-zoom", "1");
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Skip work while the section is fully off-screen.
      if (rect.bottom < 0 || rect.top > viewport) return;

      // 0 when the photo pins to the top, 1 when the section scrolls away.
      const travel = Math.max(rect.height - media.offsetHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);

      section.style.setProperty(
        "--career-zoom",
        String(ZOOM_START - (ZOOM_START - ZOOM_END) * progress),
      );
      section.style.setProperty(
        "--career-blur",
        `${(BLUR_MAX_PX * progress).toFixed(2)}px`,
      );
      section.style.setProperty(
        "--career-fade",
        String(1 - (1 - FADE_MIN) * progress),
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="career" id="career" ref={sectionRef}>
      <div className="career__media" ref={mediaRef}>
        <Image
          className="career__photo"
          src="/images/career-photo.jpeg"
          alt="Violinist on stage during a performance"
          fill
          sizes="100vw"
        />
        <div className="career__scrim" />
      </div>

      <div className="career__body">
        <p className="career__kicker">
          <span className="career__line" />
          Career
        </p>
        <h2 className="career__title">{site.careerTitle}</h2>
        {site.careerBody.map((paragraph, index) => (
          <p className="career__text" key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
