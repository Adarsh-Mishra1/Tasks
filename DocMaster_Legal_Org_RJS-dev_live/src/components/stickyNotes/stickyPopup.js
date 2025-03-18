import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { changeCreateNoteWindow } from "./StickyNotesSlice";
import CreateNote from "./createNote";
import { toast } from "react-toastify";
import {
  createSticktNote,
  fetchStickyNotesByCaseId,
  fetchStickyNotesByResearchSubjectId,
} from "./stickyNotesApi";

function StickyPopup({
  height,
  maxWidth = "550px",
  minHeight = "380px",
  zIndex = "999",
}) {
  const { selectedClientCase } = useSelector((store) => store.stickyNotes);
  const dispatch = useDispatch();
  // const handleClosePopup = (e) => {
  //   e.preventDefault();

  //   if (unsavedNotes.length > 0) {
  //     let noteTitles = "";

  //     notes.forEach((note) => {
  //       if (unsavedNotes.includes(note.id)) {
  //         noteTitles += `${note.note_title}. `;
  //       }
  //     });

  //     const confirmation = window.confirm(
  //       `You have some unsaved changes in the following notes: ${noteTitles}
  //   Proceed without saving changes?`
  //     );

  //     if (confirmation) {
  //       onClose(false);
  //     }
  //   } else {
  //     onClose(false);
  //   }
  // };

  const handleClosePopup = () => {
    dispatch(changeCreateNoteWindow(false));
  };

  const handleCreateNote = (e, body) => {
    e.preventDefault();
    addNote(body);
  };

  const addNote = async (body) => {
    const addLoader = toast.success("Creating Note...", { autoClose: false });
    try {
      await dispatch(createSticktNote(body)).unwrap();
      if (addLoader) toast.dismiss(addLoader);
      toast.success("Note Created Successfully.");
      getNotes();
    } catch (error) {
      if (addLoader) toast.dismiss(addLoader);
      toast.error(`${error.message}`);
    }
  };

  const getNotes = () => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    if (selectedClientCase.researchSubjectId) {
      dispatch(
        fetchStickyNotesByResearchSubjectId(
          selectedClientCase.researchSubjectId
        )
      );
    } else {
      dispatch(
        fetchStickyNotesByCaseId({
          caseId: selectedClientCase.id,
          type: selectedClientCase.type,
        })
      );
    }
    dispatch(changeCreateNoteWindow(false));
    if (loaderId) {
      toast.update(loaderId, {
        render: "Loaded!",
        autoClose: 0,
      });
    }
  };

  return (
    // <div style={{ zIndex: 999, overflow: "auto" }}>
    //   <div
    //     className="modal fade show"
    //     style={{
    //       display: "block",
    //     }}
    //     tabIndex="-1"
    //     aria-labelledby="exampleModalLabel"
    //   >
    //     <div
    //       className="modal-dialog modal-dialog-centered"
    //       style={{ maxWidth: maxWidth }}
    //     >
    //       <div className="modal-content" style={{ minHeight }}>
    //         <div className="modal-header">
    //           <h6 className="modal-title" id="exampleModalLabel">
    //             {title}
    //           </h6>
    //           <button
    //             type="button"
    //             className="btn-close"
    //             // onClick={() => onClose(false)}
    //             onClick={handleClosePopup}
    //             aria-label="Close"
    //           ></button>
    //         </div>
    //         <div className="container mt-2" style={{ overflow: "hidden" }}>
    //           {children}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="modal-backdrop fade show"></div>
    // </div>
    <Modal isOpen={true} centered style={{ maxWidth, height }}>
      <ModalHeader toggle={handleClosePopup} style={{ color: "black" }}>
        Create Note
      </ModalHeader>
      <ModalBody style={{ minHeight, color: "black" }}>
        <CreateNote
          submitCaseEvent={handleCreateNote}
          clientCase={selectedClientCase}
        />
      </ModalBody>
    </Modal>
  );
}

export default StickyPopup;
