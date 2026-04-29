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
      setMessages(res.data);
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
      localStorage.setItem("studentNotif", "true");
      fetchMessages();
    } catch (err) {
      console.error('Failed to send reply', err);
      alert('Failed to send reply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await api.delete(`/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(msg => msg.id !== id)); // update UI immediately
      alert('Message deleted successfully!');
    } catch (err) {
      console.error('Failed to delete message', err);
      alert('Failed to delete the message');
    }
  };

  const cardStyle = {
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    background: '#ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const hoverEffect = e => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
  };

  const hoverOut = e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Student Messages</h2>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            style={cardStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={hoverOut}
          >
            <p><b>Student IT Number:</b> {msg.sender}</p>
            <p><b>Message:</b> {msg.content}</p>
            <p><b>Reply:</b> {msg.reply ? msg.reply : <i>No reply yet</i>}</p>

            <textarea
              placeholder="Type reply..."
              style={{
                width: '100%',
                height: '70px',
                marginTop: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                padding: '8px',
                resize: 'vertical'
              }}
              value={replyTexts[msg.id] || ''}
              onChange={(e) => setReplyTexts({ ...replyTexts, [msg.id]: e.target.value })}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => handleReply(msg.id)}
                style={{ ...buttonStyle, background: '#2563eb', color: 'white', minWidth: '120px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Send Reply
              </button>

              <button
                onClick={() => handleDelete(msg.id)}
                style={{ ...buttonStyle, background: '#ef4444', color: 'white', minWidth: '120px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}