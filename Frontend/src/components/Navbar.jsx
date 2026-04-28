import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inject navbar styles once
if (typeof document !== 'undefined' && !document.getElementById('navbar-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'navbar-style';
    styleEl.textContent = `
        .navbar-root {
            background: linear-gradient(90deg, #0f1f3d 0%, #0a1628 60%, #071020 100%);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 2px 16px rgba(0,0,0,0.4);
            position: relative;
        }
        .navbar-root::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa, #3b82f6, #1e40af);
            background-size: 200% 100%;
            animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
        }
        .navbar-brand {
            color: #f0f6ff !important;
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .navbar-link {
            color: #ffffff !important;
            text-decoration: bold;
            font-weight: 500;
            font-size: 15px;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid transparent;
            transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .navbar-link:hover {
            color: #000000 !important;
            border-color: rgba(59,130,246,0.3);
            background: rgb(255, 255, 255);
        }
        .navbar-greeting {
            color: #ffffff;
            font-size: 13px;
            padding: 0 4px;
            letter-spacing: 0.01em;
        }
        .navbar-logout {
            background: rgba(239,68,68,0.15);
            border: 1px solid rgba(239,68,68,0.35);
            color: #ffffff;
            padding: 4px 14px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
        }
        .navbar-logout:hover {
            background: rgb(255, 0, 0);
            border-color: rgb(0, 0, 0);
        }
        .navbar-divider {
            width: 1px;
            height: 18px;
            background: rgba(255,255,255,0.1);
            margin: 0 4px;
        }
    `;
    document.head.appendChild(styleEl);
}

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar-root">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/dashboard" className="navbar-brand">
                    SFS EDUConnect
                </Link>

                <div className="flex space-x-2 items-center">

                    {user?.role === 'DEPT_ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                        <>
                            <Link to="/admin/dashboard" className="navbar-link">Admin Dashboard</Link>
                            <Link to="/admin/manage-types" className="navbar-link">Manage Types</Link>
                            <Link to="/admin/manage-slots" className="navbar-link">Manage Slots</Link>
                            <Link to="/admin/view-bookings" className="navbar-link">View Bookings</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/create-ticket" className="navbar-link">Create Ticket</Link>
                            <Link to="/my-tickets" className="navbar-link">My Tickets</Link>
                            <Link to="/book-appointment" className="navbar-link">Appointment Booking</Link>
                            <Link to="/student/my-bookings" className="navbar-link">My Bookings</Link>
                        </>
                    )}

                    {user?.role === 'SUPER_ADMIN' && (
                        <>
                            <Link to="/analytics" className="navbar-link">Analytics</Link>
                            <Link to="/register" className="navbar-link">Register New User</Link>
                        </>
                    )}

                    <div className="navbar-divider" />
                    <span className="navbar-greeting">Hello, {user?.fullName}</span>
                    <button onClick={handleLogout} className="navbar-logout">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;