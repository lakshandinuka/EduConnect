import React, { useState } from 'react';
import api from '../../services/api';

const DuplicateDetector = ({ ticketText, ticketId, onSelectResponse }) => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!ticketText) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/detect-duplicates', { ticketText });
      setDuplicates(res.data?.similarTickets || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to fetch similar tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Similar Tickets & Prior Responses</h3>
          <p className="text-xs text-slate-500">Find previously resolved tickets matching this inquiry.</p>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="sfs-btn-secondary text-xs px-3 py-1"
        >
          {loading ? 'Searching...' : 'Find Similar Tickets'}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      {hasSearched && duplicates.length === 0 && !loading && (
        <p className="text-slate-500 text-xs">No similar tickets found.</p>
      )}

      {duplicates.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {duplicates.map((dup) => (
            <div key={dup.ticketId} className="border border-slate-100 bg-slate-50 rounded p-3 text-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sfs-blue text-xs">Ticket #{dup.ticketId}</span>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-medium">
                  Match: {(dup.similarity * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-slate-700 text-xs italic mb-2 line-clamp-2">"{dup.text}"</p>
              
              {dup.existingResponse ? (
                <div className="mt-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded">
                  <span className="block text-xs font-bold text-indigo-800 mb-1 uppercase tracking-wider">Previous Admin Response</span>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{dup.existingResponse}</p>
                  <button
                    type="button"
                    onClick={() => onSelectResponse(dup.existingResponse)}
                    className="mt-3 text-xs bg-indigo-600 text-white font-medium px-3 py-1.5 rounded hover:bg-indigo-700 transition shadow-sm"
                  >
                    Use This Response
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-2 font-medium">No saved response for this ticket.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuplicateDetector;
