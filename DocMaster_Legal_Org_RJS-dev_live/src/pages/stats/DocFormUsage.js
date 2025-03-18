//DocFormUsage.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WsGetOrgDocFormUsageStats,
  WsGetOrgDocFormUsages,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DocFormUsage = () => {
  let query = useQuery();
  let type = query.get("type");

  let navigate = useNavigate();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [data2Show, setData2Show] = useState([]);

  let dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "nameTitle",
    },
    {
      Header: "UseCount",
      accessor: "useCount",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  if (type == 1) {
    dataTableColumns = [
      {
        Header: "S. No",
        accessor: "sno",
      },
      {
        Header: "User",
        accessor: "name",
      },
      {
        Header: "UseCount",
        accessor: "useCount",
      },
      {
        Header: "Actions",
        accessor: "actiontd",
      },
    ];
  }

  if (type == 3) {
    dataTableColumns = [
      {
        Header: "S. No",
        accessor: "sno",
      },
      {
        Header: "User",
        accessor: "uname",
      },
      {
        Header: "Documents",
        accessor: "nameTitle",
      },
      {
        Header: "Used On",
        accessor: "usedOn",
      },
      //   {
      //     Header: "Actions",
      //     accessor: "actiontd",
      //   },
    ];
  }

  useEffect(() => {
    getStatData();
  }, []);

  const getStatData = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    let WebService2call =
      WsGetOrgDocFormUsageStats + "/" + userData.org.id + "/" + type;
    if (type == 3) {
      WebService2call = WsGetOrgDocFormUsages + "/" + userData.org.id;
    }
    axios
      .get(WebService2call, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getStatData_responseData", responseData);
        if (responseData.resultCode === 1) {
          setData2Show(processData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          //   setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getStatData_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          <i
            data-tip="View"
            title="View"
            key={`view${index}`}
            className="fa fa-eye"
            style={{ color: "blue", cursor: "pointer", marginRight: 10 }}
            aria-hidden="true"
            onClick={() => go2ViewDocForm(simpleData)}
          ></i>
        </>
      );
      if (simpleData.createdOn != null && simpleData.createdOn != undefined) {
        simpleData["usedOn"] = new Date(Number(simpleData.createdOn)) + "";
        // console.log("processData_blankData",new Date(Number(simpleData.createdOn)))
      }
    });
    // console.log("processData_blankData",blankData)
    // console.log("processData_simpleDataArray", simpleDataArray);
    // return blankData;
    return simpleDataArray;
  };

  const go2ViewDocForm = (data2get) => {
    delete data2get["actiontd"]; //DevNote:Needed
    // console.log("go2ViewDocForm_docForm",docForm)
    navigate("/docFormUsageData?type=" + type, {
      state: {
        data2get: data2get,
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
              <h3>
                {type == 0 ? (
                  <>Usage Stats By DocForm(s)</>
                ) : (
                  <>Usage Stats By User(s)</>
                )}
              </h3>
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
                 
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {data2Show != undefined && data2Show.length > 0 ? (
                    <div className="table-responsive">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={data2Show}
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

export default DocFormUsage;
