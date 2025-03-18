import { useEffect, useRef, useState } from "react";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";
import { scheduleReport } from "../../configs/WebService";

function SchedulePopup({ onClose, schedules, resetSchedules }) {
  const userData = userStore((state) => state.user);
  const [customDates, setCustomDates] = useState(new Set([]));
  const [formData, setFormData] = useState({
    user_id: userData.id,
    org_id: userData.org.id,
    custom_dates: null,
    reminder_type: "weekly",
    emailId: userData.email_id,
    waba: false,
    email: true,
    sms: false,
    waba_number: userData.mobile_no,
    sms_number: userData.mobile_no,
    day_time_slots: null,
    selectedDay: "",
    selectedTime: "",
  });
  const customDateRef = useRef(null);
  const [dbData] = schedules.filter((each) => each.type === "report");

  useEffect(
    function () {
      if (dbData) {
        setFormData((prev) => ({
          ...prev,
          waba: dbData.waba_number?.length > 0 ? true : false,
          sms: dbData.sms?.length > 0 ? true : false,
          reminder_type: dbData.reminder_type,
          selectedDay: JSON.parse(dbData.day_time_slots).day,
          selectedTime: JSON.parse(dbData.day_time_slots).time,
        }));
      }
    },
    [dbData]
  );

  const handleAddDate = (e) => {
    e.preventDefault();
    if (customDateRef.current?.value)
      setCustomDates((prev) => new Set([...prev, customDateRef.current.value]));
  };

  const handleRemoveDate = (date) => {
    setCustomDates((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(date);
      return updatedSet;
    });
  };

  const handleReminderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      reminder_type: e.target.value,
      day_time_slots: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.reminder_type === "daily" &&
      formData.day_time_slots === null
    ) {
      return alert("Please select a time.");
    }

    if (formData.reminder_type === "weekly") {
      if (!formData.selectedDay) {
        return alert("Please select a day of the week.");
      }

      // if (!formData.selectedTime) {
      //   return alert("Please select a time.");
      // }
    }

    if (formData.reminder_type === "monthly") {
      if (!formData.day_time_slots) {
        return alert("Please select both a date and time.");
      }

      if (!formData.day_time_slots.date) {
        return alert("Please select a day of the month.");
      }

      if (!formData.day_time_slots.time) {
        return alert("Please select a time.");
      }
    }

    if (dbData) {
      updateSchedule();
    } else {
      putSchedule();
    }
  };

  const putSchedule = async () => {
    const selectedDates =
      formData.reminder_type === "custom"
        ? customDates.size > 0
          ? JSON.stringify([...customDates])
          : null
        : null;

    const slots = {
      day: formData.selectedDay,
      time: formData.selectedTime,
    };

    const body = {
      user_id: formData.user_id,
      custom_dates: selectedDates,
      reminder_type: formData.reminder_type,
      emailId: formData.email ? formData.emailId : null,
      waba: formData.waba ? formData.waba_number : null,
      sms: formData.sms ? formData.sms_number : null,
      day_time_slots: JSON.stringify(slots),
      org_id: formData.org_id,
      type: "report",
    };

    const loader = toast.success("Loading...", { autoClose: false });
    try {
      const response = await fetch(scheduleReport, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }
      const data = await response.json();
      await toast.dismiss(loader);
      toast.success(data.message, { autoClose: 2000 });
      onClose(false);
      resetSchedules();
    } catch (err) {
      console.error("Error_76: ", err);
      await toast.dismiss(loader);
      toast.error(err.message || "Something went wrong", { autoClose: 2000 });
    }
  };

  const updateSchedule = async () => {
    const [dbData] = schedules.filter((each) => each.type === "report");

    const slots = {
      day: formData.selectedDay,
      time: formData.selectedTime,
    };

    const body = {
      id: dbData.id,
      reminder_type: formData.reminder_type,
      waba: formData.waba ? formData.waba_number : null,
      sms: formData.sms ? formData.sms_number : null,
      day_time_slots: JSON.stringify(slots),
    };

    const loader = toast.success("Updating...", { autoClose: false });
    try {
      const response = await fetch(scheduleReport, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }
      const data = await response.json();
      await toast.dismiss(loader);
      toast.success(data.message, { autoClose: 2000 });
      resetSchedules();
    } catch (err) {
      console.error("Error_83: ", err);
      await toast.dismiss(loader);
      toast.error(err.message || "Something went wrong", { autoClose: 2000 });
    }
  };

  return (
    <div>
      <div
        className="modal fade show"
        style={{
          display: "block",
        }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "800px" }}
        >
          <div className="modal-content" style={{ height: "550px" }}>
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Schedule Report
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => onClose(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="w-100 px-4" style={{ overflow: "auto" }}>
              <div className="d-flex gap-4 mt-4">
                <div className="d-flex gap-2 text-dark fw-bold">
                  <input
                    type="checkbox"
                    name="email"
                    id="email"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.checked,
                      }));
                    }}
                    checked={formData.email}
                    value={formData.emailId}
                    disabled
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="d-flex gap-2 text-dark fw-bold">
                  <input
                    type="checkbox"
                    name="waba"
                    id="waba"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.checked,
                      }));
                    }}
                    checked={formData.waba}
                  />
                  <label htmlFor="waba">Whatsapp</label>
                </div>

                <div className="d-flex gap-2 text-dark fw-bold">
                  <input
                    type="checkbox"
                    name="sms"
                    id="sms"
                    checked={formData.sms}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.checked,
                      }));
                    }}
                  />
                  <label htmlFor="sms">SMS</label>
                </div>
              </div>

              <div className="d-flex flex-column mt-4">
                {formData.email && (
                  <div className="d-flex gap-3">
                    <label
                      className="text-md text-dark fw-semibold"
                      style={{ minWidth: "120px" }}
                    >
                      Email:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      style={{ width: "300px", height: "30px" }}
                      defaultValue={formData.emailId}
                      disabled
                    />
                  </div>
                )}
                {formData.waba && (
                  <div className="d-flex gap-3 mt-3">
                    <label
                      className="text-md text-dark fw-semibold"
                      style={{ minWidth: "120px" }}
                    >
                      Whatsapp:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      style={{ width: "300px", height: "30px" }}
                      defaultValue={formData.waba_number}
                      disabled
                    />
                  </div>
                )}
                {formData.sms && (
                  <div className="d-flex gap-3 mt-3">
                    <label
                      className="text-md text-dark fw-semibold"
                      style={{ minWidth: "120px" }}
                    >
                      SMS:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      style={{ width: "300px", height: "30px" }}
                      defaultValue={formData.sms_number}
                      disabled
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-dark fw-semibold mb-2">
                  Schedule the report generation:
                </h4>
                <div className="d-flex gap-5">
                  {/* <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                    <input
                      type="radio"
                      id="daily"
                      name="reminder"
                      value="daily"
                      checked={formData.reminder_type === "daily"}
                      onChange={handleReminderChange}
                    />
                    <label htmlFor="daily">Daily</label>
                  </div> */}
                  <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                    <input
                      type="radio"
                      id="weekly"
                      name="reminder"
                      value="weekly"
                      checked={formData.reminder_type === "weekly"}
                      onChange={handleReminderChange}
                    />
                    <label htmlFor="weekly">Weekly</label>
                  </div>
                  {/* <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                    <input
                      type="radio"
                      id="monthly"
                      name="reminder"
                      value="monthly"
                      checked={formData.reminder_type === "monthly"}
                      onChange={handleReminderChange}
                    />
                    <label htmlFor="monthly">Monthly</label>
                  </div> */}
                  {/* <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                    <input
                      type="radio"
                      id="custom"
                      name="custom"
                      value="custom"
                      checked={formData.reminder_type === "custom"}
                      onChange={handleReminderChange}
                    />
                    <label htmlFor="custom">Custom Date</label>
                  </div> */}
                </div>
                {formData.reminder_type === "custom" && (
                  <div className="d-flex gap-2 text-dark fw-semibold mt-4">
                    <h5 className="text-dark fw-semibold">Custom Date:</h5>
                    <br />
                    <input
                      type="date"
                      id="customDate"
                      min={new Date().toISOString().split("T")[0]}
                      ref={customDateRef}
                    />
                    <button onClick={handleAddDate}>Add Date</button>
                  </div>
                )}
                {formData.reminder_type === "daily" && (
                  <div>
                    <label for="time-input">Please select a time:</label>
                    <input
                      type="time"
                      id="time-input"
                      name="time-input"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          day_time_slots: { time: e.target.value },
                        }));
                      }}
                    />
                  </div>
                )}
                {formData.reminder_type === "weekly" && (
                  <div className="d-flex gap-2 justify-content-start w-100">
                    <label htmlFor="day-select my-2  py-2 align-content-center">
                      Please select a day of the week:
                    </label>
                    <select
                      className="form-control rounded w-50"
                      style={{ borderRadius: "4px" }}
                      id="day-select"
                      name="day-select"
                      value={formData.selectedDay}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          selectedDay: e.target.value,
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Select a day
                      </option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    &nbsp;&nbsp;
                    {/* <label htmlFor="time-input">Please select a time:</label>
                    <input
                      type="time"
                      id="time-input"
                      name="time-input"
                      value={formData.selectedTime}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          selectedTime: e.target.value,
                        }));
                      }}
                    /> */}
                  </div>
                )}
                {formData.reminder_type === "monthly" && (
                  <div>
                    <label htmlFor="date-select">
                      Please select a day of the month:
                    </label>
                    <select
                      id="date-select"
                      name="date-select"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          day_time_slots: {
                            ...prev.day_time_slots,
                            date: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Select a day
                      </option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    &nbsp;&nbsp;
                    <label htmlFor="time-input">Please select a time:</label>
                    <input
                      type="time"
                      id="time-input"
                      name="time-input"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          day_time_slots: {
                            ...prev.day_time_slots,
                            time: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                )}
              </div>

              {customDates.size > 0 && formData.reminder_type === "custom" && (
                <div className="mt-3">
                  <h6 className="fw-semibold text-dark">Selected Dates:</h6>
                  <div className="ms-5 d-flex">
                    {[...customDates].map((date, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-2 text-dark fw-medium"
                      >
                        {date}
                        <span
                          onClick={() => handleRemoveDate(date)}
                          className="bg-danger text-white rounded-circle d-inline-flex justify-content-center align-items-center"
                          style={{ cursor: "pointer", width: "10px" }}
                        >
                          &times;
                        </span>
                        <b>,</b>&nbsp;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className=" justify-content-center mt-4">
                <p>
                  You will receive the report at 9:00 AM every{" "}
                  {formData.selectedDay}.
                </p>
                <button
                  className="btn btn-primary px-4 py-2 "
                  onClick={handleSubmit}
                >
                  {dbData ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default SchedulePopup;
