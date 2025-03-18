import { useState, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WsPutCaseLaw } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const PutCaseLaw = (props) => {
  const recId = props?.caseLaw?.id != undefined ? props?.caseLaw?.id : null;
  let caseUidRef = useRef();
  let partiesNameRef = useRef();
  let courtRef = useRef();
  let judgementDateRef = useRef();
  let judgesRef = useRef();
  let headnoteRef = useRef();
  let judicialHistoryRef = useRef();
  let referredAuthoritiesRef = useRef();
  let courtJudgmentRef = useRef();
  let caseOutcomeRef = useRef();
  let representationRef = useRef();
  let linkRef = useRef();

  /*String partiesName;
   * String court;
   * String judgementDate;
   * String judges;
   * String headnote;
   * String judicialHistory;
   * String referredAuthorities;
   * String courtJudgment;
   * String caseOutcome;
   * String representation;
   * String link;
   * int isPublished;*/

  const submitPutCaseLaw = (e) => {
    e.preventDefault();
    if (
      caseUidRef.current.value == undefined ||
      caseUidRef.current.value.length <= 0
    ) {
      alert("Provide Case Law Uid");
    } else if (
      partiesNameRef.current.value == undefined ||
      partiesNameRef.current.value.length <= 0
    ) {
      alert("Provide Parties Name");
    } else if (
      courtRef.current.value == undefined ||
      courtRef.current.value.length <= 0
    ) {
      alert("Provide court");
    } else if (
      judgementDateRef.current.value == undefined ||
      judgementDateRef.current.value.length <= 0
    ) {
      alert("Provide All Researches");
    } else if (
      judgesRef.current.value == undefined ||
      judgesRef.current.value.length <= 0
    ) {
      alert("Provide judges");
    } else if (
      headnoteRef.current.value == undefined ||
      headnoteRef.current.value.length <= 0
    ) {
      alert("Provide headnote");
    } else if (
      judicialHistoryRef.current.value == undefined ||
      judicialHistoryRef.current.value.length <= 0
    ) {
      alert("Provide judicial History");
    } else if (
      referredAuthoritiesRef.current.value == undefined ||
      referredAuthoritiesRef.current.value.length <= 0
    ) {
      alert("Provide referred Authorities");
    } else if (
      courtJudgmentRef.current.value == undefined ||
      courtJudgmentRef.current.value.length <= 0
    ) {
      alert("Provide court Judgement");
    } else if (
      caseOutcomeRef.current.value == undefined ||
      caseOutcomeRef.current.value.length <= 0
    ) {
      alert("Provide case Outcome");
    } else if (
      representationRef.current.value == undefined ||
      representationRef.current.value.length <= 0
    ) {
      alert("Provide representation");
    } else {
      proceed2putCaseLaw();
    }
  };

  const proceed2putCaseLaw = () => {
    axios
      .post(
        WsPutCaseLaw,
        JSON.stringify({
          userId: props.userData.id,
          id: recId != undefined ? recId : null,
          caseUid: caseUidRef.current.value,
          partiesName: partiesNameRef.current.value,
          court: courtRef.current.value,
          judgementDate: judgementDateRef.current.value,
          judges: judgesRef.current.value,
          headnote: headnoteRef.current.value,
          judicialHistory: judicialHistoryRef.current.value,
          referredAuthorities: referredAuthoritiesRef.current.value,
          courtJudgment: courtJudgmentRef.current.value,
          caseOutcome: caseOutcomeRef.current.value,
          representation: representationRef.current.value,
          link:
            linkRef?.current?.value != undefined &&
            linkRef?.current?.value.length > 2
              ? linkRef.current.value
              : null,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        console.log("WsPutCaseLaw_response_", response.data);
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (props.onReturn != undefined) {
            props.onReturn(responseData);
          }
        } else {
          alert(responseData.resultMessage);
          props.onReturn(null);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <div className="my-2">
    <Form onSubmit={submitPutCaseLaw} method="post">
      <FormGroup className="mb-3" row>
    <Label sm={2}>Case Law UID</Label>
    <Col sm={10}>
      <Input
        type="text"
        name="caseLawUid"
        id="caseUid"
        placeholder="Case Law UID"
        defaultValue={props?.caseLaw?.caseUid}
        minLength={4}
        maxLength={100}
        innerRef={caseUidRef}
        required
      />
    </Col>
  </FormGroup>

      <FormGroup className="mb-3" row>
        <Label sm={2}>Parties Name</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="partiesName"
            id="partiesName"
            placeholder="Parties Name"
            defaultValue={props?.caseLaw?.partiesName}
            minLength={3}
            maxLength={200}
            innerRef={partiesNameRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Court</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="court"
            id="court"
            placeholder="court"
            defaultValue={props?.caseLaw?.court}
            minLength={2}
            maxLength={300}
            innerRef={courtRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>All Researches</Label>
        <Col sm={10}>
          <Input
            type="date"
            name="judgementDate"
            id="judgementDate"
            placeholder="All Researches"
            defaultValue={props?.caseLaw?.judgementDate}
            minLength={8}
            maxLength={12}
            innerRef={judgementDateRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Judges</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="judges"
            id="judges"
            placeholder="judges"
            defaultValue={props?.caseLaw?.judges}
            minLength={3}
            maxLength={200}
            innerRef={judgesRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Headnote</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="headnote"
            id="headnote"
            placeholder="headnote"
            defaultValue={props?.caseLaw?.headnote}
            minLength={5}
            maxLength={400}
            innerRef={headnoteRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Judicial History</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="judicialHistory"
            id="judicialHistory"
            placeholder="Judicial History"
            defaultValue={props?.caseLaw?.judicialHistory}
            minLength={2}
            maxLength={1000}
            innerRef={judicialHistoryRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Referred Authorities</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="referredAuthorities"
            id="referredAuthorities"
            placeholder="referredAuthorities"
            defaultValue={props?.caseLaw?.referredAuthorities}
            minLength={2}
            maxLength={1000}
            innerRef={referredAuthoritiesRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Court Judgement</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="courtJudgment"
            id="courtJudgment"
            placeholder="Court Judgement"
            defaultValue={props?.caseLaw?.courtJudgment}
            minLength={2}
            maxLength={2000}
            innerRef={courtJudgmentRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Case Outcome</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="caseOutcome"
            id="caseOutcome"
            placeholder="Case Outcome"
            defaultValue={props?.caseLaw?.caseOutcome}
            minLength={2}
            maxLength={1000}
            innerRef={caseOutcomeRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Representation</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="representation"
            id="representation"
            placeholder="Representation"
            defaultValue={props?.caseLaw?.representation}
            minLength={2}
            maxLength={400}
            innerRef={representationRef}
            required
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label sm={2}>Link</Label>
        <Col sm={10}>
          <Input
            type="url"
            name="link"
            id="link"
            placeholder="Link"
            defaultValue={props?.caseLaw?.link}
            minLength={2}
            maxLength={90}
            innerRef={linkRef}
          />
        </Col>
      </FormGroup>

      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </Form>
    </div>
  );
};

export default PutCaseLaw;
