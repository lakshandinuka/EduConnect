import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [suggestedSlots, setSuggestedSlots] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [reason, setReason] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');

  // Fetch all departments and appointment types
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const deptRes = await api.get('/departments');
        if (deptRes.data) {
          setDepartments(deptRes.data);
        }

        const typesRes = await api.get('/types');
        if (typesRes.data) {
          setAppointmentTypes(typesRes.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRequiredData();
  }, []);

  // Fetch available slots when a specific type is selected
  useEffect(() => {
    if (!selectedType) {
      setSuggestedSlots([]);
      setSelectedSlot(null);
      return;
    }
    const fetchSlots = async () => {
      try {
        const res = await api.get(`/slots/available/${selectedType}`);
        if (res.data) {
          setSuggestedSlots(res.data);
        }
      } catch (e) { console.error(e); }
    };
    fetchSlots();
    setSelectedSlot(null);
  }, [selectedType, urgency]); // re-fetch if urgency changes conceptually

  const handleBooking = async () => {
    if (!reason.trim()) {
      setError("Please supply a specific reason for your visit.");
      return;
    }
    setError("");

    try {
      const payload = {
        studentId: user?.id || 1,
        slotId: selectedSlot,
        departmentId: parseInt(selectedDept),
        appointmentTypeId: parseInt(selectedType),
        reason: reason,
        urgencyLevel: urgency.toUpperCase()
      };

      await api.post('/bookings', payload);
      alert('Booking successfully created!');
      navigate('/student/my-bookings');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error connecting to the server.';
      alert(`Failed to create booking: ${msg}`);
    }
  };

  const selectedTypeObj = appointmentTypes.find(t => t.id.toString() === selectedType);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book Appointment</h1>
          <p className="text-gray-500 mt-1">Schedule a session with SFS staff quickly and smartly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">1. Appointment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select 
                  className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 bg-gray-50 hover:bg-white transition-colors p-3 outline-none appearance-none cursor-pointer"
                  value={selectedDept}
                  onChange={(e) => { setSelectedDept(e.target.value); setSelectedType(''); }}
                >
                  <option value="">Select a department...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Type</label>
                <select 
                  className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 bg-gray-50 hover:bg-white transition-colors p-3 outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  disabled={!selectedDept}
                >
                  <option value="">Select a type...</option>
                  {appointmentTypes.filter(t => t.department?.id.toString() === selectedDept && t.status !== 'Inactive').map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.duration}m)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
              <textarea 
                className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 bg-gray-50 hover:bg-white transition-colors p-4 outline-none resize-none"
                rows="3"
                placeholder="Briefly describe what you need help with..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Urgency Level</label>
              <div className="flex gap-4">
                {['Low', 'Normal', 'High'].map(level => (
                  <button
                    key={level}
                    onClick={() => setUrgency(level)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      urgency === level 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border-blue-600 scale-[1.02]' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100 flex flex-col h-full sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-indigo-900">Available Slots</h2>
            </div>
            
            <p className="text-sm text-indigo-700 mb-6 leading-relaxed">
              Based on your selected type ({selectedTypeObj ? selectedTypeObj.duration + 'm' : '—'}) and <span className="font-semibold text-indigo-900 border-b border-indigo-400">{urgency.toLowerCase()}</span> urgency, our AI recommends these optimal times:
            </p>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2">
              {suggestedSlots.map(slot => (
                <div 
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-white relative overflow-hidden group ${
                    selectedSlot === slot.id 
                    ? 'border-indigo-500 shadow-md transform scale-[1.02] bg-indigo-50/30' 
                    : 'border-transparent shadow-sm hover:shadow hover:border-indigo-200'
                  }`}
                >
                  {selectedSlot === slot.id && (
                    <div className="absolute top-3 right-3 text-indigo-600 animate-in zoom-in duration-200">
                      <CheckCircle2 size={24} className="fill-indigo-100" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2 text-gray-800">
                    <CalendarIcon size={18} className="text-indigo-500 group-hover:text-indigo-600" />
                    <span className="font-bold">{slot.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <Clock size={16} className="text-indigo-400" />
                    <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 w-fit px-2.5 py-1 rounded-md border border-emerald-200">
                    AI Match (High)
                  </div>
                </div>
              ))}
              
              {selectedType && suggestedSlots.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 text-center">
                  <p className="text-indigo-600 text-sm font-medium">No available slots found for this appointment type.</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleBooking}
              disabled={!selectedSlot || !selectedType}
              className={`w-full mt-8 py-3.5 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shrink-0 ${
                (selectedSlot && selectedType) 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transform hover:-translate-y-1' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Booking <ChevronRight size={20} />
            </button>
            {error && <p className="text-center text-sm text-red-500 mt-3 font-medium bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}
            {(!selectedSlot || !selectedType) && (
              <p className="text-center text-xs text-indigo-400 mt-3 font-medium">Please select an appointment type and a time slot.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookAppointment;
