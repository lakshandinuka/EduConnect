import { useEffect, useState } from 'react';

export default function AnnouncementList({ announcements, isAdmin, onDelete, onEdit }) {
  const [timeLefts, setTimeLefts] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const nextTimes = {};
      announcements.forEach((announcement) => {
        if (announcement.expiry) {
          const diff = new Date(announcement.expiry) - new Date();
          nextTimes[announcement.id] = diff > 0 ? diff : 0;
        }
      });
      setTimeLefts(nextTimes);
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

  if (announcements.length === 0) {
    return (
      <div className="sfs-panel-pad border-dashed text-center text-slate-600">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => {
        const isExpired = timeLefts[announcement.id] === 0;
        const importantClass = announcement.isImportant
          ? 'border-red-200 bg-red-50/40'
          : 'border-slate-200 bg-white';

        return (
          <article
            key={announcement.id}
            className={`rounded-xl border p-5 shadow-sm transition hover:shadow-card ${importantClass}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-sfs-ink">{announcement.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{announcement.description}</p>
                {announcement.semester && (
                  <p className="mt-3 text-sm font-semibold text-slate-700">{announcement.semester}</p>
                )}
              </div>

              {announcement.isImportant && (
                <span className="shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  Important
                </span>
              )}
            </div>

            {announcement.expiry && (
              <div className="mt-4">
                {isExpired ? (
                  <span className="sfs-status bg-red-100 text-red-700">Expired</span>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wide text-sfs-blue">
                    Expires in: {formatCountdown(timeLefts[announcement.id])}
                  </span>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => onEdit(announcement)} className="sfs-btn-secondary">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(announcement.id)} className="sfs-btn-danger">
                  Delete
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
