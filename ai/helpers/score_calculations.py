def calculate_ats_score(jd_match_score, keyword_match_percentage):
    """
    Custom ATS Scoring:
    - 60% weight to JD matching (embedding similarity)
    - 40% weight to keyword match %
    """
    ats_score = (0.6 * jd_match_score) + (0.4 * keyword_match_percentage)
    return ats_score
