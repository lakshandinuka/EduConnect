import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TopLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={[
        'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue',
        active ? 'text-sfs-blue' : 'text-slate-700 hover:text-sfs-blue',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

export default function AdminShell({ children, title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);

  const greeting = useMemo(() => {
    const name = user?.fullName || user?.username || 'Admin';
    return `Hi, ${name}`;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sfs-mist text-sfs-ink">
      {/* Admin top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <Link
            to="/home"
            className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
          >
            <img src="/assets/sfs-academy.svg" alt="SFS Academy" className="h-7 w-auto" />
            <span className="sr-only">SFS EDUCONNECT Home</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Admin navigation">
            <TopLink to="/admin/kb">Admin Knowledgebase</TopLink>
            <TopLink to="/admin/faqs">Admin FAQ</TopLink>
            <TopLink to="/admin/kb/categories">Categories</TopLink>
            <TopLink to="/admin/kb/policies">Policies</TopLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{greeting}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-slate-200 bg-white/80">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
            <TopLink to="/admin/kb">Admin Knowledgebase</TopLink>
            <TopLink to="/admin/faqs">Admin FAQ</TopLink>
            <TopLink to="/admin/kb/categories">Categories</TopLink>
            <TopLink to="/admin/kb/policies">Policies</TopLink>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Left sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-xl border border-slate-200 bg-white shadow-[var(--tw-shadow)]">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Preview
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => setPreviewOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                aria-expanded={previewOpen}
              >
                <span>Preview</span>
                <span aria-hidden className="text-slate-400">{previewOpen ? '▾' : '▸'}</span>
              </button>

              {previewOpen && (
                <div className="mt-1 grid gap-1 pl-2">
                  <Link
                    to="/kb"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                  >
                    Knowledge Hub
                  </Link>
                  <Link
                    to="/kb/faq"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {title && (
            <h1 className="mb-4 text-2xl font-extrabold text-sfs-ink">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
