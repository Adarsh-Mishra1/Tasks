//department/ShowAll.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import {
  WsGetOrgDocFormDepartmentMap,
  WsDeleteOrgDocFormDepartmentMap,
} from "../../configs/WebService";
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

const DocForms = () => {
  const [errorMsg, setErrorMsg] = useState("");

  const [orgDepartments, setOrgDepartments] = useState([]);

  let navigate = useNavigate();
  let location = useLocation();

  const [openAddOrgDepModal, setOpenAddOrgDepModal] = useState(false);
  const userData = userStore((state) => state.user);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Documents",
      accessor: "dfname",
    },
    {
      Header: "Department",
      accessor: "departmentNm",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getAllDepartmentDocForms();
  }, []);

  const getAllDepartmentDocForms = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(
        WsGetOrgDocFormDepartmentMap +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        },
      )
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

      simpleData["dfname"] = simpleData.orgDocForm.nameTitle;
      simpleData["departmentNm"] = simpleData.department.name;

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docForm.d == 1 ? (
            <i
              title="Remove DocFrom from Department"
              data-tip="Remove DocFrom from Department"
              className="fa fa-times-circle"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => onOrgDocFormDepartmentDelete(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
    });
    return simpleDataArray;
  };

  const onSuccessfullReturn = (flag) => {
    if (flag) {
      getAllDepartmentDocForms();
    }
    setOpenAddOrgDepModal(false);
  };

  const onOrgDocFormDepartmentDelete = (record) => {
    confirmAlert({
      title: "Confirm!",
      message:
        "Sure to delete DocForm mapping with '" +
        record.department.name +
        "' department",
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
        WsDeleteOrgDocFormDepartmentMap,
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
          getAllDepartmentDocForms();
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
              <h3>Department(s) DocForm(s)</h3>
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
                  <h2>
                    All Department(s) DocForm(s)
                    {/* <i
                      title="Add Department"
                      //   data-tip="Add Department"
                      className="fa fa-plus"
                      style={{ color: "green", cursor: "pointer" }}
                      onClick={() => setOpenAddOrgDepModal(true)}
                      aria-hidden="true"
                    /> */}
                  </h2>
                  <Modal
                    // transparent={false}
                    // ariaHideApp={false}
                    isOpen={openAddOrgDepModal}
                    onRequestClose={() => setOpenAddOrgDepModal(false)}
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
                        <h5>Add Department</h5>
                      </div>
                      <div className="col-6" style={{ textAlign: "end" }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setOpenAddOrgDepModal(false)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                      <div className="col-12">
                        <AddOrgDepartment onReturn={onSuccessfullReturn} />
                      </div>
                    </div>
                  </Modal>
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
                    </ul>*/}
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

export default DocForms;
