import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewMeeting() {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "audio/wav") {
      setAudioFile(file);
      setError("");
    } else {
      setError("Please select a valid .wav audio file");
      setAudioFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Please enter a meeting title");
      return;
    }

    if (!audioFile) {
      setError("Please select an audio file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create meeting
      const createResponse = await fetch(`${API_BASE_URL}/meeting/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.detail || "Failed to create meeting");
      }

      const meetingId = createData.meeting.id;

      // Step 2: Upload audio file
      const formDataUpload = new FormData();
      formDataUpload.append("file", audioFile);

      const uploadResponse = await fetch(`${API_BASE_URL}/meeting/upload/${meetingId}`, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.detail || "Failed to upload audio");
      }

      // Redirect to meeting detail page
      navigate(`/meeting/${meetingId}`);

    } catch (error) {
      console.error("Error creating meeting:", error);
      setError(error.message || "An error occurred while creating the meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-plus me-2"></i>
                Create New Meeting
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Meeting Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter meeting description (optional)"
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="audioFile" className="form-label">
                    Audio File <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="audioFile"
                    accept=".wav"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-text">
                    Only .wav files are supported. Maximum file size: 100MB
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Meeting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Create Meeting
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMeeting; 