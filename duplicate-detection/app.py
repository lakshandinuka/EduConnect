# app.py

from flask import Flask, request, jsonify
from detector import DuplicateDetector
import sqlite3
import os

app = Flask(__name__)

# Initialize detector (loads model once)
detector = DuplicateDetector()

# Database to store admin responses (persists across calls)
DB_PATH = 'responses.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS responses
                 (ticket_id TEXT PRIMARY KEY, response_text TEXT, admin_note TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/detect', methods=['POST'])
def detect():
    """
    Expects JSON: { "ticket_text": "..." }
    Returns list of similar tickets with existing responses (if any).
    """
    data = request.get_json()
    query_text = data.get('ticket_text', '')
    if not query_text:
        return jsonify({'error': 'No text provided'}), 400
    
    similar = detector.find_similar(query_text, top_k=5)
    
    # Attach previously saved responses from the database
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for item in similar:
        c.execute("SELECT response_text FROM responses WHERE ticket_id=?", (item['ticket_id'],))
        row = c.fetchone()
        item['existing_response'] = row[0] if row else None
    conn.close()
    
    return jsonify(similar)

@app.route('/save_response', methods=['POST'])
def save_response():
    """
    Expects JSON: { "ticket_id": "...", "response_text": "...", "admin_note": "..." }
    """
    data = request.get_json()
    ticket_id = data.get('ticket_id')
    response_text = data.get('response_text')
    admin_note = data.get('admin_note', '')
    
    if not ticket_id or not response_text:
        return jsonify({'error': 'Missing ticket_id or response_text'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO responses (ticket_id, response_text, admin_note)
                 VALUES (?, ?, ?)''', (ticket_id, response_text, admin_note))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'Response saved'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)