import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';

export default function AdminShell({ children, title }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sfs-mist text-sfs-ink">
      <Navbar />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-lg border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Preview
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => setPreviewOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                aria-expanded={previewOpen}
              >
                <span>Preview</span>
                <span aria-hidden className="text-slate-400">{previewOpen ? '^' : '>'}</span>
              </button>

              {previewOpen && (
                <div className="mt-1 grid gap-1 pl-2">
                  <Link
                    to="/kb"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                  >
                    Knowledge Hub
                  </Link>
                  <Link
                    to="/kb/faq"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {title && <h1 className="mb-4 text-2xl font-extrabold text-sfs-ink">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}
