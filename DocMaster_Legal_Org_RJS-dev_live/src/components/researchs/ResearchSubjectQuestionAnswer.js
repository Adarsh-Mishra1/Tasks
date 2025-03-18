import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

import {
  WsGetUserSubjectQuestionAndAnswer,
  WsDeleteResearchQuestionAnswer,
  WsGetUserAssignedSubjectQuestionAndAnswer,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import ResearchSubjectQuestionAnswerInput from "./ResearchSubjectQuestionAnswerInput";
import ResearchSubjectPutQuestion from "./ResearchSubjectPutQuestion";
import ResearchSubjectPutConclusion from "./ResearchSubjectPutConclusion";
import ResearchSubjectSubQuestionAnswer from "./ResearchSubjectSubQuestionAnswer";
import AssignQuestion2User from "./AssignQuestion2User";
// import DocForm2FinalDraftMerge from "./DocForm2FinalDraftMerge";
import ResearchPresetDocForm from "./ResearchPresetDocForm";

const ResearchSubjectQuestionAnswer = (props) => {
  console.log("props__", props);

  const [queAndAns, setQueAndAns] = useState();
  const [conclusion, setConclusion] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [conclusionModalIsOpen, setConclusionModalIsOpen] = useState(false);
  const [selectedQue, setSelectedQue] = useState();
  const [parentQuestion, setParentQuestion] = useState();
  const [changeCount, setChangeCount] = useState(0);

  const [questionForUserAssign, setQuestionForUserAssign] = useState();
  const [questionAssignModalIsOpen, setQuestionAssignModalIsOpen] =
    useState(false);

  const [showDocForm2FinalDraftMerge, setShowDocForm2FinalDraftMerge] =
    useState(false);

  useEffect(() => {
    console.log("researchSubject_30: ", props.researchSubject);
    // if (props.researchSubject.isOwn && props.researchSubject.isOwn === 0) {
    getUserSubjectQuestionAndAnswer();
    // }
  }, []);

  const getUserSubjectQuestionAndAnswer = () => {
    setQueAndAns();
    // {subjectId}/{userId}/{level}/{parentQuestionId
    // console.log("url_",(props.isAssigned2user==true?WsGetUserAssignedSubjectQuestionAndAnswer:WsGetUserSubjectQuestionAndAnswer) +
    // "/" +
    // props.researchSubject.id +
    // "/" +
    // props.user.id +
    // "/" +
    // (props.researchSubject.approvedLevel + 1))
    axios
      .get(
        (props.isAssigned2user == true
          ? WsGetUserAssignedSubjectQuestionAndAnswer
          : WsGetUserSubjectQuestionAndAnswer) +
          "/" +
          props.researchSubject.id +
          "/" +
          props.user.id +
          "/" +
          (props.researchSubject.approvedLevel + 1),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_queAndAns", responseData);
        if (responseData.resultCode == 1) {
          if (props.researchSubject.approvedLevel >= 2) {
            setConclusion(responseData.resultMessage);
          } else {
            setQueAndAns(responseData.resultMessage);
          }
          // setChangeCount(changeCount+1);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onPutQuestionReturn = (closeStatus, status) => {
    console.log("_onReturn");
    if (closeStatus) {
      setModalIsOpen(false);
    }
    if (status) {
      // setChangeCount(changeCount+1);
      // getResearchSubjectByUser();
      getUserSubjectQuestionAndAnswer();
      //   window.location.reload();
    }
    setSelectedQue();
    setParentQuestion();
  };

  const onPutConclusionReturn = (closeStatus, status) => {
    if (closeStatus) {
      setModalIsOpen(false);
    }
    if (status) {
      getUserSubjectQuestionAndAnswer();
    }
    setSelectedQue();
  };

  const editThisQueAlert = (qAndA) => {
    if (
      window.confirm(
        "Are you sure you want to Edit this question '" +
          qAndA.question.question +
          "'"
      ) === true
    ) {
      setSelectedQue(qAndA.question);
      setModalIsOpen(true);
    } else {
    }
  };

  const deleteThisQueAlert = (qAndA) => {
    if (
      window.confirm(
        "Are you sure you want to Delete this question '" +
          qAndA.question.question +
          "'"
      ) === true
    ) {
      proceed2deleteThisQue(qAndA);
    } else {
    }
  };

  const proceed2deleteThisQue = (qAndA) => {
    axios
      .post(
        WsDeleteResearchQuestionAnswer,
        JSON.stringify({
          questionId: qAndA.question.id,
          userId: props.user.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          getUserSubjectQuestionAndAnswer();
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onAddSubQuestionAlert = (qAndA) => {
    if (
      window.confirm(
        "Are you sure you want to Add Sub Question to this question '" +
          qAndA.question.question +
          "'"
      ) === true
    ) {
      // proceed2deleteThisQue(qAndA);
      setParentQuestion(qAndA.question);
      setModalIsOpen(true);
    } else {
    }
  };
  const onAssignQuestion2UserAlert = (qAndA) => {
    if (
      window.confirm(
        "Are you sure you want to Assign a User to this question '" +
          qAndA.question.question +
          "'"
      ) === true
    ) {
      // proceed2deleteThisQue(qAndA);
      // setModalIsOpen(true);
      setQuestionForUserAssign(qAndA.question);
      setQuestionAssignModalIsOpen(true);
    } else {
    }
  };

  const getSubQuestions = (qAndA) => {
    console.log("getSubQuestions_", qAndA);
  };

  const onSuccesAssigned2User = (flag) => {
    if (flag) {
      window.location.reload();
    }
  };

  const onDocFormDraftMergeContentReturn = (finalContent) => {
    console.log("onDocFormDraftMergeContentReturn_finalContent", finalContent);
    setShowDocForm2FinalDraftMerge(false);
    // setFinalDraftContent(finalContent);
    // setSaveButtonColor("red");
    window.location.reload();
  };

  return (
    <>
      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={modalIsOpen}
        style={{
          overlay: {
            width: "100vw",
            top: "0%",
            zIndex: 9999,
          },
          content: {
            left: "5%",
            width: "90vw",
          },
        }}
      >
        <ResearchSubjectPutQuestion
          subject={props.researchSubject}
          user={props.user}
          onReturn={onPutQuestionReturn}
          question={selectedQue}
          approvedLevel={props.researchSubject.approvedLevel}
          parentQuestion={parentQuestion}
          isAssigned2user={props.isAssigned2user}
        />
        <button
          className="btn btn-danger"
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={() => {
            setModalIsOpen(false);
            setSelectedQue();
          }}
        >
          Close
        </button>
      </Modal>

      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={questionAssignModalIsOpen}
        style={{
          overlay: {
            width: "100vw",
            top: "0%",
            zIndex: 9999,
          },
          content: {
            left: "5%",
            width: "90vw",
          },
        }}
      >
        <AssignQuestion2User
          subject={props.researchSubject}
          question={questionForUserAssign}
          user={props.user}
          onSuccesReturn={onSuccesAssigned2User}
          type={1}
        />
        <button
          className="btn btn-danger"
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={() => {
            setQuestionAssignModalIsOpen(false);
            setQuestionForUserAssign();
          }}
        >
          Close
        </button>
      </Modal>

      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={showDocForm2FinalDraftMerge}
        style={{
          overlay: {
            width: "100vw",
            top: "0%",
            zIndex: 9999,
          },
          content: {
            left: "4%",
            width: "90vw",
          },
        }}
      >
        <button
          className="btn btn-danger"
          style={{ position: "absolute", top: 5, right: 5 }}
          onClick={() => {
            setShowDocForm2FinalDraftMerge(false);
            // setSelectedQue();
          }}
        >
          Close
        </button>
        <br />
        <div>
          {/* <DocForm2FinalDraftMerge
            toMerge={0}
            researchSubject={props.researchSubject}
            user={props.user}
            onContentReturn={onDocFormDraftMergeContentReturn}
            finalDraftContent={""}
          /> */}
          <ResearchPresetDocForm
            toMerge={0}
            researchSubject={props.researchSubject}
            user={props.user}
            onContentReturn={onDocFormDraftMergeContentReturn}
            finalDraftContent={""}
            toShow={!props.isByResearcher}
            isAssigned2user={props.isAssigned2user}
          />
        </div>
      </Modal>
      <ResearchPresetDocForm
        toMerge={0}
        isModal={false}
        researchSubject={props.researchSubject}
        user={props.user}
        onContentReturn={onDocFormDraftMergeContentReturn}
        finalDraftContent={""}
        toShow={!props.isByResearcher}
        isAssigned2user={props.isAssigned2user}
      />
      {/* </>
      ) : null} */}

      {/* <div className="row">
        <div className="col-6"></div>
        <div className="col-6"></div>
      </div> */}
      <h4>
        {/* {props.researchSubject.approvedLevel >= 2 ? (
          <>Conclusion</>
        ) : (
          <>
            Question & Answer
             of Level {props.researchSubject.approvedLevel + 1}
          </>
        )} */}
        {props?.submitStatus != undefined && props?.submitStatus >= 0 ? null : (
          <>
            {props.researchSubject.approvedLevel >= 0 &&
            props.researchSubject.approvedLevel < 1 &&
            props.isByResearcher == true &&
            props.isAssigned2user == false ? (
              <h6 onClick={() => setModalIsOpen(true)} style={{cursor:'pointer'}}>Add new Question&nbsp;
              <i
                className="fa fa-plus"
                title="Create Question"
                style={{ color: "#1c46f2", cursor: "pointer" }}
                aria-hidden="true"
                
              >
              </i>
              </h6>
            ) : null}
          </>
        )}
      </h4>

      {/* <p>*Before making any changes save the work done</p> */}
      {/* {props.isByResearcher?<div style={{backgroundColor:"orange"}}>{props?.submitStatus != undefined && props?.submitStatus >= 0 ? (
        <p>Subject is Submitted can't do changes now</p>
      ) : null}  
      {props?.submitStatus == -1 ? (
        <p>Subject Aproval Rejected please make changes and resubmit again</p>
      ) : null}</div>:null} */}

      {props.researchSubject.approvedLevel >= 2 ? (
        <>
          <ResearchSubjectPutConclusion
            subject={props.researchSubject}
            user={props.user}
            conclusion={conclusion}
            submitStatus={props?.submitStatus}
          />
        </>
      ) : (
        <>
          {queAndAns != undefined && queAndAns.length > 0
            ? queAndAns.map((qAndA, index) => {
                return (
                  <div
                    // className="mt-2"
                    key={`qAndA` + qAndA.question.id + `_` + index + `_`}
                  >
                    {/* <hr /> */}
                    <ResearchSubjectQuestionAnswerInput
                      qAndA={qAndA}
                      qNo={index + 1}
                      user={props.user}
                      submitStatus={props?.submitStatus}
                      approvedLevel={props.researchSubject.approvedLevel}
                      onEditThisQueAlert={editThisQueAlert}
                      onDeleteThisQueAlert={deleteThisQueAlert}
                      onAddSubQuestionButtonClick={onAddSubQuestionAlert}
                      onAssignQuestion2UserButtonClick={
                        onAssignQuestion2UserAlert
                      }
                      isByResearcher={props.isByResearcher}
                      isAssigned2user={props.isAssigned2user}
                    />
                    {qAndA.question.parentQuestion == null ? (
                      <ResearchSubjectSubQuestionAnswer
                        parentQuestion={qAndA.question}
                        submitStatus={props?.submitStatus}
                        researchSubject={props.researchSubject}
                        user={props.user}
                        approvedLevel={props.researchSubject.approvedLevel}
                        onEditThisQueAlert={editThisQueAlert}
                        onDeleteThisQueAlert={deleteThisQueAlert}
                        onAssignQuestion2UserButtonClick={
                          onAssignQuestion2UserAlert
                        }
                        isByResearcher={props.isByResearcher}
                        isAssigned2user={props.isAssigned2user}
                        baseNumber={index + 1}
                      />
                    ) : null}
                  </div>
                );
              })
            : null}
        </>
      )}
    </>
  );
};

export default ResearchSubjectQuestionAnswer;
