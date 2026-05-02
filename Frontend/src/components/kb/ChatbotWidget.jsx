import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sendChatMessage } from '../../services/chatbotService';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_MESSAGE = 'Sorry, I can\'t help you with that. Please refer the knowledgebase for more information.';

export default function ChatbotWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!user) return null;

  const send = async () => {
    if (!inputValue.trim() || loading) return;
    const text = inputValue.trim();
    setInputValue('');
    const id = Date.now();

    setMessages((prev) => [...prev, { id, role: 'user', text }]);

    try {
      setLoading(true);
      const res = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: id + 1,
          role: 'assistant',
          text: res.response || res.answer || FALLBACK_MESSAGE,
          sources: res.sources || []
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: id + 1, role: 'assistant', text: FALLBACK_MESSAGE, sources: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full shadow-lg px-5 py-3 bg-sfs-blue hover:bg-sfs-blue text-white font-semibold"
      >
        {isOpen ? 'Close' : 'Ask HelpDesk AI'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.25 }}
            className="mt-3 w-[360px] max-w-[90vw] rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-900">SFS HelpDesk AI</div>
              <div className="text-xs text-gray-500">Answers are grounded in Knowledge Hub articles.</div>
            </div>

            <div className="h-[360px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-gray-600">
                  Ask anything like "How do I access the LMS?" or "How can I get my course certificate?"
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'inline-block rounded-2xl bg-sfs-blue text-white px-4 py-2 text-sm'
                        : 'inline-block rounded-2xl bg-gray-100 text-gray-900 px-4 py-2 text-sm'
                    }
                  >
                    {m.text}
                  </div>

                  {m.role === 'assistant' && Array.isArray(m.sources) && m.sources.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-[11px] text-gray-500 font-semibold">Sources:</div>
                      {m.sources.map((source, idx) => (
                        <Link
                          key={`${source.type || 'source'}-${source.id || idx}`}
                          to={source.url || '/kb'}
                          className="block text-xs text-sfs-blue hover:underline"
                        >
                          <span className="text-gray-500">{source.type}:</span> {source.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-gray-200 flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={send}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-sfs-blue hover:bg-sfs-blue text-white text-sm font-semibold disabled:opacity-60"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
