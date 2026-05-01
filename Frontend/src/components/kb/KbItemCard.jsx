import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

export const KbItemCard = ({ item, onPreview, onEdit, showActions = false }) => {
    const {
        id,
        title,
        description,
        category,
        type,
        updatedAt,
        recommended,
        status,
    } = item;

    const safeType = type || 'ARTICLE';
    const safeCategory =
        typeof category === 'string' ? category : category?.name || 'General';

    const formatDate = (date) => {
        if (!date) return 'Recently';
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) return 'Recently';
        return parsed.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <Link to={`/kb/item/${id}`} className="flex-1 hover:text-sfs-blue">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {title || 'Untitled'}
                        </h3>
                    </Link>
                    {recommended && (
                        <Badge variant="recommended" className="ml-2 flex-shrink-0">
                            Recommended
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                    <Badge variant="category">{safeCategory}</Badge>
                    <Badge variant={safeType.toLowerCase()}>
                        {safeType === 'ARTICLE' ? 'Article' : 'PDF'}
                    </Badge>
                    {showActions && status && (
                        <Badge variant={status.toLowerCase()}>
                            {status}
                        </Badge>
                    )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {description || 'No description available.'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Updated {formatDate(updatedAt)}</span>
                </div>
            </div>

            {showActions && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex gap-2">
                    {onPreview && (
                        <button
                            onClick={() => onPreview(item)}
                            className="text-sfs-blue hover:text-sfs-blue text-sm font-medium"
                        >
                            Preview
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(item)}
                            className="text-sfs-blue hover:text-sfs-blue text-sm font-medium"
                        >
                            Edit
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default KbItemCard;
