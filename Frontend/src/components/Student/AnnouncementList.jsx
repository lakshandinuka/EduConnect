import { useState, useEffect } from 'react';

export default function AnnouncementList({ announcements, isAdmin, onDelete, onEdit }) {
  const [timeLefts, setTimeLefts] = useState({});

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};
      announcements.forEach(ann => {
        if (ann.expiry) {
          const diff = new Date(ann.expiry) - new Date();
          newTimes[ann.id] = diff > 0 ? diff : 0;
        }
      });
      setTimeLefts(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [announcements]);

  const formatCountdown = (ms) => {
    if (ms <= 0) return 'Expired';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // 🔥 UPDATED CARD STYLE (FULL RED BORDER)
  const cardStyle = (isImportant) => ({
    border: isImportant ? '4px solid #dc2626' : '4px solid #e5e7eb',
    backgroundColor: '#ffffff',
    padding: '18px',
    marginBottom: '18px',
    borderRadius: '12px',
    position: 'relative',
    boxShadow: isImportant
      ? '0 6px 20px rgba(220,38,38,0.18)'
      : '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.25s ease'
  });

  const hoverEffect = e => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
  };

  const hoverOut = e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
  };

  return (
    <div>
      {announcements.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No announcements yet.
        </p>
      ) : (
        announcements.map(ann => {
          const isExpired = timeLefts[ann.id] === 0;

          return (
            <div
              key={ann.id}
              style={cardStyle(ann.isImportant)}
              onMouseEnter={hoverEffect}
              onMouseLeave={hoverOut}
            >

              {/* 🔴 IMPORTANT BADGE */}
              {ann.isImportant && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#dc2626',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  IMPORTANT
                </span>
              )}

              <h3 style={{ marginBottom: '6px' }}>{ann.title}</h3>
              <p style={{ marginBottom: '8px', color: '#374151' }}>{ann.description}</p>

              {/* Semester */}
              <p style={{ fontWeight: '600', color: '#111827' }}>
                {ann.semester}
              </p>

              {/* ⏳ EXPIRY */}
              {ann.expiry && (
                <div style={{ marginTop: '10px' }}>
                  {isExpired ? (
                    <span style={{
                      background: '#dc2626',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      EXPIRED
                    </span>
                  ) : (
                    <small style={{
                      color: '#2563eb',
                      fontWeight: '600'
                    }}>
                      Expires in: {formatCountdown(timeLefts[ann.id])}
                    </small>
                  )}
                </div>
              )}

              {/* ADMIN BUTTONS */}
              {isAdmin && (
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => onEdit(ann)}
                    style={adminButtonStyle('#2563eb', '#1d4ed8')}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(ann.id)}
                    style={adminButtonStyle('#dc2626', '#b91c1c')}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

const adminButtonStyle = (bg, hoverBg) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  background: bg,
  color: 'white',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s',
  onMouseEnter: e => {
    e.currentTarget.style.background = hoverBg;
    e.currentTarget.style.transform = 'translateY(-1px)';
  },
  onMouseLeave: e => {
    e.currentTarget.style.background = bg;
    e.currentTarget.style.transform = 'translateY(0)';
  }
});