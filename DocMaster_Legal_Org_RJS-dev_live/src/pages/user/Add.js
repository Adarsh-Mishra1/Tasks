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
  console.warn(userData);
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState(""); // State for password
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [userRoles, setUserRoles] = useState([]);

  const [uname, setUname] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [eMailId, setEmailId] = useState("");
  const userSystemAccess = {
    docForm: { c: 1, r: 1, u: 1, d: 1 },
    docFormCat: { c: 1, r: 1, u: 1, d: 1 },
    // user: { c: 0, r: 0, u: 0, d: 0 },
    // userGroup: { c: 0, r: 0, u: 0, d: 0 },
    priceQuotation: { c: 1, r: 1, u: 1, d: 1 },
    docFormPreFill: { c: 1, r: 1, u: 1, d: 1 },
    department: { c: 1, r: 1, u: 1, d: 1 },
    // added by ghufranclient
    client: { c: 1, r: 1, u: 1, d: 1 },
    probInfo: { c: 1, r: 1, u: 1, d: 1 },
    clientCase: { c: 1, r: 1, u: 1, d: 1 },
    research: { c: 1, r: 1, u: 1, d: 1 },
    fileMerge: { c: 1, r: 1, u: 1, d: 1 },
  };
  function onSubmitHandler(e) {
    e.preventDefault();

    if (password === confirmPassword) {
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
          console.warn("AddUser_responseData", responseData);
          if (responseData.resultCode === 1) {
            changePassword(responseData.resultMessage.id);
            // goToUserPage();
          } else {
            alert(responseData.resultMessage);
            setErrorMsg(responseData.resultMessage);
          }
        })
        .catch((error) => {
          console.error("AddUser_error", error);
          setErrorMsg("Error while processing");
        });
    } else {
      alert("Please enter correct passowrd");
    }
  }

  function changePassword(id) {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const passwordData = {
      id: id,
      adminId: userData.id,
      dataType: 3,
      dataValue: password,
    };

    axios
      .post(
        "https://web1024.ipguide.net:8443/organisation/updateUser",
        passwordData,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log(responseData);
        if (responseData.resultCode === 1) {
         // sendEmail();
        alert("user added successfully");
        goToUserPage();
        } else {
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        setErrorMsg("Error while updating the password");
      });
  }

  // function sendEmail() {
  //   const emailPayload = {
  //     to: eMailId,
  //     subject: "DocMaster Legal Login Credentials",
  //     text: `Hello ${name}, Please find the login credentials for the DocMaster Legal Module: https://www.legal.docmaster.in, UserName: ${eMailId}, Password: ${password}`,
  //   };

  //   axios
  //     .post(
  //       "https://web1024.ipguide.net:8443/user_new/send-email-legal",
  //       emailPayload,
  //       {
  //         headers: {
  //           ...apiKeyHeader(),
  //           "Content-Type": "application/json",
  //         }          
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       if (response.status === 200) {
  //         console.log("Email sent successfully!");
  //         goToUserPage();
  //       } else {
  //         console.log("Failed to send email:", response.data.resultMessage);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error while sending email:", error);
  //     });
  // }

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

                    <div className="mb-3">
                      <Label for="password">Password</Label>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label for="confirmPassword">Confirm Password</Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-sm m-0 btn-primary">
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
