import { useEffect, useState, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  WsGetResearchSubjectsPreset,
  WsCopyResearchSubjectPresetForUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ResearchSubjects = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Subject",
      accessor: "subject",
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
      getResearchSubjectsPreset();
    } else {
      if (userData.isLoggedIn) {
        window.location.href = "/";
      }
    }
  }, []);

  const getResearchSubjectsPreset = () => {
    axios
      .get(WsGetResearchSubjectsPreset + "/" + userData.id, {
        headers: apiKeyHeader(),
      })
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
      simpleData["actiontd"] = (
        <>
          <i
            className="fa fa-eye mx-2"
            title="View"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => viewSubject(simpleData)}
          />
          <i
            className="fa fa-arrows mx-2"
            title="Proceed for Research"
            style={{ color: "green", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => proceedAlert(simpleData)}
          />
        </>
      );
    });
    return simpleDataArray;
  };

  const viewSubject = (presetSubject) => {
    delete presetSubject["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/presetSubjectView", {
      state: {
        subject: presetSubject,
      },
    });
  };

  const proceedAlert = (subject) => {
    if (
      window.confirm(
        "Are you sure you want to Select " + subject.subject + " for Research?",
      ) === true
    ) {
      proceed2CopySubjectForUser(subject);
    } else {
    }
    return false;
  };

  const proceed2CopySubjectForUser = (subject) => {
    axios
      .post(
        WsCopyResearchSubjectPresetForUser,
        JSON.stringify({
          id: subject.id,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          goToPage();
        } else {
          alert(responseData.resultMessage);
          // ssetErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  function goToPage() {
    navigate("/myResearchSubject");
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>
                Research Subject(s){" "}
                <a href="/createResearchSubject">
                  <i
                    className="fa fa-plus mx-2"
                    title="Create"
                    style={{ color: "grey", cursor: "pointer" }}
                    aria-hidden="true"
                  />
                </a>
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
                <div className="x_title">
                  <h2>Research Subject(s)</h2>
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
                  {tableData && tableData.length > 0 ? (
                     
                      <AllFeatureDataTable
                        columns={tableColumns}
                        data={tableData}
                      />
                     
                  ) : null}
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

export default ResearchSubjects;
