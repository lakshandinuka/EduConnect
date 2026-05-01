import React, { useEffect, useState } from 'react';
import AdminShell from '../components/KbAdmin/AdminShell';
import {
  createAccessPolicy,
  deleteAccessPolicy,
  getAccessPolicies,
  updateAccessPolicy,
} from '../services/policyService';
import { useToast, ToastContainer } from '../components/common/Toast';

const empty = { name: '', description: '', rules: '', icon: '' };

export default function AdminPoliciesPage() {
  const { toasts, showToast, removeToast } = useToast();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAccessPolicies();
      setPolicies(Array.isArray(data) ? data : data?.items || []);
    } catch {
      showToast('Failed to load policies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(empty);
    setShowForm(true);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      rules: p.rules || '',
      icon: p.icon || '',
    });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(empty);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Policy name is required', 'error');
      return;
    }

    try {
      if (editingId) {
        await updateAccessPolicy(editingId, form);
        showToast('Policy updated', 'success');
      } else {
        await createAccessPolicy(form);
        showToast('Policy created', 'success');
      }
      cancel();
      await load();
    } catch {
      showToast('Failed to save policy', 'error');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try {
      await deleteAccessPolicy(id);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      showToast('Policy deleted', 'success');
    } catch {
      showToast('Failed to delete policy', 'error');
    }
  };

  return (
    <AdminShell title="Policies">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-slate-600">
            Define access policies used to control who can view knowledge items.
          </p>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
          >
            + New Policy
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-extrabold text-sfs-ink">
            {editingId ? 'Edit Policy' : 'New Policy'}
          </h2>

          <form onSubmit={submit} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Name *
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Icon</span>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g., lock / globe / building"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Description
              </span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Rules
              </span>
              <textarea
                rows={3}
                value={form.rules}
                onChange={(e) => setForm({ ...form, rules: e.target.value })}
                placeholder="Describe who can access this policy (e.g., STAFF_ONLY / DEPT:IT)…"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sfs-blue"
              />
            </label>

            <div className="flex gap-2 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancel}
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
          {loading ? 'Loading…' : `${policies.length} policy(s)`}
        </div>

        <div className="divide-y divide-slate-200">
          {!loading &&
            policies.map((p) => (
              <div key={p.id} className="px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{p.description || '—'}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      Rules: {p.rules || '—'} {p.icon ? `• Icon: ${p.icon}` : ''}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-sfs-red hover:bg-sfs-red/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {!loading && policies.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-600">No policies yet.</div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminShell>
  );
}
