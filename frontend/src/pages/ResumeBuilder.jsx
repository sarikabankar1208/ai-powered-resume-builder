import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { supabase } from "../supabaseClient";

import PersonalInfo from "../components/resume/PersonalInfo";
import ProfessionalSummary from "../components/resume/ProfessionalSummary";
import ProfessionalExperience from "../components/resume/ProfessionalExperience";
import Education from "../components/resume/Education";
import Projects from "../components/resume/Projects";
import Skills from "../components/resume/Skills";
import ResumePreview from "../components/resume/ResumePreview";

import "../styles/ResumeForm.css";
import "../styles/ResumePreview.css";

function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [activePanel, setActivePanel] = useState(null);
  const [accent, setAccent] = useState("blue");
  const [template, setTemplate] = useState("classic");

  const [showShare, setShowShare] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    linkedin: "",
    website: "",
    summary: "",
    experiences: [],
    education: [],
    projects: [],
    skills: [],
  });

  /* =========================
     🔹 FETCH RESUME ON EDIT
     ========================= */
  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();

      if (error || !data) return;

      setFormData({
        fullName: data.personal_info?.fullName || "",
        email: data.personal_info?.email || "",
        phone: data.personal_info?.phone || "",
        location: data.personal_info?.location || "",
        profession: data.personal_info?.profession || "",
        linkedin: data.personal_info?.linkedin || "",
        website: data.personal_info?.website || "",
        summary: data.professional_summary || "",
        experiences: data.experience || [],
        education: data.education || [],
        projects: data.projects || [],
        skills: data.skills || [],
      });
    };

    fetchResume();
  }, [resumeId]);

  /* =========================
     🔹 SAVE (CREATE / UPDATE)
     ========================= */
  const handleSaveResume = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      alert("User not logged in");
      return;
    }

    const payload = {
      user_id: auth.user.id,
      personal_info: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        profession: formData.profession,
        linkedin: formData.linkedin,
        website: formData.website,
      },
      professional_summary: formData.summary,
      experience: formData.experiences,
      education: formData.education,
      projects: formData.projects,
      skills: formData.skills,
      updated_at: new Date(),
    };

    let result;
    if (resumeId) {
      result = await supabase
        .from("resumes")
        .update(payload)
        .eq("id", resumeId);
    } else {
      result = await supabase.from("resumes").insert(payload);
    }

    if (result.error) {
      alert("Failed to save resume");
      return;
    }

    alert("Resume saved successfully!");
    navigate("/dashboard");
  };

  /* DOWNLOAD */
  const handleDownload = () => {
    window.print();
  };

  /* SHARE */
  const handleShare = () => setShowShare(true);

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent("Check out my resume")}`,
      "_blank"
    );
  };

  const shareEmail = () => {
    window.location.href =
      "mailto:?subject=My Resume&body=Please check my resume.";
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <div className="resume-builder-page">
      {/* PROGRESS BAR */}
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <Link to="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="resume-builder-layout">
        {/* LEFT FORM */}
        <div className="resume-form">
          {currentStep === 1 && (
            <PersonalInfo
              formData={formData}
              setFormData={setFormData}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
              accent={accent}
              setAccent={setAccent}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}

          {currentStep === 2 && (
            <Skills
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}

          {currentStep === 3 && (
            <ProfessionalExperience
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}

          {currentStep === 4 && (
            <Education
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}

          {currentStep === 5 && (
            <Projects
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}

          {currentStep === 6 && (
            <ProfessionalSummary
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              onSave={handleSaveResume}
            />
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="resume-preview-wrapper">
          <div className="resume-preview-actions">
            <button className="download-btn" onClick={handleDownload}>
              ⬇️ Download
            </button>
          </div>

          <div className="resume-preview">
            <div id="resume-preview">
              <ResumePreview
                formData={formData}
                template={template}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShare && (
        <div className="share-overlay">
          <div className="share-popup">
            <h4>Share Resume</h4>
            <button onClick={shareWhatsApp}>WhatsApp</button>
            <button onClick={shareEmail}>Email</button>
            <button onClick={copyLink}>Copy Link</button>
            <button className="close-btn" onClick={() => setShowShare(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;
