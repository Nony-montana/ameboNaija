import React from "react";

const MessageToast = ({ message, messageType }) => {
  return (
    <div>
      <div
        className={`toast show align-items-center text-white border-0 
            ${messageType === "success" ? "bg-success" :"bg-danger"}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default MessageToast;
