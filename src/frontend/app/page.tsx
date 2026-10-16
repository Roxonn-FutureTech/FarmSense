import WeatherGlobe from "./WeatherGlobe";

const Arrow = () => <span aria-hidden="true">↗</span>;

function LeafMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none"><path d="M25.8 5.5C15.2 5.6 7.2 9 7.2 17.2c0 4.7 3.2 7.3 7.2 7.3 8.1 0 11.4-8.4 11.4-19Z" fill="currentColor"/><path d="M5 27c3.8-7.3 8.1-10.9 16.4-15.3" stroke="#F5F3E9" strokeWidth="1.8" strokeLinecap="round"/></svg>
    </span>
  );
}

function SunIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>; }
function CloudIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.3 4.5 4.5 0 0 0 7 18Z"/></svg>; }
function DropIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/></svg>; }

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#home" aria-label="AgroClimate AI home"><LeafMark /><span>agroclimate<span className="brand-ai">.ai</span></span></a>
        <div className="nav-links"><a href="#platform">Platform</a><a href="#how-it-works">How it works</a><a href="#about">About</a></div>
        <a className="nav-cta" href="#live-weather">Explore climate globe <Arrow /></a>
      </nav>

      <section className="hero shell" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> CLIMATE-SMART FARMING, MADE CLEAR</div>
          <h1>Grow with<br /><em>the weather.</em></h1>
          <p className="hero-description">A changing climate shouldn’t mean guessing. Turn trusted weather intelligence into better, more confident decisions for your farm.</p>
          <div className="hero-actions"><a className="button-primary" href="#live-weather">Explore climate globe <Arrow /></a><a className="text-link" href="#how-it-works">See how it works <span>↓</span></a></div>
          <div className="hero-note"><span className="note-icon">✳</span><span>Built for the people who grow our future.</span></div>
        </div>

        <div className="hero-visual" aria-label="Illustration of a farm landscape with changing weather">
          <div className="visual-top"><span><i className="pulse" /> CLIMATE CONTEXT</span><span>FIELD VIEW&nbsp; · &nbsp;01</span></div>
          <div className="weather-card"><div className="weather-place">A SEASON IN PERSPECTIVE</div><div className="weather-main"><div><span className="weather-temp">12</span><span className="weather-c">months</span></div><SunIcon /></div><div className="weather-status">Understand the patterns</div><div className="weather-stats"><div><CloudIcon /><span><b>Temperature</b><small>Monthly climate normals</small></span></div><div><DropIcon /><span><b>Rainfall</b><small>Seasonal context</small></span></div></div></div>
          <div className="sun-glow" />
          <div className="landscape"><div className="hill hill-back" /><div className="hill hill-mid" /><div className="hill hill-front" /><div className="field-lines"><i/><i/><i/><i/><i/></div><div className="crop crop-one">♧</div><div className="crop crop-two">♧</div><div className="crop crop-three">♧</div><div className="crop crop-four">♧</div></div>
          <div className="visual-caption"><span>01 / CLIMATE THAT GUIDES YOUR PLAN</span><span>↓ &nbsp; SEASONAL OUTLOOK</span></div>
        </div>
      </section>

      <WeatherGlobe />

      <section className="trust-strip shell" id="about"><p>INTELLIGENCE FOR A MORE RESILIENT HARVEST</p><div className="trust-items"><span><b>NASA</b><small>Earth observation</small></span><i /><span><b>IBM</b><small>Weather insights</small></span><i /><span><b>YOUR FARM</b><small>Smarter decisions</small></span></div></section>

      <section className="platform-section" id="platform"><div className="shell platform-inner"><div><div className="eyebrow dark-eyebrow">A CLEARER VIEW OF WHAT’S NEXT</div><h2>From climate data<br />to <em>field-ready insight.</em></h2></div><p>AgroClimate AI brings weather patterns and practical farming guidance together, so you can plan ahead with a little more certainty.</p><a className="round-link" href="#how-it-works" aria-label="Learn how AgroClimate works">↘</a></div>
        <div className="shell feature-grid"><article><span className="feature-number">01</span><div className="feature-icon">⌁</div><h3>See the forecast<br />in context.</h3><p>Understand the conditions ahead and what they could mean for your fields.</p></article><article><span className="feature-number">02</span><div className="feature-icon">✳</div><h3>Make your next<br />move count.</h3><p>Get practical, data-informed guidance for the decisions that shape a season.</p></article><article><span className="feature-number">03</span><div className="feature-icon">↗</div><h3>Plan for a changing<br />climate.</h3><p>Use climate insights to build a more prepared and resilient farm.</p></article></div>
      </section>
      <footer className="footer shell" id="how-it-works"><a className="brand" href="#home"><LeafMark /><span>agroclimate<span className="brand-ai">.ai</span></span></a><span>Better insights. Stronger seasons.</span><span>© 2026 AgroClimate AI</span></footer>
    </main>
  );
}
