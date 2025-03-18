//docFormPreFill/Add.js
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import Select from "react-select";
import axios from "axios";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import { WSGetOrgUsers, WsPutOrgPreFillField } from "../../configs/WebService"; //Java

// import { WSReadDocFormCategories } from "../../configs/WebServiceNodeJS"; //Node

import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
// import { listToTreeNumeric } from "../../OtherFunctions/OtherFunctions";

import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

// toast.configure();
const Add = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("location.state", location.state);

  const [errorMsg, setErrorMsg] = useState("");

  const userData = userStore((state) => state.user);

  // const [formChangeCount, setFormChangeCount] = useState(0);

  let fieldKeyRef = useRef();
  console.log(
    "location.state2",
    location?.state?.docFormFill?.fieldKey
      ? location?.state?.docFormFill?.fieldKey
      : "",
  );
  let valueRef = useRef();
  const [fieldKey, setFieldKey] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(0);

  let [documentCategoryData, setDocumentCategoryData] = useState({});
  let [docCategoriesData, setdocCategoryData] = useState([]);

  const [orgUsers, setOrgUsers] = useState([]);
  const [user2set, setUser2set] = useState(0);

  const [showSelectUser, setShowSelectUser] = useState(
    location?.state?.docFormFill?.userId != null &&
      location?.state?.docFormFill?.userId != undefined &&
      location?.state?.docFormFill?.userId >= 0
      ? true
      : false,
  );

  useEffect(() => {
    getOrgUsers();
  }, []);

  const getOrgUsers = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WSGetOrgUsers + "/" + userData.id + "/" + userData.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgUsers_responseData", responseData);
        if (responseData.result_code === 1) {
          setOrgUsers(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgUsers_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    let blankData = [];
    let user2setTemp = undefined;
    simpleDataArray.map((simpleData, index) => {
      simpleData["value"] = simpleData.id;
      simpleData["label"] = simpleData.name + " (" + simpleData.mobileNo + ")";
      if (
        location?.state?.docFormFill?.userId != null &&
        location?.state?.docFormFill?.userId != undefined &&
        location?.state?.docFormFill?.userId >= 0 &&
        location?.state?.docFormFill?.userId == simpleData.id
      ) {
        user2setTemp = simpleData;
      }
      blankData.push(simpleData);
    });
    console.log("UserAccess_processData_blankData", blankData);
    if (user2setTemp != undefined) {
      setUser2set(user2setTemp);
    }
    return blankData;
  };

  function onSubmitHandler(e) {
    e.preventDefault();

    // console.log("onSubmitHandler_fieldKeyRef", fieldKeyRef.current.value);
    // console.log("onSubmitHandler_valueRef", valueRef.current.value);

    if (
      fieldKeyRef.current.value == null ||
      fieldKeyRef.current.value == undefined ||
      fieldKeyRef.current.value.length <= 2
    ) {
      alert("Provide a Valid Field Key");
    } else if (
      valueRef.current.value == null ||
      valueRef.current.value == undefined ||
      valueRef.current.value.length < 2
    ) {
      alert("Provide a Valid Field Value");
    } else if (showSelectUser == true && user2set?.id == undefined) {
      alert("Select User");
    } else {
      proceed2Submit();
    }
  }
  function proceed2Submit() {
    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: location?.state?.docFormFill?.orgId
        ? location?.state?.docFormFill?.orgId
        : userData.org.id,
      id: location?.state?.docFormFill?.id
        ? location?.state?.docFormFill?.id
        : null,
      fieldKey: fieldKeyRef.current.value,
      value: valueRef.current.value,
      userId: showSelectUser && user2set?.id != undefined ? user2set?.id : null,
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
          goToUserPage();
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("PutDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToUserPage() {
    navigate("/docFormPreFillShowAll");
  }

  const handleOrgUserSelectChange = (selectedUser) => {
    console.log(
      "UserAccess_handleOrgUserSelectChange_selectedUser",
      selectedUser,
    );
    setUser2set(selectedUser);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>
                {location?.state?.action ? location.state.action : "Add"}{" "}
                Prefilled Key
              </h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                 
                <div className="x_content">
                  <Form onSubmit={onSubmitHandler} method="POST">
                    <div className="add-form-container mb-1">
                      <Label htmlFor="fieldKey" className="form-label">
                        Field Key *
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="fieldKey"
                        name="fieldKey"
                        aria-describedby="fieldKey"
                        innerRef={fieldKeyRef}
                        defaultValue={
                          location?.state?.docFormFill?.fieldKey
                            ? location?.state?.docFormFill?.fieldKey
                            : ""
                        }
                        minLength={2}
                        maxLength={64}
                        required
                      />
                    </div>
                    <div className="mb-1 add-form-container">
                      <label htmlFor="value" className="form-label">
                        Field Value
                      </label>
                      <Input
                        type="textarea"
                        className="form-control"
                        name="value"
                        id="value"
                        aria-describedby="describedby"
                        innerRef={valueRef}
                        defaultValue={
                          location?.state?.docFormFill?.value
                            ? location?.state?.docFormFill?.value
                            : ""
                        }
                        minLength={1}
                        maxLength={500}
                        required
                      />
                    </div>

                    <div className="mb-1 add-form-container">
                      <label htmlFor="value" className="form-label">
                        User Specific
                      </label>
                      <Input
                        className="zero-top"
                        name="inputValueStyle"
                        id="inputValueCommaSepNum1"
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked == true) {
                            setShowSelectUser(true);
                          } else {
                            setShowSelectUser(false);
                          }
                        }}
                        value={"commasepnum1"}
                      />{" "}
                      For User
                    </div>

                    {showSelectUser ? (
                      <div className="mb-1 add-form-container">
                        <label htmlFor="value" className="form-label">
                          Select User
                        </label>
                        <Select
                          className="form-control"
                          options={orgUsers}
                          value={user2set}
                          onChange={handleOrgUserSelectChange}
                        />
                      </div>
                    ) : null}

                    {userData.crudAccess?.docFormPreFill.c == 1 ? (
                      <button type="submit" className="btn btn-sm m-0 btn-primary">
                        Submit
                      </button>
                    ) : null}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default Add;
