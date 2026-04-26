import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
    const { user } = useAuth();
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
        fetchDepartments();

        const fetchInquiryTypes = async () => {
            try {
                const res = await api.get('/inquiry-types');
                setInquiryTypes(res.data);
            } catch (err) {
                console.error('Failed to fetch inquiry types', err);
                setInquiryTypes([]);
            }
        };
        fetchInquiryTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Step 1: Create the ticket
            const response = await api.post('/tickets', formData);
            const createdTicketId = response.data?.id;

            // Step 2: Upload attachment if one was selected
            if (file && createdTicketId) {
                const attachmentData = new FormData();
                attachmentData.append('file', file);
                await api.post(`/tickets/${createdTicketId}/attachments`, attachmentData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setSuccess('Ticket created successfully!');
            setTimeout(() => navigate('/my-tickets'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to create ticket');
        }
    };

    return (
        <><Navbar />
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Create New Support Ticket</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Inquiry Type</label>
                        <select
                            name="inquiryTypeId"
                            value={formData.inquiryTypeId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Inquiry Type</option>
                            {inquiryTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                        <select
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Inquiry Details</label>
                        <textarea
                            name="inquiryText"
                            value={formData.inquiryText}
                            onChange={handleChange}
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Attachment <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {file && (
                            <p className="mt-2 text-xs text-gray-500">Selected: {file.name}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-bold"
                    >
                        Create Ticket
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateTicket;