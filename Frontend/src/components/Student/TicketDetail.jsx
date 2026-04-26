import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

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

    const statusMeta = {
        OPEN: { color: '#b45309', bg: '#fef3c7', label: 'Open' },
        IN_PROGRESS: { color: '#1d4ed8', bg: '#dbeafe', label: 'In Progress' },
        RESOLVED: { color: '#166534', bg: '#dcfce7', label: 'Resolved' },
        APPROVED: { color: '#14532d', bg: '#bbf7d0', label: 'Approved' },
        REJECTED: { color: '#7f1d1d', bg: '#fee2e2', label: 'Rejected' },
    };
    const sm = statusMeta[ticket.status] || { color: '#374151', bg: '#f3f4f6', label: ticket.status };

    return (
        <>
            <div style={styles.page}>
                {/* Top bar */}
                <div style={styles.topBar}>
                    <button onClick={() => navigate('/my-tickets')} style={styles.backBtn}>← Back to My Tickets</button>
                    <span style={styles.topBarTitle}>
                        Ticket #{ticket.id} <span style={styles.subTitle}>(Viewing)</span>
                    </span>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    {/* ── MAIN PANEL ── */}
                    <div style={styles.main}>

                        {/* Ticket Information */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardHeaderTitle}>Ticket Information</span>
                            </div>

                            <div style={styles.grid2}>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Inquiry Type</div>
                                    <div style={styles.fieldValue}>{ticket.inquiryTypeName || '—'}</div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Department</div>
                                    <div style={styles.fieldValue}>{ticket.departmentName || '—'}</div>
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.fieldLabel}>Description</label>
                                    <div style={{ ...styles.readonlyField, minHeight: 80, whiteSpace: 'pre-wrap' }}>
                                        {ticket.inquiryText || '—'}
                                    </div>
                                </div>
                            </div>

                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.fieldLabel}>Attachments</label>
                                        <ul style={styles.attachList}>
                                            {ticket.attachments.map(att => (
                                                <li key={att.id}>
                                                    <a
                                                        href={att.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={styles.attachLink}
                                                    >
                                                        📎 {att.fileName}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Log / Comments */}
                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardHeaderTitle}>Activity Log</span>
                            </div>
                            {ticket.comments && ticket.comments.length > 0 ? (
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
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div style={styles.sidebar}>
                        <div style={styles.sideCard}>
                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Status</div>
                                <span style={{ ...styles.statusBadge, color: sm.color, backgroundColor: sm.bg }}>
                                    {sm.label}
                                </span>
                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Department</div>
                                <div style={styles.sideMuted}>{ticket.departmentName || '—'}</div>
                            </div>

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Assigned To</div>
                                <div style={styles.sideMuted}>{ticket.departmentName || 'unassigned'} Devision Administrator</div>

                            </div>

                            <div style={styles.sideDivider} />

                            <div style={styles.sideSection}>
                                <div style={styles.sideLabel}>Inquiry Type</div>
                                <div style={styles.sideMuted}>{ticket.inquiryTypeName || '—'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    * { box-sizing: border-box; }
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
    grid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: `1px solid ${C.borderLight}`,
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
    attachList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    attachLink: {
        color: C.primary,
        textDecoration: 'none',
        fontSize: 15,
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
    sideValue: { fontSize: 15, color: C.text },
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
        border: `3px solid #e5e7eb`,
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    loadingText: { color: '#6b7280', fontSize: 14 },
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

export default StudentTicketDetail;