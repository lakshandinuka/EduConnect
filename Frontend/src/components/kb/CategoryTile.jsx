import React from 'react';
import { Link } from 'react-router-dom';

const categoryIcons = {
    'General': '📚',
    'Technical': '💻',
    'Academic': '🎓',
    'Administrative': '📋',
    'Finance': '💰',
    'Health': '🏥',
    'Library': '📖',
    'IT Support': '🔧',
    'Default': '📂',
};

export const CategoryTile = ({ category, itemCount = 0 }) => {
    const { id, name, description } = category;
    const icon = categoryIcons[name] || categoryIcons['Default'];

    return (
        <Link to={`/kb/category/${id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
                {description && (
                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
                        {description}
                    </p>
                )}
                <p className="text-xs text-gray-500 font-medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
            </div>
        </Link>
    );
};

export default CategoryTile;
