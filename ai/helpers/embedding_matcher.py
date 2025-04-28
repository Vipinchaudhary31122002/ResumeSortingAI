from models.sentence_model import load_sentence_model
from sklearn.metrics.pairwise import cosine_similarity

model = load_sentence_model()

def calculate_text_similarity(jd_text, resume_text):
    embeddings = model.encode([jd_text, resume_text])
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return similarity * 100  # out of 100
