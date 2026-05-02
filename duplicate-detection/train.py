import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os

# Load data
df = pd.read_csv('data/tickets.csv')
df['processed_text'] = df['Description'].str.lower().str.strip()

# Load model
model = SentenceTransformer('model/ticket_model')

# Create embeddings
embeddings = model.encode(df['processed_text'].tolist(), show_progress_bar=True)

# Build FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
faiss.normalize_L2(embeddings)  # Normalize for cosine
index.add(embeddings)

# Save files
np.save('model/embeddings.npy', embeddings)
np.save('model/ticket_ids.npy', df['Ticket ID'].values)
faiss.write_index(index, 'model/faiss_index.bin')

print("Model files generated successfully!")