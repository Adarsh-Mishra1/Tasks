//OrgResearchEditAll.js
import ResearchSubjectQuestionAnswer from "./ResearchSubjectQuestionAnswer";
import ResearchSubjectQuestionAnswerL2 from "./ResearchSubjectQuestionAnswerL2";
import ResearchSubjectPutConsolidation from "./ResearchSubjectPutConsolidation";
import ShowPrintFinalDraft from "./ShowPrintFinalDraft";

const OrgResearchEditAll = (props) => {
  console.log("OrgResearchEditAll_props", props);
  const researchSubject = {
    ...props.researchSubject,
    approvedLevel: props.approvedLevel,
  };
  console.log("OrgResearchEditAll_researchSubject", researchSubject);
  return (
    <>
      {props.approvedLevel < 2 ? (
        <>
          <ResearchSubjectQuestionAnswer
            researchSubject={researchSubject}
            user={props.userData}
            changeCount={0}
            submitStatus={props.submitStatus}
            isByResearcher={props.isByResearcher}
            isAssigned2user={false}
          />
          {/* <hr /> */}
        </>
      ) : null}

      {researchSubject.approvedLevel == 2 ? (
        <ResearchSubjectQuestionAnswerL2
          researchSubject={researchSubject}
          user={props.userData}
          changeCount={0}
          submitStatus={props.submitStatus}
          isByResearcher={props.isByResearcher}
          isAssigned2user={false}
        />
      ) : null}

      {researchSubject.approvedLevel == 3 ||
      researchSubject.approvedLevel == 4 ? (
        <>
          {/* <hr /> */}
          <ResearchSubjectPutConsolidation
            researchSubject={researchSubject}
            user={props.userData}
            submitStatus={props.submitStatus}
            isByResearcher={props.isByResearcher}
            approvedLevel={props.approvedLevel}
          />
        </>
      ) : null}

      {researchSubject.approvedLevel === 5 ? (
        <ShowPrintFinalDraft
          researchSubject={researchSubject}
          submitStatus={props.submitStatus}
          user={props.userData}
          isByResearcher={true}
        />
      ) : null}
    </>
  );
};

export default OrgResearchEditAll;
