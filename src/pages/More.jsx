import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import SiteMapHero from '@/components/globest/sitemap/SiteMapHero';
import SiteMapSection from '@/components/globest/sitemap/SiteMapSection';
import navigationGroups from '@/components/globest/sitemap/navigationGroups';
import '@/components/globest/sitemap/site-map.css';

export default function More() {
  const { user } = useAuth();
  const groups = navigationGroups.filter(group => !group.adminOnly || user?.role === 'admin');
  return <div className="page-inner site-map-page customer-module">
    <SiteMapHero />
    <nav className="site-map-index" aria-label="按板块浏览全部菜单">
      {groups.map((group, index) => <a key={group.id} href={`#map-${group.id}`}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{group.title}
      </a>)}
    </nav>
    <div className="site-map-grid">
      {groups.map((group, index) => <SiteMapSection key={group.id} group={group} index={index} />)}
    </div>
  </div>;
}