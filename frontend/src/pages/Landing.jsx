import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  { icon: '🤟', title: 'Instant Translation', desc: 'Text & speech → ASL live.' },
  { icon: '📷', title: 'Image OCR', desc: 'Snap pics, get ASL output.' },
  { icon: '🎥', title: 'Media Support', desc: 'Upload YouTube video link.' },
];

const steps = [
  { icon: '📝', title: 'Enter Text', desc: 'Type or paste any text.' },
  { icon: '🤖', title: 'AI Translation', desc: 'Powered by our ASL model.' },
  { icon: '📹', title: 'Get Video', desc: 'View & share your ASL clip.' },
];

const faqs = [
  { q: 'Do I need an account?', a: 'Yes, signup is required.' },
  { q: 'Which file formats?', a: 'Plain text, PNG/JPEG, MP3, YouTube URLs.' },
  { q: 'Is it free?', a: 'Yes! All features are free.' },
];

export default function Landing() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    const onBeforeInstall = e => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Hero */}
      <div className="landing-hero fade-in delay-0">
        <div className="overlay" />

        {/* SVG wave */}
        <svg className="hero-wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,0 C360,100 1080,0 1440,100 L1440,100 L0,100 Z" fill="var(--bg)" />
        </svg>

        <div className="headline">
          <h1 className="fade-in delay-1">Welcome to Talk2Sign</h1>
          <p className="fade-in delay-2">Bridging Communication with Seamless ASL Translation</p>
          <div className="cta-group fade-in delay-3">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            {deferredPrompt && (
              <button onClick={handleInstall} className="btn btn-secondary">Install App</button>
            )}
          </div>
        </div>

        <div className="scroll-indicator fade-in delay-4"><span/></div>
      </div>

      {/* Features */}
      <section className="features section">
        <h2 className="section-heading fade-in delay-5">Why Talk2Sign?</h2>
        <div className="features-grid">
          {features.map((f,i) => (
            <div key={i} className={`feature-card card fade-in delay-${6+i}`}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section">
        <h2 className="section-heading fade-in delay-9">How It Works</h2>
        <div className="steps-grid">
          {steps.map((s,i) => (
            <div key={i} className={`step-card card fade-in delay-${10+i}`}>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mid-Page CTA */}
      <section className="mid-cta fade-in delay-13">
        <div className="mid-card">
          <h2>Ready to Begin?</h2>
          <Link to="/signup" className="btn btn-large">Get Started</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq section">
        <h2 className="section-heading fade-in delay-14">FAQ</h2>
        <div className="faq-list">
          {faqs.map((f,i) => (
            <div key={i} className={`faq-item fade-in delay-${15+i}`}>
              <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}>
                {f.q} <span>{activeFAQ === i ? '−' : '+'}</span>
              </button>
              {activeFAQ === i && <p className="faq-answer">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer fade-in delay-18">
        <div>© 2025 Talk2Sign. All rights reserved.</div>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </>
  );
}
