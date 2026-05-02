import { useEffect, useState } from 'react';
import api from '../../services/api';
import AnnouncementList from './AnnouncementList';

export default function StudentView() {
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [itNumber, setItNumber] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [announcementsRes, messagesRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/messages')
      ]);
      setAnnouncements(announcementsRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.setItem('studentNotif', 'false');
    window.dispatchEvent(new Event('notifUpdate'));
  }, []);

  const handleSend = async () => {
    if (itNumber.length !== 10) {
      setError('Invalid IT Number. It must be 10 characters.');
      return;
    }
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }
    setError('');

    try {
      await api.post('/messages', {
        sender: itNumber,
        content: message
      });

      localStorage.setItem('adminNotif', 'true');
      window.dispatchEvent(new Event('notifUpdate'));
      alert('Message sent!');
      setMessage('');
      setItNumber('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="sfs-page-title">Announcements</h1>
        <p className="sfs-muted mt-1">Read current notices and send messages to the admin team.</p>
      </div>

      <AnnouncementList announcements={announcements} />

      <section className="sfs-panel-pad">
        <h2 className="text-xl font-extrabold text-sfs-ink">Messages & Replies</h2>

        {messages.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No messages yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold text-sfs-ink">IT Number:</span> {msg.sender}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-bold text-sfs-ink">Message:</span> {msg.content}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-bold text-sfs-ink">Admin Reply:</span>{' '}
                  {msg.reply ? msg.reply : <span className="italic text-slate-500">No reply yet</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sfs-panel-pad mx-auto max-w-xl">
        <h2 className="text-xl font-extrabold text-sfs-ink">Send Message to Admin</h2>
        <div className="mt-5 space-y-4">
          <label>
            <span className="sfs-label">IT Number</span>
            <input
              type="text"
              placeholder="Enter your IT Number"
              value={itNumber}
              maxLength={10}
              onChange={(e) => setItNumber(e.target.value)}
              className="sfs-input"
            />
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <label>
            <span className="sfs-label">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="sfs-textarea"
            />
          </label>

          <button type="button" onClick={handleSend} className="sfs-btn-primary w-full">
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
