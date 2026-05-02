import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const AddAttachment = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-tickets');
    } catch (err) {
      setError(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <button type="button" onClick={() => navigate('/my-tickets')} className="sfs-link">
          Back to My Tickets
        </button>
        <h1 className="sfs-page-title mt-2">Add Attachment</h1>
        <p className="sfs-muted mt-1">Upload a supporting file for ticket #{ticketId}.</p>
      </div>

      <section className="sfs-panel-pad">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label>
            <span className="sfs-label">Select File</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sfs-blue/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sfs-blue hover:file:bg-sfs-blue/15"
              required
            />
          </label>

          <button type="submit" disabled={uploading} className="sfs-btn-primary w-full">
            {uploading ? 'Uploading...' : 'Upload Attachment'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddAttachment;
