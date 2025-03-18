import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
} from "reactstrap";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import {
  caseDiaryDocument,
  updateAdditionalData,
  WsPutCaseDiary,
  WsPutCaseDiaryNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { useAlertMessages } from "../../customHooks/caseDiaryHook";
import { addDaysToDate } from "../../OtherFunctions/OtherFunctions";
import moment from "moment";
import { useNavigate } from "react-router-dom";

// const alertValues = {
//   "To cross examine the witness":
//     "alert message for To cross examine the witness",
//   "To cross examine the complainant":
//     "alert message for To To cross examine the complainant",
//   "To cross examine the defendant":
//     "alert message for To cross examine the defendant",
//   "To decide the issues": "alert message for To decide the issues",
//   "For arguments": "alert message for For arguments",
//   "To submit the application to call the witness for cross examination":
//     "alert message for To submit the application to call the witness for cross examination",
//   Others: "alert message for Others",
// };

const PutCaseDiary = (props) => {
  const userData = userStore((state) => state.user);
  const navigate = useNavigate();
  const [documentsChecked, setDocumentsChecked] = useState({});

  const [formData, setFormData] = useState({
    attendee: "",
    hearingDate: "",
    currentPurpose: "",
    heading: "",
    otherHeading: "",
    nextDate: "",
    particulars: "",
    otherPurpose: "",
    alertMessage: "",
    alertDate: "",
  });
  const { isLoading, alertMessages, error } = useAlertMessages();
  const [noneAboveChecked, setNoneAboveChecked] = useState({
    array1: false,
    array2: false,
    array3: false,
  });

  if (error) toast.error("Error getting alert Messages", { autoClose: 3000 });

  const OutCome = [
    "Adjourned as Judge was on leave",
    "Adjourned as our number didn't came",
    "Adjourned as other party was not present",
    "Cross examined the witness",
    "Cross examined the complainant",
    "Cross examined the defendant",
    "Decided issues",
    "Arguments",
    "Submitted Application for calling witness to cross examine",
    "Final Decision",
    "Others",
  ];

  // const PurposeOfNextHearing = [
  //   "To cross examine the witness",
  //   "To cross examine the complainant",
  //   "To cross examine the defendant",
  //   "To decide the issues",
  //   "For arguments",
  //   "To submit the application to call the witness for cross examination",
  //   "Others",
  // ];

  useEffect(
    function () {
      let alertMessage,
        alertDate = null;
      if (
        alertMessages &&
        formData.particulars?.length > 0 &&
        formData.hearingDate?.length > 0
      ) {
        const selectedValue = alertMessages?.find(
          (each) => each.alert_field_value === formData.particulars
        );
        alertMessage = selectedValue?.alert_message || null;
        alertDate = selectedValue
          ? selectedValue.days == 0
            ? null
            : addDaysToDate(formData.hearingDate, selectedValue.days)
          : "";
      } else if (alertMessages && formData.particulars?.length > 0) {
        const selectedValue = alertMessages?.find(
          (each) => each.alert_field_value === formData.particulars
        );
        alertMessage = selectedValue?.alert_message || null;
      }
      // in progress
      if (props.caseDiaryLength === 0) {
        const selectedValue = alertMessages?.find(
          (each) => each.alert_field_value === formData.particulars
        );
        alertDate = selectedValue
          ? selectedValue.days == 0
            ? null
            : addDaysToDate(formData.nextDate, selectedValue.days)
          : "";
      }
      setFormData((prev) => ({
        ...prev,
        alertMessage: alertMessage,
        alertDate: alertDate,
      }));
    },
    [
      formData.particulars,
      alertMessages,
      formData.hearingDate,
      props.caseDiaryLength,
      formData.nextDate,
    ]
  );

  useEffect(
    function () {
      if (props.isEditing) {
        const alertMessage =
          alertMessages?.find(
            (each) => each.alert_field_value === props.caseDiary.particulars
          ) || null;
        setFormData({
          hearingDate: props.caseDiary.dateTime
            ? formatToInputDate(props.caseDiary.dateTime)
            : "",
          currentPurpose: props.caseDiary.interimOrder || "",
          attendee: props.caseDiary.attende || "",
          heading: OutCome.includes(props.caseDiary.heading)
            ? props.caseDiary.heading
            : "Others",
          otherHeading: props.caseDiary.heading || "",
          nextDate: formatToInputDate(props.caseDiary.nextdate) || "",
          particulars: alertMessage ? alertMessage.alert_field_value : "Others",
          otherPurpose: props.caseDiary.particulars || "",
        });
      }
    },
    [props.caseDiary]
  );

  useEffect(
    function () {
      if (props.isAdding && props.lastCaseDiary !== null) {
        setFormData({
          hearingDate: props.lastCaseDiary.nextdate
            ? formatDate(props.lastCaseDiary.nextdate)
            : "",
          currentPurpose: props.lastCaseDiary.particulars
            ? props.lastCaseDiary.particulars
            : "",
          // currentPurpose: props.lastCaseDiary.interimOrder
          //   ? props.lastCaseDiary.interimOrder
          //   : "",
        });
      }
    },
    [props.lastCaseDiary]
  );

  useEffect(
    function () {
      if (props.nextHearing !== null) {
        // setFormData({ nextDate: formatToInputDate(props.nextHearing) });
        setFormData((prev) => ({
          ...prev,
          nextDate: formatToInputDate(props.nextHearing),
        }));
      }
    },
    [props.nextHearing]
  );

  const formatToInputDate = (dateString) => {
    const date = new Date(dateString);
    // return !isNaN(date.getTime());
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const submitCaseDiary = async (e) => {
    e.preventDefault();

    try {
      // Fetch user statistics to check the case limits
      const response = await fetch(
        `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
        { headers: apiKeyHeader() }
      );
      const data = await response.json();

      const caseProblemInfoTotal =
        data.resultMessage[0]?.case_hearing_dairy_total; // Default to 0 if null
      const caseHearingDiary = data.resultMessage[0]?.case_Hearing_Dairy ?? 0; // Default to 0 if null

      console.log("case_probleminfo_total:", caseProblemInfoTotal);
      console.log("case_Hearing_Diary:", caseHearingDiary);

      // Check if the limits for problem info or hearing diary are exceeded
      // if (caseHearingDiary !== 0 && caseHearingDiary < caseProblemInfoTotal) {
      //   console.log("case_Hearing_Diary:", caseHearingDiary);
      //   alert("You have exceeded the maximum limit for hearing diaries.");
      //   return; // Exit the function if the limit is exceeded, preventing the post API
      // }

      // Proceed with validation and submission if the limits are not exceeded
      if (props.displayField) {
        if (formData?.heading?.length <= 2) {
          alert("Enter Heading");
        } else if (
          formData?.particulars?.length <= 2 &&
          formData?.otherPurpose?.length === 0
        ) {
          alert("Enter particulars");
        } else if (formData.attendee?.length <= 2) {
          alert("Enter attendee");
        } else if (
          formData.hearingDate?.length <= 2 &&
          props.lastCaseDiary === null
        ) {
          alert("Enter Hearing date");
        } else if (formData.nextDate?.length <= 2) {
          alert("Enter next hearing date");
        } else {
          putCaseDiary(); // Only call the post API if all validations pass
        }
      } else {
        if (
          formData?.particulars?.length <= 2 &&
          formData?.otherPurpose?.length === 0
        ) {
          alert("Enter particulars");
        } else if (formData.nextDate?.length <= 2) {
          alert("Enter next hearing date");
        } else {
          putCaseDiary(); // Only call the post API if all validations pass
        }
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      alert("Failed to fetch user statistics. Please try again.");
    }
  };

  function putCaseDiary() {
    const body = {
      id: props.caseDiary?.id != undefined ? props.caseDiary?.id : null,
      heading:
        formData.heading === "Others"
          ? formData.otherHeading
          : formData.heading,
      particulars:
        formData.particulars === "Others"
          ? formData.otherPurpose
          : formData.particulars || "",
      previousdate: formData.previousDate,
      dateTime: formData.hearingDate ? formData.hearingDate + " 00:00:00" : "",
      attende: formData.attendee,
      nextdate: formData.nextDate,
      caseId: props.clientCase.id,
      userId: userData.id,
      interimOrder: formData.currentPurpose || "",
    };

    axios
      .post(WsPutCaseDiaryNew, JSON.stringify(body), {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("putCaseDiary_responseData_253: ", responseData);
        if (responseData.resultCode === 1) {
          // handle additional API here
          handleAdditionalData(responseData.dataId.id);
          // props.onPutCaseDiary(true);
        } else {
          alert(`${responseData.resultMessage}`);
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          props.onPutCaseDiary(false);
        }
      })
      .catch((error) => {
        console.error("putCaseDiary_error", error);
      });
  }

  const handleAdditionalData = async (id) => {
    const payload = {
      id: id.toString(),
      remarks: `${formData.alertMessage}`,
      legalDeadlineDate: `${formData.alertDate}`,
    };
    try {
      const response = await fetch(updateAdditionalData, {
        method: "POST",
        headers: apiKeyHeader(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      createCaseDiaryDocument(id);

      // props.onPutCaseDiary(true);
    } catch (error) {
      console.error("Error updating additional data:", error);
    }
  };

  const createCaseDiaryDocument = async (id) => {
    if (
      !documentsChecked ||
      Object.values(documentsChecked).every((value) => !value)
    ) {
      props.onPutCaseDiary(true);
      return;
    }

    try {
      const requests = Object.entries(documentsChecked)
        .filter(([_, value]) => value)
        .map(async ([key, value]) => {
          const payload = {
            caseId: props.clientCase.id,
            caseDiaryId: id,
            documentName: key,
          };

          try {
            const response = await fetch(caseDiaryDocument, {
              method: "POST",
              headers: apiKeyHeader(),
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
          } catch (error) {
            console.error(`Error uploading document (${key}):`, error);
            return null;
          }
        });

      await Promise.all(requests.filter(Boolean));
      navigate("/caseDiary", {
        state: {
          nextHearingDate: formData.nextDate,
          caseDiaryId: id,
        },
      });
    } catch (error) {
      console.error("Error in createCaseDiaryDocument:", error);
    }
  };

  const handleDocumentCheckBoxChange = (e, arrayKey) => {
    const { name, checked } = e.target;

    setDocumentsChecked((prevState) => ({
      ...prevState,
      [name]: checked,
    }));

    // If any checkbox is selected, uncheck "None of the Above"
    if (checked) {
      setNoneAboveChecked((prev) => ({
        ...prev,
        [arrayKey]: false,
      }));
    }
  };

  // Function to handle "None of the Above" selection
  const handleNoneOfTheAboveChange = (event, array, arrayKey) => {
    const isChecked = event.target.checked;

    setNoneAboveChecked((prev) => ({
      ...prev,
      [arrayKey]: isChecked,
    }));

    if (isChecked) {
      setDocumentsChecked((prevState) => {
        const uncheckedValues = array.reduce(
          (acc, item) => {
            acc[item] = false;
            return acc;
          },
          { ...prevState }
        );

        console.log("Unchecked values:", uncheckedValues);
        return uncheckedValues;
      });
    }
  };

  if (isLoading) return <div>isLoading..</div>;

  return (
    <Form onSubmit={submitCaseDiary}>
      {/* {!isEditMode && props.resultMessageLength >= 1 && (
        <FormGroup row>
          <Label htmlFor="particulars" sm={2}>
            Previous date of Hearing
          </Label>
          <Col sm={10}>
            <Input
              type="date"
              className="form-control"
              id="previousDate"
              name="previousDate"
              value={formData.previousDate || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              readOnly
              required
            />
          </Col>
        </FormGroup>
      )} */}

      {/* {props.lastCaseDiary === null && ( */}
      {props.displayField && (
        <FormGroup row>
          <Label htmlFor="dateTime" sm={2}>
            Current Date of Action/Hearing
          </Label>
          <Col sm={10}>
            <Input
              type="date"
              className="form-control"
              id="hearingDate"
              name="hearingDate"
              value={formData?.hearingDate || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              // disabled
            />
          </Col>
        </FormGroup>
      )}
      {/* <FormGroup row>
        <Label htmlFor="currentPurpose" sm={2}>
          Purpose of Hearing
        </Label>
        <Col sm={10}>
          <Input
            type="text"
            className="form-control"
            id="currentPurpose"
            name="currentPurpose"
            value={formData?.currentPurpose || null}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
            required
          />
        </Col>
      </FormGroup> */}
      {props.displayField && (
        <FormGroup row>
          <Label htmlFor="particulars" sm={2}>
            Attendee
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              className="form-control"
              id="attendee"
              name="attendee"
              placeholder="Write the names of the advocate and parties who attended the court proceedings"
              value={formData?.attendee || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              minLength={3}
              maxLength={600}
              required
            />
          </Col>
        </FormGroup>
      )}
      {props.displayField && (
        <FormGroup row>
          <Label htmlFor="heading" sm={2}>
            Outcome/Todays Result
          </Label>
          <Col sm={10}>
            <Input
              type="select"
              className="form-control"
              id="heading"
              name="heading"
              value={formData?.heading || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              required
            >
              <option value="">Select a result</option>
              <option value="Adjourned as Judge was on leave">
                Adjourned as Judge was on leave
              </option>
              <option value="Adjourned as our number didn't came">
                Adjourned as our number didn't came
              </option>
              <option value="Adjourned as other party was not present">
                Adjourned as other party was not present
              </option>
              <option value="Cross examined the witness">
                Cross examined the witness
              </option>
              <option value="Cross examined the complainant">
                Cross examined the complainant
              </option>
              <option value="Cross examined the defendant">
                Cross examined the defendant
              </option>
              <option value="Decided issues">Decided issues</option>
              <option value="Arguments">Arguments</option>
              <option value="Submitted Application for calling witness to cross examine">
                Submitted Application for calling witness to cross examine
              </option>
              <option value="Final Decision">Final Decision</option>
              <option value="Others">Others</option>
              {![
                "Adjourned as Judge was on leave",
                "Adjourned as our number didn't came",
                "Adjourned as other party was not present",
                "Cross examined the witness",
                "Cross examined the complainant",
                "Cross examined the defendant",
                "Decided issues",
                "Arguments",
                "Submitted Application for calling witness to cross examine",
                "Final Decision",
                "Others",
              ].includes(formData.heading) &&
                formData.heading && (
                  <option value={formData.heading}>{formData.heading}</option>
                )}
            </Input>
          </Col>
        </FormGroup>
      )}
      {formData.heading === "Others" && props.displayField && (
        <FormGroup row className="mt-2">
          <Label htmlFor="otherHeading" sm={2}>
            Specify Outcome
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              className="form-control"
              id="otherHeading"
              name="otherHeading"
              value={formData?.otherHeading || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              minLength={3}
              maxLength={200}
              placeholder="Enter Result"
            />
          </Col>
        </FormGroup>
      )}
      {
        <FormGroup row>
          <Label htmlFor="nextDateTime" sm={2}>
            Next Date of Action/Hearing
          </Label>
          <Col sm={10}>
            <Input
              type="date"
              className="form-control"
              id="nextDate"
              name="nextDate"
              value={formData?.nextDate || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </Col>
        </FormGroup>
      }
      {
        <FormGroup row>
          <Label htmlFor="particulars" sm={2}>
            Purpose of Next Action/Hearing
          </Label>
          <Col sm={10}>
            <Input
              type="select"
              className="form-control"
              id="particulars"
              name="particulars"
              value={formData?.particulars || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              required
            >
              <option value="">Select Purpose</option>

              {/* {PurposeOfNextHearing.map((each) => (
              <option value={each}>{each}</option>
            ))} */}
              {alertMessages.map((each) => (
                <option value={each.alert_field_value}>
                  {each.alert_field_value}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
      }
      {formData?.particulars === "Others" && (
        <FormGroup row>
          <Label htmlFor="otherPurpose" sm={2}>
            Specify Other Purpose
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              className="form-control"
              id="otherPurpose"
              name="otherPurpose"
              value={formData?.otherPurpose || null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              placeholder="Enter the purpose"
            />
          </Col>
        </FormGroup>
      )}

      {formData.alertDate && (
        <FormGroup row>
          <Label htmlFor="date" sm={2}>
            Legal Deadline Date
          </Label>
          <Col sm={10}>
            <Input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={moment(formData.alertDate, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              )}
              disabled
            />
          </Col>
        </FormGroup>
      )}
      {formData.alertMessage && (
        <FormGroup row>
          <Label htmlFor="alert" sm={2}>
            Alert
          </Label>
          <Col sm={10}>
            <Input
              // type="text"
              type="textarea"
              className="form-control"
              id="alert"
              name="alert"
              value={formData.alertMessage}
              disabled
            />
          </Col>
        </FormGroup>
        //   )}
        // </>
      )}

      <DisplayCheckBoxes
        setDocumentsChecked={setDocumentsChecked}
        documentsChecked={documentsChecked}
        handleDocumentCheckBoxChange={handleDocumentCheckBoxChange}
        handleNoneOfTheAboveChange={handleNoneOfTheAboveChange}
        noneAboveChecked={noneAboveChecked}
      />
      {/* <button type="submit" className="btn btn-primary">
        Submit
      </button> */}
      <div className=" row ms-0 me-0">
        <div className="col-md-12 text-end p-0">
          <button className="btn btn-primary m-0" type="submit">
            Submit
          </button>
          {/* <button className="btn btn-primary m-0" onClick={submitCaseDiary}>
            Submit
          </button> */}
        </div>
      </div>
    </Form>
  );
};

function DisplayCheckBoxes({
  handleDocumentCheckBoxChange,
  handleNoneOfTheAboveChange,
  documentsChecked,
  noneAboveChecked,
}) {
  const [display, setDisplay] = useState(false);
  const array1 = [
    "Notice",
    "Reply to Notice",
    "Complaint, Plaint, or Application",
    "Reply to a Complaint, Plaint, or Application",
    "Rejoinder",
    "Pleadings and Motions",
    "Affidavit",
    "Other Litigation Documents",
  ];

  const array2 = [
    "Power of Attorney",
    "Contracts or Agreements",
    "Non Disclosure Agreement",
    "Intellectual Property Documents",
    "Others",
  ];

  const array3 = [
    "Will",
    "Rent Deed",
    "Sale Deed",
    "Agreement to Sell",
    "Other Property Related Documents",
  ];

  const handleCheckBoxChange = (e) => {
    setDisplay(e.target.checked);
  };

  return (
    <div>
      <span className="d-flex">
        Proposed List of Documents: &nbsp;
        <input type="checkbox" onChange={handleCheckBoxChange} />
      </span>
      {display && (
        <div
          className="mt-2 ms-6 proposed-List"
          style={{
            marginLeft: "205px",
            color: "black",
          }}
        >
          <li className="mb-2">
            <strong>Litigation Documents</strong>
          </li>
          <div className="row g-1">
            {array1.map((each, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <label className="d-flex align-items-center gap-1">
                  <input
                    type="checkbox"
                    name={each}
                    checked={!!documentsChecked[each]}
                    onChange={(e) => handleDocumentCheckBoxChange(e, "array1")}
                  />
                  {/* {each === "Others Litigation" ? "Other" : each} */}
                  {each}
                </label>
              </div>
            ))}
            <div className="col-12 ps-2">
            <label className="d-flex ps-1 align-items-center gap-1  ">
              <input
                type="checkbox"
                name="None of the Above_array1"
                checked={noneAboveChecked.array1}
                onChange={(event) =>
                  handleNoneOfTheAboveChange(event, array1, "array1")
                }
              />
              None of the Above
            </label>
            </div>
          </div>
          <br />
          <li>
            <strong>Other Documents</strong>
          </li>
          <div className="row g-1">
            {array2.map((each, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    name={each}
                    checked={!!documentsChecked[each]}
                    onChange={(e) => handleDocumentCheckBoxChange(e, "array2")}
                  />{" "}
                  {each}
                </label>
              </div>
            ))}
            <div className="col-12 ps-2">
            <label className="d-flex ps-1 align-items-center gap-1">
              <input
                type="checkbox"
                name="None of the Above_array2"
                checked={noneAboveChecked.array2}
                onChange={(event) =>
                  handleNoneOfTheAboveChange(event, array2, "array2")
                }
              />
              None of the Above
            </label>
            </div>
          </div>
          <br />
          <li>
            <strong>Property-Related Documents</strong>
          </li>
          <div className="row g-1">
            {array3.map((each, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    name={each}
                    checked={!!documentsChecked[each]}
                    onChange={(e) => handleDocumentCheckBoxChange(e, "array3")}
                  />{" "}
                  {/* {each === "Other Property-Related" ? "Other" : each} */}
                  {each}
                </label>
              </div>
            ))}
            <div className="col-12 ps-2">
            <label className="d-flex ps-1 align-items-center gap-1">
              <input
                type="checkbox"
                name="None of the Above_array3"
                checked={noneAboveChecked.array3}
                onChange={(event) =>
                  handleNoneOfTheAboveChange(event, array3, "array3")
                }
              />
              None of the Above
            </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PutCaseDiary;
