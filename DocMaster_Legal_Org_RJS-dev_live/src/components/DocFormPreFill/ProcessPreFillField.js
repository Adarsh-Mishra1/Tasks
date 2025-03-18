//DocFormPreFill/ProcessPreFillField.js
import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import {
  WsPutOrgPreFillField,
  WsGetOrgPreFillFieldValue,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

// import userStore from "../../zustand/userStore";

const ProcessPreFillField = (props) => {
  console.log("ProcessPreFillField_props_", props);
  const userData = props.orgUser; // userStore((state) => state.user);
  const org = props.org;
  const [errorMsg, setErrorMsg] = useState("");
  const [edit, setEdit] = useState(false);
  const valueRef = useRef("");
  const [value, setValue] = useState({});

  useEffect(() => {
    getPreFilledKeyValue();
  }, [userData]);

  const getPreFilledKeyValue = () => {
    let url2call =
      props.preFillField.isUserSpecific == 1
        ? WsGetOrgPreFillFieldValue +
          "/" +
          props.preFillField.fieldKey +
          "/" +
          org.id +
          "/" +
          userData.id
        : WsGetOrgPreFillFieldValue +
          "/" +
          props.preFillField.fieldKey +
          "/" +
          org.id;

    //[URL/fieldKey/orgId/userId]
    console.log("getPreFilledKeyValue_url", url2call);
    axios
      .get(url2call, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getPreFilledKeyValue_responseData", responseData);
        if (responseData.resultCode === 1) {
          //   setAllItems(processItemData(responseData.resultMessage));
          setValue(responseData.resultMessage);
        } else {
          setValue({});
        }
      })
      .catch((error) => {
        setValue({});
        console.error("getItemsByOrg_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (
      valueRef.current.value != undefined &&
      valueRef.current.value.length > 0
    ) {
      processSubmitHandler();
    } else {
      alert("Provide Value");
    }
  };

  const processSubmitHandler = () => {
    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: org.id,
      id: value?.id != undefined && value?.id > 0 ? value?.id : null,
      fieldKey: props.preFillField.fieldKey,
      value: valueRef.current.value,
      userId:
        props.preFillField.isUserSpecific == 1 && userData?.id != undefined
          ? userData?.id
          : null,
    });
    console.log("PutOrgPreFillField_onSubmit_params2post", params2post);

    axios
      .post(WsPutOrgPreFillField, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("PutOrgPreFillField_responseData", responseData);
        if (responseData.resultCode === 1) {
          setValue(responseData.resultMessage);
          setEdit(false);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("PutOrgPreFillField_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <>
      <div className="row">
        {/* <div className="col-md-1">{props.preFillField.sno}</div> */}
        <div className="col-md-1">{props.index + 1}</div>
        <div className="col-md-3">{props.preFillField.title}</div>
        <div className="col-md-3">
          {edit ? (
            <Form
              onSubmit={onSubmitHandler}
              style={{ width: "100%" }}
              className="input-group mb-3"
            >
              <Input
                type="text"
                className="form-control"
                id={"valueInput" + props.preFillField.id}
                name={"valueInput" + props.preFillField.id}
                aria-describedby="Value"
                placeholder={"Enter value for " + props.preFillField.title}
                innerRef={valueRef}
                defaultValue={value != undefined ? value.value : ""}
              />
              &nbsp; &nbsp;
              <div class="input-group-append">
                <button type="submit" className="btn btn-sm btn-primary">
                  Save
                </button>
              </div>
            </Form>
          ) : (
            <>
              <i
                style={{ cursor: "pointer", color: "green" }}
                onClick={() => {
                  setEdit(true);
                }}
                className="fa fa-edit"
              />
              &nbsp;
              {value != undefined ? value.value : ""}{" "}
            </>
          )}
        </div>
        <div className="col-md-3"></div>
      </div>
    </>
  );
};

export default ProcessPreFillField;
