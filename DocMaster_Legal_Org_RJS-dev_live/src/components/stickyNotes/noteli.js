import { useEffect, useRef, useState } from "react";
import "../../stylesheets/stickyNotes.css";
import { clearNotesFromDisplay } from "./StickyNotesSlice";
import { useDispatch } from "react-redux";
import DisplayNoteInput from "./DisplayNoteInput";
import Draggable from "react-draggable";
import { filterNotesMap } from "./stickyNotesUtils";
import ExpansionComponent from "./expansionComponent";

function NoteLi({ notes }) {
  const stickyNoteRef = useRef();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 60 });
  const [openedIndex, setOpenedIndex] = useState(null);

  const problemInfoNotes = getFilteredNotes("probleminfo");
  const researchNotes = getFilteredNotes("research");
  const draftingNotes = getFilteredNotes("drafting");
  const caseDiaryNotes = getFilteredNotes("caseDiary");
  const eventsNotes = getFilteredNotes("events");
  // const judgementNotes = getFilteredNotes("judgement");
  const judgementNotes = notes.filter(
    (note) => note.created_at === "judgement"
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isExpanded &&
        stickyNoteRef.current &&
        !stickyNoteRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  function getFilteredNotes(filterNoteValue) {
    const filterFn = filterNotesMap[filterNoteValue];
    return filterFn(notes);
  }

  const handleCloseNote = async (e) => {
    e.preventDefault();
    dispatch(clearNotesFromDisplay());
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={isExpanded ? { x: 0, y: 0 } : position}
      onStop={handleDrag}
    >
      <div
        className={`sticky-note ${isExpanded ? "expanded" : ""}`}
        ref={stickyNoteRef}
        // style={{

        // }}
      >
        <div className="sticky-note-header">
          <div>Notes</div>
          <div className="expand" onClick={toggleExpand}>
            {isExpanded ? "Collapse" : "Expand"}
          </div>
          <div className="close" onClick={handleCloseNote}>
            &times;
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            // height: isExpanded ? "72vh" : "150px",
            height: isExpanded ? "50vh" : "150px",
            width: isExpanded ? "48.7vw" : "auto",
            // width: isExpanded ? "78.7vw" : "auto",
            padding: isExpanded ? "10px 15px 10px 0px" : "5px",
            overflowY: "auto",
            fontSize: "13px",
            color: "black",
          }}
        >
          <ul style={{ overflowY: "auto" }}>
            {problemInfoNotes.length > 0 && (
              <ExpansionComponent
                setIsExpanded={setIsExpanded}
                notesData={problemInfoNotes}
                title="Problem Info"
                index={0}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {researchNotes.length > 0 && (
              <ExpansionComponent
                notesData={researchNotes}
                title="Research "
                setIsExpanded={setIsExpanded}
                index={1}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {draftingNotes.length > 0 && (
              <ExpansionComponent
                notesData={draftingNotes}
                title="Drafting"
                setIsExpanded={setIsExpanded}
                index={2}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {caseDiaryNotes.length > 0 && (
              <ExpansionComponent
                notesData={caseDiaryNotes}
                title="Case Diary"
                setIsExpanded={setIsExpanded}
                index={3}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {eventsNotes.length > 0 && (
              <ExpansionComponent
                notesData={eventsNotes}
                title="Events"
                setIsExpanded={setIsExpanded}
                index={4}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {judgementNotes.length > 0 && (
              <ExpansionComponent
                notesData={judgementNotes}
                title="Judgements"
                setIsExpanded={setIsExpanded}
                index={5}
                openedIndex={openedIndex}
                setOpenedIndex={setOpenedIndex}
              />
            )}
            {/* {notes.map((note) => (
              <li key={note.id}>
                <DisplayNoteInput note={note} 
                problemInfoNotes={problemInfoNotes}/>
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    </Draggable>
  );
}

export default NoteLi;
