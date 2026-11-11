import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed intro film: scrolling through the hero moves the video's
 * playhead (skycam descends from above the stadium to the ball).
 * The film is hosted on the live site; set VITE_FILM_BASE to host it elsewhere.
 */
const BASE = (import.meta.env.VITE_FILM_BASE as string | undefined) ?? "https://rb-iq-gameday.higgsfield.app/assets/world";
const FILM = `${BASE}/scene-01.mp4`;
const FILM_MOBILE = `${BASE}/scene-01-mobile.mp4`;
const POSTER = `${BASE}/scene-01-poster.png`;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 860px)").matches;
    video.src = mobile ? FILM_MOBILE : FILM;
    video.load();

    let raf = 0;
    let target = 0;
    const tick = () => {
      raf = 0;
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        const t = target * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.03) video.currentTime = t;
      }
    };
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    video.addEventListener("loadedmetadata", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("loadedmetadata", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef} aria-label="Intro">
      <div className="hero__stage">
        <video ref={videoRef} className="hero__video" poster={POSTER} muted playsInline preload="auto" />
        <div className="hero__shade" />
        <div className="hero__copy">
          <h1 className="hero__title">Football IQ wins snaps.</h1>
          <p className="hero__body">
            Gaps, run reads, blitz pickup and coverages, taught like game film and tested like game day. Your rating climbs with every rep.
          </p>
          <ul className="hero__tags">
            <li>7 weeks</li>
            <li>Coverage drills</li>
            <li>Final exam</li>
          </ul>
          <a className="rbiq-hero-cta" href="#season">
            Start Week 1
          </a>
        </div>
      </div>
    </section>
  );
}
