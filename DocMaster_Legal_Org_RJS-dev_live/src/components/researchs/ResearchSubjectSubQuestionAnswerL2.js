//ResearchSubjectSubQuestionAnswerL2
import { useEffect, useState } from "react";
import axios from "axios";
import {
  WsGetUserSubjectSubQuestionAndAnswer,
  WsDeleteResearchQuestionAnswer,
  WsGetUserAssignedSubjectQuestionAndAnswer,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import ResearchSubjectQuestionAnswerInputL2 from "./ResearchSubjectQuestionAnswerInputL2";

const ResearchSubjectSubQuestionAnswerL2 = (props) => {
  const [queAndAns, setQueAndAns] = useState();

  useEffect(() => {
    getUserSubjectSubQuestionAndAnswer();
  }, []);

  const getUserSubjectSubQuestionAndAnswer = () => {
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
        console.log("responseData_sub_queAndAns_conc", responseData);
        if (responseData.resultCode == 1) {
          if (props.researchSubject.approvedLevel >= 3) {
            // setConclusion(responseData.resultMessage);
          } else {
            setQueAndAns(responseData.resultMessage);
          }
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
                  <ResearchSubjectQuestionAnswerInputL2
                    qAndA={qAndA}
                    qNo={index + 1}
                    user={props.user}
                    submitStatus={props?.submitStatus}
                    approvedLevel={props.researchSubject.approvedLevel}
                    onEditThisQueAlert={props.onEditThisQueAlert}
                    onDeleteThisQueAlert={props.onDeleteThisQueAlert}
                    onAssignQuestion2UserButtonClick={
                      props.onAssignQuestion2UserButtonClick
                    }
                    isByResearcher={props.isByResearcher}
                    isAssigned2user={props.isAssigned2user}
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

export default ResearchSubjectSubQuestionAnswerL2;
