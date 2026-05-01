import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getKBItem, updateKBItem } from '../services/kbService';
import AdminToolbar from '../components/KbAdmin/AdminToolbar';
import InlineEditableText from '../components/kb/InlineEditableText';
import PdfViewerWrapper from '../components/kb/PdfViewerWrapper';
import Badge from '../components/common/Badge';
import { useToast, ToastContainer } from '../components/common/Toast';

export const AdminPreviewPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const itemId = searchParams.get('item');

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [simulatedUser, setSimulatedUser] = useState('admin');
    const [pendingChanges, setPendingChanges] = useState({});
    const { toasts, showToast, removeToast } = useToast();

    const simulations = [
        { value: 'admin', label: 'Admin' },
        { value: 'student', label: 'Student' },
        { value: 'staff', label: 'Staff' },
    ];

    useEffect(() => {
        if (itemId) {
            fetchItem();
        } else {
            navigate('/admin/kb');
        }
    }, [itemId]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            const data = await getKBItem(itemId);
            setItem(data);
        } catch (err) {
            showToast('Failed to load item', 'error');
            navigate('/admin/kb');
        } finally {
            setLoading(false);
        }
    };

    const handleInlineEdit = (field, value) => {
        setPendingChanges({ ...pendingChanges, [field]: value });
    };

    const handleSaveEdit = async (field, value) => {
        try {
            const updatedData = { ...item, [field]: value };
            await updateKBItem(itemId, updatedData);
            setItem(updatedData);
            setPendingChanges({ ...pendingChanges, [field]: undefined });
            showToast(`${field} updated`, 'success');
        } catch (err) {
            showToast('Failed to save changes', 'error');
        }
    };

    const handleExit = () => {
        navigate('/admin/kb');
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                <div className="flex items-center justify-center h-screen">
                    <p className="text-white/70">Item not found</p>
                </div>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pb-24">
            {/* Admin Toolbar */}
            <AdminToolbar
                editMode={editMode}
                onEditModeToggle={() => setEditMode(!editMode)}
                onExit={handleExit}
                onSimulationChange={setSimulatedUser}
                simulations={simulations}
                currentSimulation={simulatedUser}
            />

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Article Header */}
                <div className="bg-black/20 backdrop-blur-md rounded-lg border border-white/15 p-8 mb-8">
                    {editMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    defaultValue={item.title}
                                    onBlur={(e) =>
                                        handleSaveEdit('title', e.target.value)
                                    }
                                    className="w-full text-3xl font-bold text-white border border-red-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Description
                                </label>
                                <textarea
                                    defaultValue={item.description}
                                    onBlur={(e) =>
                                        handleSaveEdit('description', e.target.value)
                                    }
                                    className="w-full border border-red-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-white mb-4">
                                {item.title}
                            </h1>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge variant="category">
                                    {item.category?.name}
                                </Badge>
                                <Badge variant={item.type.toLowerCase()}>
                                    {item.type === 'ARTICLE' ? 'Article' : 'PDF'}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    Updated {formatDate(item.updatedAt)}
                                </span>
                            </div>

                            {item.description && (
                                <p className="text-white/70 mb-6 text-lg">
                                    {item.description}
                                </p>
                            )}
                        </>
                    )}

                    {/* Actions */}
                    {!editMode && (
                        <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                            {item.permissions?.canDownload && (
                                <button className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-white/90 transition-colors text-sm">
                                    ⬇️ Download
                                </button>
                            )}
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-white/10 transition-colors text-sm">
                                🔗 Copy Link
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="bg-black/20 backdrop-blur-md rounded-lg border border-white/15 p-8 mb-8">
                    {editMode && (
                        <div className="mb-4 p-3 bg-white/10 border border-white/15 rounded text-sm text-white/80">
                            Edit mode active - Click save to persist changes
                        </div>
                    )}

                    {item.type === 'ARTICLE' ? (
                        <div
                            className="prose prose-sm max-w-none text-white"
                            dangerouslySetInnerHTML={{
                                __html: item.content?.contentHtml || item.content
                            }}
                        />
                    ) : item.type === 'PDF' ? (
                        <PdfViewerWrapper
                            pdfUrl={item.content?.pdfViewUrl}
                            title={item.title}
                        />
                    ) : null}
                </div>

                {/* Item Info (Admin Only) */}
                <div className="bg-black/20 backdrop-blur-md border border-white/15 rounded-lg p-6">
                    <h3 className="font-bold text-red-900 mb-3">Admin Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-red-800">
                        <div>
                            <p className="font-semibold">ID:</p>
                            <p>{item.id}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status:</p>
                            <p className="capitalize">{item.status}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Created:</p>
                            <p>{formatDate(item.createdAt)}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Policy:</p>
                            <p>{item.policyId || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
};

export default AdminPreviewPage;
