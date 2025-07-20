import React from "react";

function MeetingInfoModal(props) {
  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog bg-dark">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h1
                className="modal-title fs-5 gradient-text"
                id="exampleModalLabel"
              >
                <b>{props.title}</b>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body bg-dark text-white">
              <b>Description</b> - {props.description}
              <br />
              <br />
              <b>Transcription</b> - {props.transcription}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingInfoModal;
