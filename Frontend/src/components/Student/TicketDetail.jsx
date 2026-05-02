import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const statusClass = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sfs-blue/10 text-sfs-blue',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const StudentTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        setTicket(res.data);
      } catch (err) {
        setError('Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <div className="sfs-panel-pad text-slate-600">Loading ticket...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  if (!ticket) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button type="button" onClick={() => navigate('/my-tickets')} className="sfs-link">
            Back to My Tickets
          </button>
          <h1 className="sfs-page-title mt-2">Ticket #{ticket.id}</h1>
        </div>
        <span className={`sfs-status ${statusClass[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
          {ticket.status || 'UNKNOWN'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <section className="sfs-panel overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-extrabold text-sfs-ink">Ticket Information</h2>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              <InfoCell label="Inquiry Type" value={ticket.inquiryTypeName || '-'} />
              <InfoCell label="Department" value={ticket.departmentName || '-'} />
            </div>
            <div className="border-t border-slate-200 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</div>
              <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {ticket.inquiryText || '-'}
              </p>
            </div>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="border-t border-slate-200 p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Attachments</div>
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
          </section>

          <section className="sfs-panel-pad">
            <h2 className="text-lg font-extrabold text-sfs-ink">Activity Log</h2>
            {ticket.comments && ticket.comments.length > 0 ? (
              <div className="mt-4 space-y-3">
                {ticket.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-sfs-ink">{comment.authorName}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                        {comment.authorRole}
                      </span>
                      <span className="text-xs text-slate-500">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                No comments yet.
              </p>
            )}
          </section>
        </div>

        <aside className="sfs-panel-pad h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Summary</h2>
          <div className="mt-4 space-y-4">
            <SummaryItem label="Status">
              <span className={`sfs-status ${statusClass[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
                {ticket.status || 'UNKNOWN'}
              </span>
            </SummaryItem>
            <SummaryItem label="Department" value={ticket.departmentName || '-'} />
            <SummaryItem label="Assigned To" value={ticket.departmentName ? `${ticket.departmentName} Administrator` : 'Unassigned'} />
            <SummaryItem label="Inquiry Type" value={ticket.inquiryTypeName || '-'} />
          </div>
        </aside>
      </div>
    </div>
  );
};

const InfoCell = ({ label, value }) => (
  <div className="border-b border-slate-200 p-5 md:border-r md:last:border-r-0">
    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-1 text-sm font-semibold text-sfs-ink">{value}</div>
  </div>
);

const SummaryItem = ({ label, value, children }) => (
  <div>
    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-1 text-sm font-semibold text-sfs-ink">{children || value}</div>
  </div>
);

export default StudentTicketDetail;
