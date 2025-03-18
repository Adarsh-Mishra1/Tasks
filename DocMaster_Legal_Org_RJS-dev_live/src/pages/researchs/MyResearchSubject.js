import React, { useEffect, useState, Suspense, lazy } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  GetCaseIdByResearchSubjectId,
  WsGetResearchSubjectByUser,
  WsSubmitResearchSubjectForApproval,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import ResearchSubjectQuestionAnswer from "../../components/researchs/ResearchSubjectQuestionAnswer";
import ResearchSubjectQuestionAnswerL2 from "../../components/researchs/ResearchSubjectQuestionAnswerL2";

import ResearchSubjectPutConsolidation from "../../components/researchs/ResearchSubjectPutConsolidation";
import ShowPrintFinalDraft from "../../components/researchs/ShowPrintFinalDraft";
import ApproverRemarks from "../../components/researchs/ApproverRemarks";
import userStore from "../../zustand/userStore";
import { useDispatch, useSelector } from "react-redux";
import { fetchStickyNotesByResearchSubjectId } from "../../components/stickyNotes/stickyNotesApi";
import { toast } from "react-toastify";
import { changeCreateNoteWindow } from "../../components/stickyNotes/StickyNotesSlice";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const MyResearchSubject = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = userStore((state) => state.user);
  const { notes } = useSelector((store) => store.stickyNotes);
  const location = useLocation();
  const [researchSubject, setResearchSubject] = useState(
    location?.state?.subject
  );

  const clientCase = location?.state?.clientCase;

  const [changeCount, setChangeCount] = useState(0);
  const [submitStatus, setSubmitStatus] = useState();
  const [approvedBy, setApprovedBy] = useState();

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

  useEffect(
    function () {
      // dispatch(fetchStickyNotesByResearchSubjectId(researchSubject.id));
      if (researchSubject.id) getNotes();
    },
    [researchSubject.id]
  );

  const getCaseId = async () => {
    const response = await fetch(
      GetCaseIdByResearchSubjectId + "/" + researchSubject.id,
      {
        method: "GET",
        headers: apiKeyHeader(),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.case_id;
    } else {
      alert(`Error Getting Case Details: Please Contact Team.`);
      return null;
    }
  };

  const getNotes = (caseId) => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    dispatch(fetchStickyNotesByResearchSubjectId(researchSubject.id));
    if (loaderId) {
      toast.update(loaderId, {
        render: "Loaded!",
        autoClose: 0,
      });
    }
  };

  const getResearchSubjectByUser = () => {
    axios
      .get(
        WsGetResearchSubjectByUser +
          "/" +
          userData.id +
          "/" +
          researchSubject.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_my_", responseData);
        if (responseData.resultCode == 1) {
          // setResearchSubject(responseData.resultMessage);
          if (responseData.submitStatus != null) {
            setSubmitStatus(responseData.submitStatus.submitStatus);
            setApprovedBy(responseData.submitStatus.approvedBy);
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

  const submitResearchSubjectForApproval = () => {
    if (
      window.confirm(
        "Are you sure you want to Submit Your Research no furthur changes will be allow at this level after submission"
      ) === true
    ) {
      proceed2submitResearchSubjectForApproval();
    }
  };

  const proceed2submitResearchSubjectForApproval = () => {
    /*Long subjectId;
    int level;
    Long userId;*/
    // console.log(
    //   "params",
    //   JSON.stringify({
    //     subjectId: researchSubject.id,
    //     level: researchSubject.approvedLevel + 1,
    //     userId: userData.id,
    //   }),
    // );

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
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (researchSubject.needAprvl == 0) {
            // window.location.href = "/myResearchSubjects";//Old
            reloadResearchSubject2NextLevel();
          } else {
            // setSubmitStatus(0);//Old
            window.location.href = "/myResearchSubjects";
            //{researchSubject.needAprvl == 0
          }
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const reloadResearchSubject2NextLevel = () => {
    researchSubject["approvedLevel"] = researchSubject.approvedLevel + 1;
    navigate("/myResearchSubject", {
      state: {
        subject: researchSubject,
      },
    });
    window.location.reload();
  };

  const goToViewClientCase = () => {
    navigate("/clientCaseShow", {
      state: {
        clientCase: clientCase,
      },
    });
  };

  const handleCreateNewNote = async (e) => {
    e.preventDefault();
    const caseId = await getCaseId();
    if (caseId !== null) {
      dispatch(
        changeCreateNoteWindow({
          noteWindow: true,
          clientCase: {
            id: caseId,
            type: "research",
            researchSubjectId: researchSubject.id,
          },
        })
      );
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        <div className="right_col" role="main">
          <div
            className="tab-content"
            style={{ border: "0", paddingLeft: "0", paddingRight: "0" }}
          >
            <div className="clearfix"></div>

            <div className="row">
              <div className="col-md-12 col-sm-12  ">
                <div className="x_panel">
                  <div className="x_content">
                    <button
                      style={{
                        backgroundColor: "blue",
                        borderRadius: "5px",
                        color: "white",
                        marginTop: "5px",
                        border: "none",
                        padding: "10px 20px",
                        float: "right",
                      }}
                      onClick={handleCreateNewNote}
                    >
                      <b>Create Note</b>
                    </button>
                    {researchSubject != undefined ? (
                      <>
                        <h6 style={{ textAlign: "start" }}>
                          <span
                            onClick={() => {
                              navigate(-1);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            Go Back ⬅️
                          </span>
                          &nbsp; Research Topic: {researchSubject.subject}
                        </h6>
                        <h6 style={{ textAlign: "start" }}>
                          Stage:{researchSubject.approvedLevel}
                        </h6>
                        {clientCase != undefined && clientCase != null ? (
                          <h6>
                            This research is created for case '
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => goToViewClientCase()}
                            >
                              {clientCase.title}
                            </span>
                            '{" "}
                          </h6>
                        ) : null}
                        {submitStatus == -1 ? (
                          <h5
                            style={{
                              textAlign: "center",
                              backgroundColor: "orange",
                            }}
                          >
                            Subject Aproval Rejected please make changes and
                            resubmit again
                          </h5>
                        ) : null}
                        {submitStatus == 0 ? (
                          <h5
                            style={{
                              textAlign: "center",
                              backgroundColor: "orange",
                            }}
                          >
                            Subject is Submitted can't do changes now
                          </h5>
                        ) : null}
                        {submitStatus == 1 ? "Approved" : null}
                        <br />
                        <h6>{researchSubject.details}</h6>
                        {/* Type:{researchSubject?.researchType?.type}<br/> */}
                        {/* Submit/Approval Status: */}
                        {approvedBy != undefined && approvedBy != null ? (
                          <>Approved/Rejected By: {approvedBy.name}</>
                        ) : null}
                        {/* <hr /> */}
                        <ApproverRemarks
                          researchSubject={researchSubject}
                          user={userData}
                          userType="rschr"
                        />

                        {researchSubject.approvedLevel < 2 ? (
                          <ResearchSubjectQuestionAnswer
                            researchSubject={researchSubject}
                            user={userData}
                            changeCount={changeCount}
                            submitStatus={submitStatus}
                            isByResearcher={true}
                            isAssigned2user={false}
                          />
                        ) : null}
                        {researchSubject.approvedLevel == 2 ? (
                          <ResearchSubjectQuestionAnswerL2
                            researchSubject={researchSubject}
                            user={userData}
                            changeCount={changeCount}
                            submitStatus={submitStatus}
                            isByResearcher={true}
                            isAssigned2user={false}
                          />
                        ) : null}
                        {researchSubject.approvedLevel == 3 ||
                        researchSubject.approvedLevel == 4 ? (
                          <ResearchSubjectPutConsolidation
                            researchSubject={researchSubject}
                            user={userData}
                            submitStatus={submitStatus}
                            isByResearcher={true}
                            approvedLevel={researchSubject.approvedLevel}
                            isAssigned2user={false}
                          />
                        ) : null}
                        <hr />

                        {researchSubject.approvedLevel >= 5 ? (
                          <ShowPrintFinalDraft
                            researchSubject={researchSubject}
                            submitStatus={submitStatus}
                            user={userData}
                            isByResearcher={true}
                          />
                        ) : null}

                        {(submitStatus != undefined && submitStatus >= 0) ||
                        researchSubject.approvedLevel >= 5 ? null : (
                          <button
                            className="btn btn-primary"
                            onClick={() => submitResearchSubjectForApproval()}
                            title="Submit"
                          >
                            {/* {researchSubject.needAprvl == 0
                            ? "Submit"
                            : "Submit Research for Approval"} */}
                            Submit
                          </button>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        {/* <!-- /page content --> */}
      </div>
    </Suspense>
  );
};

export default MyResearchSubject;
