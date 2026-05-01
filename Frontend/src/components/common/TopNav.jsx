import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <Link
          to="/home"
          className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
        >
          <img
            src="/assets/sfs-academy.png"
            alt="SFS Academy"
            className="h-12 w-auto"
            loading="eager"
          />
          <span className="sr-only">SFS EDUCONNECT Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/home"
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue ${
              location.pathname === '/home' ? 'text-sfs-blue' : 'text-slate-700 hover:text-sfs-blue'
            }`}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-sfs-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 inline-flex items-center rounded-lg bg-sfs-blue px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
