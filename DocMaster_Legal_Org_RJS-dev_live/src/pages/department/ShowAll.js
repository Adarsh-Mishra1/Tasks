//department/ShowAll.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WsGetDepartmentByOrg } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);

const AddOrgDepartment = lazy(
  () => import("../../components/AddOrgDepartment.form"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAll = () => {
  const [errorMsg, setErrorMsg] = useState("");

  const [orgDepartments, setOrgDepartments] = useState([]);

  let navigate = useNavigate();
  let location = useLocation();

  const [openAddOrgDepModal, setOpenAddOrgDepModal] = useState(false);
  const userData = userStore((state) => state.user);

  const [orgDep2Edit, setOrgDep2Edit] = useState();

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Hierarchy",
      accessor: "hierarchy",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgDepartment();
  }, []);

  const getOrgDepartment = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WsGetDepartmentByOrg + "/" + userData.org.id + "/" + userData.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("get_responseData", responseData);
        if (responseData.resultCode === 1) {
          setErrorMsg("");
          setOrgDepartments(processDataTable(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("get_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processDataTable = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.department.u == 1 ? (
            <i
              title="Edit"
              data-tip="Edit"
              className="fa fa-edit"
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => editOrgDepartment(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
          &nbsp;&nbsp;
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title="Department docForm(s)"
              data-tip="Department docForm(s)"
              className="fa fa-file-text"
              style={{ color: "grey", cursor: "pointer" }}
              onClick={() => viewAllDepDocForms(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
          &nbsp;&nbsp;
          {userData.crudAccess?.user.r == 1 ? (
            <i
              title="Department User(s)"
              data-tip="Department user(s)"
              className="fa fa-user"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => viewDepUsers(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
    });
    return simpleDataArray;
  };

  const editOrgDepartment = (department) => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to edit Department",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            delete department["actiontd"]; //DevNote:Needed
            setOrgDep2Edit(department);
            setOpenAddOrgDepModal(true);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const onSuccessfullReturn = (flag) => {
    setOrgDep2Edit(undefined);
    if (flag) {
      getOrgDepartment();
    }
    setOpenAddOrgDepModal(false);
  };

  const viewAllDepDocForms = (department) => {
    delete department["actiontd"]; //DevNote:Needed
    navigate("/docFormShowAll?depDocs", {
      state: {
        department: department,
      },
    });
  };

  const viewDepUsers = (department) => {
    delete department["actiontd"]; //DevNote:Needed
    navigate("/userShowAll?usrs", {
      state: {
        department: department,
      },
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
              <h3>Department(s)</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>
                    Org Departments{" "}
                    {userData.crudAccess?.department?.c == 1 ? (
                      <i
                        title="Add Department"
                        //   data-tip="Add Department"
                        className="fa fa-plus"
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => setOpenAddOrgDepModal(true)}
                        aria-hidden="true"
                      />
                    ) : null}
                  </h2>
                  <Modal
                    // transparent={false}
                    // ariaHideApp={false}
                    isOpen={openAddOrgDepModal}
                    onRequestClose={() => {
                      setOpenAddOrgDepModal(false);
                      setOrgDep2Edit();
                    }}
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
                        <h5>
                          {orgDep2Edit != undefined ? "Edit" : "Add"} Department
                        </h5>
                      </div>
                      <div className="col-6" style={{ textAlign: "end" }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setOpenAddOrgDepModal(false);
                            setOrgDep2Edit();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                      <div className="col-12">
                        <AddOrgDepartment
                          onReturn={onSuccessfullReturn}
                          orgDep2Edit={orgDep2Edit}
                        />
                      </div>
                    </div>
                  </Modal>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {orgDepartments != undefined && orgDepartments.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={orgDepartments}
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
