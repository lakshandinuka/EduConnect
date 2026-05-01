import React, { useState } from 'react';

export const FilterPanel = ({ 
    categories = [], 
    onFilterChange,
    isOpen = true,
    onToggle,
}) => {
    const safeCategories = Array.isArray(categories) ? categories : []; 

    const [filters, setFilters] = useState({
        category: '',
        type: '',
        sort: 'relevance',
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            type: '',
            sort: 'relevance',
        };
        setFilters(resetFilters);
        if (onFilterChange) {
            onFilterChange(resetFilters);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                    onClick={onToggle}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                    aria-label="Toggle filters"
                >
                    ✕
                </button>
            </div>

            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfs-blue"
                >
                    <option value="">All Categories</option>
                    {safeCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Type Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                </label>
                <div className="space-y-2">
                    {['Article', 'PDF'].map((type) => (
                        <label key={type} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.type === type.toUpperCase()}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'type',
                                        e.target.checked ? type.toUpperCase() : ''
                                    )
                                }
                                className="rounded border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sort Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                </label>
                <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfs-blue"
                >
                    <option value="relevance">Relevance</option>
                    <option value="recent">Recently Updated</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );
};

export default FilterPanel;
