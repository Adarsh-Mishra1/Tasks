import React, { useState } from "react";
import Popup from "./Popup";

import ScheduleTask from "./taskOrganiser/scheduleTask";
import { apiKeyHeader } from "../../configs/ApiKeys";
import axios from "axios";
import { SchedulerTask, SchedulerTaskStatus } from "../../configs/WebService";
import AvailableSlots from "./availableSlot";

function EditScheduleTask({
  scheduleTaskData,
  handleSubmitScheduleEvent,
  masterOrg,
  OrganiserData,
  colors,
}) {
  const [selectedOption, setSelectedOption] = useState("updateStatus");

  const handleDeleteEvent = (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "Are you sure you want to delete the scheduled task?"
    );

    if (confirmation) deleteTask();
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

      handleSubmitScheduleEvent();
    } catch (error) {
      alert("Error scheduling task. Contact the team.");
      console.error("Axios Error:", error);
    }
  };

  function inProgress() {
    callApi(1);
  }

  const completeSchedule = async () => {
    callApi(0);
  };

  const callApi = async (status) => {
    try {
      const response = await fetch(SchedulerTaskStatus, {
        method: "PATCH",
        headers: apiKeyHeader(),
        body: JSON.stringify({
          id: scheduleTaskData.id,
          status,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update scheduler status"
        );
      }
      const result = await response.json();
      handleSubmitScheduleEvent();
      console.log("Success:", result.message);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="d-flex gap-4 p-2">
        <label>
          <input
            type="radio"
            name="taskOption"
            value="updateStatus"
            checked={selectedOption === "updateStatus"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          &nbsp; Update Status
        </label>

        <label>
          <input
            type="radio"
            name="taskOption"
            value="editTask"
            checked={selectedOption === "editTask"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          &nbsp;Edit Task
        </label>

        <label>
          <input
            type="radio"
            name="taskOption"
            value="removeTask"
            checked={selectedOption === "removeTask"}
            onChange={(e) => {
              handleDeleteEvent(e);
            }}
          />
          &nbsp;Remove Task
        </label>

        <label>
          <input
            type="radio"
            name="taskOption"
            value="rescheduleTask"
            checked={selectedOption === "rescheduleTask"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          &nbsp;Reschedule Task
        </label>
      </div>

      <div className="mt-4">
        {selectedOption === "updateStatus" && (
          <div>
            <div style={{ display: "flex", marginLeft: "12px" }}>
              <button
                onClick={inProgress}
                style={{
                  backgroundColor: "blue",
                  color: "#fff",
                  borderStyle: "none",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                In Progress
              </button>
              <button
                onClick={completeSchedule}
                style={{
                  backgroundColor: "blue",
                  color: "#fff",
                  borderStyle: "none",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                Completed
              </button>
            </div>
          </div>
        )}

        {selectedOption === "editTask" && (
          <div>
            <ScheduleTask
              scheduleTaskData={scheduleTaskData}
              handleSubmitScheduleEvent={handleSubmitScheduleEvent}
              masterOrg={masterOrg}
            />
          </div>
        )}

        {selectedOption === "removeTask" && (
          <div>
            <h4>Remove Task</h4>
            <p>Are you sure you want to remove this task?</p>
          </div>
        )}

        {selectedOption === "rescheduleTask" && (
          <div>
            <AvailableSlots
              OrganiserData={OrganiserData}
              colors={colors}
              scheduleTaskData={scheduleTaskData}
              handleSubmitScheduleEvent={handleSubmitScheduleEvent}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EditScheduleTask;
