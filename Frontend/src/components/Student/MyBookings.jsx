import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MoreVertical, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const getStatusBadge = (status) => {
  switch(status) {
    case 'APPROVED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">APPROVED</span>;
    case 'PENDING': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">PENDING</span>;
    case 'COMPLETED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">COMPLETED</span>;
    case 'REJECTED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">REJECTED</span>;
    case 'CANCELLED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">CANCELLED</span>;
    default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
  }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      if (!user?.id) return;
      const response = await api.get(`/bookings/student/${user.id}`);
      if (response.data) {
        const data = response.data;
        const mapped = data.map(b => ({
          rawId: b.id,
          id: 'BKG-' + b.id,
          department: b.timeSlot?.appointmentType?.department?.name || 'Department',
          type: b.timeSlot?.appointmentType?.title || 'Appointment',
          date: b.timeSlot?.date || '-',
          time: `${b.timeSlot?.startTime} - ${b.timeSlot?.endTime}`,
          status: b.status,
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
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
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.patch(`/bookings/${id}/status?status=CANCELLED`);
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleClick = (id) => {
    // For now, Reschedule simply navigates to the book page 
    // where they can book a new slot. The user should ideally cancel the old one.
    alert("To reschedule, please cancel this booking and book a new time slot.");
    navigate('/student/book');
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-gray-500 mt-1">View and manage your past and upcoming appointments.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 border-dashed">No bookings found. Head to the Book Appointment page to schedule one.</p>
      ) : (
      <div className="grid grid-cols-1 gap-5">
        {bookings.map(booking => (
          <div key={booking.rawId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md hover:border-blue-100 group">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Calendar size={26} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-lg font-bold text-gray-900">{booking.type}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <p className="text-gray-500 font-medium text-sm mb-3">{booking.department}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"><Calendar size={14} className="text-gray-400"/> {booking.date}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"><Clock size={14} className="text-gray-400"/> {booking.time}</span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">{booking.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex shrink-0 gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-8 mt-2 md:mt-0 items-center">
              {['PENDING', 'APPROVED'].includes(booking.status) && (
                <>
                  <button onClick={() => handleRescheduleClick(booking.rawId)} className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors shadow-sm">
                    Reschedule
                  </button>
                  <button onClick={() => handleCancelClick(booking.rawId)} className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors shadow-sm">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
export default MyBookings;
