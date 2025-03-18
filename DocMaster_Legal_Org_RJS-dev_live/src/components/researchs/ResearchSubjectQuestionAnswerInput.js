import { useEffect, useState, useRef, Suspense, lazy } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import { WsPutResearchQuestionAnswer } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

// import FormPrompt from "./FormPrompt";

// import TinyMce from "./TinyMce";
const TinyMce = lazy(() => import("./TinyMce"));

const ResearchSubjectQuestionAnswerInput = (props) => {
  console.log("props_", props);
  console.log("props_longAnswer", props.qAndA?.answer?.longAnswer);

  const [saveButtonColor, setSaveButtonColor] = useState("white");
  const [saveButtonBgColor, setSaveButtonBgColor] = useState("#0d6efd");

  const answerRef = useRef();
  const longAnswerRef = useRef();
  const [editorContent, setEditorContent] = useState(
    props.qAndA?.answer?.longAnswer
  );

  function onEditorChange(content) {
    console.log("onEditorChange_Main", content);
    // setFormIsHalfFilledOut(true);
    setSaveButtonColor("red");
    setSaveButtonBgColor("white")
    setEditorContent(content);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("onSubmit_answer", answerRef?.current?.value);
    console.log("onSubmit_longAnswerRef", longAnswerRef?.current?.value);
    let longAnswer2put = editorContent != undefined ? editorContent : null;

    console.log("onSubmit_longAnswer", longAnswer2put);
    if (props.approvedLevel <= 0) {
      if (
        answerRef.current?.value != undefined &&
        answerRef.current?.value.length >= 3
      ) {
        submitAnswer();
      } else {
        alert("Insert Answer");
      }
    } else {
      if (longAnswer2put != undefined && longAnswer2put.length >= 3) {
        submitAnswer();
      } else {
        alert("Insert Long Answer");
      }
    }
  };
  const submitAnswer = () => {
    /*Long questionId;
    String answer;
    Long userId;*/

    // console.log("onSubmit_prams", JSON.stringify({
    //   questionId: props.qAndA.question.id,
    //   answer: answerRef.current.value,
    //   userId: props.user.id,
    // }));

    let longAnswer2put = editorContent != undefined ? editorContent : null;
    //longAnswer: longAnswerRef.current?.value!=undefined?longAnswerRef.current.value:null,
    axios
      .post(
        WsPutResearchQuestionAnswer,
        JSON.stringify({
          questionId: props.qAndA.question.id,
          answer:
            answerRef.current?.value != undefined
              ? answerRef.current.value
              : null,
          longAnswer: longAnswer2put,
          userId: props.user.id,
          level: props.approvedLevel,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          // window.location.reload();

          setSaveButtonColor("green");
          setSaveButtonBgColor("white")
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };
  let assignedCrud =
    props.isAssigned2user == true
      ? JSON.parse(props.qAndA.question?.assignCrud)
      : { c: 1, r: 1, u: 1, d: 1 };

  const stringToPredefinedAnswerOptions = (answersString) => {
    // console.log("stringOptions_answersString",answersString)
    if (answersString != undefined) {
      return answersString.split("\n");
      // console.log("stringOptions",stringOptions)
    }
    return null;
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <Form className="row" onSubmit={onSubmitHandler} method="POST">
        <div className="col-12">
          <FormGroup className="form-group">
            <div className="d-flex justify-content-between">
              <Label
                for="inputAnswer"
                className="question align-content-end dddd"
                key={`qAndAQue` + props.qAndA.question.id}
              >
                {props.qNo}.{props.qAndA.question.question}
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
              {props?.submitStatus != undefined &&
              props?.submitStatus >= 0 ? null : (
                <>
                  {props?.isByResearcher == true ? (
                    <>
                      {/* <span
                        type="submit"
                        title="Save"
                        className="btn btn-primary"
                        style={{
                          // color: saveButtonColor,
                          display:
                            props.approvedLevel <= 0 ? "none" : "default",
                        }}
                      >Save /*}
                        {/* <i
                          className="fa fa-save"
                          title="Save"
                          aria-hidden="true"
                          style={{ fontSize: "16px" }}
                        ></i>  */}
                      {/* </span>  */}
                      <button
                       title="Save"
                       className="btn  btn-primary"
                       type="submit"
                      style={{
                        color: saveButtonColor,
                        backgroundColor:saveButtonBgColor,
                       display: props.approvedLevel <= 0 ? "none" : "inline-block",
                      }}
                      //onClick={() => document.querySelector("form").requestSubmit()}
                       >
                       Save
                      </button>


                      {props.approvedLevel <= 0 ? (
                        <>
                          <div>
                            {assignedCrud.u == 1 &&
                            props.qAndA?.question.isEditable == 1 ? (
                              <Button
                                type="button"
                                className="btn btn-light"
                                title="edit Question"
                                onClick={() =>
                                  props.onEditThisQueAlert(props.qAndA)
                                }
                              >
                                <i
                                  className="fa fa-edit"
                                  title="edit Question"
                                  style={{ color: "blue" }}
                                  aria-hidden="true"
                                ></i>
                              </Button>
                            ) : null}
                            {assignedCrud.d == 1 ? (
                              <Button
                                type="button"
                                title="Delete"
                                className="btn btn-light"
                                onClick={() =>
                                  props.onDeleteThisQueAlert(props.qAndA)
                                }
                              >
                                <i
                                  className="fa fa-trash"
                                  title="Delete"
                                  style={{ color: "red" }}
                                  aria-hidden="true"
                                ></i>
                              </Button>
                            ) : null}
                            {/* {props.qAndA.question.id} */}

                            {props.isAssigned2user == false ? (
                              <Button
                                type="button"
                                className="btn btn-light"
                                title="Assign User"
                                onClick={() =>
                                  props.onAssignQuestion2UserButtonClick(
                                    props.qAndA
                                  )
                                }
                              >
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                  style={{ color: "green" }}
                                ></i>{" "}
                                <i
                                  className="fa fa-user"
                                  aria-hidden="true"
                                  style={{ color: "green" }}
                                ></i>{" "}
                              </Button>
                            ) : null}

                            {props.qAndA.question?.parentQuestion == null &&
                            assignedCrud.c == 1 ? (
                              <Button
                                type="button"
                                className="btn btn-light"
                                title="Add Sub Question"
                                onClick={() =>
                                  props.onAddSubQuestionButtonClick(props.qAndA)
                                }
                              >
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                  style={{ color: "green" }}
                                ></i>{" "}
                                <i
                                  className="fa fa-question"
                                  aria-hidden="true"
                                  style={{ color: "green" }}
                                ></i>{" "}
                              </Button>
                            ) : (
                              <>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </>
                            )}
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </div>

            {props.approvedLevel <= 0 ? (
              <Input
                style={{ display: "none" }}
                type={props.approvedLevel <= 0 ? "text" : "textarea"}
                className="form-control "
                id="inputAnswer"
                aria-describedby="answerHelp"
                innerRef={answerRef}
                onChange={() => setSaveButtonColor("red")}
                defaultValue={props.qAndA?.answer?.answer}
                minLength={3}
                maxLength={props.approvedLevel <= 0 ? 100 : 10000}
                required
                key={`qAndAns` + props.qAndA.question.id}
                disabled={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false ||
                  (props.isAssigned2user == true &&
                    props.qAndA.question.assignTo?.id != props.user.id)
                    ? true
                    : false
                }
                readOnly={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false ||
                  (props.isAssigned2user == true &&
                    props.qAndA.question.assignTo?.id != props.user.id)
                    ? true
                    : false
                }
              />
            ) : (
              <>
                {/* LongAnswer:  */}
                {/* <p>{props.qAndA?.answer?.answer}</p> */}
                <Input
                  style={{ display: "none" }}
                  type="text"
                  className="form-control "
                  id="inputAnswerProvided"
                  aria-describedby="answerProvidedHelp"
                  defaultValue={props.qAndA?.answer?.answer}
                  minLength={3}
                  maxLength={props.approvedLevel <= 0 ? 100 : 10000}
                  required
                  key={`qAndAnsProvided` + props.qAndA.question.id}
                  disabled={true}
                  readOnly={true}
                />
                {(props?.submitStatus != undefined &&
                  props?.submitStatus >= 0) ||
                props?.isByResearcher == false ||
                (props.isAssigned2user == true &&
                  props.qAndA.question.assignTo?.id != props.user.id) ? (
                  <div
                    key={`qAndAnsShw` + props.qAndA.question.id}
                    dangerouslySetInnerHTML={{
                      __html: props.qAndA?.answer?.longAnswer,
                    }}
                  />
                ) : (
                  <>
                    {props.qAndA?.question?.answers != null ? (
                      <>
                        <br />
                        <Label for="predefinedAnswers">
                          Select Predefined Answers
                        </Label>
                        {/* {stringToPredefinedAnswerOptions(props.qAndA?.question?.answers)} */}
                        <Input
                          type="select"
                          className="form-control "
                          id="predefinedAnswers"
                          aria-describedby="predefinedAnswers"
                          onChange={(e) => onEditorChange(e.target.value)}
                          required
                        >
                          <option></option>
                          {stringToPredefinedAnswerOptions(
                            props.qAndA?.question?.answers
                          ).map((answerOption) => {
                            return (
                              <option
                                value={answerOption}
                                selected={
                                  answerOption ==
                                  props.qAndA?.answer?.longAnswer
                                    ? true
                                    : false
                                }
                              >
                                {answerOption}
                              </option>
                            );
                          })}
                        </Input>
                        {/* <TinyMce
                          keyId={props.qAndA?.question.id}
                          intitialContent={editorContent}
                          onEditorChange={onEditorChange}
                        /> */}
                      </>
                    ) : (
                      <TinyMce
                        keyId={props.qAndA?.question.id}
                        intitialContent={editorContent}
                        onEditorChange={onEditorChange}
                      />
                    )}
                  </>
                )}

                {/* <Input
                type={props.approvedLevel <= 0 ? "text" : "textarea"}
                className="form-control "
                id="inputAnswer"
                aria-describedby="answerHelp"
                innerRef={longAnswerRef}
                defaultValue={props.qAndA?.answer?.longAnswer}
                minLength={3}
                maxLength={props.approvedLevel <= 0 ? 100 : 10000}
                placeholder="Long Answer"
                key={`qAndAns` + props.qAndA.question.id}
                disabled={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false || (props.isAssigned2user==true && props.qAndA.question.assignTo?.id!=props.user.id)
                    ? true
                    : false
                }
                readOnly={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false || (props.isAssigned2user==true && props.qAndA.question.assignTo?.id!=props.user.id)
                    ? true
                    : false
                }
                required
              /> */}
              </>
            )}
          </FormGroup>
        </div>
        {/* <div
          className="col-1"
          style={{
            textAlign: "right",
            justifyContent: "right",
            alignItems: "right",
          }}
        >
          
        </div> */}
      </Form>
    </Suspense>
  );
};

export default ResearchSubjectQuestionAnswerInput;
