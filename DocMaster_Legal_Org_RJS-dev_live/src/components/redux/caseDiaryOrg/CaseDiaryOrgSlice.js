import { createSlice } from "@reduxjs/toolkit";
import {
  CreateMasterOrg,
  GetCalendarDataThunk,
  GetMasterorg,
  GetOrgCaseDiaryThunk,
  GetScheduledTasksThunk,
  ScheduledTaskThunk,
  UpdateCalendarEventsThunk,
  UpdateMasterOrg,
  UpdateScheduledTaskThunk,
} from "./CaseDiaryOrgThunks";

export const initialMasterOrgState = {
  isfetched: null,
  workingDays: [],
  before: {
    meeting: false,
    casepreparation: false,
    start: "",
    end: "",
  },
  after: {
    meeting: false,
    casepreparation: false,
    start: "",
    end: "",
  },
  court: {
    courts: "single",
    noOfCourts: "1",
    courtDetails: [{ courtId: 1, name: "", workingDays: [] }],
    courtTimings: {
      start: "",
      end: "",
      meeting: false,
      casepreparation: false,
    },
  },
};

const initialState = {
  loader: { caseDiaryLoader: false, orgLoader: false, tasksLoader: false },
  error: { caseDiaryError: null, orgError: null, tasksError: null },
  caseDiaryData: [],
  calendarEvents: [],
  masterOrgData: initialMasterOrgState,
  schduledTasksData: [],
  selectedTaskData: null,
  showMasterOrg: false,
  showScheduledTask: false,
  showCaseDiary: false,
  selectedCaseDiary: null,
  currentDisplayComponent: "calendar",
};

const CaseDiaryOrgSlice = createSlice({
  name: "CaseDiaryOrg",
  initialState,
  reducers: {
    handleMasterOrgModal(state, action) {
      state.showMasterOrg = action.payload;
    },
    handleTaskModal(state, action) {
      state.showScheduledTask = action.payload;
    },
    handleCurrentDisplayComponent(state, action) {
      state.currentDisplayComponent = action.payload;
    },
    handleEventClick(state, action) {
      state.selectedTaskData = action.payload;
      state.showScheduledTask = true;
    },
    handleCaseDiaryModal(state, action) {
      state.showCaseDiary = action.payload;
    },
    handleCaseDiaryClick(state, action) {
      state.selectedCaseDiary = action.payload;
      state.showCaseDiary = true;
    },
  },
  extraReducers: (builder) => {
    // Get calender data thunk
    builder.addCase(GetCalendarDataThunk.pending, (state) => {
      state.loader.caseDiaryLoader = true;
      state.error.caseDiaryError = null;
    });
    builder.addCase(GetCalendarDataThunk.fulfilled, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.calendarEvents = action.payload;
    });
    builder.addCase(GetCalendarDataThunk.rejected, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.error.caseDiaryError =
        action.error?.message || "Error Getting CalendarThunk Data";
    });

    // get org case diary
    builder.addCase(GetOrgCaseDiaryThunk.pending, (state) => {
      state.loader.caseDiaryLoader = true;
      state.error.caseDiaryError = null;
    });
    builder.addCase(GetOrgCaseDiaryThunk.fulfilled, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.caseDiaryData = action.payload;
    });
    builder.addCase(GetOrgCaseDiaryThunk.rejected, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.error.caseDiaryError =
        action.error?.message || "Something went wrong";
    });

    // get master org
    builder.addCase(GetMasterorg.pending, (state) => {
      state.loader.orgLoader = true;
      state.error.orgError = null;
    });
    builder.addCase(GetMasterorg.fulfilled, (state, action) => {
      state.loader.orgLoader = false;
      const data = action.payload.data[0] || null;
      if (data) {
        const after = JSON.parse(data.after_court_timings);
        const before = JSON.parse(data.before_court_timings);
        const court = JSON.parse(data.court_timings);
        const isfetched = data.id;
        const workingDays = data.working_days;
        state.masterOrgData = { after, before, court, isfetched, workingDays };
      }
    });
    builder.addCase(GetMasterorg.rejected, (state, action) => {
      state.loader.orgLoader = false;
      state.error.orgError = action.error?.message || "Something went wrong";
    });

    // create master org
    builder.addCase(CreateMasterOrg.pending, (state) => {
      state.loader.orgLoader = true;
      state.error.orgError = null;
    });
    builder.addCase(CreateMasterOrg.fulfilled, (state) => {
      state.loader.orgLoader = false;
    });
    builder.addCase(CreateMasterOrg.rejected, (state, action) => {
      state.loader.orgLoader = false;
      state.error.orgError = action.error?.message || "Something went wrong";
    });

    // update master org
    builder.addCase(UpdateMasterOrg.pending, (state) => {
      state.loader.orgLoader = true;
      state.error.orgError = null;
    });
    builder.addCase(UpdateMasterOrg.fulfilled, (state) => {
      state.loader.orgLoader = false;
      state.showMasterOrg = false;
    });
    builder.addCase(UpdateMasterOrg.rejected, (state, action) => {
      state.loader.orgLoader = false;
      state.error.orgError = action.error?.message || "Something went wrong";
    });

    // get scheduled tasks
    builder.addCase(GetScheduledTasksThunk.pending, (state) => {
      state.loader.tasksLoader = true;
      state.error.tasksError = null;
    });
    builder.addCase(GetScheduledTasksThunk.fulfilled, (state, action) => {
      state.loader.tasksLoader = false;
      state.schduledTasksData = action.payload;
    });
    builder.addCase(GetScheduledTasksThunk.rejected, (state, action) => {
      state.loader.tasksLoader = false;
      state.error.tasksError =
        action.error?.message || "Error Getting Scheduled Tasks";
    });

    // create task
    builder.addCase(ScheduledTaskThunk.pending, (state) => {
      state.loader.tasksLoader = true;
      state.error.tasksError = null;
    });
    builder.addCase(ScheduledTaskThunk.fulfilled, (state) => {
      state.loader.tasksLoader = false;
      state.showScheduledTask = false;
    });
    builder.addCase(ScheduledTaskThunk.rejected, (state, action) => {
      state.loader.tasksLoader = false;
      state.error.tasksError = action.error?.message || "Error Creating Task";
    });

    // update scheduled tasks
    builder.addCase(UpdateScheduledTaskThunk.pending, (state) => {
      state.loader.tasksLoader = true;
      state.error.tasksError = null;
    });
    builder.addCase(UpdateScheduledTaskThunk.fulfilled, (state, action) => {
      state.loader.tasksLoader = false;
      state.showScheduledTask = false;
    });
    builder.addCase(UpdateScheduledTaskThunk.rejected, (state, action) => {
      state.loader.tasksLoader = false;
      state.error.tasksError =
        action.error?.message || "Error Updating Scheduled Task";
    });

    // update calendar events
    builder.addCase(UpdateCalendarEventsThunk.pending, (state) => {
      state.loader.caseDiaryLoader = true;
      state.loader.orgLoader = true;
      state.error.caseDiaryError = null;
    });
    builder.addCase(UpdateCalendarEventsThunk.fulfilled, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.loader.orgLoader = false;
      state.calendarEvents = action.payload;
    });
    builder.addCase(UpdateCalendarEventsThunk.rejected, (state, action) => {
      state.loader.caseDiaryLoader = false;
      state.loader.orgLoader = false;
      state.error.tasksError =
        action.error?.message || "Error Updating Calendar Events";
    });
  },
});

export const {
  handleMasterOrgModal,
  handleCurrentDisplayComponent,
  handleEventClick,
  handleTaskModal,
  handleCaseDiaryModal,
  handleCaseDiaryClick,
} = CaseDiaryOrgSlice.actions;

export default CaseDiaryOrgSlice.reducer;
