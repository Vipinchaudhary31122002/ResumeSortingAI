from sentence_transformers import SentenceTransformer

def load_sentence_model():
    return SentenceTransformer('all-MiniLM-L6-v2')  # Small fast model
