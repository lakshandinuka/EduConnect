import React from 'react';

export const Badge = ({ variant = 'category', children, className = '' }) => {
    const baseStyles = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';
    
    const variants = {
        category: 'bg-sfs-blue/10 text-sfs-blue',
        type: 'bg-purple-100 text-purple-800',
        status: 'bg-gray-100 text-gray-800',
        article: 'bg-green-100 text-green-800',
        pdf: 'bg-red-100 text-red-800',
        recommended: 'bg-yellow-100 text-yellow-800',
        published: 'bg-emerald-100 text-emerald-800',
        draft: 'bg-red-100 text-red-800',
        archived: 'bg-slate-100 text-slate-800',
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
