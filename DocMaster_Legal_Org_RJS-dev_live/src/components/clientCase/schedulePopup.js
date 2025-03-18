import { useRef, useState } from "react";

function SchedulePopup({ selectedSchDiary, onClose }) {
  const [customDates, setCustomDates] = useState(new Set([]));
  const [formData, setFormData] = useState({
    waba: true,
    email: false,
    sms: false,
  });
  const customDateRef = useRef(null);

  const tableColumns = [
    {
      Header: "Hearing Date",
      accessor: "dateTimeTxt",
    },
    {
      Header: "Purpose of Current Hearing",
      accessor: "interimOrder",
    },
    {
      Header: "Outcome",
      accessor: "heading",
    },
    {
      Header: "Attendee",
      accessor: "attende",
    },
    {
      Header: "Next Date of Hearing",
      accessor: "nextdate",
    },
    {
      Header: "Purpose of next Hearing",
      accessor: "particulars",
    },
  ];

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => onClose(false)}>
          &times;
        </button>
        <div className="container mt-4">
          {selectedSchDiary !== null && (
            <div className="table-responsive table-container"> 
            <table class="table">
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column.accessor}>{column.Header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {tableColumns.map((column) => (
                    <td>{selectedSchDiary[column.accessor]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          )}
          <div className="d-flex gap-4 mt-4">
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
                name="email"
                id="email"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.checked,
                  }));
                }}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="d-flex gap-2 text-dark fw-bold">
              <input
                type="checkbox"
                name="sms"
                id="sms"
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
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-dark fw-semibold">Reminders:</h4>
            <div className="mt-2" style={{ marginLeft: "8rem" }}>
              <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                <input type="checkbox" /> Dialy
              </div>
              <div className="d-flex gap-2 text-dark fw-semibold mb-2">
                <input type="checkbox" /> Weekly
              </div>
              <div className="d-flex gap-2 text-dark fw-semibold">
                <input type="checkbox" /> Monthly
              </div>
            </div>
            <div className="d-flex gap-2 text-dark fw-semibold mt-4">
              <h5 className="text-dark fw-semibold">Custom Date:</h5>
              <br />
              <input
                // type="datetime-local"
                type="date"
                id="customDate"
                // min={getCurrentDateTime()}
                min={new Date().toISOString().split("T")[0]}
                ref={customDateRef}
              />
              <button onClick={handleAddDate}>Add Date</button>
            </div>
          </div>

          {customDates.size > 0 && (
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

          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-outline-primary rounded-3 px-4 py-2 hover:bg-primary hover:text-white">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePopup;
