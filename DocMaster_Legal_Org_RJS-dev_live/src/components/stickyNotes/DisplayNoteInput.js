import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateStickyNote } from "./stickyNotesApi";

function DisplayNoteInput({ note }) {
  const dispatch = useDispatch();
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(note.note_data);

  const handleSave = async () => {
    const editLoader = toast.success("Updating...", { autoClose: false });
    try {
      const body = {
        noteId: note.id,
        noteTitle: note.note_title,
        noteData: inputValue,
        noteAccess: note.note_access,
      };
      await dispatch(updateStickyNote(body)).unwrap();
      toast.dismiss(editLoader);
    } catch (error) {
      console.error("Error updating Note: " + error);
      toast.dismiss(editLoader);
      toast.error(error.message || "Something went wrong", { autoClose: 3000 });
    } finally {
      setIsEditable(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        // padding: "1px",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        {!isEditable ? (
          <p style={{ color: "black" }}>{inputValue}</p>
        ) : (
          // <input
          //   style={{
          //     width: "100%",
          //     border: "none",
          //     borderRadius: "5px",
          //     outline: "none",
          //     backgroundColor: !isEditable ? "#fff" : "#f5f5f5",
          //   }}
          //   type="text"
          //   className={isEditable ? "" : "hide-text"}
          //   value={inputValue}
          //   disabled={!isEditable}
          //   onChange={(e) => setInputValue(e.target.value)}
          // />
          <textarea
            style={{
              height: "60px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
              backgroundColor: "#fff",
              resize: "none",
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
      </div>
      <i
        onClick={() => (isEditable ? handleSave() : setIsEditable(true))}
        className={isEditable ? "fa fa-save" : "fa fa-edit"}
        style={{
          fontSize: "15px",
          color: isEditable ? "green" : "blue",
          // marginLeft: "10px",
          cursor: "pointer",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.color = isEditable ? "#008000" : "#0056b3")
        }
        onMouseLeave={(e) =>
          (e.target.style.color = isEditable ? "green" : "blue")
        }
      ></i>
    </div>
  );
}

export default DisplayNoteInput;
