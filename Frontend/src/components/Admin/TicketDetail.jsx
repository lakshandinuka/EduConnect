import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import DuplicateDetector from './DuplicateDetector';

const statusClass = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sfs-blue/10 text-sfs-blue',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const priorityClass = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const PriorityBadge = ({ label, confidence }) => {
  const normalizedLabel = label?.toUpperCase();
  const colorClass = priorityClass[normalizedLabel] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`sfs-status ${colorClass}`}>
      {normalizedLabel || 'UNKNOWN'}
      {confidence > 0 && (
        <span className="ml-1 opacity-70">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </span>
  );
};

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState('');
  const [newDepartmentId, setNewDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      const url = user?.role === 'STUDENT' ? `/tickets/${ticketId}` : `/admin/tickets/${ticketId}`;
      const res = await api.get(url);

      setTicket(res.data);
      setStatus(res.data.status);
      setError('');
    } catch (err) {
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const requireComment = () => {
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return false;
    }

    return true;
  };

  const saveDuplicateResponse = async (responseText) => {
    if (user?.role !== 'DEPT_ADMIN' || !responseText) return;

    try {
      await api.post('/admin/save-response', {
        ticketId: String(ticket?.id || ticketId),
        responseText,
        adminNote: '',
      });
    } catch (err) {
      console.error('Failed to save duplicate response suggestion', err);
    }
  };

  const runAction = async (action, successMessage = 'Action completed', options = {}) => {
    if (!requireComment()) return;

    const responseText = commentText.trim();

    setActionLoading(true);

    try {
      await action();
      if (options.saveDuplicateResponse) {
        saveDuplicateResponse(responseText);
      }
      alert(successMessage);
      fetchTicket();
      setCommentText('');
      setNewDepartmentId('');
    } catch (err) {
      alert(err.response?.data || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTicket = () =>
    runAction(
      async () => {
        const payload = {
          status,
          comment: commentText,
          newDepartmentId: newDepartmentId || null,
        };

        await api.put(`/admin/tickets/${ticketId}`, payload);
      },
      'Ticket updated',
      { saveDuplicateResponse: true }
    );

  const handleSubmitApproval = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/submit-approval`, {
          comment: commentText,
        });
      },
      'Ticket submitted for approval',
      { saveDuplicateResponse: true }
    );

  const handleApprove = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/approve`, {
          comment: commentText,
        });
      },
      'Ticket approved'
    );

  const handleReject = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/reject`, {
          comment: commentText,
        });
      },
      'Ticket rejected'
    );

  const isDeptAdmin = user?.role === 'DEPT_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const canUpdate = isDeptAdmin && (ticket?.status === 'OPEN' || ticket?.status === 'IN_PROGRESS');
  const canSubmitApproval = isDeptAdmin && ticket?.status === 'IN_PROGRESS';
  const canApprove = isSuperAdmin && ticket?.status === 'RESOLVED';
  const canReject = isSuperAdmin && ticket?.status === 'RESOLVED';

  const showActions = !isStudent && (canUpdate || canSubmitApproval || canApprove || canReject);

  return (
    <div className="sfs-page">
      <Navbar />

      <main className="sfs-container">
        {loading ? (
          <div className="sfs-panel-pad text-slate-600">Loading ticket...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : ticket ? (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button type="button" onClick={() => navigate(-1)} className="sfs-link">
                  Back to Tickets
                </button>

                <h1 className="sfs-page-title mt-2">Ticket #{ticket.id}</h1>
              </div>

              <span className={`sfs-status ${statusClass[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
                {ticket.status || 'UNKNOWN'}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-6">
                <section className="sfs-panel overflow-hidden">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-extrabold text-sfs-ink">Student Information</h2>
                  </div>

                  <div className="grid md:grid-cols-3">
                    <InfoCell label="First Name" value={ticket.studentName?.split(' ')[0] || '-'} />
                    <InfoCell label="Last Name" value={ticket.studentName?.split(' ').slice(1).join(' ') || '-'} />
                    <InfoCell label="Phone" value={ticket.studentPhoneNumber || '-'} />
                    <InfoCell label="Email Address" value={ticket.studentEmail || '-'} />
                    <InfoCell label="Department" value={ticket.departmentName || '-'} />
                    <InfoCell label="Request Type" value={ticket.inquiryTypeName || '-'} />
                  </div>

                  <div className="border-t border-slate-200 p-5">
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Description
                    </div>

                    <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      {ticket.inquiryText || '-'}
                    </p>
                  </div>
                </section>

                <section className="sfs-panel-pad">
                  <h2 className="text-lg font-extrabold text-sfs-ink">Activity Log</h2>

                  {ticket.comments?.length > 0 ? (
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

                          <p className="mt-2 text-sm leading-relaxed text-slate-700">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                      No comments yet.
                    </p>
                  )}
                </section>

                {showActions && (
                  <section className="sfs-panel-pad">
                    <h2 className="text-lg font-extrabold text-sfs-ink">Admin Actions</h2>

                    <div className="mt-5 space-y-5">
                      {isDeptAdmin && (
                        <DuplicateDetector
                          ticketText={ticket.inquiryText}
                          onSelectResponse={setCommentText}
                        />
                      )}

                      <label>
                        <span className="sfs-label">
                          Comment <span className="text-red-500">*</span>
                        </span>

                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={4}
                          className="sfs-textarea"
                          placeholder="Enter your comment here..."
                        />
                      </label>

                      {canUpdate && (
                        <div className="grid gap-5 md:grid-cols-2">
                          <label>
                            <span className="sfs-label">Change Status</span>

                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="sfs-input"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                            </select>
                          </label>

                          <label>
                            <span className="sfs-label">Reassign Department</span>

                            <select
                              value={newDepartmentId}
                              onChange={(e) => setNewDepartmentId(e.target.value)}
                              className="sfs-input"
                            >
                              <option value="">No change</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      )}

                      <div className="flex flex-wrap justify-end gap-2">
                        {canUpdate && (
                          <button
                            type="button"
                            onClick={handleUpdateTicket}
                            disabled={actionLoading}
                            className="sfs-btn-primary"
                          >
                            {actionLoading ? 'Updating...' : 'Update Ticket'}
                          </button>
                        )}

                        {canSubmitApproval && (
                          <button
                            type="button"
                            onClick={handleSubmitApproval}
                            disabled={actionLoading}
                            className="sfs-btn-primary"
                          >
                            {actionLoading ? 'Submitting...' : 'Submit for Approval'}
                          </button>
                        )}

                        {canApprove && (
                          <button
                            type="button"
                            onClick={handleApprove}
                            disabled={actionLoading}
                            className="sfs-btn-primary"
                          >
                            {actionLoading ? 'Approving...' : 'Approve Ticket'}
                          </button>
                        )}

                        {canReject && (
                          <button
                            type="button"
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="sfs-btn-danger"
                          >
                            {actionLoading ? 'Rejecting...' : 'Reject Ticket'}
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <aside className="sfs-panel-pad h-fit">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Summary
                </h2>

                <div className="mt-4 space-y-4">
                  <SummaryItem label="Student" value={ticket.studentName || '-'} />
                  <SummaryItem label="Phone" value={ticket.studentPhoneNumber || '-'} />

                  <SummaryItem label="Severity Level">
                    {ticket.predictedPriorityLabel ? (
                      <PriorityBadge
                        label={ticket.predictedPriorityLabel}
                        confidence={ticket.priorityConfidence}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-500">Not predicted</span>
                    )}
                  </SummaryItem>

                  <SummaryItem label="Status">
                    <span className={`sfs-status ${statusClass[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
                      {ticket.status || 'UNKNOWN'}
                    </span>
                  </SummaryItem>

                  <SummaryItem label="Service Group" value={ticket.departmentName || 'Unassigned'} />

                  <SummaryItem
                    label="Assigned To"
                    value={ticket.departmentName ? `${ticket.departmentName} Administrator` : 'Unassigned'}
                  />

                  <SummaryItem label="Inquiry Type" value={ticket.inquiryTypeName || '-'} />

                  {!isStudent && (
                    <SummaryItem label="Available Actions">
                      <div className="flex flex-col gap-2">
                        {canSubmitApproval && (
                          <button
                            type="button"
                            onClick={handleSubmitApproval}
                            disabled={actionLoading}
                            className="sfs-btn-primary w-full justify-center"
                          >
                            Submit for Approval
                          </button>
                        )}

                        {canApprove && (
                          <button
                            type="button"
                            onClick={handleApprove}
                            disabled={actionLoading}
                            className="sfs-btn-primary w-full justify-center"
                          >
                            Approve
                          </button>
                        )}

                        {canReject && (
                          <button
                            type="button"
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="sfs-btn-danger w-full justify-center"
                          >
                            Reject
                          </button>
                        )}

                        {!canUpdate && !canSubmitApproval && !canApprove && !canReject && (
                          <span className="text-sm font-semibold text-slate-500">
                            No actions available
                          </span>
                        )}
                      </div>
                    </SummaryItem>
                  )}
                </div>
              </aside>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

const InfoCell = ({ label, value }) => (
  <div className="border-b border-slate-200 p-5 md:border-r md:[&:nth-child(3n)]:border-r-0">
    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </div>

    <div className="mt-1 text-sm font-semibold text-sfs-ink">
      {value}
    </div>
  </div>
);

const SummaryItem = ({ label, value, children }) => (
  <div>
    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </div>

    <div className="mt-1 text-sm font-semibold text-sfs-ink">
      {children || value}
    </div>
  </div>
);

export default TicketDetail;
