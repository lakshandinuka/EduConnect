import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AnnouncementList from '../Student/AnnouncementList';
import AdminMessages from './AdminMessages';
import AnnouncementForm from './AnnouncementForm';

export default function AnnouncementDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminName = user?.fullName || 'Admin';

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Failed to load announcements');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    localStorage.setItem('adminNotif', 'false');
    window.dispatchEvent(new Event('notifUpdate'));
    fetchAnnouncements();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (announcement) => {
    setEditData(announcement);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="sfs-page-title">Announcement Dashboard</h1>
          <p className="sfs-muted mt-1">Logged in as {adminName}</p>
        </div>
        <button
          type="button"
          className="sfs-btn-primary"
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
        >
          New Announcement
        </button>
      </div>

      <section>
        <AnnouncementList announcements={announcements} isAdmin onDelete={handleDelete} onEdit={handleEdit} />
      </section>

      {showForm && (
        <AnnouncementForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={fetchAnnouncements}
          editData={editData}
        />
      )}

      <AdminMessages />
    </div>
  );
}
