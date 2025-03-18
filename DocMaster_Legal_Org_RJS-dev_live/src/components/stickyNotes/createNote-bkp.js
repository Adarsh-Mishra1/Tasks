import { Form, FormGroup, Label, Input, Col } from "reactstrap";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import { useEffect, useState } from "react";
import { updateStickyNote } from "./stickyNotesApi";
import { useDispatch } from "react-redux";

const CreateNote = ({
  clientCase,
  onNoteEvent = null,
  existingNotes = null,
  submitCaseEvent,
}) => {
  const userData = userStore((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    noteTitle: "",
    noteData: "",
    noteAccess: {
      problemInfo: false,
      caseDiary: false,
      research: false,
      drafting: false,
      events: false,
      // judgementsearch: false,
    },
  });

  useEffect(
    function () {
      if (existingNotes !== null) {
        setFormData((prev) => ({
          ...prev,
          noteData: existingNotes.note_data,
          noteAccess: JSON.parse(existingNotes.note_access),
        }));
      }
    },
    [existingNotes]
  );

  const submitCaseNote = async (e) => {
    e.preventDefault();

    if (existingNotes === null) {
      const body = {
        userId: userData.id,
        orgId: userData.org.id,
        caseId: clientCase.id,
        noteTitle: formData.noteTitle,
        noteData: formData.noteData,
        createdAt: "events",
        noteAccess: JSON.stringify(formData.noteAccess),
      };
      submitCaseEvent(e, body);
    } else {
      const body = {
        noteId: existingNotes.id,
        noteTitle: formData.noteTitle,
        noteData: formData.noteData,
        noteAccess: JSON.stringify(formData.noteAccess),
      };
      updateNote(body);
    }
  };

  const updateNote = async (body) => {
    const editLoader = toast.success("Updating Note...", {
      autoClose: false,
    });
    try {
      await dispatch(updateStickyNote(body)).unwrap();
      toast.dismiss(editLoader);
      toast.success("Note updated successfully!");
      onNoteEvent(false);
    } catch (error) {
      toast.dismiss(editLoader);
      toast.error(`${error.message}`, { autoClose: 3000 });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      noteAccess: {
        ...prev.noteAccess,
        [name]: checked,
      },
    }));
  };

  return (
    <Form onSubmit={submitCaseNote}>
      {/* <FormGroup row>
        <Label htmlFor="detail" sm={2}>
          Note Title
        </Label>
        <Col sm={6}>
          <Input
            type="text"
            className="form-control"
            id="detail"
            name="noteTitle"
            aria-describedby="detail"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
            required
          />
        </Col>
      </FormGroup> */}
      <FormGroup row>
        <Label htmlFor="detail" sm={3}>
          Note Details
        </Label>
        <Col sm={9}>
          <Input
            type="text"
            className="form-control"
            id="detail"
            name="noteData"
            aria-describedby="detail"
            value={formData.noteData}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label sm={3}>Note Access To</Label>
        <Col sm={9}>
          {Object.keys(formData.noteAccess).map((key) => (
            <div key={key} className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id={key}
                name={key}
                checked={formData.noteAccess[key]}
                onChange={handleCheckboxChange}
              />
              <Label className="form-check-label" htmlFor={key}>
                {key}
              </Label>
            </div>
          ))}
        </Col>
      </FormGroup>
      <div className="w-100 text-center">
      <button
        className="text-center btn btn-sm btn-primary m-0"
        style={{
          fontSize: "14px",
          cursor: "pointer",
        }}
        type="submit"
      >
        {existingNotes === null ? "Save the details" : "Update Note"}
      </button>
      </div>
    </Form>
  );
};

export default CreateNote;
