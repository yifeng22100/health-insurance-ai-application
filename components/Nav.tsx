import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dataset', label: 'Dataset' },
  { to: '/insights', label: 'Insights' },
  { to: '/automl', label: 'AutoML' },
  { to: '/predict', label: 'Predict' },
  { to: '/forecast', label: 'Forecast' },
  { to: '/report', label: 'Report' },
  { to: '/health-tips', label: 'Health Tips' },
  { to: '/about', label: 'About' },
];

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 print:hidden ${
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-ink-quaternary' : 'bg-white'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-14 flex items-center gap-4">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 flex-shrink-0 mr-2">
          <span className="text-xl leading-none">🛡️</span>
          <span className="font-bold text-ink text-[16px] tracking-tight">
            HealthInsure<span className="text-brand">AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-brand bg-brand-light' : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-secondary transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span
              className={`block h-0.5 bg-ink rounded transition-transform origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span className={`block h-0.5 bg-ink rounded transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 bg-ink rounded transition-transform origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-quaternary bg-white px-4 py-2 animate-fade-in">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${
                  isActive ? 'text-brand bg-brand-light' : 'text-ink hover:bg-surface-secondary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Nav;
