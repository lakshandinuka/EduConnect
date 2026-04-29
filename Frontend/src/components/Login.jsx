import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import bgImage from '../assets/wallpaper.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [time, setTime] = useState(new Date());

    const { login } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-grey-100 relative">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Time & Date */}
            <div className="absolute top-6 right-6 text-white text-right">
                <h1 className="text-3xl font-bold">
                    {time.toLocaleTimeString()}
                </h1>
                <p className="text-lg">
                    {time.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            </div>


            <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Welcome to{" "}
                    <span className="text-pink-700">SFS EDUConnect</span><br /><br />

                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a
                        href="mailto:sadmin@gmail.com?subject=Registration Request&body=Hello Admin,%0A%0AI would like to register to the SFS EDUConnect platform.%0A%0AFull Name:%0AEmail:%0APhone Number:%0AStudent ID:%0A%0AThank you!"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                    >
                        Send a Registration Request
                    </a>
                </p>

            </div>
        </div>
    );
};

export default Login;