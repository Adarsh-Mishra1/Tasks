import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import userStore from "../../../zustand/userStore";
import { MasterOrg } from "../../../configs/WebService";

function MasterScheduler({ setShowMasterOrg, handleApiCalls }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);
  const [showAdditionalCheckboxes, setShowAdditionalCheckboxes] =
    useState(false);

  const [courtSelected, setCourtSelected] = useState(true);
  const [courtTimings, setCourtTimings] = useState({
    courtStart: "",
    courtEnd: "",
    breakStart: "",
    breakEnd: "",
    courtmeetings: false,
    courtCasePreparation: false,
  });
  const [beforeCourtTimings, setBeforeCourtTimings] = useState({
    beforeStart: "",
    beforeEnd: "",
    casePreparationBefore: false,
    meetingsBefore: false,
  });

  const [afterCourtTimings, setAfterCourtTimings] = useState({
    afterStart: "",
    afterEnd: "",
    meetingsAfter: false,
    casePreparationAfter: false,
  });
  const userData = userStore((state) => state.user);

  const daysMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${MasterOrg}/${userData.id}`, {
        headers: apiKeyHeader(),
      });

      const data = response.data.data[0];
      setFetchedData(data);

      const beforeCourtTimings = JSON.parse(data.before_court_timings);
      const afterCourtTimings = JSON.parse(data.after_court_timings);
      const CourtTimings = JSON.parse(data.court_timings);

      const beforeStart = beforeCourtTimings.start;
      const beforeEnd = beforeCourtTimings.end;
      const afterStart = afterCourtTimings.start;
      const afterEnd = afterCourtTimings.end;
      const courtStart = CourtTimings.courtTimings.start;
      const courtEnd = CourtTimings.courtTimings.end;
      const breakStart = CourtTimings.breakTiming.start;
      const breakEnd = CourtTimings.breakTiming.end;
      const meetingsAfter = afterCourtTimings.meeting;
      const casePreparationAfter = afterCourtTimings.casepreparation;
      const casePreparationBefore = beforeCourtTimings.casepreparation;
      const meetingsBefore = beforeCourtTimings.meeting;
      const meeting = CourtTimings.courtTimings.meeting;
      const casePreparation = CourtTimings.casePreparation;

      if (data && data.working_days) {
        const parsedWorkingDays = JSON.parse(data.working_days);

        const preselectedDays = parsedWorkingDays
          .map((dayNumber) =>
            Object.keys(daysMap).find((key) => daysMap[key] === dayNumber)
          )
          .filter(Boolean);

        setSelectedDays(preselectedDays);
      } else {
        console.warn("working_days is undefined or empty.");
      }

      setBeforeCourtTimings({
        beforeStart: beforeStart,
        beforeEnd: beforeEnd,
        casePreparationBefore: casePreparationBefore,
        meetingsBefore: meetingsBefore,
      });
      setAfterCourtTimings({
        afterStart: afterStart,
        afterEnd: afterEnd,
        meetingsAfter: meetingsAfter,
        casePreparationAfter: casePreparationAfter,
      });
      setCourtTimings({
        courtStart: courtStart,
        courtEnd: courtEnd,
        breakStart: breakStart,
        breakEnd: breakEnd,
        courtmeetings: meeting,
        courtCasePreparation: casePreparation,
      });

      if (data.court_timings) {
        const courtTimings = JSON.parse(data.court_timings);

        const isCourtSelected = courtTimings.isCourtSelected || false;
        setCourtSelected(isCourtSelected);
        setShowAdditionalCheckboxes(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleBeforeCourtTimeChange = (field, value) => {
    setBeforeCourtTimings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAfterCourtTimeChange = (field, value) => {
    setAfterCourtTimings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle day selection and show the additional tasks if any day is selected.
  const handleDayChange = (day) => {
    let updatedDays;
    if (selectedDays.includes(day)) {
      updatedDays = selectedDays.filter((d) => d !== day);
      setSelectedDays(updatedDays);
    } else {
      updatedDays = [...selectedDays, day];
      setSelectedDays(updatedDays);
    }
    setShowAdditionalCheckboxes(updatedDays.length > 0);
  };

  // Handle additional task checkbox changes.
  const handleAdditionalCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (value === "court") {
      setCourtSelected(checked);
    }
  };

  // Update timing values based on the field name.
  const handleTimeChange = (field, value) => {
    setCourtTimings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const beforeCourt = {
      start: beforeCourtTimings.beforeStart,
      end: beforeCourtTimings.beforeEnd,
      meeting: beforeCourtTimings.meetingsBefore ?? false,
      casepreparation: beforeCourtTimings.casePreparationBefore ?? false,
    };
    const afterCourt = {
      start: afterCourtTimings.afterStart,
      end: afterCourtTimings.afterEnd,
      meeting: afterCourtTimings.meetingsAfter ?? false,
      casepreparation: afterCourtTimings.casePreparationAfter ?? false,
    };
    const courtTime = {
      courtTimings: {
        start: courtTimings.courtStart,
        end: courtTimings.courtEnd,
        meeting: courtTimings.courtmeetings ?? false,
        casePreparation: courtTimings.courtCasePreparation ?? false,
      },
      breakTiming: {
        start: courtTimings.breakStart,
        end: courtTimings.breakEnd,
      },
      isCourtSelected: courtSelected,
    };

    const selectedDayNumbers = selectedDays.map((day) => daysMap[day]);
    const payload = {
      userId: userData.id,
      orgId: userData.org.id,
      workingDays: selectedDayNumbers,
      beforeTimings: beforeCourt,
      courtTimings: courtTime,
      afterTimings: afterCourt,
    };

    const payload2 = {
      userId: userData.id,
      workingDays: selectedDayNumbers,
      beforeTimings: beforeCourt,
      courtTimings: courtTime,
      afterTimings: afterCourt,
    };

    if (fetchedData) {
      try {
        const response = await axios.patch(
          `${MasterOrg}/${fetchedData.id}`,
          payload2,
          {
            headers: apiKeyHeader(),
          }
        );
        const data = response.data;
        fetchData();
      } catch (error) {
        console.log("error", error);
      }
    } else {
      try {
        const response = await axios.post(MasterOrg, payload, {
          headers: apiKeyHeader(),
        });
        const data = response.data;
        fetchData();
      } catch (error) {
        console.log("error", error);
      }
    }
    setShowMasterOrg(false);
    handleApiCalls();
  };

  return (
    <div style={{ padding: "16px" }}>
      <form onSubmit={handleSubmit}>
        <>
          <label
            style={{
              display: "block",
              marginTop: "0px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Select working Days:
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.keys(daysMap).map((day) => (
              <label
                key={day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  backgroundColor: "#e5e7eb",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                  style={{ marginRight: "8px" }}
                />
                {day}
              </label>
            ))}
          </div>

          {showAdditionalCheckboxes && (
            <>
              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Select Tasks Performed On Working Days:
                </label>
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      value="court"
                      checked={courtSelected}
                      onChange={handleAdditionalCheckboxChange}
                    />
                    Court
                  </label>
                </div> */}
              </div>

              <div style={{ marginTop: "16px" }}>
                <h6>
                  <b>Insert work timings</b>
                </h6>
                <strong>Before Court Hours:</strong>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  Activities:
                  <label>
                    <input
                      type="checkbox"
                      checked={beforeCourtTimings.meetingsBefore || false}
                      onChange={(e) =>
                        handleBeforeCourtTimeChange(
                          "meetingsBefore",
                          e.target.checked
                        )
                      }
                    />
                    &nbsp; Meetings
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        beforeCourtTimings.casePreparationBefore || false
                      }
                      onChange={(e) =>
                        handleBeforeCourtTimeChange(
                          "casePreparationBefore",
                          e.target.checked
                        )
                      }
                    />
                    &nbsp; Case Preparation
                  </label>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div>
                    <label>Start Time:</label>
                    <input
                      type="time"
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={beforeCourtTimings.beforeStart}
                      step="3600"
                      // onChange={(e) =>
                      //   handleBeforeCourtTimeChange(
                      //     "beforeStart",
                      //     e.target.value
                      //   )
                      // }
                      onChange={(e) => {
                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeCourtTimeChange(
                          "beforeStart",
                          selectedTime
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label>End Time:</label>
                    <input
                      type="time"
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={beforeCourtTimings.beforeEnd}
                      step="3600"
                      // onChange={(e) =>
                      //   handleBeforeCourtTimeChange("beforeEnd", e.target.value)
                      // }
                      onChange={(e) => {
                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeCourtTimeChange("beforeEnd", selectedTime);
                      }}
                    />
                  </div>
                </div>

                <br />
                {courtSelected && (
                  <>
                    <strong>
                      Court Hours:
                      {/* Court Hours along with specified break time: */}
                    </strong>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      Activities:
                      <label>
                        <input type="checkbox" checked={true} disabled={true} />
                        &nbsp; Court Proceedings
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={courtTimings.courtmeetings || false}
                          onChange={(e) =>
                            handleTimeChange("courtmeetings", e.target.checked)
                          }
                        />
                        &nbsp; Meetings
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={courtTimings.courtCasePreparation || false}
                          onChange={(e) =>
                            handleTimeChange(
                              "courtCasePreparation",
                              e.target.checked
                            )
                          }
                        />
                        &nbsp; Case Preparation
                      </label>
                    </div>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <strong>Court time:</strong>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div>
                          <label>Start Time:</label>
                          <input
                            type="time"
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={courtTimings.courtStart}
                            step="3600"
                            onChange={(e) => {
                              const selectedTime =
                                e.target.value.split(":")[0] + ":00";
                              handleTimeChange("courtStart", selectedTime);
                              // handleTimeChange("courtStart", e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <label>End Time:</label>
                          <input
                            type="time"
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={courtTimings.courtEnd}
                            step="3600"
                            onChange={(e) => {
                              const selectedTime =
                                e.target.value.split(":")[0] + ":00";
                              handleTimeChange("courtEnd", selectedTime);
                              // handleTimeChange("courtEnd", e.target.value)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <strong>Add Court Break timings</strong>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div>
                          <label>Start Time:</label>
                          <input
                            type="time"
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={courtTimings.breakStart}
                            onChange={(e) =>
                              handleTimeChange("breakStart", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label>End Time:</label>
                          <input
                            type="time"
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={courtTimings.breakEnd}
                            onChange={(e) =>
                              handleTimeChange("breakEnd", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div> */}
                  </>
                )}

                <br />
                <strong>After Court Hours:</strong>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  Activities:
                  <label>
                    <input
                      type="checkbox"
                      checked={afterCourtTimings.meetingsAfter || false}
                      onChange={(e) =>
                        handleAfterCourtTimeChange(
                          "meetingsAfter",
                          e.target.checked
                        )
                      }
                    />
                    &nbsp; Meetings
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={afterCourtTimings.casePreparationAfter || false}
                      onChange={(e) =>
                        handleAfterCourtTimeChange(
                          "casePreparationAfter",
                          e.target.checked
                        )
                      }
                    />
                    &nbsp; Case Preparation
                  </label>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div>
                    <label>Start Time:</label>
                    <input
                      type="time"
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={afterCourtTimings.afterStart}
                      step="3600"
                      onChange={(e) => {
                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleAfterCourtTimeChange(
                          "afterStart",
                          // e.target.value
                          selectedTime
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label>End Time:</label>
                    <input
                      type="time"
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={afterCourtTimings.afterEnd}
                      step="3600"
                      onChange={(e) => {
                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleAfterCourtTimeChange("afterEnd", selectedTime);
                        // handleAfterCourtTimeChange("afterEnd", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#10B981",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </>
      </form>
    </div>
  );
}

export default MasterScheduler;
