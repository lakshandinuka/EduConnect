import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    role: 'STUDENT',
    studentId: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'STUDENT' && !formData.studentId.trim()) {
      setError('Student ID is required');
      return;
    }
    if (formData.role === 'DEPT_ADMIN' && !formData.departmentId) {
      setError('Please select a department');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="sfs-page-title">Register User</h1>
        <p className="sfs-muted mt-1">Create a student or administrator account.</p>
      </div>

      <section className="sfs-panel-pad">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="sfs-label">Full Name</span>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="sfs-input" required />
            </label>
            <label>
              <span className="sfs-label">Email</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="sfs-input" required />
            </label>
            <label>
              <span className="sfs-label">Password</span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="sfs-input" required />
            </label>
            <label>
              <span className="sfs-label">Phone Number</span>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="sfs-input" />
            </label>
            <label>
              <span className="sfs-label">Role</span>
              <select name="role" value={formData.role} onChange={handleChange} className="sfs-input">
                <option value="STUDENT">Student</option>
                <option value="DEPT_ADMIN">Department Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </label>

            {formData.role === 'STUDENT' && (
              <label>
                <span className="sfs-label">Student ID</span>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="sfs-input" required />
              </label>
            )}

            {formData.role === 'DEPT_ADMIN' && (
              <label>
                <span className="sfs-label">Department</span>
                <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="sfs-input" required>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="sfs-btn-primary">
              Register
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
