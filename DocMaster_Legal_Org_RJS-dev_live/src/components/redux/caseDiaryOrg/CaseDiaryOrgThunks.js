import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetOrgCaseDiary,
  MasterOrg,
  SchedulerTask,
} from "../../../configs/WebService";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import { CreateCalenderEvents } from "../../../pages/caseDiary1/utils1";

// calling multiple thunks
export const GetCalendarDataThunk = createAsyncThunk(
  "CaseDiaryOrg/GetCalendarDataThunk",
  async ({ userId, orgId }, thunkAPI) => {
    await thunkAPI.dispatch(GetOrgCaseDiaryThunk(orgId));
    await thunkAPI.dispatch(GetMasterorg(userId));
    await thunkAPI.dispatch(GetScheduledTasksThunk(userId));

    const { caseDiaryData, masterOrgData, schduledTasksData } =
      thunkAPI.getState().caseDiaryOrg;
    const calendarEvents = await CreateCalenderEvents(
      caseDiaryData,
      masterOrgData,
      schduledTasksData
    );

    return calendarEvents;
  }
);

// case diary thunks
export const GetOrgCaseDiaryThunk = createAsyncThunk(
  "CaseDiaryOrg/GetOrgCaseDiaryThunk",
  async (orgId) => {
    const response = await fetch(`${GetOrgCaseDiary}?orgId=${orgId}`, {
      method: "GET",
      headers: apiKeyHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create org");
    }

    return data;
  }
);

// master org thunks
export const CreateMasterOrg = createAsyncThunk(
  "caseDiaryOrg/CreateMasterOrg",
  async (body, thunkAPI) => {
    const response = await fetch(MasterOrg, {
      method: "POST",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create org");
    }

    await thunkAPI.dispatch(GetMasterorg(body.userId));
    await thunkAPI.dispatch(UpdateCalendarEventsThunk());
    return data;
  }
);

export const UpdateMasterOrg = createAsyncThunk(
  "caseDiaryOrg/UpdateMasterOrg",
  async ({ body, id }, thunkAPI) => {
    const response = await fetch(`${MasterOrg}/${id}`, {
      method: "PATCH",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to uodate org");
    }

    await thunkAPI.dispatch(GetMasterorg(body.userId));
    await thunkAPI.dispatch(UpdateCalendarEventsThunk());
    return data;
  }
);

export const GetMasterorg = createAsyncThunk(
  "caseDiaryOrg/GetMasterorg",
  async (userId) => {
    const response = await fetch(`${MasterOrg}/${userId}`, {
      method: "GET",
      headers: apiKeyHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to get master org");
    }

    return data;
  }
);

export const GetScheduledTasksThunk = createAsyncThunk(
  "CaseDiaryOrg/GetScheduledTasks",
  async (userId) => {
    const response = await fetch(`${SchedulerTask}/${userId}`, {
      method: "GET",
      headers: apiKeyHeader(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed To Get Schuduled Tasks");
    }

    return data;
  }
);

export const ScheduledTaskThunk = createAsyncThunk(
  "CaseDiaryOrg/ScheduledTaskThunk",
  async (body, thunkAPI) => {
    const response = await fetch(SchedulerTask, {
      method: "POST",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed To Update Schuduled Task");
    }

    await thunkAPI.dispatch(GetScheduledTasksThunk(body.userId));
    await thunkAPI.dispatch(UpdateCalendarEventsThunk());

    return data;
  }
);

export const UpdateScheduledTaskThunk = createAsyncThunk(
  "CaseDiaryOrg/UpdateScheduledTaskThunk",
  async ({ id, body }, thunkAPI) => {
    const response = await fetch(`${SchedulerTask}/${id}`, {
      method: "PATCH",
      headers: apiKeyHeader(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed To Update Schuduled Task");
    }

    await thunkAPI.dispatch(GetScheduledTasksThunk(body.userId));
    await thunkAPI.dispatch(UpdateCalendarEventsThunk());

    return data;
  }
);

export const UpdateCalendarEventsThunk = createAsyncThunk(
  "CaseDiaryOrg/UpdateCalendarEvents",
  async (_, thunkAPI) => {
    const { caseDiaryData, masterOrgData, schduledTasksData } =
      thunkAPI.getState().caseDiaryOrg;
    const calendarEvents = await CreateCalenderEvents(
      caseDiaryData,
      masterOrgData,
      schduledTasksData
    );

    return calendarEvents;
  }
);

export const GetUpdateCaseDiaryEventsThunk = createAsyncThunk(
  "CaseDiaryOrg/GetUpdateCaseDiaryEventsThunk",
  async (orgId, thunkAPI) => {
    await thunkAPI.dispatch(GetOrgCaseDiaryThunk(orgId));
    await thunkAPI.dispatch(UpdateCalendarEventsThunk());
  }
);
