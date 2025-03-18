import { useEffect, useState } from "react";
import "../css/masterorg.css";
import userStore from "../../../zustand/userStore";
import { MasterOrg } from "../../../configs/WebService";
import { apiKeyHeader } from "../../../configs/ApiKeys";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateMasterOrg,
  GetMasterorg,
  UpdateMasterOrg,
} from "../../../components/redux/caseDiaryOrg/CaseDiaryOrgThunks";
import {
  handleMasterOrgModal,
  initialMasterOrgState,
} from "../../../components/redux/caseDiaryOrg/CaseDiaryOrgSlice";

const checkBoxes = [
  { name: "monday", title: "Monday", value: 1 },
  { name: "tuesday", title: "Tuesday", value: 2 },
  { name: "wednesday", title: "Wednesday", value: 3 },
  { name: "thursday", title: "Thursday", value: 4 },
  { name: "friday", title: "Friday", value: 5 },
  { name: "saturday", title: "Saturday", value: 6 },
  { name: "sunday", title: "Sunday", value: 0 },
];

function MasterOrg1() {
  const userData = userStore((state) => state.user);
  const { masterOrgData, loader, error } = useSelector(
    (state) => state.caseDiaryOrg
  );
  const dispatch = useDispatch();

  const [formData, setFormdata] = useState(masterOrgData);

  useEffect(
    function () {
      setFormdata(masterOrgData);
    },
    [masterOrgData]
  );

  const handleDropdownChange = (e) => {
    setFormdata((prev) => {
      const newCourtCount = Number(e.target.value);
      let updatedCourtDetails = [...prev.court.courtDetails];

      if (newCourtCount > updatedCourtDetails.length) {
        for (let i = updatedCourtDetails.length; i < newCourtCount; i++) {
          updatedCourtDetails.push({
            courtId: i + 1,
            name: "",
            workingDays: [],
          });
        }
      } else {
        updatedCourtDetails = updatedCourtDetails.slice(0, newCourtCount);
      }

      return {
        ...prev,
        court: {
          ...prev.court,
          noOfCourts: e.target.value,
          courtDetails: updatedCourtDetails,
          ...(e.target.value === "1" && { courts: "single" }),
        },
      };
    });
  };

  const handleInputChange = (value, e) => {
    setFormdata((prev) => ({
      ...prev,
      court: {
        ...prev.court,
        courtDetails: prev.court.courtDetails.map((each) =>
          each.courtId === e.courtId ? { ...each, name: value } : each
        ),
      },
    }));
  };

  const handleCheckBoxChange = (e, data) => {
    setFormdata((prev) => ({
      ...prev,
      court: {
        ...prev.court,
        courtDetails: prev.court.courtDetails.map((each) =>
          each.courtId === data.courtId
            ? {
                ...each,
                workingDays: e.target.checked
                  ? [...each.workingDays, Number(e.target.value)]
                  : each.workingDays.filter(
                      (day) => Number(day) !== Number(e.target.value)
                    ),
              }
            : each
        ),
      },
    }));
  };

  const handleBeforeAfterCheckboxChange = (e, name, type) => {
    setFormdata((prev) => {
      if (type === "court.courtTimings") {
        return {
          ...prev,
          court: {
            ...prev.court,
            courtTimings: {
              ...prev.court.courtTimings,
              [name]: e.target.checked,
            },
          },
        };
      } else {
        return {
          ...prev,
          [type]: {
            ...prev[type],
            [name]: e.target.checked,
          },
        };
      }
    });
  };

  const handleBeforeAfterTimeChange = (value, name, type) => {
    setFormdata((prev) => {
      if (type === "court.courtTimings") {
        return {
          ...prev,
          court: {
            ...prev.court,
            courtTimings: {
              ...prev.court.courtTimings,
              [name]: value,
            },
          },
        };
      } else {
        return {
          ...prev,
          [type]: { ...prev[type], [name]: value },
        };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const unFilledCourts = formData.court.courtDetails.filter(
      (e) => e.workingDays.length === 0 || e.name.trim().length === 0
    );

    if (unFilledCourts.length > 0) {
      const alertMessage = unFilledCourts
        .map((court) => court.name.trim() || "[Unnamed Court]")
        .join(", ");
      alert(
        `Please ensure all courts have a name and at least one working day selected. Missing details found for: ${alertMessage}.`
      );
      return;
    }
    const beforeTimings =
      formData.before?.start?.length > 0 && formData.before?.end?.length > 0;
    const afterTimings =
      formData.after?.start?.length > 0 && formData.after?.end?.length > 0;
    const courtTimings =
      formData.court?.courtTimings?.start?.length > 0 &&
      formData.court?.courtTimings?.end?.length > 0;

    if (!beforeTimings)
      return alert("Please enter timings for before court hours.");
    if (!afterTimings)
      return alert("Please enter timings for after court hours.");
    if (!courtTimings) return alert("Please enter timings for court hours.");

    const workingDays = [
      ...new Set(formData.court.courtDetails.map((e) => e.workingDays).flat()),
    ];

    const body = {
      userId: userData.id,
      orgId: userData.org.id,
      workingDays,
      beforeTimings: formData.before,
      courtTimings: formData.court,
      afterTimings: formData.after,
    };

    if (formData.isfetched !== null) {
      dispatch(UpdateMasterOrg({ body, id: formData.isfetched }));
    } else {
      dispatch(CreateMasterOrg(body));
    }
  };

  if (error?.orgError !== null) {
    alert(`${error.orgError}`);
  }

  return (
    <MasterPopup>
      <div
        className="d-flex flex-column gap-3"
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "0px",
          paddingBottom: "5px",
        }}
      >
        {loader.orgLoader ? (
          <div>Loading..!!</div>
        ) : (
          <>
            <div className="box-1">
              <div className="d-flex gap-3 m-2">
                <div className="d-flex align-items-center gap-2">
                  <input
                    className="custom-radio-btn"
                    type="radio"
                    name="options"
                    id="single"
                    onChange={(e) => {
                      setFormdata((prev) => ({
                        ...prev,
                        court: {
                          ...prev.court,
                          courts: "single",
                          noOfCourts: "1",
                          courtDetails:
                            initialMasterOrgState.court.courtDetails,
                        },
                      }));
                    }}
                    checked={formData?.court?.courts === "single" || false}
                  />
                  <label className="radio-label" htmlFor="single">
                    Single
                  </label>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input
                    className="custom-radio-btn"
                    type="radio"
                    name="options"
                    id="multiple"
                    onChange={(e) => {
                      setFormdata((prev) => ({
                        ...prev,
                        court: { ...prev.court, courts: "multiple" },
                      }));
                    }}
                    checked={formData?.court?.courts === "multiple" || false}
                  />
                  <label className="radio-label" htmlFor="multiple">
                    Multiple
                  </label>
                </div>

                {formData?.court?.courts === "multiple" && (
                  <div className="custom-dropdown-container">
                    <label className="radio-label">
                      Select Number of Courts
                    </label>

                    <select
                      className="ms-2 custom-dropdown"
                      value={formData?.court?.noOfCourts}
                      onChange={handleDropdownChange}
                    >
                      <option value="1">Select No of Courts</option>
                      {/* <option value="1">1</option> */}
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                )}
              </div>
              {formData?.court?.courtDetails?.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex gap-3 mt-1">
                    <label className="radio-label custom-heading">
                      Enter Court Names
                    </label>
                    {formData.court?.courtDetails?.map((each, i) => (
                      <input
                        name={`court-name-${i + 1}`}
                        key={i + 1}
                        type="text"
                        className="custom-input"
                        value={each.name}
                        placeholder=" Enter Court Name"
                        onChange={(e) =>
                          handleInputChange(e.target.value, each)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="m-2">
                {formData?.court?.courtDetails?.length &&
                  formData.court.courtDetails.map((each, i) => (
                    <div>
                      <label className="radio-label">
                        {i + 1}. {each.name}
                      </label>
                      <div className="ms-5 d-flex gap-3">
                        {checkBoxes.map(({ name, title, value }) => (
                          <CheckBox
                            name={`court${i + 1}-${name}`}
                            title={title}
                            value={value}
                            isChecked={each.workingDays.includes(value)}
                            key={`court1-${name}`}
                            onChangeFun={(e) => {
                              const isChecked = e.target.checked;
                              const daySelectedInOtherCourts =
                                formData.court.courtDetails.some((court) =>
                                  court.workingDays.includes(Number(value))
                                );

                              if (isChecked && daySelectedInOtherCourts) {
                                if (
                                  !window.confirm(
                                    "This day is already selected for another court. Are you sure you want to select this day for two courts?"
                                  )
                                ) {
                                  return;
                                }
                              }

                              handleCheckBoxChange(e, each);
                            }}
                            // onChangeFun={(e) => handleCheckBoxChange(e, each)}
                            disabled={
                              formData.court.courtDetails
                                .filter((e) => e.courtId !== each.courtId)
                                .filter((e) =>
                                  e.workingDays.includes(Number(value))
                                ).length >= 2
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* bottom sub cards */}
            <div className="custom-disable">
              <label className="radio-label custom-heading">
                Insert Work Timings
              </label>
              <div className="d-flex flex-row gap-3 justify-content-between">
                {/* before */}
                <div
                  className="card"
                  style={{
                    backgroundColor: "#90ee90b5",
                    // backgroundColor: "lightgreen"
                  }}
                >
                  <label className="radio-label custom-heading">
                    Before Court Hours
                  </label>
                  <br />
                  <label className="radio-label">Activities</label>
                  <div className="mt-2">
                    <CheckBox
                      name="before-meeting"
                      value="meeting"
                      title="Meetings"
                      isChecked={formData?.before?.meeting}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(e, "meeting", "before")
                      }
                    />
                    <CheckBox
                      name="before-case-prep"
                      value="case-preparation"
                      title="Case Preparation"
                      isChecked={formData?.before?.casepreparation}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(
                          e,
                          "casepreparation",
                          "before"
                        )
                      }
                    />
                  </div>
                  <div className="mt-3">
                    <label className="radio-label">Start Time</label>
                    <input
                      type="time"
                      step="3600"
                      className="custom-time ms-2"
                      value={formData?.before?.start}
                      max="09:59"
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );

                        if (selectedHour >= 10) {
                          alert("Please select a time before 10 AM!");
                          return;
                        }

                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "start",
                          "before"
                        );
                      }}
                    />

                    {/* <br /> */}
                    <label className="radio-label mt-1">End Time </label>
                    <input
                      type="time"
                      step="3600"
                      className="custom-time ms-2"
                      value={formData?.before?.end}
                      // min={formData.before.start}
                      // max="10:59"
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );
                        const startHour = parseInt(
                          formData.before.start.split(":")[0],
                          10
                        );

                        if (!formData.before.start) {
                          return alert("Please select a start time.");
                        }

                        if (selectedHour <= startHour) {
                          alert("End time must be greater than Start time!");
                          return;
                        }

                        if (selectedHour > 10) {
                          alert("End time must be before 10 AM!");
                          return;
                        }

                        const selectedTime =
                          selectedHour.toString().padStart(2, "0") + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "end",
                          "before"
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className="radio-label mt-3">
                      Please select timings before 10 AM
                    </label>
                  </div>
                </div>

                {/* court */}
                <div
                  className="card"
                  style={{
                    backgroundColor: "#ffb3ff96",
                    // backgroundColor: "#ffb3ff",
                    // backgroundColor: "#E6C8E6"
                  }}
                >
                  <label className="radio-label custom-heading">
                    Court Hours
                  </label>
                  <label className="radio-label mt-2">Activities</label>
                  <div className="mt-2">
                    <CheckBox
                      name="court-proceedings"
                      value="court-proceeding"
                      title="Court Proceedings"
                      disabled={true}
                    />
                    <CheckBox
                      name="court-meeting"
                      value="meeting"
                      title="Meetings"
                      isChecked={formData?.court?.courtTimings?.meeting}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(
                          e,
                          "meeting",
                          "court.courtTimings"
                        )
                      }
                    />
                    <CheckBox
                      name="court-case-prep"
                      value="case-preparation"
                      title="Case Preparation"
                      isChecked={formData?.court?.courtTimings?.casepreparation}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(
                          e,
                          "casepreparation",
                          "court.courtTimings"
                        )
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <label className="radio-label">Start Time</label>
                    <input
                      type="time"
                      className="custom-time ms-1"
                      step="3600"
                      value={formData?.court?.courtTimings?.start}
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );

                        if (selectedHour < 10 || selectedHour > 17) {
                          alert("Please select a time between 10 AM and 5 PM!");
                          return;
                        }

                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "start",
                          "court.courtTimings"
                        );
                      }}
                    />

                    {/* <br /> */}
                    <label className="radio-label mt-1">End Time</label>
                    <input
                      type="time"
                      className="custom-time ms-1"
                      step="3600"
                      value={formData?.court?.courtTimings?.end}
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );
                        const startHour = parseInt(
                          formData.court.courtTimings.start.split(":")[0],
                          10
                        );

                        if (!formData.court.courtTimings.start) {
                          return alert("Please select a start time.");
                        }

                        if (selectedHour <= startHour) {
                          alert("End time must be greater than Start time!");
                          return;
                        }

                        if (selectedHour > 17) {
                          alert("End time must be before 5 PM!");
                          return;
                        }

                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "end",
                          "court.courtTimings"
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className="radio-label mt-2">
                      Please select timings between 10 AM and 5 PM.
                    </label>
                  </div>
                </div>

                {/* after */}
                <div
                  className="card"
                  style={{
                    backgroundColor: "#90ee90b5",
                    // backgroundColor: "lightgreen"
                  }}
                >
                  <label className="radio-label custom-heading">
                    After Court Hours
                  </label>
                  <br />
                  <label className="radio-label">Activities</label>
                  <div className="mt-2">
                    <CheckBox
                      name="after-meeting"
                      value="meeting"
                      title="Meetings"
                      isChecked={formData?.after?.meeting}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(e, "meeting", "after")
                      }
                    />
                    <CheckBox
                      name="after-case-prep"
                      value="case-preparation"
                      title="Case Preparation"
                      isChecked={formData?.after?.casepreparation}
                      onChangeFun={(e) =>
                        handleBeforeAfterCheckboxChange(
                          e,
                          "casepreparation",
                          "after"
                        )
                      }
                    />
                  </div>
                  <div className="mt-3">
                    <label className="radio-label">Start Time</label>
                    <input
                      type="time"
                      className="custom-time ms-2"
                      step="3600"
                      value={formData?.after?.start}
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );

                        if (selectedHour < 17) {
                          alert("Please select a time after 5 PM!");
                          return;
                        }

                        const selectedTime =
                          e.target.value.split(":")[0] + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "start",
                          "after"
                        );
                      }}
                    />

                    {/* <br /> */}
                    <label className="radio-label mt-1">End Time </label>
                    <input
                      type="time"
                      className="custom-time ms-2"
                      step="3600"
                      value={formData?.after?.end}
                      onChange={(e) => {
                        const selectedHour = parseInt(
                          e.target.value.split(":")[0],
                          10
                        );
                        const startHour = parseInt(
                          formData.after.start.split(":")[0],
                          10
                        );

                        if (!formData.after.start) {
                          return alert("Please select a start time.");
                        }

                        if (selectedHour <= startHour) {
                          alert("End time must be greater than Start time!");
                          return;
                        }

                        if (selectedHour < 17) {
                          alert("End time must be after 5 PM!");
                          return;
                        }

                        const selectedTime =
                          selectedHour.toString().padStart(2, "0") + ":00";
                        handleBeforeAfterTimeChange(
                          selectedTime,
                          "end",
                          "after"
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className="radio-label mt-3">
                      Please select timings after 5 PM
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="d-flex flex-column gap-3 align-items-center"
              style={{ padding: "0px 20px" }}
            >
              <button
                className="btn btn-primary"
                style={{ width: "100px" }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </MasterPopup>
  );
}

function MasterPopup({ children }) {
  const dispatch = useDispatch();

  const handleModalClose = () => {
    dispatch(handleMasterOrgModal(false));
  };

  return (
    <div className="text-black">
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
          style={{ maxWidth: "1000px" }}
        >
          <div
            className="modal-content rounded-4"
            style={{ minHeight: "650px" }}
          >
            <div className="modal-header" style={{ borderBottom: "none" }}>
              <h6 className="modal-title" id="exampleModalLabel">
                <b>Master</b>
              </h6>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleModalClose}
              ></button>
            </div>
            <div
              // className="container p-2"
              style={
                {
                  // overflow: "hidden",
                }
              }
            >
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

function CheckBox({
  name,
  value,
  title,
  onChangeFun,
  disabled = false,
  isChecked = false,
}) {
  return (
    <div className="d-flex align-items-center gap-1">
      <input
        className="custom-checkbox"
        type="checkbox"
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChangeFun}
        checked={isChecked}
      />
      <label className="radio-label" htmlFor={name}>
        {title}
      </label>
    </div>
  );
}

export default MasterOrg1;
