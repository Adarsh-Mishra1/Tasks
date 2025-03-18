//ResearchSubjectSubQuestionAnswerView
import { useEffect, useState } from "react";
import axios from "axios";
import {
  WsGetUserSubjectSubQuestionAndAnswer,
  WsGetUserAssignedSubjectQuestionAndAnswer,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import ResearchSubjectQuestionAnswerView from "./ResearchSubjectQuestionAnswerView";

const ResearchSubjectSubQuestionAnswerView = (props) => {
  const [queAndAns, setQueAndAns] = useState();

  useEffect(() => {
    getUserSubjectSubQuestionAndAnswer();
  }, []);

  const processCheckBox = (e) => {
    console.log("processCheckBox_e", e);
    console.log(
      "processCheckBox_e",
      e.target.checked,
      props.qAndA.question.id,
      props.qAndA?.answer?.conclusion,
    );
    props.checkBoxClick(
      e.target.checked,
      props.qAndA.question.id,
      props.qAndA?.answer?.conclusion,
    );
  };

  const getUserSubjectSubQuestionAndAnswer = () => {
    ///getUserSubjectSubQuestionAndAnswer" //get /{subjectId}/{userId}/{level}/{parentQuestionId}

    console.log("responseData_sub_parentQuestion", props.parentQuestion.id);
    console.log(
      "responseData_sub_call",
      (props.isAssigned2user == true
        ? WsGetUserAssignedSubjectQuestionAndAnswer
        : WsGetUserSubjectSubQuestionAndAnswer) +
        "/" +
        props.researchSubject.id +
        "/" +
        props.user.id +
        "/" +
        (props.researchSubject.approvedLevel + 1) +
        "/" +
        props.parentQuestion.id,
    );
    axios
      .get(
        (props.isAssigned2user == true
          ? WsGetUserAssignedSubjectQuestionAndAnswer
          : WsGetUserSubjectSubQuestionAndAnswer) +
          "/" +
          props.researchSubject.id +
          "/" +
          props.user.id +
          "/" +
          (props.researchSubject.approvedLevel + 1) +
          "/" +
          props.parentQuestion.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_sub_queAndAns", responseData);
        if (responseData.resultCode == 1) {
          // if (props.researchSubject.approvedLevel >= 2) {
          //   // setConclusion(responseData.resultMessage);
          // } else {
          //   setQueAndAns(responseData.resultMessage);
          // }
          setQueAndAns(responseData.resultMessage);
        } else {
          //alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  if (queAndAns != undefined && queAndAns.length > 0) {
    return (
      <div
        className="mt-4 ml-4"
        key={`qAndASubQuestion` + props.parentQuestion.id + `_`}
      >
        <hr />
        {queAndAns != undefined && queAndAns.length > 0
          ? queAndAns.map((qAndA, index) => {
              return (
                <div
                  className="mt-4"
                  key={`qAndASubQ_` + qAndA.question.id + `_` + index}
                >
                  <ResearchSubjectQuestionAnswerView
                    qAndA={qAndA}
                    qNo={index + 1}
                    user={props.user}
                    submitStatus={props?.submitStatus}
                    approvedLevel={props.researchSubject.approvedLevel}
                    isByResearcher={props.isByResearcher}
                    isAssigned2user={props.isAssigned2user}
                    checkBoxClick={props.checkBoxClick}
                  />
                </div>
              );
            })
          : null}
      </div>
    );
  } else {
    return null;
  }
};

export default ResearchSubjectSubQuestionAnswerView;
