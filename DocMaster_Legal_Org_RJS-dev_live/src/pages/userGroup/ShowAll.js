//ShowAll.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import { WSGetUserGroups } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAll = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [orgUserGroups, setOrgUserGroups] = useState([]);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name/Title",
      accessor: "title",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgUserGroups();
  }, []);

  const getOrgUserGroups = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WSGetUserGroups + "/" + userData.id + "/" + userData.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgUserGroups_responseData", responseData);
        if (responseData.result_code === 1) {
          setOrgUserGroups(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgUserGroups_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    // let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;

      simpleData["actiontd"] = (
        <>
          {/* {userData.crudAccess?.userGroup.r == 1 ? (
            <i
              data-tip="View"
              title="View"
              key={`view${index}`}
              className="fa fa-eye mx-2"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => go2ViewUserGroup(simpleData)}
            ></i>
          ) : null} */}
        {userData.crudAccess?.user.d == 1 ? (
            <i
              title="Users"
              data-tip="Users"
              key={`Users${index}`}
              className="fa fa-users mx-2"
              style={{ color: "brown", cursor: "pointer" }}
              onClick={() => go2showUserGroupUsers(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.userGroup.u == 1 ? (
            <i
              data-tip="Add USer"
              title="Add USer"
              key={`addUSer${index}`}
              className="fa fa-plus mx-2"
              style={{ color: "green", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => go2AddUser2Group(simpleData)}
            ></i>
          ) : null}

          {userData.crudAccess?.clientCase?.r == 1 ? (
            <i
              className="fa fa-briefcase mx-2"
              title="Cases"
              style={{ color: "black", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => goToClientCases(simpleData)}
            />
          ) : null}

          {userData.crudAccess?.userGroup.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete"
              key={`delete${index}`}
              className="fa fa-trash mx-2"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => delAlert(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
      // blankData.push(simpleData);
    });
    // return blankData;
    return simpleDataArray;
  };

  const go2AddUser2Group = (userGroup) => {
    delete userGroup["actiontd"]; //DevNote:Needed
    navigate("/userGroupAddUser", {
      state: {
        userGroup: userGroup,
      },
    });
  };

  const go2ViewUserGroup = (userGroup) => {
    delete userGroup["actiontd"]; //DevNote:Needed
    navigate("/userGroupView", {
      state: {
        userGroup: userGroup,
      },
    });
  };

  const go2showUserGroupUsers = (userGroup) => {
    delete userGroup["actiontd"]; //DevNote:Needed
    navigate("/userGroupView", {
      state: {
        userGroup: userGroup,
      },
    });
  };

  const goToClientCases = (userGroup) => {
    delete userGroup["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseByUserGroup", {
      state: {
        userGroup: userGroup,
      },
    });
  };

  const delAlert = () => {
    alert("To be Done");
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
              <h3>User group(s)</h3>
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
                  <h2>User group(s)</h2>
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
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {orgUserGroups != undefined && orgUserGroups.length > 0 ? (
                    <div className="table-responsive">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={orgUserGroups}
                      />
                    </div>
                  ) : (
                    <>No Data</>
                  )}
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

export default ShowAll;
