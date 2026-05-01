import React, { useEffect, useMemo, useState } from 'react';
import AdminShell from '../components/KbAdmin/AdminShell';
import { createFaq, deleteFaq, getFaqsAdmin, updateFaq } from '../services/faqService';
import { useToast, ToastContainer } from '../components/common/Toast';

const emptyForm = { question: '', answer: '', category: 'General', status: 'PUBLISHED' };

export default function AdminFAQPage() {
  const { toasts, showToast, removeToast } = useToast();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [q, setQ] = useState('');

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getFaqsAdmin();
      const items = Array.isArray(data) ? data : data?.items || [];
      setFaqs(items);
    } catch {
      showToast('Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    faqs.forEach((f) => set.add(f.category || 'General'));
    return Array.from(set).sort();
  }, [faqs]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesText =
        !query ||
        (f.question || '').toLowerCase().includes(query) ||
        (f.answer || '').toLowerCase().includes(query);
      const matchesStatus = !filters.status || (f.status || 'PUBLISHED') === filters.status;
      const matchesCategory = !filters.category || (f.category || 'General') === filters.category;
      return matchesText && matchesStatus && matchesCategory;
    });
  }, [faqs, q, filters]);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (faq) => {
    setEditing(faq);
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      status: faq.status || 'PUBLISHED',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    try {
      if (editing?.id) {
        await updateFaq(editing.id, form);
        showToast('FAQ updated', 'success');
      } else {
        await createFaq(form);
        showToast('FAQ created', 'success');
      }
      await load();
      startCreate();
    } catch {
      showToast('Failed to save FAQ', 'error');
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this FAQ?');
    if (!ok) return;
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast('FAQ deleted', 'success');
    } catch {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  return (
    <AdminShell title="Admin FAQ">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-sfs-ink">
              {editing ? 'Edit FAQ' : 'Create FAQ'}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={startCreate}
                className="text-sm font-semibold text-slate-700 hover:text-sfs-blue"
              >
                New
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Question</span>
              <input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Answer</span>
              <textarea
                rows={6}
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
            >
              {editing ? 'Save Changes' : 'Create FAQ'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block md:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Search</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</span>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                >
                  <option value="">All</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
              {loading ? 'Loading…' : `${filtered.length} FAQ(s)`}
            </div>

            <div className="divide-y divide-slate-200">
              {!loading &&
                filtered.map((faq) => (
                  <div key={faq.id} className="px-5 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{faq.question}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {(faq.category || 'General')} • {(faq.status || 'PUBLISHED')}
                        </div>
                        <div className="mt-2 line-clamp-2 text-sm text-slate-700">{faq.answer}</div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(faq)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(faq.id)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-sfs-red hover:bg-sfs-red/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {!loading && filtered.length === 0 && (
                <div className="px-5 py-8 text-center text-slate-600">No FAQs found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminShell>
  );
}
