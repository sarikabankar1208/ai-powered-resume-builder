import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { generateSummary } from "../../services/aiSummaryService";

function ProfessionalSummary({ formData, setFormData, setCurrentStep }) {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  /* ---------------- SAVE TO DATABASE ---------------- */
  const saveProfessionalSummary = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      const { error } = await supabase.from("resumes").upsert(
        {
          user_id: data.user.id,
          professional_summary: formData.summary,
          updated_at: new Date(),
        },
        { onConflict: "user_id" }
      );

      setToastType(error ? "error" : "success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error(err);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  /* ---------------- AI GENERATE ---------------- */
  const handleAIGenerate = async () => {
  try {
    setAiLoading(true);

    const years = Number(formData.experience) || 0;

    const skills = [
      ...(formData.backendSkills || []),
      ...(formData.frontendSkills || []),
      ...(formData.cloudSkills || []),
      ...(formData.databaseSkills || [])
    ];

    const experienceLevel =
      years < 1 ? "Entry-level" :
      years < 3 ? "Junior" :
      years < 6 ? "Mid-level" :
      "Senior";

    const payload = {
      years,
      experienceLevel,
      skills,
      roughSummary: formData.summary?.trim() || ""
    };

    const response = await fetch("http://localhost:5000/api/generate-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });


    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      alert(result.message || "AI generation failed");
      return;
    }

    setFormData({
      ...formData,
      summary: result.optimized_resume
    });

  } catch (error) {
    console.error(error);
    alert("AI generation failed");
  } finally {
    setAiLoading(false);
  }
};




  return (
    <>
      {/* ---------- TOP BAR ---------- */}
      <div className="form-toolbar">
        <div className="toolbar-spacer" />
        <button className="next-btn" onClick={() => setCurrentStep(5)}>
          ← Previous
        </button>
        <button className="next-btn" disabled>
          → Next
        </button>
      </div>

      {/* ---------- HEADER ---------- */}
      <div className="summary-header">
        <div>
          <h2>Professional Summary</h2>
          <p className="tip-text">Add summary for your resume here</p>
        </div>

        <button
          className="ai-btn"
          onClick={handleAIGenerate}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "✨ Generate from AI"}
        </button>
      </div>

      {/* ---------- TEXTAREA ---------- */}
      <textarea
        className="summary-textarea"
        value={formData.summary}
        placeholder="Write a professional summary or generate it using AI"
        onChange={(e) =>
          setFormData({ ...formData, summary: e.target.value })
        }
      />

      {/* ---------- SAVE ---------- */}
      <button className="save-btn" onClick={saveProfessionalSummary}>
        Save Changes
      </button>

      {/* ---------- TOAST ---------- */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastType === "success"
            ? "✅ Professional summary saved successfully"
            : "❌ Failed to save professional summary"}
        </div>
      )}
    </>
  );
}

export default ProfessionalSummary;
