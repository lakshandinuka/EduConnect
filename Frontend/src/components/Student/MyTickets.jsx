import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets');
            console.log('Fetched tickets:', res.data);
            setTickets(res.data);
        } catch (err) {
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
        try {
            await api.delete(`/tickets/${ticketId}`);
            setTickets(tickets.filter(t => t.id !== ticketId));
        } catch (err) {
            alert(err.response?.data || 'Failed to delete ticket');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <><Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Tickets</h2>
                    <Link to="/create-ticket" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Create New Ticket
                    </Link>
                </div>
                {tickets.length === 0 ? (
                    <p className="text-gray-500 text-center">No tickets found. Create your first ticket!</p>
                ) : (
                    <div className="space-y-4">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link to={`/my-tickets/${ticket.id}`} className="text-blue-600 hover:underline text-sm">
                                            View Details
                                        </Link>
                                        <h3 className="text-lg font-semibold">{ticket.inquiryTypeName}</h3>
                                        <p className="text-sm text-gray-600">Department: {ticket.departmentName}</p>
                                        <p className="text-sm text-gray-600">Status:
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${ticket.status === 'OPEN' ? 'bg-yellow-200 text-yellow-800' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
                                                    ticket.status === 'RESOLVED' ? 'bg-green-200 text-green-800' :
                                                        'bg-gray-200 text-gray-800'}`}>
                                                {ticket.status}
                                            </span>
                                        </p>
                                        <p className="mt-2 text-gray-700">{ticket.inquiryText}</p>
                                        {ticket.attachments && ticket.attachments.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium">Attachments:</p>
                                                <ul className="list-disc pl-5">
                                                    {ticket.attachments.map(att => (
                                                        <li key={att.id}>
                                                            <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                {att.fileName}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        {ticket.status === 'OPEN' && (
                                            <>
                                                <Link to={`/tickets/${ticket.id}/add-attachment`} className="text-blue-600 hover:text-blue-800 text-sm">
                                                    Add Attachment
                                                </Link>
                                                <button onClick={() => handleDelete(ticket.id)} className="text-red-600 hover:text-red-800 text-sm">
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    Created: {new Date(ticket.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyTickets;