from flask import Blueprint, request, jsonify
import os

# Create Blueprint
ai_bp = Blueprint("ai_bp", __name__)

# Configure Gemini
genai.configure(api_key=os.getenv("gemini_resume_builder_api_key"))

# Load only the required model (no listing)
model = genai.GenerativeModel("gemini-2.5-flash")


@ai_bp.route("/generate-summary", methods=["POST"])
def generate_summary():
    data = request.json

    years = data.get("years", 0)
    experience_level = data.get("experienceLevel", "Junior")
    skills = ", ".join(data.get("skills", [])) or "Not specified"
    rough_summary = data.get("roughSummary", "")

    prompt = f"""
You are a professional resume writer.

Rewrite and expand the following short resume summary into a polished,
professional, recruiter-attractive, and ATS-friendly summary.

Candidate details:
- Experience: {years} years ({experience_level})
- Skills: {skills}

User’s rough summary:
"{rough_summary}"

Guidelines:
- Write 3–4 professional sentences
- Improve clarity, structure, and impact
- Highlight technical expertise and real-world contribution
- Match tone to a {experience_level} software engineer
- Do NOT mention entry-level roles unless experience is below 1 year
- Avoid first-person pronouns
- Ensure uniqueness
""".strip()

    try:
        import google.generativeai as genai 
        response = model.generate_content(prompt)

        return jsonify({
            "status": "success",
            "optimized_resume": response.text.strip()
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
