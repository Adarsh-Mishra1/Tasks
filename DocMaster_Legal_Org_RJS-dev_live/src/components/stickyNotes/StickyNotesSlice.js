import { createSlice } from "@reduxjs/toolkit";
import {
  createSticktNote,
  deleteStickyNote,
  fetchStickyNotes,
  fetchStickyNotesByCaseId,
  fetchStickyNotesByResearchSubjectId,
  fetchStickyNotesByUserIdJ,
  updateStickyNote,
} from "./stickyNotesApi";
import {
  filterNotesMap,
  setFilteredCaseNotes,
  syncNotesCopy,
  updateLocalStorage,
} from "./stickyNotesUtils";
import moment from "moment";

const parseLocalStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const localStoredNotesToDisplay = parseLocalStorage("notesToDisplay");

const initialState = {
  currentScreen: "home",
  notesToDisplay: localStoredNotesToDisplay,
  notes: [],
  notesCopy: [],
  caseTypeNotes: [],
  unsavedNotes: [],
  filterNoteValue: "all",
  displayCreateNote: false,
  selectedClientCase: null,
  isLoading: false,
  error: null,
};

const stickySlice = createSlice({
  name: "stickyNotes",
  initialState,
  reducers: {
    filterNotes(state, action) {
      const filterFn = filterNotesMap[action.payload];
      state.filterNoteValue = action.payload;
      state.notesCopy = filterFn(state.notes);
    },

    filterByCreatedDate(state, action) {
      const userSelectedDate = moment(action.payload).format("DD-MM-YYYY");
      state.notesCopy = state.notes.filter(
        (note) =>
          moment(note.note_created_at).format("DD-MM-YYYY") === userSelectedDate
      );
    },

    clearNotesFromDisplay(state, action) {
      state.notesToDisplay = [];
      updateLocalStorage("notesToDisplay", state.notesToDisplay);
    },

    addNoteToDisplay(state, action) {
      const noteId = action.payload;
      const note = state.notes.find((each) => each.id === noteId);

      if (
        note &&
        !state.notesToDisplay.some(
          (existingNote) => existingNote.id === note.id
        )
      ) {
        state.notesToDisplay = [...state.notesToDisplay, note];
        updateLocalStorage("notesToDisplay", state.notesToDisplay);
      }
    },

    closeDisplayNote(state, action) {
      const noteId = action.payload;
      state.notesToDisplay = state.notesToDisplay.filter(
        (each) => each.id !== noteId
      );
      updateLocalStorage("notesToDisplay", state.notesToDisplay);
    },

    updateNoteAccess(state, action) {
      const { id: noteId, name, value } = action.payload;

      state.notes = state.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              note_access: JSON.stringify({
                ...JSON.parse(note.note_access),
                [name]: value,
              }),
            }
          : note
      );
      if (!state.unsavedNotes.includes(noteId)) {
        state.unsavedNotes.push(noteId);
      }

      syncNotesCopy(state);

      if (state.notesToDisplay.find((each) => each.id === noteId)) {
        state.notesToDisplay = state.notesToDisplay.map((note) =>
          note.id === noteId
            ? {
                ...note,
                note_access: JSON.stringify({
                  ...JSON.parse(note.note_access),
                  [name]: value,
                }),
              }
            : note
        );
      }
    },

    markNoteAsUnsaved(state, action) {
      if (!state.unsavedNotes?.includes(action.payload)) {
        state.unsavedNotes.push(action.payload);
      }
    },

    markNoteAssaved(state, action) {
      state.unsavedNotes = state.unsavedNotes.filter(
        (noteId) => noteId !== action.payload
      );
    },

    changeCreateNoteWindow(state, action) {
      state.displayCreateNote = action.payload.noteWindow;
      state.selectedClientCase = action.payload.clientCase;
      if (action.payload.clientCase === null) {
        state.selectedClientCase = action.payload.research;
      }
    },
  },

  extraReducers: (builder) => {
    // fetching sticky notes
    builder.addCase(fetchStickyNotes.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStickyNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.isLoading = false;
      syncNotesCopy(state);
    });
    builder.addCase(fetchStickyNotes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // fetching sticky notes by case id
    builder.addCase(fetchStickyNotesByCaseId.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStickyNotesByCaseId.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.isLoading = false;
      if (action.meta.arg.type !== null) {
        setFilteredCaseNotes(state, action.meta.arg.type);
      } else {
        state.notes = action.payload;
        syncNotesCopy(state);
      }
    });
    builder.addCase(fetchStickyNotesByCaseId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // fetching sticky notes by user id for judgment
    builder.addCase(fetchStickyNotesByUserIdJ.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStickyNotesByUserIdJ.fulfilled, (state, action) => {
      const filteredNotes = action.payload.filter(
        (note) => note.created_at === "judgement"
      );
      state.isLoading = false;
      state.notes = filteredNotes;
      state.notesToDisplay = filteredNotes;
      syncNotesCopy(state, false);
    });
    builder.addCase(fetchStickyNotesByUserIdJ.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //fetch notes bye ResearchSubjectId
    builder.addCase(
      fetchStickyNotesByResearchSubjectId.pending,
      (state, action) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addCase(
      fetchStickyNotesByResearchSubjectId.fulfilled,
      (state, action) => {
        state.notes = action.payload;
        state.isLoading = false;
        setFilteredCaseNotes(state, "research");
      }
    );
    builder.addCase(
      fetchStickyNotesByResearchSubjectId.rejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }
    );

    //creating new sticky notes
    builder.addCase(createSticktNote.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createSticktNote.fulfilled, (state, action) => {
      state.isLoading = false;
      const newNote = {
        id: action.payload.insertId,
        user_id: action.meta.arg.userId,
        org_id: action.meta.arg.orgId,
        note_title: action.meta.arg.noteTitle,
        note_data: action.meta.arg.noteData,
        note_access: action.meta.arg.noteAccess,
        note_created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        status: 1,
      };
      state.notes = [...state.notes, newNote];
      syncNotesCopy(state, false);
      state.filterNoteValue = "all";
    });
    builder.addCase(createSticktNote.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // update sticky note
    builder.addCase(updateStickyNote.pending, (state, action) => {
      // state.isLoading = true;
      // state.error = null;
    });
    builder.addCase(updateStickyNote.fulfilled, (state, action) => {
      // for handling notes
      state.notes = state.notes.map((note) =>
        note.id === action.payload.noteId
          ? {
              ...note,
              note_title: action.meta.arg.noteTitle,
              note_data: action.meta.arg.noteData,
              note_access: action.meta.arg.noteAccess,
            }
          : note
      );
      state.unsavedNotes = state.unsavedNotes.filter(
        (noteId) => noteId !== action.payload.noteId
      );

      syncNotesCopy(state);

      // for handling notes in entire screen
      state.notesToDisplay = state.notesToDisplay.map((note) =>
        note.id === action.payload.noteId
          ? {
              ...note,
              note_title: action.meta.arg.noteTitle,
              note_data: action.meta.arg.noteData,
              note_access: action.meta.arg.noteAccess,
            }
          : note
      );
      updateLocalStorage("notesToDisplay", state.notesToDisplay);
    });
    builder.addCase(updateStickyNote.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // delete a sticky note
    builder.addCase(deleteStickyNote.pending, (state, action) => {});

    builder.addCase(deleteStickyNote.fulfilled, (state, action) => {
      // handle global states here
      state.notes = state.notes.filter((each) => each.id !== action.meta.arg);
      state.unsavedNotes = state.unsavedNotes.filter(
        (noteId) => noteId !== action.meta.arg
      );
      syncNotesCopy(state);
      if (state.notesToDisplay.find((each) => each.id === action.meta.arg)) {
        state.notesToDisplay = state.notesToDisplay.filter(
          (each) => each.id !== action.meta.arg
        );
        updateLocalStorage("notesToDisplay", state.notesToDisplay);
      }
    });

    builder.addCase(deleteStickyNote.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  deleteNote,
  closeDisplayNote,
  updateNoteAccess,
  filterNotes,
  clearNotesFromDisplay,
  filterByCreatedDate,
  changeCreateNoteWindow,
} = stickySlice.actions;

export default stickySlice.reducer;
