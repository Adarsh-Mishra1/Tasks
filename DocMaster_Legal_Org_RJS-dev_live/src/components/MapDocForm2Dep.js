//MapDocForm2Dep.js
import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import ReactSelect from "react-select";

import {
  WSGetAllDocForm,
  WsGetDepartmentByOrg,
  WsPutOrgDocFormDepartmentMap,
} from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const MapDocForm2Dep = (props) => {
  const [errorMsg, setErrorMsg] = useState("");

  const departmentRef = useRef(null);
  const [orgDepartments, setOrgDepartments] = useState([]);

  const docFormRef = useRef(null);
  const [orgDocForms, setOrgDocForms] = useState([]);

  let docFormId = null;
  if (props.type == 0) {
    docFormId = props.docFormId;
  }

  let departmentId = null;
  if (props.type == 1) {
    departmentId = props.department.id;
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log("onSubmitHandler_departmentIdRef", departmentId);
    // console.log("onSubmitHandler_departmentRef", departmentRef);
    // console.log("onSubmitHandler_departmentRef.current?.value", departmentRef.current?.value);
    if (departmentId != null && departmentId != undefined && departmentId > 0) {
      /*
departmentId:number,
docFormId:number,
adminUserId:number,*/
      let params2post = JSON.stringify({
        departmentId: departmentId,
        docFormId: docFormId,
        adminUserId: props.userId,
      });
      console.log("onSubmitHandler_responseData", params2post);

      axios
        .post(WsPutOrgDocFormDepartmentMap, params2post, {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          console.log("onSubmitHandler_responseData", responseData);
          if (responseData.resultCode === 1) {
            props.onReturn(true);
          } else {
            alert(responseData.resultMessage);
            //   setErrorMsg(responseData.resultMessage);
            props.onReturn(false);
          }
        })
        .catch((error) => {
          console.error("onSubmitHandler_error", error);
          setErrorMsg("Error while processing");
          props.onQuoteItemAddSubmit(false, "Error Try Again Later");
        });
    } else {
      alert("Select Department");
    }
  };

  useEffect(() => {
    if (props.type == 0) {
      getOrgDepartment();
    }

    if (props.type == 1) {
      getOrgDocForm();
    }
  }, []);

  const getOrgDepartment = () => {
    axios
      .get(WsGetDepartmentByOrg + "/" + props.orgId + "/" + props.userId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDep_responseData", responseData);
        if (responseData.resultCode === 1) {
          setOrgDepartments(processItemData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgDep_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processItemData = (itemArray) => {
    itemArray.map((item, index) => {
      if (props.type == 0) {
        item["label"] = item.name;
      }
      if (props.type == 1) {
        item["label"] = item.nameTitle;
      }
      item["value"] = item.id;
      console.log("processitemData_", item);
    });
    return itemArray;
  };

  const getOrgDocForm = () => {
    axios
      .get(WSGetAllDocForm + "/" + props.userId + "/" + props.orgId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgAllDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          setOrgDocForms(processItemData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgAllDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <Form onSubmit={onSubmitHandler} style={{ width: "100%" }} className="px-3">
      {props.type == 0 ? (
        <FormGroup className="mb-3">
          <Label htmlFor="orgDepartment">Department</Label>
          <ReactSelect
            options={orgDepartments}
            onChange={(selectedOption) => {
              console.log("handleUsersReactSelectChanges", selectedOption);
              departmentId = selectedOption.id;
              // departmentIdRef.current.value = selectedOption.id;
            }}
            ref={departmentRef}
            isMulti={false}
            //   defaultValue={{}}
          />
        </FormGroup>
      ) : null}
      {props.type == 1 ? (
        <FormGroup className="mb-3">
          <Label htmlFor="orgDocForms">DocForms</Label>
          <ReactSelect
            options={orgDocForms}
            onChange={(selectedOption) => {
              console.log("handleUsersReactSelectChanges", selectedOption);
              docFormId = selectedOption.id;
            }}
            ref={docFormRef}
            isMulti={false}
            //   defaultValue={{}}
          />
        </FormGroup>
      ) : null}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
};
export default MapDocForm2Dep;
