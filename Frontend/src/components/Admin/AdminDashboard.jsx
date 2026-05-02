import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const statusClass = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sfs-blue/10 text-sfs-blue',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const filters = [
  { label: 'All Tickets', value: '' },
  { label: 'Pending Approval', value: 'RESOLVED' },
  { label: 'Completed', value: 'APPROVED' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/admin/tickets?status=${statusFilter}` : '/admin/tickets';
      const res = await api.get(url);
      setTickets(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  return (
    <div className="sfs-page">
      <Navbar />
      <main className="sfs-container">
        <div className="mb-6">
          <h1 className="sfs-page-title">Admin Dashboard</h1>
          <p className="sfs-muted mt-1">
            {user?.role === 'SUPER_ADMIN'
              ? 'You are viewing all tickets.'
              : 'Showing tickets for your department.'}
          </p>
        </div>

        <section className="sfs-panel overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value || 'all'}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    statusFilter === filter.value
                      ? 'bg-sfs-blue text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-slate-600">Loading tickets...</div>
          ) : error ? (
            <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {['ID', 'Student', 'Type', 'Department', 'Status', 'Created', 'Actions'].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-sfs-ink">#{ticket.id}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{ticket.studentName}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{ticket.inquiryTypeName}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{ticket.departmentName}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`sfs-status ${statusClass[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <button type="button" onClick={() => navigate(`/admin/tickets/${ticket.id}`)} className="sfs-btn-secondary">
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
