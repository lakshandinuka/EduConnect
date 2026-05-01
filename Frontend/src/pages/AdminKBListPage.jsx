import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  archiveKBItem,
  deleteKBItem,
  getAdminKBList,
  unarchiveKBItem,
} from '../services/kbService';
import { getCategories } from '../services/categoryService';
import Badge from '../components/common/Badge';
import AdminShell from '../components/KbAdmin/AdminShell';
import { useToast, ToastContainer } from '../components/common/Toast';

export default function AdminKBListPage() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ status: '', category: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          getAdminKBList(filters),
          getCategories(),
        ]);

        setItems(
          Array.isArray(itemsData?.items)
            ? itemsData.items
            : Array.isArray(itemsData)
              ? itemsData
              : []
        );
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch {
        showToast('Failed to load Knowledgebase items', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return (Array.isArray(items) ? items : []).filter((item) =>
      (item.title || '').toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleArchive = async (itemId) => {
    try {
      await archiveKBItem(itemId);
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: 'ARCHIVED' } : it)));
      showToast('Item archived', 'success');
    } catch {
      showToast('Failed to archive item', 'error');
    }
  };

  const handleUnarchive = async (itemId) => {
    try {
      await unarchiveKBItem(itemId);
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: 'PUBLISHED' } : it)));
      showToast('Item restored', 'success');
    } catch {
      showToast('Failed to restore item', 'error');
    }
  };

  const handleDelete = async (itemId) => {
    const ok = window.confirm('Delete this item? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteKBItem(itemId);
      setItems((prev) => prev.filter((it) => it.id !== itemId));
      showToast('Item deleted', 'success');
    } catch {
      showToast('Failed to delete item', 'error');
    }
  };

  return (
    <AdminShell title="Admin Knowledge Hub">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-600">
              Manage and publish knowledge base articles and PDFs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/kb/new')}
            className="inline-flex items-center justify-center rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
          >
            + New Item
          </button>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Search</span>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Type</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
            >
              <option value="">All Types</option>
              <option value="ARTICLE">Article</option>
              <option value="PDF">PDF</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={6}>
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.title || 'Untitled'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {typeof item.category === 'string'
                        ? item.category
                        : item.category?.name || 'General'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.type || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status?.toLowerCase()} >
                        {item.status ? item.status.charAt(0) + item.status.slice(1).toLowerCase() : '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(item.updatedAt || item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/kb/edit/${item.id}`)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                        >
                          Edit
                        </button>
                        {item.status === 'ARCHIVED' ? (
                          <button
                            type="button"
                            onClick={() => handleUnarchive(item.id)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleArchive(item.id)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                          >
                            Archive
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-sfs-red hover:bg-sfs-red/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminShell>
  );
}
