//ShowAll.js//User
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSGetOrgUsers,
  WsGetOrgUsersByDepartment,
  WsDeleteOrgUserDepartmentMap,
  WsRemoveUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const MapUser2Dep = lazy(() => import("../../components/MapUser2Dep"));
const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAll = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const userData = userStore((state) => state.user);
  const [openAddUser2DepModal, setOpenAddUser2DepModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orgUsers, setOrgUsers] = useState([]);
  let department = location?.state?.department;

  let dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Uname*",
      accessor: "uname",
    },
    {
      Header: "Mobile No*",
      accessor: "mobileNo",
    },
    {
      Header: "Is Email Verify",
      accessor: "isEmailVerifyTxt",
    },
    {
      Header: "Role",
      accessor: "roleTxt",
    },
    {
      Header: "Is Mobile Verify",
      accessor: "isMobileVerifyTxt",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  if (department != null && department != undefined && department?.id > 0) {
    dataTableColumns = [
      {
        Header: "S. No",
        accessor: "sno",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Uname*",
        accessor: "uname",
      },
      {
        Header: "Mobile No*",
        accessor: "mobileNo",
      },
      {
        Header: "Is Email Verify",
        accessor: "isEmailVerifyTxt",
      },
      {
        Header: "Actions",
        accessor: "actiontd",
      },
    ];
  }

  useEffect(() => {
    if (department != null && department != undefined && department?.id > 0) {
      getOrgDepUsers();
    } else {
      getOrgUsers();
    }
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
        if (responseData.resultCode === 1) {
          setErrorMsg("");
          setOrgUsers(processData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgUsers_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;

      simpleData["isMobileVerifyTxt"] =
        simpleData.isMobileVerify > 0 ? "Yes" : "No";
        simpleData["isEmailVerifyTxt"] =
        simpleData.isEmailVerify > 0 ? "Yes" : "No";

      simpleData["roleTxt"] = "";
      if (
        simpleData?.role?.code == "gnrluser" ||
        simpleData?.role?.code == "aprvr" ||
        simpleData?.role?.code == "rsrchr" ||
        simpleData?.role?.code == "viewr"
      ) {
        simpleData["roleTxt"] = simpleData.role?.name;
      }

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.user.r == 1 ? (
            <i
              data-tip="View"
              title="View"
              key={`view${index}`}
              className="fa fa-eye mx-2"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => go2ViewUser(simpleData)}
            ></i>
          ) : null}

          {userData.crudAccess?.user.d == 1 ? (
            
            <i
              title="Remove"
              data-tip="Remove from Org"
              className="fa fa-trash mx-2"
              style={{color:'red',cursor:'pointer'}}
              onClick={() => removeUserFromOrg(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
    });
    return simpleDataArray;
  };

  const getOrgDepUsers = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });
    axios
      .get(
        WsGetOrgUsersByDepartment + "/" + userData.org.id + "/" + department.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDepUsers_responseData", responseData);
        if (responseData.resultCode === 1) {
          setOrgUsers(processDepData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgUsers_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processDepData = (simpleDataArray) => {
    let blankData = [];
    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);
      let simpleDataTemp = simpleData;
      simpleData = simpleData.user;

      console.log("processData_simpleData", simpleData);
      simpleData["sno"] = index + 1;

      // simpleData["isMobileVerifyTxt"] =simpleData.isMobileVerify > 0?"Yes": "No";
      // if (simpleData.isMobileVerify > 0) {
      //   simpleData["isMobileVerifyTxt"] = "Yes";
      // }

      // simpleData["roleTxt"] = simpleData.role?.name;

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.user.r == 1 ? (
            <i
              data-tip="View"
              title="View"
              key={`view${index}`}
              className="fa fa-eye mx-2"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => go2ViewUser(simpleData)}
            ></i>
          ) : null}

          {userData.crudAccess?.user.d == 1 ? (
            <i
              title="Remove User from Department"
              data-tip="Remove User from Department"
              className="fa fa-times-circle"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => onOrgUserDepartmentDelete(simpleDataTemp)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );

      blankData.push(simpleData);
    });
    return blankData;
  };

  const go2ViewUser = (user) => {
    delete user["actiontd"]; //DevNote:Needed
    navigate("/userView", {
      state: {
        user2view: user,
      },
    });
  };

  const removeUserFromOrg = (user) => {
    console.log("removeUserFromOrg_user", user);

    confirmAlert({
      title: "Confirm!",
      message: "Sure to remove User '" + user.name + "' from Organisation",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceed2removeUserFromOrg(user.id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceed2removeUserFromOrg = (recordId) => {
    axios
      .post(
        WsRemoveUser,
        JSON.stringify({
          adminId: userData.id,
          userId: recordId,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("RemoveUserFromOrg_Response", responseData);
        if (responseData.resultCode == 1) {
          getOrgUsers();
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("Delemap_error", error);
      });
  };

  const onMapReturn = (flag) => {
    if (flag) {
      getOrgDepUsers();
    }
    setOpenAddUser2DepModal(false);
  };

  const onOrgUserDepartmentDelete = (record) => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to remove User from '" + department.name + "' department",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceedOrgDocFormDepartmentDelete(record.id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceedOrgDocFormDepartmentDelete = (recordId) => {
    axios
      .post(
        WsDeleteOrgUserDepartmentMap,
        JSON.stringify({
          id: recordId,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("Delemap_responseData", responseData);
        if (responseData.resultCode == 1) {
          getOrgDepUsers();
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("Delemap_error", error);
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
              <div className="d-flex content-align-start gap-3">
                <a href="/userAdd" className=" ">Add User <i className="fa fa-plus"></i></a>
                {/* <a className="btn btn-primary btn sm">Add User <i className="fa fa-plus"></i></a> */}
              </div>
              {department?.id > 0 ? (
                <h3>
                  Department: {department.name}{" "}
                  <i
                    title="Add User to Department"
                    // data-tip="Add User to Department"
                    className="fa fa-plus"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() => setOpenAddUser2DepModal(true)}
                    aria-hidden="true"
                  />
                </h3>
              ) : null}
            </div>
            {openAddUser2DepModal == true ? (
              <Modal
                // transparent={false}
                // ariaHideApp={false}
                isOpen={openAddUser2DepModal}
                onRequestClose={() => setOpenAddUser2DepModal(false)}
                style={{
                  overlay: {
                    // border: "1px solid gray",
                    // width: "45vw",
                    width: "99vw",
                    height: "100vh",
                    // left: "27%",
                    left: 0,
                    top: "0%",
                    // background: "",
                    zIndex: "5",
                  },
                  content: {
                    left: "20%",
                    width: "69vw",
                    // background: "transparent",
                    // border: "none",
                    // boxShadow:"0 0 5px black"
                    zIndex: "4",
                  },
                }}
              >
                <div className="row">
                  <div className="col-6">
                    <h5>Add User to '{department.name}' Department</h5>
                  </div>
                  <div className="col-6" style={{ textAlign: "end" }}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setOpenAddUser2DepModal(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                  <div className="col-12">
                    <MapUser2Dep
                      orgId={userData.org.id}
                      adminUserId={userData.id}
                      department={department}
                      onReturn={onMapReturn}
                    />
                  </div>
                </div>
              </Modal>
            ) : null}

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
                 
                <div className="x_content">
                  {errorMsg.length > 1 ? <b>{errorMsg}</b> : null}

                  {orgUsers != undefined && orgUsers.length > 0 ? (
                    <div className="table-responsive">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={orgUsers}
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
