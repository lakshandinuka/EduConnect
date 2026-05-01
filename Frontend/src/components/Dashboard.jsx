import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const statusStyles = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const statusPriority = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  APPROVED: 4,
  REJECTED: 5,
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketError, setTicketError] = useState('');

  useEffect(() => {
    if (user?.role !== 'STUDENT') return;

    const fetchTickets = async () => {
      try {
        setTicketsLoading(true);
        setTicketError('');
        const res = await api.get('/tickets');
        setTickets(Array.isArray(res.data) ? res.data : []);
      } catch {
        setTicketError('Failed to load your current tickets.');
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const currentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => {
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      })
      .slice(0, 6);
  }, [tickets]);

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'DEPT_ADMIN' || user.role === 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/announcements" replace />;
  }

  const firstName = user.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-sfs-mist text-sfs-ink">
      <Navbar />

      <section className="relative">
        <div
          className="h-[48vh] min-h-[380px] w-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/hero-campus.jpg)' }}
          role="img"
          aria-label="SFS Academy campus"
        >
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl items-center px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Welcome, {firstName}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                  Your SFS EDUConnect dashboard brings support tickets and knowledge base guidance into one place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/create-ticket"
                    className="inline-flex items-center rounded-lg bg-sfs-red px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Create a Ticket
                  </Link>
                  <Link
                    to="/kb"
                    className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-sfs-blue shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Go to Knowledge Base
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-sfs-ink">Current Tickets</h2>
            <p className="mt-1 text-sm text-slate-600">
              Track your latest support requests and open the details when you need updates.
            </p>
          </div>
          <Link
            to="/my-tickets"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
          >
            View All Tickets
          </Link>
        </div>

        {ticketsLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600">Loading tickets...</div>
        ) : ticketError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">{ticketError}</div>
        ) : currentTickets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No tickets yet. Create your first ticket whenever you need help.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {currentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/my-tickets/${ticket.id}`}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sfs-blue/40 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-sfs-blue">
                      Ticket #{ticket.id}
                    </div>
                    <h3 className="mt-1 truncate text-lg font-extrabold text-sfs-ink">
                      {ticket.inquiryTypeName || 'Support Request'}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      statusStyles[ticket.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ticket.status || 'UNKNOWN'}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {ticket.inquiryText || 'No description provided.'}
                </p>
                <div className="mt-4 text-xs font-semibold text-slate-500">
                  {ticket.departmentName || 'Department pending'}
                  {ticket.createdAt ? ` | ${new Date(ticket.createdAt).toLocaleDateString()}` : ''}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
