import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import { WsPutResearchQuestionAnswer } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const ResearchSubjectQuestionAnswerView = (props) => {
  console.log("props_", props);
  console.log("props_longAnswer", props.qAndA?.answer?.longAnswer);

  const answerRef = useRef();
  const longAnswerRef = useRef();
  const [editorContent, setEditorContent] = useState(
    props.qAndA?.answer?.longAnswer,
  );

  function onEditorChange(content) {
    console.log("onEditorChange_Main", content);
    // setFormIsHalfFilledOut(true);
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
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          // window.location.reload();
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

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

  return (
    <div className="row ms-0 me-0">
      <div
        className="col-1"
        style={{
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.checkBoxClick != null ? (
          <input
            type="checkBox"
            onClick={processCheckBox}
            key={`qAndAQueCB` + props.qAndA.question.id}
            disabled={
              (props?.submitStatus != undefined && props?.submitStatus >= 0) ||
              props.isByResearcher == false
                ? true
                : false
            }
            readOnly={
              (props?.submitStatus != undefined && props?.submitStatus >= 0) ||
              props.isByResearcher == false
                ? true
                : false
            }
          />
        ) : null}
      </div>
      <div className="col-11">
        <FormGroup className="form-group qaView1">
          <Label
            for="inputAnswer"
            className=""
            key={`qAndAQue` + props.qAndA.question.id}
          >
            {props.qNo}. {props.qAndA.question.question}
            <span style={{ fontSize: "12px", color: "blue" }}>
              {/* {props.qAndA.question?.assignTo != null ||
              props.qAndA.question?.assignTo != undefined ? (
                <>
                  &nbsp;(Also Assigned To:{" "}
                  {props.qAndA.question?.assignTo?.name})
                </>
              ) : null} */}
            </span>
          </Label>
          {/* <h5>Answer</h5> */}
          {/*<p>{props.qAndA?.answer?.answer}</p>
          <h5>longAnswer</h5> */}
          <p
            key={`Lng` + props.qAndA.question.id}
            dangerouslySetInnerHTML={{
              __html: "&nbsp; &nbsp; " + props.qAndA?.answer?.longAnswer,
            }}
          />
          {/* <h5>conclusion</h5> */}
          {/* <br/> */}
          <p
            key={`qAndAnsCnclsnsShw` + props.qAndA.question.id}
            dangerouslySetInnerHTML={{
              __html:
                "&nbsp; &nbsp; <b>conclusion:</b> " +
                props.qAndA?.answer?.conclusion,
            }}
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default ResearchSubjectQuestionAnswerView;
