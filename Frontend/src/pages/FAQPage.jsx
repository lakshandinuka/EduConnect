import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import KbLayout from '../components/kb/KbLayout';
import { getFaqs } from '../services/faqService';
import { useToast, ToastContainer } from '../components/common/Toast';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchParams] = useSearchParams();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await getFaqs();
        const items = Array.isArray(data) ? data : data?.items || [];
        setFaqs(items.filter((f) => (f.status || 'PUBLISHED') === 'PUBLISHED'));
      } catch {
        showToast('Failed to load FAQs', 'error');
      }
    })();
  }, []);

  useEffect(() => {
    const faqId = Number(searchParams.get('faqId'));
    if (!faqId || faqs.length === 0) return;

    setOpenId(faqId);
    window.requestAnimationFrame(() => {
      document.getElementById(`faq-${faqId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });
  }, [faqs, searchParams]);

  return (
    <KbLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions."
      showSearch={false}
    >
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <motion.div
              key={faq.id}
              id={`faq-${faq.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                <div>
                  <div className="font-semibold text-sfs-ink">{faq.question}</div>
                  <div className="mt-1 text-xs text-slate-500">{faq.category || 'General'}</div>
                </div>
                <div className="mt-0.5 text-slate-500" aria-hidden>
                  {isOpen ? '−' : '+'}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-slate-700">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          );
        })}

        {faqs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No FAQs available yet.
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </KbLayout>
  );
}
