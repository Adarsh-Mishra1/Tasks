import React, { useState } from "react";
import DisplayNoteInput from "./DisplayNoteInput";

const ExpansionComponent = ({ title, notesData, setIsExpanded = null, index,
  openedIndex,
  setOpenedIndex }) => {
  // const [isOpen, setIsOpen] = useState(false);

  const isOpen = openedIndex === index; // Check if this component is the one that should be open

  const handleToggle = () => {
    setOpenedIndex(isOpen ? null : index); // Toggle the section
  };

  return (
    <div>
      <div
        onClick={() => {
          // setIsOpen(!isOpen);
          handleToggle();
          setIsExpanded(true);
        }}
        style={{
          cursor: "pointer",
          display: "flex",
          // alignItems: "center",
          justifyContent: "space-between",
          width: "120px",
          // padding: "0px",
          color: "black",
        }}
      >
        <h6>
          <b>{title}</b>
        </h6>
        <i
          className={`fa ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
          style={{
            fontSize: "14px",
          }}
        ></i>
      </div>
      {isOpen && (
        <ul
          style={{
            border: "1px solid #ccc",
            paddingTop: "5px",
            // marginTop: "5px",
            paddingLeft : "5px",
            listStyle: "none",
            borderRadius: "10px",
            borderStyle: "blue",
            lineHeight : "8px",
          }}
        >
          {notesData.map((note) => (
            <li key={note.id}>
              <DisplayNoteInput note={note} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpansionComponent;
