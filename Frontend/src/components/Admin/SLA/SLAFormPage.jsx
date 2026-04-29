import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SLAForm from './SLAForm';
import {
  getPolicyById,
  createPolicy,
  updatePolicy,
} from '../../../services/slaService';

const SLAFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    const loadPolicy = async () => {
      if (!isEditMode) return;

      try {
        const policy = await getPolicyById(id);

        if (policy) {
          setInitialData(policy);
        } else {
          alert('Policy not found!');
          navigate('/admin/sla');
        }
      } catch (error) {
        console.error('Error loading policy:', error);
        alert('Failed to load policy');
        navigate('/admin/sla');
      }
    };

    loadPolicy();
  }, [id, navigate, isEditMode]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updatePolicy(id, formData);
      } else {
        await createPolicy(formData);
      }

      navigate('/admin/sla');
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Failed to save policy');
    }
  };

  const handleCancel = () => {
    navigate('/admin/sla');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            {isEditMode ? 'Edit SLA Policy' : 'Create New SLA Policy'}
          </h1>

          <p className="text-slate-500 text-sm font-medium">
            {isEditMode
              ? 'Update the details and escalation rules for this policy'
              : 'Define a new service level agreement with escalation automation'}
          </p>
        </div>

        {isEditMode && !initialData ? (
          <div className="text-slate-500 text-sm text-center">
            Loading policy...
          </div>
        ) : (
          <SLAForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default SLAFormPage;