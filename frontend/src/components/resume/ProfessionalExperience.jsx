import { useState } from "react";
import { supabase } from "../../supabaseClient";

function ProfessionalExperience({
  formData,
  setFormData,
  setCurrentStep,
}) {
  const experiences = formData.experiences || [];

  // ✅ Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(""); // success | error

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...experiences,
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;

    if (field === "current" && value === true) {
      updated[index].endDate = "";
    }

    setFormData({ ...formData, experiences: updated });
  };

  const deleteExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: updated });
  };

  // ✅ SAVE TO DATABASE
  const saveExperience = async () => {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    const { error: upsertError } = await supabase
      .from("resumes")
      .upsert(
        {
          user_id: authData.user.id,
          experience: experiences,
          updated_at: new Date(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error(upsertError);
      setToastType("error");
    } else {
      setToastType("success");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

  } catch (err) {
    console.error(err);
    setToastType("error");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }
};

  return (
    <>
      {/* ---------- TOP BAR ---------- */}
      <div className="form-toolbar">
        <div className="toolbar-spacer" />

        <button className="next-btn" onClick={() => setCurrentStep(2)}>
          ← Previous
        </button>
        <button className="next-btn" onClick={() => setCurrentStep(4)}>
          → Next
        </button>
      </div>

      {/* ---------- HEADER ---------- */}
      <div className="experience-header">
        <div>
          <h2>Professional Experience</h2>
          <p className="tip-text">Add your job experience</p>
        </div>

        <button className="add-exp-btn" onClick={addExperience}>
          + Add Experience
        </button>
      </div>

      {/* ---------- EXPERIENCE FORMS ---------- */}
      {experiences.map((exp, index) => (
        <div key={index} className="experience-card">
          <div className="experience-card-header">
            <h4>Experience {index + 1}</h4>

            <button
              className="delete-exp-btn"
              onClick={() => deleteExperience(index)}
              title="Delete Experience"
            >
              🗑️
            </button>
          </div>

          <div className="experience-grid">
            <input
              className="input-text"
              placeholder="Company Name"
              value={exp.company}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
            />

            <input
              className="input-text"
              placeholder="Job Title"
              value={exp.role}
              onChange={(e) =>
                updateExperience(index, "role", e.target.value)
              }
            />

            <input
              className="input-text"
              type="month"
              value={exp.startDate}
              onChange={(e) =>
                updateExperience(index, "startDate", e.target.value)
              }
            />

            <input
              className="input-text"
              type="month"
              disabled={exp.current}
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) =>
                updateExperience(index, "endDate", e.target.value)
              }
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) =>
                updateExperience(index, "current", e.target.checked)
              }
            />
            Currently working here
          </label>

          <textarea
            className="experience-card textarea"
            placeholder="Job description"
            value={exp.description}
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
          />
        </div>
      ))}

      <button className="save-btn" onClick={saveExperience}>
        Save Changes
      </button>

      {/* ✅ TOAST */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastType === "success"
            ? "✅ Experience saved successfully"
            : "❌ Failed to save experience"}
        </div>
      )}
    </>
  );
}

export default ProfessionalExperience;
