import React from 'react';

export const ViewToggle = ({ view = 'grid', onChange }) => {
    return (
        <div className="flex gap-2 border border-gray-300 rounded-lg p-1 w-fit">
            <button
                onClick={() => onChange('grid')}
                className={`px-3 py-1 rounded transition-colors ${
                    view === 'grid'
                        ? 'bg-sfs-blue/100 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
            >
                ⊞ Grid
            </button>
            <button
                onClick={() => onChange('list')}
                className={`px-3 py-1 rounded transition-colors ${
                    view === 'list'
                        ? 'bg-sfs-blue/100 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="List view"
                aria-pressed={view === 'list'}
            >
                ☰ List
            </button>
        </div>
    );
};

export default ViewToggle;
