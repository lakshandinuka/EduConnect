import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TopNav from '../common/TopNav';
import SearchBar from './SearchBar';

const SideLink = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname === to || (to === '/kb' && location.pathname.startsWith('/kb') && !location.pathname.startsWith('/kb/faq'));

  return (
    <Link
      to={to}
      className={[
        'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue',
        active ? 'bg-sfs-blue/10 text-sfs-blue' : 'text-slate-700 hover:bg-slate-100',
      ].join(' ')}
    >
      <span>{label}</span>
      <span aria-hidden className="text-slate-400">{active ? '•' : ''}</span>
    </Link>
  );
};

export const KbLayout = ({
  children,
  title = 'Knowledge Base',
  subtitle = 'Search articles, guides and documents curated by SFS Academy.',
  showSearch = true,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-sfs-mist text-sfs-ink">
      <TopNav />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Left nav */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-xl border border-slate-200 bg-white shadow-[var(--tw-shadow)]">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Navigate
              </div>
            </div>
            <nav className="p-2">
              <SideLink to="/kb" label="Knowledge Hub" />
              <SideLink to="/kb/faq" label="FAQ" />
              {isAdmin && (
                <Link
                  to="/admin/kb"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                >
                  <span>Back to admin panel</span>
                </Link>
              )}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="rounded-xl border border-slate-200 bg-white p-5">
            <h1 className="text-2xl font-extrabold text-sfs-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
            {showSearch && (
              <div className="mt-4">
                <SearchBar variant="light" />
              </div>
            )}
          </header>

          <main className="pt-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default KbLayout;
