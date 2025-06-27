import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

function Sidebar() {
  const [activeLink, setActiveLink] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/list`);
      const data = await response.json();
      
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleNewMeeting = () => {
    navigate("/new-meeting");
  };

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
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark font"
        style={{ width: 300, height: "92vh", overflowY: "auto" }}
      >
        <div className="d-flex align-items-center mb-3">
          <h5 className="text-white mb-0">MeetWise</h5>
        </div>

        {/* New Meeting Button */}
        <div className="mb-3">
          <button
            onClick={handleNewMeeting}
            className="btn btn-primary w-100"
            style={{ fontSize: "0.9rem" }}
          >
            <i className="fas fa-plus me-2"></i>
            New Meeting
          </button>
        </div>

        <hr className="text-white" />

        {/* Meetings List */}
        <div className="mb-3">
          <h6 className="text-white mb-2">Recent Meetings</h6>
          {loading ? (
            <div className="text-white-50">Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-white-50">No meetings yet</div>
          ) : (
            <div className="meetings-list">
              {meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  to={`/meeting/${meeting.id}`}
                  className="text-decoration-none"
                  onClick={() => handleLinkClick(meeting.id)}
                >
                  <div
                    className={`meeting-item p-2 mb-2 rounded ${
                      activeLink === meeting.id ? "bg-primary" : "bg-dark"
                    }`}
                    style={{ border: "1px solid #444" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="text-white fw-bold" style={{ fontSize: "0.9rem" }}>
                          {meeting.title}
                        </div>
                        <div className="text-white-50" style={{ fontSize: "0.8rem" }}>
                          {formatDate(meeting.createdAt)}
                        </div>
                        {meeting.speakerCount > 0 && (
                          <div className="text-white-50" style={{ fontSize: "0.8rem" }}>
                            {meeting.speakerCount} speakers
                          </div>
                        )}
                      </div>
                      <div className="ms-2">
                        {getStatusBadge(meeting.status)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <hr className="text-white" />

        {/* User Profile */}
        <div className="dropdown mt-auto">
          <button
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle btn btn-link border-0 p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/axxyush.png"
              alt=""
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
            <strong>Ayush</strong>
          </button>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <button className="dropdown-item btn btn-link border-0 p-0" onClick={handleNewMeeting}>
                New Meeting
              </button>
            </li>
            <li>
              <button className="dropdown-item btn btn-link border-0 p-0">
                New Group
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item btn btn-link border-0 p-0">
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
