// src/services/aiSummaryService.js
export const generateSummary = async (payload) => {
  const response = await fetch(
    "http://127.0.0.1:10000/api/generate-summary",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("AI generation failed");
  }

  return await response.json();
};
