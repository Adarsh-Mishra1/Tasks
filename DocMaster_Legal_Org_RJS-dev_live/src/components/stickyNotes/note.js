// import { useState, useRef, useEffect } from "react";
// import "../../stylesheets/stickyNotes.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addNoteToDisplay,
//   closeDisplayNote,
//   markNoteAsUnsaved,
//   updateNoteAccess,
// } from "./StickyNotesSlice";
// import { toast } from "react-toastify";
// import { deleteStickyNote, updateStickyNote } from "./stickyNotesApi";

// function Note({
//   id,
//   note_title,
//   note_data,
//   note_access,
//   displayClose = false,
//   top,
//   right,
//   zIndex,
// }) {
//   const dispatch = useDispatch();
//   const [allowMove, setAllowMove] = useState(false);
//   const { unsavedNotes } = useSelector((store) => store.stickyNotes);
//   const stickyNoteRef = useRef();
//   const textAreaRef = useRef(note_data);

//   const access = note_access ? JSON.parse(note_access) : null;
//   const isUnsavedChanges = unsavedNotes.includes(id);

//   const [dx, setDx] = useState(0);
//   const [dy, setDy] = useState(0);

//   function handleMouseDown(e) {
//     setAllowMove(true);

//     const dimensions = stickyNoteRef.current.getBoundingClientRect();
//     setDx(e.clientX - dimensions.left);
//     setDy(e.clientY - dimensions.top);
//   }

//   function handleMouseMove(e) {
//     if (allowMove) {
//       if (stickyNoteRef.current) {
//         const x = e.clientX - dx;
//         const y = e.clientY - dy;

//         stickyNoteRef.current.style.position = "absolute";
//         stickyNoteRef.current.style.left = `${x}px`;
//         stickyNoteRef.current.style.top = `${y}px`;
//       }
//     }
//   }

//   function handleMouseUp() {
//     setAllowMove(false);
//   }

//   useEffect(() => {
//     if (allowMove) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [allowMove]);

//   const handleAddNoteToScreen = async (e) => {
//     e.preventDefault();

//     await dispatch(addNoteToDisplay(id));
//     toast.success("Note successfully added to the Screen!", {
//       autoClose: 1500,
//     });
//   };

//   const handleSaveNote = async (e) => {
//     e.preventDefault();

//     const loader = toast("Saving note...", { autoClose: false });

//     try {
//       const noteData = textAreaRef.current.value;
//       const body = {
//         noteId: id,
//         noteTitle: note_title,
//         noteData,
//         noteAccess: note_access,
//       };

//       await dispatch(updateStickyNote(body));
//       toast.dismiss(loader);
//     } catch (error) {
//       toast.error("Failed to save note. Please try again.");
//     }
//   };

//   const handleDeleteNote = async (e) => {
//     e.preventDefault();
//     await dispatch(deleteStickyNote(id));
//     toast.success("Note successfully Deleted", {
//       autoClose: 1500,
//     });
//   };

//   const handleCloseNote = async (e) => {
//     e.preventDefault();
//     if (unsavedNotes.length > 0) {
//       if (unsavedNotes.includes(id)) {
//         const confirmation = window.confirm(
//           `You have some unsaved changes in the following note: ${note_title}
//       Proceed without saving changes?`
//         );
//         if (confirmation) {
//           dispatch(closeDisplayNote(id));
//         }
//       }
//     } else {
//       dispatch(closeDisplayNote(id));
//     }
//   };

//   const handleCheckBoxChange = (e) => {
//     dispatch(
//       updateNoteAccess({ id, name: e.target.name, value: e.target.checked })
//     );
//   };

//   const handleTextAreaChange = (e) => {
//     if (
//       note_data !== textAreaRef.current.value.trim() &&
//       !unsavedNotes.includes(id)
//     ) {
//       dispatch(markNoteAsUnsaved(id));
//     }
//   };

//   return (
//     <div
//       className="sticky-note"
//       ref={stickyNoteRef}
//       style={{
//         position: "absolute",
//         top: top,
//         right: right,
//         zIndex: zIndex,
//       }}
//     >
//       <div className="sticky-note-header" onMouseDown={handleMouseDown}>
//         <div>{note_title}</div>
//         {displayClose && (
//           <div className="close" onClick={handleCloseNote}>
//             &times;
//           </div>
//         )}
//       </div>
//       <textarea
//         name=""
//         id=""
//         cols="30"
//         rows="10"
//         ref={textAreaRef}
//         onChange={handleTextAreaChange}
//         defaultValue={note_data}
//       ></textarea>

//       <div className="d-flex gap-2 mt-2 text-black fw-bolder">
//         <div className="d-flex gap-1">
//           <input
//             type="checkbox"
//             name="problemInfo"
//             checked={access.problemInfo}
//             onChange={handleCheckBoxChange}
//           />
//           <label>Problem Info</label>
//         </div>
//         <div className="d-flex gap-1">
//           <input
//             type="checkbox"
//             name="caseDiary"
//             checked={access.caseDiary}
//             onChange={handleCheckBoxChange}
//           />
//           <label>Case hearing Diary</label>
//         </div>
//       </div>

//       <div className="d-flex gap-2 mt-2 text-black fw-bolder">
//         <div className="d-flex gap-1">
//           <input
//             type="checkbox"
//             name="research"
//             checked={access.research}
//             onChange={handleCheckBoxChange}
//           />
//           <label>Research</label>
//         </div>

//         <div className="d-flex gap-1">
//           <input
//             type="checkbox"
//             name="drafting"
//             checked={access.drafting}
//             onChange={handleCheckBoxChange}
//           />
//           <label>Drafting</label>
//         </div>
//       </div>
//       <div className="d-flex gap-2">
//         <button
//           className={isUnsavedChanges ? "delete-btn" : "save-btn"}
//           onClick={handleSaveNote}
//         >
//           {/* <button className="save-btn" onClick={handleSaveNote}> */}
//           Save Notes
//         </button>
//         <button className="delete-btn" onClick={handleDeleteNote}>
//           Delete Note
//         </button>
//         <button className="save-btn" onClick={handleAddNoteToScreen}>
//           Add Note to Screen
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Note;
