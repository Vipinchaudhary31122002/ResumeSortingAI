import requests
import fitz

def fetch_resume_pdf(resume_url):
    response = requests.get(resume_url)
    if response.status_code == 200:
        pdf_stream = response.content
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        resume_text = ""
        for page in doc:
            resume_text += page.get_text()
        return resume_text
    else:
        raise Exception(f"Failed to fetch resume PDF. Status code: {response.status_code}")
