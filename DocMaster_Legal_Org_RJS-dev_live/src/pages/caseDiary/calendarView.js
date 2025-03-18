import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "../../stylesheets/CalendarStyles.css";
import EventView from "./eventView";
import { useEffect, useState } from "react";
import SlotView from "./slotView";
import { findMinMaxTimings } from "./utils";

/*
1) Hearing Completed - Green Color: condition: 1,
2) Next hearing is Scheduled - Blue Color: condition: 2,
3) User missed hearing date - Gray Color: condition: 3,
*/

const colors = [
  {
    condition: 1,
    // color: "green",
    color: "#28a745",
  },
  {
    condition: 2,
    color: "#9999ff",
    // color: "blue",
  },
  {
    condition: 3,
    color: "#ff4d4d",
    // color: "red",
  },
  {
    condition: 4,
    // color: "magenta",
    color: "#ffb3ff",
  },
  {
    condition: 5,
    color: "#bfbfbf",
    // color: "orange",
  },
  {
    condition: 6,
    color: "lightgreen",
  },
  {
    condition: 7,
    // color: "rgb(230 220 168)",
    color: "#FFD700",
  },
  {
    condition: 8,
    color: "#E6C8E6",
    // color: "lightgray",
  },
  {
    condition: 9,
    color: "orange",
  },
];

function CalendarView({
  initialEvents,
  events,
  handleApiCalls,
  processCaseDiary,
  scheduledTasks,
  masterOrg,
  handleScheduleEventClick,
  view,
  setView,
  location,
  GetDocumentsData,
  GetSlotdata,
}) {
  const localizer = momentLocalizer(moment);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarEvents, setClanderEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typedEvents, setTypedEvets] = useState([]);
  const [timings, setTimings] = useState({ minTime: "", maxTime: "" });
  const [OrganiserData, setOrganiserData] = useState([]);

  useEffect(
    function () {
      if (masterOrg?.data?.length) {
        const { minTime, maxTime } = findMinMaxTimings(masterOrg.data);
        setTimings({ minTime, maxTime });
      }
    },
    [masterOrg]
  );

  useEffect(
    function () {
      if (location.state !== null && OrganiserData.length > 0) {
        GetDocumentsData({ colors, OrganiserData });
      }
    },
    [OrganiserData, location]
  );

  useEffect(
    function () {
      GetSlotdata({ colors, OrganiserData });
    },
    [OrganiserData]
  );

  const handleEventClick = (e) => {
    if (e.type === "caseDiary" || e.type === "legalDeadLine")
      setSelectedEvent(e);
    if (
      e.type === "before" ||
      e.type === "after" ||
      (e.type === "court" && e.mixedSlot) ||
      e.isScheduled
    ) {
      handleScheduleEventClick(e);
    }
  };

  const handleSlotClick = (slotInfo) => {
    const selectedStart = moment(slotInfo.start);
    const selectedEnd = moment(slotInfo.end);

    const isSlotAvailable = !calendarEvents.some((event) => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);

      return (
        selectedStart.isBefore(eventEnd) && selectedEnd.isAfter(eventStart)
      );
    });

    if (isSlotAvailable && (view === "day" || view === "week")) {
      const confirmation = window.confirm(
        "Are you sure you want to schedule the task outside of working hours?"
      );

      if (confirmation) {
        const dropdownValues = {
          casepreparation: true,
          meeting: true,
        };
        const event = { ...slotInfo, dropdownValues, type: "empty" };

        handleScheduleEventClick(event);
      }
    } else {
      console.log("Selected slot is not available.");
    }
  };

  useEffect(
    function () {
      if (events.length > 0) {
        setTypedEvets([]);
        // for handling case diry events
        const groupedEvents = events
          .filter((e) => e.type === "caseDiary")
          .reduce((acc, event) => {
            if (!acc[event.case_id]) {
              acc[event.case_id] = [];
            }
            acc[event.case_id].push(event);
            return acc;
          }, {});

        Object.keys(groupedEvents).forEach((caseId) => {
          groupedEvents[caseId]
            .sort((a, b) => a.id - b.id)
            .forEach((event) => {
              if (event.nextdate) {
                const nextDate = moment(event.nextdate);
                const today = moment();

                if (nextDate.isBefore(today, "day")) {
                  if (event.id < groupedEvents[caseId]?.at(-1).id) {
                    event.eventType = 1; // hearing completed
                  } else {
                    event.eventType = 3; // hearing missed
                  }
                } else {
                  event.eventType = 2; // upcoming hearing
                }
              }
            });
        });

        // setTypedEvets([].concat(...Object.values(groupedEvents)));

        // for handling other master org events
        const addOnEvents = events
          .filter((e) => e.type !== "caseDiary" && e.type !== "legalDeadLine")
          .map((each) => {
            if (each.type === "court") {
              // magenta
              // each.eventType = 4; // court timings color
              each.eventType = each.mixedSlot ? 4 : 8;
            }
            if (each.type === "break") {
              // golden yellow
              each.eventType = 7; // court timings color
            }
            if (each.type === "before" || each.type === "after") {
              // lightgreen
              each.eventType = 6; // case preparations color
            }
            if (each.type === "scheduled" || each?.isScheduled) {
              // light gray
              each.eventType = 5;
            }

            return { ...each };
          });

        setOrganiserData(addOnEvents);

        const legalDeadLineEvents = events
          .filter((e) => e.type === "legalDeadLine")
          .map((each) => ({
            ...each,
            eventType: 9,
            title: `${each.legalDeadlineDate} - ${each.remarks}`,
          }));

        setTypedEvets([
          ...legalDeadLineEvents,
          ...Object.values(groupedEvents).flat(),
          ...addOnEvents,
        ]);
      }
    },
    [events]
  );

  useEffect(
    function () {
      if (typedEvents.length > 0) {
        const finalEvents = typedEvents.map((each) => {
          if (each.type === "caseDiary") {
            // let additionalRemarks = "N/A";

            // if (each.legalDeadlineDate && each.remarks) {
            //   additionalRemarks = `${each.legalDeadlineDate} - ${each.remarks}`;
            // }
            // if (
            //   (each.legalDeadlineDate === null ||
            //     each.legalDeadlineDate === "null" ||
            //     !each.legalDeadlineDate) &&
            //   each.remarks
            // ) {
            //   additionalRemarks = each.remarks;
            // }

            // each.title = each.heading + " " + additionalRemarks;
            // each.heading1 = each.heading;
            // each.heading2 = additionalRemarks;
            each.title = each.particulars;
            return each;
          } else {
            return each;
          }
        });
        setClanderEvents(finalEvents);
      }
    },
    [typedEvents]
  );

  // const CustomTimeSlotWrapper = () => <div />;

  const handleMonthChange = (e) => {
    if (e.target.value) {
      const [year, month] = e.target.value.split("-");
      const formattedMonth = moment(`${year}-${month}`, "YYYY-MM").format(
        "YYYY-MM"
      );
      setSelectedDate(new Date(year, month - 1, 1));
      setView(Views.MONTH);
      // processCaseDiary(
      //   initialEvents,
      //   masterOrg,
      //   scheduledTasks,
      //   formattedMonth
      // );
    }
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-");
      setSelectedDate(new Date(year, month - 1, day));
      setView(Views.DAY);
    } else {
      setView(Views.MONTH);
    }
  };

  const handleCalendarViewChange = (e) => {
    // setSelectedDate(new Date());
    if (e.target.value === "week") setView(Views.WEEK);
    if (e.target.value === "month") setView(Views.MONTH);
    if (e.target.value === "day") setView(Views.DAY);
  };

  return (
    <>
      {selectedEvent !== null && (
        <EventView
          onClose={setSelectedEvent}
          selectedEvent={selectedEvent}
          handleApiCalls={handleApiCalls}
          // orgDiary={orgDiary}
        />
      )}
      {selectedSlot !== null && (
        <SlotView
          slot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          handleApiCalls={handleApiCalls}
        />
      )}
      <div
        style={{ textAlign: "left", marginBottom: "10px", marginTop: "15px" }}
      >
        <div className="my-1">
        <label>Select Month and Year: </label>
        <input
          type="month"
          onChange={handleMonthChange}
          value={moment(selectedDate).format("YYYY-MM")}
        />
        </div>
        <div className="my-1">
        &nbsp;&nbsp;
        <label>Select Date: </label>
        <input
          type="date"
          onChange={handleDateChange}
          value={moment(selectedDate).format("YYYY-MM-DD")}
        />
        </div>
        <div className="my-1">
        &nbsp;&nbsp;
        <label>Select Calendar View</label>&nbsp;
        <select onChange={handleCalendarViewChange} value={view}>
          <option value="day">Day View</option>
          <option value="month">Month View</option>
          <option value="week">Week View</option>
        </select>
        </div>
      </div>
      {/* <CalendarDropdowns /> */}
      <div
        style={{
          height: "500px",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <strong>Total Records: {events.length}</strong>
        <Calendar
          selectable
          className="custom-calendar"
          localizer={localizer}
          events={calendarEvents}
          step={60}
          timeslots={1}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          date={selectedDate}
          view={view}
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setSelectedDate(newDate)}
          components={
            {
              // event: CustomEvent,
              // timeSlotWrapper: CustomTimeSlotWrapper,
            }
          }
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSlotClick}
          // toolbar={false}
          eventPropGetter={(event) => {
            // let backgroundColor = colors[event.eventType % colors.length];
            let backgroundColor =
              colors.find((each) => each.condition === event.eventType)
                ?.color || "blue";

            return {
              style: {
                backgroundColor,
                color: "white",
                borderRadius: "5px",
                padding: "2px 5px",
                fontSize: "12px",
              },
            };
          }}
          onShowMore={(events, date) => {
            setSelectedDate(date);
            setView(Views.DAY);
          }}
          min={moment(timings.minTime, "hh:mm A").subtract(1, "hour")}
          max={moment(timings.maxTime, "hh:mm A").add(1, "hour")}
        />
      </div>
    </>
  );
}

const CustomEvent = ({ event }) => {
  return (
    <div>
      <div style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}>
        {event.heading1}
      </div>
      <div style={{ color: "red", fontWeight: "bold", fontSize: "10px" }}>
        {event.heading2}
      </div>
    </div>
  );
};

export default CalendarView;
