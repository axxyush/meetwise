import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const fetchRecentMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/list`);
      const data = await response.json();
      
      if (data.success) {
        setRecentMeetings(data.meetings.slice(0, 5)); // Show only 5 most recent
      }
    } catch (error) {
      console.error("Error fetching recent meetings:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchRecentMeetings();
  }, [fetchRecentMeetings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="jumbotron bg-light p-4 rounded">
            <h1 className="display-4">Welcome to MeetWise!</h1>
            <p className="lead">
              Transform your meeting recordings into actionable insights with AI-powered transcription and speaker diarization.
            </p>
            <hr className="my-4" />
            <p>
              Upload your meeting audio files and get detailed transcripts with speaker identification, timestamps, and more.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/new-meeting")}
            >
              <i className="fas fa-plus me-2"></i>
              Create New Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-microphone fa-2x text-primary mb-2"></i>
              <h5 className="card-title">Audio Processing</h5>
              <p className="card-text">Upload .wav files up to 100MB</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-users fa-2x text-success mb-2"></i>
              <h5 className="card-title">Speaker Diarization</h5>
              <p className="card-text">Identify different speakers automatically</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-clock fa-2x text-info mb-2"></i>
              <h5 className="card-title">Timestamps</h5>
              <p className="card-text">Precise timing for each segment</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-file-alt fa-2x text-warning mb-2"></i>
              <h5 className="card-title">Detailed Transcripts</h5>
              <p className="card-text">Complete conversation records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Meetings</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/new-meeting")}
              >
                <i className="fas fa-plus me-1"></i>
                New Meeting
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentMeetings.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No meetings yet</h5>
                  <p className="text-muted">Create your first meeting to get started!</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/new-meeting")}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create First Meeting
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Speakers</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMeetings.map((meeting) => (
                        <tr key={meeting.id}>
                          <td>
                            <strong>{meeting.title}</strong>
                            {meeting.description && (
                              <div className="text-muted small">
                                {meeting.description}
                              </div>
                            )}
                          </td>
                          <td>{getStatusBadge(meeting.status)}</td>
                          <td>{meeting.speakerCount}</td>
                          <td>{formatDate(meeting.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/meeting/${meeting.id}`)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
