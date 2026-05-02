import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getReturnPath = () => {
    const from = location.state?.from;
    if (!from) return '/dashboard';
    if (typeof from === 'string') return from;
    return `${from.pathname || '/dashboard'}${from.search || ''}${from.hash || ''}`;
  };

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
      navigate(getReturnPath(), { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: 'url(/assets/hero-campus.jpg)' }}
    >
      <div className="absolute inset-0 bg-sfs-ink/55" />

      <div className="absolute right-6 top-6 hidden text-right text-white sm:block">
        <div className="text-2xl font-extrabold">{time.toLocaleTimeString()}</div>
        <p className="text-sm text-white/85">
          {time.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <section className="sfs-panel-pad relative z-10 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-sfs-ink">Welcome to SFS EDUConnect</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to access support, tickets, bookings, and knowledge base guidance.</p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label>
            <span className="sfs-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sfs-input"
              required
            />
          </label>

          <label>
            <span className="sfs-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sfs-input"
              required
            />
          </label>

          <button type="submit" className="sfs-btn-primary w-full">
            Login
          </button>
        </form>

        <div className="mt-5 space-y-3 text-center text-sm text-slate-600">
          <p>
            Need an account?{' '}
            <a
              href="mailto:sadmin@gmail.com?subject=Registration Request&body=Hello Admin,%0A%0AI would like to register to the SFS EDUConnect platform.%0A%0AFull Name:%0AEmail:%0APhone Number:%0AStudent ID:%0A%0AThank you!"
              target="_blank"
              rel="noreferrer"
              className="sfs-link"
            >
              Send a registration request
            </a>
          </p>
          <p>
            Admin user?{' '}
            <Link to="/register" className="sfs-link">
              Register new user
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
