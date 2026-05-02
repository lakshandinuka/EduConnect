import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const statusClass = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sfs-blue/10 text-sfs-blue',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    try {
      await api.delete(`/tickets/${ticketId}`);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      alert(err.response?.data || 'Failed to delete ticket');
    }
  };

  return (
    <div className="sfs-page">
      <Navbar />
      <main className="sfs-container">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="sfs-page-title">My Tickets</h1>
            <p className="sfs-muted mt-1">Track support requests and open details when you need updates.</p>
          </div>
          <Link to="/create-ticket" className="sfs-btn-primary">
            Create New Ticket
          </Link>
        </div>

        {loading ? (
          <div className="sfs-panel-pad text-slate-600">Loading tickets...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="sfs-panel-pad text-center text-slate-600">
            No tickets found. Create your first ticket whenever you need help.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="sfs-panel-pad transition hover:border-sfs-blue/40 hover:shadow-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <Link to={`/my-tickets/${ticket.id}`} className="sfs-link">
                      Ticket #{ticket.id}
                    </Link>
                    <h2 className="mt-1 text-lg font-extrabold text-sfs-ink">
                      {ticket.inquiryTypeName || 'Support Request'}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span>{ticket.departmentName || 'Department pending'}</span>
                      <span
                        className={`sfs-status ${
                          statusClass[ticket.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.status || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-700">
                      {ticket.inquiryText || 'No description provided.'}
                    </p>

                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Attachments</p>
                        <ul className="mt-2 space-y-1">
                          {ticket.attachments.map((att) => (
                            <li key={att.id}>
                              <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="sfs-link">
                                {att.fileName}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {ticket.status === 'OPEN' && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link to={`/tickets/${ticket.id}/add-attachment`} className="sfs-btn-secondary">
                        Add Attachment
                      </Link>
                      <button type="button" onClick={() => handleDelete(ticket.id)} className="sfs-btn-danger">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs font-semibold text-slate-500">
                  Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown'}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTickets;
