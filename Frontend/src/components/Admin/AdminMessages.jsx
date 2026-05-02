import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error loading messages', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    try {
      await api.put(`/messages/${id}/reply`, replyTexts[id], {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' }
      });
      localStorage.setItem('studentNotif', 'true');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send reply', err);
      alert('Failed to send reply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      alert('Message deleted successfully!');
    } catch (err) {
      console.error('Failed to delete message', err);
      alert('Failed to delete the message');
    }
  };

  return (
    <section className="sfs-panel-pad">
      <h2 className="text-xl font-extrabold text-sfs-ink">Student Messages</h2>

      {messages.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          No messages yet.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {messages.map((msg) => (
            <article key={msg.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-sfs-ink">Student IT Number:</span> {msg.sender}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-bold text-sfs-ink">Message:</span> {msg.content}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-bold text-sfs-ink">Reply:</span>{' '}
                {msg.reply ? msg.reply : <span className="italic text-slate-500">No reply yet</span>}
              </p>

              <textarea
                placeholder="Type reply..."
                className="sfs-textarea mt-4"
                rows={3}
                value={replyTexts[msg.id] || ''}
                onChange={(e) => setReplyTexts({ ...replyTexts, [msg.id]: e.target.value })}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => handleReply(msg.id)} className="sfs-btn-primary">
                  Send Reply
                </button>
                <button type="button" onClick={() => handleDelete(msg.id)} className="sfs-btn-danger">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
