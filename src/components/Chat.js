import React from "react";

function ChatLog() {
  return (
    <>
      <div className="container d-flex align-items-end p-3 flex-column-reverse gap-2">
        <div className="messageBox">
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

        <div
          style={{
            width: "100%",
            height: "80vh",
            overflow: "scroll",
          }}
          className="d-flex flex-column font text-white"
        >
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>
          <p className="input-chat-msg">
            Hey! What were the keywords I was supposed to use for the
            presentation?
          </p>

          <p className="output-chat-msg">
            Hello, for the Budget Presentation, you need to use the Hello
            keywords
          </p>

          <p className="input-chat-msg">Thanks!</p>
        </div>
      </div>
    </>
  );
}

export default ChatLog;
