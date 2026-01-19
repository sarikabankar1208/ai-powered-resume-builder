import { useState } from "react";
import { supabase } from "../../supabaseClient";

function Projects({ formData, setFormData, setCurrentStep }) {
  const projects = formData.projects || [];

  // ✅ Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(""); // success | error

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...projects, { title: "", description: "" }],
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;

    setFormData({ ...formData, projects: updated });
  };

  const deleteProject = (index) => {
    setFormData({
      ...formData,
      projects: projects.filter((_, i) => i !== index),
    });
  };

  // ✅ SAVE PROJECTS TO DATABASE
  const saveProjects = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      const user = data.user;

      const { error } = await supabase
      .from("resumes")
      .upsert(
        {
          user_id: user.id,
          projects: projects,
          updated_at: new Date(),
        },
        {
          onConflict: "user_id",
        }
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

  return (
    <>
      {/* ---------- TOP BAR ---------- */}
      <div className="form-toolbar">
        <div className="toolbar-spacer" />

        <button className="next-btn" onClick={() => setCurrentStep(4)}>
          ← Previous
        </button>

        <button className="next-btn" onClick={() => setCurrentStep(6)}>
          → Next
        </button>
      </div>

      {/* ---------- HEADER ---------- */}
      <div className="experience-header">
        <div>
          <h2>Projects</h2>
          <p className="tip-text">Add projects you have worked on</p>
        </div>

        <button className="add-exp-btn" onClick={addProject}>
          + Add Project
        </button>
      </div>

      {/* ---------- PROJECT LIST ---------- */}
      {projects.map((project, index) => (
        <div key={index} className="experience-card">
          <div className="experience-card-header">
            <strong>Project {index + 1}</strong>
            <button
              className="delete-exp-btn"
              onClick={() => deleteProject(index)}
            >
              🗑️
            </button>
          </div>

          <div className="form-group">
            <input
              placeholder="Project Title"
              value={project.title}
              onChange={(e) =>
                updateProject(index, "title", e.target.value)
              }
            />

            <textarea
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      {/* ---------- EMPTY STATE ---------- */}
      {projects.length === 0 && (
        <div className="experience-empty">
          <div className="experience-icon">📁</div>
          <p className="empty-title">No projects added yet.</p>
          <p className="empty-sub">Click "Add Project" to get started.</p>
        </div>
      )}

      <button className="save-btn" onClick={saveProjects}>
        Save Changes
      </button>

      {/* ✅ TOAST */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastType === "success"
            ? "✅ Projects saved successfully"
            : "❌ Failed to save projects"}
        </div>
      )}
    </>
  );
}

export default Projects;
