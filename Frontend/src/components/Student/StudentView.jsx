import { useState, useEffect } from 'react';
import api from '../../services/api';
import AnnouncementList from './AnnouncementList';

export default function StudentView() {
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [itNumber, setItNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    localStorage.setItem("studentNotif", "false");
    window.dispatchEvent(new Event("notifUpdate"));
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await api.get('/announcements');
      setAnnouncements(res1.data);
      const res2 = await api.get('/messages');
      setMessages(res2.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (itNumber.length !== 10) {
      setError("Invalid IT Number (must be 10 characters)");
      return;
    }
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setError('');

    try {
      await api.post('/messages', {
        sender: itNumber,
        content: message
      });

      localStorage.setItem("adminNotif", "true");
      window.dispatchEvent(new Event("notifUpdate"));

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#111827' }}>Announcements</h1>

      <AnnouncementList announcements={announcements} />

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#111827' }}>Messages & Replies</h2>

       {messages.length === 0 ? (
         <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>No messages yet.</p>
       ) : (
         messages.map((msg) => (
           <div
             key={msg.id}
             style={{
               border: '2px solid #d1d5db', // thicker border
               padding: '15px',
               marginTop: '15px',
               borderRadius: '10px',
               backgroundColor: '#ffffff',
               boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
               transition: 'transform 0.2s, box-shadow 0.2s',
               cursor: 'default'
             }}
             onMouseEnter={e => {
               e.currentTarget.style.transform = 'translateY(-2px)';
               e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
             }}
             onMouseLeave={e => {
               e.currentTarget.style.transform = 'translateY(0)';
               e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
             }}
           >
             <p><b>IT Number:</b> {msg.sender}</p>
             <p><b>Message:</b> {msg.content}</p>
             <p><b>Admin Reply:</b> {msg.reply ? msg.reply : <i>No reply yet</i>}</p>
           </div>
         ))
       )}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#ffffff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          width: '400px',
          transition: 'box-shadow 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'}
        >
          <h3 style={{ marginBottom: '15px', color: '#111827' }}>Send Message to Admin</h3>

          <input
            type="text"
            placeholder="Enter your IT Number"
            value={itNumber}
            maxLength={10}
            onChange={(e) => setItNumber(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#10b981'}
            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
          />

          {error && (
            <p style={{
              color: '#b91c1c',
              background: '#fef2f2',
              padding: '8px',
              borderRadius: '6px',
              fontWeight: '600',
              marginBottom: '10px',
              textAlign: 'center',
              animation: 'fadeIn 0.4s ease'
            }}>{error}</p>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.3s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#10b981'}
            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
          />

          <button
            onClick={handleSend}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'}}
            onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'}}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}