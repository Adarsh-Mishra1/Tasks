//MapUser2Dep.js
import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import ReactSelect from "react-select";

import {
  WSGetOrgUsers,
  WsPutOrgUserDepartmentMap,
} from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const MapUser2Dep = (props) => {
  const [errorMsg, setErrorMsg] = useState("");

  const userRef = useRef(null);
  // const [orgDepartments, setOrgDepartments] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);

  let userId = null;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log("onSubmitHandler_departmentIdRef", userId);
    // console.log("onSubmitHandler_departmentRef", departmentRef);
    // console.log("onSubmitHandler_departmentRef.current?.value", departmentRef.current?.value);
    if (userId != null && userId != undefined && userId > 0) {
      //} && departmentIdRef?.current?.value!=undefined  && departmentIdRef?.current?.value >0){
      /*[Raw-JSON]
departmentId:number,
userId:number,
adminUserId:number,*/
      let params2post = JSON.stringify({
        departmentId: props.department.id,
        userId: userId,
        adminUserId: props.adminUserId,
      });
      console.log("onSubmitHandler_responseData", params2post);

      axios
        .post(WsPutOrgUserDepartmentMap, params2post, {
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
    getOrgUsers();
  }, []);

  const getOrgUsers = () => {
    axios
      .get(WSGetOrgUsers + "/" + props.adminUserId + "/" + props.orgId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDep_responseData", responseData);
        if (responseData.resultCode === 1) {
          setOrgUsers(processItemData(responseData.resultMessage));
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
      //   console.log("processitemData_", item);
      item["label"] = item.name;
      item["value"] = item.id;
      console.log("processitemData_", item);
    });
    return itemArray;
  };

  return (
    <Form onSubmit={onSubmitHandler} style={{ width: "100%" }} className="px-3">
      <FormGroup className="mb-3">
        <Label htmlFor="orgDepartment">Department</Label>
        <ReactSelect
          options={orgUsers}
          onChange={(selectedOption) => {
            console.log("handleUsersReactSelectChanges", selectedOption);
            userId = selectedOption.id;
            // departmentIdRef.current.value = selectedOption.id;
          }}
          ref={userRef}
          isMulti={false}
          //   defaultValue={{}}
        />
      </FormGroup>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
};
export default MapUser2Dep;
