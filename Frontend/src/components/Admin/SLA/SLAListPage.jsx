import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SLATable from './SLATable';
import { getPolicies, deletePolicy } from '../../../services/slaService';

const SLAListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [filters, setFilters] = useState({
    department: 'All',
    priority: 'All',
    status: 'All',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPolicies();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading policies:', error);
      alert('Failed to load SLA policies');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePolicy(id);
      loadData();
    } catch (error) {
      console.error('Error deleting policy:', error);
      alert('Failed to delete policy');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPolicies = policies.filter((p) => {
    const matchDept =
      filters.department === 'All' || p.department === filters.department;
    const matchPriority =
      filters.priority === 'All' || p.priority === filters.priority;
    const matchStatus =
      filters.status === 'All' || p.status === filters.status;

    return matchDept && matchPriority && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 w-full">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              SLA Policies
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage service level agreements and auto-escalation rules
            </p>
          </div>

          <Link
            to="/admin/sla/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            + Create New SLA
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white border border-blue-100 p-3 rounded-2xl shadow-sm">
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Departments</option>
            <option value="IT Support">IT Support</option>
            <option value="Student Services">Student Services</option>
            <option value="Finance">Finance</option>
            <option value="Administration">Administration</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <SLATable policies={filteredPolicies} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default SLAListPage;