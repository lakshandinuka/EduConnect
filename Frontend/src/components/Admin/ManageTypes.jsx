import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, List, X } from 'lucide-react';
import api from '../../services/api';

const ManageTypes = () => {
  const [types, setTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', duration: 30, departmentId: '', status: 'Active' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [typeRes, deptRes] = await Promise.all([
        api.get('/types'),
        api.get('/departments')
      ]);
      if (typeRes.data) setTypes(typeRes.data);
      if (deptRes.data) {
        const depts = deptRes.data;
        setDepartments(depts);
        if (depts.length > 0 && !formData.departmentId) {
           setFormData(f => ({ ...f, departmentId: depts[0].id }));
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', duration: 30, departmentId: departments[0]?.id || '', status: 'Active' });
    setShowModal(true);
  };

  const openEditModal = (type) => {
    setIsEditing(true);
    setEditingId(type.id);
    setFormData({ 
      title: type.title, 
      duration: type.duration, 
      departmentId: type.department?.id || departments[0]?.id || '', 
      status: type.status || 'Active' 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (!formData.departmentId) {
      setError("Please select a department.");
      return;
    }
    if (parseInt(formData.duration) <= 0) {
      setError("Duration must be greater than 0.");
      return;
    }
    setError("");

    try {
      const url = isEditing 
        ? `/types/${editingId}`
        : `/types`;
        
      const payload = {
        title: formData.title,
        duration: parseInt(formData.duration),
        status: formData.status,
        departmentId: parseInt(formData.departmentId)
      };

      if (isEditing) {
        await api.put(url, payload);
      } else {
        await api.post(url, payload);
      }
      
      setShowModal(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment type?")) return;
    try {
      await api.delete(`/types/${id}`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Appointment Types</h1>
          <p className="text-gray-500 mt-1">Create and manage the types of appointments students can book.</p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={20} /> Add New Type
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {types.length === 0 ? (
                 <tr><td colSpan="5" className="p-8 text-center text-gray-500">No appointment types found.</td></tr>
              ) : types.map(type => (
                <tr key={type.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><List size={16} /></div>
                    {type.title}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{type.department?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-600">{type.duration} mins</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${type.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {type.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(type)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(type.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Appointment Type" : "Add Appointment Type"}</h2>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                 <input 
                   required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                   className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                   placeholder="e.g. Visa Consulting"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                 <select 
                   value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}
                   required
                   className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white transition-all"
                 >
                   {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                   ))}
                   {departments.length === 0 && <option value="" disabled>No departments available</option>}
                 </select>
               </div>
               
               <div className="grid grid-cols-2 gap-5">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (mins)</label>
                   <input 
                     type="number" min="5" step="5" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}
                     className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                   <select 
                     value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                     className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white transition-all"
                   >
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                   </select>
                 </div>
               </div>
               
               <div className="pt-5 border-t border-gray-100 flex justify-end gap-3 mt-8">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                 <button type="submit" disabled={departments.length===0} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors disabled:opacity-50">
                   {isEditing ? "Save Changes" : "Save Type"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageTypes;
