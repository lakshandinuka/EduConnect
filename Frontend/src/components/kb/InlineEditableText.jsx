import React, { useState, useRef, useEffect } from 'react';

export const InlineEditableText = ({
    value,
    onSave,
    multiline = false,
    maxLength = 500,
    className = '',
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim() !== value.trim()) {
            onSave(editValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !multiline) {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (!isEditing) {
        return (
            <div
                onClick={() => setIsEditing(true)}
                className={`cursor-pointer p-2 rounded hover:bg-gray-100 group ${className}`}
            >
                <div className="flex items-center gap-2">
                    <span>{value}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-gray-500 text-sm">
                        ✎
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-2 space-y-2 ${className}`}>
            {multiline ? (
                <textarea
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value.slice(0, maxLength))}
                    onKeyDown={handleKeyDown}
                    maxLength={maxLength}
                    className="w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-sfs-blue"
                    rows={3}
                />
            ) : (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value.slice(0, maxLength))}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-sfs-blue"
                />
            )}
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                    Save
                </button>
                <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default InlineEditableText;
