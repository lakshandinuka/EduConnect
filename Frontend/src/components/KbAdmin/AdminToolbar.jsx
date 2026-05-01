import React, { useState } from 'react';

export const AdminToolbar = ({
    editMode = false,
    onEditModeToggle,
    onExit,
    onSimulationChange,
    simulations = [],
    currentSimulation = 'admin',
}) => {
    const [showSimulationMenu, setShowSimulationMenu] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xl z-40 border-t-4 border-amber-700">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                {/* Left Section - Info */}
                <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-amber-700 rounded-full text-sm font-semibold">
                        ADMIN MODE
                    </span>
                    <span className="text-sm">
                        Viewing as: <strong>{currentSimulation}</strong>
                    </span>
                </div>

                {/* Middle Section - Controls */}
                <div className="flex items-center gap-3">
                    {/* Simulation Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSimulationMenu(!showSimulationMenu)}
                            className="px-4 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 text-sm font-medium transition-colors"
                        >
                            📋 Simulate {currentSimulation} ▼
                        </button>
                        {showSimulationMenu && (
                            <div className="absolute bottom-full mb-2 left-0 bg-white text-gray-800 rounded shadow-lg py-2 min-w-max">
                                {simulations.map((sim) => (
                                    <button
                                        key={sim.value}
                                        onClick={() => {
                                            onSimulationChange(sim.value);
                                            setShowSimulationMenu(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                            currentSimulation === sim.value
                                                ? 'bg-sfs-blue/10 font-semibold'
                                                : ''
                                        }`}
                                    >
                                        {sim.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Edit Mode Toggle */}
                    <button
                        onClick={onEditModeToggle}
                        className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                            editMode
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-white text-amber-600 hover:bg-gray-100'
                        }`}
                    >
                        {editMode ? '✓ Edit Mode ON' : '✎ Edit Mode OFF'}
                    </button>
                </div>

                {/* Right Section - Exit */}
                <button
                    onClick={onExit}
                    className="px-4 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                    ✕ Exit Preview
                </button>
            </div>
        </div>
    );
};

export default AdminToolbar;
