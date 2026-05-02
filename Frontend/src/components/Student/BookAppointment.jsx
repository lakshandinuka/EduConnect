import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const urgencyOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Normal', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [suggestedSlots, setSuggestedSlots] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [reason, setReason] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');

  const selectedUrgencyLabel =
    urgencyOptions.find((item) => item.value === urgency)?.label || 'Normal';

  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const [deptRes, typesRes] = await Promise.all([
          api.get('/departments'),
          api.get('/types'),
        ]);

        setDepartments(deptRes.data || []);
        setAppointmentTypes(typesRes.data || []);
      } catch (e) {
        console.error('Failed to fetch appointment data:', e);
        setError('Failed to load appointment details.');
      }
    };

    fetchRequiredData();
  }, []);

  useEffect(() => {
    if (!selectedType) {
      setSuggestedSlots([]);
      setSelectedSlot(null);
      return;
    }

    const fetchSlots = async () => {
      try {
        const res = await api.get(`/slots/available/${selectedType}`);
        setSuggestedSlots(res.data || []);
      } catch (e) {
        console.error('Failed to fetch slots:', e);
        setSuggestedSlots([]);
      }
    };

    fetchSlots();
    setSelectedSlot(null);
  }, [selectedType, urgency]);

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    return 'Error connecting to the server.';
  };

  const handleBooking = async () => {
    if (!selectedDept) {
      setError('Please select a department.');
      return;
    }

    if (!selectedType) {
      setError('Please select an appointment type.');
      return;
    }

    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }

    if (!reason.trim()) {
      setError('Please supply a specific reason for your visit.');
      return;
    }

    setError('');

    try {
      const payload = {
        studentId: user?.id || 1,
        slotId: selectedSlot,
        departmentId: parseInt(selectedDept, 10),
        appointmentTypeId: parseInt(selectedType, 10),
        reason: reason.trim(),
        urgencyLevel: urgency,
      };

      await api.post('/bookings', payload);

      alert('Booking successfully created!');
      navigate('/student/my-bookings');
    } catch (err) {
      console.error('Booking error:', err);
      alert(`Failed to create booking: ${getErrorMessage(err)}`);
    }
  };

  const selectedTypeObj = appointmentTypes.find(
    (type) => type.id?.toString() === selectedType
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="mb-8">
        <h1 className="sfs-page-title">Book Appointment</h1>
        <p className="sfs-muted mt-1">
          Schedule a session with SFS staff quickly and smartly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="sfs-panel-pad">
            <h2 className="mb-6 border-b border-slate-200 pb-2 text-xl font-bold text-sfs-ink">
              1. Appointment Details
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <label>
                <span className="sfs-label">Department</span>
                <select
                  className="sfs-input cursor-pointer appearance-none bg-slate-50 p-3 hover:bg-white"
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedType('');
                    setSelectedSlot(null);
                  }}
                >
                  <option value="">Select a department...</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sfs-label">Appointment Type</span>
                <select
                  className="sfs-input cursor-pointer appearance-none bg-slate-50 p-3 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setSelectedSlot(null);
                  }}
                  disabled={!selectedDept}
                >
                  <option value="">Select a type...</option>
                  {appointmentTypes
                    .filter(
                      (type) =>
                        type.department?.id?.toString() === selectedDept &&
                        type.status !== 'Inactive'
                    )
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title} ({type.duration}m)
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <label className="mb-6 block">
              <span className="sfs-label">Reason for Visit</span>
              <textarea
                className="sfs-textarea resize-none bg-slate-50 p-4 hover:bg-white"
                rows="3"
                placeholder="Briefly describe what you need help with..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>

            <div>
              <span className="sfs-label">Urgency Level</span>
              <div className="flex gap-3">
                {urgencyOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setUrgency(option.value)}
                    className={`flex-1 rounded-lg px-4 py-2.5 font-semibold transition ${
                      urgency === option.value
                        ? 'border border-sfs-blue bg-sfs-blue text-white shadow-card'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <section className="sfs-panel-pad sticky top-24 flex h-full flex-col">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sfs-blue/20 bg-sfs-blue/10 text-sfs-blue">
                <Sparkles size={20} />
              </div>

              <h2 className="text-xl font-bold text-sfs-ink">
                Available Slots
              </h2>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Based on your selected type (
              {selectedTypeObj ? `${selectedTypeObj.duration}m` : '-'}) and{' '}
              <span className="font-semibold text-sfs-ink">
                {selectedUrgencyLabel.toLowerCase()}
              </span>{' '}
              urgency, these are the available times.
            </p>

            <div className="max-h-[300px] flex-1 space-y-4 overflow-y-auto pr-2">
              {suggestedSlots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`relative w-full rounded-xl border bg-white p-4 text-left transition ${
                    selectedSlot === slot.id
                      ? 'border-sfs-blue bg-sfs-blue/5 shadow-card'
                      : 'border-slate-200 hover:border-sfs-blue/30 hover:shadow-sm'
                  }`}
                >
                  {selectedSlot === slot.id && (
                    <CheckCircle2
                      size={22}
                      className="absolute right-3 top-3 text-sfs-blue"
                    />
                  )}

                  <div className="mb-2 flex items-center gap-3 text-sfs-ink">
                    <CalendarIcon size={18} className="text-sfs-blue" />
                    <span className="font-bold">{slot.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    <span className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </button>
              ))}

              {selectedType && suggestedSlots.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm font-medium text-slate-600">
                  No available slots found for this appointment type.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleBooking}
              disabled={!selectedSlot || !selectedType}
              className="sfs-btn-primary mt-8 w-full gap-2 py-3"
            >
              Confirm Booking <ChevronRight size={20} />
            </button>

            {error && (
              <p className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {(!selectedSlot || !selectedType) && (
              <p className="mt-3 text-center text-xs font-medium text-slate-500">
                Please select an appointment type and a time slot.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default BookAppointment;