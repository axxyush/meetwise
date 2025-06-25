import React from "react";
import Sidebar from "./Siderbar";
import Chat from "./Chat";

function Logs() {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <Chat />
      </div>
    </>
  );
}

export default Logs;
