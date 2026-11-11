import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed intro film: scrolling through the hero moves the video's
 * playhead (skycam descends from above the stadium to the ball).
 * The film lives in public/assets/world (the deploy workflow fetches it).
 * Set VITE_FILM_BASE to load it from somewhere else.
 */
const BASE = (import.meta.env.VITE_FILM_BASE as string | undefined) ?? "./assets/world";
const FILM = `${BASE}/scene-01.mp4`;
const FILM_MOBILE = `${BASE}/scene-01-mobile.mp4`;
const POSTER = `${BASE}/scene-01-poster.png`;
const POSTER_MOBILE = `${BASE}/scene-01-mobile-poster.png`;

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

    // iOS Safari only paints seeked frames after the video has played once.
    let primed = false;
    const prime = () => {
      if (primed) return;
      primed = true;
      video
        .play()
        .then(() => {
          video.pause();
          onScroll();
        })
        .catch(() => {
          primed = false;
        });
    };

    let raf = 0;
    let target = 0;
    const tick = () => {
      raf = 0;
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        const t = target * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.03) video.currentTime = t;
        section.style.setProperty("--hero-p", target.toFixed(3));
        if (video.readyState >= 2) section.dataset.ready = "true";
      }
    };
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onFirstInput = () => prime();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onFirstInput, { passive: true, once: true });
    window.addEventListener("scroll", onFirstInput, { passive: true, once: true });
    video.addEventListener("loadedmetadata", onScroll);
    video.addEventListener("loadeddata", onScroll);
    prime();
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onFirstInput);
      window.removeEventListener("scroll", onFirstInput);
      video.removeEventListener("loadedmetadata", onScroll);
      video.removeEventListener("loadeddata", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef} aria-label="Intro">
      <div className="hero__stage">
        <picture>
          <source media="(max-width: 860px)" srcSet={POSTER_MOBILE} />
          <img className="hero__poster" src={POSTER} alt="" />
        </picture>
        <video ref={videoRef} className="hero__video" muted playsInline preload="auto" />
        <div className="hero__shade" />
        <div className="hero__lights" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="hero__copy">
          <p className="hero__kicker">
            <span className="hero__live" /> Game film is rolling
          </p>
          <h1 className="hero__title">
            <span>Football IQ</span> <span>wins snaps.</span>
          </h1>
          <p className="hero__body">
            Gaps, run reads, blitz pickup and coverages, taught like game film and tested like game day. Your rating climbs with every rep.
          </p>
          <ul className="hero__tags">
            <li>7 weeks</li>
            <li>59 visual quizzes</li>
            <li>Final exam</li>
          </ul>
          <a className="rbiq-hero-cta" href="#season">
            Start Week 1
          </a>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll to snap the ball</span>
          <i />
        </div>
        <div className="hero__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
