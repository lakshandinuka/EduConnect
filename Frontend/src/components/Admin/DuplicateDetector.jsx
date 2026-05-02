import React, { useState } from 'react';
import { Search, Wand2 } from 'lucide-react';
import api from '../../services/api';

const normalizeDuplicate = (duplicate) => ({
  ticketId: duplicate.ticketId ?? duplicate.ticket_id ?? '',
  similarity: Number(duplicate.similarity ?? 0),
  text: duplicate.text ?? '',
  existingResponse: duplicate.existingResponse ?? duplicate.existing_response ?? '',
});

const DuplicateDetector = ({ ticketText, onSelectResponse }) => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const hasTicketText = Boolean(ticketText?.trim());

  const handleSearch = async () => {
    if (!hasTicketText || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/admin/detect-duplicates', { ticketText });
      const similarTickets = Array.isArray(res.data?.similarTickets)
        ? res.data.similarTickets
        : [];

      setDuplicates(similarTickets.map(normalizeDuplicate));
      setHasSearched(true);
    } catch (err) {
      console.error('Failed to fetch similar tickets', err);
      setError('Failed to fetch similar tickets.');
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-sfs-ink">
            Similar Tickets & Prior Responses
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Find previously resolved tickets matching this inquiry.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !hasTicketText}
          className="sfs-btn-secondary shrink-0 gap-2 px-3 py-1.5 text-xs"
          title={!hasTicketText ? 'Ticket description is empty' : 'Find similar tickets'}
        >
          <Search size={14} aria-hidden="true" />
          {loading ? 'Searching...' : 'Find Similar'}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      {!hasTicketText && (
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Duplicate detection needs a ticket description.
        </p>
      )}

      {hasSearched && duplicates.length === 0 && !loading && !error && (
        <p className="mt-3 text-xs font-semibold text-slate-500">
          No similar tickets found.
        </p>
      )}

      {duplicates.length > 0 && (
        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
          {duplicates.map((duplicate, index) => {
            const matchPercent = Number.isFinite(duplicate.similarity)
              ? Math.max(0, Math.min(100, duplicate.similarity * 100))
              : 0;

            return (
              <article
                key={duplicate.ticketId || `${duplicate.text}-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-sfs-blue">
                    Ticket #{duplicate.ticketId || 'Unknown'}
                  </span>

                  <span className="sfs-status bg-sfs-blue/10 text-sfs-blue">
                    Match: {matchPercent.toFixed(1)}%
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs italic leading-relaxed text-slate-600">
                  "{duplicate.text || 'No ticket text available.'}"
                </p>

                {duplicate.existingResponse ? (
                  <div className="mt-3 rounded-lg border border-sfs-blue/10 bg-sfs-blue/5 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sfs-blue">
                      <Wand2 size={14} aria-hidden="true" />
                      Previous Admin Response
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {duplicate.existingResponse}
                    </p>

                    <button
                      type="button"
                      onClick={() => onSelectResponse(duplicate.existingResponse)}
                      className="sfs-btn-primary mt-3 px-3 py-1.5 text-xs"
                    >
                      Use This Response
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs font-semibold text-slate-400">
                    No saved response for this ticket.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DuplicateDetector;
