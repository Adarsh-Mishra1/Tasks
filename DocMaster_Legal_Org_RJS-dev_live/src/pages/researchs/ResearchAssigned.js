//ResearchAssigned.js
import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { WsGetResearchSubjectByUser } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

import ResearchSubjectQuestionAnswer from "../../components/researchs/ResearchSubjectQuestionAnswer";
import ResearchSubjectQuestionAnswerL2 from "../../components/researchs/ResearchSubjectQuestionAnswerL2";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ResearchAssigned = () => {
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
  const location = useLocation();
  console.log("OrgResearch_location_", location);
  const navigate = useNavigate();

  const [researchSubject, setResearchSubject] = useState(
    location.state.subject,
  );
  const [changeCount, setChangeCount] = useState(0);
  const [submitStatus, setSubmitStatus] = useState();
  //   const [approvedBy, setApprovedBy] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getResearchSubjectByUser();
    } else {
    }
  }, []);

  const getResearchSubjectByUser = () => {
    axios
      .get(
        WsGetResearchSubjectByUser +
          "/" +
          researchSubject.createdBy.id +
          "/" +
          researchSubject.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_assnetd_", responseData);
        if (responseData.resultCode == 1) {
          if (responseData.submitStatus != null) {
            setSubmitStatus(responseData.submitStatus);
          }
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

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div
          className="right_col"
          role="main"
          style={{ overflowY: "auto", overflowX: "none", height: "100%",overflowX:'hidden' }}
        >
          <div className="page-title">
            <div className="title_left">{/* <h3>Assigned Research</h3> */}</div>

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
                  <h6>
                    <span
                      onClick={() => {
                        navigate(-1);
                      }}
                      style={{ cursor: "pointer",color:'blue' }}
                    >
                      Go Back ⬅️
                    </span>
                    &nbsp; Assigned Research
                  </h6>
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
                  {researchSubject != undefined ? (
                    <>
                      <h6>{researchSubject.subject}</h6>
                      ApprovedLevel:{researchSubject.approvedLevel}
                      {researchSubject.approvedLevel < 0 ? <></> : null}
                      <br />
                      Submit/Approval Status:
                      {submitStatus?.submitStatus == undefined
                        ? "Not Submitted"
                        : null}
                      {submitStatus?.submitStatus == -1 ? "Rejected" : null}
                      {submitStatus?.submitStatus == 0 ? (
                        <>A Request for Approval at this stage is Submitted</>
                      ) : null}
                      {submitStatus?.submitStatus == 1 ? "Approved" : null}
                      <br />
                      {submitStatus?.approvedBy != undefined &&
                      submitStatus?.approvedBy != null ? (
                        <>
                          Approved/Rejected By: {submitStatus.approvedBy.name}
                        </>
                      ) : null}
                      <br />
                      <p>{researchSubject.details}</p>
                      <hr />
                      {researchSubject.approvedLevel < 2 ? (
                        <ResearchSubjectQuestionAnswer
                          researchSubject={researchSubject}
                          user={userData}
                          changeCount={changeCount}
                          submitStatus={submitStatus?.submitStatus}
                          isByResearcher={true}
                          isAssigned2user={true}
                        />
                      ) : null}
                      {researchSubject.approvedLevel == 2 ? (
                        <ResearchSubjectQuestionAnswerL2
                          researchSubject={researchSubject}
                          user={userData}
                          changeCount={changeCount}
                          submitStatus={submitStatus?.submitStatus}
                          isByResearcher={true}
                          isAssigned2user={true}
                        />
                      ) : null}
                    </>
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

export default ResearchAssigned;
