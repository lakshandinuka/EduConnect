import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminShell from '../components/KbAdmin/AdminShell';
import { createKBItem, getKBItem, updateKBItem, uploadPDF } from '../services/kbService';
import { getCategories } from '../services/categoryService';
import { useToast, ToastContainer } from '../components/common/Toast';
import RichTextEditor from '../components/kb/RichTextEditor';

const empty = {
  title: '',
  description: '',
  type: 'ARTICLE', // ARTICLE | PDF
  status: 'DRAFT', // DRAFT | PUBLISHED
  categoryId: '',
  content: '', // for ARTICLE
  pdfUrl: '', // for PDF
};

export default function AdminCreateEditPage() {
  const { itemId } = useParams();
  const isEditing = Boolean(itemId);
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);

  const title = isEditing ? 'Edit KB Item' : 'Create KB Item';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cats, item] = await Promise.all([
          getCategories(),
          isEditing ? getKBItem(itemId) : Promise.resolve(null),
        ]);

        setCategories(Array.isArray(cats) ? cats : []);
        if (item) {
          setForm({
            title: item.title || '',
            description: item.description || '',
            type: item.type || 'ARTICLE',
            status: item.status || 'DRAFT',
            categoryId:
              item.category?.id ||
              item.categoryId ||
              (Array.isArray(item.categories) ? item.categories?.[0]?.id : '') ||
              '',
            content: item.content || item.body || '',
            pdfUrl: item.pdfUrl || item.fileUrl || '',
          });
        } else {
          setForm((prev) => ({ ...prev, categoryId: (Array.isArray(cats) && cats[0]?.id) || '' }));
        }
      } catch {
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId]);

  const categoryOptions = useMemo(
    () => (Array.isArray(categories) ? categories : []).map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!form.categoryId) {
      showToast('Category is required', 'error');
      return;
    }
    if (form.type === 'PDF' && !form.pdfUrl.trim()) {
      showToast('Upload a PDF or enter a PDF URL', 'error');
      return;
    }
    if (uploadingPdf) {
      showToast('Please wait for the PDF upload to finish', 'error');
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      categoryId: form.categoryId,
      content: form.type === 'ARTICLE' ? form.content : '',
      pdfUrl: form.type === 'PDF' ? form.pdfUrl : '',
    };

    try {
      setSaving(true);
      if (isEditing) {
        await updateKBItem(itemId, payload);
        showToast('Item updated', 'success');
      } else {
        const created = await createKBItem(payload);
        showToast('Item created', 'success');
        if (created?.id) navigate(`/admin/kb/edit/${created.id}`);
      }
    } catch {
      showToast('Failed to save item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const isPdf = file.type === 'application/pdf' && /\.pdf$/i.test(file.name);
    if (!isPdf) {
      showToast('Only PDF files are supported', 'error');
      return;
    }

    try {
      setUploadingPdf(true);
      const uploaded = await uploadPDF(file);
      setForm((prev) => ({ ...prev, pdfUrl: uploaded.url || '' }));
      showToast('PDF uploaded', 'success');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to upload PDF', 'error');
    } finally {
      setUploadingPdf(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title={title}>
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sfs-blue/40 border-t-sfs-blue" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={title}>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <button
          type="button"
          onClick={() => navigate('/admin/kb')}
          className="text-sm font-semibold text-slate-700 hover:text-sfs-blue"
        >
          ← Back to Knowledgebase List
        </button>

        <form onSubmit={onSubmit} className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Title *</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category *</span>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              >
                <option value="">Select category</option>
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              >
                <option value="ARTICLE">Article</option>
                <option value="PDF">PDF</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
          </div>

          {form.type === 'ARTICLE' ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Content</span>
              <div className="mt-1">
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm({ ...form, content })}
                  placeholder="Write the article content here..."
                  minHeight="280px"
                />
              </div>
            </label>
          ) : (
            <div className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">PDF *</span>
              <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {uploadingPdf ? 'Uploading PDF...' : 'Upload a PDF file'}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={uploadingPdf}
                    onChange={handlePdfUpload}
                    className="w-full max-w-sm text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-sfs-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-95 disabled:opacity-60"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">PDF URL</span>
                <input
                  value={form.pdfUrl}
                  onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                  placeholder="http://localhost:8080/api/kb/files/document.pdf or https://..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                />
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Uploading fills this URL automatically. You can also paste a trusted public PDF URL.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || uploadingPdf}
              className="rounded-lg bg-sfs-blue px-5 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/kb')}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
            >
              Close
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminShell>
  );
}
