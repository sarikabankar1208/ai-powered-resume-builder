import { supabase } from "../../supabaseClient";
import { useState } from "react";

function PersonalInfo({
  formData,
  setFormData,
  activePanel,
  setActivePanel,
  accent,
  setAccent,
  setCurrentStep,
}) {
  const closePanel = () => setActivePanel(null);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(""); // success | error

  const savePersonalInfo = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      const user = data.user;

      const { error } = await supabase.from("resumes").upsert({
        user_id: user.id,
        personal_info: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          profession: formData.profession,
          linkedin: formData.linkedin,
          website: formData.website,
        },
        updated_at: new Date(),
        },
        {
          onConflict: "user_id",
        });

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
    <div className="personal-info-wrapper">
      {/* ---------- TOP BAR ---------- */}
      <div className="form-toolbar">

        <div className="toolbar-spacer" />

        <button
          type="button"
          className="next-btn"
          onClick={() => {
            setActivePanel(null);
            setCurrentStep(2);
          }}
        >
          → Next
        </button>
      </div>

      {/* ---------- FORM ---------- */}
      <div className="form-header">
        <h2>Personal Information</h2>
      </div>

      <p className="form-subtitle">
        Get started with your personal information
      </p>

      <div className="form-group">
        <input
          placeholder="👤 Enter your full name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        <input
          placeholder="📧 Enter your email address"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          placeholder="📞 Enter your mobile number"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />

        <input
          placeholder="📍 Enter your location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        <input
          placeholder="💼 Enter your profession"
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
        />

        <input
          placeholder="🔗 Enter your LinkedIn profile"
          value={formData.linkedin}
          onChange={(e) =>
            setFormData({ ...formData, linkedin: e.target.value })
          }
        />

        <input
          placeholder="Enter your total years of experience"
          value={formData.website}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
      </div>

      <button className="save-btn" onClick={savePersonalInfo}>
        Save Changes
      </button>

      {/* TOAST */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastType === "success"
            ? "✅ Personal information saved successfully"
            : "❌ Failed to save personal information"}
        </div>
      )}
    </div>
  );
}

export default PersonalInfo;
