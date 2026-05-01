import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchBar = ({
  placeholder = 'Search knowledge base…',
  onSearch,
  debounceDelay = 300,
  autoNavigate = true,
  variant = 'light', // light | dark
}) => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const debounceRef = React.useRef(null);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceDelay);
    },
    [onSearch, debounceDelay]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (autoNavigate) navigate(`/kb/search?q=${encodeURIComponent(value)}`);
    onSearch?.(value);
  };

  const inputClass =
    variant === 'dark'
      ? 'bg-white/10 border-white/25 text-white placeholder-white/70 focus:ring-white/40 focus:border-white/30'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-sfs-blue focus:border-sfs-blue';

  const buttonClass =
    variant === 'dark'
      ? 'bg-white text-slate-900 hover:bg-white/90'
      : 'bg-sfs-blue text-white hover:opacity-95';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full rounded-lg px-4 py-3 text-sm border outline-none focus:ring-2 ${inputClass}`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-semibold transition ${buttonClass}`}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
