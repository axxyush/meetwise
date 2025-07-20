import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("selectedMeeting");
  const username = email ? email.split("@")[0] : "";

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const fetchMeetings = useCallback(async () => {
    if (!isLoggedIn) {
      setMeetings([]);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch meetings");
      const meetingsArray = await response.json();
      if (Array.isArray(meetingsArray)) {
        setMeetings(meetingsArray);
      } else {
        console.error("Unexpected response format:", meetingsArray);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, isLoggedIn, token]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings, token]);

  const handleNewMeeting = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/new-meeting");
    }
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
      failed: "badge bg-danger",
    };

    return (
      <span className={statusClasses[status] || "badge bg-secondary"}>
        {status}
      </span>
    );
  };

  const meetingSelect = async (selectedMeeting) => {
    setSelectedMeeting(selectedMeeting);
    localStorage.setItem("selectedMeeting", selectedMeeting);
    window.location.reload();
  };

  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark font"
        style={{ width: 300, height: "92vh", overflowY: "auto" }}
      >
        {/* New Meeting Button */}
        <div className="create-btn mb-3">
          <button onClick={handleNewMeeting} className="button">
            Create New Meeting +
          </button>
        </div>

        {/* Meetings List */}
        {isLoggedIn && (
          <div className="mb-3">
            <h4 className="text-white mb-3">Meetings - {meetings.length}</h4>
            {loading ? (
              <div className="text-white-50">Loading meetings...</div>
            ) : meetings.length === 0 ? (
              <div className="text-white-50">No meetings yet</div>
            ) : (
              <div className="meetings-list">
                {meetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    // to={`/meeting/${meeting.id}`}
                    className="text-decoration-none btn btn-link"
                    style={{ width: "100%" }}
                    onClick={() => meetingSelect(meeting.id)}
                  >
                    <div
                      className={`meeting-item p-2 rounded ${
                        id === meeting.id ? "bg-primary" : "bg-dark"
                      }`}
                      style={{ border: "1px solid #444" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div
                            className="text-white fw-bold"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {meeting.title}
                          </div>
                          <div
                            className="text-white-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {formatDate(meeting.createdAt)}
                          </div>
                          {meeting.speakerCount > 0 && (
                            <div
                              className="text-white-50"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {meeting.speakerCount} speakers
                            </div>
                          )}
                        </div>
                        <div className="ms-2">
                          {getStatusBadge(meeting.status)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="dropdown mt-auto">
          <hr />
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
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
            <strong>{username}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <a className="dropdown-item" href="#">
                New Meeting
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                New Group
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
