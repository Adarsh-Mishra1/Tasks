//User/View.js
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
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import {
  WSGetOrgUserCrudAccess,
  WSPutOrgUserCrudAccess,
  WsUpdateUser,
  WsUpdateUserRole,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const View = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("user2view_locationstate", location.state);
  const [user2view, setUser2view] = useState(location.state.user2view);
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);

  const [formChangeCount, setFormChangeCount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userSystemAccess, setUserSystemAccess] = useState({
    docForm: { c: 0, r: 0, u: 0, d: 0 },
    docFormCat: { c: 0, r: 0, u: 0, d: 0 },
    user: { c: 0, r: 0, u: 0, d: 0 },
    userGroup: { c: 0, r: 0, u: 0, d: 0 },
    priceQuotation: { c: 0, r: 0, u: 0, d: 0 },
    probInfo: { c: 0, r: 0, u: 0, d: 0 },
    client: { c: 0, r: 0, u: 0, d: 0 },
    clientCase: { c: 0, r: 0, u: 0, d: 0 },
    research: { c: 0, r: 0, u: 0, d: 0 },
    fileMerge: { c: 0, r: 0, u: 0, d: 0 },
  });

  const [enableUidInput, setEnableUidInput] = useState(false);
  const [enableNameInput, setEnableNameInput] = useState(false);
  const [enableMobileInput, setEnableMobileInput] = useState(false);
  const [enableEmailInput, setEnableEmailInput] = useState(false);
  const [enablePasswordInput, setEnablePasswordInput] = useState(false);
  const [showUpdateUserRoleDiv, setShowUpdateUserRoleDiv] = useState(false);
  const [userRoleCode2Update, setUserRoleCode2Update] = useState(
    user2view?.role?.code
  );

  const uidInput = useRef();
  const nameInput = useRef();
  const mobileNoInput = useRef();
  const emailIdInput = useRef();
  const passwordInput = useRef();
  const passwordInput2 = useRef();

  useEffect(() => {
    getUserCrud();
  }, []);

  function getUserCrud() {
    toast.success("Loading User Data Please Wait ...", {
      autoClose: 50,
    });

    axios
      .get(
        WSGetOrgUserCrudAccess + "/" + user2view.id + "/" + userData.org.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getUserCrud_responseData", responseData);
        if (responseData.resultCode === 1) {
          // alert(responseData.result_message);
          if (Object.keys(responseData.resultMessage).length > 0) {
            // if (responseData.resultMessage?.docFormCat == undefined) {
            //   responseData.resultMessage["docFormCat"] = {};
            // }
            // if (responseData.resultMessage?.priceQuotation == undefined) {
            //   responseData.resultMessage["priceQuotation"] = {};
            // }
            // if (responseData.resultMessage?.department == undefined) {
            //   responseData.resultMessage["department"] = {};
            // }
            setUserSystemAccess(responseData.resultMessage);
          }
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getUserCrud_error", error);
        setErrorMsg("Error while processing");
      });
  }

  const delAlert = () => {
    alert("To be Done");
  };

  const onUserSystemAcessSubmit = (e) => {
    e.preventDefault();

    /*
    [Raw-JSON]
    adminUserId:number,
    orgId:number,
    userId:number,
    crudAccess:text(JSON Object)
    */

    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: userData.org.id,
      userId: user2view.id,
      crudAccess: JSON.stringify(userSystemAccess),
    });

    console.log("UserSystemAcessSubmit_params2post", params2post);

    axios
      .post(WSPutOrgUserCrudAccess, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("UserSystemAcessSubmit_responseData", responseData);
        if (responseData.resultCode === 1) {
          alert(responseData.resultMessage);
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("UserSystemAcessSubmit_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const submitUserNameUpdateForm = (e) => {
    e.preventDefault();
    if (
      nameInput.current.value == undefined ||
      nameInput.current.value.length < 3
    ) {
      alert("Check Name!");
    } else {
      updateOrgUser(0, nameInput.current.value);
    }
  };

  const submitUserMobileNoUpdateForm = (e) => {
    e.preventDefault();
    if (
      mobileNoInput.current.value == undefined ||
      mobileNoInput.current.value.length < 10
    ) {
      alert("Check Mobile No!");
    } else {
      updateOrgUser(1, mobileNoInput.current.value);
    }
  };

  const submitUserEmailUpdateForm = (e) => {
    e.preventDefault();
    if (
      emailIdInput.current.value == undefined ||
      emailIdInput.current.value.length < 7
    ) {
      alert("Check Email id!");
    } else {
      updateOrgUser(2, emailIdInput.current.value);
    }
  };

  const submitUserPasswordUpdateForm = (e) => {
    e.preventDefault();
    if (
      passwordInput.current.value == undefined ||
      passwordInput.current.value.length < 6
    ) {
      alert("Check Password!");
    } else if (passwordInput.current.value != passwordInput2.current.value) {
      alert("Check Password, Password do not matched");
    } else {
      updateOrgUser(3, passwordInput.current.value);
    }
  };

  const submitUserUidUpdateForm = (e) => {
    e.preventDefault();
    if (
      uidInput.current.value == undefined ||
      uidInput.current.value.length < 3
    ) {
      alert("Check UID!");
    } else {
      updateOrgUser(4, uidInput.current.value);
    }
  };

  const updateOrgUser = (dataType, dataValue) => {
    /*[Raw-JSON]
id:number,
adminId:number,
dataType:number(0:name,1:mobileNo,2:emailId,3:password),
dataValue:text,*/

    let params2post = JSON.stringify({
      id: user2view.id,
      adminId: userData.id,
      dataType: dataType,
      dataValue: dataValue,
    });

    console.log("UserUpdate_params2post", params2post);

    axios
      .post(WsUpdateUser, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("UserUpdate_responseData", responseData);
        if (responseData.resultCode === 1) {
          setUser2view(responseData.resultMessage);
          if (dataType == 0) {
            setEnableNameInput(false);
          }
          if (dataType == 1) {
            setEnableMobileInput(false);
          }
          if (dataType == 2) {
            setEnableEmailInput(false);
          }
          if (dataType == 3) {
            setEnablePasswordInput(false);
          }
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("UserUpdate_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const onSubmitUpdateUserRoleChangeHandler = (e) => {
    e.preventDefault();
    if (userRoleCode2Update != undefined && userRoleCode2Update.length > 2) {
      confirmAlert({
        title: "Confirm to Update User Role!",
        message: "Are you sure to Update Use Role",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              proceed2UpdateUseROle(userRoleCode2Update);
            },
          },
          {
            label: "No",
          },
        ],
      });
    }
  };

  const proceed2UpdateUseROle = (userRoleCode) => {
    axios
      .post(
        WsUpdateUserRole,
        JSON.stringify({
          id: user2view.id,
          adminId: userData.id,
          roleCode: userRoleCode,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("UserUpdateRole_responseData", responseData);
        if (responseData.resultCode === 1) {
          setUser2view(responseData.resultMessage);
          window.location.href = "/userShowAll";
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("UserUpdateRole_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>{user2view.name}</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <ReactTooltip place="top" type="dark" effect="solid" />

                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  <hr />

                  <div className="row">
                    <div className="col-4">
                      <strong>UID/uName</strong>
                    </div>
                    <div className="col-8">
                      {user2view.uname} &nbsp; &nbsp;
                      {userData.crudAccess?.user.u == 1 &&
                      (user2view.uname == undefined ||
                        user2view.uname == null ||
                        user2view.uname.length <= 0) ? (
                        <>
                          {enableUidInput == 1 ? (
                            <>
                              <form onSubmit={submitUserUidUpdateForm}>
                                <div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="UID/uName"
                                    name="uname"
                                    id="uname"
                                    // defaultValue={user2view.uname}
                                    ref={uidInput}
                                    // pattern="[A-Za-z0-9]+"
                                    // onkeypress="return event.key != ' '"
                                    onChange={(e) => {
                                      e.target.value = e.target.value
                                        .trim()
                                        .replace(/\s/g, "");
                                    }}
                                    minLength={6}
                                    maxLength={20}
                                    required
                                  />
                                </div>
                                <div>
                                  <button
                                    id="uidSubmitSbmt"
                                    type="Submit"
                                    title="Submit"
                                    className="btn btn-sm btn-outline-primary submit"
                                  >
                                    Submit UID
                                  </button>
                                </div>
                                <sup>
                                  <a className="btn btn-sm btn-priamry"
                                    onClick={() => setEnableUidInput(false)}
                                    
                                  >
                                    Close
                                  </a>
                                </sup>
                              </form>
                            </>
                          ) : (
                            <a
                              onClick={() => setEnableUidInput(true)}
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Edit UID
                            </a>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Name</strong>
                    </div>
                    <div className="col-8">
                      {enableNameInput ? (
                        <>
                          <form onSubmit={submitUserNameUpdateForm}>
                            <div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name="name"
                                id="name"
                                defaultValue={user2view.name}
                                ref={nameInput}
                                minLength={3}
                                maxLength={60}
                                required
                              />
                            </div>
                            <div>
                              <button
                                id="nameSubmitSbmt"
                                type="Submit"
                                title="Update"
                                className="btn btn-outline-primary submit"
                              >
                                Update Name
                              </button>
                            </div>
                            <sup>
                              <a
                                onClick={() => setEnableNameInput(false)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Close
                              </a>
                            </sup>
                          </form>
                        </>
                      ) : (
                        <>
                          {user2view.name} &nbsp;
                          {userData.crudAccess?.user.u == 1 ? (
                            <sup>
                              <a
                                onClick={() => setEnableNameInput(true)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Edit
                              </a>
                            </sup>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>MobileNo</strong>
                    </div>
                    <div className="col-8">
                      {/* {user2view.mobileNo} &nbsp;{" "} */}
                      {/* {userData.crudAccess?.user.u == 1 ? <>Edit</> : null} */}
                      {enableMobileInput ? (
                        <>
                          <form onSubmit={submitUserMobileNoUpdateForm}>
                            <div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Mobile No"
                                name="mobileNo"
                                id="mobileNo"
                                defaultValue={user2view.mobileNo}
                                ref={mobileNoInput}
                                minLength={10}
                                maxLength={12}
                                required
                              />
                            </div>
                            <div>
                              <button
                                id="nameSubmitSbmt"
                                type="Submit"
                                title="Update"
                                className="btn btn-outline-primary submit"
                              >
                                Update Mobile No
                              </button>
                            </div>
                            <sup>
                              <a
                                onClick={() => setEnableMobileInput(false)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Close
                              </a>
                            </sup>
                          </form>
                        </>
                      ) : (
                        <>
                          {user2view.mobileNo} &nbsp;
                          {userData.crudAccess?.user.u == 1 ? (
                            <sup>
                              <a
                                onClick={() => setEnableMobileInput(true)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Edit
                              </a>
                            </sup>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>eMailId</strong>
                    </div>
                    <div className="col-8">
                      {enableEmailInput ? (
                        <>
                          <form onSubmit={submitUserEmailUpdateForm}>
                            <div>
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Email Id"
                                name="emailId"
                                id="emailId"
                                defaultValue={user2view.email}
                                ref={emailIdInput}
                                minLength={8}
                                maxLength={64}
                                required
                              />
                            </div>
                            <div>
                              <button
                                id="emailIdSbmt"
                                type="Submit"
                                title="Update"
                                className="btn btn-outline-primary submit"
                              >
                                Update Email Id
                              </button>
                            </div>
                            <sup>
                              <a
                                onClick={() => setEnableEmailInput(false)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Close
                              </a>
                            </sup>
                          </form>
                        </>
                      ) : (
                        <>
                          {user2view.email} &nbsp;
                          {userData.crudAccess?.user.u == 1 ? (
                            <sup>
                              <a
                                onClick={() => setEnableEmailInput(true)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Edit
                              </a>
                            </sup>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>IsMobileVerify</strong>
                    </div>
                    <div className="col-8">
                      {user2view.isMobileVerify ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>IsEmailVerify</strong>
                    </div>
                    <div className="col-8">
                      {user2view.isEmailVerify ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Role</strong>
                    </div>
                    <div className="col-8">
                      {user2view.role?.name}&nbsp;
                      {showUpdateUserRoleDiv ? (
                        <Form
                          onSubmit={onSubmitUpdateUserRoleChangeHandler}
                          method="POST"
                          id="updateUserRoleForm"
                        >
                          <FormGroup className="mb-3" row>
                            <Label htmlFor="userRoleUpdate" sm={12}>
                              Choose User Role
                            </Label>
                            <Col sm={2}>
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="userRole"
                                id="userRoleGeneral"
                                placeholder="GeneralUser"
                                value="gnrluser"
                                checked={
                                  userRoleCode2Update === "gnrluser"
                                    ? true
                                    : false
                                }
                                required={true}
                                onChange={(e) => {
                                  setUserRoleCode2Update("gnrluser");
                                }}
                              />{" "}
                              <Label htmlFor="userRoleGeneral">
                                GeneralUser
                              </Label>
                            </Col>
                            <Col sm={2}>
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="userRole"
                                id="userRoleApprover"
                                placeholder="Approver"
                                value="aprvr"
                                checked={
                                  userRoleCode2Update === "aprvr" ? true : false
                                }
                                required={true}
                                onChange={(e) => {
                                  setUserRoleCode2Update("aprvr");
                                }}
                              />{" "}
                              <Label htmlFor="userRoleApprover">Approver</Label>
                            </Col>

                            <Col sm={2}>
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="userRole"
                                id="userRoleResearcher"
                                placeholder="Researcher"
                                value="rsrchr"
                                checked={
                                  userRoleCode2Update === "rsrchr"
                                    ? true
                                    : false
                                }
                                required={true}
                                onChange={(e) => {
                                  setUserRoleCode2Update("rsrchr");
                                }}
                              />{" "}
                              <Label htmlFor="userRoleResearcher">
                                Researcher
                              </Label>
                            </Col>

                            <Col sm={2}>
                              <Input
                                className="form-check-input"
                                type="radio"
                                name="userRole"
                                id="userRoleViewer"
                                placeholder="viewr"
                                value="viewr"
                                checked={
                                  userRoleCode2Update === "viewr" ? true : false
                                }
                                required={true}
                                onChange={(e) => {
                                  setUserRoleCode2Update("viewr");
                                }}
                              />{" "}
                              <Label htmlFor="userRoleViewer">Viewer</Label>
                            </Col>
                            <Col sm={12}>
                              <Button
                                id="updateUserRoleBtn"
                                type="Submit"
                                title="Update"
                                className="btn btn-primary"
                              >
                                Update Role
                              </Button>
                            </Col>
                          </FormGroup>
                        </Form>
                      ) : (
                        <>
                          {userData.crudAccess?.user.u == 1 ? (
                            <sup>
                              <a
                                onClick={() => setShowUpdateUserRoleDiv(true)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Edit
                              </a>
                            </sup>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Password</strong>
                    </div>
                    <div className="col-8">
                      {enablePasswordInput ? (
                        <>
                          <sup>
                            <a
                              onClick={() => setEnablePasswordInput(false)}
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Close
                            </a>
                          </sup>
                          <form onSubmit={submitUserPasswordUpdateForm}>
                            <div className="col-6">
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password1"
                                id="password1"
                                ref={passwordInput}
                                minLength={6}
                                maxLength={62}
                                required
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Password"
                                name="password2"
                                id="password2"
                                ref={passwordInput2}
                                minLength={6}
                                maxLength={62}
                                required
                              />
                            </div>
                            <div>
                              <button
                                id="passwordSbmt"
                                type="Submit"
                                title="Update"
                                className="btn btn-outline-primary btm-sm submit"
                              >
                                Change Password
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <>
                          {userData.crudAccess?.user.u == 1 ? (
                            <a
                              onClick={() => setEnablePasswordInput(true)}
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Change Password
                            </a>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <Form onSubmit={onUserSystemAcessSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <hr />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <h4>System Access</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <strong>Problem Info</strong>
                      </div>
                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="cprobInfo"
                          id="cprobInfo"
                          checked={userSystemAccess?.probInfo?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            console.log(
                              "tempUserSystemAccess_before",
                              tempUserSystemAccess
                            );
                            if (tempUserSystemAccess.probInfo == undefined) {
                              tempUserSystemAccess["probInfo"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.probInfo.c = 1;
                            } else {
                              tempUserSystemAccess.probInfo.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="rprobInfo"
                          id="rprobInfo"
                          checked={userSystemAccess?.probInfo?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.probInfo == undefined) {
                              tempUserSystemAccess["probInfo"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.probInfo.r = 1;
                            } else {
                              tempUserSystemAccess.probInfo.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="uprobInfo"
                          id="uprobInfo"
                          checked={userSystemAccess?.probInfo?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.probInfo == undefined) {
                              tempUserSystemAccess["probInfo"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.probInfo.u = 1;
                            } else {
                              tempUserSystemAccess.probInfo.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="dprobInfo"
                          id="dprobInfo"
                          checked={userSystemAccess?.probInfo?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.probInfo == undefined) {
                              tempUserSystemAccess["probInfo"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.probInfo.d = 1;
                            } else {
                              tempUserSystemAccess.probInfo.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                        {/* </strong> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <strong>Client</strong>
                      </div>
                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="cclient"
                          id="cclient"
                          checked={userSystemAccess?.client?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.client == undefined) {
                              tempUserSystemAccess["client"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.client.c = 1;
                            } else {
                              tempUserSystemAccess.client.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="rclient"
                          id="rclient"
                          checked={userSystemAccess?.client?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.client == undefined) {
                              tempUserSystemAccess["client"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.client.r = 1;
                            } else {
                              tempUserSystemAccess.client.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="uclient"
                          id="uclient"
                          checked={userSystemAccess?.client?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.client == undefined) {
                              tempUserSystemAccess["client"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.client.u = 1;
                            } else {
                              tempUserSystemAccess.client.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="dclient"
                          id="dclient"
                          checked={userSystemAccess?.client?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.client == undefined) {
                              tempUserSystemAccess["client"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.client.d = 1;
                            } else {
                              tempUserSystemAccess.client.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                        {/* </strong> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <strong>Client Case</strong>
                      </div>
                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="cclientCase"
                          id="cclientCase"
                          checked={userSystemAccess?.clientCase?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.clientCase == undefined) {
                              tempUserSystemAccess["clientCase"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.clientCase.c = 1;
                            } else {
                              tempUserSystemAccess.clientCase.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="rclientCase"
                          id="rclientCase"
                          checked={userSystemAccess?.clientCase?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.clientCase == undefined) {
                              tempUserSystemAccess["clientCase"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.clientCase.r = 1;
                            } else {
                              tempUserSystemAccess.clientCase.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="uclientCase"
                          id="uclientCase"
                          checked={userSystemAccess?.clientCase?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.clientCase == undefined) {
                              tempUserSystemAccess["clientCase"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.clientCase.u = 1;
                            } else {
                              tempUserSystemAccess.clientCase.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="dclientCase"
                          id="dclientCase"
                          checked={userSystemAccess?.clientCase?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.clientCase == undefined) {
                              tempUserSystemAccess["clientCase"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.clientCase.d = 1;
                            } else {
                              tempUserSystemAccess.clientCase.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                        {/* </strong> */}
                      </div>
                    </div>

                    {/* probInfo: { c: 0, r: 0, u: 0, d: 0 },
                    client: { c: 0, r: 0, u: 0, d: 0 },
                    clientCase: { c: 0, r: 0, u: 0, d: 0 },
                    research: { c: 0, r: 0, u: 0, d: 0 },
                    fileMerge: { c: 0, r: 0, u: 0, d: 0 }, */}

                    <div className="row">
                      <div className="col-4">
                        <strong>Research</strong>
                      </div>
                      <div className="col-2">
                        <Input
                          type="checkbox"
                          value={1}
                          name="rresearch"
                          id="rresearch"
                          checked={userSystemAccess?.research?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.research == undefined) {
                              tempUserSystemAccess["research"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.research.c = 1;
                            } else {
                              tempUserSystemAccess.research.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                      </div>

                      <div className="col-2">
                        <Input
                          type="checkbox"
                          value={1}
                          name="rresearch"
                          id="rresearch"
                          checked={userSystemAccess?.research?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.research == undefined) {
                              tempUserSystemAccess["research"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.research.r = 1;
                            } else {
                              tempUserSystemAccess.research.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                      </div>

                      <div className="col-2">
                        <Input
                          type="checkbox"
                          value={1}
                          name="uresearch"
                          id="uresearch"
                          checked={userSystemAccess?.research?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.research == undefined) {
                              tempUserSystemAccess["research"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.research.u = 1;
                            } else {
                              tempUserSystemAccess.research.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                      </div>

                      <div className="col-2">
                        <Input
                          type="checkbox"
                          value={1}
                          name="dresearch"
                          id="dresearch"
                          checked={userSystemAccess?.research?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.research == undefined) {
                              tempUserSystemAccess["research"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.research.d = 1;
                            } else {
                              tempUserSystemAccess.research.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <strong>
                          Online case file
                          {/* fileMerge */}
                        </strong>
                      </div>
                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="cfileMerge"
                          id="cfileMerge"
                          checked={userSystemAccess?.fileMerge?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.fileMerge == undefined) {
                              tempUserSystemAccess["fileMerge"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.fileMerge.c = 1;
                            } else {
                              tempUserSystemAccess.fileMerge.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="rfileMerge"
                          id="rfileMerge"
                          checked={userSystemAccess?.fileMerge?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.fileMerge == undefined) {
                              tempUserSystemAccess["fileMerge"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.fileMerge.r = 1;
                            } else {
                              tempUserSystemAccess.fileMerge.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="ufileMerge"
                          id="ufileMerge"
                          checked={userSystemAccess?.fileMerge?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.fileMerge == undefined) {
                              tempUserSystemAccess["fileMerge"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.fileMerge.u = 1;
                            } else {
                              tempUserSystemAccess.fileMerge.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="dfileMerge"
                          id="dfileMerge"
                          checked={userSystemAccess?.fileMerge?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (tempUserSystemAccess.fileMerge == undefined) {
                              tempUserSystemAccess["fileMerge"] = {};
                            }
                            if (e.target.checked) {
                              tempUserSystemAccess.fileMerge.d = 1;
                            } else {
                              tempUserSystemAccess.fileMerge.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                        {/* </strong> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <strong>User</strong>
                      </div>
                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="cUser"
                          id="cUser"
                          checked={userSystemAccess?.user?.c == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (e.target.checked) {
                              if (tempUserSystemAccess?.user?.c)
                                tempUserSystemAccess.user.c = 1;
                            } else {
                              if (tempUserSystemAccess?.user?.c)
                                tempUserSystemAccess.user.c = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Create
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="rUser"
                          id="rUser"
                          checked={userSystemAccess?.user?.r == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (e.target.checked) {
                              if (tempUserSystemAccess?.user?.r)
                                tempUserSystemAccess.user.r = 1;
                            } else {
                              if (tempUserSystemAccess?.user?.r)
                                tempUserSystemAccess.user.r = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Read
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="uUser"
                          id="uUser"
                          checked={userSystemAccess?.user?.u == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (e.target.checked) {
                              if (tempUserSystemAccess?.user?.u)
                                tempUserSystemAccess.user.u = 1;
                            } else {
                              if (tempUserSystemAccess?.user?.u)
                                tempUserSystemAccess.user.u = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Update
                        {/* </strong> */}
                      </div>

                      <div className="col-2">
                        {/* <strong>  */}
                        <Input
                          type="checkbox"
                          value={1}
                          name="dUser"
                          id="dUser"
                          checked={userSystemAccess?.user?.d == 1}
                          onChange={(e) => {
                            let tempUserSystemAccess = userSystemAccess;
                            if (e.target.checked) {
                              if (tempUserSystemAccess?.user?.d)
                                tempUserSystemAccess.user.d = 1;
                            } else {
                              if (tempUserSystemAccess?.user?.d)
                                tempUserSystemAccess.user.d = 0;
                            }
                            setUserSystemAccess(tempUserSystemAccess);
                            setFormChangeCount(formChangeCount + 1);
                            console.log(
                              "tempUserSystemAccess_",
                              tempUserSystemAccess
                            );
                          }}
                        />
                        Delete
                        {/* </strong> */}
                      </div>
                    </div>

                    <br />
                    <br />
                    <div className="row">
                      <div className="col-12">
                        <Button type="submit" className="btn btn-primary btn-sm">
                          Submit/Assign System Access
                        </Button>
                      </div>
                    </div>
                  </Form>

                  {/* <div className="row">
                    <div className="col-4">
                      <strong>Nature </strong>
                    </div>
                    <div className="col-8">{user2view.nature?.nature}</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /page content --> */}
        <Footer />
      </div>
    </Suspense>
  );
};

export default View;
