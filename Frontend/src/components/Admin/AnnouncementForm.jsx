import { useState, useEffect } from 'react';
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
    } else {
      setForm({
        title: '',
        description: '',
        semester: '',
        isImportant: false,
        expiry: ''
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.semester ||
      !form.expiry
    ) {
      alert("⚠️ Please fill all fields before submitting!");
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
    <div className="modal" style={modalStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: '20px', color: '#065f46' }}>
          {editData ? 'Edit Announcement' : 'Create New Announcement'}
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />

          <textarea
            placeholder="Description / Content"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows="5"
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <select
            value={form.semester}
            onChange={e => setForm({ ...form, semester: e.target.value })}
            required
            style={{ ...inputStyle, marginTop: '10px' }}
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

          <label style={{ display: 'block', margin: '15px 0' }}>
            Expiry Date & Time:
            <input
              type="datetime-local"
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
              style={{ ...inputStyle, marginTop: '5px' }}
              required
            />
          </label>

          <label style={{ display: 'block', margin: '15px 0' }}>
            <input
              type="checkbox"
              checked={form.isImportant}
              onChange={e => setForm({ ...form, isImportant: e.target.checked })}
            />
            <span style={{ marginLeft: '8px' }}>Mark as Important</span>
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...submitButtonStyle, background: '#6b7280' }}
            >
              Cancel
            </button>

            <button type="submit" style={submitButtonStyle}>
              {editData ? 'Update Announcement' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ================= STYLES =================
const modalStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0,0,0,0.25)',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
};

const modalContentStyle = {
  width: '500px',
  padding: '25px',
  borderRadius: '12px',
  background: '#ffffff',
  boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '2px solid #d1d5db',
  marginBottom: '10px',
  outline: 'none',
  transition: 'border 0.2s'
};

const submitButtonStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  background: '#10b981',
  color: 'white',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s',
  fontWeight: '600'
};