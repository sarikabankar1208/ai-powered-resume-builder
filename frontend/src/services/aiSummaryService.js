// src/services/aiSummaryService.js
export const generateSummary = async (prompt) => {
  const response = await fetch("http://127.0.0.1:5000/api/optimize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume: prompt,
    }),
  });

  return await response.json();
};
