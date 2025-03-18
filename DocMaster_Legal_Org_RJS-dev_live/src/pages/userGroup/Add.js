import React, { useState, Suspense, lazy } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WSAddUserGroup } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Add = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);
  const [errorMsg, setErrorMsg] = useState("");

  // const [userRoles, setUserRoles] = useState([]);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const submitUserGroup = (e) => {
    e.preventDefault();
    /*
adminUserId:number,
orgId:number,
title:text,
details:text*/

    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: userData.org.id,
      title: title,
      details: details,
    });

    console.log("AddUser_onSubmit_params2post", params2post);

    axios
      .post(WSAddUserGroup, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("AddUser_responseData", responseData);
        if (responseData.result_code === 1) {
          goToUserPage();
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("AddUser_error", error);
        setErrorMsg("Error while processing");
      });
  };

  function goToUserPage() {
    navigate("/userGroupShowAll");
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
              <h3>Add User Group(s)</h3>
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
                  <h2>Create a new user group</h2>
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
                  <Form onSubmit={submitUserGroup}>
                    <div className="mb-3">
                      <Label htmlFor="title" className="form-label">
                        Title
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        aria-describedby="title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        minLength={3}
                        maxLength={60}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="details" className="form-label">
                        Details
                      </Label>
                      <Input
                        type="textarea"
                        className="form-control"
                        id="details"
                        name="details"
                        aria-describedby="details"
                        value={details}
                        onChange={(e) => {
                          setDetails(e.target.value);
                        }}
                        minLength={10}
                        maxLength={150}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary m-0">
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
