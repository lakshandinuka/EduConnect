# detector.py

import os
import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer

class DuplicateDetector:
    def __init__(self, model_path='model/ticket_model',
                 index_path='model/faiss_index.bin',
                 embeddings_path='model/embeddings.npy',
                 ticket_ids_path='model/ticket_ids.npy',
                 csv_path='data/tickets.csv'):
        
        self.model = SentenceTransformer(model_path)
        self.index = faiss.read_index(index_path)
        self.embeddings = np.load(embeddings_path)
        self.ticket_ids = np.load(ticket_ids_path)
        
        # Load original dataset to map ticket_id -> text
        self.df = pd.read_csv(csv_path)
        # Ensure same cleaning as training
        self.df['processed_text'] = self.df['Description'].str.lower().str.strip()
        self.text_map = dict(zip(self.df['Ticket ID'], self.df['processed_text']))
    
    def find_similar(self, query_text, top_k=5):
        """
        Returns list of similar tickets with similarity scores.
        """
        query_emb = self.model.encode([query_text])[0]
        query_emb = query_emb / np.linalg.norm(query_emb)
        query_emb = query_emb.reshape(1, -1).astype(np.float32)
        
        scores, indices = self.index.search(query_emb, top_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            ticket_id = str(self.ticket_ids[idx])
            results.append({
                'ticket_id': ticket_id,
                'similarity': float(score),
                'text': self.text_map.get(ticket_id, '')
            })
        return results