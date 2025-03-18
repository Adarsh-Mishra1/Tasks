import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WSAddUser } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

// import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Add = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);
  const [errorMsg, setErrorMsg] = useState("");

  // const [userRoles, setUserRoles] = useState([]);

  const [uname, setUname] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [eMailId, setEmailId] = useState("");

  const [userSystemAccess, setUserSystemAccess] = useState({
    docForm: { c: 0, r: 0, u: 0, d: 0 },
    docFormCat: { c: 0, r: 0, u: 0, d: 0 },
    user: { c: 0, r: 0, u: 0, d: 0 },
    userGroup: { c: 0, r: 0, u: 0, d: 0 },
    priceQuotation: { c: 0, r: 0, u: 0, d: 0 },
    docFormPreFill: { c: 0, r: 0, u: 0, d: 0 },
    department: { c: 0, r: 0, u: 0, d: 0 },
  });
  const [formChangeCount, setFormChangeCount] = useState(0);
  /*
  useEffect(()=>{
    getUserRoles();
  },[]);

  const getUserRoles=()=>{
    toast.success("Loading ...", {
      autoClose: 1000,
    });  

    axios
      .post(WSReadRoles,
          JSON.stringify({
            adminUserId: userData.id,
          }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getUserRoles_responseData", responseData);
        if (responseData.result_code === 1) {
          setUserRoles(responseData.result_message);
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getUserRoles_error", error);
        setErrorMsg("Error while processing");
      });
  }
*/

  function onSubmitHandler(e) {
    e.preventDefault();

    /*
    [Raw-JSON]
adminUserId:number,
orgId:number,
name:text,
mobileNo:text,
emailId:text(*optional can be empty string),
*/
    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: userData.org.id,
      orgFormId: 0,
      name: name,
      mobileNo: mobileNo,
      emailId: eMailId,
      crudAccess: JSON.stringify(userSystemAccess),
    });
    if (uname != undefined && uname.length >= 6) {
      params2post = JSON.stringify({
        adminUserId: userData.id,
        orgId: userData.org.id,
        orgFormId: 0,
        name: name,
        uname: uname,
        mobileNo: mobileNo,
        emailId: eMailId,
        crudAccess: JSON.stringify(userSystemAccess),
      });
    }

    console.log("AddUser_onSubmit_params2post", params2post);

    axios
      .post(WSAddUser, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("AddUser_responseData", responseData);
        if (responseData.resultCode === 1) {
          goToUserPage();
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("AddUser_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToUserPage() {
    navigate("/userShowAll");
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Add User</h3>
            </div>

            {/* <div className="title_right">
                <div className="col-md-5 col-sm-5   form-group pull-right top_search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for..."
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        Go!
                      </button>
                    </span>
                  </div>
                </div>
              </div> */}
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Create a new user</h2>
                  {/* <ul className="nav navbar-right panel_toolbox">
                      <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                      </li>
                      <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Settings 1</a>
                            <a className="dropdown-item" href="#">Settings 2</a>
                          </div>
                      </li>
                      <li><a className="close-link"><i className="fa fa-close"></i></a>
                      </li>
                    </ul> */}
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <Form onSubmit={onSubmitHandler}>
                    <div className="mb-3">
                      <Label htmlFor="userName" className="form-label">
                        Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="userName"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        minLength={3}
                        maxLength={60}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="uName" className="form-label">
                        Uname *
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="uName"
                        name="uName"
                        aria-describedby="uName"
                        value={uname}
                        onChange={(e) => {
                          setUname(e.target.value);
                        }}
                        minLength={6}
                        maxLength={20}
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="userMobileNO" className="form-label">
                        Mobile No *
                      </Label>
                      <Input
                        type="phone"
                        className="form-control"
                        id="mobileNo"
                        name="mobileNo"
                        aria-describedby="userMobileNo"
                        value={mobileNo}
                        onChange={(e) => {
                          setMobileNo(e.target.value);
                        }}
                        minLength={10}
                        maxLength={62}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="userEmailId" className="form-label">
                        eMailId *
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="eMailId"
                        name="eMailId"
                        aria-describedby="userEmailId"
                        value={eMailId}
                        onChange={(e) => {
                          setEmailId(e.target.value);
                        }}
                        minLength={7}
                        maxLength={62}
                      />
                    </div>

                    {/* <div className="mb-3">
                      <label for="exampleInputPassword1" className="form-label">Role</label>
                      <Input
                        className="form-control"
                        type="select"
                        name="docRole"
                        id="docRole"
                        aria-describedby="docRole"
                        onChange={(event) => {
                          setFormChangeCount(formChangeCount + 1);
                          docFormData.nature_code = event.target.value;
                          setDocFormData(docFormData);
                          setNatureCode(event.target.value);
                        }}
                      >
                        <option value="">Select Nature</option>
                        {docNaturesData.length
                          ? docNaturesData.map((docNatureData, index) =>
                              (() => {
                                if (
                                  docFormData.nature_code == docNatureData.id
                                ) {
                                  return (
                                    <option
                                      key={docNatureData.id}
                                      value={docNatureData.id}
                                      selected
                                    >
                                      {docNatureData.nature}
                                    </option>
                                  );
                                } else {
                                  return (
                                    <option
                                      key={docNatureData.id}
                                      value={docNatureData.id}
                                    >
                                      {docNatureData.nature}
                                    </option>
                                  );
                                }
                              })()
                            )
                          : null}
                      </Input>
                    </div> */}

                    <div className="oranisation-form-section  pb-2">
                      <p className="organisation-form-head">CRUD Access</p>

                      <div>
                        <div className="row">
                          <div className="col-4">
                            <strong>DocForm</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cDocForm"
                              id="cDocForm"
                              checked={userSystemAccess?.docForm?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docForm.c = 1;
                                } else {
                                  tempUserSystemAccess.docForm.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rDocForm"
                              id="rDocForm"
                              checked={userSystemAccess?.docForm?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docForm.r = 1;
                                } else {
                                  tempUserSystemAccess.docForm.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uDocForm"
                              id="uDocForm"
                              checked={userSystemAccess?.docForm?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docForm.u = 1;
                                } else {
                                  tempUserSystemAccess.docForm.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dDocForm"
                              id="dDocForm"
                              checked={userSystemAccess?.docForm?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docForm.d = 1;
                                } else {
                                  tempUserSystemAccess.docForm.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <strong>DocForm PreFill</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cDocFormPreFill"
                              id="cDocFormPreFill"
                              checked={userSystemAccess?.docFormPreFill?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormPreFill.c = 1;
                                } else {
                                  tempUserSystemAccess.docFormPreFill.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rDocFormPreFill"
                              id="rDocFormPreFill"
                              checked={userSystemAccess?.docFormPreFill?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormPreFill.r = 1;
                                } else {
                                  tempUserSystemAccess.docFormPreFill.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uDocFormPreFill"
                              id="uDocFormPreFill"
                              checked={userSystemAccess?.docFormPreFill?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormPreFill.u = 1;
                                } else {
                                  tempUserSystemAccess.docFormPreFill.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dDocFormPreFill"
                              id="dDocFormPreFill"
                              checked={userSystemAccess?.docFormPreFill?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormPreFill.d = 1;
                                } else {
                                  tempUserSystemAccess.docFormPreFill.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <strong>DocForm Category</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cDocFormCat"
                              id="cDocFormCat"
                              checked={userSystemAccess?.docFormCat?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;

                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormCat.c = 1;
                                } else {
                                  tempUserSystemAccess.docFormCat.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rDocFormCat"
                              id="rDocFormCat"
                              checked={userSystemAccess?.docFormCat?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormCat.r = 1;
                                } else {
                                  tempUserSystemAccess.docFormCat.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uDocFormCat"
                              id="uDocFormCat"
                              checked={userSystemAccess?.docFormCat?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormCat.u = 1;
                                } else {
                                  tempUserSystemAccess.docFormCat.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dDocFormCat"
                              id="dDocFormCat"
                              checked={userSystemAccess?.docFormCat?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.docFormCat.d = 1;
                                } else {
                                  tempUserSystemAccess.docFormCat.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <strong>User</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cUser"
                              id="cUser"
                              checked={userSystemAccess?.user?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.user.c = 1;
                                } else {
                                  tempUserSystemAccess.user.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rUser"
                              id="rUser"
                              checked={userSystemAccess?.user?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.user.r = 1;
                                } else {
                                  tempUserSystemAccess.user.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uUser"
                              id="uUser"
                              checked={userSystemAccess?.user?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.user.u = 1;
                                } else {
                                  tempUserSystemAccess.user.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dUser"
                              id="dUser"
                              checked={userSystemAccess?.user?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.user.d = 1;
                                } else {
                                  tempUserSystemAccess.user.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <strong>User Group</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cUserGroup"
                              id="cUserGroup"
                              checked={userSystemAccess?.userGroup?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.userGroup.c = 1;
                                } else {
                                  tempUserSystemAccess.userGroup.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rUserGroup"
                              id="rUserGroup"
                              checked={userSystemAccess?.userGroup?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.userGroup.r = 1;
                                } else {
                                  tempUserSystemAccess.userGroup.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uUserGroup"
                              id="uUserGroup"
                              checked={userSystemAccess?.userGroup?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.userGroup.u = 1;
                                } else {
                                  tempUserSystemAccess.userGroup.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dUserGroup"
                              id="dUserGroup"
                              checked={userSystemAccess?.userGroup?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.userGroup.d = 1;
                                } else {
                                  tempUserSystemAccess.userGroup.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <strong>Department</strong>
                          </div>
                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="cDepartment"
                              id="cDepartment"
                              checked={userSystemAccess?.department?.c == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.department.c = 1;
                                } else {
                                  tempUserSystemAccess.department.c = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Create
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="rDepartment"
                              id="rDepartment"
                              checked={userSystemAccess?.department?.r == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.department.r = 1;
                                } else {
                                  tempUserSystemAccess.department.r = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Read
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="uDepartment"
                              id="uDepartment"
                              checked={userSystemAccess?.department?.u == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.department.u = 1;
                                } else {
                                  tempUserSystemAccess.department.u = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Update
                          </div>

                          <div className="col-2">
                            <Input
                              type="checkbox"
                              value={1}
                              name="dDepartment"
                              id="dDepartment"
                              checked={userSystemAccess?.department?.d == 1}
                              onChange={(e) => {
                                let tempUserSystemAccess = userSystemAccess;
                                if (e.target.checked) {
                                  tempUserSystemAccess.department.d = 1;
                                } else {
                                  tempUserSystemAccess.department.d = 0;
                                }
                                setUserSystemAccess(tempUserSystemAccess);
                                setFormChangeCount(formChangeCount + 1);
                                console.log(
                                  "tempUserSystemAccess_",
                                  tempUserSystemAccess,
                                );
                              }}
                            />
                            Delete
                          </div>
                        </div>

                        {/* <div className="row">
                        <div className="col-4">
                          <strong>Price Quotation</strong>
                        </div>
                        <div className="col-2">
                          <Input
                            type="checkbox"
                            value={1}
                            name="cPriceQuotation"
                            id="cPriceQuotation"
                            checked={userSystemAccess?.priceQuotation?.c == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.priceQuotation.c = 1;
                              } else {
                                tempUserSystemAccess.priceQuotation.c = 0;
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
                            name="rPriceQuotation"
                            id="rPriceQuotation"
                            checked={userSystemAccess?.priceQuotation?.r == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.priceQuotation.r = 1;
                              } else {
                                tempUserSystemAccess.priceQuotation.r = 0;
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
                            name="uPriceQuotation"
                            id="uPriceQuotation"
                            checked={userSystemAccess?.priceQuotation?.u == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.priceQuotation.u = 1;
                              } else {
                                tempUserSystemAccess.priceQuotation.u = 0;
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
                            name="dPriceQuotation"
                            id="dPriceQuotation"
                            checked={userSystemAccess?.priceQuotation?.d == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.priceQuotation.d = 1;
                              } else {
                                tempUserSystemAccess.priceQuotation.d = 0;
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
                      </div> */}
                      </div>
                    </div>

                    <div></div>

                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </Form>
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

export default Add;
