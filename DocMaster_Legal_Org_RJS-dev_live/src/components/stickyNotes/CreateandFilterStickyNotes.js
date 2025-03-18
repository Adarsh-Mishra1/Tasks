import { useRef } from "react";
import userStore from "../../zustand/userStore";
import { useDispatch, useSelector } from "react-redux";
import { createSticktNote } from "./stickyNotesApi";
import { toast } from "react-toastify";
import { filterNotes } from "./StickyNotesSlice";

function CreateandFilterStickyNotes() {
  const { user: userData } = userStore((state) => state);
  const { filterNoteValue, notes } = useSelector((store) => store.stickyNotes);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const filterOptions = [
    { value: "all", label: "All Notes" },
    { value: "probleminfo", label: "Problem Info" },
    { value: "drafting", label: "Drafting" },
    { value: "caseDiary", label: "Case Hearing Diary" },
    { value: "research", label: "Research" },
  ];

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (inputRef.current.value === "") {
      return toast.error("Please enter a note title to create a new note", {
        autoClose: 2000,
      });
    }

    const title = inputRef.current.value;

    const body = {
      userId: userData.id,
      orgId: userData.org.id,
      noteTitle: title,
      noteData: "",
      noteAccess: JSON.stringify({
        problemInfo: 0,
        caseDiary: 0,
        research: 0,
        drafting: 0,
      }),
    };

    await dispatch(createSticktNote(body));
    inputRef.current.value = "";
  };

  const handleFiltering = async (e) => {
    dispatch(filterNotes(e.target.value));
  };

  return (
    <div className="ms-2">
      <div>
        <input type="text" ref={inputRef} />
        <button onClick={handleCreateNote}>Create Note</button>
      </div>
      <div>
        <label style={{ marginRight: "10px" }}>Filter By:</label>
        <select
          style={{ width: "200px" }}
          placeholder="Select a filter method..."
          value={filterNoteValue}
          onChange={handleFiltering}
          disabled={notes.length === 0 ? true : false}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CreateandFilterStickyNotes;
