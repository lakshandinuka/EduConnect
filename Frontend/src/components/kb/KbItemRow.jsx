import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

export const KbItemRow = ({ item, onPreview, onEdit, showActions = false }) => {
    const {
        id,
        title,
        description,
        category,
        type,
        updatedAt,
        recommended,
        status,
        permissions,
    } = item;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow">
            <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            to={`/kb/item/${id}`}
                            className="text-lg font-semibold text-sfs-blue hover:text-sfs-blue truncate"
                        >
                            {title}
                        </Link>
                        {recommended && (
                            <span className="flex-shrink-0">⭐</span>
                        )}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="category">{category?.name}</Badge>
                        <Badge variant={type.toLowerCase()}>
                            {type === 'ARTICLE' ? 'Article' : 'PDF'}
                        </Badge>
                        {showActions && status && (
                            <Badge variant={status.toLowerCase()}>
                                {status}
                            </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                            {formatDate(updatedAt)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2 flex-shrink-0">
                        {onPreview && (
                            <button
                                onClick={() => onPreview(item)}
                                className="px-3 py-1 text-sm text-sfs-blue hover:bg-sfs-blue/10 rounded transition"
                            >
                                Preview
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => onEdit(item)}
                                className="px-3 py-1 text-sm text-sfs-blue hover:bg-sfs-blue/10 rounded transition"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KbItemRow;
