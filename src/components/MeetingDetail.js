import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary"); // "summary" or "transcript"

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const fetchMeeting = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setMeeting(data.meeting);
      } else {
        setError("Failed to load meeting");
      }
    } catch (error) {
      console.error("Error fetching meeting:", error);
      setError("Failed to load meeting");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, id]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge bg-warning",
      processing: "badge bg-info",
      completed: "badge bg-success",
      failed: "badge bg-danger"
    };
    
    return (
      <span className={statusClasses[status] || "badge bg-secondary"}>
        {status}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error || "Meeting not found"}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">{meeting.title}</h2>
              <p className="text-muted mb-0">
                Created on {formatDate(meeting.createdAt)}
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              {getStatusBadge(meeting.status)}
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Info Card */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Meeting Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <strong>Title:</strong>
                </div>
                <div className="col-sm-8">{meeting.title}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <strong>Description:</strong>
                </div>
                <div className="col-sm-8">
                  {meeting.description || "No description provided"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <strong>Status:</strong>
                </div>
                <div className="col-sm-8">{getStatusBadge(meeting.status)}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <strong>Speakers:</strong>
                </div>
                <div className="col-sm-8">{meeting.speakerCount}</div>
              </div>
              {meeting.audioFileName && (
                <>
                  <hr />
                  <div className="row">
                    <div className="col-sm-4">
                      <strong>Audio File:</strong>
                    </div>
                    <div className="col-sm-8">
                      {meeting.audioFileName} ({formatFileSize(meeting.audioFileSize)})
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mb-4">
        <div className="col">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${activeTab === "summary" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveTab("summary")}
            >
              <i className="fas fa-chart-bar me-2"></i>
              Meeting Summary
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "transcript" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveTab("transcript")}
            >
              <i className="fas fa-file-alt me-2"></i>
              View Transcript
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="row">
        <div className="col">
          {activeTab === "summary" && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Meeting Summary</h5>
              </div>
              <div className="card-body">
                {meeting.status === "completed" ? (
                  <div>
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <div className="text-center">
                          <div className="h4 text-primary">{meeting.speakerCount}</div>
                          <div className="text-muted">Speakers</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <div className="h4 text-primary">{meeting.segments.length}</div>
                          <div className="text-muted">Segments</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <div className="h4 text-primary">
                            {meeting.segments.length > 0 
                              ? formatTime(meeting.segments[meeting.segments.length - 1].end)
                              : "0:00"
                            }
                          </div>
                          <div className="text-muted">Duration</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <div className="h4 text-primary">
                            {meeting.transcript.split(' ').length}
                          </div>
                          <div className="text-muted">Words</div>
                        </div>
                      </div>
                    </div>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Click "View Transcript" to see the detailed conversation with speaker identification.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">
                      {meeting.status === "pending" && "Waiting for audio upload..."}
                      {meeting.status === "processing" && "Processing audio file..."}
                      {meeting.status === "failed" && "Failed to process audio"}
                    </h5>
                    {meeting.status === "processing" && (
                      <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Processing...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Meeting Transcript</h5>
              </div>
              <div className="card-body">
                {meeting.status === "completed" ? (
                  <div className="transcript-container">
                    {meeting.segments.map((segment, index) => (
                      <div key={index} className="transcript-segment mb-3">
                        <div className="d-flex align-items-start">
                          <div className="speaker-badge me-3">
                            <span className="badge bg-primary">
                              {segment.speaker}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <div className="transcript-text">
                              {segment.text}
                            </div>
                            <div className="text-muted small">
                              {formatTime(segment.start)} - {formatTime(segment.end)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Transcript not available yet</h5>
                    <p className="text-muted">
                      The transcript will be available once the audio processing is complete.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingDetail; 