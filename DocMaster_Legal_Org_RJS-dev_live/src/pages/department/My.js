//department/My.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import Modal from "react-modal";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WsGetOrgDepartmentsByUser } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const MyDepartments = () => {
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
      Header: "Name",
      accessor: "name",
    },
    // {
    //   Header: "Hierarchy",
    //   accessor: "hierarchy",
    // },
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
      .get(
        WsGetOrgDepartmentsByUser + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("get_responseData", responseData);
        if (responseData.resultCode === 1) {
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

      simpleData["name"] = simpleData.department.name;
      // simpleData["hierarchy"] = simpleData.department.hierarchy;

      simpleData["actiontd"] = (
        <>
          &nbsp;&nbsp;
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title={simpleData.department.name + " docForm(s)"}
              data-tip={simpleData.department.name + " docForm(s)"}
              className="fa fa-file-text"
              style={{ color: "grey", cursor: "pointer" }}
              onClick={() => viewAllDepDocForms(simpleData.department)}
              aria-hidden="true"
            />
          ) : null}
          {/* &nbsp;&nbsp;
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title={simpleData.department.name + " submitted docForm(s)"}
              data-tip={simpleData.department.name + " submitted docForm(s)"}
              className="fa fa-file-text"
              style={{ color: "blue", cursor: "pointer" }}
              //   onClick={() => editOrgDepartment(simpleData)}
              aria-hidden="true"
            />
          ) : null}
          &nbsp;&nbsp;
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title={simpleData.department.name + " drafted docForm(s)"}
              data-tip={simpleData.department.name + " drafted docForm(s)"}
              className="fa fa-file-text"
              style={{ color: "green", cursor: "pointer" }}
              //   onClick={() => editOrgDepartment(simpleData)}
              aria-hidden="true"
            />
          ) : null} */}
        </>
      );
    });
    return simpleDataArray;
  };

  const viewAllDepDocForms = (department) => {
    delete department["actiontd"]; //DevNote:Needed
    navigate("/myDepDocForms2Fill?depDocs", {
      state: {
        department: department,
      },
    });
  };

  const onSuccessfullReturn = (flag) => {
    if (flag) {
      getOrgDepartment();
    }
    setOpenAddOrgDepModal(false);
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
                  <h2>My Department(s)</h2>
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

export default MyDepartments;
