import React, { useEffect } from 'react';

export const Toast = ({ 
    message, 
    type = 'success', 
    duration = 3000, 
    onClose 
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-sfs-blue/100',
    };

    return (
        <div 
            className={`${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in`}
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
};

export const ToastContainer = ({ toasts, onRemove, removeToast }) => {
    const handleRemove = onRemove || removeToast || (() => {});

    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => handleRemove(toast.id)}
                />
            ))}
        </div>
    );
};

export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, showToast, removeToast };
};

export default Toast;
