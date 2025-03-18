export const updateLocalStorage = (key, value) => {
  // localStorage.setItem(key, JSON.stringify(value));
};

// export const filterNotesMap = {
//   all: (notesCopy) => notesCopy,
//   probleminfo: (notesCopy) =>
//     notesCopy.filter(
//       (note) => JSON.parse(note.note_access).problemInfo === true
//     ),
//   drafting: (notesCopy) =>
//     notesCopy.filter((note) => JSON.parse(note.note_access).drafting === true),
//   caseDiary: (notesCopy) =>
//     notesCopy.filter((note) => JSON.parse(note.note_access).caseDiary === true),
//   research: (notesCopy) =>
//     notesCopy.filter((note) => JSON.parse(note.note_access).research === true),
//   events: (notesCopy) =>
//     notesCopy.filter((note) => JSON.parse(note.note_access).events === true),
//   judgementsearch: (notesCopy) =>
//     notesCopy.filter(
//       (note) => JSON.parse(note.note_access).judgementsearch === true
//     ),
// };
export const filterNotesMap = {
  all: (notesCopy) => notesCopy,
  probleminfo: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.problemInfo === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
  drafting: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.drafting === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
  caseDiary: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.caseDiary === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
  research: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.research === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
  events: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.events === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
  judgementsearch: (notesCopy) =>
    notesCopy.filter((note) => {
      try {
        const parsedAccess = JSON.parse(note.note_access);
        return parsedAccess.judgementsearch === true;
      } catch (error) {
        console.error("Failed to parse note_access:", error);
        return false;
      }
    }),
};

export const syncNotesCopy = (state, isFilter = true) => {
  if (isFilter) {
    const filterFn = filterNotesMap[state.filterNoteValue];
    state.notesCopy = filterFn(state.notes);
  } else {
    state.notesCopy = [...state.notes];
  }
};

export const setFilteredCaseNotes = (state, type) => {
  // const filterFn = filterNotesMap[type];
  // state.caseTypeNotes = filterFn(state.notes);
  // state.notesToDisplay = filterFn(state.notes);
  // updateLocalStorage("notesToDisplay", state.notesToDisplay);
  state.notesToDisplay = state.notes;
};
