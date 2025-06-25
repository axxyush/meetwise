import React from "react";

function ChatLog() {
  return (
    <>
      <div className="container">
        <div class="messageBox">
          <input
            required=""
            placeholder="Message..."
            type="text"
            id="messageInput"
            className="font"
          />
          <button id="sendButton">
            <i
              className="fa-solid fa-paper-plane"
              style={{ color: "#ffffff" }}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatLog;
