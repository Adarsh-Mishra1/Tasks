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
import { WsPutCaseDiary } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { useAlertMessages } from "../../customHooks/caseDiaryHook";
import { addDaysToDate } from "../../OtherFunctions/OtherFunctions";

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
          ? addDaysToDate(formData.hearingDate, selectedValue.days)
          : "";
      }
      setFormData((prev) => ({
        ...prev,
        alertMessage: alertMessage,
        alertDate: alertDate,
      }));
    },
    [formData.particulars, alertMessages, formData.hearingDate]
  );

  useEffect(
    function () {
      if (props?.caseDiary?.heading?.length > 0 && props.isEditing) {
        const alertMessage =
          alertMessages?.find(
            (each) => each.alert_field_value === props.caseDiary.particulars
          ) || null;
        setFormData({
          hearingDate: formatToInputDate(props.caseDiary.dateTime) || "",
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
          currentPurpose: props.lastCaseDiary.interimOrder
            ? props.lastCaseDiary.interimOrder
            : "",
        });
      }
    },
    [props.lastCaseDiary]
  );

  const formatToInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const submitCaseDiary = (e) => {
    e.preventDefault();
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
      putCaseDiary();
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
      dateTime: formData.hearingDate + " 00:00:00",
      attende: formData.attendee,
      nextdate: formData.nextDate,
      caseId: props.clientCase.id,
      userId: userData.id,
      interimOrder: formData.currentPurpose || "",
    };

    axios
      .post(WsPutCaseDiary, JSON.stringify(body), {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("putCaseDiary_responseData", responseData);
        if (responseData.resultCode === 1) {
          props.onPutCaseDiary(true);
        } else {
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

      {props.lastCaseDiary === null && (
        <FormGroup row>
          <Label htmlFor="dateTime" sm={2}>
            Current Hearing Date
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
              "Others",
            ].includes(formData.heading) &&
              formData.heading && (
                <option value={formData.heading}>{formData.heading}</option>
              )}
          </Input>
        </Col>
      </FormGroup>
      {formData.heading === "Others" && (
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

      <FormGroup row>
        <Label htmlFor="nextDateTime" sm={2}>
          Next Date of Hearing
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

      <FormGroup row>
        <Label htmlFor="particulars" sm={2}>
          Purpose of Next Hearing
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
              value={formData.alertDate}
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
              type="text"
              className="form-control"
              id="alert"
              name="alert"
              value={formData.alertMessage}
              disabled
            />
          </Col>
        </FormGroup>
      )}

      {/* <button type="submit" className="btn btn-primary">
        Submit
      </button> */}
      <div className=" ms-0 me-0">
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

export default PutCaseDiary;
