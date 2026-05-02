import React, { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../services/categoryService';
import AdminShell from '../components/KbAdmin/AdminShell';
import { useToast, ToastContainer } from '../components/common/Toast';

export default function AdminCategoriesPage() {
  const { toasts, showToast, removeToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        showToast('Category updated', 'success');
      } else {
        await createCategory(formData);
        showToast('Category created', 'success');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      await fetchCategories();
    } catch {
      showToast('Failed to save category', 'error');
    }
  };

  const handleEdit = (category) => {
    setShowForm(true);
    setEditingId(category.id);
    setFormData({ name: category.name || '', description: category.description || '' });
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category? This cannot be undone.')) return;
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      showToast('Category deleted', 'success');
    } catch {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminShell title="Admin Category Manager">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-slate-600">Manage Knowledgebase categories.</p>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: '', description: '' });
            }}
            className="inline-flex items-center justify-center rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
          >
            + New Category
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-extrabold text-sfs-ink">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Category Name *
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                placeholder="e.g., Technical Support"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Description
              </span>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
                placeholder="Short description for the category…"
              />
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
          {loading ? 'Loading…' : `${categories.length} category(s)`}
        </div>

        <div className="divide-y divide-slate-200">
          {!loading &&
            categories.map((c) => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{c.description || '—'}</div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(c)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-sfs-red hover:bg-sfs-red/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {!loading && categories.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-600">No categories yet.</div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminShell>
  );
}
