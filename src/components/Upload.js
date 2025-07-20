// Upload.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MeetingInfoModal from "./MeetingInfoModal";
import EditMeetingModal from "./EditMeetingModal";
import ChatBox from "./ChatBox";

function Upload() {
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetingData, setSelectedMeetingData] = useState(null);

  const navigate = useNavigate();
  const selectedMeeting = localStorage.getItem("selectedMeeting");
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  // fetch 5 recent
  const fetchRecentMeetings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/meeting/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const meetings = await res.json();
      setRecentMeetings(meetings.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchRecentMeetings();
  }, [fetchRecentMeetings]);

  // fetch the selected meeting’s full data
  useEffect(() => {
    if (!selectedMeeting) return;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/meeting/${selectedMeeting}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load meeting");
        const meeting = await res.json();
        setSelectedMeetingData(meeting);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedMeeting, API_BASE_URL]);

  // when EditModal saves, update our state
  const handleUpdate = (updatedMeeting) => {
    setSelectedMeetingData(updatedMeeting);
  };

  return (
    <div
      style={{ height: "82vh" }}
      className="container p-3 d-flex flex-column text-white"
    >
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
          <button
            className="btn btn-primary"
            onClick={() => navigate("/new-meeting")}
          >
            <i className="fas fa-plus me-2"></i>
            Create First Meeting
          </button>
        </div>
      ) : selectedMeetingData ? (
        <>
          <div className="d-flex flex-row justify-content-center align-items-center gap-2">
            <h2 className="font gradient-text">
              <b>{selectedMeetingData.title}</b>
            </h2>

            {/* View */}
            <button
              type="button"
              className="btn btn-outline-info"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Transcript & Description
            </button>
            {/* Edit */}
            <button
              type="button"
              className="btn btn-outline-info"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Edit
            </button>
          </div>
          <hr />
          {/* Chatbox  */}
          <ChatBox
            meetingId={selectedMeeting}
            apiBase={API_BASE_URL}
            token={localStorage.getItem("token")}
          />

          {/* view-only modal */}
          <MeetingInfoModal
            title={selectedMeetingData.title}
            description={selectedMeetingData.description}
            transcription={selectedMeetingData.transcript}
          />

          {/* edit form modal */}
          <EditMeetingModal
            meetingId={selectedMeeting}
            initialTitle={selectedMeetingData.title}
            initialDescription={selectedMeetingData.description}
            initialTranscription={selectedMeetingData.transcript}
            segments={selectedMeetingData.segments}
            onSave={handleUpdate}
          />
        </>
      ) : (
        <div className="table-responsive">
          <h2 className="font text-center">No Meeting Selected</h2>
          <h4 className="font text-center">
            Select a meeting from the sidebar
          </h4>
        </div>
      )}
    </div>
  );
}

export default Upload;
