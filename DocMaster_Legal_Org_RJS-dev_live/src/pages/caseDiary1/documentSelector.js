import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { caseDiaryDocument, SchedulerTask } from "../../configs/WebService";
import moment from "moment";
import userStore from "../../zustand/userStore";

const DocumentSelector = ({
  OrganiserData,
  colors,
  caseDiaryId,
  nextHearingDate,
  handleSubmitCaseDiaryDocEvent,
}) => {
  const userData = userStore((state) => state.user);
  const [documentData, setDocumentData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${caseDiaryDocument}/${caseDiaryId}`,
          { headers: apiKeyHeader() }
        );
        setDocumentData(response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }
    fetchData();
  }, []);

  const handleCheckboxChange = (doc) => {
    setSelectedDoc(selectedDoc === doc ? null : doc);
  };

  const now = new Date();
  let dbEndDate = moment(nextHearingDate).subtract(1, "day").endOf("day");
  const endDate = new Date(dbEndDate.format("YYYY-MM-DDTHH:mm:ss"));

  const filteredEvents = OrganiserData.filter(({ start, eventType }) => {
    const eventDate = new Date(start);
    return (
      eventType === 6 &&
      (eventDate.toDateString() !== now.toDateString() || eventDate >= now)
    );
  }).sort((a, b) => new Date(a.start) - new Date(b.start));

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = new Date(event.start).toLocaleDateString();
    (acc[dateKey] ||= []).push(event);
    return acc;
  }, {});

  const allDates = Array.from(
    { length: (endDate - now) / (1000 * 60 * 60 * 24) + 1 },
    (_, i) => new Date(now.getTime() + i * 86400000).toLocaleDateString()
  );

  function handleSlotClick(event) {
    if (!selectedDoc) return;

    // Check if the same timing exists in selectedSlots
    const existingIndex = selectedSlots.findIndex(
      (slot) =>
        slot.event.start === event.start &&
        slot.event.end === event.end &&
        slot.selectedDoc.id === selectedDoc.id
    );

    if (existingIndex !== -1) {
      setSelectedSlots((prevSlots) =>
        prevSlots.filter((_, index) => index !== existingIndex)
      );
      console.log("Removed Selected Slot:", event);
      return;
    }

    // Check if the timing exists for another document
    const isDuplicateForOtherDoc = selectedSlots.some(
      (slot) =>
        slot.event.start === event.start &&
        slot.event.end === event.end &&
        slot.selectedDoc.id !== selectedDoc.id
    );

    if (isDuplicateForOtherDoc) {
      alert(
        `This slot has already been selected for the document: ${
          selectedSlots.find(
            (slot) =>
              slot.event.start === event.start && slot.event.end === event.end
          )?.selectedDoc.document_name
        }.`
      );
      return;
    }

    // Otherwise, add the new selection
    const newEntry = { selectedDoc, event };

    setSelectedSlots((prevSlots) => [...prevSlots, newEntry]);
    console.log("Updated Selected Slots:", [...selectedSlots, newEntry]);
  }

  const handleSubmit = () => {
    const missingDocs = documentData.filter(
      (doc) => !selectedSlots.some((slot) => slot.selectedDoc.id === doc.id)
    );

    if (missingDocs.length > 0) {
      alert(
        `Please select at least one slot for: ${missingDocs
          .map((doc) => doc.document_name)
          .join(", ")}`
      );
      return;
    }

    createTask(selectedSlots);
  };

  const createTask = async (selectedSlots) => {
    console.log("selectedSlots_125: ", selectedSlots);

    const requests = selectedSlots.map(async (each) => {
      const eventDate = moment(each.event.start).format("YYYY-MM-DD");
      const startTime = moment(each.event.start).format("HH:mm");
      const endTime = moment(each.event.end).format("HH:mm");

      const payload = {
        userId: userData.id,
        orgId: userData.org.id,
        eventDate,
        eventSlot: {
          start: startTime,
          end: endTime,
          case_diary_id: each.selectedDoc.case_diary_id,
          doc_id: each.selectedDoc.id,
        },
        description: each.selectedDoc.document_name,
        eventType: "caseDiaryDoc",
      };
      try {
        const response = await axios.post(SchedulerTask, payload, {
          headers: apiKeyHeader(),
        });
        if (response.status !== 201) {
          return alert("Error scheduling task. Contact the team.");
        }

        return response;
      } catch (error) {
        alert("Error scheduling task. Contact the team.");
        console.error("Axios Error:", error);
        return null;
      }
    });

    await Promise.all(requests.filter(Boolean));
    handleSubmitCaseDiaryDocEvent();
  };

  return (
    <div style={{ textAlign: "left", padding: "20px" }}>
      {documentData.map((doc, index) => (
        <div key={index}>
          <label style={{ fontSize: "16px", fontWeight: "bold" }}>
            {doc.document_name}
          </label>
          <input
            type="checkbox"
            checked={selectedDoc === doc}
            onChange={() => handleCheckboxChange(doc)}
            style={{ marginLeft: "10px" }}
          />

          {selectedDoc === doc && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                width: "90%",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              <h6 style={{ marginBottom: "15px" }}>Available Slots</h6>

              {allDates.map((date, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <h5 style={{ fontWeight: "bold", color: "#333" }}>
                    {new Date(date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h5>

                  {groupedEvents[date]?.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(80px, 1fr))",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      {groupedEvents[date].map((event, index) => {
                        const isSelected = selectedSlots.some(
                          (slot) =>
                            slot.event.start === event.start &&
                            slot.event.end === event.end
                        );

                        let backgroundColor = isSelected
                          ? "#bfbfbf"
                          : colors.find(
                              (each) => each.condition === event.eventType
                            )?.color || "blue";

                        return (
                          <div
                            key={index}
                            onClick={() => handleSlotClick(event)}
                            style={{
                              backgroundColor,
                              color: "#fff",
                              padding: "2px",
                              borderRadius: "6px",
                              textAlign: "center",
                              cursor: "pointer",
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
                  ) : (
                    <p>
                      <b>No slots available.</b>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default DocumentSelector;
