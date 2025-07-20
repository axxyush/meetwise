// EditMeetingModal.js
import React, { useState, useEffect } from "react";

function EditMeetingModal({
  meetingId,
  initialTitle,
  initialDescription,
  initialTranscription,
  segments,
  onSave,
}) {
  const [description, setDescription] = useState(initialDescription || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [transcription, setTranscription] = useState(
    initialTranscription || ""
  );
  const [speakerNames, setSpeakerNames] = useState({});
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    const unique = Array.from(new Set(segments.map((s) => s.speaker)));
    const map = {};
    unique.forEach((sp) => {
      map[sp] = sp;
    });
    setSpeakerNames(map);
  }, [segments]);

  const handleSpeakerChange = (orig, newName) => {
    setSpeakerNames((prev) => ({ ...prev, [orig]: newName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE_URL}/meeting/${meetingId}`, // you need to implement a PUT /meeting/{id} on the backend
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description,
            title,
            transcript: transcription,
            speakerNames,
          }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      onSave(updated);
      // hide modal
      const modalEl = document.getElementById("editModal");
      const bsModal = window.bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();
    } catch (err) {
      console.error("Error updating meeting:", err);
      alert("Failed to save changes");
    }
  };

  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex={-1}
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-70vh bg-dark">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title" id="editModalLabel">
              Edit Meeting
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body bg-dark text-white">
              <div className="mb-3">
                <label className="form-label text-white">Title</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Transcription</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Speaker Names</label>
                {Object.entries(speakerNames).map(([orig, name]) => (
                  <div key={orig} className="input-group mb-2">
                    <span className="input-group-text bg-secondary text-white">
                      {orig}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) =>
                        handleSpeakerChange(orig, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer bg-dark">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditMeetingModal;
