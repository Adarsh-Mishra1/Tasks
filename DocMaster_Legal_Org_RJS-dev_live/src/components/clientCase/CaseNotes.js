import { useEffect, useState, Suspense, lazy } from "react";

import CreateNote from "../stickyNotes/createNote";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStickyNote,
  fetchStickyNotesByCaseId,
} from "../stickyNotes/stickyNotesApi";
import { toast } from "react-toastify";
import {
  filterByCreatedDate,
  filterNotes,
} from "../stickyNotes/StickyNotesSlice";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const ClientCaseNotes = (props) => {
  const dispatch = useDispatch();
  const { notesCopy } = useSelector((store) => store.stickyNotes);
  const [showPutAddNoteModal, setShowPutAddNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const NoteTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Note Created",
      accessor: "note_created_at",
    },
    {
      Header: "Note Access To",
      accessor: "noteAccesstable",
    },
    {
      Header: "Note Details",
      accessor: "note_data",
    },
    {
      Header: "Actions",
      accessor: "actionId",
    },
  ];

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "accessTo", label: "Note Access To" },
    { value: "createdDate", label: "Created Date" },
  ];

  useEffect(function () {
    dispatch(
      fetchStickyNotesByCaseId({ caseId: props.clientCase.id, type: null })
    );
  }, []);

  useEffect(
    function () {
      processCaseNotes(notesCopy);
    },
    [notesCopy]
  );

  // useEffect(
  //   function () {
  //     processCaseNotes(notes);
  //   },
  //   [notes]
  // );

  useEffect(
    function () {
      dispatch(filterNotes("all"));
      if (selectedOption === "accessTo") {
        const options = [
          { name: "Problem Info", value: "probleminfo" },
          { name: "Research", value: "research" },
          { name: "Events", value: "events" },
          { name: "Drafting", value: "drafting" },
          { name: "Case Hearing Diary", value: "caseDiary" },
          // { name: "Judgement Search", value: "judgementsearch" },
        ];
        setSelectedDropdown({ name: "Access To", options });
      }
    },
    [selectedOption]
  );

  const processCaseNotes = (notes) => {
    const processedNotes = notes.map((note, i) => {
      const noteAccesstable = Object.entries(JSON.parse(note.note_access))
        .filter(([key, value]) => value === true)
        .map(([key]) => key)
        .join(", ");

      return {
        ...note,
        sno: i + 1,
        noteAccesstable,
        actionId: (
          <>
            <i
              className="fa fa-pencil mx-2"
              title="Edit"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => editCaseNote(note)}
            />
            <i
              className="fa fa-trash mx-2"
              title="Delete"
              style={{ color: "red", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => deleteCaseNote(note.id, note.note_created_at)}
            />
          </>
        ),
      };
    });
    setTableData(processedNotes);
  };

  const editCaseNote = (note) => {
    setEditingNote(note);
    setShowPutAddNoteModal(true);
  };

  const deleteCaseNote = async (noteId, noteDetails) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete this note: ${noteDetails} ?`
    );
    if (confirmation) {
      const deleteLoader = toast.success("Deleting...");
      await dispatch(deleteStickyNote(noteId));
      toast.dismiss(deleteLoader);
    }
  };

  const onPutNote = () => {
    setShowPutAddNoteModal(false);
  };

  const handleChildDropdown = (e) => {
    dispatch(filterNotes(e.target.value));
  };

  const handleDateChange = (e) => {
    dispatch(filterByCreatedDate(e.target.value));
  };

  const handleClose = (e) => {
    e.preventDefault();
    props.setOpenNote(false);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row" style={{ paddingTop: "5px", paddingLeft: "10px" }}>
        <div className="d-flex justify-content-between align-items-center gap-4">
          <div className="d-flex gap-4">
            <div>
              <label style={{ marginRight: "10px" }}>Filter By:</label>
              <select
                style={{ width: "300px" }}
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setSelectedDropdown(null);
                }}
                placeholder="Select a filter method..."
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedDropdown && selectedDropdown !== null && (
              <div>
                <label style={{ marginRight: "10px" }}>
                  Filter By Selecting a {selectedDropdown.name}:
                </label>
                <select
                  style={{ width: "300px" }}
                  onChange={handleChildDropdown}
                  key={selectedDropdown.name}
                >
                  <option value="">Select a {selectedDropdown.name}</option>
                  {selectedDropdown.options.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button className="btn btn-sm btn-danger" onClick={handleClose}>
            <b>Close Notes</b>
          </button>
        </div>

        {selectedOption === "createdDate" && (
          <div>
            Select created Date for Filtering Notes: &nbsp;
            <input type="date" className="mt-4" onChange={handleDateChange} />
          </div>
        )}
        {/* <div className="col-md-12 d-flex">
          <p>
            Add Note
            {!showPutAddNoteModal ? (
              <i
                className="fa fa-plus mx-2"
                title="Add"
                style={{
                  color: "#1c46f2",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                aria-hidden="true"
                onClick={() => setShowPutAddNoteModal(true)}
              />
            ) : (
              <i
                className="fa fa-times mx-2"
                title="Close"
                style={{
                  color: "red",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                aria-hidden="true"
                onClick={() => {
                  setShowPutAddNoteModal(false);
                }}
              />
            )}
          </p>
        </div> */}

        <div className="col-12 mt-4">
          {showPutAddNoteModal && (
            <CreateNote
              clientCase={props.clientCase}
              onPutNote={onPutNote}
              existingNotes={editingNote}
              onNoteEvent={setShowPutAddNoteModal}
            />
          )}
          {!showPutAddNoteModal &&
            (tableData.length > 0 ? (
                <AllFeatureDataTable
                  columns={NoteTableColumns}
                  data={tableData}
                />
            ) : (
              <div>No Notes Found</div>
            ))}
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCaseNotes;
