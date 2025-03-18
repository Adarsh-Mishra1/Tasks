import { configureStore } from "@reduxjs/toolkit";

import stickyReducer from "./stickyNotes/StickyNotesSlice";
import caseDiaryReducer from "./redux/caseDiaryOrg/CaseDiaryOrgSlice";

const store = configureStore({
  reducer: {
    stickyNotes: stickyReducer,
    caseDiaryOrg: caseDiaryReducer,
  },
});

export default store;
