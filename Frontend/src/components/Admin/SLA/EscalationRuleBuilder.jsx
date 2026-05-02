import React from 'react';

const EscalationRuleBuilder = ({ rules = [], onChange }) => {
  const handleAddRule = () => {
    const newRule = {
      level: rules.length + 1,
      after: { value: 1, unit: 'hours' },
      escalateTo: 'TEAM_LEAD',
      increasePriority: false,
    };
    onChange([...(rules || []), newRule]);
  };

  const handleRemoveRule = (index) => {
    const updated = (rules || []).filter((_, i) => i !== index);
    const leveled = updated.map((r, i) => ({ ...r, level: i + 1 }));
    onChange(leveled);
  };

  const handleUpdateRule = (index, field, value) => {
    const updated = [...(rules || [])];

    if (!updated[index]) return;

    if (field === 'afterValue') {
      updated[index].after = {
        ...(updated[index].after || {}),
        value: Number(value),
      };
    } else if (field === 'afterUnit') {
      updated[index].after = {
        ...(updated[index].after || {}),
        unit: value,
      };
    } else {
      updated[index][field] = value;
    }

    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Escalation Rules</h3>
        <button
          type="button"
          className="sfs-btn-secondary text-xs"
          onClick={handleAddRule}
        >
          + Add Rule
        </button>
      </div>

      {(rules || []).length === 0 && (
        <div className="py-8 px-6 border border-dashed border-sfs-blue/20 rounded-xl bg-sfs-blue/5 text-center text-sm font-medium text-slate-500">
          No escalation rules defined. This policy won't auto-escalate. (Optional)
        </div>
      )}

      <div className="space-y-4">
        {(rules || []).map((rule, idx) => (
          <div
            key={idx}
            className="relative flex flex-col xl:flex-row items-start xl:items-center gap-4 bg-white border border-slate-200 border-l-4 border-l-sfs-blue p-5 rounded-xl shadow-card transition-all"
          >
            <div className="shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg bg-sfs-blue/10 border border-sfs-blue/20 font-bold text-[11px] uppercase tracking-widest text-sfs-blue w-16">
              LVL {rule?.level ?? idx + 1}
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
              <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                Escalate after
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  className="w-20 bg-slate-50 border hover:border-sfs-blue/40 border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-sfs-blue focus:ring-4 focus:ring-sfs-blue/10 transition-all"
                  value={rule?.after?.value ?? 1}
                  onChange={(e) => handleUpdateRule(idx, 'afterValue', e.target.value)}
                  min="1"
                />

                <div className="relative group w-32">
                  <select
                    className="w-full appearance-none bg-slate-50 border hover:border-sfs-blue/40 border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-sfs-blue focus:ring-4 focus:ring-sfs-blue/10 transition-all cursor-pointer"
                    value={rule?.after?.unit ?? 'hours'}
                    onChange={(e) => handleUpdateRule(idx, 'afterUnit', e.target.value)}
                  >
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sfs-blue text-[10px]">
                    v
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium text-slate-600 mx-1">To</span>

              <div className="relative group w-full sm:w-48">
                <select
                  className="w-full appearance-none bg-slate-50 border hover:border-sfs-blue/40 border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-sfs-blue focus:ring-4 focus:ring-sfs-blue/10 transition-all cursor-pointer"
                  value={rule?.escalateTo ?? 'TEAM_LEAD'}
                  onChange={(e) => handleUpdateRule(idx, 'escalateTo', e.target.value)}
                >
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sfs-blue text-[10px]">
                  v
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer ml-auto w-full sm:w-auto mt-2 sm:mt-0 group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-sfs-blue focus:ring-sfs-blue/50 group-hover:border-sfs-blue transition-colors"
                  checked={rule?.increasePriority ?? false}
                  onChange={(e) => handleUpdateRule(idx, 'increasePriority', e.target.checked)}
                />
                <span className="text-sm text-slate-700 font-semibold group-hover:text-sfs-blue transition-colors">
                  Increase Priority
                </span>
              </label>
            </div>

            <button
              type="button"
              className="absolute top-4 right-4 xl:static xl:ml-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest text-red-500 bg-transparent hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              onClick={() => handleRemoveRule(idx)}
            >
              <span className="xl:hidden">x</span>
              <span className="hidden xl:inline">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EscalationRuleBuilder;
