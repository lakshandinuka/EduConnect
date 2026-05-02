import React, { useState, useEffect } from 'react';
import EscalationRuleBuilder from './EscalationRuleBuilder';

const defaultFormData = {
    name: '',
    department: 'Computer Science',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    responseTime: { value: 1, unit: 'minutes' },
    resolutionTime: { value: 1, unit: 'minutes' },
    escalationRules: []
};

const SLAForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...defaultFormData,
                ...initialData,
                responseTime: {
                    ...defaultFormData.responseTime,
                    ...(initialData.responseTime || {})
                },
                resolutionTime: {
                    ...defaultFormData.resolutionTime,
                    ...(initialData.resolutionTime || {})
                },
                escalationRules: Array.isArray(initialData.escalationRules)
                    ? initialData.escalationRules
                    : []
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleTimeChange = (type, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [type]: {
                ...(prev[type] || {}),
                [field]: field === 'value' ? Number(value) : value
            }
        }));

        if (errors[type]) {
            setErrors((prev) => ({ ...prev, [type]: '' }));
        }
    };

    const handleRulesChange = (rules) => {
        setFormData((prev) => ({
            ...prev,
            escalationRules: Array.isArray(rules) ? rules : []
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Policy name is required';
        }

        if (!formData.responseTime?.value || formData.responseTime.value <= 0) {
            newErrors.responseTime = 'Valid response time required';
        }

        if (!formData.resolutionTime?.value || formData.resolutionTime.value <= 0) {
            newErrors.resolutionTime = 'Valid resolution time required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form
            className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 sm:p-8"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Policy Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3"
                            placeholder="e.g. CS Medium SLA"
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3"
                        >
                            <option value="Computer Science">Computer Science</option>
                            <option value="IT Support">IT Support</option>
                            <option value="Student Services">Student Services</option>
                            <option value="Finance">Finance</option>
                            <option value="Administration">Administration</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Response Time</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                value={formData.responseTime.value}
                                onChange={(e) => handleTimeChange('responseTime', 'value', e.target.value)}
                                className="w-1/2 border rounded-xl px-4 py-3"
                            />
                            <select
                                value={formData.responseTime.unit}
                                onChange={(e) => handleTimeChange('responseTime', 'unit', e.target.value)}
                                className="w-1/2 border rounded-xl px-4 py-3"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        {errors.responseTime && <span className="text-red-500 text-xs">{errors.responseTime}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Resolution Time</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                value={formData.resolutionTime.value}
                                onChange={(e) => handleTimeChange('resolutionTime', 'value', e.target.value)}
                                className="w-1/2 border rounded-xl px-4 py-3"
                            />
                            <select
                                value={formData.resolutionTime.unit}
                                onChange={(e) => handleTimeChange('resolutionTime', 'unit', e.target.value)}
                                className="w-1/2 border rounded-xl px-4 py-3"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <p className="text-xs text-gray-500">
                            Defines how long before the ticket is automatically escalated.
                        </p>
                        {errors.resolutionTime && <span className="text-red-500 text-xs">{errors.resolutionTime}</span>}
                    </div>
                </div>

                <div>
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Escalation Rules</h3>
                        <p className="text-sm text-gray-500">
                            Optional advanced rules. Basic SLA auto-escalation is handled automatically by the system.
                        </p>
                    </div>

                    <EscalationRuleBuilder
                        rules={formData.escalationRules}
                        onChange={handleRulesChange}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit">
                        {initialData ? 'Update' : 'Create'}
                    </button>
                </div>

            </div>
        </form>
    );
};

export default SLAForm;