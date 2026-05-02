import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StarRating from './StarRating';

const TicketCard = ({ ticket, onDelete }) => {
    const [satisfactionScore, setSatisfactionScore] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [localTicket, setLocalTicket] = useState(ticket);

    const handleSubmitSatisfaction = async () => {
        if (!satisfactionScore) {
            setRatingError('Please select a score');
            return;
        }
        try {
            await api.post(`/tickets/${localTicket.id}/satisfaction`, { score: satisfactionScore });
            setLocalTicket({ ...localTicket, satisfactionScore: satisfactionScore });
            alert('Thank you for your feedback!');
        } catch (err) {
            setRatingError(err.response?.data || 'Failed to submit score');
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            onDelete(localTicket.id);
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <Link to={`/my-tickets/${localTicket.id}`} className="text-blue-600 hover:underline text-sm">
                        View Details
                    </Link>
                    <h3 className="text-lg font-semibold">{localTicket.inquiryType}</h3>
                    <p className="text-sm text-gray-600">Department: {localTicket.departmentName}</p>
                    <p className="text-sm text-gray-600">Status:
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${localTicket.status === 'OPEN' ? 'bg-yellow-200 text-yellow-800' :
                            localTicket.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
                                localTicket.status === 'RESOLVED' ? 'bg-green-200 text-green-800' :
                                    'bg-gray-200 text-gray-800'}`}>
                            {localTicket.status}
                        </span>
                    </p>
                    <p className="mt-2 text-gray-700">{localTicket.inquiryText}</p>
                    {localTicket.attachments && localTicket.attachments.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium">Attachments:</p>
                            <ul className="list-disc pl-5">
                                {localTicket.attachments.map(att => (
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
                    {localTicket.status === 'OPEN' && (
                        <>
                            <Link to={`/tickets/${localTicket.id}/add-attachment`} className="text-blue-600 hover:text-blue-800 text-sm">
                                Add Attachment
                            </Link>
                            <button onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Satisfaction Score Section - only for approved tickets */}
            {localTicket.status === 'APPROVED' && (
                <div className="mt-6 p-4 bg-gray-50 rounded border">
                    <h3 className="text-lg font-semibold mb-2 align-middle">Rate Your Experience</h3>
                    {localTicket.satisfactionScore ? (
                        <div>
                            <p className="text-green-600 mb-2">You rated this ticket:</p>
                            <StarRating value={localTicket.satisfactionScore} readonly={true} />
                            <p className="text-sm text-gray-500 mt-1">Thank you for your feedback!</p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-2">How satisfied are you with the resolution?</p>
                            <StarRating
                                value={satisfactionScore}
                                onChange={(score) => setSatisfactionScore(score)}
                            />
                            <div className="mt-4">
                                <button
                                    onClick={handleSubmitSatisfaction}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Submit Rating
                                </button>
                            </div>
                            {ratingError && <p className="text-red-500 mt-2">{ratingError}</p>}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-2 text-xs text-gray-400">
                Created: {new Date(localTicket.createdAt).toLocaleString()}
            </div>
        </div>
    );
};

export default TicketCard;