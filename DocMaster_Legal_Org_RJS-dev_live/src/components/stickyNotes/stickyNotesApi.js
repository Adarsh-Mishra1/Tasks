import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiKeyHeader } from "../../configs/ApiKeys";
import {
  CreateStickyNotes,
  DeleteStickyNotesById,
  GetAllStickyNotesByUserId,
  GetStickyNotesByCaseId,
  GetStickyNotesByResearchSubjectId,
  UpdateStickyNotes,
} from "../../configs/WebService";


// const GetAllStickyNotesByUserId =
//   "http://localhost:4000/stickyNotes/getStickyNotesByUserId";
// const GetStickyNotesByCaseId =
//   "http://localhost:4000/stickyNotes/getStickyNotesByCaseId";
// const CreateStickyNotes = "http://localhost:4000/stickyNotes/addStickyNotes";
// const GetStickyNotesByResearchSubjectId =
//   "http://localhost:4000/stickyNotes/getNotesByResearchSubject";
// const UpdateStickyNotes =
//   "http://localhost:4000/stickyNotes/updateStickyNotesById";
// const DeleteStickyNotesById =
//   "http://localhost:4000/stickyNotes/deleteStickyNotesById";

export const fetchStickyNotes = createAsyncThunk(
  "stickyNotes/fetchStickyNotes",
  async (userId) => {
    const response = await fetch(`${GetAllStickyNotesByUserId}/${userId}`, {
      headers: apiKeyHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to get the notes");
    }
    const data = await response.json();
    return data;
  }
);

export const fetchStickyNotesByUserIdJ = createAsyncThunk(
  "stickyNotes/fetchStickyNotesByUserIdJ",
  async (userId) => {
    const response = await fetch(`${GetAllStickyNotesByUserId}/${userId}`, {
      headers: apiKeyHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to get the notes");
    }
    const data = await response.json();
    return data;
  }
);

export const fetchStickyNotesByCaseId = createAsyncThunk(
  "stickyNotes/fetchStickyNotesByCaseId",
  async ({ caseId }) => {
    const response = await fetch(`${GetStickyNotesByCaseId}/${caseId}`, {
      headers: apiKeyHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to get the notes");
    }
    const data = await response.json();
    return data;
  }
);

export const fetchStickyNotesByResearchSubjectId = createAsyncThunk(
  "stickyNotes/fetchStickyNotesByResearchSubjectId",
  async (subjectId) => {
    const response = await fetch(
      `${GetStickyNotesByResearchSubjectId}/${subjectId}`,
      {
        method: "GET",
        headers: apiKeyHeader(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get the notes");
    }
    const data = await response.json();
    return data;
  }
);

export const createSticktNote = createAsyncThunk(
  "stickyNotes/createSticktNote",
  async (body) => {
    const response = await fetch(CreateStickyNotes, {
      method: "POST",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to create note");
    }
    const data = await response.json();
    return data;
  }
);

export const updateStickyNote = createAsyncThunk(
  "stickyNotes/updateStickyNote",
  async (body) => {
    const response = await fetch(UpdateStickyNotes, {
      method: "PUT",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to update note");
    }
    const data = await response.json();
    return data;
  }
);

export const deleteStickyNote = createAsyncThunk(
  "stickyNotes/deleteStickyNote",
  async (noteId) => {
    const response = await fetch(`${DeleteStickyNotesById}/${noteId}`, {
      method: "DELETE",
      headers: apiKeyHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to Delete note");
    }
    const data = await response.json();
    return data;
  }
);
