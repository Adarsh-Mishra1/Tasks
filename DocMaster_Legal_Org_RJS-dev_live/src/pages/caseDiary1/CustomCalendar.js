import React, { useRef, useState } from "react";
import moment from "moment";

import "./css/customCalendar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCaseDiaryClick,
  handleEventClick,
} from "../../components/redux/caseDiaryOrg/CaseDiaryOrgSlice";

const CustomCalendar = () => {
  const { calendarEvents, masterOrgData } = useSelector(
    (state) => state.caseDiaryOrg
  );
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState("day");
  const dateInputRef = useRef(null);

  const firstDayOfMonth = currentDate.clone().startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startDay = firstDayOfMonth.day();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === "month"
        ? prev.clone().subtract(1, "month")
        : view === "week"
        ? prev.clone().subtract(1, "week")
        : prev.clone().subtract(1, "day")
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "month"
        ? prev.clone().add(1, "month")
        : view === "week"
        ? prev.clone().add(1, "week")
        : prev.clone().add(1, "day")
    );
  };

  const handleMoreClick = (date) => {
    setCurrentDate(moment(date));
    setView("day");
  };

  const RenderMonthView = () => {
    const dispatch = useDispatch();
    const handleMonthEventClick = (event) => {
      if (event.type === "caseDiary" || event.type === "legalDeadLine") {
        dispatch(handleCaseDiaryClick(event));
      }
    };

    return (
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}
        {days.map((day) => {
          const date = currentDate.clone().date(day);
          const dayEvents = calendarEvents.filter((event) =>
            moment(event.start).isSame(date, "day")
          );
          return (
            <div key={day} className="calendar-day">
              <div className="day-number">{day}</div>
              {dayEvents.length > 2 ? (
                <>
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <DisplayEvent
                      event={event}
                      key={index}
                      handleMonthEventClick={handleMonthEventClick}
                    />
                  ))}
                  <small
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleMoreClick(date)}
                  >
                    +{dayEvents.length - 3} More
                  </small>
                </>
              ) : (
                dayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="event"
                    style={{
                      backgroundColor: event.bgColor,
                      cursor: `${
                        event.type === "caseDiary" ||
                        event.type === "legalDeadLine"
                          ? "pointer"
                          : ""
                      }`,
                    }}
                    onClick={() => handleMonthEventClick(event)}
                  >
                    {event.title.length > 12
                      ? `${event.title.slice(0, 12)}...`
                      : event.title}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.clone().startOf("week");
    const weekDays = Array.from({ length: 7 }).map((_, index) =>
      startOfWeek.clone().add(index, "days")
    );

    return (
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header mb-2">
            {day}
          </div>
        ))}
        {weekDays.map((day) => {
          const dayEvents = calendarEvents
            .filter((event) => moment(event.start).isSame(day, "day"))
            .sort(
              (a, b) => moment(a.start).valueOf() - moment(b.start).valueOf()
            );

          const caseHearings = dayEvents.filter(
            (e) => e.type === "legalDeadLine" || e.type === "caseDiary"
          );

          const otherEvents = dayEvents.filter(
            (e) => e.type !== "legalDeadLine" && e.type !== "caseDiary"
          );

          const courts = masterOrgData.court.courtDetails.filter((e) =>
            e.workingDays.includes(day.day())
          );

          return (
            <div key={day.format("YYYY-MM-DD")} className="calendar-day">
              <div className="day-number">{day.date()}</div>
              {otherEvents.map((event, index) => (
                <DisplayWeekEvent
                  courts={courts}
                  caseHearings={caseHearings}
                  event={event}
                  key={index}
                  handleMoreClick={handleMoreClick}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const courts = masterOrgData.court.courtDetails.filter((e) =>
      e.workingDays.includes(currentDate.day())
    );

    const dayEvents = calendarEvents
      .filter((event) => moment(event.start).isSame(currentDate, "day"))
      .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());

    const caseHearings = dayEvents.filter(
      (e) => e.type === "legalDeadLine" || e.type === "caseDiary"
    );

    const otherEvents = dayEvents.filter(
      (e) => e.type !== "legalDeadLine" && e.type !== "caseDiary"
    );

    return (
      <div className="calendar-day-view">
        <div className="day-events">
          {otherEvents.map((event, index) => (
            <DisplayDayEvent
              event={event}
              key={index}
              handleEventClick={handleEventClick}
              caseHearings={caseHearings}
              courts={courts}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleDateChange = (e) => {
    if (e.target.value) setCurrentDate(moment(e.target.value));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="bold">
          {view === "month" && currentDate.format("YYYY")}
          {view === "week" && `${currentDate.format("YYYY")}`}
          {view === "day" && `${currentDate.format("dddd")}`}
        </div>
        <div className="d-flex gap-5 bold">
          <div onClick={handlePrev} className="custom-symbol">
            &lt;
          </div>
          <div>
            {(view === "month" || view === "week") &&
              currentDate.format("MMMM")}
            {view === "day" && (
              <div>
                <span
                  onClick={() => {
                    dateInputRef.current.showPicker();
                  }}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {currentDate.format("DD MMMM YYYY")}
                </span>
              </div>
            )}
          </div>
          <div onClick={handleNext} className="custom-symbol">
            &gt;
          </div>
          <input
            className="visually-hidden"
            type="date"
            ref={dateInputRef}
            onChange={handleDateChange}
          />
        </div>
        <div className="d-flex gap-3">
          <div
            onClick={() => setView("month")}
            className={`${view === "month" && "bold"}`}
            style={{ cursor: "pointer" }}
          >
            Month
          </div>
          <div
            onClick={() => setView("week")}
            className={`${view === "week" && "bold"}`}
            style={{ cursor: "pointer" }}
          >
            Week
          </div>
          <div
            onClick={() => setView("day")}
            className={`${view === "day" && "bold"}`}
            style={{ cursor: "pointer" }}
          >
            Day
          </div>
        </div>
      </div>
      <div className="mt-2">
        {view === "month" && RenderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>
    </div>
  );
};

function DisplayEvent({ event, handleMonthEventClick }) {
  return (
    <div
      className="event"
      title={event.title}
      style={{
        backgroundColor: event.bgColor,
        cursor: `${
          event.type === "caseDiary" || event.type === "legalDeadLine"
            ? "pointer"
            : ""
        }`,
      }}
      onClick={() => handleMonthEventClick(event)}
    >
      {event.title.length > 12 ? (
        <span>{event.title.slice(0, 12)}...</span>
      ) : (
        event.title
      )}
    </div>
  );
}

function DisplayWeekEvent({ event, courts, caseHearings, handleMoreClick }) {
  const dispatch = useDispatch();

  const handleWeekEventClick = (court = null) => {
    if (court === null) {
      const eventDate = moment(event.start).format("YYYY-MM-DD");
      const startTime = moment(event.start).format("HH:mm");
      const endTime = moment(event.end).format("HH:mm");
      const dropdownValues = event.dropdownValues;
      const isScheduled = event?.isScheduled || false;
      const description = event?.isScheduled ? event.title : null;
      const schduledEventType = event.isScheduled
        ? event.schduledEventType
        : null;
      const courtDetails = court ? court : null;

      const data = {
        id: event.id,
        eventDate,
        startTime,
        endTime,
        dropdownValues,
        type: event.type,
        isScheduled,
        description,
        schduledEventType,
        courtDetails,
      };
      dispatch(handleEventClick(data));
    } else {
      // redorect to cerftaion page
      const eventDate = moment(event.start).format("YYYY-MM-DD");
      handleMoreClick(eventDate);
    }
  };

  const startTime = moment(event.start);
  const endTime = moment(event.end);
  const totalMinutes = endTime.diff(startTime, "minutes");
  const numSlots = totalMinutes / 30;

  return event.type === "court" ? (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "300px",
        maxHeight: "300px",
        overflow: "hidden",
      }}
    >
      {courts.map((court, i) => (
        <DisplayWeekCourtEvent
          key={i}
          event={event}
          handleDayEventClick={handleWeekEventClick}
          numSlots={numSlots}
          caseHearings={caseHearings}
          court={court}
        />
      ))}
    </div>
  ) : (
    <div
      className="week-event d-flex"
      style={{
        background: event.bgColor,
        cursor: "pointer",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={() => handleWeekEventClick()}
    >
      <div style={{ marginLeft: "5px" }}>
        {event.title.length > 30
          ? `${event.title.slice(0, 15)}...`
          : event.title}
      </div>
      {event.isScheduled && <div className="status-icon"></div>}
    </div>
  );
}

function DisplayDayEvent({ event, caseHearings, courts }) {
  const dispatch = useDispatch();
  let numSlots;

  const handleDayEventClick = (court = null) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    const startTime = moment(event.start).format("HH:mm");
    const endTime = moment(event.end).format("HH:mm");
    const dropdownValues = event.dropdownValues;
    const isScheduled = event?.isScheduled || false;
    const description = event?.isScheduled ? event.title : null;
    const schduledEventType = event.isScheduled
      ? event.schduledEventType
      : null;
    const courtDetails = court ? court : null;

    const data = {
      id: event.id,
      eventDate,
      startTime,
      endTime,
      dropdownValues,
      type: event.type,
      isScheduled,
      description,
      schduledEventType,
      courtDetails,
    };
    dispatch(handleEventClick(data));
  };

  if (event.type === "court") {
    const startTime = moment(event.start);
    const endTime = moment(event.end);
    const totalMinutes = endTime.diff(startTime, "minutes");
    numSlots = totalMinutes / 30;
  }

  return (
    <>
      {event.type === "court" ? (
        courts.map((court, i) => (
          <DisplayCourtEvent
            key={i}
            event={event}
            handleDayEventClick={handleDayEventClick}
            numSlots={numSlots}
            caseHearings={caseHearings}
            court={court}
          />
        ))
      ) : (
        <div
          className="day-event d-flex gap-3"
          style={{
            backgroundColor: event.bgColor,
            cursor: "pointer",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => handleDayEventClick()}
        >
          <div style={{ marginLeft: "15px" }}>
            <span className="event-time">
              {moment(event.start).format("HH:mm")} -{" "}
              {moment(event.end).format("HH:mm")}
            </span>
            <div
              title={event.title}
              // style={{
              //   whiteSpace: "normal",
              //   wordWrap: "break-word",
              //   overflow: "visible",
              // }}
            >
              {/* <div className="event-title" title={event.title}> */}
              {event.title}
            </div>
          </div>
          {event.isScheduled && <div className="status-icon"></div>}
        </div>
      )}
    </>
  );
}

function DisplayCourtEvent({
  event,
  handleDayEventClick,
  numSlots,
  caseHearings,
  court,
}) {
  const { schduledTasksData } = useSelector((state) => state.caseDiaryOrg);

  const courtTasks = schduledTasksData
    .filter(
      (e) =>
        moment(e.event_date).format("DD-MM-YYYY") ===
        moment(event.start).format("DD-MM-YYYY")
    )
    .filter(
      (e) =>
        JSON.parse(e.event_slot).courtDetails !== null &&
        JSON.parse(e.event_slot).courtDetails.courtId == court.courtId
    );

  return (
    <div
      className="court-event"
      style={{
        backgroundColor: event.bgColor,
        cursor: "pointer",
        minHeight: `${(numSlots / 2) * 30}px`,
        // height: `${(numSlots / 2) * 30}px`,
      }}
      onClick={() => handleDayEventClick(court)}
    >
      <div style={{ marginLeft: "15px" }}>
        {/* <span className="event-time">
          {moment(event.start).format("HH:mm")} -{" "}
          {moment(event.end).format("HH:mm")}
        </span> */}
        <div className="event-title" title={event.title}>
          {court.name || event.title}
        </div>
        {caseHearings.length > 0 && (
          <div>
            <label className="custom-label">Case Hearings</label>
            <ul>
              {caseHearings.map((e, i) => (
                <li className="custom-list" key={i}>
                  {e.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        {courtTasks.length > 0 && (
          <div className="mt-2">
            <label className="custom-label">Tasks</label>
            <ul>
              {courtTasks.map((e, i) => (
                <li className="custom-list" key={i}>
                  {e.desription}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DisplayWeekCourtEvent({
  event,
  handleDayEventClick,
  caseHearings,
  court,
}) {
  const { schduledTasksData } = useSelector((state) => state.caseDiaryOrg);

  const courtTasks = schduledTasksData
    .filter(
      (e) =>
        moment(e.event_date).format("DD-MM-YYYY") ===
        moment(event.start).format("DD-MM-YYYY")
    )
    .filter(
      (e) =>
        JSON.parse(e.event_slot).courtDetails !== null &&
        JSON.parse(e.event_slot).courtDetails.courtId == court.courtId
    );

  return (
    <div
      className="court-event"
      style={{
        backgroundColor: event.bgColor,
        cursor: "pointer",
        flexGrow: 1,
        maxHeight: "50%",
        overflow: "hidden",
      }}
      onClick={() => handleDayEventClick(court)}
    >
      <div style={{ marginLeft: "5px" }}>
        <div className="event-title" title={event.title}>
          {court.name || event.title}
        </div>
        {caseHearings.length > 0 && (
          <div>
            <label className="custom-label">Case Hearings</label>
            <ul>
              {caseHearings.map((e, i) => (
                <li className="week-custom-list" key={i}>
                  {e.title.length > 13 ? `${e.title.slice(0, 13)}...` : e.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        {courtTasks.length > 0 && (
          <div className="mt-2">
            <label className="custom-label">Tasks</label>
            <ul>
              {courtTasks.map((e, i) => (
                <li className="week-custom-list" key={i}>
                  {e.desription.length > 13
                    ? `${e.desription.slice(0, 13)}...`
                    : e.desription}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomCalendar;
