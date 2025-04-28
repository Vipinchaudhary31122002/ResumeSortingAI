import spacy
import re

nlp = spacy.load("en_core_web_sm")

def extract_resume_details(text):
    details = {}
    doc = nlp(text)

    # Email
    details['Email'] = next(iter(re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)), None)

    # Phone
    details['Phone'] = next(iter(re.findall(r'(\+?\d{1,3}[-.\s]??\d{2,4}[-.\s]??\d{3,4}[-.\s]??\d{3,4})', text)), None)

    # Name (First PERSON entity found)
    details['Name'] = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), None)

    # Skills
    skill_list = ['Python', 'Java', 'C++', 'Machine Learning', 'Deep Learning', 'NLP', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 'Pandas']
    details['Skills'] = [skill for skill in skill_list if skill.lower() in text.lower()]

    # Education
    if 'education' in text.lower():
        idx = text.lower().find('education')
        details['Education'] = text[idx: idx + 500]
    else:
        details['Education'] = None

    # Experience
    if 'experience' in text.lower():
        idx = text.lower().find('experience')
        details['Experience'] = text[idx: idx + 500]
    else:
        details['Experience'] = None

    return details
