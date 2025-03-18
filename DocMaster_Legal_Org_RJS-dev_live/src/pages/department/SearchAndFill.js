//department/SearchAndFill.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { WsGetOrgDocFormsByDepartment } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

// import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
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

  const [errorMsg, setErrorMsg] = useState("");
  const [docForms, setDocForms] = useState([]);

  let department = location?.state?.department;
  console.log("_location?.state", location?.state);
  console.log("_department", department);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "nameTitle",
    },
    {
      Header: "Category",
      accessor: "categoryTxt",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgDepDocForm();
  }, []);

  const getOrgDepDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 1000,
    });

    axios
      .get(
        WsGetOrgDocFormsByDepartment +
          "/" +
          userData.org.id +
          "/" +
          department.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgAllDocForm_responseData", responseData);
        if (responseData.resultCode === 1) {
          setDocForms(processData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgAllDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);
      simpleData = simpleData.orgDocForm;

      simpleData["sno"] = index + 1;
      simpleData["formId"] = simpleData.id;
      simpleData["category"] = simpleData.categoryCode;
      simpleData["categoryTxt"] = simpleData.category.category;

      simpleData["actiontd"] = (
        <>
          <i
            data-tip="View"
            title="View"
            key={`view${index}`}
            className="fa fa-eye mx-2"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => go2ViewDocForm(simpleData)}
          ></i>

          {simpleData.isPublished == 1 ? (
            <i
              title="Fill"
              data-tip="Fill"
              className="fa fa-pencil mx-2"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => goToFillOrgDocForm(simpleData)}
              aria-hidden="true"
            />
          ) : null}
        </>
      );
      blankData.push(simpleData);
    });
    return blankData;
    // return simpleDataArray;
  };

  const go2ViewDocForm = (docForm) => {
    // alert("ToDo")
    delete docForm["actiontd"]; //DevNote:Needed
    /*DevNote[ToDo]: Using WSGetOrgUserCrudAccess first fetch is user have access to fill this form or not 
    i.e. userCrudAccess.r=1 for this user and docFormId
    */

    //ToDo:Process as per //WSGetOrgUserCrudAccess and docForm.id
    let userSystemAccess = {
      c: 1,
      r: 1,
      u: 0,
      d: 0,
    };

    if (userSystemAccess.r == 1) {
      navigate("/myDocFormView", {
        state: {
          docForm: docForm,
        },
      });
    } else {
      alert("You don't have access to this DocForm");
    }
  };

  const goToFillOrgDocForm = (docForm) => {
    delete docForm["actiontd"]; //DevNote:Needed
    /*DevNote[ToDo]: Using WSGetOrgUserCrudAccess first fetch is user have access to fill this form or not 
    i.e. userCrudAccess.c=1 for this user and docFormId
    */
    //ToDo:Process as per //WSGetOrgUserCrudAccess and docForm.id
    let userSystemAccess = {
      c: 1,
      r: 0,
      u: 0,
      d: 0,
    };

    if (userSystemAccess.c == 1) {
      navigate("/orgDocFormFill", {
        state: {
          docForm: docForm,
        },
      });
    } else {
      alert("You don't have access to this DocForm");
    }
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
              <h3>Org '{department.name}' DocForm(s)</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                {/* <div className="x_title">
                  <h2>Organisation DocForms</h2>
                  <div className="clearfix"></div>
                </div> */}
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {docForms != undefined && docForms.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={docForms}
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
