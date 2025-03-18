import { useEffect, useState } from "react";
import axios from "axios";
import {
  WsGetUserSubjectSubQuestionAndAnswer,
  WsDeleteResearchQuestionAnswer,
  WsGetUserAssignedSubjectQuestionAndAnswer,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import ResearchSubjectQuestionAnswerInput from "./ResearchSubjectQuestionAnswerInput";

const ResearchSubjectSubQuestionAnswer = (props) => {
  const [queAndAns, setQueAndAns] = useState([]);

  useEffect(() => {
    getUserSubjectSubQuestionAndAnswer();
  }, []);

  const getUserSubjectSubQuestionAndAnswer = () => {
    const url = (props.isAssigned2user
      ? WsGetUserAssignedSubjectQuestionAndAnswer
      : WsGetUserSubjectSubQuestionAndAnswer) +
      "/" +
      props.researchSubject.id +
      "/" +
      props.user.id +
      "/" +
      (props.researchSubject.approvedLevel + 1) +
      "/" +
      props.parentQuestion.id;

    console.log("Fetching data with URL:", url);

    axios
      .get(url, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("Response Data:", responseData);
        if (responseData.resultCode === 1) {
          console.log("Setting question and answer data:", responseData.resultMessage);
          setQueAndAns(responseData.resultMessage || []);
        } else {
          console.warn("Response Error:", responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("Request Error:", error);
      });
  };

  const formatIndex = (index) => {
    // Use baseNumber prop to calculate the starting number for sub-questions
   // const base = Math.floor(index / 26);
    const letter = String.fromCharCode(97 + (index % 26));
    return `${props.baseNumber}${letter}`;
  };

  console.log("Rendering component with queAndAns:", queAndAns);

  return queAndAns.length > 0 ? (
    <div className="ml-4" key={`qAndASubQuestion${props.parentQuestion.id}_`}>
      {queAndAns.map((qAndA, index) => (
        <div key={`qAndASubQ_${qAndA.question.id}_${index}`}>
          <ResearchSubjectQuestionAnswerInput
            qAndA={qAndA}
            qNo={formatIndex(index)}
            user={props.user}
            submitStatus={props?.submitStatus}
            approvedLevel={props.researchSubject.approvedLevel}
            onEditThisQueAlert={props.onEditThisQueAlert}
            onDeleteThisQueAlert={props.onDeleteThisQueAlert}
            onAssignQuestion2UserButtonClick={props.onAssignQuestion2UserButtonClick}
            isByResearcher={props.isByResearcher}
            isAssigned2user={props.isAssigned2user}
            mainQuestionId={props.mainQuestionId}
          />
        </div>
      ))}
    </div>
  ) : null;
};

export default ResearchSubjectSubQuestionAnswer;
