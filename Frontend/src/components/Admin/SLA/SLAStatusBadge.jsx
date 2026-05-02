import React from 'react';

const priorityClasses = {
  low: 'bg-slate-50 text-slate-600 border border-slate-200',
  medium: 'bg-sfs-blue/10 text-sfs-blue border border-sfs-blue/20',
  high: 'bg-orange-50 text-orange-700 border border-orange-200',
  critical: 'bg-red-50 text-red-700 border border-red-200 font-bold',
};

const SLAStatusBadge = ({ type, value }) => {
  if (type === 'status') {
    const normalizedValue = value || 'INACTIVE';
    const isActive = normalizedValue === 'ACTIVE';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              : 'bg-slate-400'
          }`}
        />
        {normalizedValue}
      </span>
    );
  }

  if (type === 'priority') {
    const normalizedValue = value || 'Low';
    const cls =
      priorityClasses[normalizedValue.toLowerCase()] ||
      priorityClasses.low;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${cls}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {normalizedValue}
      </span>
    );
  }

  return null;
};

export default SLAStatusBadge;
