import React, { useState } from "react";
import "../stylesheets/customModal.css";

const CustomModal = ({
  isOpen,
  onClose,
  children,
  handleCopy,
  handleTransLate,
  defaultLanguages,
}) => {
  const [language, setLanguage] = useState("");
  if (!isOpen) return null;

  const TransLateInto = () => {
    handleTransLate(language);
  };

  return (
    <div
      className="modal-overlay"
      // onClick={() => onClose(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => onClose(false)}>
          &times;
        </button>
        {children}
        <div className="modal-footer">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select a Language to Translate</option>
            {defaultLanguages.map((each, index) => (
              <option value={each} key={index}>
                {each}
              </option>
            ))}
          </select>
          {language && (
            <button className="translate-button" onClick={TransLateInto}>
              Translate to {language}
            </button>
          )}
          <button className="copy-button" onClick={handleCopy}>
            Copy
          </button>
        </div>
        {/* <select>
          <option>Telugu</option>
          <option>Hindi</option>
        </select>
        <button className="copy-button" onClick={handleCopy}>
          Translate Into
        </button>
        &nbsp;
        <button className="copy-button" onClick={handleCopy}>
          Copy
        </button> */}
      </div>
    </div>
  );
};

export default CustomModal;
