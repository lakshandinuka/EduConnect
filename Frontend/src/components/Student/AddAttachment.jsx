import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddAttachment = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add Attachment to Ticket #{ticketId}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select File</label>
                    <input type="file" onChange={handleFileChange} className="w-full" required />
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300">
                    {uploading ? 'Uploading...' : 'Upload Attachment'}
                </button>
            </form>
        </div>
    );
};

export default AddAttachment;