import React from 'react';
import { Link } from 'react-router-dom';
import SLAStatusBadge from './SLAStatusBadge';

const SLATable = ({ policies = [], onDelete }) => {
  if (!Array.isArray(policies) || policies.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-card">
        <div className="flex flex-col items-center justify-center py-24 px-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-sfs-blue/10 text-sfs-blue flex items-center justify-center mb-2 text-sm font-bold uppercase">
            SLA
          </div>
          <p className="text-slate-800 font-bold text-lg">No SLA policies found</p>
          <p className="text-slate-500 text-sm max-w-sm text-center">
            There are currently no SLA policies matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {[
                'Policy Name',
                'Department',
                'Priority',
                'Response Time',
                'Resolution Time',
                'Escalations',
                'Status',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {policies.map((policy, index) => (
              <tr
                key={policy?.id || index}
                className="border-b border-slate-100 hover:bg-sfs-blue/5 transition-colors duration-200"
              >
                <td className="px-5 py-4 font-semibold text-slate-900 text-sm whitespace-nowrap">
                  {policy?.name || '-'}
                </td>

                <td className="px-5 py-4 text-slate-600 text-sm">
                  {policy?.department || '-'}
                </td>

                <td className="px-5 py-4">
                  <SLAStatusBadge type="priority" value={policy?.priority || 'UNKNOWN'} />
                </td>

                <td className="px-5 py-4 text-slate-600 text-sm">
                  {policy?.responseTime?.value ?? '-'} {policy?.responseTime?.unit ?? ''}
                </td>

                <td className="px-5 py-4 text-slate-600 text-sm">
                  {policy?.resolutionTime?.value ?? '-'} {policy?.resolutionTime?.unit ?? ''}
                </td>

                <td className="px-5 py-4 text-slate-900 font-semibold text-sm text-center">
                  {policy?.escalationRules?.length || 0}
                </td>

                <td className="px-5 py-4">
                  <SLAStatusBadge type="status" value={policy?.status || 'UNKNOWN'} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/sla/${policy?.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sfs-blue bg-sfs-blue/10 border border-sfs-blue/20 hover:bg-sfs-blue hover:text-white transition-all"
                    >
                      View
                    </Link>

                    <Link
                      to={`/admin/sla/${policy?.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-700 transition-all"
                      onClick={() => {
                        if (
                          policy?.id &&
                          window.confirm('Are you sure you want to delete this SLA policy?')
                        ) {
                          onDelete(policy.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SLATable;
