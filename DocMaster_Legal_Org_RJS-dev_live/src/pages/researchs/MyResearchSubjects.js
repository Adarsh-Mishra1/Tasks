import { useEffect, useState, Suspense, lazy } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetResearchSubjectsByUser } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const MyResearchSubjects = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);

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
      getMyResearchSubjectsPreset();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getMyResearchSubjectsPreset = () => {
    axios
      .get(
        WsGetResearchSubjectsByUser + "/" + userData.org.id + "/" + userData.id,
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
          if (!responseData.resultMessage === "Error, No data found") {
            alert(responseData.resultMessage);
          }
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
          {/* <i
            className="fa fa-eye mx-2"
            title="View"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => viewSubject(simpleData)}
          /> */}
          {simpleData.approvedLevel >= 0 &&
          userData.crudAccess?.research?.r == 1 ? (
            <i
              className="fa fa-arrows mx-2"
              title="Proceed for Research"
              style={{ color: "green", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => proceed2Continue(simpleData)}
            />
          ) : (
            <>
              {simpleData.needAprvl == 0
                ? "Initial Approval Needed to Continue"
                : "Can Continue after Approval"}
            </>
          )}
        </>
      );
    });
    return simpleDataArray;
  };

  const proceed2Continue = (researchSubject) => {
    console.log("researchSubject", researchSubject);
    delete researchSubject["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/myResearchSubject", {
      state: {
        subject: researchSubject,
      },
    });
  };
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <Sidebar />
        <Navbar /> */}

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        {/* <div className="right_col" role="main"> */}
        <div className="page-title mb-2">
          {/* <div className="title_left mb-3">
            <h3 className="mt-0">Research Subject(s)</h3>
          </div> */}
        </div>

        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              {/* <div className="x_title">
                <h2> */}
              {/* DocMaster::My Research(s){" "} */}
              {/* {userData.crudAccess?.research?.c == 1 ? (
                      <a href="/createResearchSubject">
                        <i
                          className="fa fa-plus mx-2"
                          title="Create"
                          style={{ color: "grey", cursor: "pointer" }}
                          aria-hidden="true"
                        />
                      </a>
                    ) : null} */}
              {/* </h2> */}
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
              {/* <div className="clearfix"></div>
              </div> */}
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
        {/* </div> */}
        {/* <!-- /page content --> */}

        {/* <Footer /> */}
      </div>
    </Suspense>
  );
};

export default MyResearchSubjects;
