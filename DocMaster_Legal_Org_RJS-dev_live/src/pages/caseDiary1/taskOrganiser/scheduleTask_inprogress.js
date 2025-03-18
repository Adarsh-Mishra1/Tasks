import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import userStore from "../../../zustand/userStore";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import { MasterOrg, SchedulerTask } from "../../../configs/WebService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const localizer = momentLocalizer(moment);

function ScheduleTask() {
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsCopy, setEventsCopy] = useState([]);
  const [calendarView, setCalendarView] = useState("day");
  const [currentDate, setCurrentDate] = useState(moment());
  const [isOpen, setIsOpen] = useState(false);
  const userData = userStore((state) => state.user);

  function openPopup() {
    setIsOpen(true);
  }

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    setSelectedPurpose(value);

    if (value === "court") {
      const filteredEvents = eventsCopy.filter(
        (event) => event.eventType === "court"
      );
      setEvents(filteredEvents);
    }
    if (value === "meeting") setEvents(eventsCopy);
    if (value === "casePreparation") {
      const filteredEvents = eventsCopy.filter(
        (event) => event.eventType !== "court"
      );
      setEvents(filteredEvents);
    }
    if (
      value === "court" ||
      value === "meeting" ||
      value === "casePreparation"
    ) {
      setCalendarView("week");
    } else {
      setCalendarView("day");
    }
  };

  const convertToEvents = (data, startOfWeek) => {
    const events = [];
    const startOfWeekMoment = moment(startOfWeek).startOf("isoWeek");

    data.forEach((item) => {
      const workingDays = JSON.parse(item.working_days);
      const beforeCourt = JSON.parse(item.before_court_timings);
      const afterCourt = JSON.parse(item.after_court_timings);
      const courtDetails = JSON.parse(item.court_timings);

      workingDays.forEach((day) => {
        const dayOffset = day - 1;
        const currentDate = moment(startOfWeekMoment).add(dayOffset, "days");

        if (beforeCourt.start && beforeCourt.end) {
          events.push({
            title: "Before Court Timings",
            start: moment(currentDate)
              .set({
                hour: beforeCourt.start.split(":")[0],
                minute: beforeCourt.start.split(":")[1],
              })
              .toDate(),
            end: moment(currentDate)
              .set({
                hour: beforeCourt.end.split(":")[0],
                minute: beforeCourt.end.split(":")[1],
              })
              .toDate(),
            color: "green",
            eventType: "before",
          });
        }

        if (courtDetails.isCourtSelected) {
          events.push({
            title: "Court Session",
            start: moment(currentDate)
              .set({
                hour: courtDetails.courtTimings.start.split(":")[0],
                minute: courtDetails.courtTimings.start.split(":")[1],
              })
              .toDate(),
            end: moment(currentDate)
              .set({
                hour: courtDetails.courtTimings.end.split(":")[0],
                minute: courtDetails.courtTimings.end.split(":")[1],
              })
              .toDate(),
            color: "green",
            eventType: "court",
          });

          events.push({
            title: "Break Time",
            start: moment(currentDate)
              .set({
                hour: courtDetails.breakTiming.start.split(":")[0],
                minute: courtDetails.breakTiming.start.split(":")[1],
              })
              .toDate(),
            end: moment(currentDate)
              .set({
                hour: courtDetails.breakTiming.end.split(":")[0],
                minute: courtDetails.breakTiming.end.split(":")[1],
              })
              .toDate(),
            color: "orange",
            eventType: "court",
          });
        }

        if (afterCourt.start && afterCourt.end) {
          events.push({
            title: "After Court",
            start: moment(currentDate)
              .set({
                hour: afterCourt.start.split(":")[0],
                minute: afterCourt.start.split(":")[1],
              })
              .toDate(),
            end: moment(currentDate)
              .set({
                hour: afterCourt.end.split(":")[0],
                minute: afterCourt.end.split(":")[1],
              })
              .toDate(),
            color: "green",
            eventType: "after",
          });
        }
      });
    });

    return events;
  };

  useEffect(() => {
    getMasterOrg();
  }, [currentDate, userData.id]);

  async function getMasterOrg() {
    axios
      .get(`${MasterOrg}/${userData.id}`, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const mappedEvents = convertToEvents(response.data.data, currentDate);
        setEvents(mappedEvents);
        setEventsCopy(mappedEvents);
        setSelectedPurpose("");
        getSchedulerTasks();
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  async function getSchedulerTasks() {
    const response = await fetch(`${SchedulerTask}/${userData.id}`, {
      method: "GET",
      headers: apiKeyHeader(),
    });

    if (!response.ok) {
      return alert("Error getting data.! Contact Team");
    }

    const data = await response.json();

    data?.forEach((each) => {
      try {
        if (!each.event_slot || each.event_slot === "This slot is empty")
          return;
        const parsedSlot = JSON.parse(each.event_slot);
        if (!parsedSlot.start || !parsedSlot.end) return;
        const start = new Date(`${each.event_date}T${parsedSlot.start}:00`);
        const end = new Date(`${each.event_date}T${parsedSlot.end}:00`);

        const newEvent = {
          title: each.desription || "No Title",
          start: start,
          end: end,
          color: "blue",
          eventType: each.event_type,
        };

        setEvents((prev) => [...prev, newEvent]);
        setEventsCopy((prev) => [...prev, newEvent]);
      } catch (error) {
        console.error("Invalid event_slot:", each.event_slot, error);
      }
    });
  }

  return (
    <div className="p-3">
      <div style={{ marginBottom: 20 }}>
        <strong htmlFor="purpose">Add Your Task &nbsp;</strong>
        <select
          id="purpose"
          value={selectedPurpose}
          onChange={handlePurposeChange}
        >
          <option value="">Select</option>
          <option value="court">Court Proceedings</option>
          <option value="meeting">Meetings</option>
          <option value="casePreparation">Case Preparation</option>
        </select>
      </div>
      <button onClick={openPopup}>Schedule Task</button>
      {isOpen && (
        <ScheduleTaskPopup
          setIsOpen={setIsOpen}
          selectedPurpose={selectedPurpose}
          getMasterOrg={getMasterOrg}
        />
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={calendarView}
        onView={(view) => setCalendarView(view)}
        onNavigate={(date) => setCurrentDate(date)}
        selectable
        style={{ height: 500 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "5px",
            border: "none",
            color: "#fff",
          },
        })}
      />
    </div>
  );
}

function ScheduleTaskPopup({ setShowScheduleTask, handleApiCalls }) {
  const userData = userStore((state) => state.user);
  const [eventData, setEventData] = useState({
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    description: "",
  });

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

    const data = response.data;
    setEventData({
      eventType: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      description: "",
    });

    setShowScheduleTask(false);
    handleApiCalls();
  };

  const isDateDisabled = (date) => {
    const day = date.getDay();
    if (eventData.eventType === "meeting") return [1, 2].includes(day); // Mon & Tue
    if (eventData.eventType === "casePreparation") return [3, 4].includes(day); // Wed & Thu
    return false;
  };

  const getTimeLimits = () => {
    switch (eventData.eventType) {
      case "meeting":
        return { min: "09:00", max: "12:00" };
      case "casePreparation":
        return { min: "14:00", max: "17:00" };
      case "court":
        return { min: "10:00", max: "16:00" };
      default:
        return { min: "00:00", max: "23:59" };
    }
  };

  const filterTime = (time) => {
    const { min, max } = getTimeLimits();
    const selectedTime = time.getHours() * 60 + time.getMinutes();
    const minTime =
      parseInt(min.split(":")[0]) * 60 + parseInt(min.split(":")[1]);
    const maxTime =
      parseInt(max.split(":")[0]) * 60 + parseInt(max.split(":")[1]);

    return selectedTime >= minTime && selectedTime <= maxTime;
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
              <label className="fw-bold mb-2">Event Date</label>&nbsp;
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
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a date"
                className="form-control"
                required
              />
            </div>

            {/* Event Slot - Start Time */}
            <div className="mb-3 text-start">
              <label className="fw-bold mb-2">Start Time</label>&nbsp;
              <br />
              <DatePicker
                selected={eventData.startTime}
                onChange={(date) =>
                  setEventData({
                    ...eventData,
                    startTime: date,
                  })
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={1}
                timeCaption="Time"
                dateFormat="HH:mm"
                filterTime={filterTime}
                className="form-control"
              />
              {/* <input
                className="form-control"
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
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
