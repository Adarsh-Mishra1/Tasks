import { useEffect, useState, Suspense, lazy } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { WsGetOrgResearchSubjects } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));
const OrgResearchs = () => {
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
  const location = useLocation();
  console.log("OrgResearchs_location_", location);
  const navigate = useNavigate();
  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Topic",
      accessor: "subject",
    },
    {
      Header: "Stage",
      accessor: "isApproved",
    },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getOrgResearchs();
    } else {
    }
  }, []);

  const getOrgResearchs = () => {
    axios
      .get(
        WsGetOrgResearchSubjects + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData", responseData);
        if (responseData.resultCode == 1) {
          setTableData(set2DataTableDatas(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          // this.setState({ errorMsg: responseData.result_message });
        }
      })
      .catch((error) => {
        console.error("error", error);
        // this.setState({ errorMsg: "Error while getting data" });
      });
  };

  const set2DataTableDatas = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["isApproved"] =
        simpleData.approvedLevel < 0
          ? "Not Approved"
          : simpleData.approvedLevel;
      simpleData["actiontd"] = (
        <>
          {userData.userType == "viewr" ? (
            <>
              {userData.crudAccess?.research?.r == 1 ? (
                <i
                  className="fa fa-eye mx-2"
                  title="View"
                  style={{ color: "blue", cursor: "pointer" }}
                  aria-hidden="true"
                  onClick={() => viewOrgResearchSubject(simpleData, 3)}
                />
              ) : null}
            </>
          ) : (
            <>
              {userData.crudAccess?.research?.r == 1 ? (
                <i
                  className="fa fa-eye mx-2"
                  title="View"
                  style={{ color: "blue", cursor: "pointer" }}
                  aria-hidden="true"
                  onClick={() => viewOrgResearchSubject(simpleData, 0)}
                />
              ) : null}
              {userData.crudAccess?.research?.u == 1 ? (
                <i
                  className="fa fa-pencil mx-2"
                  title="Edit"
                  style={{ color: "green", cursor: "pointer" }}
                  aria-hidden="true"
                  onClick={() => viewOrgResearchSubject(simpleData, 1)}
                />
              ) : null}
            </>
          )}
        </>
      );
    });
    return simpleDataArray;
  };

  const viewOrgResearchSubject = (orgResearch, type) => {
    console.log("orgResearch", orgResearch);
    delete orgResearch["actiontd"]; //Bug(If Not Using): Point To Be Notted
    if (type == 0) {
      navigate("/orgResearch", {
        state: {
          subject: orgResearch,
        },
      });
    }
    if (type == 1) {
      navigate("/orgResearchEdit", {
        state: {
          subject: orgResearch,
        },
      });
    }
    if (type == 3) {
      navigate("/orgResearchView", {
        state: {
          subject: orgResearch,
        },
      });
    }
  };
  /*
  const submitResearchSubjectForApproval = () => {
    if (
      window.confirm(
        "Are you sure you want to Submit Your Research no furthur changes will be allow at this level after submission",
      ) === true
    ) {
      proceed2submitResearchSubjectForApproval();
    }
  };

  const proceed2submitResearchSubjectForApproval = () => {

    console.log(
      "params",
      JSON.stringify({
        subjectId: researchSubject.id,
        level: researchSubject.approvedLevel + 1,
        userId: userData.id,
      }),
    );

    axios
      .post(
        WsSubmitResearchSubjectForApproval,
        JSON.stringify({
          subjectId: researchSubject.id,
          level: researchSubject.approvedLevel + 1,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setSubmitStatus(0);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };
  */
  return (
    <Suspense fallback={<>Loading...</>}>
      {/* <div className="main_container"> */}
      {/* <Sidebar /> */}
      {/* <Navbar /> */}

      {/* <!-- page content --> */}

      {/* {DevNote: Show Page Content Here} */}
      <div
        // className="right_col"
        role="main"
      >
         <div className="page-title mb-2"></div>
        {/*<div className="page-title py-0">
           <div className="title_left">
            <h3>All Research(s)</h3>
          </div> */}

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
              </div> 
        </div>*/}

        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              <div className="x_content">
                {tableData && tableData.length > 0 ? (
                   
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                   
                ) : null}
              </div>
              {/* <div
                style={{
                  fontSize: "17px",
                  color: "blue",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  navigate("/createResearchSubject");
                }}
              >
                Create New Research +{" "}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /page content --> */}

      {/* <Footer /> */}
      {/* </div> */}
    </Suspense>
  );
};

export default OrgResearchs;
