import { useEffect, useState, useRef, Suspense, lazy } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import { WsPutResearchQuestionAnswer } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

// import TinyMce from "./TinyMce";
const TinyMce = lazy(() => import("./TinyMce"));

const ResearchSubjectQuestionAnswerInputL2 = (props) => {
  console.log("props_", props);
  console.log("props_conclusion", props.qAndA?.answer?.conclusion);
  const [saveButtonColor, setSaveButtonColor] = useState("green");
  const [editorContent, setEditorContent] = useState(
    props.qAndA?.answer?.conclusion,
  );

  function onEditorChange(content) {
    console.log("onEditorChange_Main", content);
    // setFormIsHalfFilledOut(true);
    setSaveButtonColor("red");
    setEditorContent(content);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let conclusion2put = editorContent != undefined ? editorContent : null;

    console.log("onSubmit_conclusion2put", conclusion2put);
    if (conclusion2put != undefined && conclusion2put.length >= 3) {
      submitAnswer();
    } else {
      alert("Insert Conclusion");
    }
  };
  const submitAnswer = () => {
    let conclusion2put = editorContent != undefined ? editorContent : null;
    axios
      .post(
        WsPutResearchQuestionAnswer,
        JSON.stringify({
          questionId: props.qAndA.question.id,
          answer: null,
          longAnswer: null,
          conclusion: conclusion2put,
          userId: props.user.id,
          level: props.approvedLevel,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setSaveButtonColor("green");
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };
  return (
    <Suspense fallback={<>Loading...</>}>
      <Form className="row" onSubmit={onSubmitHandler} method="POST">
        <div className="col-12">
          <Label
            for="inputAnswer"
            className=""
            key={`qAndAQue` + props.qAndA.question.id}
          >
            {props.qNo}. {props.qAndA.question.question}
            <span style={{ fontSize: "12px", color: "blue" }}>
              {props.qAndA.question?.assignTo != null ||
              props.qAndA.question?.assignTo != undefined ? (
                <>
                  &nbsp;(Also Assigned To:{" "}
                  {props.qAndA.question?.assignTo?.name})
                </>
              ) : null}
            </span>
          </Label>
          <Input
            type="text"
            className="form-control "
            id="inputAnswerProvided"
            aria-describedby="answerProvidedHelp"
            // innerRef={answerRef}
            defaultValue={props.qAndA?.answer?.answer}
            minLength={3}
            maxLength={props.approvedLevel <= 0 ? 100 : 10000}
            required
            key={`qAndAnsProvided` + props.qAndA.question.id}
            disabled={true}
            readOnly={true}
            style={{ display: "none" }}
          />
        </div>
        {/* <div
          className="col-1"
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props?.submitStatus != undefined &&
          props?.submitStatus >= 0 ? null : (
            <>
              {props?.isByResearcher == true ? (
                <Button type="submit" className="btn btn-light">
                  <i
                    className="fa fa-save"
                    title="Save"
                    aria-hidden="true"
                    style={{ color: "green",fontSize:"24px" }}
                  ></i>{" "}
                </Button>
              ) : null}
            </>
          )}
        </div> */}
        <div className="col-6">
          {/* <b>Long Answer:</b> */}
          <br />
          <div
            className="longAnswerDiv"
            key={`qAndAnsShwDv` + props.qAndA.question.id}
            dangerouslySetInnerHTML={{
              __html: props.qAndA?.answer?.longAnswer,
            }}
          />
        </div>
        <div className="col-6">
          <FormGroup className="form-group">
            <b>Conclusion:</b>{" "}
            {props?.submitStatus != undefined &&
            props?.submitStatus >= 0 ? null : (
              <>
                {props?.isByResearcher == true ? (
                  <button style={{setSaveButtonColor}}
                    type="submit"
                    className="btn btn-sm btn-primary"
                     
                  >Save
                    {/* <i
                      className="fa fa-save"
                      title="Save"
                      aria-hidden="true"
                      style={{ fontSize: "24px" }}
                    ></i>  */}
                  </button>
                ) : null}
              </>
            )}
            {(props?.submitStatus != undefined && props?.submitStatus >= 0) ||
            props?.isByResearcher == false ||
            (props.isAssigned2user == true &&
              props.qAndA.question.assignTo?.id != props.user.id) ? (
              <div
                className="longAnswerDiv mt-2"
                key={`qAndAnsLngShw` + props.qAndA.question.id}
                dangerouslySetInnerHTML={{
                  __html: props.qAndA?.answer?.conclusion,
                }}
              />
            ) : (
              <TinyMce
                keyId={props.qAndA?.question.id}
                intitialContent={editorContent}
                onEditorChange={onEditorChange}
              />
            )}
          </FormGroup>
        </div>
      </Form>
    </Suspense>
  );
};

export default ResearchSubjectQuestionAnswerInputL2;
