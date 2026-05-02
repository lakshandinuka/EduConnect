import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Plus, X } from 'lucide-react';
import api from '../../services/api';

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '', typeId: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [slotRes, typeRes] = await Promise.all([
        api.get('/slots'),
        api.get('/types')
      ]);
      if(slotRes.data) setSlots(slotRes.data);
      if(typeRes.data) {
        const t = typeRes.data;
        setTypes(t);
        if (t.length > 0 && !formData.typeId) {
          setFormData(f => ({ ...f, typeId: t[0].id }));
        }
      }
    } catch(e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      fetchData();
    } catch(e) { console.error(e); }
  };

  const openAddModal = () => {
    setFormData({ 
      date: new Date().toISOString().split('T')[0], 
      startTime: '09:00', 
      endTime: '09:30', 
      typeId: types.length > 0 ? types[0].id : '' 
    });
    setShowModal(true);
  };

  const handleGenerateSlot = async (e) => {
    e.preventDefault();
    if (!formData.typeId) {
      setError("Please select an appointment type.");
      return;
    }
    if (!formData.date || !formData.startTime || !formData.endTime) {
      setError("Date, Start Time, and End Time are required.");
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setError("End Time must be strictly after Start Time.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.date === today) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (formData.startTime < currentTime) {
        setError("Start time cannot be in the past for today.");
        return;
      }
    }

    setError("");

    try {
      const formatTime = (timeStr) => timeStr.length === 5 ? `${timeStr}:00` : timeStr;
      
      await api.post('/slots', {
        date: formData.date,
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
        typeId: parseInt(formData.typeId)
      });
      setShowModal(false);
      fetchData();
    } catch(e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="sfs-page-title">Time Slots</h1>
          <p className="sfs-muted mt-1">Manage your availability for specific appointment types.</p>
        </div>
        <button onClick={openAddModal} className="sfs-btn-primary gap-2">
          <Plus size={20} /> Generate Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.length === 0 ? (
          <p className="sfs-panel-pad col-span-3 text-center text-slate-600">No time slots found.</p>
        ) : slots.map(slot => (
          <div key={slot.id} className="sfs-panel-pad hover:shadow-card transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${slot.isAvailable ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <button onClick={() => handleDelete(slot.id)} className="text-gray-400 hover:text-red-500 font-bold text-sm">Delete</button>
            </div>
            
            <h3 className="font-bold text-sfs-ink mb-3">{slot.appointmentType?.title || 'General'}</h3>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalIcon size={16} className="text-sfs-blue" />
                <span className="font-medium text-sfs-ink">{slot.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-sfs-blue" />
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="sfs-panel w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
               <h2 className="text-xl font-bold text-sfs-ink">Generate Time Slot</h2>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleGenerateSlot} className="p-6 space-y-5">
               {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
               <div>
                 <label className="sfs-label">Appointment Type</label>
                 <select 
                   value={formData.typeId} onChange={e => setFormData({...formData, typeId: e.target.value})}
                   required
                   className="sfs-input"
                 >
                   {types.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.duration}m)</option>
                   ))}
                   {types.length === 0 && <option value="" disabled>No types available</option>}
                 </select>
               </div>
               
               <div>
                 <label className="sfs-label">Date</label>
                 <input 
                   required type="date"
                   min={new Date().toISOString().split('T')[0]}
                   value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                   className="sfs-input"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-5">
                 <div>
                   <label className="sfs-label">Start Time</label>
                   <input 
                     required type="time"
                     min={formData.date === new Date().toISOString().split('T')[0] ? `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}` : undefined}
                     value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})}
                     className="sfs-input"
                   />
                 </div>
                 <div>
                   <label className="sfs-label">End Time</label>
                   <input 
                     required type="time"
                     value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})}
                     className="sfs-input"
                   />
                 </div>
               </div>
               
               <div className="pt-5 border-t border-gray-100 flex justify-end gap-3 mt-8">
                 <button type="button" onClick={() => setShowModal(false)} className="sfs-btn-secondary">Cancel</button>
                 <button type="submit" disabled={types.length===0} className="sfs-btn-primary">
                   Generate Slot
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageSlots;
