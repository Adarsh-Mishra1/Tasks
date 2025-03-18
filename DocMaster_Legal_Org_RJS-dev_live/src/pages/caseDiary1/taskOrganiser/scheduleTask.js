import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import userStore from "../../../zustand/userStore";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import { SchedulerTask } from "../../../configs/WebService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ScheduledTaskThunk,
  UpdateScheduledTaskThunk,
} from "../../../components/redux/caseDiaryOrg/CaseDiaryOrgThunks";

function ScheduleTaskPopup() {
  const userData = userStore((state) => state.user);
  const {
    masterOrgData,
    selectedTaskData: scheduleTaskData,
    error,
    loader,
  } = useSelector((state) => state.caseDiaryOrg);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [eventData, setEventData] = useState({
    eventType: scheduleTaskData.schduledEventType || "",
    eventDate: scheduleTaskData?.eventDate || "",
    startTime: scheduleTaskData.startTime || "",
    endTime: scheduleTaskData.endTime || "",
    description: scheduleTaskData.description || "",
  });

  useEffect(() => {
    filterDropdownValues();
  }, [scheduleTaskData]);

  const filterDropdownValues = () => {
    const options = [];
    const { casePreparation, meeting } = scheduleTaskData.isScheduled
      ? getDropdownValues()
      : {
          casePreparation:
            scheduleTaskData?.dropdownValues?.casePreparation ||
            scheduleTaskData?.dropdownValues?.casepreparation,
          meeting: scheduleTaskData?.dropdownValues?.meeting,
        } || {};

    const eventType = scheduleTaskData.schduledEventType;
    const taskType = scheduleTaskData.type;

    if (eventType === "casePreparation" || casePreparation) {
      options.push({
        id: 1,
        option: "Case Preparation",
        value: "casePreparation",
      });
    }
    if (eventType === "meeting" || meeting) {
      options.push({ id: 2, option: "Meetings", value: "meeting" });
    }
    if (taskType === "court") {
      options.push({ id: 3, option: "Court Proceedings", value: "court" });
    }
    if (taskType === "outside") {
      options.push(
        {
          id: 1,
          option: "Case Preparation",
          value: "casePreparation",
        },
        { id: 2, option: "Meetings", value: "meeting" }
      );
    }

    setDropDownOptions(options);
  };

  const getDropdownValues = () => {
    const typeMapping = {
      court: "court_timings",
      before: "before_court_timings",
      after: "after_court_timings",
    };

    const key = typeMapping[scheduleTaskData.type];
    if (!key) return {};

    // const parsedData = JSON.parse(masterOrgData[key]);
    const parsedData = masterOrgData[scheduleTaskData.type];

    return {
      casePreparation: parsedData.casePreparation || parsedData.casepreparation,
      meeting: parsedData.meeting,
    };
  };

  const handleChange = (e) => {
    if (e.target.name === "eventType" && e.target.value === "court") {
      navigate("/clientcaseinformation?3");
    } else {
      const { name, value } = e.target;
      setEventData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (scheduleTaskData.isScheduled) {
      const body = {
        userId: userData.id,
        eventDate: eventData.eventDate,
        eventSlot: {
          start: eventData.startTime,
          end: eventData.endTime,
          courtDetails: scheduleTaskData.courtDetails
            ? scheduleTaskData.courtDetails
            : null,
        },
        description: eventData.description,
        eventType: eventData.eventType,
      };
      dispatch(UpdateScheduledTaskThunk({ id: scheduleTaskData.id, body }));
    } else {
      const payload = {
        userId: userData.id,
        orgId: userData.org.id,
        eventDate: eventData.eventDate,
        eventSlot: {
          start: eventData.startTime,
          end: eventData.endTime,
          courtDetails: scheduleTaskData.courtDetails
            ? scheduleTaskData.courtDetails
            : null,
        },
        description: eventData.description,
        eventType: eventData.eventType,
      };

      dispatch(ScheduledTaskThunk(payload));
    }
  };

  const createTask = async (payload) => {
    try {
      const response = await axios.post(SchedulerTask, payload, {
        headers: apiKeyHeader(),
      });

      if (response.status !== 201) {
        return alert("Error scheduling task. Contact the team.");
      }

      resetFormSubmitEvent();
    } catch (error) {
      alert("Error scheduling task. Contact the team.");
      console.error("Axios Error:", error);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await axios.delete(
        `${SchedulerTask}/${scheduleTaskData.id}`,
        {
          headers: apiKeyHeader(),
        }
      );

      if (response.status !== 200) {
        return alert("Error scheduling task. Contact the team.");
      }

      resetFormSubmitEvent();
    } catch (error) {
      alert("Error scheduling task. Contact the team.");
      console.error("Axios Error:", error);
    }
  };

  const resetFormSubmitEvent = () => {
    setEventData({
      eventType: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    // handleSubmitScheduleEvent();
    // dispatch(GetScheduledTasksThunk(userData.id));
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "Are you sure you want to delete the scheduled task?"
    );

    if (confirmation) deleteTask();
  };

  if (error?.tasksError) {
    alert(`${error?.tasksError}`);
  }

  if (loader.tasksLoader) return <div>Loading..!!</div>;

  return (
    <div
      style={{
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="pb-5">
        <div className="px-5 mx-4" style={{ padding: "10px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Type of Task</label>
              <select
                className="form-control"
                name="eventType"
                value={eventData.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type of Task</option>
                {dropDownOptions.map((each) => (
                  <option key={each.id} value={each.value}>
                    {each.option}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Event Date</label>
              <input
                className="form-control"
                type="date"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
              />
            </div> */}

            {/* <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Start Time</label>
              <input
                className="form-control"
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">End Time</label>
              <input
                className="form-control"
                type="time"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
              />
            </div> */}

            {/* Event Description */}
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Description of Task</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={eventData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            {!scheduleTaskData.isScheduled && (
              <button className="w-100 btn btn-primary mt-2" type="submit">
                Submit Event
              </button>
            )}
            {scheduleTaskData.isScheduled && (
              <div className="d-flex gap-2">
                <button className="w-100 btn btn-primary mt-2" type="submit">
                  Update Event
                </button>
                {/* <button
                  className="w-100 btn btn-danger mt-2"
                  onClick={handleDeleteEvent}
                >
                  Delete Event
                </button> */}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScheduleTaskPopup;
