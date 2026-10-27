import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function SiteMapSection({ group, index }) {
  const { Icon, id, title, subtitle, items } = group;
  return <section id={`map-${id}`} className="site-map-section" aria-labelledby={`map-heading-${id}`}>
    <header className="site-map-section-heading">
      <span className="site-map-section-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
      <div><h2 id={`map-heading-${id}`}>{title}</h2><p>{subtitle}</p></div>
      <span className="site-map-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </header>
    <ul className="site-map-links">
      {items.map(([label, to, ItemIcon]) => <li key={label}>
        <Link to={to} aria-label={`前往${label}`}>
          <ItemIcon size={18} strokeWidth={1.6} aria-hidden="true" />
          <span>{label}</span><ArrowUpRight className="site-map-link-arrow" size={14} aria-hidden="true" />
        </Link>
      </li>)}
    </ul>
  </section>;
}