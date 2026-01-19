import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import CreateResumeModal from "../components/CreateResumeModal";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    const { data } = await supabase
      .from("resumes")
      .select("id, personal_info, updated_at")
      .eq("user_id", auth.user.id)
      .order("updated_at", { ascending: false });

    setResumes(data || []);
  };

  /* 🔹 CREATE RESUME (MODAL FLOW) */
  const handleCreate = () => {
    setShowModal(false);
    navigate("/resume-builder");
  };

  /* 🔹 DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    await supabase.from("resumes").delete().eq("id", id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  /* 🔹 EDIT */
  const handleEdit = (id) => {
    if (!window.confirm("Do you want to update this resume?")) return;
    navigate(`/resume-builder?resumeId=${id}`);
  };

  return (
    <div className="dashboard-container">
      <p className="dashboard-title">
        You can now build and optimize your resume.
      </p>

      {/* CREATE RESUME */}
      <div className="dashboard-actions">
        <div
          className="dashboard-card"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
        >
          <span>+</span>
          <p>Create Resume</p>
        </div>
      </div>

      {/* RESUME LIST */}
      <div className="resume-list">
        {resumes.map((resume) => (
          <div key={resume.id} className="resume-card-ui">
            <div className="resume-card-actions">
              <button onClick={() => handleDelete(resume.id)}>🗑</button>
              <button onClick={() => handleEdit(resume.id)}>✏️</button>
            </div>

            <div className="resume-icon">📄</div>

            <p className="resume-title">
              {resume.personal_info?.fullName || "Untitled Resume"}
            </p>

            <p className="resume-date">
              Updated {new Date(resume.updated_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* CREATE RESUME MODAL */}
      {showModal && (
        <CreateResumeModal
          onCancel={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

export default Dashboard;

