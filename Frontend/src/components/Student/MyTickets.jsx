import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TicketCard from './TicketCard';

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
        <>
            <Navbar />
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
                            <TicketCard key={ticket.id} ticket={ticket} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyTickets;