import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusClass = {
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const getStatusBadge = (status) => (
  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
    {status}
  </span>
);

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      if (!user?.id) return;
      const response = await api.get(`/bookings/student/${user.id}`);
      const data = response.data || [];
      setBookings(data.map((booking) => ({
        rawId: booking.id,
        id: `BKG-${booking.id}`,
        department: booking.timeSlot?.appointmentType?.department?.name || 'Department',
        type: booking.timeSlot?.appointmentType?.title || 'Appointment',
        date: booking.timeSlot?.date || '-',
        time: `${booking.timeSlot?.startTime || '-'} - ${booking.timeSlot?.endTime || '-'}`,
        status: booking.status,
      })));
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelClick = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/status?status=CANCELLED`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleClick = () => {
    alert('To reschedule, please cancel this booking and book a new time slot.');
    navigate('/book-appointment');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-8">
        <h1 className="sfs-page-title">My Bookings</h1>
        <p className="sfs-muted mt-1">View and manage your past and upcoming appointments.</p>
      </div>

      {loading ? (
        <div className="sfs-panel-pad text-slate-600">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="sfs-panel-pad border-dashed text-center text-slate-600">
          No bookings found. Head to the Book Appointment page to schedule one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {bookings.map((booking) => (
            <article key={booking.rawId} className="sfs-panel-pad transition hover:border-sfs-blue/40 hover:shadow-card">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-sfs-blue/20 bg-sfs-blue/10 text-sfs-blue">
                    <Calendar size={26} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-sfs-ink">{booking.type}</h2>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="mb-3 text-sm font-medium text-slate-500">{booking.department}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                        <Calendar size={14} className="text-slate-400" /> {booking.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                        <Clock size={14} className="text-slate-400" /> {booking.time}
                      </span>
                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-500">
                        {booking.id}
                      </span>
                    </div>
                  </div>
                </div>

                {['PENDING', 'APPROVED'].includes(booking.status) && (
                  <div className="flex shrink-0 flex-wrap gap-3 border-t border-slate-100 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <button type="button" onClick={handleRescheduleClick} className="sfs-btn-secondary">
                      Reschedule
                    </button>
                    <button type="button" onClick={() => handleCancelClick(booking.rawId)} className="sfs-btn-danger">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
