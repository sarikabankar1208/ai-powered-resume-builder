import { useState } from "react";

function CreateResumeModal({ onCancel, onCreate }) {
  const [title, setTitle] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Create New Resume</h3>
        <p>Add a title for your new resume</p>

        <input
          type="text"
          placeholder="Ex. Full Stack Resume"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>

          <button
            className="create-btn"
            disabled={!title.trim()}
            onClick={() => onCreate(title.trim())}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateResumeModal;

