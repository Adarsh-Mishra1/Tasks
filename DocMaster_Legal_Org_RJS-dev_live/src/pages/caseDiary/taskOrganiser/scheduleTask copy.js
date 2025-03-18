import React, { useEffect, useState } from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import userStore from "../../../zustand/userStore";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import { SchedulerTask } from "../../../configs/WebService";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ScheduleTaskPopup({
  handleSubmitScheduleEvent,
  scheduleTaskData = null,
  masterOrg,
}) {
  const userData = userStore((state) => state.user);
  const [timeRanges, setTimeRanges] = useState([]);
  const [eventData, setEventData] = useState({
    eventType: "",
    eventDate: scheduleTaskData?.eventDate || "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const masterOrgData = masterOrg.data.at(0);

  useEffect(
    function () {
      if (eventData.eventType) {
        if (eventData.eventType === "court") {
          const courtTimings = JSON.parse(masterOrgData.court_timings);
          if (courtTimings.isCourtSelected) {
            const courtStart = courtTimings.courtTimings.start;
            const courtEnd = courtTimings.courtTimings.end;
            const breakStart = courtTimings.breakTiming.start;
            const breakEnd = courtTimings.breakTiming.end;

            if (courtTimings.breakTiming) {
              const beforeBreak = {
                min: courtStart,
                max: breakStart,
              };

              const afterBreak = {
                min: breakEnd,
                max: courtEnd,
              };

              setTimeRanges([beforeBreak, afterBreak]);
            } else {
              setTimeRanges({ min: courtStart, max: courtEnd });
            }
          }
        }
        if (eventData.eventType === "meeting") {
          // console.log("masterOrgData_58: ", masterOrgData);
          // all slots before and after court hours
        }
        if (eventData.eventType === "casePreparation") {
          // only before and after court slots
        }
      }
    },
    [eventData.eventType, masterOrgData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paylaod = {
      userId: userData.id,
      orgId: userData.org.id,
      eventDate: eventData.eventDate,
      eventSlot: {
        start: eventData.startTime,
        end: eventData.endTime,
      },
      description: eventData.description,
      eventType: eventData.eventType,
    };

    const response = await axios.post(SchedulerTask, paylaod, {
      headers: apiKeyHeader(),
    });

    if (!response.ok) return alert("Error schedling Task. Contact Team");

    await response.data;
    setEventData({
      eventType: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    handleSubmitScheduleEvent();
  };

  const isDateDisabled = (date) => {
    const day = date.getDay();
    return masterOrgData.working_days.includes(day);
  };

  const filterTime = (time) => {
    const selectedTime = time.getHours() * 60 + time.getMinutes();
    for (let range of timeRanges) {
      const minTime =
        parseInt(range.min.split(":")[0]) * 60 +
        parseInt(range.min.split(":")[1]);
      const maxTime =
        parseInt(range.max.split(":")[0]) * 60 +
        parseInt(range.max.split(":")[1]);

      if (selectedTime >= minTime && selectedTime <= maxTime) {
        return true;
      }
    }
    return false;
  };

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
              <label className="fw-bold mb-2">Event Type</label>
              <select
                className="form-control"
                name="eventType"
                value={eventData.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select an Event</option>
                <option value="court">Court Proceedings</option>
                <option value="meeting">Meetings</option>
                <option value="casePreparation">Case Preparation</option>
              </select>
            </div>

            {/* Event Date */}
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Event Date</label>
              <input
                className="form-control"
                type="date"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
              />
              {/* <br />
              <DatePicker
                selected={eventData.eventDate}
                onChange={(date) => {
                  const e = {
                    target: {
                      name: "eventDate",
                      value: moment(date).format("YYYY-MM-DD"),
                    },
                  };
                  handleChange(e);
                }}
                filterDate={isDateDisabled}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select a date"
                className="form-control"
                required
              /> */}
            </div>

            {/* Event Slot - Start Time */}
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Start Time</label>
              <input
                className="form-control"
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
              {/* <br />
              <DatePicker
                selected={eventData.startTime}
                placeholderText="Select Starting Time"
                onChange={(date) =>
                  setEventData({
                    ...eventData,
                    startTime: date,
                  })
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="HH:mm"
                filterTime={filterTime}
                className="form-control"
              /> */}
            </div>

            {/* Event Slot - End Time */}
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
            </div>

            {/* Event Description */}
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Event Description</label>
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
            <button className="w-100 btn btn-primary mt-2" type="submit">
              Submit Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScheduleTaskPopup;
