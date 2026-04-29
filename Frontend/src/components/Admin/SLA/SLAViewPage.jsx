import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPolicyById } from '../../../services/slaService';
import SLAStatusBadge from './SLAStatusBadge';

const SLAViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const data = await getPolicyById(id);

        if (data) {
          setPolicy(data);
        } else {
          alert('Policy not found');
          navigate('/admin/sla');
        }
      } catch (error) {
        console.error('Error loading policy:', error);
        alert('Failed to load policy');
        navigate('/admin/sla');
      }
    };

    loadPolicy();
  }, [id, navigate]);

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-900 pb-12">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              SLA Policy Details
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              View the details and escalation rules for this policy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/sla"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
            >
              Back to List
            </Link>

            <Link
              to={`/admin/sla/${policy.id}/edit`}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Policy
            </Link>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <InfoCard label="Policy Name" value={policy.name || '-'} />

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Status
              </span>
              <div className="mt-2">
                <SLAStatusBadge type="status" value={policy.status || 'UNKNOWN'} />
              </div>
            </div>

            <InfoCard label="Department" value={policy.department || '-'} />

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Priority
              </span>
              <div className="mt-2">
                <SLAStatusBadge type="priority" value={policy.priority || 'UNKNOWN'} />
              </div>
            </div>

            <InfoCard
              label="Response Time"
              value={`${policy.responseTime?.value ?? '-'} ${policy.responseTime?.unit ?? ''}`}
            />

            <InfoCard
              label="Resolution Time"
              value={`${policy.resolutionTime?.value ?? '-'} ${policy.resolutionTime?.unit ?? ''}`}
            />
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Escalation Rules
            </h3>

            {!policy.escalationRules || policy.escalationRules.length === 0 ? (
              <div className="py-8 px-6 bg-blue-50 border border-dashed border-blue-200 rounded-xl text-center text-sm font-medium text-slate-500">
                No escalation rules defined for this policy.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-sm">
                <table className="w-full text-left bg-white">
                  <thead>
                    <tr className="bg-slate-50 border-b border-blue-100">
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                        Level
                      </th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                        Escalate After
                      </th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                        Escalate To
                      </th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                        Increase Priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {policy.escalationRules.map((rule, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="px-5 py-4 text-sm font-bold">
                          LVL {rule.level ?? '-'}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {rule.after?.value ?? rule.afterValue ?? '-'}{' '}
                          {rule.after?.unit ?? rule.afterUnit ?? ''}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-blue-700">
                          {rule.escalateTo || '-'}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {rule.increasePriority ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
    <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
    <div className="text-base font-semibold text-slate-900 mt-2">{value}</div>
  </div>
);

export default SLAViewPage;