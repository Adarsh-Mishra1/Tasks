//AddOrgDepartment.js
import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";

import userStore from "../zustand/userStore";
import { WsPutDepartment } from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const AddOrgDepartment = (props) => {
  const userData = userStore((state) => state.user);
  const [errorMsg, setErrorMsg] = useState("");

  const orgDep2Edit = props.orgDep2Edit;

  console.log("orgDep2Edit", orgDep2Edit);

  const nameRef = useRef();
  const detailRef = useRef();
  const hierarchyRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // console.log("onSubmitHandler_departmentRef", departmentRef);
    // console.log("onSubmitHandler_departmentRef.current?.value", departmentRef.current?.value);
    if (
      nameRef.current?.value == undefined ||
      nameRef.current?.value.length < 3
    ) {
      alert("enter Valid Name");
    } else if (
      detailRef.current?.value == undefined ||
      detailRef.current?.value.length < 3
    ) {
      alert("enter Valid Detail");
    } else if (
      hierarchyRef.current?.value == undefined ||
      hierarchyRef.current?.value.length <= 0
    ) {
      alert("enter Valid Hierarchy");
    } else {
      /*[Raw-JSON]
id:number(optional),
orgId:number,
name:text,
details:text,
hierarchy:number,
userId:number(adminId/orgUserId)*/
      let params2post =
        orgDep2Edit != undefined
          ? JSON.stringify({
              orgId: userData.org.id,
              id: orgDep2Edit.id,
              name: nameRef.current?.value,
              details: detailRef.current?.value,
              hierarchy: hierarchyRef.current?.value,
              userId: userData.id,
            })
          : JSON.stringify({
              orgId: userData.org.id,
              name: nameRef.current?.value,
              details: detailRef.current?.value,
              hierarchy: hierarchyRef.current?.value,
              userId: userData.id,
            });
      console.log("onSubmitHandler_responseData", params2post);

      axios
        .post(WsPutDepartment, params2post, {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          console.log("onSubmitHandler_responseData", responseData);
          if (responseData.resultCode === 1) {
            props.onReturn(true);
          } else {
            alert(responseData.resultMessage);
            props.onReturn(false);
          }
        })
        .catch((error) => {
          console.error("onSubmitHandler_error", error);
          setErrorMsg("Error while processing");
          props.onQuoteItemAddSubmit(false, "Error Try Again Later");
        });
    }
  };

  return (
    <Form onSubmit={onSubmitHandler} style={{ width: "100%" }} className="px-3">
      <FormGroup className="mb-3">
        <Label htmlFor="name" className="form-label">
          Name/Title
        </Label>
        <Input
          type="text"
          className="form-control"
          id="name"
          name="name"
          aria-describedby="name"
          innerRef={nameRef}
          defaultValue={orgDep2Edit?.name}
          minLength={3}
          maxLength={64}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <Label htmlFor="name" className="form-label">
          detail
        </Label>
        <Input
          type="textarea"
          className="form-control"
          id="detail"
          name="detail"
          aria-describedby="name"
          innerRef={detailRef}
          defaultValue={orgDep2Edit?.details}
          minLength={5}
          maxLength={140}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <Label htmlFor="price" className="form-label">
          Hierarchy
        </Label>
        <Input
          type="number"
          className="form-control"
          id="hierarchy"
          name="hierarchy"
          aria-describedby="hierarchy"
          innerRef={hierarchyRef}
          defaultValue={orgDep2Edit?.hierarchy}
          min={1}
          max={60}
          required
        />
      </FormGroup>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
};
export default AddOrgDepartment;
