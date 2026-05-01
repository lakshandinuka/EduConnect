import React, { useState } from 'react';
import { submitFeedback } from '../../services/kbService';
import { useToast } from '../common/Toast';

export const FeedbackComponent = ({ itemId }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [helpfulRating, setHelpfulRating] = useState(null);
    const [showReasons, setShowReasons] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const reasons = [
        'Not relevant',
        'Outdated',
        'Hard to understand',
        'Missing details',
        'Other',
    ];

    const handleHelpfulClick = (helpful) => {
        setHelpfulRating(helpful);
        if (helpful) {
            handleSubmitFeedback(true, null);
        } else {
            setShowReasons(true);
        }
    };

    const handleSubmitFeedback = async (helpful, reason) => {
        setIsSubmitting(true);
        try {
            await submitFeedback(itemId, {
                helpful,
                reason,
            });
            showToast('Thank you for your feedback!', 'success');
            setShowFeedback(false);
            setHelpfulRating(null);
            setShowReasons(false);
            setSelectedReason('');
        } catch (error) {
            showToast('Failed to submit feedback', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
            {!showFeedback ? (
                <button
                    onClick={() => setShowFeedback(true)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                    Was this helpful?
                </button>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-900">
                        Was this article helpful?
                    </p>

                    {!showReasons ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleHelpfulClick(true)}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
                            >
                                👍 Yes
                            </button>
                            <button
                                onClick={() => handleHelpfulClick(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-sfs-red text-white rounded hover:opacity-95 disabled:opacity-50 text-sm"
                            >
                                👎 No
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-700">
                                Could you tell us why? (optional)
                            </p>
                            <select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sfs-blue text-sm"
                            >
                                <option value="">Select a reason...</option>
                                {reasons.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleSubmitFeedback(false, selectedReason)
                                    }
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-sfs-blue text-white rounded hover:opacity-95 disabled:opacity-50 text-sm"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReasons(false);
                                        setHelpfulRating(null);
                                        setSelectedReason('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackComponent;
