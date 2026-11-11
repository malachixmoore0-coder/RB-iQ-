import { Hero } from "./Hero";
import { RbIqApp } from "./rbiq/RbIqApp";
import "./base.css";

function Monogram() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 4h48l-6 56H2z" className="rbiq-mono-bg" />
      <text x="29" y="43" textAnchor="middle" className="rbiq-mono-txt">
        IQ
      </text>
    </svg>
  );
}

export function App() {
  return (
    <div className="rbiq-root">
      <header className="rbiq-nav">
        <a className="rbiq-nav__brand" href="#top">
          <Monogram />
          RB IQ
        </a>
        <a className="rbiq-nav__exam" href="#season">
          Your season
        </a>
      </header>
      <main id="top">
        <Hero />
        <RbIqApp />
      </main>
      <footer className="rbiq-foot">RB IQ. Built for one running back's comeback. Progress saves on this device.</footer>
    </div>
  );
}
