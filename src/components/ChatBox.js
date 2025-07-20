// ChatBox.js
import React, { useState, useEffect, useRef } from "react";

export default function ChatBox({ meetingId, apiBase, token }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // 1. ref to the scrollable chat history div
  const scrollRef = useRef(null);

  // 2. whenever messages change, scroll to bottom
  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    // add user message
    setChatMessages((m) => [...m, { role: "user", content: chatInput }]);
    try {
      const res = await fetch(`${apiBase}/chat/${meetingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: chatInput }),
      });
      if (!res.ok) throw new Error("Chat API error");
      const { reply } = await res.json();
      // add assistant reply
      setChatMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, something went wrong. 🤖" },
      ]);
    }
    setChatInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat();
    }
  };

  return (
    <div
      style={{ height: "100%" }}
      className="container d-flex align-items-end p-3 flex-column-reverse gap-2"
    >
      {/* input box */}
      <div className="messageBox">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={onKeyDown}
          required
          placeholder="Ask me anything about this meeting..."
          type="text"
          id="messageInput"
          className="font"
        />
        <button onClick={sendChat} id="sendButton">
          <i className="fa-solid fa-paper-plane" style={{ color: "#ffffff" }} />
        </button>
      </div>

      {/* scrollable chat history */}
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          height: "80vh",
          overflow: "auto",
        }}
        className="d-flex flex-column font text-white"
      >
        {chatMessages.map((m, i) =>
          m.role === "user" ? (
            <p
              key={i}
              style={{ width: "fit-content", maxWidth: "60%" }}
              className="input-chat-msg"
            >
              {m.content}
            </p>
          ) : (
            <p
              key={i}
              style={{ width: "fit-content", maxWidth: "60%" }}
              className="output-chat-msg"
            >
              {m.content}
            </p>
          )
        )}
      </div>
    </div>
  );
}
