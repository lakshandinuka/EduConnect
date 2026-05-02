import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Check, X, Filter } from 'lucide-react';
import api from '../../services/api';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data) {
        setBookings(response.data);
      }
    } catch (err) { console.error("Failed to fetch bookings", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status?status=${status}`);
      fetchBookings();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="sfs-page-title">Appointment Requests</h1>
          <p className="sfs-muted mt-1">Review and manage student booking requests.</p>
        </div>
        <button className="sfs-btn-secondary gap-2 shrink-0">
          <Filter size={18} /> Filter Status
        </button>
      </div>

      {loading ? (
        <div className="sfs-panel-pad text-slate-600">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="sfs-panel-pad text-center text-slate-600">No booking requests found.</div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {bookings.map(booking => (
          <div key={booking.id} className="sfs-panel-pad flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sfs-blue/10 text-sfs-blue flex items-center justify-center font-bold text-lg border border-sfs-blue/20 shrink-0">
                {booking.student?.name ? booking.student.name.charAt(0) : 'S'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-sfs-ink">{booking.student?.name || 'Student'}</h3>
                <p className="text-sfs-blue font-bold text-sm mb-3">{booking.timeSlot?.appointmentType?.title || 'General'}</p>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2 md:line-clamp-none max-w-xl">
                  <span className="font-semibold text-slate-700">Reason:</span> {booking.reason || 'No reason provided.'}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Calendar size={14}/> {booking.timeSlot?.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex shrink-0 gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
              {booking.status === 'PENDING' ? (
                <>
                  <button onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2.5 rounded-xl font-bold transition-colors">
                    <Check size={18} /> Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2.5 rounded-xl font-bold transition-colors">
                    <X size={18} /> Reject
                  </button>
                </>
              ) : (
                <span className={`px-4 py-2.5 rounded-xl font-bold ${booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {booking.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
export default ViewBookings;
