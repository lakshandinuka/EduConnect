import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navBase =
  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue';

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${navBase} ${
        active ? 'text-sfs-blue' : 'text-slate-700 hover:bg-slate-50 hover:text-sfs-blue'
      }`}
    >
      {children}
    </Link>
  );
}

function Dropdown({ label, active, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        className={`${navBase} inline-flex items-center gap-1 ${
          active ? 'text-sfs-blue' : 'text-slate-700 hover:bg-slate-50 hover:text-sfs-blue'
        }`}
        aria-expanded={open}
      >
        {label}
        <span aria-hidden className="text-xs">
          {open ? '^' : 'v'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 min-w-56 pt-2">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <div className="grid gap-1">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isKbArea = location.pathname.startsWith('/kb') || location.pathname.startsWith('/admin/kb') || location.pathname === '/admin/faqs';
  const isBookingsArea = location.pathname === '/student/my-bookings' || location.pathname === '/book-appointment';

  const greeting = useMemo(() => {
    const name = user?.fullName || user?.email || 'User';
    return `Hi, ${name}`;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clearAdminNotice = () => {
    localStorage.setItem('adminNotif', 'false');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2">
        <Link
          to="/home"
          className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
        >
          <img src="/assets/sfs-academy.png" alt="SFS Academy" className="h-12 w-auto" />
          <span className="sr-only">SFS EDUCONNECT Home</span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1">
          {user ? (
            <>
              <NavLink to="/home">Home</NavLink>

              {user?.role === 'STUDENT' && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/kb">Knowledge Base</NavLink>
                  <NavLink to="/my-tickets">My Tickets</NavLink>
                  <NavLink to="/announcements">Announcements</NavLink>
                  <Dropdown label="My Bookings" active={isBookingsArea}>
                    <NavLink to="/student/my-bookings">My Bookings</NavLink>
                    <NavLink to="/book-appointment">Book New Appointment</NavLink>
                  </Dropdown>
                </>
              )}

              {(user?.role === 'DEPT_ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <>
                  <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>

                  <Dropdown label="Appointments">
                    <NavLink to="/admin/manage-types">Appointment Types</NavLink>
                    <NavLink to="/admin/manage-slots">Appointment Slots</NavLink>
                    <NavLink to="/admin/view-bookings">View Appointments</NavLink>
                  </Dropdown>
                </>
              )}

              {user?.role === 'SUPER_ADMIN' && (
                <>
                  <Dropdown label="Knowledge Base" active={isKbArea}>
                    <NavLink to="/kb">Preview Knowledge Base</NavLink>
                    <NavLink to="/admin/kb">Admin Knowledge Base</NavLink>
                    <NavLink to="/admin/faqs">Admin FAQ</NavLink>
                    <NavLink to="/admin/kb/categories">Admin Category Manager</NavLink>
                  </Dropdown>
                  <NavLink to="/admin/announcements" onClick={clearAdminNotice}>
                    Announcements
                  </NavLink>
                  <NavLink to="/admin/sla">SLA Policies</NavLink>
                  <NavLink to="/analytics">Analytics</NavLink>
                  <NavLink to="/register">Register User</NavLink>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <NavLink to="/admin/announcements" onClick={clearAdminNotice}>
                  Admin Panel
                </NavLink>
              )}

              <span className="hidden px-2 text-sm text-slate-500 lg:inline">{greeting}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-slate-700">Login to get started</span>
              <Link
                to="/login"
                className={`${navBase} text-sfs-blue hover:bg-slate-50`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
