# from fastapi import FastAPI, Request
# import requests
# import fitz  # PyMuPDF
# import spacy
# import re
# from sentence_transformers import SentenceTransformer, util
# import openai
# import os
# from dotenv import load_dotenv

# # Initialize FastAPI app
# app = FastAPI()

# # Load spaCy model
# nlp = spacy.load('en_core_web_sm')

# # Load SentenceTransformer model
# embedder = SentenceTransformer('all-MiniLM-L6-v2')

# # Set OpenAI API Key
# openai.api_key = os.getenv('OPENAI_API_KEY')  # Make sure this is set in your environment

# # -------- Utility Functions --------

# def extract_text_from_pdf_url(url):
#     response = requests.get(url, timeout=10)
#     response.raise_for_status()  # Will raise error if bad link
#     pdf_bytes = response.content
#     doc = fitz.open(stream=pdf_bytes, filetype="pdf")
#     text = ""
#     for page in doc:
#         text += page.get_text()
#     return text

# def parse_resume(text):
#     parsed = {}
#     doc = nlp(text)

#     # Name extraction (first PERSON entity)
#     names = [ent.text for ent in doc.ents if ent.label_ == 'PERSON']
#     parsed['name'] = names[0] if names else None

#     # Email
#     email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
#     parsed['email'] = email_match.group(0) if email_match else None

#     # Phone
#     phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
#     parsed['phone'] = phone_match.group(0) if phone_match else None

#     # Skills - simple hardcoded skill match
#     skills_list = ['Python', 'JavaScript', 'AWS', 'Docker', 'Machine Learning', 'SQL', 'Node.js']
#     parsed['skills'] = [skill for skill in skills_list if skill.lower() in text.lower()]

#     # Education
#     education_keywords = ['Bachelor', 'Master', 'B.Sc', 'M.Sc', 'PhD']
#     parsed['education'] = next((line for line in text.split('\n') if any(keyword in line for keyword in education_keywords)), None)

#     # Certifications
#     certifications_keywords = ['AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'Certified Kubernetes']
#     parsed['certifications'] = [cert for cert in certifications_keywords if cert in text]

#     # Experience (simple detection)
#     exp_match = re.search(r'(\d+)\+?\s*(years|yrs)', text, re.IGNORECASE)
#     parsed['experience'] = exp_match.group(0) if exp_match else "Not mentioned"

#     return parsed

# def calculate_jd_match(resume_text, jd_text):
#     embeddings = embedder.encode([resume_text, jd_text], convert_to_tensor=True)
#     cosine_sim = util.pytorch_cos_sim(embeddings[0], embeddings[1])
#     return round(float(cosine_sim) * 100, 2)  # Percentage

# def calculate_ats_score(text):
#     score = 100
#     if any(ext in text for ext in ['.png', '.jpg', '.jpeg']):
#         score -= 20  # Bad: images in resume
#     if 'Skills' not in text:
#         score -= 20  # Missing section
#     if len(text) > 8000:  # Arbitrary large text
#         score -= 10
#     return max(score, 0)

# def calculate_resume_length_score(text):
#     word_count = len(text.split())
#     if word_count < 300:
#         return 50
#     elif word_count > 1200:
#         return 60
#     else:
#         return 90

# def calculate_keyword_match(resume_text, jd_text):
#     jd_keywords = set(jd_text.lower().split())
#     resume_words = set(resume_text.lower().split())
#     match = jd_keywords.intersection(resume_words)
#     return round((len(match) / len(jd_keywords)) * 100, 2)

# def ask_chatgpt_feedback(resume_text, jd_text):
#     prompt = f"""
# You are a career consultant. Given this resume and job description, provide feedback on how the resume can be improved to match the job description better.

# Resume:
# {resume_text}

# Job Description:
# {jd_text}

# Feedback:
# """
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "user", "content": prompt}]
#     )
#     return response['choices'][0]['message']['content']

# # -------- API Endpoint --------

# @app.post("/analyze")
# async def analyze_resume(request: Request):
#     try:
#         data = await request.json()
#         jd_text = data['jobDescription']
#         pdf_link = data['pdfLink']

#         # 1. Extract text directly from PDF URL
#         resume_text = extract_text_from_pdf_url(pdf_link)

#         # 2. Parse Resume Fields
#         parsed_data = parse_resume(resume_text)

#         # 3. Calculate Scores
#         jd_match_score = calculate_jd_match(resume_text, jd_text)
#         ats_score = calculate_ats_score(resume_text)
#         resume_length_score = calculate_resume_length_score(resume_text)
#         keyword_match_percent = calculate_keyword_match(resume_text, jd_text)
#         custom_ai_feedback = ask_chatgpt_feedback(resume_text, jd_text)

#         # 4. Create Final Result
#         result = {
#             **parsed_data,
#             "scores": {
#                 "jd_match_score": jd_match_score,
#                 "ats_compatibility_score": ats_score,
#                 "resume_length_score": resume_length_score,
#                 "keyword_match_percent": keyword_match_percent,
#                 "custom_ai_feedback": custom_ai_feedback
#             }
#         }
#         return result
    
#     except Exception as e:
#         return {"error": str(e)}

from flask import Flask, request
import requests
from PyPDF2 import PdfReader
import io

app = Flask(__name__)

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    data = request.get_json()
    pdf_url = data.get('url')

    if not pdf_url:
        return {"error": "No URL provided"}, 400

    try:
        # Step 1: Stream PDF from URL
        response = requests.get(pdf_url)
        response.raise_for_status()

        # Step 2: Read PDF from memory
        pdf_file = io.BytesIO(response.content)
        reader = PdfReader(pdf_file)

        # Step 3: Extract text
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        # Step 4: (You can now parse name, email, phone, etc. from `text`)
        # For demo, I send dummy data
        extracted_data = {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "phone": "1234567890",
            "skills": ["Python", "Node.js", "SQL"],
            "experience": [],
            "education": [],
            "certifications": []
        }

        return extracted_data

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)
