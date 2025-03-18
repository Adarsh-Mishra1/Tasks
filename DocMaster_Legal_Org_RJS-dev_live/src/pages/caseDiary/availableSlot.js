import React, { useEffect, useState } from "react";
import moment from "moment";
import { SchedulerTask } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

const AvailableSlots = ({
  OrganiserData,
  colors,
  scheduleTaskData,
  handleSubmitScheduleEvent,
}) => {
  const userData = userStore((state) => state.user);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const now = new Date();

    const latestEventDate = new Date(
      Math.max(...OrganiserData.map((event) => new Date(event.start)))
    );

    const eventsInRange = OrganiserData.filter(({ start, eventType }) => {
      const eventDate = new Date(start);
      return (
        eventType === 6 && eventDate >= now && eventDate <= latestEventDate
      );
    }).sort((a, b) => new Date(a.start) - new Date(b.start));

    setFilteredEvents(eventsInRange);
  }, [OrganiserData]);

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = new Date(event.start).toLocaleDateString();
    (acc[dateKey] ||= []).push(event);
    return acc;
  }, {});

  async function handleSlotClick(event) {
    const startMoment = moment(event.start);
    const endMoment = moment(event.end);

    const formattedStart = startMoment.format("HH:mm");
    const formattedEnd = endMoment.format("HH:mm");

    const message = `Are you sure you want to reschedule the task to:\n\nFrom: ${formattedStart}\nTo: ${formattedEnd}`;

    const userConfirmed = window.confirm(message);

    if (userConfirmed) {
      const timings = {
        start: formattedStart,
        end: formattedEnd,
      };

      const rescheduleDate = startMoment.format("YYYY-MM-DD");

      const payload = {
        timings: timings,
        date: rescheduleDate,
      };

      console.log("User confirmed rescheduling. Payload:", payload);
      console.log("event_31: ", event);
      console.log("scheduleTaskData_32: ", scheduleTaskData);

      const eventDate = moment(event.start).format("YYYY-MM-DD");
      const eventSlot = {
        start: moment(event.start).format("HH:mm"),
        end: moment(event.end).format("HH:mm"),
      };

      const body = {
        userId: userData.id,
        eventDate,
        eventSlot,
        eventType: scheduleTaskData.schduledEventType,
        description: scheduleTaskData.description,
      };

      try {
        const response = await fetch(
          `${SchedulerTask}/${scheduleTaskData.id}`,
          {
            method: "PATCH",
            headers: apiKeyHeader(),
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update scheduler status"
          );
        }
        const result = await response.json();
        handleSubmitScheduleEvent();
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  return (
    <div style={{ textAlign: "left", padding: "20px" }}>
      <div
        style={{
          marginTop: "0px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          width: "90%",
          maxHeight: "320px",
          overflowY: "auto",
        }}
      >
        <h6 style={{ marginBottom: "15px" }}>Available Slots</h6>
        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([date, events], index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h5 style={{ fontWeight: "bold", color: "#333" }}>
                {new Date(date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {events.map((event, idx) => {
                  const backgroundColor =
                    colors.find((each) => each.condition === event.eventType)
                      ?.color || "blue";

                  return (
                    <div
                      key={idx}
                      // onClick={() => console.log("Slot clicked:", event)}
                      onClick={() => handleSlotClick(event)}
                      style={{
                        backgroundColor,
                        color: "#fff",
                        padding: "2px",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "10px",
                        boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                        transition: "0.3s",
                        width: "90px",
                      }}
                    >
                      <strong>{event.title}</strong>
                      <p style={{ marginTop: "3px", fontSize: "10px" }}>
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(event.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>
            <b>No slots available.</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailableSlots;
