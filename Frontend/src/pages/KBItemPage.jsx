import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getKBItem, getRelatedItems, downloadPDF } from '../services/kbService';
import Badge from '../components/common/Badge';
import PdfViewerWrapper from '../components/kb/PdfViewerWrapper';
import FeedbackComponent from '../components/kb/FeedbackComponent';
import KbItemCard from '../components/kb/KbItemCard';
import KbLayout from '../components/kb/KbLayout';
import { useToast, ToastContainer } from '../components/common/Toast';

export const KBItemPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemData, relatedData] = await Promise.all([
          getKBItem(itemId),
          getRelatedItems(itemId),
        ]);
        setItem(itemData);
        setRelatedItems(relatedData.items || relatedData || []);
      } catch (err) {
        setError('Failed to load article');
        showToast('Error loading content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(downloadPDF(itemId), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (!res.ok) throw new Error('download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title || `document-${itemId}`}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Download started', 'success');
    } catch (e) {
      showToast('Download failed', 'error');
    }
  };

  if (loading) {
    return (
      <KbLayout variant="hub">
        <div className="space-y-6">
          <div className="h-8 bg-white/40 rounded animate-pulse w-1/2"></div>
          <div className="h-96 bg-white/40 rounded animate-pulse"></div>
        </div>
      </KbLayout>
    );
  }

  if (error || !item) {
    return (
      <KbLayout variant="hub">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Content not available</h2>
          <p className="text-gray-600 mb-6">{error || 'This item may not exist or you may not have access.'}</p>
          <Link className="text-sfs-blue font-semibold" to="/kb">Back to Knowledge Hub</Link>
        </div>
      </KbLayout>
    );
  }

  return (
    <KbLayout variant="hub">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{item.title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.category?.name && <Badge variant="secondary">{item.category.name}</Badge>}
                <Badge variant="primary">{item.type}</Badge>
                {item.updatedAt && <Badge variant="info">{new Date(item.updatedAt).toLocaleDateString()}</Badge>}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleCopyLink} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold">
                Copy link
              </button>
              {item.type === 'PDF' && (
                <button onClick={handleDownload} className="px-4 py-2 rounded-xl bg-sfs-blue hover:bg-sfs-blue text-white text-sm font-semibold">
                  Download
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            {item.type === 'ARTICLE' ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content?.contentHtml || item.content || '' }}
              />
            ) : item.type === 'PDF' ? (
              <PdfViewerWrapper pdfUrl={item.pdfUrl || downloadPDF(itemId)} title={item.title} />
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
          <FeedbackComponent itemId={itemId} />
        </div>

        {Array.isArray(relatedItems) && relatedItems.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedItems.slice(0, 4).map((it) => (
                <KbItemCard key={it.id} item={it} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </KbLayout>
  );
};

export default KBItemPage;
