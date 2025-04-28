from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from helpers.resume_parser import extract_resume_details
from helpers.jd_parser import extract_job_description_features
from helpers.embedding_matcher import calculate_text_similarity
from helpers.score_calculations import calculate_ats_score
from helpers.utils import fetch_resume_pdf

app = FastAPI()

def clean_list(data):
    if isinstance(data, list):
        return ', '.join(data)
    return data if data else "N/A"

def clean_text(text):
    if text:
        return text.replace('\n', ' ').strip()
    return "N/A"

# Request model
class ResumeRequest(BaseModel):
    job_description: str
    resume_url: str

# Endpoint
@app.post("/generate-report")
def generate_report(request: ResumeRequest):
    try:
        # 1. Fetch Resume Text
        resume_text = fetch_resume_pdf(request.resume_url)

        # 2. Parse Resume
        resume_details = extract_resume_details(resume_text)

        # 3. Parse JD
        jd_keywords = extract_job_description_features(request.job_description)
        resume_keywords = resume_details.get('Skills', [])

        # 4. JD Match Score
        jd_match_score = calculate_text_similarity(request.job_description, resume_text)

        # 5. Keyword Match %
        if jd_keywords:
            keyword_matches = len(set(jd_keywords).intersection(set(resume_keywords)))
            keyword_match_percentage = (keyword_matches / len(jd_keywords)) * 100
        else:
            keyword_match_percentage = 0

        # 6. ATS Score
        ats_score = calculate_ats_score(jd_match_score, keyword_match_percentage)

        # 7. Final Report
        report = {
        'jd_score': int(round(jd_match_score)),
        'keyword_match': int(round(keyword_match_percentage)),
        'ats_score': int(round(ats_score)),
        'name': resume_details.get('Name', 'N/A'),
        'email': resume_details.get('Email', 'N/A'),
        'phone': resume_details.get('Phone', 'N/A'),
        'skills': clean_list(resume_details.get('Skills')),
        'experience': clean_text(resume_details.get('Experience')),
        'education': clean_text(resume_details.get('Education')),
        'certifications': clean_text(resume_details.get('Certifications'))
    }

        return {"status": "success", "report": report}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
