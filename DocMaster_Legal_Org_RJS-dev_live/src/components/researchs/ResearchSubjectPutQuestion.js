import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { WsPutResearchQuestion } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const ResearchSubjectPutQuestion = (props) => {
  console.log("ResearchSubjectPutQuestion_props", props);

  const questionRef = useRef();
  const answerRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("onSubmit_answer", questionRef.current.value);
    /*Long id;
    Long subjectId;
    String question;    
    String answer;
    int level;
    Long userId;*/

    console.log(
      "onSubmit_prams",
      JSON.stringify({
        subjectId: props.subject.id,
        question: questionRef.current.value,
        answer:
          answerRef.current?.value != undefined
            ? answerRef.current?.value
            : null,
        level: props.subject.approvedLevel + 1,
        userId: props.user.id,
      }),
    );

    if (
      questionRef.current?.value != undefined &&
      questionRef.current?.value.length >= 3
    ) {
      axios
        .post(
          WsPutResearchQuestion,
          JSON.stringify({
            id:
              props.question != undefined && props.question?.id > 0
                ? props.question.id
                : null,
            subjectId: props.subject.id,
            question: questionRef.current.value,
            answer:
              answerRef.current?.value != undefined
                ? answerRef.current?.value
                : null,
            level: props.subject.approvedLevel + 1,
            userId: props.user.id,
            parentQuestionId:
              props.parentQuestion != undefined && props.parentQuestion?.id > 0
                ? props.parentQuestion.id
                : null,
            isByAssignedUser: props.isAssigned2user == true ? 1 : 0,
          }),
          {
            headers: apiKeyHeader(),
          },
        )
        .then((response) => {
          const responseData = response.data;
          if (responseData.resultCode === 1) {
            props.onReturn(true, true);
          } else {
            alert(responseData.resultMessage);
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  };

  return (
    <>
      <h4>{props.subject.subject}</h4>
      <b>
        {props.question != undefined && props.question?.id > 0
          ? "Update "
          : "Create "}
        Question at Level:{props.subject.approvedLevel + 1}
        {props.parentQuestion != undefined && props.parentQuestion?.id > 0 ? (
          <>
            <br />
            for Question '{props.parentQuestion.question}'
          </>
        ) : null}
      </b>
      <Form className="row mt-4" onSubmit={onSubmitHandler} method="POST">
        {/* <hr /> */}
        <FormGroup className="form-group mb-3">
          <Label for="inputQuestion" className="">
            Question
          </Label>
          <Input
            type="text"
            className="form-control "
            id="inputQuestion"
            aria-describedby="questionHelp"
            innerRef={questionRef}
            defaultValue={
              props.question != undefined &&
              props.question?.question != undefined
                ? props.question.question
                : null
            }
            minLength={3}
            maxLength={250}
            required
          />
        </FormGroup>

        {/* {props.question != undefined && props.question?.id > 0 ? null : (
          <FormGroup className="form-group mb-3">
            <Label for="inputAnswer" className="">
              Answer (*if Any)
            </Label>
            <Input
              type={props.approvedLevel <= 0 ? "text" : "textarea"}
              className="form-control "
              id="inputAnswer"
              aria-describedby="answerHelp"
              innerRef={answerRef}
              defaultValue={props.qAndA?.answer?.answer}
              minLength={3}
              maxLength={props.approvedLevel <= 0 ? 100 : 10000}
            />
          </FormGroup>
        )} */}

        <div className="text-end">
          {/* <button type="submit" className="btn btn-primary">
            Submit
          </button> */}
          <button
            type="submit"
            className="btn btn-primary"
            // onClick={() => document.querySelector("form").requestSubmit()}
          >
            Submit
          </button>
        </div>
      </Form>
    </>
  );
};

export default ResearchSubjectPutQuestion;
