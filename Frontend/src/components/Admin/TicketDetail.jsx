import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

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
    const [noteType, setNoteType] = useState('public');

    console.log('status:', status);



    useEffect(() => {
        fetchTicket();
        fetchDepartments();
    }, [ticketId]);

    const fetchTicket = async () => {
        try {
            const url = user?.role === 'STUDENT' ? `/tickets/${ticketId}` : `/admin/tickets/${ticketId}`;
            const res = await api.get(url);
            setTicket(res.data);
            setStatus(res.data.status);
        } catch (err) {
            setError('Failed to load ticket');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error('Failed to fetch departments');
        }
    };

    const handleUpdateTicket = async () => {
        if (!commentText.trim()) { alert('Please enter a comment'); return; }
        setActionLoading(true);
        try {
            const payload = { status, comment: commentText, newDepartmentId: newDepartmentId || null };
            await api.put(`/admin/tickets/${ticketId}`, payload);
            alert('Ticket updated');
            fetchTicket();
            setCommentText('');
            setNewDepartmentId('');
        } catch (err) {
            alert(err.response?.data || 'Update failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitApproval = async () => {
        if (!commentText.trim()) { alert('Please enter a comment'); return; }
        setActionLoading(true);
        try {
            await api.post(`/admin/tickets/${ticketId}/submit-approval`, { comment: commentText });
            alert('Ticket submitted for approval');
            fetchTicket();
            setCommentText('');
        } catch (err) {
            alert(err.response?.data || 'Submission failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!commentText.trim()) { alert('Please enter a comment'); return; }
        setActionLoading(true);
        try {
            await api.post(`/admin/tickets/${ticketId}/approve`, { comment: commentText });
            alert('Ticket approved');
            fetchTicket();
            setCommentText('');
        } catch (err) {
            alert(err.response?.data || 'Approval failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!commentText.trim()) { alert('Please enter a comment'); return; }
        setActionLoading(true);
        try {
            await api.post(`/admin/tickets/${ticketId}/reject`, { comment: commentText });
            alert('Ticket rejected');
            fetchTicket();
            setCommentText('');
        } catch (err) {
            alert(err.response?.data || 'Rejection failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div style={styles.loadingWrap}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading ticket...</p>
        </div>
    );
    if (error) return (
        <div style={styles.errorBanner}><span>⚠</span> {error}</div>
    );
    if (!ticket) return null;

    const isDeptAdmin = user?.role === 'DEPT_ADMIN';
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isStudent = user?.role === 'STUDENT';

    const canUpdate = isDeptAdmin && (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS');
    const canSubmitApproval = isDeptAdmin && ticket.status === 'IN_PROGRESS';
    const canApprove = isSuperAdmin && ticket.status === 'RESOLVED';
    const canReject = isSuperAdmin && ticket.status === 'RESOLVED';

    const statusMeta = {
        OPEN: { color: '#b45309', bg: '#fef3c7', label: 'Open' },
        IN_PROGRESS: { color: '#1d4ed8', bg: '#dbeafe', label: 'In Progress' },
        RESOLVED: { color: '#166534', bg: '#dcfce7', label: 'Resolved' },
        APPROVED: { color: '#14532d', bg: '#bbf7d0', label: 'Approved' },
        REJECTED: { color: '#7f1d1d', bg: '#fee2e2', label: 'Rejected' },
    };
    const sm = statusMeta[ticket.status] || { color: '#374151', bg: '#f3f4f6', label: ticket.status };

    return (
        <><Navbar />
            <div style={styles.page}>
                {/* Top bar */}
                <div style={styles.topBar}>
                    <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back to Tickets</button>
                    <span style={styles.topBarTitle}>
                        Ticket #{ticket.id} <span style={styles.subTitle}>(Viewing)</span>
                    </span>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    {/* ── MAIN PANEL ── */}
                    <div style={styles.main}>

                        {/* Customer Information */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardHeaderTitle}>Student Information</span>
                            </div>
                            <div style={styles.grid3}>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>First Name</div>
                                    <div style={styles.fieldValue}>{ticket.studentName?.split(' ')[0] || '—'}</div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Last Name</div>
                                    <div style={styles.fieldValue}>{ticket.studentName?.split(' ').slice(1).join(' ') || '—'}</div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Phone</div>
                                    <div style={styles.fieldValue}>{ticket.studentPhoneNumber || '—'}</div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Email Address</div>
                                    <div style={{ ...styles.fieldValue, color: '#2563eb' }}>{ticket.studentEmail || '—'}</div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Department</div>
                                    <div style={styles.fieldValue}>{ticket.departmentName || '—'}</div>
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.fieldLabel}>Nature of Request</label>
                                    <div style={styles.readonlyField}>{ticket.inquiryTypeName || '—'}</div>
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.fieldLabel}>Subject / Description</label>
                                    <div style={{ ...styles.readonlyField, minHeight: 80, whiteSpace: 'pre-wrap' }}>
                                        {ticket.inquiryText || '—'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Log / Comments */}
                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardHeaderTitle}>Activity Log</span>
                            </div>
                            {ticket.comments?.length > 0 ? (
                                <div style={styles.commentList}>
                                    {ticket.comments.map(comment => (
                                        <div key={comment.id} style={styles.commentItem}>
                                            <div style={styles.commentAvatar}>
                                                {comment.authorName?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div style={styles.commentBody}>
                                                <div style={styles.commentMeta}>
                                                    <span style={styles.commentAuthor}>{comment.authorName}</span>
                                                    <span style={styles.commentRole}>({comment.authorRole})</span>
                                                    <span style={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div style={styles.commentText}>{comment.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={styles.emptyState}>No comments yet.</p>
                            )}
                        </div>

                        {/* Admin Actions */}
                        {!isStudent && (canUpdate || canSubmitApproval || canApprove || canReject) && (
                            <div style={{ ...styles.card, marginTop: 16 }}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.cardHeaderTitle}>Admin Actions</span>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.fieldLabel}>
                                            Comment <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            rows={4}
                                            style={styles.textarea}
                                            placeholder="Enter your comment here..."
                                        />
                                    </div>
                                </div>

                                {canUpdate && (
                                    <div style={{ ...styles.formRow, paddingTop: 0 }}>
                                        <div style={styles.grid2}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.fieldLabel}>Change Status</label>
                                                <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                                                    <option value="OPEN">Open</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                </select>
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.fieldLabel}>Reassign Department</label>
                                                <select value={newDepartmentId} onChange={(e) => setNewDepartmentId(e.target.value)} style={styles.select}>
                                                    <option value="">No change</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={styles.actionBar}>
                                    <div style={styles.actionBarRight}>
                                        {canUpdate && (
                                            <button onClick={handleUpdateTicket} disabled={actionLoading} style={styles.btnBlue}>
                                                {actionLoading ? 'Updating...' : 'Update Ticket'}
                                            </button>
                                        )}
                                        {canSubmitApproval && (
                                            // GREEN — positive forward action
                                            <button onClick={handleSubmitApproval} disabled={actionLoading} style={styles.btnGreen}>
                                                {actionLoading ? 'Submitting...' : 'Submit for Approval'}
                                            </button>
                                        )}
                                        {canApprove && (
                                            // GREEN — approval / success action
                                            <button onClick={handleApprove} disabled={actionLoading} style={styles.btnGreen}>
                                                {actionLoading ? 'Approving...' : 'Approve Ticket'}
                                            </button>
                                        )}
                                        {canReject && (
                                            // RED — destructive / rejection action
                                            <button onClick={handleReject} disabled={actionLoading} style={styles.btnRed}>
                                                {actionLoading ? 'Rejecting...' : 'Reject Ticket'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div style={styles.sidebar}>
                        <div style={styles.sideCard}>
                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Student</div>
                                <div style={styles.sideLinkValue}>{ticket.studentName}</div>
                                <div style={styles.sideLinkValue}>{ticket.studentPhoneNumber}</div>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Severity Level</div>
                                <div style={styles.sideMuted}>select</div>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Status</div>
                                <span style={{ ...styles.statusBadge, color: sm.color, backgroundColor: sm.bg }}>
                                    {sm.label}
                                </span>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Service Group</div>
                                <div style={styles.sideMuted}>{ticket.departmentName || 'unassigned'}</div>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Assigned To</div>
                                <div style={styles.sideMuted}>{ticket.departmentName || 'unassigned'} Devision Administrator</div>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Inquiry Type</div>
                                <div style={styles.sideMuted}>{ticket.inquiryTypeName || '—'}</div>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Actions</div>
                                {!isStudent && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                                        {canSubmitApproval && (
                                            // GREEN — positive forward action
                                            <button style={styles.sideActionBtnGreen} onClick={handleSubmitApproval} disabled={actionLoading}>
                                                Submit for Approval
                                            </button>
                                        )}
                                        {canApprove && (
                                            // GREEN — approval / success action
                                            <button style={styles.sideActionBtnGreen} onClick={handleApprove} disabled={actionLoading}>
                                                Approve
                                            </button>
                                        )}
                                        {canReject && (
                                            // RED — destructive / rejection action
                                            <button style={styles.sideActionBtnRed} onClick={handleReject} disabled={actionLoading}>
                                                Reject
                                            </button>
                                        )}
                                        {!canUpdate && !canSubmitApproval && !canApprove && !canReject && (
                                            <div style={styles.sideMuted}>No actions available</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');
                * { box-sizing: border-box; }
                body { font-family: 'Source Sans 3', sans-serif; }
                button:disabled { opacity: 0.6; cursor: not-allowed; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
            </div>
        </>
    );
};

const C = {
    bg: '#f0f0f0',
    white: '#ffffff',
    border: '#d1d5db',
    borderLight: '#e5e7eb',
    text: '#1f2937',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    primary: '#2563eb',
    green: '#16a34a',
    red: '#dc2626',
};

const styles = {
    page: {
        fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
        background: C.bg,
        minHeight: '100vh',
        color: C.text,
        fontSize: 16,
    },
    topBar: {
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: C.primary,
        cursor: 'pointer',
        fontSize: 15,
        padding: '2px 0',
    },
    topBarTitle: {
        fontWeight: 700,
        fontSize: 18,
        color: C.text,
    },
    subTitle: {
        fontWeight: 400,
        color: C.textMuted,
        fontSize: 16,
    },
    body: {
        display: 'flex',
        gap: 16,
        padding: '16px 20px',
        alignItems: 'flex-start',
    },
    main: { flex: 1, minWidth: 0 },
    card: {
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: '10px 16px',
        borderBottom: `1px solid ${C.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#fafafa',
    },
    cardHeaderTitle: {
        fontWeight: 700,
        fontSize: 15,
        color: C.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
    },
    grid3: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: `1px solid ${C.borderLight}`,
    },
    grid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },
    field: {
        padding: '10px 16px',
        borderRight: `1px solid ${C.borderLight}`,
    },
    fieldLabel: {
        fontSize: 13,
        color: C.textMuted,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 3,
        display: 'block',
    },
    fieldValue: {
        fontSize: 15,
        color: C.text,
        fontWeight: 500,
    },
    formRow: {
        padding: '12px 16px',
        borderBottom: `1px solid ${C.borderLight}`,
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    readonlyField: {
        padding: '7px 10px',
        background: '#f9fafb',
        border: `1px solid ${C.borderLight}`,
        borderRadius: 3,
        fontSize: 15,
        color: C.text,
        lineHeight: 1.5,
    },
    textarea: {
        padding: '8px 10px',
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        fontSize: 15,
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
        color: C.text,
        lineHeight: 1.5,
        width: '100%',
    },
    select: {
        padding: '7px 10px',
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        fontSize: 15,
        background: C.white,
        color: C.text,
        outline: 'none',
        width: '100%',
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        borderTop: `1px solid ${C.borderLight}`,
        background: '#fafafa',
    },
    actionBarRight: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    // Blue — neutral update action
    btnBlue: {
        background: C.primary,
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        padding: '7px 16px',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    // Green — positive / approve / submit actions
    btnGreen: {
        background: C.green,
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        padding: '7px 16px',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    // Red — destructive / reject actions
    btnRed: {
        background: C.red,
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        padding: '7px 16px',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    commentList: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    commentItem: {
        display: 'flex',
        gap: 10,
        padding: '10px 12px',
        background: '#f9fafb',
        borderRadius: 4,
        border: `1px solid ${C.borderLight}`,
        borderLeft: `3px solid ${C.primary}`,
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: C.primary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
    },
    commentBody: { flex: 1 },
    commentMeta: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    commentAuthor: { fontWeight: 700, fontSize: 14, color: C.text },
    commentRole: {
        fontSize: 13,
        color: C.textMuted,
        background: '#e5e7eb',
        padding: '1px 6px',
        borderRadius: 10,
    },
    commentDate: { fontSize: 12, color: C.textLight, marginLeft: 'auto' },
    commentText: { fontSize: 14, color: C.text, lineHeight: 1.5 },
    emptyState: {
        padding: 24,
        textAlign: 'center',
        color: C.textMuted,
        fontSize: 15,
    },
    sidebar: { width: 220, flexShrink: 0 },
    sideCard: {
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: 'hidden',
    },
    sideSection: { padding: '10px 14px' },
    sideLabel: {
        fontSize: 13,
        color: C.text,
        fontWeight: 700,
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
    },
    sideLinkValue: { color: C.primary, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
    sideValue: { fontSize: 15, color: C.text },
    sideSubValue: { fontSize: 14, color: C.text, marginTop: 2 },
    sideMuted: { fontSize: 14, color: C.primary, cursor: 'pointer' },
    sideDivider: { borderTop: `1px solid ${C.borderLight}` },
    statusBadge: {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
        marginTop: 2,
    },
    // Sidebar — green button (submit / approve)
    sideActionBtnGreen: {
        background: C.green,
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        padding: '5px 10px',
        fontSize: 14,
        cursor: 'pointer',
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
    },
    // Sidebar — red button (reject)
    sideActionBtnRed: {
        background: C.red,
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        padding: '5px 10px',
        fontSize: 14,
        cursor: 'pointer',
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
    },
    loadingWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        gap: 12,
    },
    spinner: {
        width: 32,
        height: 32,
        border: `3px solid ${C.borderLight}`,
        borderTopColor: C.primary,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    loadingText: { color: C.textMuted, fontSize: 14 },
    errorBanner: {
        background: '#fee2e2',
        color: '#991b1b',
        padding: '12px 20px',
        borderBottom: `1px solid #fca5a5`,
        fontSize: 16,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
};

export default TicketDetail;