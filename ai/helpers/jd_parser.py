import spacy

nlp = spacy.load("en_core_web_sm")

def extract_job_description_features(jd_text):
    skill_list = ['Python', 'Java', 'C++', 'Machine Learning', 'Deep Learning', 'NLP', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 'Pandas']
    extracted_skills = [skill for skill in skill_list if skill.lower() in jd_text.lower()]
    return extracted_skills
