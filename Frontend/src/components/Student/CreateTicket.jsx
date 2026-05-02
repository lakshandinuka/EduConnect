import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [inquiryTypes, setInquiryTypes] = useState([]);
  const [formData, setFormData] = useState({
    inquiryTypeId: '',
    departmentId: '',
    inquiryText: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
        setDepartments([]);
      }
    };

    const fetchInquiryTypes = async () => {
      try {
        const res = await api.get('/inquiry-types');
        setInquiryTypes(res.data);
      } catch (err) {
        console.error('Failed to fetch inquiry types', err);
        setInquiryTypes([]);
      }
    };

    fetchDepartments();
    fetchInquiryTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/tickets', formData);
      const createdTicketId = response.data?.id;

      if (file && createdTicketId) {
        const attachmentData = new FormData();
        attachmentData.append('file', file);
        await api.post(`/tickets/${createdTicketId}/attachments`, attachmentData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccess('Ticket created successfully.');
      setTimeout(() => navigate('/my-tickets'), 1200);
    } catch (err) {
      setError(err.response?.data || 'Failed to create ticket');
    }
  };

  return (
    <div className="sfs-page">
      <Navbar />
      <main className="sfs-container">
        <div className="mb-6">
          <h1 className="sfs-page-title">Create Support Ticket</h1>
          <p className="sfs-muted mt-1">
            Send your request to the right team and attach any files that help explain the issue.
          </p>
        </div>

        <section className="sfs-panel-pad max-w-3xl">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="sfs-label">Inquiry Type</span>
                <select
                  name="inquiryTypeId"
                  value={formData.inquiryTypeId}
                  onChange={handleChange}
                  className="sfs-input"
                  required
                >
                  <option value="">Select inquiry type</option>
                  {inquiryTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sfs-label">Department</span>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="sfs-input"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span className="sfs-label">Inquiry Details</span>
              <textarea
                name="inquiryText"
                value={formData.inquiryText}
                onChange={handleChange}
                rows="5"
                className="sfs-textarea"
                required
              />
            </label>

            <label>
              <span className="sfs-label">
                Attachment <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sfs-blue/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sfs-blue hover:file:bg-sfs-blue/15"
              />
              {file && <p className="mt-2 text-xs text-slate-500">Selected: {file.name}</p>}
            </label>

            <div className="flex justify-end">
              <button type="submit" className="sfs-btn-primary">
                Create Ticket
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateTicket;
