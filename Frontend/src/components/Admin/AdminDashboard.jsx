import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const url = statusFilter ? `/admin/tickets?status=${statusFilter}` : '/admin/tickets';
            const res = await api.get(url);
            setTickets(res.data);
        } catch (err) {
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto mt-10 p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Annoncements</h2>
                <div className="mb-4 text-sm text-gray-600">Your Announcements.</div>
            </div>

            <div className="max-w-6xl mx-auto mt-10 p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

                {user?.role === 'SUPER_ADMIN' && (
                    <div className="mb-4 text-sm text-gray-600">You are viewing all tickets.</div>
                )}

                {user?.role === 'DEPT_ADMIN' && (
                    <div className="mb-4 text-sm text-gray-600">Showing tickets for your department.</div>
                )}

                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setStatusFilter('')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                statusFilter === ''
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All Tickets
                        </button>

                        <button
                            onClick={() => setStatusFilter('RESOLVED')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                statusFilter === 'RESOLVED'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Pending Approval
                        </button>

                        <button
                            onClick={() => setStatusFilter('APPROVED')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                statusFilter === 'APPROVED'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Completed
                        </button>
                    </nav>
                </div>

                {tickets.length === 0 ? (
                    <p className="text-gray-500">No tickets found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {tickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {ticket.id}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.studentName}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.inquiryTypeName}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.departmentName}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'APPROVED' ? 'bg-green-200 text-green-900' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {ticket.slaDueAt ? (
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    new Date(ticket.slaDueAt) < new Date()
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {new Date(ticket.slaDueAt).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No SLA</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                                className="bg-blue-500 hover:bg-red-600 px-3 py-1 rounded font-bold"
                                            >
                                                View Ticket
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;