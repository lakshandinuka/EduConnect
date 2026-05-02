import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AnnouncementForm({ isOpen, onClose, onSuccess, editData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    semester: '',
    isImportant: false,
    expiry: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        description: editData.description || '',
        semester: editData.semester || '',
        isImportant: editData.isImportant || false,
        expiry: editData.expiry ? editData.expiry.slice(0, 16) : ''
      });
      return;
    }

    setForm({
      title: '',
      description: '',
      semester: '',
      isImportant: false,
      expiry: ''
    });
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.semester || !form.expiry) {
      alert('Please fill all fields before submitting.');
      return;
    }

    try {
      if (editData && editData.id) {
        await api.put(`/admin/announcements/${editData.id}`, form);
      } else {
        await api.post('/admin/announcements', form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(editData ? 'Failed to update announcement' : 'Failed to create announcement');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sfs-ink/40 px-4">
      <section className="sfs-panel-pad w-full max-w-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-sfs-ink">
            {editData ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <button type="button" onClick={onClose} className="sfs-btn-secondary px-3 py-1.5">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <label>
            <span className="sfs-label">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="sfs-input"
              required
            />
          </label>

          <label>
            <span className="sfs-label">Description / Content</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="5"
              className="sfs-textarea"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="sfs-label">Semester</span>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="sfs-input"
                required
              >
                <option value="">Select Semester</option>
                <option value="Y1S1">Y1S1</option>
                <option value="Y1S2">Y1S2</option>
                <option value="Y2S1">Y2S1</option>
                <option value="Y2S2">Y2S2</option>
                <option value="Y3S1">Y3S1</option>
                <option value="Y3S2">Y3S2</option>
                <option value="Y4S1">Y4S1</option>
                <option value="Y4S2">Y4S2</option>
                <option value="ALL">ALL</option>
              </select>
            </label>

            <label>
              <span className="sfs-label">Expiry Date & Time</span>
              <input
                type="datetime-local"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                className="sfs-input"
                required
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-sfs-blue focus:ring-sfs-blue"
            />
            Mark as Important
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="sfs-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="sfs-btn-primary">
              {editData ? 'Update Announcement' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
