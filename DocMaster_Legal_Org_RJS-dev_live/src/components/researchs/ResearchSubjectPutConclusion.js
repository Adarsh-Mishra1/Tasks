import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { WsPutResearchConclusion } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const ResearchSubjectPutConclusion = (props) => {
  console.log("ResearchSubjectPutConclusion_props", props);

  const headingRef = useRef();
  const conclusionRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("onSubmit_answer", headingRef.current.value);
    /*Long id;
    Long subjectId;
    String heading;
    String conclusion;
    Long userId;*/

    console.log(
      "onSubmit_prams",
      JSON.stringify({
        subjectId: props.subject.id,
        heading: headingRef.current.value,
        conclusion: conclusionRef.current.value,
        userId: props.user.id,
      }),
    );

    if (
      headingRef.current?.value != undefined &&
      headingRef.current?.value.length >= 3 &&
      conclusionRef.current?.value != undefined &&
      conclusionRef.current?.value.length >= 3
    ) {
      axios
        .post(
          WsPutResearchConclusion,
          JSON.stringify({
            subjectId: props.subject.id,
            heading: headingRef.current.value,
            conclusion: conclusionRef.current.value,
            userId: props.user.id,
          }),
          {
            headers: apiKeyHeader(),
          },
        )
        .then((response) => {
          const responseData = response.data;
          if (responseData.resultCode === 1) {
            // window.location.reload();
            // props.onReturn(true, true);
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
      <Form className="row mt-4" onSubmit={onSubmitHandler} method="POST">
        <hr />
        <FormGroup className="form-group mb-3">
          <Label for="inputHeading" className="">
            Heading
          </Label>
          <Input
            type="text"
            className="form-control "
            id="inputHeading"
            aria-describedby="headingHelp"
            innerRef={headingRef}
            defaultValue={
              props.conclusion != undefined &&
              props.conclusion?.heading != undefined
                ? props.conclusion.heading
                : null
            }
            minLength={3}
            maxLength={250}
            key={`cnclsnHd` + props.subject.id}
            disabled={
              props?.submitStatus != undefined && props?.submitStatus >= 0
                ? true
                : false
            }
            readOnly={
              props?.submitStatus != undefined && props?.submitStatus >= 0
                ? true
                : false
            }
            required
          />
        </FormGroup>

        <FormGroup className="form-group mb-3">
          <Label for="inputConclusion" className="">
            Conclusion
          </Label>
          <Input
            type="textarea"
            className="form-control "
            id="inputConclusion"
            aria-describedby="conclusionHelp"
            innerRef={conclusionRef}
            // defaultValue={props.qAndA?.answer?.answer}
            defaultValue={
              props.conclusion != undefined &&
              props.conclusion?.conclusion != undefined
                ? props.conclusion.conclusion
                : null
            }
            minLength={3}
            maxLength={10000}
            rows={20}
            key={`cnclsn` + props.subject.id}
            disabled={
              props?.submitStatus != undefined && props?.submitStatus >= 0
                ? true
                : false
            }
            readOnly={
              props?.submitStatus != undefined && props?.submitStatus >= 0
                ? true
                : false
            }
            required
          />
        </FormGroup>

        <div className="text-start">
          {props?.submitStatus != undefined &&
          props?.submitStatus >= 0 ? null : (
            <Button type="submit" className="btn btn-primary">
              Save
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default ResearchSubjectPutConclusion;
