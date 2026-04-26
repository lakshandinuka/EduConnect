import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    // Role‑based greeting
    let roleMessage = '';
    switch (user.role) {
        case 'STUDENT':
            roleMessage = 'Welcome to your Student Dashboard. ';
            break;
        case 'DEPT_ADMIN':
            return <Navigate to="/admin/dashboard" replace />;
        //roleMessage = `Welcome, Department Admin (${user.departmentId ? 'Dept ID: ' + user.departmentId : 'N/A'}). You can view tickets for your department.`;
        //break;
        case 'SUPER_ADMIN':
            roleMessage = 'Welcome, Super Admin. You have full access to all tickets and approvals.';
            break;
        default:
            roleMessage = 'Dashboard';
    }

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="text-gray-700">{roleMessage}</p>
                {/* Ticket management components will be placed here later */}
            </div>

        </>
    );
};

export default Dashboard;