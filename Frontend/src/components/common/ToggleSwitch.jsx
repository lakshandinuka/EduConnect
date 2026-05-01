import React from 'react';

/**
 * Toggle style 5 (compact pill)
 * - aria-compliant (role=switch)
 * - label text changes (Preview/Edit)
 */
export default function ToggleSwitch({
  checked,
  onChange,
  onLabel = 'Edit',
  offLabel = 'Preview',
  disabled = false,
  id,
}) {
  const label = checked ? onLabel : offLabel;

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={[
        'group inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-semibold transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        checked ? 'border-sfs-blue/30 bg-sfs-blue/10 text-sfs-blue' : 'border-slate-200 bg-white text-slate-700',
      ].join(' ')}
    >
      <span
        className={[
          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
          checked ? 'bg-sfs-blue' : 'bg-slate-300',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-4' : 'translate-x-1',
          ].join(' ')}
        />
      </span>
      <span className="min-w-[3.5rem] text-left">{label}</span>
    </button>
  );
}
