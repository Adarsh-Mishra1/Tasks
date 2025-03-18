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
import { WsPutCaseEvent } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import CreateNote from "../stickyNotes/createNote";
import { createSticktNote } from "../stickyNotes/stickyNotesApi";
import { useDispatch } from "react-redux";

const PutCaseEvent = (props) => {
  const userData = userStore((state) => state.user);
  const dispatch = useDispatch();
  const [formattedDate, setFormattedDate] = useState("");
  const [extend, setExtend] = useState(false);

  useEffect(() => {
    if (props?.caseEvent?.dateTime) {
      const [day, month, year] = props.caseEvent.dateTime.split("-");
      setFormattedDate(`${year}-${month}-${day}`);
    }
  }, [props?.caseEvent?.dateTime]);

  let detailRef = useRef();
  let dateTimeRef = useRef();
  // console.log("props.caseEvent",props.caseEvent)
  const submitCaseEvent = async (e, noteBody) => {
    e.preventDefault();
  
    try {
      // Fetch user statistics to check case events total
      const response = await fetch(
        `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
        { headers: apiKeyHeader() }
      );
      const data = await response.json();

      // Assuming the API response contains case_events_total (maximum allowed events)
      const caseEventsTotal = data.resultMessage[0]?.case_events_total; // Default to 0 if null
      const currentEvents = data.resultMessage[0]?.events; // Default to 0 if null

      console.log("Total case events allowed:", caseEventsTotal);
      console.log("Current case events:", currentEvents);

      // Check if currentEvents exceeds the limit, but allow when it's 0
      // if (currentEvents !== 0 && currentEvents <= caseEventsTotal) {
      //     alert("You have exceeded the maximum number of case events.");
      //     return; // Exit the function if the limit is exceeded
      // }

      // Validate form fields
      if (
        detailRef.current.value == null ||
        detailRef.current.value == undefined ||
        detailRef.current.value.length <= 2
      ) {
        alert("Enter Detail");
      } else if (
        dateTimeRef.current.value == null ||
        dateTimeRef.current.value == undefined ||
        dateTimeRef.current.value.length < 2
      ) {
        alert("Provide a Valid Date Time");
      } else {
        // Proceed to submit the case event if validation passes
        console.log("detailRef.current.value", detailRef.current.value);
        console.log(
          "dateTimeRef.current.value",
          dateTimeRef.current.value.replace("T", " ").replace("Z", "") + ":00"
        );
        await putCaseEvent(noteBody); // Proceed with event submission
      }
    } catch (error) {
      console.error("Error fetching case event data:", error);
      alert("Failed to fetch case event data. Please try again.");
    }
  };
  
  function putCaseEvent(noteBody) {
    axios
      .post(
        WsPutCaseEvent,
        JSON.stringify({
          id: props.caseEvent?.id != undefined ? props.caseEvent?.id : null,
          dateTime:
            dateTimeRef.current.value.replace("T", " ").replace("Z", "") +
            ":00",
          caseId: props.clientCase.id,
          detail: detailRef.current.value,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (noteBody !== null) {
            addNote(noteBody);
          } else {
            props.onPutCaseEvent(true);
          }
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          props.onPutCaseEvent(false);
        }
      })
      .catch((error) => {
        console.error("putCaseEvent_error", error);
      });
  }

  const addNote = async (body) => {
    const addLoader = toast.success("Creating Note...", { autoClose: false });
    try {
      await dispatch(createSticktNote(body)).unwrap();
      if (addLoader) toast.dismiss(addLoader);
      toast.success("Note Created Successfully.");
      props.onPutCaseEvent(true);
    } catch (error) {
      if (addLoader) toast.dismiss(addLoader);
      toast.error(`${error.message}`);
    }
  };

  return (
    <div>
      <FormGroup row>
        <Label htmlFor="dateTime" sm={2}>
          Date
        </Label>
        <Col sm={6}>
          <Input
            type="date"
            // type="datetime-local"
            className="form-control"
            id="dateTime"
            name="dateTime"
            aria-describedby="dateTime"
            innerRef={dateTimeRef}
            // defaultValue={
            //   props?.caseEvent?.dateTime ? props?.caseEvent?.dateTime : ""
            // }
            defaultValue={formattedDate}
            minLength={16}
            maxLength={25}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label htmlFor="detail" sm={2}>
          Details
        </Label>
        <Col sm={6}>
          <Input
            type="textarea"
            className="form-control"
            id="detail"
            name="detail"
            aria-describedby="detail"
            innerRef={detailRef}
            defaultValue={
              props?.caseEvent?.detail ? props?.caseEvent?.detail : ""
            }
            // value={title}
            // onChange={(e) => {
            //   setTitle(e.target.value);
            // }}
            minLength={3}
            maxLength={256}
            required
          />
        </Col>
      </FormGroup>

      {!props?.caseEvent && (
        <FormGroup row>
          <Label sm={2}></Label>
          <Col sm={6}>
            <Input
              type="checkbox"
              className="form-check-input"
              id={"key"}
              name={"key"}
              checked={extend}
              onChange={(e) => setExtend(e.target.checked)}
            />
            <Label className="form-check-label" htmlFor={"key"}>
              Event Required for Further Use
            </Label>
          </Col>
        </FormGroup>
      )}

      {extend && (
        <CreateNote
          clientCase={props.clientCase}
          submitCaseEvent={submitCaseEvent}
          // addNote={addNote}
        />
      )}

      {/* <button type="submit" className="btn btn-primary">
        Submit
      </button> */}
      {!extend && (
        <div
          className="text-center btn btn-sm btn-primary m-0"
          style={{
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          // onClick={submitCaseEvent}
          onClick={(e) => {
            e.preventDefault();
            submitCaseEvent(e, null);
          }}
        >
          Save the details
        </div>
      )}
    </div>
  );
};

export default PutCaseEvent;
