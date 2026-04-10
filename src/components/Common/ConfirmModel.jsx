import React from "react";
import "./ConfirmModel.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-text">{message}</p>

        <div className="confirm-buttons">
          <button className="confirm-yes" onClick={onConfirm}>
            Yes
          </button>

          <button className="confirm-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;