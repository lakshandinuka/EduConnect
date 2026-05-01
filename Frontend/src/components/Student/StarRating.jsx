import React, { useState } from 'react';

const StarRating = ({ value, onChange, readonly = false }) => {
    const [hoverValue, setHoverValue] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    const handleClick = (score) => {
        if (!readonly && onChange) {
            onChange(score);
        }
    };

    const handleMouseEnter = (score) => {
        if (!readonly) setHoverValue(score);
    };

    const handleMouseLeave = () => {
        if (!readonly) setHoverValue(0);
    };

    return (
        <div className="flex items-center space-x-1">
            {stars.map((star) => {
                const isActive = (hoverValue || value) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        className={`focus:outline-none transition-colors duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer'
                            }`}
                        disabled={readonly}
                    >
                        <svg
                            className={`w-8 h-8 ${isActive
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 fill-current'
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;