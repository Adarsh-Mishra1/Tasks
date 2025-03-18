//UserAccess
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import {
  WSGetOrgUsers,
  WSGetOrgUserCrudAccess,
  WSPutOrgUserCrudAccess,
} from "../../configs/WebService";

import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const UserAccess = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("UserAccess_locationstate", location.state);
  const userData = userStore((state) => state.user);

  const docForm = location.state.docForm;
  const [user2set, setUser2set] = useState(0);
  const [formChangeCount, setFormChangeCount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userSystemAccess, setUserSystemAccess] = useState({
    c: 1,
    r: 0,
    u: 0,
    d: 0,
  });

  const [showCrudFormSection, setShowCrudFormSection] = useState(false);

  const [orgUsers, setOrgUsers] = useState([]);

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
        console.log("UserAccess_getOrgUsers_responseData", responseData);
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
    simpleDataArray.map((simpleData, index) => {
      simpleData["value"] = simpleData.id;
      simpleData["label"] = simpleData.name + " (" + simpleData.mobileNo + ")";
      blankData.push(simpleData);
    });
    console.log("UserAccess_processData_blankData", blankData);
    return blankData;
  };

  const handleOrgUserSelectChange = (selectedUser) => {
    console.log(
      "UserAccess_handleOrgUserSelectChange_selectedUser",
      selectedUser,
    );
    setUser2set(selectedUser);
    getUserDocFormAcess(selectedUser.id);
  };

  /*
  useEffect(() => {
    if(user2set!=undefined){
        console.log("UserAccess_useEffect_user2set", user2set);
        getUserDocFormAcess(user2set.id)
    }
  }, [user2set]);
  */

  const getUserDocFormAcess = (userId) => {
    setUserSystemAccess({
      c: 1,
      r: 0,
      u: 0,
      d: 0,
    }); //Setting Default

    console.log("UserAccess_getUserDocFormAcess_userId", userId);
    //[url/userId/orgId/docFormId]

    toast.success("Loading User Access Data Please Wait ...", {
      autoClose: 50,
    });

    // console.log(
    //   "UserAccess_getUserDocFormAcess_params",
    //   "/" + userId + "/" + userData.org.id + "/" + docForm.id
    // );

    axios
      .get(
        WSGetOrgUserCrudAccess +
          "/" +
          userId +
          "/" +
          userData.org.id +
          "/" +
          docForm.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log(
          "UserAccess_getUserDocFormAcess_responseData",
          responseData,
        );
        if (responseData.resultCode === 1) {
          setUserSystemAccess(responseData.resultMessage);
        }
        setShowCrudFormSection(true);
      })
      .catch((error) => {
        console.error("getUserCrud_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const onUserSystemAcessSubmit = (e) => {
    e.preventDefault();

    /*
    [Raw-JSON]
adminUserId:number,
orgId:number,
userId:number,
crudAccess:text(JSON Object),
docFormId:number (optional:default 0)
    */

    let params2post = JSON.stringify({
      adminUserId: userData.id,
      orgId: userData.org.id,
      userId: user2set.id,
      crudAccess: JSON.stringify(userSystemAccess),
      docFormId: docForm.id,
    });

    console.log("UserAccess_UserSystemAcessSubmit_params2post", params2post);

    axios
      .post(WSPutOrgUserCrudAccess, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log(
          "UserAccess_UserSystemAcessSubmit_responseData",
          responseData,
        );
        if (responseData.resultCode === 1) {
          alert(responseData.resultMessage);
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("UserAccess_UserSystemAcessSubmit_error", error);
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
          <div className="page-title">
            <div className="title_left">
              <h3>DocForm UserAccess</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>for {docForm.nameTitle}</h2>
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

                  <Form onSubmit={onUserSystemAcessSubmit}>
                    <div className="row">
                      <div className="col-2">Select User</div>
                      <div className="col-10">
                        <Select
                          options={orgUsers}
                          value={user2set}
                          onChange={handleOrgUserSelectChange}
                        />
                      </div>
                    </div>
                    <br />
                    {showCrudFormSection == true ? (
                      <div className="row">
                        <div className="col-4">
                          <strong>Create,Read,Update,Delete</strong>
                        </div>
                        <div className="col-2">
                          {/* <strong>  */}
                          <Input
                            type="checkbox"
                            value={1}
                            name="cDocForm"
                            id="cDocForm"
                            checked={userSystemAccess.c == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.c = 1;
                              } else {
                                tempUserSystemAccess.c = 0;
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
                          {/* </strong> */}
                        </div>

                        <div className="col-2">
                          {/* <strong>  */}
                          <Input
                            type="checkbox"
                            value={1}
                            name="rDocForm"
                            id="rDocForm"
                            checked={userSystemAccess.r == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.r = 1;
                              } else {
                                tempUserSystemAccess.r = 0;
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
                          {/* </strong> */}
                        </div>

                        <div className="col-2">
                          {/* <strong>  */}
                          <Input
                            type="checkbox"
                            value={1}
                            name="uDocForm"
                            id="uDocForm"
                            checked={userSystemAccess.u == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.u = 1;
                              } else {
                                tempUserSystemAccess.u = 0;
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
                          {/* </strong> */}
                        </div>

                        <div className="col-2">
                          {/* <strong>  */}
                          <Input
                            type="checkbox"
                            value={1}
                            name="dDocForm"
                            id="dDocForm"
                            checked={userSystemAccess.d == 1}
                            onChange={(e) => {
                              let tempUserSystemAccess = userSystemAccess;
                              if (e.target.checked) {
                                tempUserSystemAccess.d = 1;
                              } else {
                                tempUserSystemAccess.d = 0;
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
                          {/* </strong> */}
                        </div>
                      </div>
                    ) : null}
                    <br />
                    <br />
                    {showCrudFormSection == true ? (
                      <div className="row">
                        <div className="col-12">
                          <Button type="submit" className="btn btn-sm m-0 btn-primary">
                            Submit/Assign System Access
                          </Button>
                        </div>
                      </div>
                    ) : null}
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

export default UserAccess;
