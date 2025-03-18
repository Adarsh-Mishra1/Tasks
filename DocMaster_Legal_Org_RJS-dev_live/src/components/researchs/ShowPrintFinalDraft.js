//ShowPrintFinalDraft.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactToPrint from "react-to-print";
import Modal from "react-modal";
import {
  AskGenereativeAI,
  WsGetResearchConclusion,
  WsGetUserSubjectQuestionAndAnswer,
  WsPutResearchConclusion,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import TinyMce from "./TinyMce";
import DocForm2FinalDraftMerge from "./DocForm2FinalDraftMerge";
import ResearchPresetDocForm from "./ResearchPresetDocForm";
import { toast } from "react-toastify";
import ReactPrinter, { handlePrint, handlePrint1 } from "../ReactPrinter";
import {
  formatAiResponse,
  formatResearchAiResponse,
} from "../../OtherFunctions/OtherFunctions";

const ShowPrintFinalDraft = (props) => {
  const componentRef = useRef();
  const [consolidation, setConsolidation] = useState("");
  const [saveButtonColor, setSaveButtonColor] = useState("blue");
  const [finalDraftContent, setFinalDraftContent] = useState();
  const [showDocForm2FinalDraftMerge, setShowDocForm2FinalDraftMerge] =
    useState(false);
  const [enableEditFinalDraft, setEnableEditFinalDraft] = useState(false);

  const [finalDraftContentTranslated, setFinalDraftContentTranslated] =
    useState("");
  const [finalDraftAIContentTranslated, setFinalDraftAIContentTranslated] =
    useState("");
  const [finalDraftContentAI, setFinalDraftContentAI] = useState();
  const finalDraftTranslateRef = useRef("");
  const finalDraftAITranslateRef = useRef("");
  const finalDraftContentTranslatedRef = useRef("");
  const finalDraftContentAIRef = useRef("");
  const finalDraftAIContentTranslatedRef = useRef("");

  useEffect(() => {
    getResearchConclusion();
  }, []);

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
          setConsolidation(responseData.resultMessage.consolidation);
          setFinalDraftContent(responseData.resultMessage.finalDraft);
          // setFinalDraftContent(
          //   formatResearchAiResponse(responseData.resultMessage.finalDraft)
          // );
          // setFinalDraftContent(responseData.resultMessage.finalDraft);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onDocFormDraftMergeContentReturn = (finalContent) => {
    console.log("onDocFormDraftMergeContentReturn_finalContent", finalContent);
    setShowDocForm2FinalDraftMerge(false);
    setFinalDraftContent(finalContent);
    setSaveButtonColor("red");
    //DevNote: Enable Save Button Here so that this change can be submitted/stored to Database
  };

  function onFinalDraftEditorChange(content) {
    console.log("onFinalDraftEditorChange_Main", content);
    setSaveButtonColor("red");
    setFinalDraftContent(content);
  }

  const onSubmitFinalDraft = () => {
    // e.preventDefault();
    if (saveButtonColor == "green") {
      alert("No changes to save");
    } else {
      let finalDraft2put =
        finalDraftContent != undefined ? finalDraftContent : null;
      console.log("onSubmit_conclusion2put", finalDraft2put);
      if (finalDraft2put != undefined && finalDraft2put.length >= 3) {
        putConclusion(1, null, finalDraft2put);
      } else {
        alert("Insert Final Draft");
      }
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
        heading: consolidation?.heading,
        consolidation: consolidation?.consolidation,
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
          heading: consolidation?.heading,
          consolidation: consolidation?.consolidation,
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
          window.location.reload();
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  async function generateUsingAI(body) {
    const loader = toast.success("Loading...", { autoClose: false });
    try {
      const res = await fetch(AskGenereativeAI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.status === 200) {
        return data.answer;
      }
    } catch (err) {
      console.error(err);
      alert("Please try again Later.");
    } finally {
      toast.dismiss(loader);
    }
  }

  async function translateFinalDraft(e) {
    e.preventDefault();

    const body = {
      question: `Translate to ${finalDraftTranslateRef.current.value}`,
      content: JSON.stringify(componentRef?.current?.innerHTML),
    };

    const AiData = await generateUsingAI(body);
    setFinalDraftContentTranslated(formatResearchAiResponse(AiData));
    // setFinalDraftContentTranslated(AiData);
  }

  async function translateAIFinalDraft(e) {
    e.preventDefault();

    const body = {
      question: `Translate to ${finalDraftAITranslateRef.current.value}`,
      content: JSON.stringify(finalDraftContentAI),
    };

    const AiData = await generateUsingAI(body);
    setFinalDraftAIContentTranslated(formatResearchAiResponse(AiData));
    // setFinalDraftAIContentTranslated(AiData);
  }

  async function generateFinalDraftUsingAI() {
    const loader1 = toast.success("Loading...", { autoClose: false });
    await axios
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
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode == 1) {
          const transformedArray = responseData.resultMessage?.map((item) => ({
            qstn: item.question.question.trim(),
            answer: item.answer.longAnswer,
            conclusion: item.answer.conclusion,
          }));

          const body = {
            question: "Generate Summary of the Document?",
            // question:
            //   "Generate a clear, concise paragraph summary of the document without using bullet points, stars, or lists.",
            content: JSON.stringify(transformedArray),
          };
          await toast.dismiss(loader1);
          const aiData = await generateUsingAI(body);
          // setFinalDraftContentAI(aiData);
          console.log("aiData_233: ", aiData);
          setFinalDraftContentAI(formatResearchAiResponse(aiData));
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });

    // toast.dismiss();
  }

  return (
    <>
      <h6>Final Draft</h6>
      {/* <div> */}
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
            left: "5%",
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
              // org={props.user.org}
              toMerge={1}
              researchSubject={props.researchSubject}
              user={props.user}
              onContentReturn={onDocFormDraftMergeContentReturn}
              finalDraftContent={finalDraftContent}
            /> */}
          <ResearchPresetDocForm
            toMerge={1}
            researchSubject={props.researchSubject}
            user={props.user}
            onContentReturn={onDocFormDraftMergeContentReturn}
            finalDraftContent={finalDraftContent}
            toShow={!props.isByResearcher}
            isAssigned2user={props.isAssigned2user}
          />
        </div>
      </Modal>

      {/* {showDocForm2FinalDraftMerge ? null : (
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => setShowDocForm2FinalDraftMerge(true)}
        >
          <i
            style={{ fontSize: 20 }}
            className="fa fa-file"
            aria-hidden="true"
          />{" "}
          Supporting Docs
        </button>
      )} */}

      {/* </div> */}

      {enableEditFinalDraft ? (
        <>
          <button
            style={{ height: "30px" }}
            className="no_print btn btn-outline-info m-0"
            onClick={() => setEnableEditFinalDraft(false)}
          >
            <i
              style={{ fontSize: 12 }}
              className="fa fa-print"
              aria-hidden="true"
            ></i>{" "}
            Print View
          </button>
          &nbsp;
          <button
            type="submit"
            className="btn btn-sm btn-outline-primary mb-0"
            onClick={onSubmitFinalDraft}
          >
            {/* <i
              className="fa fa-save"
              title="Save"
              aria-hidden="true"
              style={{ fontSize: "12px" }}
            ></i>{" "} */}
            Save
          </button>
          <button
            style={{
              height: "30px",
              fontSize: "12px",
            }}
            type="submit"
            className="btn btn-outline-danger hover-text-white mb-0"
            onClick={() => setEnableEditFinalDraft(false)}
          >
            Close
          </button>
          <TinyMce
            keyId={props.researchSubject.id + `ccFdedtr`}
            intitialContent={finalDraftContent}
            onEditorChange={onFinalDraftEditorChange}
            height={600}
          />
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <div
                style={{
                  border: "1px solid #dee2e6",
                  padding: "10px",
                  height: "100%",
                }}
              >
                <ReactToPrint
                  documentTitle="DocMaster_TestRun_Print"
                  pageStyle={`
                    @media print {
                      @page {
                        size: A4;
                        margin: 0 50px 0 50px !important; 
                        padding:60px 0!important;
                      }
                      body {
                        -webkit-print-color-adjust: exact;
                        margin: 0;
                        padding: 0;
                       
                      }
                    }
                  `}
                  // pageStyle={
                  //   "@media print { body { -webkit-print-color-adjust: exact; } @page { size: " +
                  //   "A4; margin: 0 !important" +
                  //   Number(1) * 0.3937 +
                  //   "in " +
                  //   Number(1) * 0.3937 +
                  //   "in " +
                  //   Number(1) * 0.3937 +
                  //   "in " +
                  //   Number(1) * 0.3937 +
                  //   "in!important }}"
                  // }
                  trigger={() => {
                    return (
                      <button
                        className="no_print btn btn-outline-primary mb-0"
                        style={{ height: "30px", fontSize: "12px" }}
                      >
                        <i
                          style={{ fontSize: 12 }}
                          className="fa fa-print"
                          aria-hidden="true"
                        ></i>{" "}
                        Print
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                />

                <button
                  style={{ height: "30px", fontSize: "12px" }}
                  className="no_print btn btn-outline-primary mb-0"
                  onClick={() => setEnableEditFinalDraft(true)}
                >
                  <i
                    style={{ fontSize: 12 }}
                    className="fa fa-edit"
                    aria-hidden="true"
                  ></i>{" "}
                  Edit
                </button>
                <button
                  style={{
                    height: "30px",
                    fontSize: "12px",
                    color: saveButtonColor,
                  }}
                  type="submit"
                  className="btn btn-outline-primary mb-0"
                  onClick={onSubmitFinalDraft}
                >
                  {/* <i
                    className="fa fa-save"
                    title="Save"
                    aria-hidden="true"
                    style={{ fontSize: "12px" }}
                  ></i>{" "} */}
                  Save
                </button>
                <hr className="my-1" />
                <div
                  id="contentToPrint"
                  ref={componentRef}
                  key={`ccDiv` + props.researchSubject.id}
                  dangerouslySetInnerHTML={{
                    __html: finalDraftContent,
                  }}
                />
                <hr className="my-1" />

                <div
                  style={{
                    display: "flex",
                    // justifyContent: "space-between",

                    alignItems: "center",
                    padding: "0",
                  }}
                >
                  <label>Enter language and Translate Final Draft :</label>
                  <input
                    type="text"
                    style={{
                      width: "150px",
                      height: "30px",
                      fontSize: "12px",
                    }}
                    defaultValue="Hindi"
                    ref={finalDraftTranslateRef}
                  />
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-primary m-0"
                    style={{
                      height: "30px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                    onClick={translateFinalDraft}
                  >
                    Translate
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              {finalDraftContentTranslated?.length > 0 && (
                <>
                  {/* <ReactPrinter element={finalDraftContentTranslatedRef} /> */}
                  <div
                    style={{
                      border: "1px solid #dee2e6",
                      padding: "10px",
                      height: "100%",
                    }}
                  >
                    <div className="text-end">
                      {finalDraftContentTranslated?.length > 0 && (
                        <button
                          className="btn btn-primary mb-0"
                          style={{
                            height: "30px",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                          onClick={() => {
                            const textToCopy = document.getElementById(
                              "finalTranslatedDraftData"
                            ).innerText;
                            navigator.clipboard.writeText(textToCopy).then(
                              () => {
                                alert("Text copied to clipboard");
                              },
                              (err) => {
                                alert(
                                  "Failed to copy text, Please try again later."
                                );
                              }
                            );
                          }}
                        >
                          Copy
                        </button>
                      )}

                      {finalDraftContentTranslated?.length > 0 && (
                        <>
                          <ReactPrinter
                            element={finalDraftContentTranslatedRef}
                          />
                        </>
                      )}
                    </div>
                    <hr className="my-1" />
                    <div
                      id="finalTranslatedDraftData"
                      ref={finalDraftContentTranslatedRef}
                      dangerouslySetInnerHTML={{
                        __html: finalDraftContentTranslated,
                      }}
                    >
                      {/* {finalDraftContentTranslated} */}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <>
        <div className="row">
          <div className="col-md-12">
            <div
              style={{
                display: "flex",
                // justifyContent: "space-between",
                gap: "20px",
                alignItems: "center",
                paddingTop: "10px",
              }}
            >
              <h6 className="mb-0">Generate Final Draft Using AI: </h6>
              <span
                style={{
                  display: "flex",
                  // justifyContent: "end"
                }}
              >
                <button
                  className="btn btn-primary mb-2"
                  style={{
                    height: "30px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  onClick={generateFinalDraftUsingAI}
                >
                  Genereate
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix"></div>
        <div className="row">
          <div className="col-md-6">
            <div className="">
              {finalDraftContentAI?.length > 0 && (
                <>
                  {/* <ReactPrinter element={finalDraftContentAIRef} /> */}
                  <div style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                    <button
                      className="btn btn-primary mb-0"
                      style={{
                        height: "30px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                      onClick={() => {
                        const textToCopy =
                          document.getElementById("finalDraftDataAI").innerText;
                        navigator.clipboard.writeText(textToCopy).then(
                          () => {
                            alert("Text copied to clipboard");
                          },
                          (err) => {
                            alert(
                              "Failed to copy text, Please try again later."
                            );
                          }
                        );
                      }}
                    >
                      Copy
                    </button>

                    <ReactPrinter element={finalDraftContentAIRef} />
                    <hr className="my-1" />
                    <div
                      id="finalDraftDataAI"
                      ref={finalDraftContentAIRef}
                      dangerouslySetInnerHTML={{ __html: finalDraftContentAI }}
                    >
                      {/* {finalDraftContentAI} */}
                    </div>

                    <hr className="my-1" />
                    <div
                      style={{
                        display: "flex",

                        alignItems: "center",
                      }}
                    >
                      <label>Enter language & Translate AI Final Draft :</label>
                      <span
                        style={{
                          display: "flex",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "145px",
                            height: "30px",
                            fontSize: "12px",
                          }}
                          defaultValue="Hindi"
                          ref={finalDraftAITranslateRef}
                        />
                        &nbsp;&nbsp;
                        <button
                          className="btn btn-primary"
                          style={{
                            height: "30px",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                          onClick={translateAIFinalDraft}
                        >
                          Translate
                        </button>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-6">
            {finalDraftContentAI?.length > 0 && (
              <>
                {finalDraftAIContentTranslated?.length > 0 && (
                  <div
                    style={{
                      border: "1px solid #dee2e6",
                      padding: "10px",
                      marginBottom: "30px",
                      height: "100%",
                    }}
                  >
                    <div className="text-end">
                      <button
                        className="btn btn-primary mb-0"
                        style={{
                          height: "30px",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          const textToCopy = document.getElementById(
                            "finalTranslatedDraftDataAI"
                          ).innerText;
                          navigator.clipboard.writeText(textToCopy).then(
                            () => {
                              alert("Text copied to clipboard");
                            },
                            (err) => {
                              alert(
                                "Failed to copy text, Please try again later."
                              );
                            }
                          );
                        }}
                      >
                        Copy
                      </button>
                      <ReactPrinter
                        element={finalDraftAIContentTranslatedRef}
                      />
                    </div>
                    <hr className="my-1" />
                    <div
                      id="finalTranslatedDraftDataAI"
                      ref={finalDraftAIContentTranslatedRef}
                      dangerouslySetInnerHTML={{
                        __html: finalDraftAIContentTranslated,
                      }}
                    >
                      {/* {finalDraftAIContentTranslated} */}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default ShowPrintFinalDraft;
