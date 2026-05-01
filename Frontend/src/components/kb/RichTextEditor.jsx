import React, { useState } from 'react';

export const RichTextEditor = ({ 
    value = '', 
    onChange,
    placeholder = 'Enter content...',
    minHeight = '300px'
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.currentTarget.innerHTML);
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-100 border-b border-gray-300 p-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <div className="border-l border-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => applyFormat('insertUnorderedList')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    title="Bullet list"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('insertOrderedList')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    title="Numbered list"
                >
                    1. List
                </button>
                <div className="border-l border-gray-300 mx-1" />
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            applyFormat('formatBlock', e.target.value);
                        }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                    <option value="">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
            </div>

            {/* Editor */}
            <div
                contentEditable
                onInput={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                suppressContentEditableWarning
                className="p-4 focus:outline-none"
                style={{ minHeight }}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </div>
    );
};

export default RichTextEditor;
