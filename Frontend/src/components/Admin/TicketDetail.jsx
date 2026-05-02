import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const statusClass = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-sfs-blue/10 text-sfs-blue',
  RESOLVED: 'bg-green-100 text-green-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  ESCALATED: 'bg-red-100 text-red-800',
};

const priorityClass = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const PriorityBadge = ({ label, confidence }) => {
  const normalizedLabel = label?.toUpperCase();
  const colorClass = priorityClass[normalizedLabel] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
      {normalizedLabel || 'Unknown'}
      {confidence > 0 && (
        <span className="ml-1 opacity-60 text-xs">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </span>
  );
};

const formatDateTime = (value) => {
  return value ? new Date(value).toLocaleString() : '—';
};

const getErrorMessage = (err) => {
  const data = err?.response?.data;

  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  return 'Action failed';
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
      setLoading(true);

      const url =
        user?.role === 'STUDENT'
          ? `/tickets/${ticketId}`
          : `/admin/tickets/${ticketId}`;

      const res = await api.get(url);

      setTicket(res.data);
      setStatus(res.data.status);
      setError('');
    } catch (err) {
      console.error('Failed to load ticket:', err);
      setError(getErrorMessage(err) || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, user?.role]);

  const isDeptAdmin = user?.role === 'DEPT_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const isEscalatedTicket =
    ticket?.status === 'ESCALATED' ||
    ticket?.escalated === 1 ||
    ticket?.escalated === true ||
    (ticket?.slaDueAt &&
      new Date(ticket.slaDueAt) < new Date() &&
      !['RESOLVED', 'APPROVED', 'REJECTED'].includes(ticket?.status));

  const canUpdate =
    isDeptAdmin &&
    (['OPEN', 'IN_PROGRESS', 'ESCALATED'].includes(ticket?.status) ||
      isEscalatedTicket);

  const canSubmitApproval =
    isDeptAdmin &&
    (['OPEN', 'IN_PROGRESS', 'ESCALATED'].includes(ticket?.status) ||
      isEscalatedTicket);

  const canApprove = isSuperAdmin && ticket?.status === 'RESOLVED';

  const canReject = isSuperAdmin && ticket?.status === 'RESOLVED';

  const showActions =
    !isStudent && (canUpdate || canSubmitApproval || canApprove || canReject);

  const requireComment = () => {
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return false;
    }

    return true;
  };

  const runAction = async (action, successMessage = 'Action completed') => {
    if (!requireComment()) return;

    setActionLoading(true);

    try {
      await action();
      alert(successMessage);
      setCommentText('');
      setNewDepartmentId('');
      await fetchTicket();
    } catch (err) {
      console.error('Ticket action failed:', err);
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTicket = () =>
    runAction(
      async () => {
        const payload = {
          status,
          comment: commentText.trim(),
          newDepartmentId: newDepartmentId || null,
        };

        await api.put(`/admin/tickets/${ticketId}`, payload);
      },
      isEscalatedTicket ? 'Escalated ticket response saved' : 'Ticket updated'
    );

  const handleSubmitApproval = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/submit-approval`, {
          comment: commentText.trim(),
        });
      },
      'Ticket submitted for approval'
    );

  const handleApprove = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/approve`, {
          comment: commentText.trim(),
        });
      },
      'Ticket approved'
    );

  const handleReject = () =>
    runAction(
      async () => {
        await api.post(`/admin/tickets/${ticketId}/reject`, {
          comment: commentText.trim(),
        });
      },
      'Ticket rejected'
    );

  return (
    <div className="sfs-page">
      <Navbar />

      <main className="sfs-container">
        {loading ? (
          <div className="sfs-panel-pad text-slate-600">
            Loading ticket...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : ticket ? (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="sfs-link"
                >
                  Back to Tickets
                </button>

                <h1 className="sfs-page-title mt-2">
                  Ticket #{ticket.id}
                </h1>
              </div>

              <span
                className={`sfs-status ${
                  isEscalatedTicket
                    ? 'bg-red-100 text-red-800'
                    : statusClass[ticket.status] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {isEscalatedTicket ? 'ESCALATED' : ticket.status || 'UNKNOWN'}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-6">
                {isEscalatedTicket && isDeptAdmin && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    This ticket has breached its SLA and is escalated. Add a response
                    below and move it to In Progress or submit it for approval.
                  </div>
                )}

                <section className="sfs-panel overflow-hidden">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-extrabold text-sfs-ink">
                      Student Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3">
                    <InfoCell
                      label="First Name"
                      value={ticket.studentName?.split(' ')[0] || '-'}
                    />
                    <InfoCell
                      label="Last Name"
                      value={
                        ticket.studentName?.split(' ').slice(1).join(' ') || '-'
                      }
                    />
                    <InfoCell
                      label="Phone"
                      value={ticket.studentPhoneNumber || '-'}
                    />
                    <InfoCell
                      label="Email Address"
                      value={ticket.studentEmail || '-'}
                    />
                    <InfoCell
                      label="Department"
                      value={ticket.departmentName || '-'}
                    />
                    <InfoCell
                      label="Request Type"
                      value={ticket.inquiryTypeName || '-'}
                    />
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
                  <h2 className="text-lg font-extrabold text-sfs-ink">
                    Activity Log
                  </h2>

                  {ticket.comments?.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {ticket.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-bold text-sfs-ink">
                              {comment.authorName}
                            </span>

                            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                              {comment.authorRole}
                            </span>

                            <span className="text-xs text-slate-500">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleString()
                                : ''}
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
                    <h2 className="text-lg font-extrabold text-sfs-ink">
                      Admin Actions
                    </h2>

                    <div className="mt-5 space-y-5">
                      <label>
                        <span className="sfs-label">
                          Comment <span className="text-red-500">*</span>
                        </span>

                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={4}
                          className="sfs-textarea"
                          placeholder={
                            isEscalatedTicket
                              ? 'Enter your response for the escalated ticket...'
                              : 'Enter your comment here...'
                          }
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
                              <option value="ESCALATED">Escalated</option>
                            </select>
                          </label>

                          <label>
                            <span className="sfs-label">
                              Reassign Department
                            </span>

                            <select
                              value={newDepartmentId}
                              onChange={(e) =>
                                setNewDepartmentId(e.target.value)
                              }
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
                            {actionLoading
                              ? 'Updating...'
                              : isEscalatedTicket
                                ? 'Respond to Escalation'
                                : 'Update Ticket'}
                          </button>
                        )}

                        {canSubmitApproval && (
                          <button
                            type="button"
                            onClick={handleSubmitApproval}
                            disabled={actionLoading}
                            className="sfs-btn-primary"
                          >
                            {actionLoading
                              ? 'Submitting...'
                              : 'Submit for Approval'}
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
                  <SummaryItem
                    label="Student"
                    value={ticket.studentName || '-'}
                  />

                  <SummaryItem
                    label="Phone"
                    value={ticket.studentPhoneNumber || '-'}
                  />

                  <SummaryItem label="Severity Level">
                    {ticket.predictedPriorityLabel ? (
                      <PriorityBadge
                        label={ticket.predictedPriorityLabel}
                        confidence={ticket.priorityConfidence}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-500">
                        Not predicted
                      </span>
                    )}
                  </SummaryItem>

                  <SummaryItem label="SLA Policy">
                    <span className="text-sm font-semibold text-slate-500">
                      {ticket.slaPolicyName || 'Not attached'}
                    </span>
                  </SummaryItem>

                  <SummaryItem label="SLA Due At">
                    <span className="text-sm font-semibold text-slate-500">
                      {formatDateTime(ticket.slaDueAt)}
                    </span>
                  </SummaryItem>

                  <SummaryItem label="Escalation">
                    <span
                      className={`text-sm font-semibold ${
                        isEscalatedTicket ? 'text-red-700' : 'text-slate-500'
                      }`}
                    >
                      {isEscalatedTicket ? 'Escalated' : 'Not escalated'}
                    </span>
                  </SummaryItem>

                  <SummaryItem label="Status">
                    <span
                      className={`sfs-status ${
                        isEscalatedTicket
                          ? 'bg-red-100 text-red-800'
                          : statusClass[ticket.status] ||
                            'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isEscalatedTicket ? 'ESCALATED' : ticket.status || 'UNKNOWN'}
                    </span>
                  </SummaryItem>

                  <SummaryItem
                    label="Service Group"
                    value={ticket.departmentName || 'Unassigned'}
                  />

                  <SummaryItem
                    label="Assigned To"
                    value={
                      ticket.departmentName
                        ? `${ticket.departmentName} Administrator`
                        : 'Unassigned'
                    }
                  />

                  <SummaryItem
                    label="Inquiry Type"
                    value={ticket.inquiryTypeName || '-'}
                  />

                  {!isStudent && (
                    <SummaryItem label="Available Actions">
                      <div className="flex flex-col gap-2">
                        {canUpdate && isEscalatedTicket && (
                          <button
                            type="button"
                            onClick={handleUpdateTicket}
                            disabled={actionLoading}
                            className="sfs-btn-primary w-full justify-center"
                          >
                            Respond to Escalation
                          </button>
                        )}

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

                        {!canUpdate &&
                          !canSubmitApproval &&
                          !canApprove &&
                          !canReject && (
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