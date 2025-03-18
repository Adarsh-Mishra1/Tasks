import { useEffect, useState } from "react";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";
import { scheduleReport } from "../../configs/WebService";

function ScheduleAlert({ onClose, schedules, resetSchedules }) {
  const userData = userStore((state) => state.user);
  const [formData, setFormData] = useState({
    user_id: userData.id,
    org_id: userData.org.id,
    custom_dates: null,
    reminder_type: "alert",
    emailId: userData.email_id,
    waba: false,
    email: true,
    sms: false,
    waba_number: userData.mobile_no,
    sms_number: userData.mobile_no,
    day_time_slots: null,
    numberOfDays: null,
  });
  const [dbData] = schedules.filter((each) => each.type === "alert");

  useEffect(
    function () {
      if (dbData) {
        setFormData((prev) => ({
          ...prev,
          waba: dbData.waba_number?.length > 0 ? true : false,
          numberOfDays: JSON.parse(dbData.day_time_slots).days,
          sms: dbData.sms?.length > 0 ? true : false,
        }));
      }
    },
    [dbData]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (dbData) {
      updateSchedule();
    } else {
      putSchedule();
    }
  };

  const updateSchedule = async () => {
    const slots = {
      days: formData.numberOfDays,
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

  const putSchedule = async () => {
    const slots = {
      days: formData.numberOfDays,
    };

    const body = {
      user_id: formData.user_id,
      custom_dates: null,
      reminder_type: formData.reminder_type,
      emailId: formData.email ? formData.emailId : null,
      waba: formData.waba ? formData.waba_number : null,
      sms: formData.sms ? formData.sms_number : null,
      day_time_slots: JSON.stringify(slots),
      org_id: formData.org_id,
      type: "alert",
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

  return (
    <div className="w-100 px-4"  >
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
      <form onSubmit={handleFormSubmit} className="text-dark  w-100 mt-4">
        <div className="d-flex gap-2">
        <strong className="py-3">
          Please enter the number of days before you want to receive an alert:
        </strong>
         
        <input
          type="number"
          required
          className="form-control mt-2"
          min={1}
          style={{width:'100px', maxWidth: "100px" }}
          defaultValue={formData.numberOfDays}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              numberOfDays: e.target.value,
            }));
          }}
        />
        </div>
        <p>
          You will receive the alert at 9:00 AM, {formData.numberOfDays} days in
          advance.
        </p>
        <button type="submit" className="btn btn-primary mb-2">
          {dbData ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ScheduleAlert;
