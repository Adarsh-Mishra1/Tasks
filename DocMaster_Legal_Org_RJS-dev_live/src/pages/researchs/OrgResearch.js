//OrgResearch.js
import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  WsPutResearchSubjectApproval,
  WsGetResearchSubjectByUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

import ResearchSubjectQuestionAnswer from "../../components/researchs/ResearchSubjectQuestionAnswer";
import ResearchSubjectQuestionAnswerL2 from "../../components/researchs/ResearchSubjectQuestionAnswerL2";
import ResearchSubjectPutConsolidation from "../../components/researchs/ResearchSubjectPutConsolidation";
import ShowPrintFinalDraft from "../../components/researchs/ShowPrintFinalDraft";

import ApproverRemarks from "../../components/researchs/ApproverRemarks";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const OrgResearch = () => {
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
        console.log("responseData", responseData);
        if (responseData.resultCode == 1) {
          if (responseData.submitStatus != null) {
            setSubmitStatus(responseData.submitStatus);
            // setApprovedBy(responseData.submitStatus.approvedBy);
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

  const approveThisResearch = (requestId, value) => {
    console.log("requestId", requestId);
    if (
      window.confirm(
        "Are you sure you want to " +
          (value == -1 ? "Reject" : "Approve") +
          " this Research Subject",
      ) === true
    ) {
      proceed2ApproveThisResearch(requestId, value);
    }
  };

  const proceed2ApproveThisResearch = (requestId, value) => {
    /*int id;
    Long subjectId;
    int level;
    int value;
    Long userId;*/
    console.log(
      "params",
      JSON.stringify({
        id: requestId != null && requestId != undefined ? requestId : null,
        subjectId: researchSubject.id,
        level: researchSubject.approvedLevel,
        value: value,
        userId: userData.id,
      }),
    );

    axios
      .post(
        WsPutResearchSubjectApproval,
        JSON.stringify({
          id: requestId != null && requestId != undefined ? requestId : null,
          subjectId: researchSubject.id,
          level: researchSubject.approvedLevel,
          value: value,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (researchSubject.approvedLevel == -1) {
          } else {
          }
          let tempResearchSubject = researchSubject;
          tempResearchSubject["approvedLevel"] =
            researchSubject.approvedLevel + 1;
          setResearchSubject(tempResearchSubject);
        } else {
          alert(responseData.resultMessage);
        }
        goToListPage();
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const goToListPage = () => {
    navigate("/orgResearchs");
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="clearfix"></div>
          <div className="tab-content" style={{border:"0",paddingLeft:"0", paddingRight:"0"}}>
          <div className="row ms-0 me-0">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_content">
                  {researchSubject != undefined ? (
                    <>
                    
                      <h6 >
                      <span
                        onClick={() => {
                          navigate(-1);
                        }}
                        style={{   cursor: "pointer" }}
                      >
                        Go Back ⬅️
                      </span>&nbsp;| {researchSubject.subject}
                      </h6>
                      <p>{researchSubject.details}</p>
                      <ApproverRemarks
                        researchSubject={researchSubject}
                        user={userData}
                        userType="aprvr"
                      />
                      <div className="row ms-0 me-0">
                        <div className="col-6">
                          {researchSubject.approvedLevel < 0 ? (
                            <>
                              <button
                                className="btn"
                                style={{ border: "1px solid green" }}
                                onClick={() => approveThisResearch(null, 1)}
                              >
                                <i
                                  className="fa fa-thumbs-up"
                                  title="Approve This Research"
                                  aria-hidden="true"
                                  style={{ color: "green", cursor: "pointer" }}
                                >
                                  Approve This Research
                                </i>
                              </button>
                            </>
                          ) : null}
                          {/* Submit/Approval Status:
                {submitStatus?.submitStatus == undefined ? "Not Submitted" : null}
                 */}
                          {submitStatus?.submitStatus == -1 ? (
                            <h4 style={{ color: "red" }}>Rejected</h4>
                          ) : null}
                          {submitStatus?.submitStatus == 0 ? (
                            <h4>
                              <span style={{ color: "blue" }}>Submitted</span>{" "}
                              &nbsp;
                              <button
                                className="btn btn-outline-success"
                                style={{ border: "1px solid green" }}
                                onClick={() =>
                                  approveThisResearch(submitStatus?.id, 1)
                                }
                              >
                                <i
                                  className="fa fa-thumbs-up ml-2 mr-2"
                                  title="Approve This Research"
                                  aria-hidden="true"
                                  style={{ color: "green", cursor: "pointer" }}
                                >
                                  Approve
                                </i>
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-outline-danger "
                                style={{ border: "1px solid red" }}
                                onClick={() =>
                                  approveThisResearch(submitStatus?.id, -1)
                                }
                              >
                                <i
                                  className="fa fa-thumbs-down ml-2"
                                  title="Reject This Research"
                                  aria-hidden="true"
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  Reject
                                </i>
                              </button>
                            </h4>
                          ) : null}
                          {submitStatus?.submitStatus == 1 ? (
                            <h4 style={{ color: "green" }}>Approved</h4>
                          ) : null}

                          {submitStatus?.approvedBy != undefined &&
                          submitStatus?.approvedBy != null ? (
                            <>
                              Approved/Rejected By:{" "}
                              {submitStatus.approvedBy.name}
                            </>
                          ) : null}
                        </div>
                        {researchSubject.approvedLevel >= 0 ? (
                          <div className="col-6">
                            <u>Stage</u>:<b>{researchSubject.approvedLevel}</b>
                          </div>
                        ) : null}
                      </div>

                      {researchSubject.approvedLevel < 2 ? (
                        <ResearchSubjectQuestionAnswer
                          researchSubject={researchSubject}
                          user={userData}
                          changeCount={changeCount}
                          submitStatus={submitStatus?.submitStatus}
                          isByResearcher={false}
                          isAssigned2user={false}
                        />
                      ) : null}
                      {researchSubject.approvedLevel == 2 ? (
                        <ResearchSubjectQuestionAnswerL2
                          researchSubject={researchSubject}
                          user={userData}
                          changeCount={changeCount}
                          submitStatus={submitStatus?.submitStatus}
                          isByResearcher={false}
                          isAssigned2user={false}
                        />
                      ) : null}
                      {researchSubject.approvedLevel == 3 ||
                      researchSubject.approvedLevel == 4 ? (
                        <ResearchSubjectPutConsolidation
                          researchSubject={researchSubject}
                          user={userData}
                          submitStatus={submitStatus}
                          isByResearcher={false}
                          approvedLevel={researchSubject.approvedLevel}
                        />
                      ) : null}

                      {researchSubject.approvedLevel >= 5 ? (
                        <ShowPrintFinalDraft
                          researchSubject={researchSubject}
                          submitStatus={submitStatus}
                          user={userData}
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
        
        <Footer /></div>
      </div>
    </Suspense>
  );
};

export default OrgResearch;
