import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import {
  AskGenereativeAI,
  WsGetResearchConclusion,
  WsGetUserSubjectQuestionAndAnswer,
  WsPutResearchConclusion,
} from "../../configs/WebService";
import CustomModal from "../customModal";
import { apiKeyHeader } from "../../configs/ApiKeys";

import TinyMce from "./TinyMce";
import ResearchSubjectQuestionAnswerView from "./ResearchSubjectQuestionAnswerView";
import ResearchSubjectSubQuestionAnswerView from "./ResearchSubjectSubQuestionAnswerView";
import DocForm2FinalDraftMerge from "./DocForm2FinalDraftMerge";
import ResearchPresetDocForm from "./ResearchPresetDocForm";
import { lang } from "moment";

const ResearchSubjectPutConsolidation = (props) => {
  console.log("ResearchSubjectPutConsolidation_props", props);
  const [saveButtonColor, setSaveButtonColor] = useState("green");
  const headingRef = useRef();

  const [queAndAns, setQueAndAns] = useState();
  const [openAIModal, setOpenAImodal] = useState(false);
  const [AImodalData, setAImodalData] = useState();
  const [loader, setLoder] = useState(false);
  // const [language, setLanguage] = useState("");
  const languages = ["English", "Hindi", "Punjabi"];

  const [defaultLanguages, setDefaultLanguages] = useState([
    "Hindi",
    "Punjabi",
  ]);

  const [consolidation, setConsolidation] = useState();
  const [consolidationEditorContent, setConsolidationEditorContent] =
    useState("");

  const [finalDraftEditorContent, setFinalDraftEditorContent] = useState();
  const [consolidationContentArray, setConsolidationContentArray] = useState(
    {}
  );

  const [showDocForm2FinalDraftMerge, setShowDocForm2FinalDraftMerge] =
    useState(false);

  function onEditorChange(content) {
    console.log("onEditorChange_Main", content);
    setSaveButtonColor("red");
    setConsolidationEditorContent(content);
  }

  function onFinalDraftEditorChange(content) {
    console.log("onFinalDraftEditorChange_Main", content);
    setSaveButtonColor("red");
    setFinalDraftEditorContent(content);
  }

  useEffect(() => {
    getUserSubjectQuestionAndAnswer();
    getResearchConclusion();
  }, []);

  const getUserSubjectQuestionAndAnswer = () => {
    axios
      .get(
        WsGetUserSubjectQuestionAndAnswer +
          "/" +
          props.researchSubject.id +
          "/" +
          props.user.id +
          "/" +
          3,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_queAndAns", responseData);
        if (responseData.resultCode == 1) {
          setQueAndAns(responseData.resultMessage);
        } else {
          // alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const getResearchConclusion = () => {
    axios
      .get(
        WsGetResearchConclusion +
          "/" +
          props.user.id +
          "/" +
          props.researchSubject.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_Conc", responseData);
        if (responseData.resultCode == 1) {
          setConsolidation(responseData.resultMessage);
          setConsolidationEditorContent(
            responseData.resultMessage.consolidation
          );

          if (props.approvedLevel == 4) {
            if (
              responseData.resultMessage.finalDraft != undefined &&
              responseData.resultMessage.finalDraft != null &&
              responseData.resultMessage.finalDraft.length > 0
            ) {
              setFinalDraftEditorContent(responseData.resultMessage.finalDraft);
            } else {
              setSaveButtonColor("red");
              setFinalDraftEditorContent(
                responseData.resultMessage.consolidation
              );
            }
          }
        } else {
          // alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let conclusion2put =
      consolidationEditorContent != undefined
        ? consolidationEditorContent
        : null;

    if (
      headingRef.current?.value != undefined &&
      headingRef.current?.value.length >= 3 &&
      conclusion2put != undefined &&
      conclusion2put.length >= 3
    ) {
      putConclusion(0, conclusion2put, null);
    } else {
      alert("Insert Heading and Conclusion");
    }
  };

  const onSubmitFinalDraftHandler = (e) => {
    e.preventDefault();
    let finalDraft2put =
      finalDraftEditorContent != undefined ? finalDraftEditorContent : null;
    console.log("onSubmit_conclusion2put", finalDraft2put);
    if (finalDraft2put != undefined && finalDraft2put.length >= 3) {
      putConclusion(1, null, finalDraft2put);
    } else {
      alert("Insert Final Draft");
    }
  };

  const putConclusion = (type, conclusion2put, finalDraft2put) => {
    /*Long id;
    Long subjectId;
    String heading;
    String consolidation;
    Long userId;*/

    console.log(
      "onSubmit_prams",
      JSON.stringify({
        subjectId: props.researchSubject.id,
        heading: type == 0 ? headingRef.current.value : consolidation?.heading,
        consolidation:
          type == 0 ? conclusion2put : consolidation?.consolidation,
        finalDraft: type == 0 ? null : finalDraft2put,
        userId: props.user.id,
        type: type,
      })
    );

    axios
      .post(
        WsPutResearchConclusion,
        JSON.stringify({
          subjectId: props.researchSubject.id,
          heading:
            type == 0 ? headingRef.current.value : consolidation?.heading,
          consolidation:
            type == 0 ? conclusion2put : consolidation?.consolidation,
          finalDraft: type == 0 ? null : finalDraft2put,
          userId: props.user.id,
          type: type,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;

        console.log("onSubmit_responseData", responseData);
        if (responseData.resultCode === 1) {
          setSaveButtonColor("green");
          // window.location.reload();
          // props.onReturn(true, true);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onCheckBoxClick = (addFlag, keyId, conclusionText) => {
    console.log("onCheckBoxClick_", addFlag, keyId, conclusionText);
    if (addFlag) {
      const combinedText = `${consolidationEditorContent}<br/>${conclusionText}`;

      setConsolidationEditorContent(combinedText);
      // setConsolidationEditorContent(
      //   consolidationEditorContent.concat(conclusionText)
      // );
    } else {
      setConsolidationEditorContent(
        consolidationEditorContent.replace(conclusionText, "")
      );
    }
    //const [consolidationContentArray, setConsolidationContentArray] = useState({});
  };

  const onDocFormDraftMergeContentReturn = (finalContent) => {
    console.log("onDocFormDraftMergeContentReturn_finalContent", finalContent);
    setShowDocForm2FinalDraftMerge(false);
    // setFinalDraftContent(finalContent);
    // setSaveButtonColor("red");
  };

  const handleAImodal = async () => {
    const transformedArray = queAndAns.map((item) => ({
      // qstnid: item.question.id,
      qstn: item.question.question.trim(),
      answer: item.answer.longAnswer,
      conclusion: item.answer.conclusion,
    }));
    const body = {
      question: "Summarize The Document?",
      content: JSON.stringify(transformedArray),
    };

    try {
      setLoder(true);
      const res = await fetch(AskGenereativeAI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 200) {
        setAImodalData(data.answer);
        setOpenAImodal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoder(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${AImodalData}`);
    alert("Text Copied to Clipboard");
    setOpenAImodal(false);
  };

  const handleTransLate = async (language) => {
    const body = {
      question: `Translate into ${language}?`,
      content: AImodalData,
    };
    try {
      setLoder(true);
      const res = await fetch(AskGenereativeAI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 200) {
        setAImodalData(data.answer);
        setDefaultLanguages(() => {
          const selectedlangIndex = languages.indexOf(language);
          if (selectedlangIndex !== -1) {
            languages.splice(selectedlangIndex, 1);
          }
          return [...languages];
        });
        setOpenAImodal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoder(false);
    }
  };

  return (
    <div className="row">
      <CustomModal
        isOpen={openAIModal}
        onClose={setOpenAImodal}
        handleCopy={handleCopy}
        handleTransLate={handleTransLate}
        defaultLanguages={defaultLanguages}
      >
        <h2>Summarized Draft</h2>
        <p>{AImodalData}</p>
      </CustomModal>
      {loader && <div className="spinner"></div>}
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
      <div className="col-12">
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
      </div>

      <div className="col-6">
        {queAndAns != undefined && queAndAns.length > 0
          ? queAndAns.map((qAndA, index) => {
              return (
                <div
                  // className="mt-2"
                  key={`qAndA` + qAndA.question.id + `_` + index + `_`}
                >
                  {" "}
                  <br />
                  <ResearchSubjectQuestionAnswerView
                    qAndA={qAndA}
                    qNo={index + 1}
                    user={props.user}
                    submitStatus={props?.submitStatus}
                    approvedLevel={props.researchSubject.approvedLevel}
                    isByResearcher={props.isByResearcher}
                    isAssigned2user={props.isAssigned2user}
                    checkBoxClick={
                      props.approvedLevel == 3 ? onCheckBoxClick : null
                    }
                  />
                  {qAndA.question.parentQuestion == null ? (
                    <ResearchSubjectSubQuestionAnswerView
                      parentQuestion={qAndA.question}
                      submitStatus={props?.submitStatus}
                      researchSubject={props.researchSubject}
                      user={props.user}
                      approvedLevel={props.researchSubject.approvedLevel}
                      isByResearcher={props.isByResearcher}
                      isAssigned2user={props.isAssigned2user}
                      checkBoxClick={
                        props.approvedLevel == 3 ? onCheckBoxClick : null
                      }
                    />
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
      <div className="col-6 ps-3">
        {props.approvedLevel == 3 ? (
          <Form className="row ms-0 me-0 mt-4" onSubmit={onSubmitHandler} method="POST">
            <FormGroup className="form-group mb-3">
              <Label for="inputHeading">Heading</Label>
              <Input
                type="text"
                className="form-control "
                id="inputHeading"
                aria-describedby="headingHelp"
                innerRef={headingRef}
                defaultValue={
                  consolidation != undefined &&
                  consolidation?.heading != undefined
                    ? consolidation.heading
                    : null
                }
                onChange={() => setSaveButtonColor("red")}
                minLength={3}
                maxLength={250}
                key={`cnclsnHd` + props.researchSubject.id}
                disabled={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false
                    ? true
                    : false
                }
                readOnly={
                  (props?.submitStatus != undefined &&
                    props?.submitStatus >= 0) ||
                  props?.isByResearcher == false
                    ? true
                    : false
                }
                required
              />
            </FormGroup>

            <FormGroup className="form-group mb-3 ms-2">
              <Label for="inputConclusion" className="">
                Consolidation
              </Label>
              {(props?.submitStatus != undefined && props?.submitStatus >= 0) ||
              props?.isByResearcher == false ? (
                <div
                  key={`ccDiv` + props.researchSubject.id}
                  dangerouslySetInnerHTML={{
                    __html: consolidation?.consolidation,
                  }}
                />
              ) : (
                <TinyMce
                  keyId={props.researchSubject.id + `ccedtr`}
                  intitialContent={consolidationEditorContent}
                  onEditorChange={onEditorChange}
                  height={600}
                />
              )}
            </FormGroup>

            <div className="text-start">
              {(props?.submitStatus != undefined && props?.submitStatus >= 0) ||
              props?.isByResearcher == false ? null : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ color: saveButtonColor }}
                  
                >
                  Save
                  {/* <i
                    className="fa fa-save"
                    title="Save"
                    aria-hidden="true"
                    style={{ fontSize: "32px" }}
                  ></i>  */}
                </button>
              )}
            </div>
          </Form>
        ) : (
          <>
            {/* <h5>Consolidation</h5> */}
            <b>{consolidation?.heading}</b>
            <div
              className="conclusionView1"
              key={`ccDiv` + props.researchSubject.id}
              dangerouslySetInnerHTML={{
                __html: consolidation?.consolidation,
              }}
            />
            {/* <hr /> */}
            <Form
              className="row mt-4"
              onSubmit={onSubmitFinalDraftHandler}
              method="POST"
            >
              <FormGroup className="form-group ms-2 mb-3">
                <Label for="inputConclusion" className="">
                  Final Draft
                </Label>
                {/* <button
                  className="btn btn-success ms-5"
                  onClick={handleAImodal}
                >
                  Auto Generate Final Draft using AI
                </button> */}
                {(props?.submitStatus != undefined &&
                  props?.submitStatus >= 0) ||
                props?.isByResearcher == false ? (
                  <div
                    key={`ccFdDiv` + props.researchSubject.id}
                    dangerouslySetInnerHTML={{
                      __html: consolidation?.finalDraft,
                    }}
                  />
                ) : (
                  <TinyMce
                    keyId={props.researchSubject.id + `ccFdedtr`}
                    intitialContent={finalDraftEditorContent}
                    onEditorChange={onFinalDraftEditorChange}
                    height={600}
                  />
                )}
              </FormGroup>

              {/* <button className="btn btn-success" onClick={handleAImodal}>
                Auto Generate Final Draft using AI
              </button> */}

              {/* <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  className="language-select"
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="">Select a Language to Translate</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
                <button
                  className="btn btn-success"
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTransLate(language)}
                >
                  Translate
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleAImodal}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Auto Generate Final Draft using AI
                </button>
              </div> */}

              <div className="text-start">
                {(props?.submitStatus != undefined &&
                  props?.submitStatus >= 0) ||
                props?.isByResearcher == false ? null : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    key="sbmtFnlDrft"
                    
                  >
                    {/* <i
                      className="fa fa-save"
                      title="Save"
                      aria-hidden="true"
                      style={{ fontSize: "32px" }}
                    ></i> */}
                    Save
                  </button>
                )}
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResearchSubjectPutConsolidation;
