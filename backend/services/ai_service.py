from transformers import pipeline

# Load model ONCE when backend starts
generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

def optimize_resume(resume_text: str) -> str:
    resume_text = resume_text.strip()
    if not resume_text:
        raise ValueError("Resume text is empty")

    prompt = f"Improve this resume summary professionally:\n{resume_text}"

    result = generator(
        prompt,
        max_length=150,
        do_sample=True,
        temperature=0.7
    )

    return result[0]["generated_text"]
