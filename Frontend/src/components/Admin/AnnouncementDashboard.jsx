import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnnouncementList from '../Student/AnnouncementList';
import AnnouncementForm from './AnnouncementForm';
import AdminMessages from './AdminMessages';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminName = user?.fullName || 'Admin';

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Failed to load announcements');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    localStorage.setItem("adminNotif", "false");
    window.dispatchEvent(new Event("notifUpdate"));
    fetchAnnouncements();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleEdit = (ann) => {
    setEditData(ann);
    setShowForm(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: '#10b981',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            Logged in as: {adminName}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => { setEditData(null); setShowForm(true); }}
            style={buttonStyle}
            onMouseEnter={hoverButtonEnter}
            onMouseLeave={hoverButtonLeave}
          >
            + New Announcement
          </button>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ ...buttonStyle, background: '#dc2626' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <div style={{ marginTop: '30px' }}>
        <AnnouncementList
          announcements={announcements}
          isAdmin={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* FORM */}
      {showForm && (
        <AnnouncementForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={fetchAnnouncements}
          editData={editData}
        />
      )}

      {/* MESSAGES */}
      <div style={{ marginTop: '40px' }}>
        <AdminMessages />
      </div>
    </div>
  );
}

// BUTTON STYLES
const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  background: '#2563eb',
  color: 'white',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s'
};

const hoverButtonEnter = e => {
  e.currentTarget.style.background = '#1d4ed8';
  e.currentTarget.style.transform = 'translateY(-1px)';
};
const hoverButtonLeave = e => {
  e.currentTarget.style.background = '#2563eb';
  e.currentTarget.style.transform = 'translateY(0)';
};