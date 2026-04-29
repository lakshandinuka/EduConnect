import React, { useState, useEffect } from 'react';
import EscalationRuleBuilder from './EscalationRuleBuilder';

const defaultFormData = {
    name: '',
    department: 'IT Support',
    priority: 'Low',
    status: 'ACTIVE',
    responseTime: { value: 1, unit: 'hours' },
    resolutionTime: { value: 4, unit: 'hours' },
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

                {/* BASIC INFO */}
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
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* DEPT + PRIORITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label>Department</label>
                        <select name="department" value={formData.department} onChange={handleChange}>
                            <option value="IT Support">IT Support</option>
                            <option value="Student Services">Student Services</option>
                            <option value="Finance">Finance</option>
                            <option value="Administration">Administration</option>
                        </select>
                    </div>

                    <div>
                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* TIMES */}
                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <label>Response Time</label>
                        <input
                            type="number"
                            value={formData.responseTime.value}
                            onChange={(e) => handleTimeChange('responseTime', 'value', e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Resolution Time</label>
                        <input
                            type="number"
                            value={formData.resolutionTime.value}
                            onChange={(e) => handleTimeChange('resolutionTime', 'value', e.target.value)}
                        />
                    </div>
                </div>

                {/* ESCALATION */}
                <EscalationRuleBuilder
                    rules={formData.escalationRules}
                    onChange={handleRulesChange}
                />

                {/* BUTTONS */}
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit">
                        {initialData ? 'Update' : 'Create'}
                    </button>
                </div>

            </div>
        </form>
    );
};

export default SLAForm;